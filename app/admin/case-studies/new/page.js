"use client";

import CaseStudyForm from "../CaseStudyForm";

export default function NewCaseStudy() {
  return (
    <div className="adm-page">
      <h1 className="adm-page-title">New Case Study</h1>
      <p className="adm-page-subtitle">Create a new project showcase</p>
      <CaseStudyForm isEdit={false} />
    </div>
  );
}
