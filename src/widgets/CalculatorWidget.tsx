// ─── src/widgets/CalculatorWidget.tsx ────────────────────────────────────────
import React, { useState, useCallback } from "react";

export function CalculatorWidget() {
  const [display, setDisplay] = useState("0");
  const [prev, setPrev] = useState<string | null>(null);
  const [op, setOp] = useState<string | null>(null);
  const [shouldReset, setShouldReset] = useState(false);

  const press = useCallback((val: string) => {
    if (val === "C") { setDisplay("0"); setPrev(null); setOp(null); return; }
    if (val === "=") {
      if (op && prev !== null) {
        const a = parseFloat(prev), b = parseFloat(display);
        const r = op === "+" ? a + b : op === "−" ? a - b : op === "×" ? a * b : b !== 0 ? a / b : NaN;
        setDisplay(isNaN(r) ? "Error" : String(parseFloat(r.toFixed(8))));
        setPrev(null); setOp(null); setShouldReset(true);
      }
      return;
    }
    if (["÷", "×", "−", "+"].includes(val)) {
      setPrev(display); setOp(val); setShouldReset(true); return;
    }
    setDisplay(d => (shouldReset || d === "0") && val !== "." ? val : d.includes(".") && val === "." ? d : d + val);
    setShouldReset(false);
  }, [display, op, prev, shouldReset]);

  const B = (label: string, cls = "") => (
    <button key={label} className={`calc-btn ${cls}`} onClick={() => press(label)}>{label}</button>
  );

  return (
    <div className="calc">
      <div className="calc-display">{display}</div>
      <div className="calc-grid">
        {B("C", "red")} {B("±")} {B("%")} {B("÷", "op")}
        {B("7")} {B("8")} {B("9")} {B("×", "op")}
        {B("4")} {B("5")} {B("6")} {B("−", "op")}
        {B("1")} {B("2")} {B("3")} {B("+", "op")}
        {B("0")} {B(".")} {B("=", "eq")} {B("")}
      </div>
    </div>
  );
}


