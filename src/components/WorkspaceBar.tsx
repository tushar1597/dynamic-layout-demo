
// ─── src/components/WorkspaceBar.tsx ─────────────────────────────────────────
// Save / load named workspaces from localStorage.
// Swap localStorage for an API call to persist server-side.

import React, { useState } from "react";

interface WsProps {
  onSave: (name: string) => void;
  onLoad: (name: string) => void;
  onReset: () => void;
}

export function WorkspaceBar({ onSave, onLoad, onReset }: WsProps) {
  const [name, setName] = useState("");

  // List workspaces stored in localStorage
  const saved = Object.keys(localStorage)
    .filter(k => k.startsWith("ws_") && k !== "ws_autosave")
    .map(k => k.slice(3));

  return (
    <div className="wsbar">
      {saved.map(ws => (
        <button key={ws} className="ws-tab" onClick={() => onLoad(ws)}>
          {ws}
        </button>
      ))}
      <input
        className="ws-input"
        placeholder="Name..."
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button
        className="ws-btn"
        onClick={() => { if (name.trim()) { onSave(name.trim()); setName(""); } }}
      >
        Save
      </button>
      <button className="ws-btn secondary" onClick={onReset}>
        Reset
      </button>
    </div>
  );
}