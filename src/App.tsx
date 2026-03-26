import React, { useRef, useState, useCallback } from "react";
import * as FlexLayout from "flexlayout-react";
import "flexlayout-react/style/dark.css";  // swap to light.css if needed
import { ChartWidget } from "./widgets/ChartWidget";
import { WatchlistWidget } from "./widgets/WatchlistWidget";
import { CalculatorWidget } from "./widgets/CalculatorWidget";
import { NewsWidget } from "./widgets/NewsWidget";
import { WidgetDrawer } from "./components/WidgetDrawer";
import { WorkspaceBar } from "./components/WorkspaceBar";
import "./App.css";

// ─── Widget registry ──────────────────────────────────────────────────────────
// To add a new widget: register it here + add to WIDGET_META below
const WIDGET_COMPONENTS: Record<string, React.FC> = {
  chart: ChartWidget,
  watchlist: WatchlistWidget,
  calculator: CalculatorWidget,
  news: NewsWidget,
};

export const WIDGET_META: Record<string, { label: string; icon: string }> = {
  chart:       { label: "Chart",      icon: "📈" },
  watchlist:   { label: "Watchlist",  icon: "👁" },
  calculator:  { label: "Calculator", icon: "🧮" },
  news:        { label: "News Feed",  icon: "📰" },
};

// ─── Default layout JSON ──────────────────────────────────────────────────────
// This is the exact shape flexlayout-react expects.
// `weight` controls proportional size (like flex-grow).
// `component` is the key we use in the factory function below.
const DEFAULT_LAYOUT: FlexLayout.IJsonModel = {
  global: {
    tabSetMinWidth: 120,
    tabSetMinHeight: 80,
    borderMinSize: 50,
    // tabSetTabStripHeight: 32,
    tabSetEnableMaximize: true,     // built-in maximize button
    tabSetEnableDrop: true,
    tabEnableRename: false,
  },
  borders: [],
  layout: {
    type: "row",
    weight: 100,
    children: [
      // Left pane: Chart (60% width)
      {
        type: "tabset",
        weight: 60,
        children: [
          { type: "tab", name: "Chart", component: "chart" },
        ],
      },
      // Right column: two panes stacked (40% width)
      {
        type: "row",
        weight: 40,
        children: [
          {
            type: "tabset",
            weight: 50,
            children: [
              { type: "tab", name: "Watchlist", component: "watchlist" },
            ],
          },
          {
            type: "tabset",
            weight: 50,
            children: [
              { type: "tab", name: "Calculator", component: "calculator" },
            ],
          },
        ],
      },
    ],
  },
};

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  // FlexLayout works off a Model instance — this is the single source of truth
  const [model, setModel] = useState<FlexLayout.Model>(() =>
    FlexLayout.Model.fromJson(DEFAULT_LAYOUT)
  );

  const layoutRef = useRef<FlexLayout.Layout>(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const draggingWidget = useRef<string | null>(null);

  // ── factory ────────────────────────────────────────────────────────────────
  // flexlayout-react calls this for every visible tab.
  // You return the React component to render inside that tab.
  const factory = useCallback((node: FlexLayout.TabNode) => {
    const component = node.getComponent();
    if (!component) return null;
    const W = WIDGET_COMPONENTS[component];
    return W ? <W /> : <div style={{ padding: 16, color: "#888" }}>Unknown widget: {component}</div>;
  }, []);

  // ── onRenderTabSet ─────────────────────────────────────────────────────────
  // Called for every tabset (pane). We inject our own buttons into the header.
  // renderValues.buttons is an array — push JSX into it.
  const onRenderTabSet = useCallback(
    (node: FlexLayout.TabSetNode | FlexLayout.BorderNode, renderValues: FlexLayout.ITabSetRenderValues) => {
      // "Add tab" button in every pane header — opens drawer targeting this pane
      renderValues.buttons.push(
        <button
          key="add"
          title="Add widget to this pane"
          className="pane-header-btn"
          onClick={() => {
            draggingWidget.current = node.getId();
            setShowDrawer(true);
          }}
        >
          +
        </button>
      );
    },
    []
  );

  // ── onRenderTab ────────────────────────────────────────────────────────────
  // Customize how each tab label looks — we add the emoji icon.
  const onRenderTab = useCallback(
    (node: FlexLayout.TabNode, renderValues: FlexLayout.ITabRenderValues) => {
      const component = node.getComponent() ?? "";
      const meta = WIDGET_META[component];
      if (meta) {
        renderValues.leading = <span style={{ marginRight: 4, fontSize: 13 }}>{meta.icon}</span>;
      }
    },
    []
  );

  // ── addWidgetToPane ────────────────────────────────────────────────────────
  // Called from WidgetDrawer when user picks a widget type.
  // We add a new tab into the target pane using model.doAction().
  const addWidgetToPane = useCallback(
    (widgetType: string) => {
      const targetId = draggingWidget.current;
      if (!targetId) return;

      const meta = WIDGET_META[widgetType];

      // Actions.addNode adds a new tab node into the layout tree.
      // DockLocation.CENTER = add as a tab in the target tabset.
      model.doAction(
        FlexLayout.Actions.addNode(
          {
            type: "tab",
            name: meta.label,
            component: widgetType,
          },
          targetId,
          FlexLayout.DockLocation.CENTER,
          -1   // -1 = append at end
        )
      );

      draggingWidget.current = null;
      setShowDrawer(false);
    },
    [model]
  );

  // ── Workspace: save & restore ──────────────────────────────────────────────
  // model.toJson() gives a plain object — store it however you like.
  // Model.fromJson() restores it exactly.
  const saveWorkspace = useCallback((name: string) => {
    console.log("SAVED");
    const json = model.toJson();
    localStorage.setItem(`ws_${name}`, JSON.stringify(json));
    
    alert(`Workspace "${name}" saved.`);
  }, [model]);

  const loadWorkspace = useCallback((name: string) => {
    const raw = localStorage.getItem(`ws_${name}`);
    if (!raw) { alert(`No workspace named "${name}".`); return; }
    setModel(FlexLayout.Model.fromJson(JSON.parse(raw)));
  }, []);

  const resetLayout = useCallback(() => {
    setModel(FlexLayout.Model.fromJson(DEFAULT_LAYOUT));
  }, []);

  // ── onModelChange ──────────────────────────────────────────────────────────
  // Fires after every layout mutation (resize, drag, close tab, etc.)
  // Great place for auto-save.
  const onModelChange = useCallback((m: FlexLayout.Model) => {
    // Auto-save to "autosave" slot on every change
    localStorage.setItem("ws_autosave", JSON.stringify(m.toJson()));
  }, []);

  return (
    <div className="app">
      {/* ── Top bar ── */}
      <div className="topbar">
        <span className="topbar-logo">⚡ Kite</span>
        <WorkspaceBar onSave={saveWorkspace} onLoad={loadWorkspace} onReset={resetLayout} />
        <div style={{ flex: 1 }} />
        <button className="add-widget-btn" onClick={() => {
          // When opening drawer from topbar (no target pane),
          // we'll target the first tabset we find in the model.
          const root = model.getRoot();
          const firstTabset = findFirstTabset(root);
          draggingWidget.current = firstTabset?.getId() ?? null;
          setShowDrawer(v => !v);
        }}>
          + Widget
        </button>
      </div>

      {/* ── Layout ── */}
      <div className="layout-container">
        {/*
          The <FlexLayout.Layout> component is the core.
          - model: the single source of truth (IJsonModel-derived)
          - factory: maps component names → React components
          - onRenderTabSet: injects custom buttons into pane headers
          - onRenderTab: customizes tab labels
          - onModelChange: fires on every layout change
        */}
        <FlexLayout.Layout
          ref={layoutRef}
          model={model}
          factory={factory}
          onRenderTabSet={onRenderTabSet}
          onRenderTab={onRenderTab}
          onModelChange={onModelChange}
          realtimeResize={true}   // live resize (no ghosting)
        />
      </div>

      {/* ── Widget drawer ── */}
      {showDrawer && (
        <WidgetDrawer
          onSelect={addWidgetToPane}
          onClose={() => setShowDrawer(false)}
        />
      )}
    </div>
  );
}

// ─── Helper: walk the model tree to find the first TabSetNode ────────────────
function findFirstTabset(node: FlexLayout.Node): FlexLayout.TabSetNode | null {
  if (node instanceof FlexLayout.TabSetNode) return node;
  for (const child of node.getChildren()) {
    const found = findFirstTabset(child);
    if (found) return found;
  }
  return null;
}