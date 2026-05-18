'use client';

import { useState, useRef, useEffect } from 'react';
import { HiCloudUpload, HiX, HiCheckCircle, HiDocumentText } from 'react-icons/hi';
import Image from 'next/image';
import toast from 'react-hot-toast';
import Loader from '@/components/Loader';

interface CloudinaryUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  className?: string;
  accept?: string;
  fileKind?: 'image' | 'document';
  maxSizeMb?: number;
  resourceType?: 'image' | 'raw' | 'auto';
  readyLabel?: string;
  uploadText?: string;
  helpText?: string;
  compressImages?: boolean;
  targetUploadSizeMb?: number;
  usePublicPathForOversizeDocuments?: boolean;
}

export default function CloudinaryUpload({
  value,
  onChange,
  label,
  className = '',
  accept = 'image/*',
  fileKind = 'image',
  maxSizeMb = 10,
  resourceType = 'image',
  readyLabel = 'Image Ready',
  uploadText = 'Click to upload or drag and drop',
  helpText = 'PNG, JPG, GIF up to 10MB',
  compressImages = false,
  targetUploadSizeMb = 9.5,
  usePublicPathForOversizeDocuments = false,
}: CloudinaryUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update preview when value changes externally
  useEffect(() => {
    if (value) {
      setPreview(value);
    } else {
      setPreview(null);
    }
  }, [value]);

  // Cloudinary configuration - set these in your .env.local file
  const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  const compressImage = async (file: File, targetSizeMb: number): Promise<File> => {
    const targetBytes = targetSizeMb * 1024 * 1024;

    if (file.size <= targetBytes) {
      return file;
    }

    const imageUrl = URL.createObjectURL(file);

    try {
      const image = await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new window.Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = imageUrl;
      });

      const canvas = document.createElement('canvas');
      let width = image.naturalWidth;
      let height = image.naturalHeight;
      let quality = 0.9;
      let blob: Blob | null = null;

      for (let attempt = 0; attempt < 8; attempt += 1) {
        const scale = Math.min(1, 2200 / Math.max(width, height));
        canvas.width = Math.round(width * scale);
        canvas.height = Math.round(height * scale);

        const context = canvas.getContext('2d');
        if (!context) {
          throw new Error('Could not prepare image compression');
        }

        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0, canvas.width, canvas.height);

        blob = await new Promise<Blob | null>((resolve) => {
          canvas.toBlob(resolve, 'image/jpeg', quality);
        });

        if (blob && blob.size <= targetBytes) {
          break;
        }

        quality = Math.max(0.62, quality - 0.08);
        width = Math.round(width * 0.9);
        height = Math.round(height * 0.9);
      }

      if (!blob || blob.size > targetBytes) {
        throw new Error(`Image could not be compressed below ${targetSizeMb}MB`);
      }

      const fileName = file.name.replace(/\.[^.]+$/, '.jpg');
      return new File([blob], fileName, { type: 'image/jpeg' });
    } finally {
      URL.revokeObjectURL(imageUrl);
    }
  };

  const handleFile = async (file: File) => {
    if (fileKind === 'image' && !file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (fileKind === 'document' && accept.includes('application/pdf') && file.type !== 'application/pdf') {
      toast.error('Please select a PDF file');
      return;
    }

    if (file.size > maxSizeMb * 1024 * 1024) {
      if (fileKind === 'document' && usePublicPathForOversizeDocuments) {
        const publicPath = `/${encodeURIComponent(file.name)}`;
        onChange(publicPath);
        setPreview(publicPath);
        toast.success('Large PDF linked from the public folder');
        return;
      }

      toast.error(`File size must be less than ${maxSizeMb}MB`);
      return;
    }

    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      toast.error('Cloudinary is not configured. Please set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in your environment variables.');
      return;
    }

    setUploading(true);
    let uploadFile = file;
    const shouldCompressImage =
      fileKind === 'image' && compressImages && file.size > targetUploadSizeMb * 1024 * 1024;

    if (shouldCompressImage) {
      toast.loading('Compressing image for upload...', { id: 'compress-image' });
      try {
        uploadFile = await compressImage(file, targetUploadSizeMb);
        toast.success('Image compressed for upload', { id: 'compress-image' });
      } catch (error) {
        toast.dismiss('compress-image');
        const message = error instanceof Error ? error.message : 'Unknown compression error';
        toast.error(message);
        setUploading(false);
        return;
      }
    }

    const objectUrl = URL.createObjectURL(uploadFile);
    setPreview(objectUrl);

    try {
      const formData = new FormData();
      formData.append('file', uploadFile);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      formData.append('cloud_name', CLOUDINARY_CLOUD_NAME);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const message = errorData?.error?.message || 'Upload failed';
        throw new Error(message);
      }

      const data = await response.json();
      onChange(data.secure_url);
      toast.success(fileKind === 'image' ? 'Image uploaded successfully' : 'File uploaded successfully');
      URL.revokeObjectURL(objectUrl);
    } catch (error) {
      console.error('Upload error:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to upload file: ${message}`);
      setPreview(value || null);
      URL.revokeObjectURL(objectUrl);
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await handleFile(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemove = () => {
    onChange('');
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium mb-2">{label}</label>
      )}
      
      {preview ? (
        <div className="relative w-full h-56 border-2 border-white/20 bg-white/5 rounded-lg overflow-hidden group">
          {fileKind === 'image' ? (
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
              <HiDocumentText className="h-14 w-14 text-yellow-400" />
              <p className="max-w-full truncate text-sm font-medium text-white">
                {preview}
              </p>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-3 right-3 p-2 bg-red-500/90 hover:bg-red-500 text-white transition-all rounded-full shadow-lg opacity-0 group-hover:opacity-100"
            aria-label="Remove image"
          >
            <HiX className="w-4 h-4" />
          </button>
          {!uploading && (
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/90 rounded-full text-white text-xs font-medium">
                <HiCheckCircle className="w-4 h-4" />
                {readyLabel}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-medium transition-colors"
              >
                Change
              </button>
            </div>
          )}
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
              <div className="text-center">
                <Loader size={48} className="mx-auto mb-2" />
                <p className="text-sm text-white font-medium">Uploading...</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div
          onClick={() => !uploading && fileInputRef.current?.click()}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
            dragActive
              ? 'border-yellow-400 bg-yellow-400/10 scale-[1.02]'
              : 'border-white/30 bg-white/5 hover:border-yellow-400/50 hover:bg-white/10'
          } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />
          {uploading ? (
            <>
              <Loader size={48} className="mx-auto mb-4" />
              <p className="text-sm text-yellow-400 font-medium mb-1">Uploading file...</p>
              <p className="text-xs text-gray-400">Please wait</p>
            </>
          ) : (
            <>
              <HiCloudUpload className={`w-12 h-12 mx-auto mb-4 transition-colors ${
                dragActive ? 'text-yellow-400' : 'text-gray-400'
              }`} />
              <p className={`text-sm mb-2 font-medium transition-colors ${
                dragActive ? 'text-yellow-400' : 'text-gray-300'
              }`}>
                {dragActive ? 'Drop file here' : uploadText}
              </p>
              <p className="text-xs text-gray-500">{helpText}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
