'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageBanner from '@/components/PageBanner';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import { 
  HiShieldCheck, 
  HiUsers, 
  HiAcademicCap,
  HiArrowRight,
  HiLightBulb,
  HiLocationMarker,
  HiChartBar
} from 'react-icons/hi';

export default function AboutPage() {
  const t = useTranslations('about');
  const tPage = useTranslations('about.page');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  // Pillars data array
  const pillars = [
    {
      id: 'cybersecurity',
      icon: HiShieldCheck,
      titleKey: 'pillars.cybersecurity.title',
      descriptionKey: 'pillars.cybersecurity.description',
    },
    {
      id: 'digitalInclusion',
      icon: HiUsers,
      titleKey: 'pillars.digitalInclusion.title',
      descriptionKey: 'pillars.digitalInclusion.description',
    },
    {
      id: 'knowledgeSharing',
      icon: HiAcademicCap,
      titleKey: 'pillars.knowledgeSharing.title',
      descriptionKey: 'pillars.knowledgeSharing.description',
    },
  ];

  // Future Plans data array
  const futurePlans = [
    {
      id: 'regionalHubs',
      icon: HiLocationMarker,
      titleKey: 'futurePlans.regionalHubs.title',
      descriptionKey: 'futurePlans.regionalHubs.description',
    },
    {
      id: 'nicheCommunities',
      icon: HiUsers,
      titleKey: 'futurePlans.nicheCommunities.title',
      descriptionKey: 'futurePlans.nicheCommunities.description',
    },
    {
      id: 'growthObjectives',
      icon: HiChartBar,
      titleKey: 'futurePlans.growthObjectives.title',
      descriptionKey: 'futurePlans.growthObjectives.description',
    },
  ];

  // Team Members data array
  const teamMembers = [
    {
      id: 'member1',
      imageSrc: '/images/team/member 1.jpg',
      nameKey: 'leadership.team.members.member1.name',
      roleKey: 'leadership.team.members.member1.role',
      bioKey: 'leadership.team.members.member1.bio',
    },
    {
      id: 'member2',
      imageSrc: '/images/team/member 2.jpg',
      nameKey: 'leadership.team.members.member2.name',
      roleKey: 'leadership.team.members.member2.role',
      bioKey: 'leadership.team.members.member2.bio',
    },
    {
      id: 'member3',
      imageSrc: '/images/team/member 3.jpg',
      nameKey: 'leadership.team.members.member3.name',
      roleKey: 'leadership.team.members.member3.role',
      bioKey: 'leadership.team.members.member3.bio',
    },
    {
      id: 'member4',
      imageSrc: '/images/team/member4.jpg',
      nameKey: 'leadership.team.members.member4.name',
      roleKey: 'leadership.team.members.member4.role',
      bioKey: 'leadership.team.members.member4.bio',
    },
    {
      id: 'member5',
      imageSrc: '/images/team/member 5.jpg',
      nameKey: 'leadership.team.members.member5.name',
      roleKey: 'leadership.team.members.member5.role',
      bioKey: 'leadership.team.members.member5.bio',
    },
    {
      id: 'member6',
      imageSrc: '/images/team/member 6.jpg',
      nameKey: 'leadership.team.members.member6.name',
      roleKey: 'leadership.team.members.member6.role',
      bioKey: 'leadership.team.members.member6.bio',
    },
    {
      id: 'member7',
      imageSrc: '/images/team/member 7.jpg',
      nameKey: 'leadership.team.members.member7.name',
      roleKey: 'leadership.team.members.member7.role',
      bioKey: 'leadership.team.members.member7.bio',
    },
    {
      id: 'member8',
      imageSrc: '/images/team/member 8.jpg',
      nameKey: 'leadership.team.members.member8.name',
      roleKey: 'leadership.team.members.member8.role',
      bioKey: 'leadership.team.members.member8.bio',
    },
    {
      id: 'member9',
      imageSrc: '/images/team/member 9.jpg',
      nameKey: 'leadership.team.members.member9.name',
      roleKey: 'leadership.team.members.member9.role',
      bioKey: 'leadership.team.members.member9.bio',
    },
    {
      id: 'member10',
      imageSrc: '/images/team/member 10.jpg',
      nameKey: 'leadership.team.members.member10.name',
      roleKey: 'leadership.team.members.member10.role',
      bioKey: 'leadership.team.members.member10.bio',
    },
    {
      id: 'member11',
      imageSrc: '/images/team/member 11.jpg',
      nameKey: 'leadership.team.members.member11.name',
      roleKey: 'leadership.team.members.member11.role',
      bioKey: 'leadership.team.members.member11.bio',
    },
    {
      id: 'member12',
      imageSrc: '/images/team/member 12.jpg',
      nameKey: 'leadership.team.members.member12.name',
      roleKey: 'leadership.team.members.member12.role',
      bioKey: 'leadership.team.members.member12.bio',
    },
    {
      id: 'member16',
      imageSrc: '/images/team/memeber 16.jpg',
      nameKey: 'leadership.team.members.member16.name',
      roleKey: 'leadership.team.members.member16.role',
      bioKey: 'leadership.team.members.member16.bio',
    },
    {
      id: 'member17',
      imageSrc: '/images/team/member 17.jpg',
      nameKey: 'leadership.team.members.member17.name',
      roleKey: 'leadership.team.members.member17.role',
      bioKey: 'leadership.team.members.member17.bio',
    },
    {
      id: 'member19',
      imageSrc: '/images/team/member 19.jpeg',
      nameKey: 'leadership.team.members.member19.name',
      roleKey: 'leadership.team.members.member19.role',
      bioKey: 'leadership.team.members.member19.bio',
    },
  ];

  return (
    <main className="relative">
      <Navbar />
      <PageBanner
        subheading={tPage('subheading')}
        heading={tPage('heading')}
        description={tPage('description')}
      />

      {/* Introduction Section */}
      <section className="bg-black text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            {/* Left - Mission & Vision */}
            <div>
              <motion.p
                className="tagline text-yellow-400 text-sm md:text-base font-semibold mb-5 uppercase tracking-wider relative inline-block"
                variants={itemVariants}
              >
                {tPage('introduction.heading')}
                <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-yellow-400"></span>
              </motion.p>
              
              <motion.p
                className="text-gray-300 text-base md:text-lg leading-relaxed mb-8"
                variants={itemVariants}
              >
                {tPage('introduction.description')}
              </motion.p>

              {/* Mission */}
              <motion.div className="mb-8" variants={itemVariants}>
                <h3 className="text-yellow-400 text-lg md:text-xl font-semibold mb-3">
                  {t('missionLabel')}
                </h3>
                <p className="text-gray-300 text-base md:text-lg leading-relaxed">
                  {t('mission')}
                </p>
              </motion.div>

              {/* Vision */}
              <motion.div className="mb-8" variants={itemVariants}>
                <h3 className="text-yellow-400 text-lg md:text-xl font-semibold mb-3">
                  {t('visionLabel')}
                </h3>
                <p className="text-gray-300 text-base md:text-lg leading-relaxed">
                  {t('vision')}
                </p>
              </motion.div>
            </div>

            {/* Right - Image */}
            <motion.div
              className="relative w-full h-96 md:h-[500px]"
              variants={itemVariants}
            >
              <Image
                src="/images/10.jpg"
                alt={t('imageAlt1')}
                fill
                className="object-cover"
                unoptimized
              />
              
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Operational Pillars Section */}
      <section className="bg-[#1b1b1b] text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* Section Header */}
            <motion.div className="text-left mb-12 md:mb-16" variants={itemVariants}>
              <motion.p
                className="tagline text-yellow-400 text-sm md:text-base font-semibold mb-5 uppercase tracking-wider relative inline-block"
                variants={itemVariants}
              >
                {tPage('pillars.subheading')}
                <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-yellow-400"></span>
              </motion.p>
              <motion.h2
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
                variants={itemVariants}
                style={{ fontFamily: 'var(--font-nourd), sans-serif' }}
              >
                {tPage('pillars.heading')}
              </motion.h2>
              <motion.p
                className="text-gray-300 text-base md:text-lg max-w-3xl"
                variants={itemVariants}
              >
                {tPage('pillars.description')}
              </motion.p>
            </motion.div>

            {/* Pillars Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              {pillars.map((pillar) => {
                const Icon = pillar.icon;
                return (
                  <motion.div
                    key={pillar.id}
                    className="relative h-full"
                    variants={itemVariants}
                  >
                    {/* Shadow Box */}
                    <div className="absolute inset-0 bg-white/15 translate-x-1 translate-y-1 md:translate-x-2 md:translate-y-2 lg:translate-x-3 lg:translate-y-3"></div>
                    
                    {/* Main Yellow Box */}
                    <div className="relative bg-yellow-400 text-black p-6 md:p-8 h-full flex flex-col">
                      <div className="w-16 h-16 bg-black/10 flex items-center justify-center mb-4">
                        <Icon className="w-8 h-8 text-black" />
                      </div>
                      <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: 'var(--font-nourd), sans-serif' }}>
                        {tPage(pillar.titleKey)}
                      </h3>
                      <p className="text-black/80 leading-relaxed">
                        {tPage(pillar.descriptionKey)}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="bg-black text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* Section Header */}
            <motion.div className="text-left mb-12 md:mb-16" variants={itemVariants}>
              <motion.p
                className="tagline text-yellow-400 text-sm md:text-base font-semibold mb-5 uppercase tracking-wider relative inline-block"
                variants={itemVariants}
              >
                {tPage('leadership.subheading')}
                <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-yellow-400"></span>
              </motion.p>
              <motion.h2
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
                variants={itemVariants}
                style={{ fontFamily: 'var(--font-nourd), sans-serif' }}
              >
                {tPage('leadership.heading')}
              </motion.h2>
              <motion.p
                className="text-gray-300 text-base md:text-lg max-w-3xl"
                variants={itemVariants}
              >
                {tPage('leadership.description')}
              </motion.p>
            </motion.div>

            {/* CEO Profile */}
            <motion.div
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16"
              variants={itemVariants}
            >
              {/* CEO Image */}
              <div className="relative w-full h-96 md:h-[500px] order-2 lg:order-1">
                <Image
                  src="/images/11.jpg"
                  alt={tPage('leadership.ceo.imageAlt')}
                  width={800}
                  height={500}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              </div>

              {/* CEO Info */}
              <div className="order-1 lg:order-2">
                <h3 className="text-3xl md:text-4xl font-bold mb-2" style={{ fontFamily: 'var(--font-nourd), sans-serif' }}>
                  {tPage('leadership.ceo.name')}
                </h3>
                <p className="text-yellow-400 text-lg md:text-xl font-semibold mb-6">
                  {tPage('leadership.ceo.role')}
                </p>
                <p className="text-gray-300 text-base md:text-lg leading-relaxed">
                  {tPage('leadership.ceo.bio')}
                </p>
              </div>
            </motion.div>

            {/* Core Team */}
            <motion.div variants={itemVariants}>
              <h3 className="text-2xl md:text-3xl font-bold mb-6 text-left" style={{ fontFamily: 'var(--font-nourd), sans-serif' }}>
                {tPage('leadership.team.heading')}
              </h3>
              <p className="text-gray-300 text-base md:text-lg text-left max-w-3xl leading-relaxed mb-8">
                {tPage('leadership.team.description')}
              </p>

              {/* Team Members Carousel */}
              <motion.div variants={itemVariants} className="relative overflow-hidden">
                {/* Gradient fade on edges */}
                <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-black to-transparent z-10"></div>
                <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-black to-transparent z-10"></div>

                <Swiper
                  modules={[Autoplay]}
                  spaceBetween={20}
                  slidesPerView={1}
                  autoplay={{
                    delay: 4000,
                    disableOnInteraction: false,
                  }}
                  loop={true}
                  breakpoints={{
                    640: {
                      slidesPerView: 2,
                    },
                    768: {
                      slidesPerView: 3,
                    },
                    1024: {
                      slidesPerView: 4,
                    },
                  }}
                  className="team-swiper"
                >
                  {teamMembers.map((member) => (
                    <SwiperSlide key={member.id}>
                      <motion.div
                        className="relative h-full bg-white/5 border border-white/10 overflow-hidden group hover:border-yellow-400/50 transition-all duration-300"
                        variants={itemVariants}
                      >
                        {/* Image */}
                        <div className="relative w-full h-64 overflow-hidden">
                          <Image
                            src={member.imageSrc}
                            alt={tPage(member.nameKey)}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            unoptimized
                          />
                        </div>
                        {/* Content */}
                        <div className="p-6">
                          <h4 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-nourd), sans-serif' }}>
                            {tPage(member.nameKey)}
                          </h4>
                          <p className="text-yellow-400 text-sm font-semibold mb-3">
                            {tPage(member.roleKey)}
                          </p>
                          <p className="text-gray-300 text-sm leading-relaxed">
                            {tPage(member.bioKey)}
                          </p>
                        </div>
                      </motion.div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Future Plans Section */}
      <section className="bg-[#1b1b1b] text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* Section Header */}
            <motion.div className="text-left mb-12 md:mb-16" variants={itemVariants}>
              <motion.p
                className="tagline text-yellow-400 text-sm md:text-base font-semibold mb-5 uppercase tracking-wider relative inline-block"
                variants={itemVariants}
              >
                {tPage('futurePlans.subheading')}
                <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-yellow-400"></span>
              </motion.p>
              <motion.h2
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
                variants={itemVariants}
                style={{ fontFamily: 'var(--font-nourd), sans-serif' }}
              >
                {tPage('futurePlans.heading')}
              </motion.h2>
              <motion.p
                className="text-gray-300 text-base md:text-lg max-w-3xl"
                variants={itemVariants}
              >
                {tPage('futurePlans.description')}
              </motion.p>
            </motion.div>

            {/* Future Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              {futurePlans.map((plan) => {
                const Icon = plan.icon;
                return (
                  <motion.div
                    key={plan.id}
                    className="relative h-full"
                    variants={itemVariants}
                  >
                    {/* Shadow Box */}
                    <div className="absolute inset-0 bg-white/15 translate-x-1 translate-y-1 md:translate-x-2 md:translate-y-2 lg:translate-x-3 lg:translate-y-3"></div>
                    
                    {/* Main Yellow Box */}
                    <div className="relative bg-yellow-400 text-black p-6 md:p-8 h-full flex flex-col">
                      <div className="w-16 h-16 bg-black/10 flex items-center justify-center mb-4">
                        <Icon className="w-8 h-8 text-black" />
                      </div>
                      <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: 'var(--font-nourd), sans-serif' }}>
                        {tPage(plan.titleKey)}
                      </h3>
                      <p className="text-black/80 leading-relaxed">
                        {tPage(plan.descriptionKey)}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
