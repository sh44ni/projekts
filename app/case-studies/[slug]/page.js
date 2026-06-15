"use client";

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import CaseStudyLayout from "../../components/CaseStudyLayout";
import { getCaseStudyImages } from "@/lib/caseStudyImages";

export default function CaseStudyDetailPage() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`/api/case-studies/${slug}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then((data) => {
        // Map DB field names to CaseStudyLayout expected props
        setProject({
          ...data,
          headline: data.headline || data.title,
          subtitle: data.subtitle || data.description,
          screenshotSections: Array.isArray(data.sections) ? data.sections : [],
          gallery: getCaseStudyImages(data),
          stats: Array.isArray(data.stats) ? data.stats : [],
          features: Array.isArray(data.features) ? data.features : [],
          results: Array.isArray(data.results) ? data.results : [],
          tech: Array.isArray(data.tech) ? data.tech : [],
        });
      })
      .catch(() => setError(true));
  }, [slug]);

  if (error) {
    return (
      <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a0a" }}>
        <div style={{ textAlign: "center" }}>
          <h1 style={{ color: "#fff", fontSize: 28, marginBottom: 8 }}>Not Found</h1>
          <p style={{ color: "#888" }}>This case study doesn&apos;t exist.</p>
          <a href="/case-studies" style={{ color: "#fff", marginTop: 16, display: "inline-block" }}>← Back to Case Studies</a>
        </div>
      </main>
    );
  }

  if (!project) {
    return (
      <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a0a" }}>
        <div style={{ width: 32, height: 32, border: "2px solid rgba(255,255,255,0.1)", borderTopColor: "#fff", borderRadius: "50%", animation: "admSpin 0.8s linear infinite" }} />
      </main>
    );
  }

  return <CaseStudyLayout project={project} />;
}
