import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AboutContent from "../components/AboutContent";

export const metadata = {
  title: "About Projekts — Our Team, Story & Global Reach",
  description:
    "Projekts is a digital agency based in Pakistan and Oman, delivering custom web, app, and AI solutions to clients across the US, Switzerland, Oman, and Pakistan.",
};

export default function AboutPage() {
  return (
    <main>
      <Navbar />
      <AboutContent />
      <Footer />
    </main>
  );
}
