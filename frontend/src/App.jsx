import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import Hero from './components/Hero.jsx';
import HowItWorks from './components/HowItWorks.jsx';
import Integrations from './components/Integrations.jsx';
import Navbar from './components/Navbar.jsx';
import Security from './components/Security.jsx';
import Services from './components/Services.jsx';

export default function App() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-void font-sans text-bone">
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <Services />
        <Security />
        <Integrations />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
