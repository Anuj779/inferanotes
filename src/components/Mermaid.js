"use client";
import React, { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: false,
  theme: "dark",
});

export default function Mermaid({ chart }) {
  const containerRef = useRef(null);
  const [svg, setSvg] = useState(null);

  useEffect(() => {
    let active = true;
    const renderChart = async () => {
      try {
        if (!chart) return;
        const id = `mermaid-${Math.random().toString(36).substring(2, 9)}`;
        const { svg: rendered } = await mermaid.render(id, chart);
        if (active) setSvg(rendered);
      } catch (err) {
        console.error("Mermaid parsing error", err);
      }
    };
    renderChart();
    return () => {
      active = false;
    };
  }, [chart]);

  if (!svg) return <div className="skeleton" style={{ height: "150px", margin: "20px 0" }}>Rendering diagram...</div>;

  return (
    <div 
      className="mermaid-wrapper" 
      style={{ margin: "24px 0", display: "flex", justifyContent: "center", background: "#1f1f1f", padding: "16px", borderRadius: "8px", border: "1px solid var(--border)" }}
      dangerouslySetInnerHTML={{ __html: svg }} 
    />
  );
}
