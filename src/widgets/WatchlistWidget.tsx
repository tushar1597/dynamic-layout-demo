
// ─── src/widgets/WatchlistWidget.tsx ─────────────────────────────────────────
import React from "react";

const STOCKS = [
  { name: "HDFCBANK",   price: 1729.45, chg: -0.34 },
  { name: "RELIANCE",   price: 2934.20, chg: +1.12 },
  { name: "INFY",       price: 1279.10, chg: -0.58 },
  { name: "TCS",        price: 2378.15, chg: -0.86 },
  { name: "ONGC",       price:  270.20, chg: +0.45 },
  { name: "HINDUNILVR", price: 2135.90, chg: -0.21 },
  { name: "GOLDBEES",   price:  119.29, chg: +0.67 },
  { name: "ICICIBANK",  price: 1345.60, chg: +0.89 },
];

export function WatchlistWidget() {
  return (
    <div style={{ width: "100%", height: "100%", overflow: "auto", boxSizing: "border-box" }}>
      <div className="wl-header">
        <span>Instrument</span><span>LTP</span><span>Chg%</span>
      </div>
      {STOCKS.map(s => (
        <div key={s.name} className="wl-row">
          <span style={{ fontWeight: 500 }}>{s.name}</span>
          <span>{s.price.toFixed(2)}</span>
          <span style={{ color: s.chg >= 0 ? "#26a69a" : "#ef5350" }}>
            {s.chg >= 0 ? "▲" : "▼"} {Math.abs(s.chg).toFixed(2)}%
          </span>
        </div>
      ))}
    </div>
  );
}


