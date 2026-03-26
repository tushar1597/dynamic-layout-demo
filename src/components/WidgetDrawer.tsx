// ─── src/components/WidgetDrawer.tsx ─────────────────────────────────────────
// A floating panel listing all available widget types.
// User clicks a widget → it gets added to the target pane.

import React from "react";
import { WIDGET_META } from "../App";

interface Props {
  onSelect: (widgetType: string) => void;
  onClose: () => void;
}

export function WidgetDrawer({ onSelect, onClose }: Props) {
  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer" onClick={e => e.stopPropagation()}>
        <div className="drawer-header">
          <span>Add Widget</span>
          <button onClick={onClose} className="icon-btn">×</button>
        </div>
        <div className="drawer-list">
          {Object.entries(WIDGET_META).map(([type, meta]) => (
            <button key={type} className="drawer-item" onClick={() => onSelect(type)}>
              <span className="drawer-icon">{meta.icon}</span>
              <span>{meta.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

