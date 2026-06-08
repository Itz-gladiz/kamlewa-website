import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackToHome from '@/components/BackToHome';
import Kamcyber from '@/components/Kamcyber';

export default function KamcyberPage() {
  return (
    <main className="relative">
      <Navbar />
      <BackToHome />
      <Kamcyber />
      <Footer />
    </main>
  );
}
