export interface Project {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'completed' | 'upcoming';
  image: string;
  startDate?: string;
  endDate?: string;
  progress?: number;
}

export const projectsData: Project[] = [
  {
    id: '1',
    title: 'Community Cyber Safety Initiative',
    description: 'A comprehensive program to educate rural communities about online safety and cybersecurity best practices.',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070',
    startDate: 'January 2024',
    progress: 65,
  },
  {
    id: '2',
    title: 'Youth Digital Skills Program',
    description: 'Training program designed to equip young people with essential digital literacy skills for the modern economy.',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071',
    startDate: 'March 2024',
    progress: 45,
  },
  {
    id: '3',
    title: 'Tech Hub Development',
    description: 'Establishing technology hubs in underserved communities to provide access to digital resources and training.',
    status: 'upcoming',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070',
    startDate: 'Q2 2025',
  },
  {
    id: '4',
    title: 'Cybersecurity Certification Program',
    description: 'Professional certification program for cybersecurity professionals in partnership with leading institutions.',
    status: 'completed',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070',
    startDate: 'January 2023',
    endDate: 'December 2023',
    progress: 100,
  },
];

