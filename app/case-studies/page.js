import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CaseStudyListContent from "./CaseStudyListContent";

export const metadata = {
  title: "Case Studies | Projekts",
  description:
    "Explore the platforms, apps, and AI systems we have built for real businesses. From booking engines to digital transformations.",
};

export default function CaseStudiesPage() {
  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section className="cs-listing-hero">
        <div className="cs-listing-hero-inner">
          <span className="cases-eyebrow">Our Work</span>
          <h1 className="cs-listing-heading">Case Studies</h1>
          <p className="cs-listing-subtitle">
            Real projects. Real businesses. Platforms we designed, built, and
            shipped from scratch.
          </p>
        </div>
      </section>

      {/* Dynamic grid */}
      <CaseStudyListContent />

      <Footer />
    </main>
  );
}
