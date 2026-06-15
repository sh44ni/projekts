"use client";

import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, ReferenceLine,
} from "recharts";
import { useAnalytics } from "@/app/hooks/useAnalytics";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmt(value, format) {
  if (value === null || value === undefined) return "—";
  if (format === "duration") {
    const m = Math.floor(value / 60);
    const s = value % 60;
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  }
  if (format === "percent") return `${value}%`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
  return String(value);
}

function fmtTime(secs) {
  if (secs === null || secs === undefined) return "—";
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

function TrendChip({ change, invertColor }) {
  if (change === null || change === undefined) return null;
  const positive = invertColor ? change < 0 : change > 0;
  const cls = positive ? "adm-trend-up" : "adm-trend-down";
  const arrow = change > 0 ? "▲" : "▼";
  return (
    <span className={cls}>
      {arrow} {Math.abs(change)}%
    </span>
  );
}

// ─── Custom chart tooltip ─────────────────────────────────────────────────────

const ChartTooltip = ({ active, payload, label, mode }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="adm-chart-tooltip">
      <p className="adm-chart-tooltip-label">{label}</p>
      {mode === "stacked" ? (
        <>
          <p style={{ color: "#fff" }}>New: {payload[0]?.value ?? 0}</p>
          <p style={{ color: "#888" }}>Returning: {payload[1]?.value ?? 0}</p>
          <p style={{ color: "#aaa", borderTop: "1px solid #333", marginTop: 4, paddingTop: 4 }}>
            Total: {(payload[0]?.value ?? 0) + (payload[1]?.value ?? 0)}
          </p>
        </>
      ) : (
        <p style={{ color: "#fff" }}>
          Views: {(payload[0]?.value ?? 0) + (payload[1]?.value ?? 0)}
        </p>
      )}
    </div>
  );
};

// ─── Sparkline ────────────────────────────────────────────────────────────────

function Sparkline({ data }) {
  return (
    <div className="adm-sparkline">
      <ResponsiveContainer width={80} height={32}>
        <LineChart data={data}>
          <Line type="monotone" dataKey="v" stroke="#ffffff" strokeWidth={1.5} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ icon, title, body }) {
  return (
    <div className="adm-empty-block">
      <div className="adm-empty-block-icon">{icon}</div>
      <p className="adm-empty-block-title">{title}</p>
      {body && <p className="adm-empty-block-body">{body}</p>}
    </div>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({ title, subtitle, children, action }) {
  return (
    <div className="adm-chart-card">
      <div className="adm-chart-header">
        <div>
          <h3 className="adm-chart-title">{title}</h3>
          {subtitle && <p className="adm-chart-subtitle">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function LoadingGrid() {
  return (
    <div className="adm-metric-grid">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="adm-metric-card adm-skeleton-card">
          <span className="adm-skeleton adm-skeleton-label" />
          <span className="adm-skeleton adm-skeleton-value" />
          <span className="adm-skeleton adm-skeleton-chip" />
        </div>
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function AdminAnalytics() {
  const [days, setDays] = useState(30);
  const [chartMode, setChartMode] = useState("all");
  const data = useAnalytics(days);

  const isLoading = data === null;

  // Safe destructure with defaults while loading
  const metrics = data?.metrics ?? [];
  const funnel = data?.funnel ?? { views: 0, engagedSessions: 0, inquiries: 0 };
  const timeline = data?.timeline ?? [];
  const topPages = data?.topPages ?? [];
  const topReferrers = data?.topReferrers ?? [];
  const caseStudies = data?.caseStudies ?? [];
  const geography = data?.geography ?? [];
  const inquiryFunnel = data?.inquiryFunnel ?? [];
  const caseStudyImpact = data?.caseStudyImpact ?? [];

  const funnelMax = inquiryFunnel[0]?.value || 1;
  const maxImpactViews = Math.max(...caseStudyImpact.map((c) => c.views), 1);

  return (
    <div className="adm-page">

      {/* ── Header ── */}
      <div className="adm-page-header">
        <div>
          <h1 className="adm-page-title">Analytics</h1>
          <p className="adm-page-subtitle">Last {days} days</p>
        </div>
        <div className="adm-filters">
          {[7, 14, 30, 90].map((d) => (
            <button
              key={d}
              className={`adm-filter-btn ${days === d ? "active" : ""}`}
              onClick={() => setDays(d)}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>

      {/* ── 1. Metric cards ── */}
      {isLoading ? (
        <LoadingGrid />
      ) : (
        <div className="adm-metric-grid">
          {metrics.map((m) => (
            <div key={m.id} className="adm-metric-card">
              <span className="adm-stat-label">{m.label}</span>
              <span className="adm-stat-value adm-metric-value">{fmt(m.value, m.format)}</span>
              <TrendChip change={m.change} invertColor={m.invertColor} />
            </div>
          ))}
        </div>
      )}

      {/* ── Mini funnel strip ── */}
      {!isLoading && (
        <div className="adm-mini-funnel">
          <div className="adm-mini-funnel-step">
            <span className="adm-mini-funnel-num">{funnel.views.toLocaleString()}</span>
            <span className="adm-mini-funnel-lbl">Views</span>
          </div>
          <div className="adm-mini-funnel-connector">
            {funnel.views > 0 && (
              <span className="adm-mini-funnel-drop">
                {Math.round((1 - funnel.engagedSessions / funnel.views) * 100)}% drop
              </span>
            )}
            <span className="adm-mini-funnel-arrow">→</span>
          </div>
          <div className="adm-mini-funnel-step">
            <span className="adm-mini-funnel-num">{funnel.engagedSessions.toLocaleString()}</span>
            <span className="adm-mini-funnel-lbl">Engaged Sessions</span>
          </div>
          <div className="adm-mini-funnel-connector">
            {funnel.engagedSessions > 0 && (
              <span className="adm-mini-funnel-drop">
                {Math.round((1 - funnel.inquiries / funnel.engagedSessions) * 100)}% drop
              </span>
            )}
            <span className="adm-mini-funnel-arrow">→</span>
          </div>
          <div className="adm-mini-funnel-step">
            <span className="adm-mini-funnel-num">{funnel.inquiries.toLocaleString()}</span>
            <span className="adm-mini-funnel-lbl">Inquiries</span>
          </div>
        </div>
      )}

      {/* ── 2. Views over time ── */}
      <Section
        title="Views Over Time"
        action={
          <div className="adm-toggle-pill">
            <button
              className={chartMode === "all" ? "active" : ""}
              onClick={() => setChartMode("all")}
            >All Visitors</button>
            <button
              className={chartMode === "stacked" ? "active" : ""}
              onClick={() => setChartMode("stacked")}
            >New vs Returning</button>
          </div>
        }
      >
        {isLoading ? (
          <div className="adm-skeleton-chart" />
        ) : timeline.length === 0 || timeline.every((t) => t.new + t.returning === 0) ? (
          <EmptyState icon="📈" title="No traffic data yet" body="Views will appear here as visitors land on your site." />
        ) : (
          <>
            <div className="adm-chart-wrap" style={{ marginTop: 8 }}>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={timeline} barGap={1}>
                  <XAxis
                    dataKey="label"
                    stroke="#444"
                    fontSize={10}
                    tickLine={false}
                    interval={Math.max(0, Math.floor(timeline.length / 7) - 1)}
                  />
                  <YAxis stroke="#444" fontSize={10} tickLine={false} axisLine={false} width={30} />
                  <Tooltip content={<ChartTooltip mode={chartMode === "stacked" ? "stacked" : "single"} />} />
                  {chartMode === "stacked" ? (
                    <>
                      <Bar dataKey="new" stackId="a" fill="#ffffff" maxBarSize={20} />
                      <Bar dataKey="returning" stackId="a" fill="#444444" radius={[3, 3, 0, 0]} maxBarSize={20} />
                    </>
                  ) : (
                    <>
                      <Bar dataKey="new" stackId="a" fill="#ffffff" maxBarSize={20} />
                      <Bar
                        dataKey="returning"
                        stackId="a"
                        fill="#ffffff"
                        radius={[3, 3, 0, 0]}
                        maxBarSize={20}
                        shape={(props) => {
                          const { x, y, width, height, annotation } = props;
                          return (
                            <g>
                              <rect x={x} y={y} width={width} height={height} fill="#ffffff" rx={3} />
                              {annotation && (
                                <circle cx={x + width / 2} cy={y - 8} r={3} fill="#fff" opacity={0.9} />
                              )}
                            </g>
                          );
                        }}
                      />
                    </>
                  )}
                  {timeline
                    .filter((t) => t.annotation)
                    .map((t, i) => (
                      <ReferenceLine
                        key={i}
                        x={t.label}
                        stroke="rgba(255,255,255,0.2)"
                        strokeDasharray="3 3"
                        label={{ value: "●", fill: "#fff", fontSize: 8, position: "top" }}
                      />
                    ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
            {timeline.some((t) => t.annotation) && (
              <div className="adm-chart-annotations">
                {timeline.filter((t) => t.annotation).map((t, i) => (
                  <span key={i} className="adm-annotation-chip">● {t.annotation}</span>
                ))}
              </div>
            )}
          </>
        )}
      </Section>

      {/* ── 3 & 4. Top pages + Top referrers ── */}
      <div className="adm-charts-row">

        {/* Top Pages */}
        <Section title="Top Pages" subtitle="Sorted by views · /admin/* excluded">
          {isLoading ? (
            <div className="adm-skeleton-list" />
          ) : topPages.length > 0 ? (
            <div className="adm-table-wrap">
              <table className="adm-table adm-pages-table">
                <thead>
                  <tr>
                    <th>Page</th>
                    <th style={{ textAlign: "right" }}>Views</th>
                    <th style={{ textAlign: "right" }}>Avg Time</th>
                    <th style={{ textAlign: "right" }}>Entry %</th>
                    <th style={{ textAlign: "right" }}>Exit %</th>
                    <th style={{ textAlign: "right" }}>Scroll</th>
                  </tr>
                </thead>
                <tbody>
                  {topPages.map((p, i) => (
                    <tr key={i}>
                      <td className="adm-pages-path">{p.path}</td>
                      <td style={{ textAlign: "right" }}>{p.views.toLocaleString()}</td>
                      <td style={{ textAlign: "right", color: p.avgTime ? "#fff" : "#444" }}>{fmtTime(p.avgTime)}</td>
                      <td style={{ textAlign: "right", color: p.entryRate !== null ? "inherit" : "#444" }}>
                        {p.entryRate !== null ? `${p.entryRate}%` : "—"}
                      </td>
                      <td style={{ textAlign: "right", color: p.exitRate !== null ? "inherit" : "#444" }}>
                        {p.exitRate !== null ? `${p.exitRate}%` : "—"}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        {p.scrollDepth !== null ? (
                          <span className="adm-scroll-depth-bar">
                            <span className="adm-scroll-depth-track">
                              <span className="adm-scroll-depth-fill" style={{ width: `${p.scrollDepth}%` }} />
                            </span>
                            <span className="adm-scroll-depth-val">{p.scrollDepth}%</span>
                          </span>
                        ) : (
                          <span style={{ color: "#444" }}>—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              icon="📄"
              title="No public page views yet"
              body="Views will appear here once visitors land on your public pages."
            />
          )}
        </Section>

        {/* Top Referrers */}
        <Section title="Top Referrers">
          {isLoading ? (
            <div className="adm-skeleton-list" />
          ) : topReferrers.length > 0 ? (
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>Source</th>
                    <th>Medium</th>
                    <th>Campaign</th>
                    <th style={{ textAlign: "right" }}>Visits</th>
                  </tr>
                </thead>
                <tbody>
                  {topReferrers.map((r, i) => (
                    <tr key={i}>
                      <td style={{ color: "#fff", fontWeight: 600 }}>{r.source}</td>
                      <td>{r.medium}</td>
                      <td className="adm-pages-path">{r.campaign}</td>
                      <td style={{ textAlign: "right", color: "#fff", fontWeight: 700 }}>{r.visits.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="adm-utm-empty">
              <div className="adm-utm-empty-icon">🔗</div>
              <p className="adm-utm-empty-title">No referrer data yet</p>
              <p className="adm-utm-empty-body">
                Add UTM parameters to your shared links so each traffic source is tracked individually.
              </p>
              <div className="adm-utm-example">
                <span className="adm-utm-example-label">Example URL</span>
                <code className="adm-utm-code">
                  https://projekts.pk/?utm_source=instagram&amp;utm_medium=social&amp;utm_campaign=brand-launch
                </code>
              </div>
              <div className="adm-utm-params">
                {[
                  ["utm_source", "Origin (instagram, google, linkedin)"],
                  ["utm_medium", "Channel (social, email, cpc)"],
                  ["utm_campaign", "Campaign name (brand-launch)"],
                ].map(([k, v]) => (
                  <div key={k} className="adm-utm-param-row">
                    <code className="adm-utm-param-key">{k}</code>
                    <span className="adm-utm-param-desc">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Section>
      </div>

      {/* ── 5. Case Study Performance ── */}
      <Section
        title="Case Study Performance"
        subtitle="Views and 14-day trend per published case study"
      >
        {isLoading ? (
          <div className="adm-skeleton-list" />
        ) : caseStudies.length > 0 ? (
          <div className="adm-table-wrap">
            <table className="adm-table adm-cs-perf-table">
              <thead>
                <tr>
                  <th>Case Study</th>
                  <th style={{ textAlign: "right" }}>Views</th>
                  <th style={{ textAlign: "right" }}>Avg Time</th>
                  <th style={{ textAlign: "right" }}>Conv. Rate</th>
                  <th style={{ textAlign: "right" }}>14d Trend</th>
                </tr>
              </thead>
              <tbody>
                {caseStudies.map((cs, i) => (
                  <tr key={i}>
                    <td style={{ color: "#fff", fontWeight: 600 }}>{cs.name}</td>
                    <td style={{ textAlign: "right" }}>{cs.views.toLocaleString()}</td>
                    <td style={{ textAlign: "right", color: "#444" }}>{fmtTime(cs.avgTime)}</td>
                    <td style={{ textAlign: "right" }}>
                      {cs.conversionRate !== null
                        ? <span className="adm-conv-badge">{cs.conversionRate}%</span>
                        : <span style={{ color: "#444" }}>—</span>
                      }
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <Sparkline data={cs.sparkline} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon="📊"
            title="No case study data yet"
            body="Publish your first case study to start tracking views here."
          />
        )}
      </Section>

      {/* ── 6 & 7. Geography + Inquiry Funnel ── */}
      <div className="adm-charts-row">

        {/* Geography */}
        <Section title="Geography" subtitle="Top countries by visits">
          {isLoading ? (
            <div className="adm-skeleton-list" />
          ) : geography.length > 0 ? (
            <div className="adm-geo-list">
              {geography.map((g, i) => (
                <div key={i} className="adm-geo-row">
                  <span className="adm-geo-flag">{g.flag}</span>
                  <span className="adm-geo-name">{g.country}</span>
                  <div className="adm-geo-bar-wrap">
                    <div className="adm-geo-bar" style={{ width: `${g.pct}%` }} />
                  </div>
                  <span className="adm-geo-pct">{g.pct}%</span>
                  <span className="adm-geo-count">{g.visits.toLocaleString()}</span>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon="🌍"
              title="Location data not tracked yet"
              body="IP geolocation is not currently enabled. Add a geolocation service to see visitor countries here."
            />
          )}
        </Section>

        {/* Inquiry Funnel */}
        <Section title="Inquiry Funnel" subtitle="Visitor path from first view to form submission">
          {isLoading ? (
            <div className="adm-skeleton-list" />
          ) : inquiryFunnel.length === 0 || inquiryFunnel.every((s) => s.value === 0) ? (
            <EmptyState
              icon="📬"
              title="No funnel data yet"
              body="Data appears once visitors interact with your site."
            />
          ) : (
            <div className="adm-funnel-list">
              {inquiryFunnel.map((step, i) => {
                const pct = Math.round((step.value / funnelMax) * 100);
                const next = inquiryFunnel[i + 1];
                const dropPct =
                  next && step.value > 0
                    ? Math.round((1 - next.value / step.value) * 100)
                    : null;
                return (
                  <div key={i} className="adm-funnel-step">
                    <div className="adm-funnel-step-header">
                      <span className="adm-funnel-step-num">
                        <span className="adm-funnel-step-idx">{i + 1}</span>
                        {step.label}
                      </span>
                      <span className="adm-funnel-step-value">{step.value.toLocaleString()}</span>
                    </div>
                    <div className="adm-funnel-bar-wrap">
                      <div className="adm-funnel-bar" style={{ width: `${pct}%` }} />
                    </div>
                    {dropPct !== null && (
                      <p className="adm-funnel-drop">↓ {dropPct}% dropped off</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </Section>
      </div>

      {/* ── 8. Case Studies: Views Ranking ── */}
      <Section
        title="Case Studies: Views Ranking"
        subtitle="Which case studies are getting the most traffic"
      >
        {isLoading ? (
          <div className="adm-skeleton-list" />
        ) : caseStudyImpact.length > 0 ? (
          <div className="adm-impact-list">
            {caseStudyImpact.map((cs, i) => {
              const viewPct = Math.round((cs.views / maxImpactViews) * 100);
              return (
                <div key={i} className="adm-impact-row">
                  <div className="adm-impact-meta">
                    <span className="adm-impact-rank">#{i + 1}</span>
                    <span className="adm-impact-name">{cs.name}</span>
                    <span className="adm-impact-views-badge">{cs.views.toLocaleString()} views</span>
                  </div>
                  <div className="adm-impact-bars">
                    <div className="adm-impact-bar-row">
                      <span className="adm-impact-bar-label">Views</span>
                      <div className="adm-impact-bar-wrap">
                        <div className="adm-impact-bar-views" style={{ width: `${viewPct}%` }} />
                      </div>
                      <span className="adm-impact-bar-val">{cs.views.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              );
            })}
            <p className="adm-impact-note">
              Inquiry attribution per case study requires session tracking — not yet enabled.
            </p>
          </div>
        ) : (
          <EmptyState
            icon="🎯"
            title="No case study traffic yet"
            body="Publish case studies and drive traffic to see rankings here."
          />
        )}
      </Section>

    </div>
  );
}
