import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AboutContent from "../components/AboutContent";

export const metadata = {
  title: "About Projekts Vision | Global Software Engineering & US Client Delivery",
  description:
    "Learn about Projekts Vision, our executive leadership, and how we engineer custom software, web platforms, and AI solutions for high-growth businesses across the United States.",
  alternates: {
    canonical: "https://projektsvision.com/about",
  },
  openGraph: {
    title: "About Projekts Vision | Global Engineering & US Client Delivery",
    description:
      "Executive leadership and engineering talent building scalable digital products for US and international clients.",
    url: "https://projektsvision.com/about",
    locale: "en_US",
    type: "website",
  },
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
