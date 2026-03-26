// ─── src/widgets/NewsWidget.tsx ───────────────────────────────────────────────
import React from "react";

const NEWS = [
  { title: "RBI holds repo rate at 6.5% for 7th consecutive time", time: "2m", tag: "MACRO" },
  { title: "Reliance Industries Q3 net profit up 12% YoY",         time: "15m", tag: "RESULT" },
  { title: "SEBI proposes new F&O framework for retail investors",  time: "1h",  tag: "SEBI" },
  { title: "Nifty Bank crosses 54,000 mark intraday",              time: "2h",  tag: "MARKET" },
  { title: "IT sector rally continues; TCS leads with 2% gain",    time: "3h",  tag: "SECTOR" },
];

export function NewsWidget() {
  return (
    <div style={{ width: "100%", height: "100%", overflow: "auto" }}>
      {NEWS.map((n, i) => (
        <div key={i} className="news-item">
          <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 4 }}>
            <span className="news-tag">{n.tag}</span>
            <span style={{ fontSize: 10, color: "#666" }}>{n.time} ago</span>
          </div>
          <div style={{ fontSize: 12, lineHeight: 1.5 }}>{n.title}</div>
        </div>
      ))}
    </div>
  );
}