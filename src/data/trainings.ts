export interface Training {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  image: string;
  instructor?: string;
  price?: string;
  format?: 'online' | 'in-person' | 'hybrid';
}

export const trainingsData: Training[] = [
  {
    id: '1',
    title: 'Introduction to Cybersecurity',
    description: 'Learn the fundamentals of cybersecurity, including threat identification and basic protection strategies.',
    duration: '4 Weeks',
    level: 'beginner',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070',
    instructor: 'Dr. John Doe',
    format: 'online',
  },
  {
    id: '2',
    title: 'Advanced Penetration Testing',
    description: 'Master advanced penetration testing techniques and ethical hacking methodologies.',
    duration: '8 Weeks',
    level: 'advanced',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071',
    instructor: 'Jane Smith',
    format: 'hybrid',
  },
  {
    id: '3',
    title: 'Digital Forensics Fundamentals',
    description: 'Introduction to digital forensics, evidence collection, and investigation techniques.',
    duration: '6 Weeks',
    level: 'intermediate',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070',
    instructor: 'Mike Johnson',
    format: 'in-person',
  },
  {
    id: '4',
    title: 'Cloud Security Essentials',
    description: 'Comprehensive training on securing cloud infrastructure and applications.',
    duration: '5 Weeks',
    level: 'intermediate',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070',
    instructor: 'Sarah Williams',
    format: 'online',
  },
  {
    id: '5',
    title: 'Network Security Administration',
    description: 'Learn to secure and manage network infrastructure effectively.',
    duration: '7 Weeks',
    level: 'intermediate',
    image: 'https://images.unsplash.com/photo-1529390079861-591de354faf5?q=80&w=2070',
    instructor: 'David Brown',
    format: 'hybrid',
  },
];

