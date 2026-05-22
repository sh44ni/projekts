"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

function DynamicRows({ label, items, setItems, fields }) {
  const add = () => setItems([...items, fields.reduce((a, f) => ({ ...a, [f.key]: "" }), {})]);
  const remove = (i) => setItems(items.filter((_, idx) => idx !== i));
  const update = (i, key, val) => {
    const next = [...items];
    next[i] = { ...next[i], [key]: val };
    setItems(next);
  };

  return (
    <div className="adm-form-dynamic">
      <div className="adm-form-dynamic-header">
        <span className="adm-form-label">{label}</span>
        <button type="button" onClick={add} className="adm-btn-sm">+ Add</button>
      </div>
      {items.map((item, i) => (
        <div key={i} className="adm-form-dynamic-row">
          {fields.map((f) => (
            <input
              key={f.key}
              placeholder={f.placeholder}
              value={item[f.key] || ""}
              onChange={(e) => update(i, f.key, e.target.value)}
              className="adm-input"
            />
          ))}
          <button type="button" onClick={() => remove(i)} className="adm-btn-sm danger">×</button>
        </div>
      ))}
    </div>
  );
}

function ImageUploader({ label, images, setImages, folder, multiple = true }) {
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const upload = async (e) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);

    const fd = new FormData();
    for (const f of files) fd.append("files", f);
    fd.append("folder", folder);

    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.files) {
        const urls = data.files.map((f) => f.url);
        setImages(multiple ? [...images, ...urls] : urls);
      }
    } catch (err) {
      console.error("Upload error:", err);
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const remove = (i) => setImages(images.filter((_, idx) => idx !== i));

  return (
    <div className="adm-form-uploader">
      <span className="adm-form-label">{label}</span>
      <div className="adm-form-thumbs">
        {images.map((url, i) => (
          <div key={i} className="adm-form-thumb">
            {url.match(/\.(mp4|webm|mov)$/i) ? (
              <video src={url} className="adm-form-thumb-img" />
            ) : (
              <img src={url} alt="" className="adm-form-thumb-img" />
            )}
            <button type="button" onClick={() => remove(i)} className="adm-form-thumb-x">×</button>
          </div>
        ))}
        <label className="adm-form-thumb-add">
          <input
            ref={fileRef}
            type="file"
            accept="image/*,video/*"
            multiple={multiple}
            onChange={upload}
            hidden
          />
          {uploading ? "..." : "+"}
        </label>
      </div>
    </div>
  );
}

function SectionsEditor({ sections, setSections, slug }) {
  const add = () =>
    setSections([...sections, { label: "", title: "", desc: "", images: [] }]);
  const remove = (i) => setSections(sections.filter((_, idx) => idx !== i));
  const update = (i, key, val) => {
    const next = [...sections];
    next[i] = { ...next[i], [key]: val };
    setSections(next);
  };

  return (
    <div className="adm-form-dynamic">
      <div className="adm-form-dynamic-header">
        <span className="adm-form-label">Screenshot Sections</span>
        <button type="button" onClick={add} className="adm-btn-sm">+ Add Section</button>
      </div>
      {sections.map((sec, i) => (
        <div key={i} className="adm-form-section-block">
          <div className="adm-form-section-top">
            <input placeholder="Label (e.g. Dashboard)" value={sec.label} onChange={(e) => update(i, "label", e.target.value)} className="adm-input" />
            <input placeholder="Title" value={sec.title} onChange={(e) => update(i, "title", e.target.value)} className="adm-input" />
            <button type="button" onClick={() => remove(i)} className="adm-btn-sm danger">×</button>
          </div>
          <input placeholder="Description (optional)" value={sec.desc || ""} onChange={(e) => update(i, "desc", e.target.value)} className="adm-input" style={{ marginBottom: 8 }} />
          <ImageUploader
            label="Section Images"
            images={sec.images || []}
            setImages={(imgs) => update(i, "images", imgs)}
            folder={slug || "temp"}
          />
        </div>
      ))}
    </div>
  );
}

export default function CaseStudyForm({ initial, isEdit }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Basic
  const [slug, setSlug] = useState(initial?.slug || "");
  const [client, setClient] = useState(initial?.client || "");
  const [category, setCategory] = useState(initial?.category || "");
  const [title, setTitle] = useState(initial?.title || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [published, setPublished] = useState(initial?.published || false);

  // Media
  const [coverImage, setCoverImage] = useState(initial?.coverImage ? [initial.coverImage] : []);
  const [logo, setLogo] = useState(initial?.logo ? [initial.logo] : []);
  const [gallery, setGallery] = useState(
    Array.isArray(initial?.gallery) ? initial.gallery : []
  );
  const [videoUrl, setVideoUrl] = useState(initial?.videoUrl || "");

  // Detail
  const [headline, setHeadline] = useState(initial?.headline || "");
  const [subtitle, setSubtitle] = useState(initial?.subtitle || "");
  const [metric, setMetric] = useState(initial?.metric || "");
  const [metricLabel, setMetricLabel] = useState(initial?.metricLabel || "");
  const [tags, setTags] = useState((initial?.tags || []).join(", "));
  const [tech, setTech] = useState((initial?.tech || []).join(", "));
  const [challenge, setChallenge] = useState(initial?.challenge || "");
  const [solution, setSolution] = useState(initial?.solution || "");

  // Dynamic rows
  const [stats, setStats] = useState(
    Array.isArray(initial?.stats) ? initial.stats : []
  );
  const [features, setFeatures] = useState(
    Array.isArray(initial?.features) ? initial.features : []
  );
  const [results, setResults] = useState(
    Array.isArray(initial?.results) ? initial.results : []
  );
  const [sections, setSections] = useState(
    Array.isArray(initial?.sections) ? initial.sections : []
  );

  // CTA
  const [ctaEyebrow, setCtaEyebrow] = useState(initial?.ctaEyebrow || "");
  const [ctaHeading, setCtaHeading] = useState(initial?.ctaHeading || "");
  const [ctaAccent, setCtaAccent] = useState(initial?.ctaAccent || "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const body = {
      slug: slug || undefined,
      client,
      category,
      title,
      description,
      published,
      coverImage: coverImage[0] || "",
      logo: logo[0] || "",
      gallery,
      videoUrl,
      headline,
      subtitle,
      metric,
      metricLabel,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      tech: tech.split(",").map((t) => t.trim()).filter(Boolean),
      challenge,
      solution,
      stats,
      features,
      results,
      sections,
      ctaEyebrow,
      ctaHeading,
      ctaAccent,
    };

    try {
      const url = isEdit
        ? `/api/admin/case-studies/${initial.id}`
        : "/api/admin/case-studies";
      const res = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Save failed");
        setSaving(false);
        return;
      }

      router.push("/admin/case-studies");
    } catch (err) {
      setError("Network error");
      setSaving(false);
    }
  };

  const effectiveSlug = slug || client.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  return (
    <form onSubmit={handleSubmit} className="adm-cs-form">
      {error && <div className="adm-login-error">{error}</div>}

      {/* Basic Info */}
      <fieldset className="adm-fieldset">
        <legend>Basic Info</legend>
        <div className="adm-form-row">
          <label className="adm-form-group">
            <span className="adm-form-label">Client Name *</span>
            <input value={client} onChange={(e) => setClient(e.target.value)} className="adm-input" required />
          </label>
          <label className="adm-form-group">
            <span className="adm-form-label">Slug</span>
            <input value={slug} onChange={(e) => setSlug(e.target.value)} className="adm-input" placeholder={effectiveSlug || "auto-generated"} />
          </label>
        </div>
        <div className="adm-form-row">
          <label className="adm-form-group">
            <span className="adm-form-label">Category *</span>
            <input value={category} onChange={(e) => setCategory(e.target.value)} className="adm-input" required />
          </label>
          <label className="adm-form-group">
            <span className="adm-form-label">Card Title *</span>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="adm-input" required />
          </label>
        </div>
        <label className="adm-form-group">
          <span className="adm-form-label">Short Description</span>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="adm-input adm-textarea" rows={2} />
        </label>
        <div className="adm-form-row">
          <label className="adm-form-group">
            <span className="adm-form-label">Key Metric</span>
            <input value={metric} onChange={(e) => setMetric(e.target.value)} className="adm-input" placeholder="+180%" />
          </label>
          <label className="adm-form-group">
            <span className="adm-form-label">Metric Label</span>
            <input value={metricLabel} onChange={(e) => setMetricLabel(e.target.value)} className="adm-input" placeholder="Online Bookings" />
          </label>
        </div>
        <div className="adm-form-row">
          <label className="adm-form-group">
            <span className="adm-form-label">Tags (comma-separated)</span>
            <input value={tags} onChange={(e) => setTags(e.target.value)} className="adm-input" placeholder="Next.js, Node.js, AI" />
          </label>
          <label className="adm-form-group">
            <span className="adm-form-label">Tech Stack (comma-separated)</span>
            <input value={tech} onChange={(e) => setTech(e.target.value)} className="adm-input" placeholder="Next.js, Node.js, PostgreSQL" />
          </label>
        </div>
      </fieldset>

      {/* Media */}
      <fieldset className="adm-fieldset">
        <legend>Media</legend>
        <ImageUploader label="Client Logo" images={logo} setImages={setLogo} folder={effectiveSlug} multiple={false} />
        <ImageUploader label="Cover Image" images={coverImage} setImages={setCoverImage} folder={effectiveSlug} multiple={false} />
        <ImageUploader label="Gallery Images" images={gallery} setImages={setGallery} folder={effectiveSlug} />
        <label className="adm-form-group">
          <span className="adm-form-label">Video URL (YouTube, Vimeo, or direct .mp4)</span>
          <input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} className="adm-input" placeholder="https://youtube.com/watch?v=..." />
        </label>
      </fieldset>

      {/* Detail Page */}
      <fieldset className="adm-fieldset">
        <legend>Detail Page</legend>
        <label className="adm-form-group">
          <span className="adm-form-label">Headline</span>
          <input value={headline} onChange={(e) => setHeadline(e.target.value)} className="adm-input" />
        </label>
        <label className="adm-form-group">
          <span className="adm-form-label">Subtitle</span>
          <textarea value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className="adm-input adm-textarea" rows={2} />
        </label>
        <label className="adm-form-group">
          <span className="adm-form-label">The Challenge</span>
          <textarea value={challenge} onChange={(e) => setChallenge(e.target.value)} className="adm-input adm-textarea" rows={3} />
        </label>
        <label className="adm-form-group">
          <span className="adm-form-label">Our Solution</span>
          <textarea value={solution} onChange={(e) => setSolution(e.target.value)} className="adm-input adm-textarea" rows={3} />
        </label>
      </fieldset>

      {/* Stats */}
      <fieldset className="adm-fieldset">
        <legend>Stats & Features</legend>
        <DynamicRows
          label="Stats"
          items={stats}
          setItems={setStats}
          fields={[
            { key: "value", placeholder: "Value (e.g. +180%)" },
            { key: "label", placeholder: "Label (e.g. Online Bookings)" },
          ]}
        />
        <DynamicRows
          label="Features"
          items={features}
          setItems={setFeatures}
          fields={[
            { key: "title", placeholder: "Feature title" },
            { key: "desc", placeholder: "Short description" },
          ]}
        />
        <DynamicRows
          label="Results"
          items={results}
          setItems={setResults}
          fields={[
            { key: "title", placeholder: "Result title" },
            { key: "desc", placeholder: "Short description" },
          ]}
        />
      </fieldset>

      {/* Screenshot Sections */}
      <fieldset className="adm-fieldset">
        <legend>Screenshot Sections</legend>
        <SectionsEditor sections={sections} setSections={setSections} slug={effectiveSlug} />
      </fieldset>

      {/* CTA */}
      <fieldset className="adm-fieldset">
        <legend>CTA (Optional)</legend>
        <div className="adm-form-row">
          <label className="adm-form-group">
            <span className="adm-form-label">Eyebrow</span>
            <input value={ctaEyebrow} onChange={(e) => setCtaEyebrow(e.target.value)} className="adm-input" placeholder="Ready to start?" />
          </label>
          <label className="adm-form-group">
            <span className="adm-form-label">Heading</span>
            <input value={ctaHeading} onChange={(e) => setCtaHeading(e.target.value)} className="adm-input" placeholder="Let's Build Your" />
          </label>
          <label className="adm-form-group">
            <span className="adm-form-label">Accent</span>
            <input value={ctaAccent} onChange={(e) => setCtaAccent(e.target.value)} className="adm-input" placeholder="Platform." />
          </label>
        </div>
      </fieldset>

      {/* Actions */}
      <div className="adm-form-actions">
        <label className="adm-form-toggle">
          <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
          <span>Published</span>
        </label>
        <div className="adm-form-actions-right">
          <button type="button" onClick={() => router.push("/admin/case-studies")} className="adm-btn-outline">
            Cancel
          </button>
          <button type="submit" disabled={saving} className="adm-btn-primary">
            {saving ? "Saving..." : isEdit ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </form>
  );
}
