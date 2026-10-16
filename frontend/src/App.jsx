import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import Hero from './components/Hero.jsx';
import HowItWorks from './components/HowItWorks.jsx';
import Integrations from './components/Integrations.jsx';
import Marquee from './components/Marquee.jsx';
import Navbar from './components/Navbar.jsx';
import Security from './components/Security.jsx';
import Services from './components/Services.jsx';
import Stats from './components/Stats.jsx';

export default function App() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-black font-sans text-neutral-100 selection:bg-purple-400 selection:text-black">
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <HowItWorks />
        <Services />
        <Stats />
        <Security />
        <Integrations />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
