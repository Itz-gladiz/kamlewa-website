import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackToHome from '@/components/BackToHome';
import HackTheBox from '@/components/HackTheBox';
import { div } from "framer-motion/m";
import Link from "next/dist/client/link";


export default function HackTheBoxPage() {
  return (
    <main className="relative">
      <Navbar />
      <BackToHome />
      <HackTheBox />
      <Footer />
    </main>
  );
}