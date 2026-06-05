'use client';

import Link from "next/link";
import Image from "next/image"; // Next.js optimized image component

export default function KamCyberPage() {
  return (
    <section id="kamcyber-section" className="bg-black text-white overflow-hidden">
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 px-6 md:px-10 lg:px-16 py-16 md:py-24 lg:py-32 items-center">
        
        {/* Left Side - Description */}
        <div className="order-2 lg:order-1 flex flex-col items-start space-y-6">
          <div className="bg-white text-black rounded-xl p-8 md:p-10 shadow-lg w-full">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-yellow-500">
              KAMCYBER
            </h2>
            <p className="text-base md:text-lg leading-relaxed font-light">
              A dedicated cybersecurity community committed to fostering collaboration among cybersecurity professionals, ethical hackers, and individuals passionate about cyber security. Members actively share threat intelligence, conduct training workshops, and participate in cybersecurity exercises to strengthen defenses against evolving cyber threats and skill acquisition.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-3 w-full">
            <p className="text-yellow-400 font-semibold uppercase tracking-wider">Key Activities:</p>
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <span className="text-yellow-400 font-bold text-lg">•</span>
                <span className="text-gray-300">Workshops</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-yellow-400 font-bold text-lg">•</span>
                <span className="text-gray-300">Training Sessions</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-yellow-400 font-bold text-lg">•</span>
                <span className="text-gray-300">Networking Events</span>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <Link href="/join">
            <button className="bg-yellow-400 text-black font-bold px-8 py-3 rounded-lg hover:bg-yellow-500 transition duration-300 w-full lg:w-auto">
              Join Community
            </button>
          </Link>
        </div>

        {/* Right Side - Logo and Heading */}
        <div className="order-1 lg:order-2 flex flex-col items-center lg:items-start space-y-8">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-center lg:text-left">
            WHAT IS?
          </h1>

          {/* Logo Box */}
          <div className="bg-yellow-400 rounded-2xl p-8 md:p-10 w-full max-w-md flex flex-col items-center justify-center shadow-2xl">
            {/* Logo Image */}
            <Image
              src="/images/kamcyber.png"
              alt="KamCyber Logo"
              width={300}
              height={300}
              className="mx-auto"
            />
          </div>

          {/* Tagline */}
          <p className="text-xl md:text-2xl font-bold text-center lg:text-left text-yellow-400">
            Secure Together, Stronger Forever!
          </p>
        </div>
      </div>

      {/* Decorative Chevron Pattern */}
      <div className="bg-black px-6 md:px-10 lg:px-16">
        <div className="flex justify-center items-end gap-2 pb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-12 md:w-16 h-12 md:h-16 border-4 border-gray-700 rotate-45 mb-2"></div>
              <div className="w-10 md:w-14 h-10 md:h-14 bg-yellow-400 rotate-45"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Back to Home Button */}
      <div className="flex justify-center py-8">
        <Link href="/">
          <button className="bg-yellow-400 text-black font-bold px-6 py-2 rounded-lg hover:bg-yellow-500 transition">
            Back to Home
          </button>
        </Link>
      </div>
    </section>
  );
}
