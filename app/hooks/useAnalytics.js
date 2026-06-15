/**
 * useAnalytics(period)
 *
 * Fetches all analytics dashboard data from the API.
 * Returns `null` while loading.
 *
 * To add additional computed fields or swap the data source,
 * only this file needs to change — the dashboard page is isolated
 * from the data layer.
 */

"use client";

import { useState, useEffect } from "react";

export function useAnalytics(period) {
  const [data, setData] = useState(null);

  useEffect(() => {
    setData(null); // clear stale data while new period loads
    fetch(`/api/admin/analytics?days=${period}`)
      .then((r) => {
        if (!r.ok) throw new Error(`Analytics API returned ${r.status}`);
        return r.json();
      })
      .then(setData)
      .catch((err) => console.error("useAnalytics fetch failed:", err));
  }, [period]);

  return data;
}
