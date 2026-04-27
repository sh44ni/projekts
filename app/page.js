import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import ClientLogos from "./components/ClientLogos";
import ServicesSection from "./components/ServicesSection";
import CaseStudies from "./components/CaseStudies";
import WhyChooseUs from "./components/WhyChooseUs";
import PreFooter from "./components/PreFooter";
import Footer from "./components/Footer";

function Connector() {
  return (
    <div className="section-connector">
      <span className="connector-glow" />
    </div>
  );
}

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <Connector />
      <ClientLogos />
      <Connector />
      <ServicesSection />
      <Connector />
      <CaseStudies />
      <Connector />
      <WhyChooseUs />
      <PreFooter />
      <Footer />
    </main>
  );
}
