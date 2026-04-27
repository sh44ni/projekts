"use client";

import { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";

const COLORS = ["#ffffff", "#cccccc", "#999999", "#666666", "#444444"];

export default function AdminAnalytics() {
  const [data, setData] = useState(null);
  const [days, setDays] = useState(30);

  useEffect(() => {
    fetch(`/api/admin/analytics?days=${days}`).then((r) => r.json()).then(setData);
  }, [days]);

  if (!data) return <div className="adm-page"><div className="adm-loading"><div className="adm-spinner" /></div></div>;

  const browserData = Object.entries(data.browsers || {}).map(([name, count]) => ({ name, count }));
  const deviceData = Object.entries(data.devices || {}).map(([name, count]) => ({ name, count }));
  const bounceRate = data.totalViews > 0 ? Math.round(((data.totalViews - data.uniqueVisitors) / data.totalViews) * 100) : 0;

  return (
    <div className="adm-page">
      <div className="adm-page-header">
        <div>
          <h1 className="adm-page-title">Analytics</h1>
          <p className="adm-page-subtitle">Last {days} days</p>
        </div>
        <div className="adm-filters">
          {[7, 14, 30, 90].map((d) => (
            <button key={d} className={`adm-filter-btn ${days === d ? "active" : ""}`} onClick={() => setDays(d)}>
              {d}d
            </button>
          ))}
        </div>
      </div>

      <div className="adm-stats-grid">
        <div className="adm-stat-card">
          <span className="adm-stat-label">Total Views</span>
          <span className="adm-stat-value">{data.totalViews}</span>
        </div>
        <div className="adm-stat-card">
          <span className="adm-stat-label">Unique Visitors</span>
          <span className="adm-stat-value">{data.uniqueVisitors}</span>
        </div>
        <div className="adm-stat-card">
          <span className="adm-stat-label">Bounce Rate</span>
          <span className="adm-stat-value">{bounceRate}%</span>
        </div>
        <div className="adm-stat-card">
          <span className="adm-stat-label">Inquiries</span>
          <span className="adm-stat-value">{data.submissions}</span>
        </div>
      </div>

      {/* Views timeline */}
      <div className="adm-chart-card">
        <h3 className="adm-chart-title">Views Over Time</h3>
        <div className="adm-chart-wrap">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={data.timeline}>
              <defs>
                <linearGradient id="viewGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ffffff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" stroke="#555" fontSize={11} tickFormatter={(d) => d.slice(5)} />
              <YAxis stroke="#555" fontSize={11} />
              <Tooltip contentStyle={{ background: "#1a1a1e", border: "1px solid #333", borderRadius: 8, fontSize: 13 }} />
              <Area type="monotone" dataKey="count" stroke="#fff" fill="url(#viewGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="adm-charts-row">
        {/* Top pages */}
        <div className="adm-chart-card">
          <h3 className="adm-chart-title">Top Pages</h3>
          <div className="adm-list">
            {(data.topPages || []).map((p, i) => (
              <div key={i} className="adm-list-row">
                <span className="adm-list-label">{p.path}</span>
                <span className="adm-list-value">{p.count}</span>
              </div>
            ))}
            {(!data.topPages || data.topPages.length === 0) && <p className="adm-empty">No data yet</p>}
          </div>
        </div>

        {/* Top referrers */}
        <div className="adm-chart-card">
          <h3 className="adm-chart-title">Top Referrers</h3>
          <div className="adm-list">
            {(data.topReferrers || []).map((r, i) => (
              <div key={i} className="adm-list-row">
                <span className="adm-list-label">{r.referrer}</span>
                <span className="adm-list-value">{r.count}</span>
              </div>
            ))}
            {(!data.topReferrers || data.topReferrers.length === 0) && <p className="adm-empty">No data yet</p>}
          </div>
        </div>
      </div>

      <div className="adm-charts-row">
        {/* Browsers */}
        <div className="adm-chart-card">
          <h3 className="adm-chart-title">Browsers</h3>
          {browserData.length > 0 ? (
            <div className="adm-chart-wrap">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={browserData} layout="vertical">
                  <XAxis type="number" stroke="#555" fontSize={11} />
                  <YAxis dataKey="name" type="category" stroke="#555" fontSize={11} width={70} />
                  <Tooltip contentStyle={{ background: "#1a1a1e", border: "1px solid #333", borderRadius: 8, fontSize: 13 }} />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {browserData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : <p className="adm-empty">No data yet</p>}
        </div>

        {/* Devices */}
        <div className="adm-chart-card">
          <h3 className="adm-chart-title">Devices</h3>
          {deviceData.length > 0 ? (
            <div className="adm-chart-wrap">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={deviceData} layout="vertical">
                  <XAxis type="number" stroke="#555" fontSize={11} />
                  <YAxis dataKey="name" type="category" stroke="#555" fontSize={11} width={70} />
                  <Tooltip contentStyle={{ background: "#1a1a1e", border: "1px solid #333", borderRadius: 8, fontSize: 13 }} />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {deviceData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : <p className="adm-empty">No data yet</p>}
        </div>
      </div>
    </div>
  );
}
