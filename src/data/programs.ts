export interface Program {
  id: string;
  title: string;
  description: string;
  fullDescription?: string;
  image: string;
  duration?: string;
  participants?: string;
  locations?: string[];
  category?: string;
}

export const programsData: Program[] = [
  {
    id: '1',
    title: 'STEAM Clubs',
    description: 'Interactive clubs fostering Science, Technology, Engineering, Arts, and Mathematics skills among youth.',
    fullDescription: 'Our STEAM Clubs provide interactive learning environments where youth explore Science, Technology, Engineering, Arts, and Mathematics through hands-on projects, workshops, and collaborative activities. We foster creativity, critical thinking, and problem-solving skills essential for the digital age.',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071',
    duration: 'Ongoing',
    participants: '500+',
    locations: ['Yaoundé', 'Douala', 'Buea'],
    category: 'Education',
  },
  {
    id: '2',
    title: 'Tech Bootcamps',
    description: 'Intensive training programs covering cybersecurity, software development, and digital skills.',
    fullDescription: 'Intensive training programs designed to equip participants with practical skills in cybersecurity, software development, and digital literacy. Our bootcamps combine theoretical knowledge with real-world projects, preparing participants for careers in technology.',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070',
    duration: '2-4 Weeks',
    participants: '200+',
    locations: ['Online', 'Yaoundé', 'Douala'],
    category: 'Training',
  },
  {
    id: '3',
    title: 'Cybersafety Tours',
    description: 'Community outreach programs bringing cybersecurity awareness directly to local communities.',
    fullDescription: 'Mobile outreach programs that bring cybersecurity awareness directly to rural and underserved communities. Our tours include workshops, demonstrations, and educational sessions on digital safety, online privacy, and cyber threat prevention.',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070',
    duration: '1-2 Days',
    participants: '1000+',
    locations: ['Multiple Locations'],
    category: 'Outreach',
  },
  {
    id: '4',
    title: 'Startup Incubation',
    description: 'Supporting tech entrepreneurs with mentorship, resources, and networking opportunities.',
    fullDescription: 'Comprehensive support program for tech entrepreneurs, providing mentorship, resources, networking opportunities, and access to funding. We help startups navigate the challenges of building and scaling technology businesses in Africa.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070',
    duration: '6-12 Months',
    participants: '50+',
    locations: ['Yaoundé', 'Online'],
    category: 'Business',
  },
];

