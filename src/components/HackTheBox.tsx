'use client';

import Link from "next/link";

export default function HackTheBox() {
  return (
    <>
      {/* Button after 'use client' */}
      <div className="px-6 py-4">
        <Link href="/">
          <button className="bg-yellow-400 text-black font-bold px-6 py-2 rounded-lg hover:bg-yellow-500 transition">
            Back to Home
          </button>
        </Link>
      </div>

      <section id="hackthebox-section" className="bg-black text-white overflow-hidden">
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 px-6 md:px-10 lg:px-16 py-16 md:py-24 lg:py-32 items-center">
          {/* Left Section - Description */}
          <div className="order-2 lg:order-1 flex flex-col items-start justify-center space-y-6">
            <div className="bg-white text-black rounded-xl p-8 md:p-10 shadow-lg w-full">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-yellow-500">
                HACK THE BOX
              </h2>
              <div className="space-y-3">
                <p className="text-base md:text-lg text-gray-800 leading-relaxed font-light">
                  A community dedicated to hands-on cybersecurity training and ethical hacking skills development.
                </p>
                <p className="text-base md:text-lg text-gray-800 leading-relaxed font-light">
                  Participate in CTF competitions, lab exercises, and skill-building sessions to enhance your cybersecurity expertise.
                </p>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-3 w-full">
              <p className="text-yellow-400 font-semibold uppercase tracking-wider">Key Activities:</p>
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <span className="text-yellow-400 font-bold text-lg">•</span>
                  <span className="text-gray-300">CTF Competitions</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-yellow-400 font-bold text-lg">•</span>
                  <span className="text-gray-300">Lab Exercises</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-yellow-400 font-bold text-lg">•</span>
                  <span className="text-gray-300">Skill Building Sessions</span>
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

          {/* Right Section - Heading and Image */}
          <div className="order-1 lg:order-2 flex flex-col items-center lg:items-start space-y-8">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-center lg:text-left">
              HACK<br />THE<br />BOX
            </h1>

            {/* Image Placeholder */}
            <div className="bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 border-2 border-yellow-400 rounded-2xl p-8 md:p-12 flex items-center justify-center w-full h-80 shadow-2xl">
              <div className="text-center">
                <p className="text-gray-300 text-lg font-semibold">Hack The Box Community</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
