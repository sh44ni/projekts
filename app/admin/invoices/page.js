"use client";

import { useState, useEffect } from "react";

const CURRENCIES = [
  { label: "USD ($)", symbol: "$" },
  { label: "PKR (₨)", symbol: "₨" },
  { label: "EUR (€)", symbol: "€" },
  { label: "GBP (£)", symbol: "£" },
  { label: "OMR (ر.ع.)", symbol: "ر.ع. " },
  { label: "AED (AED)", symbol: "AED " },
];

const PRESETS = [
  {
    name: "Riseup Web & SEO Package",
    description: "Initial payment (Riseup website, CRM SEO and other development)",
    amount: "2000",
  },
  {
    name: "Full Stack Custom Platform",
    description: "Custom web platform architecture, cloud deployment, and API integrations",
    amount: "4500",
  },
  {
    name: "AI Solution & Dashboard",
    description: "AI-powered automated workflow system & enterprise reporting dashboard",
    amount: "3500",
  },
  {
    name: "Monthly Retainer / Maintenance",
    description: "Monthly infrastructure maintenance, security patching, SEO & support",
    amount: "1200",
  },
];

const RECENT_CLIENTS = [
  {
    name: "Rise Up Roofing And Construction",
    address: "2182 S El Camino Real, Oceanside, CA 92054, United States",
  },
  {
    name: "Alpha Enterprise Systems",
    address: "1209 Orange St, Wilmington, DE 19801, United States",
  },
  {
    name: "Horizon Global Logistics",
    address: "Bahnhofstrasse 45, 8001 Zurich, Switzerland",
  },
];

export default function InvoicesPage() {
  const [form, setForm] = useState({
    client_name: "Rise Up Roofing And Construction",
    client_address: "2182 S El Camino Real, Oceanside, CA 92054, United States",
    invoice_id: "PRJK092",
    date: "6 Sep 2026",
    due_date: "",
    currency: "$",
    payment_method: "Check",
    check_no: "48291",
    payment_details: "",
    paid: true,
    show_seal: true,
    items: [
      {
        description: "Initial payment (Riseup website, CRM SEO and other development)",
        amount: "2000",
      },
    ],
  });

  const [loading, setLoading] = useState(false);
  const [savingDb, setSavingDb] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [dbInvoices, setDbInvoices] = useState([]);
  const [userRole, setUserRole] = useState("member");
  const [viewMode, setViewMode] = useState("my"); // "my" or "all"
  const [mobileTab, setMobileTab] = useState("builder"); // "builder" or "preview"

  // Fetch DB invoices
  const fetchDbInvoices = async (mode = "my") => {
    try {
      const res = await fetch(`/api/admin/invoices?view=${mode}`);
      if (res.ok) {
        const data = await res.json();
        setDbInvoices(data.invoices || []);
        if (data.userRole) setUserRole(data.userRole);
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchDbInvoices(viewMode);
  }, [viewMode]);

  // Load recent invoices from localStorage as fallback
  useEffect(() => {
    try {
      const saved = localStorage.getItem("pv_recent_invoices");
      if (saved) setRecentInvoices(JSON.parse(saved));
    } catch (e) {}
  }, []);

  const totalAmount = form.items
    .reduce((sum, item) => {
      const cleanVal = String(item.amount || "").replace(/[^0-9.]/g, "");
      return sum + (parseFloat(cleanVal) || 0);
    }, 0)
    .toLocaleString("en-US", { minimumFractionDigits: 0 });

  const saveToRecent = (inv) => {
    try {
      const updated = [
        {
          id: inv.invoice_id,
          client: inv.client_name,
          amount: `${inv.currency}${totalAmount}`,
          date: inv.date,
          paid: inv.paid,
          timestamp: new Date().toISOString(),
          data: inv,
        },
        ...recentInvoices.filter((i) => i.id !== inv.invoice_id),
      ].slice(0, 10);
      setRecentInvoices(updated);
      localStorage.setItem("pv_recent_invoices", JSON.stringify(updated));
    } catch (e) {}
  };

  const saveInvoiceToCloud = async (overrideData) => {
    const target = overrideData || form;
    setSavingDb(true);
    try {
      const cleanTotal = target.items.reduce((sum, item) => {
        const cleanVal = String(item.amount || "").replace(/[^0-9.]/g, "");
        return sum + (parseFloat(cleanVal) || 0);
      }, 0);

      const res = await fetch("/api/admin/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoice_id: target.invoice_id,
          client_name: target.client_name,
          client_address: target.client_address,
          date: target.date,
          due_date: target.due_date,
          currency: target.currency,
          payment_method: target.payment_method,
          check_no: target.check_no,
          payment_details: target.payment_details,
          paid: target.paid,
          show_seal: target.show_seal,
          items: target.items,
          totalAmount: cleanTotal,
        }),
      });
      if (res.ok) {
        setSuccess(`Invoice ${target.invoice_id} saved to your cloud workspace!`);
        fetchDbInvoices(viewMode);
        setTimeout(() => setSuccess(""), 4000);
      }
    } catch (e) {
      console.error("Cloud save failed:", e);
    } finally {
      setSavingDb(false);
    }
  };

  const togglePaidStatus = async (inv) => {
    try {
      const res = await fetch(`/api/admin/invoices/${inv.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paid: !inv.paid }),
      });
      if (res.ok) {
        fetchDbInvoices(viewMode);
      }
    } catch (e) {}
  };

  const deleteInvoice = async (inv) => {
    if (!confirm(`Are you sure you want to delete invoice ${inv.invoice_id}?`)) return;
    try {
      const res = await fetch(`/api/admin/invoices/${inv.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setSuccess(`Invoice ${inv.invoice_id} removed`);
        fetchDbInvoices(viewMode);
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (e) {}
  };

  const loadRecent = (inv) => {
    if (inv.data) {
      setForm(inv.data);
      setSuccess(`Loaded invoice ${inv.id || inv.invoice_id}`);
      setTimeout(() => setSuccess(""), 3000);
    } else if (inv.invoice_id) {
      setForm({
        client_name: inv.client_name,
        client_address: inv.client_address || "",
        invoice_id: inv.invoice_id,
        date: inv.date,
        due_date: inv.due_date || "",
        currency: inv.currency || "$",
        payment_method: inv.payment_method || "Check",
        check_no: inv.check_no || "",
        payment_details: inv.payment_details || "",
        paid: inv.paid,
        show_seal: inv.show_seal ?? true,
        items: Array.isArray(inv.items) ? inv.items : [{ description: "Service", amount: "1000" }],
      });
      setSuccess(`Loaded invoice ${inv.invoice_id}`);
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  const autoGenerateId = () => {
    const randomNum = Math.floor(100 + Math.random() * 900);
    setForm((f) => ({ ...f, invoice_id: `PRJK${randomNum}` }));
  };

  const addItem = () => {
    setForm((f) => ({
      ...f,
      items: [...f.items, { description: "", amount: "" }],
    }));
  };

  const removeItem = (idx) => {
    if (form.items.length <= 1) return;
    setForm((f) => ({
      ...f,
      items: f.items.filter((_, i) => i !== idx),
    }));
  };

  const updateItem = (idx, field, value) => {
    setForm((f) => ({
      ...f,
      items: f.items.map((item, i) => (i === idx ? { ...item, [field]: value } : item)),
    }));
  };

  const applyPreset = (preset) => {
    if (form.items.length === 1 && !form.items[0].description && !form.items[0].amount) {
      setForm((f) => ({
        ...f,
        items: [{ description: preset.description, amount: preset.amount }],
      }));
    } else {
      setForm((f) => ({
        ...f,
        items: [...f.items, { description: preset.description, amount: preset.amount }],
      }));
    }
  };

  const applyClient = (client) => {
    setForm((f) => ({
      ...f,
      client_name: client.name,
      client_address: client.address,
    }));
  };

  const resetForm = () => {
    setForm({
      client_name: "",
      client_address: "",
      invoice_id: `PRJK${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      due_date: "",
      currency: "$",
      payment_method: "Bank Transfer",
      check_no: "",
      payment_details: "",
      paid: false,
      show_seal: true,
      items: [{ description: "", amount: "" }],
    });
    setSuccess("Form reset for new invoice");
    setTimeout(() => setSuccess(""), 3000);
  };

  const generatePDF = async () => {
    if (!form.client_name.trim()) {
      setError("Please specify the Client Name.");
      return;
    }
    if (!form.invoice_id.trim()) {
      setError("Please specify an Invoice ID.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const formattedItems = form.items.map((item) => {
        const cleanVal = String(item.amount || "").replace(/[^0-9.]/g, "");
        const num = parseFloat(cleanVal) || 0;
        return {
          description: item.description || "Service",
          amount: num.toLocaleString("en-US"),
        };
      });

      const payloadData = {
        client_name: form.client_name,
        client_address: form.client_address,
        invoice_id: form.invoice_id,
        date: form.date,
        due_date: form.due_date,
        currency: form.currency,
        items: formattedItems,
        total_amount: totalAmount,
        payment_method: form.payment_method,
        check_no: form.payment_method === "Cash" ? "" : form.check_no,
        payment_details: form.payment_details,
        paid: form.paid,
        show_seal: form.show_seal,
      };

      const res = await fetch("https://pdfapi.projektsvision.com/v1/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer pdfk_baiiaC4w2CVBm2QVjmC2weiEn1RNLGfwo630I81FeDI",
        },
        body: JSON.stringify({
          template: "projekts-invoice",
          data: payloadData,
          options: {
            format: "A4",
            landscape: false,
            print_background: true,
            margin: {
              top: "0mm",
              bottom: "0mm",
              left: "0mm",
              right: "0mm",
            },
          },
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.detail || `Server error: HTTP ${res.status}`);
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Invoice-${form.invoice_id}-${form.client_name.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      saveToRecent(form);
      saveInvoiceToCloud(form);
      setSuccess(`Invoice ${form.invoice_id} generated & downloaded successfully!`);
    } catch (e) {
      setError(e.message || "Failed to generate PDF");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="adm-page" style={{ maxWidth: 1440, margin: "0 auto" }}>
      {/* Sticky Studio Header */}
      <div
        style={{
          background: "linear-gradient(180deg, rgba(26, 26, 30, 0.95), rgba(17, 17, 19, 0.95))",
          border: "1px solid var(--adm-line-2)",
          borderRadius: 16,
          padding: "20px 24px",
          marginBottom: 24,
          backdropFilter: "blur(20px)",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.4)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
              <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: "var(--adm-text)" }}>
                Executive Invoice Studio
              </h1>
              <span
                style={{
                  fontSize: 11,
                  fontFamily: "monospace",
                  padding: "4px 10px",
                  borderRadius: 6,
                  background: "rgba(197, 168, 128, 0.15)",
                  color: "#dfc19b",
                  border: "1px solid rgba(197, 168, 128, 0.3)",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                }}
              >
                {form.invoice_id}
              </span>
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, paid: !f.paid }))}
                style={{
                  background: form.paid ? "rgba(74, 222, 128, 0.15)" : "rgba(234, 179, 8, 0.15)",
                  border: `1px solid ${form.paid ? "rgba(74, 222, 128, 0.35)" : "rgba(234, 179, 8, 0.35)"}`,
                  color: form.paid ? "#4ade80" : "#eab308",
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "4px 10px",
                  borderRadius: 6,
                  cursor: "pointer",
                  letterSpacing: "0.05em",
                }}
                title="Click to toggle Paid/Pending"
              >
                {form.paid ? "PAID ✓" : "PENDING ⏳"}
              </button>
            </div>
            <p style={{ margin: 0, fontSize: 13, color: "var(--adm-text-3)" }}>
              Create, manage, and download client invoices · Real-time preview
            </p>
          </div>

          {/* Action Controls */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <div
              style={{
                padding: "8px 16px",
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid var(--adm-line-2)",
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span style={{ fontSize: 11, color: "var(--adm-text-3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Total:
              </span>
              <span style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>
                {form.currency}{totalAmount}
              </span>
            </div>

            <button
              type="button"
              onClick={() => saveInvoiceToCloud(form)}
              disabled={savingDb}
              style={{
                background: "linear-gradient(135deg, rgba(197, 168, 128, 0.15), rgba(223, 193, 155, 0.15))",
                border: "1px solid rgba(197, 168, 128, 0.4)",
                color: "#dfc19b",
                padding: "10px 18px",
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span>☁</span>
              <span>{savingDb ? "Saving..." : "Save Invoice"}</span>
            </button>

            <button
              type="button"
              onClick={generatePDF}
              disabled={loading || !form.client_name || !form.invoice_id}
              style={{
                background: loading ? "#444" : "linear-gradient(135deg, #c5a880 0%, #dfc19b 100%)",
                color: "#07090e",
                border: "none",
                padding: "10px 22px",
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
                boxShadow: "0 4px 18px rgba(197, 168, 128, 0.3)",
              }}
            >
              <span>📄</span>
              <span>{loading ? "Rendering..." : "Download PDF Invoice"}</span>
            </button>

            <button
              type="button"
              onClick={resetForm}
              style={{
                background: "var(--adm-surface-2)",
                border: "1px solid var(--adm-line-2)",
                color: "var(--adm-text-2)",
                padding: "10px 14px",
                borderRadius: 10,
                fontSize: 13,
                cursor: "pointer",
              }}
              title="Reset to blank invoice"
            >
              ⟲ Reset
            </button>
          </div>
        </div>

        {/* Responsive Tab Toggle for smaller screens */}
        <div style={{ display: "none", marginTop: 16 }} className="adm-mobile-tabs">
          <div style={{ display: "flex", background: "var(--adm-surface)", padding: 4, borderRadius: 8 }}>
            <button
              type="button"
              onClick={() => setMobileTab("builder")}
              style={{
                flex: 1,
                padding: "8px",
                borderRadius: 6,
                border: "none",
                background: mobileTab === "builder" ? "rgba(197, 168, 128, 0.2)" : "transparent",
                color: mobileTab === "builder" ? "#dfc19b" : "#888",
                fontWeight: 600,
                fontSize: 12,
              }}
            >
              Builder Studio
            </button>
            <button
              type="button"
              onClick={() => setMobileTab("preview")}
              style={{
                flex: 1,
                padding: "8px",
                borderRadius: 6,
                border: "none",
                background: mobileTab === "preview" ? "rgba(197, 168, 128, 0.2)" : "transparent",
                color: mobileTab === "preview" ? "#dfc19b" : "#888",
                fontWeight: 600,
                fontSize: 12,
              }}
            >
              Live Letterhead Preview
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div
          style={{
            background: "rgba(239, 68, 68, 0.12)",
            border: "1px solid rgba(239, 68, 68, 0.35)",
            color: "#f87171",
            padding: "14px 20px",
            borderRadius: 12,
            marginBottom: 24,
            fontSize: 13,
          }}
        >
          <strong>Error:</strong> {error}
        </div>
      )}

      {success && (
        <div
          style={{
            background: "rgba(74, 222, 128, 0.12)",
            border: "1px solid rgba(74, 222, 128, 0.35)",
            color: "#86efac",
            padding: "14px 20px",
            borderRadius: 12,
            marginBottom: 24,
            fontSize: 13,
          }}
        >
          {success}
        </div>
      )}

      {/* Main Two-Pane Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.15fr 0.85fr",
          gap: 28,
          marginBottom: 36,
          alignItems: "start",
        }}
      >
        {/* ================= LEFT COLUMN: BUILDER STUDIO ================= */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Card 1: Client & Recipient */}
          <div
            style={{
              background: "linear-gradient(180deg, rgba(26, 26, 30, 0.85), rgba(17, 17, 19, 0.9))",
              border: "1px solid var(--adm-line-2)",
              borderRadius: 16,
              padding: 24,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h3 style={sectionHeading}>1. Client & Recipient Information</h3>
              <span style={{ fontSize: 11, color: "var(--adm-text-3)" }}>Quick-Select Client:</span>
            </div>

            {/* Quick Clients Pills */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
              {RECENT_CLIENTS.map((c, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => applyClient(c)}
                  style={{
                    background: form.client_name === c.name ? "rgba(197, 168, 128, 0.18)" : "var(--adm-surface)",
                    border: form.client_name === c.name ? "1px solid #dfc19b" : "1px solid var(--adm-line-2)",
                    color: form.client_name === c.name ? "#dfc19b" : "var(--adm-text-2)",
                    padding: "5px 12px",
                    borderRadius: 8,
                    fontSize: 11,
                    cursor: "pointer",
                    transition: "all .15s",
                  }}
                >
                  {c.name.split(" ")[0]} ({c.address.split(",")[1]?.trim() || "USA"})
                </button>
              ))}
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Client / Company Name</label>
              <input
                style={inputStyle}
                placeholder="e.g. Rise Up Roofing And Construction"
                value={form.client_name}
                onChange={(e) => setForm((f) => ({ ...f, client_name: e.target.value }))}
                required
              />
            </div>

            <div>
              <label style={labelStyle}>Billing Address</label>
              <textarea
                style={{ ...inputStyle, minHeight: 74, resize: "vertical" }}
                placeholder="2182 S El Camino Real, Oceanside, CA 92054, United States"
                value={form.client_address}
                onChange={(e) => setForm((f) => ({ ...f, client_address: e.target.value }))}
              />
            </div>
          </div>

          {/* Card 2: Document Metadata */}
          <div
            style={{
              background: "linear-gradient(180deg, rgba(26, 26, 30, 0.85), rgba(17, 17, 19, 0.9))",
              border: "1px solid var(--adm-line-2)",
              borderRadius: 16,
              padding: 24,
            }}
          >
            <h3 style={sectionHeading}>2. Invoice Metadata & Currency</h3>

            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr 1fr", gap: 14, alignItems: "end" }}>
              <div>
                <label style={labelStyle}>Invoice ID</label>
                <div style={{ display: "flex", gap: 6 }}>
                  <input
                    style={{ ...inputStyle, fontFamily: "monospace", fontWeight: 600 }}
                    placeholder="PRJK092"
                    value={form.invoice_id}
                    onChange={(e) => setForm((f) => ({ ...f, invoice_id: e.target.value }))}
                    required
                  />
                  <button
                    type="button"
                    onClick={autoGenerateId}
                    style={{
                      background: "var(--adm-surface-2)",
                      border: "1px solid var(--adm-line-2)",
                      color: "#dfc19b",
                      padding: "0 12px",
                      borderRadius: 8,
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                    title="Generate new invoice number"
                  >
                    Auto
                  </button>
                </div>
              </div>

              <div>
                <label style={labelStyle}>Issue Date</label>
                <input
                  style={inputStyle}
                  placeholder="6 Sep 2026"
                  value={form.date}
                  onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                  required
                />
              </div>

              <div>
                <label style={labelStyle}>Due Date (optional)</label>
                <input
                  style={inputStyle}
                  placeholder="e.g. 15 Sep 2026"
                  value={form.due_date}
                  onChange={(e) => setForm((f) => ({ ...f, due_date: e.target.value }))}
                />
              </div>

              <div>
                <label style={labelStyle}>Currency</label>
                <select
                  style={inputStyle}
                  value={form.currency}
                  onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value }))}
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.symbol} value={c.symbol}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Card 3: Line Items & Services (Integrated Directly In Chronological Flow) */}
          <div
            style={{
              background: "linear-gradient(180deg, rgba(26, 26, 30, 0.85), rgba(17, 17, 19, 0.9))",
              border: "1px solid var(--adm-line-2)",
              borderRadius: 16,
              padding: 24,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div>
                <h3 style={sectionHeading}>3. Line Items & Deliverables</h3>
                <p style={{ fontSize: 12, color: "var(--adm-text-3)", margin: "4px 0 0 0" }}>
                  Items appear dynamically on the live letterhead canvas
                </p>
              </div>
              <button
                type="button"
                onClick={addItem}
                style={{
                  background: "rgba(197, 168, 128, 0.15)",
                  border: "1px solid rgba(197, 168, 128, 0.35)",
                  color: "#dfc19b",
                  padding: "8px 16px",
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                + Add Item
              </button>
            </div>

            {/* Service Presets */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
              <span style={{ fontSize: 11, color: "var(--adm-text-3)", alignSelf: "center", marginRight: 4 }}>
                Presets:
              </span>
              {PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => applyPreset(p)}
                  style={{
                    background: "var(--adm-surface)",
                    border: "1px solid var(--adm-line-2)",
                    color: "var(--adm-text-2)",
                    padding: "5px 12px",
                    borderRadius: 8,
                    fontSize: 11,
                    cursor: "pointer",
                    transition: "all .15s",
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.borderColor = "#dfc19b")}
                  onMouseOut={(e) => (e.currentTarget.style.borderColor = "var(--adm-line-2)")}
                >
                  + {p.name} ({form.currency}{p.amount})
                </button>
              ))}
            </div>

            {/* Items Table */}
            <div style={{ border: "1px solid var(--adm-line)", borderRadius: 10, overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: "rgba(255, 255, 255, 0.02)" }}>
                    <th style={{ ...thStyle, width: 44, textAlign: "center" }}>#</th>
                    <th style={{ ...thStyle, textAlign: "left" }}>Service Description</th>
                    <th style={{ ...thStyle, width: 170, textAlign: "right" }}>Amount ({form.currency})</th>
                    <th style={{ ...thStyle, width: 40 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {form.items.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: "1px solid var(--adm-line)" }}>
                      <td style={{ ...tdStyle, textAlign: "center", color: "var(--adm-text-3)", fontWeight: 600 }}>
                        {idx + 1}
                      </td>
                      <td style={tdStyle}>
                        <input
                          style={inputStyle}
                          placeholder="e.g. Full Stack Web Platform & SEO Optimization"
                          value={item.description}
                          onChange={(e) => updateItem(idx, "description", e.target.value)}
                          required
                        />
                      </td>
                      <td style={tdStyle}>
                        <input
                          style={{ ...inputStyle, textAlign: "right", fontFamily: "monospace", fontWeight: 600 }}
                          placeholder="2000"
                          value={item.amount}
                          onChange={(e) => updateItem(idx, "amount", e.target.value)}
                          required
                        />
                      </td>
                      <td style={{ ...tdStyle, textAlign: "center" }}>
                        {form.items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeItem(idx)}
                            style={{
                              background: "none",
                              border: "none",
                              color: "#f87171",
                              cursor: "pointer",
                              fontSize: 16,
                              padding: "4px 8px",
                            }}
                            title="Remove item"
                          >
                            ×
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "16px 20px",
                  background: "rgba(255, 255, 255, 0.02)",
                }}
              >
                <span style={{ fontSize: 13, color: "var(--adm-text-3)" }}>
                  {form.items.length} item{form.items.length > 1 ? "s" : ""} configured
                </span>
                <div style={{ fontSize: 16, fontWeight: 700, color: "var(--adm-text)" }}>
                  Total: <span style={{ color: "#dfc19b" }}>{form.currency}{totalAmount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: Payment, Instructions & Official Branding Controls */}
          <div
            style={{
              background: "linear-gradient(180deg, rgba(26, 26, 30, 0.85), rgba(17, 17, 19, 0.9))",
              border: "1px solid var(--adm-line-2)",
              borderRadius: 16,
              padding: 24,
            }}
          >
            <h3 style={sectionHeading}>4. Payment & Official Document Controls</h3>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
              <div>
                <label style={labelStyle}>Payment Method</label>
                <select
                  style={inputStyle}
                  value={form.payment_method}
                  onChange={(e) => setForm((f) => ({ ...f, payment_method: e.target.value }))}
                >
                  <option value="Check">Check</option>
                  <option value="Bank Transfer">Bank Transfer / IBAN</option>
                  <option value="Wire Transfer">Wire Transfer / Swift</option>
                  <option value="Cash">Cash</option>
                  <option value="Card / Stripe">Card / Stripe</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>
                  {form.payment_method === "Check" ? "Check Number" : "Transaction / Reference ID"}
                </label>
                <input
                  style={inputStyle}
                  placeholder={form.payment_method === "Check" ? "e.g. 48291" : "e.g. TR-98231"}
                  value={form.check_no}
                  onChange={(e) => setForm((f) => ({ ...f, check_no: e.target.value }))}
                />
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Payment Instructions / Wire Notes (optional)</label>
              <textarea
                style={{ ...inputStyle, minHeight: 60, resize: "vertical" }}
                placeholder="e.g. Wire routing details, ACH, or specific bank remittance references..."
                value={form.payment_details}
                onChange={(e) => setForm((f) => ({ ...f, payment_details: e.target.value }))}
              />
            </div>

            {/* Official Branding Toggles */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 14,
                padding: "16px",
                background: "var(--adm-surface)",
                borderRadius: 12,
                border: "1px solid var(--adm-line)",
              }}
            >
              <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 13 }}>
                <input
                  type="checkbox"
                  checked={form.show_seal}
                  onChange={(e) => setForm((f) => ({ ...f, show_seal: e.target.checked }))}
                  style={{ width: 18, height: 18, accentColor: "#c5a880" }}
                />
                <div>
                  <div style={{ fontWeight: 600, color: "var(--adm-text)" }}>Corporate Security Watermark</div>
                  <div style={{ fontSize: 11, color: "var(--adm-text-3)" }}>Subtle background verification seal</div>
                </div>
              </label>

              <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 13 }}>
                <input
                  type="checkbox"
                  checked={form.paid}
                  onChange={(e) => setForm((f) => ({ ...f, paid: e.target.checked }))}
                  style={{ width: 18, height: 18, accentColor: "#4ade80" }}
                />
                <div>
                  <div style={{ fontWeight: 600, color: "var(--adm-text)" }}>Mark as Paid</div>
                  <div style={{ fontSize: 11, color: "var(--adm-text-3)" }}>Applies settlement badge to invoice</div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: REAL-TIME A4 LETTERHEAD CANVAS ================= */}
        <div style={{ position: "sticky", top: 20 }}>
          <div
            style={{
              background: "#080a0f",
              border: "1px solid var(--adm-line-2)",
              borderRadius: 16,
              padding: 20,
              boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.8)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ade80", display: "inline-block" }} />
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--adm-text-2)" }}>
                  Live Document Preview
                </span>
              </div>
              <span style={{ fontSize: 11, color: "#dfc19b" }}>Projekts Standard A4</span>
            </div>

            {/* Authentic White Paper Canvas */}
            <div
              style={{
                background: "#ffffff",
                color: "#111111",
                borderRadius: 8,
                padding: "28px 24px",
                position: "relative",
                overflow: "hidden",
                minHeight: 640,
                boxShadow: "0 15px 35px rgba(0, 0, 0, 0.3)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
              }}
            >
              {/* Top Accent Strip */}
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 6, background: "#0b0b0b" }} />
              <div style={{ position: "absolute", top: 6, left: 0, right: 0, height: 2, background: "#a8a9b8" }} />

              {/* Watermark Seal */}
              {form.show_seal && (
                <div
                  style={{
                    position: "absolute",
                    top: "45%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    pointerEvents: "none",
                    opacity: 0.05,
                    zIndex: 0,
                  }}
                >
                  <svg width="280" height="280" viewBox="0 0 200 200">
                    <polygon points="100,20 170,60 170,140 100,180 30,140 30,60" fill="none" stroke="#000" strokeWidth="6" />
                    <polygon points="100,20 100,100 170,140" fill="none" stroke="#000" strokeWidth="4" />
                    <polygon points="100,100 30,140" fill="none" stroke="#000" strokeWidth="4" />
                    <polygon points="100,100 100,180" fill="none" stroke="#000" strokeWidth="4" />
                  </svg>
                </div>
              )}

              {/* Document Header */}
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, paddingTop: 6 }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/logoforlightbg.svg"
                        alt="Projekts"
                        style={{ height: 26, width: "auto", display: "block" }}
                      />
                      <span
                        style={{
                          fontSize: 14,
                          fontWeight: 800,
                          letterSpacing: "0.16em",
                          color: "#0b0b0b",
                          borderLeft: "2px solid #a8a9b8",
                          paddingLeft: 8,
                          lineHeight: 1,
                        }}
                      >
                        VISION
                      </span>
                    </div>
                    <div style={{ fontSize: 10, color: "#666", letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 2 }}>
                      Enterprise Architecture & Design Studio
                    </div>
                    <div style={{ fontSize: 9.5, color: "#888", marginTop: 4, lineHeight: 1.4 }}>
                      Delaware · Zurich · Worldwide<br />
                      support@projektsvision.com · projektsvision.com
                    </div>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: "0.12em", color: "#000" }}>
                      INVOICE
                    </div>
                    <div style={{ fontSize: 12, fontFamily: "monospace", fontWeight: 700, color: "#444", marginTop: 2 }}>
                      #{form.invoice_id || "PRJK000"}
                    </div>
                    <div style={{ fontSize: 10, color: "#666", marginTop: 4 }}>
                      Date: <strong>{form.date}</strong>
                    </div>
                    {form.due_date && (
                      <div style={{ fontSize: 10, color: "#666" }}>
                        Due: <strong>{form.due_date}</strong>
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ height: 1, background: "#e5e7eb", margin: "14px 0" }} />

                {/* Bill To */}
                <div style={{ marginBottom: 22 }}>
                  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", color: "#9ca3af", textTransform: "uppercase", marginBottom: 4 }}>
                    BILL TO
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#111" }}>
                    {form.client_name || "Client / Company Name"}
                  </div>
                  <div style={{ fontSize: 10.5, color: "#4b5563", whiteSpace: "pre-line", marginTop: 3, maxWidth: 320, lineHeight: 1.4 }}>
                    {form.client_address || "Billing address will appear here..."}
                  </div>
                </div>

                {/* Items Table on Letterhead */}
                <div style={{ marginBottom: 20 }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10.5 }}>
                    <thead>
                      <tr style={{ background: "#0b0b0b", color: "#ffffff" }}>
                        <th style={{ padding: "6px 8px", textAlign: "center", width: 28, fontSize: 9 }}>#</th>
                        <th style={{ padding: "6px 8px", textAlign: "left", fontSize: 9, letterSpacing: "0.08em" }}>
                          DESCRIPTION
                        </th>
                        <th style={{ padding: "6px 8px", textAlign: "right", width: 90, fontSize: 9, letterSpacing: "0.08em" }}>
                          AMOUNT
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {form.items.map((it, idx) => (
                        <tr key={idx} style={{ borderBottom: "1px solid #f3f4f6" }}>
                          <td style={{ padding: "8px", textAlign: "center", color: "#9ca3af", fontSize: 9.5 }}>
                            {idx + 1}
                          </td>
                          <td style={{ padding: "8px", color: "#1f2937", fontWeight: 500 }}>
                            {it.description || "Service Description"}
                          </td>
                          <td style={{ padding: "8px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: "#111827" }}>
                            {form.currency}{it.amount ? Number(String(it.amount).replace(/[^0-9.]/g, "")).toLocaleString() : "0"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Subtotal & Total Block */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 20 }}>
                  <div>
                    {form.paid && (
                      <div
                        style={{
                          border: "3px solid #15803d",
                          padding: "6px 16px",
                          borderRadius: 8,
                          color: "#15803d",
                          fontWeight: 900,
                          letterSpacing: "0.2em",
                          fontSize: 20,
                          textTransform: "uppercase",
                          transform: "rotate(-8deg)",
                          opacity: 0.9,
                          textShadow: "0 0 1px rgba(21, 128, 61, 0.4)",
                          backgroundColor: "rgba(255, 255, 255, 0.95)",
                          display: "inline-block",
                        }}
                      >
                        PAID
                        <div style={{ fontSize: 8.5, letterSpacing: "0.15em", textAlign: "center", marginTop: 2, fontWeight: 700 }}>
                          VERIFIED & SETTLED
                        </div>
                      </div>
                    )}
                  </div>
                  <div style={{ width: 200, borderTop: "2px solid #0b0b0b", paddingTop: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#6b7280", marginBottom: 4 }}>
                      <span>Subtotal:</span>
                      <span style={{ fontFamily: "monospace" }}>{form.currency}{totalAmount}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 800, color: "#000", borderTop: "1px solid #e5e7eb", paddingTop: 6 }}>
                      <span>TOTAL DUE:</span>
                      <span style={{ fontFamily: "monospace" }}>{form.currency}{totalAmount}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Instructions on Letterhead */}
                <div style={{ background: "#f9fafb", padding: "10px 12px", borderRadius: 6, border: "1px solid #f3f4f6", fontSize: 9.5, color: "#4b5563" }}>
                  <div style={{ fontWeight: 700, color: "#111827", textTransform: "uppercase", fontSize: 8.5, letterSpacing: "0.08em", marginBottom: 3 }}>
                    Payment Details & Terms
                  </div>
                  <div>Method: <strong>{form.payment_method}</strong>{form.check_no ? ` · Ref/Check #${form.check_no}` : ""}</div>
                  {form.payment_details && <div style={{ marginTop: 2, whiteSpace: "pre-line" }}>{form.payment_details}</div>}
                </div>
              </div>

              {/* Document Footer */}
              <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: 10, marginTop: 24, textAlign: "center", fontSize: 8.5, color: "#9ca3af" }}>
                Projekts Vision LLC · Delaware State File 7489201 · <span style={{ color: "#4b5563" }}>support@projektsvision.com</span> · projektsvision.com
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= BOTTOM SECTION: CLOUD WORKSPACE INVOICE HISTORY ================= */}
      <div
        style={{
          background: "linear-gradient(180deg, rgba(26, 26, 30, 0.85), rgba(17, 17, 19, 0.9))",
          border: "1px solid var(--adm-line-2)",
          borderRadius: 16,
          padding: 24,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <h3 style={{ ...sectionHeading, margin: 0 }}>Invoice History</h3>
            {(userRole === "superadmin" || userRole === "admin") && (
              <div style={{ display: "flex", background: "var(--adm-surface)", padding: 2, borderRadius: 8, border: "1px solid var(--adm-line)" }}>
                <button
                  type="button"
                  onClick={() => setViewMode("my")}
                  style={{
                    background: viewMode === "my" ? "rgba(197, 168, 128, 0.2)" : "transparent",
                    color: viewMode === "my" ? "#dfc19b" : "#888",
                    border: "none",
                    borderRadius: 6,
                    padding: "5px 12px",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  My Invoices
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("all")}
                  style={{
                    background: viewMode === "all" ? "rgba(56, 189, 248, 0.15)" : "transparent",
                    color: viewMode === "all" ? "#38bdf8" : "#888",
                    border: "none",
                    borderRadius: 6,
                    padding: "5px 12px",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  All Team Invoices
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => fetchDbInvoices(viewMode)}
            style={{
              background: "var(--adm-surface)",
              border: "1px solid var(--adm-line-2)",
              color: "var(--adm-text-2)",
              padding: "6px 12px",
              borderRadius: 6,
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            ↻ Refresh Cloud Invoices
          </button>
        </div>

        {(() => {
          const displayList = dbInvoices.length > 0 ? dbInvoices : recentInvoices;

          if (displayList.length === 0) {
            return (
              <p style={{ margin: "20px 0", textAlign: "center", color: "#666", fontSize: 13 }}>
                No invoices found in your workspace yet. Click "Save to Cloud" or "Generate Official PDF" above to save your first invoice.
              </p>
            );
          }

          return (
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>Invoice ID</th>
                    <th style={{ textAlign: "left" }}>Client</th>
                    <th>Amount</th>
                    <th>Date</th>
                    {viewMode === "all" && <th>Author</th>}
                    <th>Payment Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayList.map((inv) => {
                    const isDb = Boolean(inv.id && (inv.createdBy || inv.createdById));
                    const invId = inv.invoice_id || inv.id;
                    const client = inv.client_name || inv.client;
                    const amt = inv.totalAmount ? `${inv.currency || "$"}${inv.totalAmount}` : inv.amount;
                    const isPaid = inv.paid;

                    return (
                      <tr key={inv.id || invId}>
                        <td style={{ fontFamily: "monospace", color: "#dfc19b", fontWeight: 600 }}>
                          {invId}
                        </td>
                        <td style={{ fontWeight: 600 }}>{client}</td>
                        <td style={{ fontWeight: 700 }}>{amt}</td>
                        <td>{inv.date}</td>
                        {viewMode === "all" && (
                          <td>
                            <span style={{ fontSize: 11, color: "#38bdf8", fontWeight: 500 }}>
                              {inv.createdBy?.name || inv.createdBy?.email || "Team"}
                            </span>
                          </td>
                        )}
                        <td>
                          {isDb ? (
                            <button
                              type="button"
                              onClick={() => togglePaidStatus(inv)}
                              title="Click to toggle Paid/Pending"
                              style={{
                                background: isPaid ? "rgba(74, 222, 128, 0.12)" : "rgba(234, 179, 8, 0.12)",
                                border: `1px solid ${isPaid ? "rgba(74, 222, 128, 0.3)" : "rgba(234, 179, 8, 0.3)"}`,
                                color: isPaid ? "#4ade80" : "#eab308",
                                padding: "4px 10px",
                                borderRadius: 6,
                                fontSize: 11,
                                fontWeight: 700,
                                cursor: "pointer",
                              }}
                            >
                              {isPaid ? "PAID ✓" : "Pending ⏳"}
                            </button>
                          ) : (
                            <span style={{ color: isPaid ? "#4ade80" : "#eab308", fontWeight: 600, fontSize: 11 }}>
                              {isPaid ? "PAID" : "Pending"}
                            </span>
                          )}
                        </td>
                        <td>
                          <div style={{ display: "flex", justifyContent: "center", gap: 6 }}>
                            <button
                              type="button"
                              onClick={() => loadRecent(inv)}
                              style={{
                                background: "var(--adm-surface-2)",
                                border: "1px solid var(--adm-line-2)",
                                color: "var(--adm-text)",
                                padding: "4px 10px",
                                borderRadius: 6,
                                fontSize: 11,
                                cursor: "pointer",
                              }}
                            >
                              Load
                            </button>
                            {isDb && (inv.isOwner || userRole === "superadmin") && (
                              <button
                                type="button"
                                onClick={() => deleteInvoice(inv)}
                                style={{
                                  background: "rgba(239, 68, 68, 0.1)",
                                  border: "1px solid rgba(239, 68, 68, 0.25)",
                                  color: "#f87171",
                                  padding: "4px 10px",
                                  borderRadius: 6,
                                  fontSize: 11,
                                  cursor: "pointer",
                                }}
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        })()}
      </div>
    </div>
  );
}

const sectionHeading = {
  fontSize: "13px",
  fontWeight: 700,
  margin: "0 0 14px 0",
  color: "#9ca3af",
  textTransform: "uppercase",
  letterSpacing: "0.8px",
};

const labelStyle = {
  display: "block",
  fontSize: "11.5px",
  color: "#888",
  marginBottom: 5,
  fontWeight: 500,
};

const inputStyle = {
  width: "100%",
  background: "#0c0c0e",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  color: "#f3f4f6",
  padding: "10px 12px",
  borderRadius: 8,
  fontSize: 13,
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "inherit",
};

const thStyle = {
  padding: "10px 12px",
  fontSize: 11,
  color: "#6b7280",
  textTransform: "uppercase",
  borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
  fontWeight: 700,
  letterSpacing: "0.5px",
};

const tdStyle = {
  padding: "10px 12px",
  borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
};
