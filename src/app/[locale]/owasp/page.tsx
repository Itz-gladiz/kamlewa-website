import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackToHome from '@/components/BackToHome';
import Owasp from '@/components/Owasp';

export default function OwaspPage() {
  return (
    <main className="relative">
      <Navbar />
      <BackToHome />
      <Owasp />
      <Footer />
    </main>
  );
}
