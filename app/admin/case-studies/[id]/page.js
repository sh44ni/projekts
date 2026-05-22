"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CaseStudyForm from "../CaseStudyForm";

export default function EditCaseStudy() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/admin/case-studies/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then(setData)
      .catch(() => setError("Case study not found"));
  }, [id]);

  if (error) {
    return (
      <div className="adm-page">
        <h1 className="adm-page-title">Error</h1>
        <p className="adm-page-subtitle">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="adm-page">
        <h1 className="adm-page-title">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="adm-page">
      <h1 className="adm-page-title">Edit: {data.client}</h1>
      <p className="adm-page-subtitle">/{data.slug}</p>
      <CaseStudyForm initial={data} isEdit={true} />
    </div>
  );
}
