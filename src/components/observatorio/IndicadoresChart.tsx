"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const DATA = [
  { periodo: "2025-Q3", valor: 61.2 },
  { periodo: "2025-Q4", valor: 63.0 },
  { periodo: "2026-Q1", valor: 65.5 },
  { periodo: "2026-Q2", valor: 68.4 },
];

export default function IndicadoresChart() {
  return (
    <div style={{ width: "100%", height: 280 }}>
      <ResponsiveContainer>
        <LineChart data={DATA} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(28,42,56,0.08)" />
          <XAxis dataKey="periodo" stroke="rgba(28,42,56,0.5)" fontSize={12} />
          <YAxis stroke="rgba(28,42,56,0.5)" fontSize={12} />
          <Tooltip
            contentStyle={{ borderRadius: 12, border: "1px solid rgba(28,42,56,0.1)" }}
          />
          <Line type="monotone" dataKey="valor" stroke="#c87a62" strokeWidth={3} dot={{ fill: "#f4a900", r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
