// ─── src/widgets/ChartWidget.tsx ──────────────────────────────────────────────
// A candlestick chart rendered in pure SVG.
// In production: replace with TradingView Lightweight Charts or Recharts.

import React, { useMemo } from "react";

const N = 50;
function genCandles() {
  let price = 23000;
  return Array.from({ length: N }, () => {
    const o = price + (Math.random() - 0.5) * 100;
    const c = o + (Math.random() - 0.48) * 120;
    price = c;
    return { o, c, h: Math.max(o, c) + Math.random() * 50, l: Math.min(o, c) - Math.random() * 50 };
  });
}
const CANDLES = genCandles();

export function ChartWidget() {
  const W = 560, H = 220, pad = { l: 10, r: 50, t: 12, b: 24 };
  const min = useMemo(() => Math.min(...CANDLES.map(c => c.l)) - 50, []);
  const max = useMemo(() => Math.max(...CANDLES.map(c => c.h)) + 50, []);
  const range = max - min;
  const cW = (W - pad.l - pad.r) / N;
  const toY = (v: number) => pad.t + (1 - (v - min) / range) * (H - pad.t - pad.b);
  const ticks = [0, 0.25, 0.5, 0.75, 1].map(t => min + t * range);

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", padding: 8, boxSizing: "border-box", background: "var(--bg)" }}>
      <div style={{ fontSize: 11, color: "var(--text-dim)", marginBottom: 4 }}>
        <span style={{ color: "var(--text)", fontWeight: 600, fontSize: 13 }}>NIFTY 50</span>
        <span style={{ marginLeft: 8, color: "#26a69a" }}>▲ 23,306.45 (+0.82%)</span>
        <span style={{ marginLeft: 8, color: "var(--text-dim)" }}>1D</span>
      </div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ flex: 1 }}>
        {ticks.map((v, i) => (
          <g key={i}>
            <line x1={pad.l} x2={W - pad.r} y1={toY(v)} y2={toY(v)} stroke="rgba(255,255,255,0.06)" strokeWidth={0.5} />
            <text x={W - pad.r + 4} y={toY(v) + 4} fontSize={8} fill="#666">{Math.round(v)}</text>
          </g>
        ))}
        {CANDLES.map((c, i) => {
          const x = pad.l + i * cW + cW * 0.15;
          const w = cW * 0.7;
          const bull = c.c >= c.o;
          const col = bull ? "#26a69a" : "#ef5350";
          return (
            <g key={i}>
              <line x1={x + w / 2} x2={x + w / 2} y1={toY(c.h)} y2={toY(c.l)} stroke={col} strokeWidth={0.8} />
              <rect x={x} y={toY(Math.max(c.o, c.c))} width={w}
                height={Math.max(1, Math.abs(toY(c.o) - toY(c.c)))} fill={col} />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

