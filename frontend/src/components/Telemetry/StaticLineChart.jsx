import React from "react";

export default function StaticLineChart({ data, yKey, yLabel, yUnits, lines, color }) {
  const width = 600;
  const height = 250;
  const padding = { top: 20, right: 30, bottom: 40, left: 60 };

  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  // Compute min/max
  let minX = 0;
  let maxX = data.length > 0 ? data.length - 1 : 10;
  
  let minY = Number.POSITIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;

  if (lines) {
    data.forEach((d) => {
      lines.forEach((line) => {
        if (d[line.key] < minY) minY = d[line.key];
        if (d[line.key] > maxY) maxY = d[line.key];
      });
    });
  } else {
    data.forEach((d) => {
      if (d[yKey] < minY) minY = d[yKey];
      if (d[yKey] > maxY) maxY = d[yKey];
    });
  }

  // Padding for Y axis
  const yRange = maxY - minY || 1;
  minY -= yRange * 0.1;
  maxY += yRange * 0.1;

  const xScale = (x) => padding.left + (x / maxX) * innerWidth;
  const yScale = (y) => height - padding.bottom - ((y - minY) / (maxY - minY)) * innerHeight;

  // Grid lines
  const yTicks = 5;
  const gridLines = [];
  for (let i = 0; i <= yTicks; i++) {
    const val = minY + (maxY - minY) * (i / yTicks);
    gridLines.push({ val, y: yScale(val) });
  }

  const renderLine = (key, lineColor) => {
    const pathData = data
      .map((d, i) => `${i === 0 ? "M" : "L"} ${xScale(i)} ${yScale(d[key])}`)
      .join(" ");
    return (
      <path
        key={key}
        d={pathData}
        fill="none"
        stroke={lineColor}
        strokeWidth="3"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    );
  };

  return (
    <div style={{ width: "100%", height: "100%", overflow: "hidden", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: "100%" }}>
        {/* Grid and Y-axis labels */}
        {gridLines.map((line, i) => (
          <g key={i}>
            <line
              x1={padding.left}
              y1={line.y}
              x2={width - padding.right}
              y2={line.y}
              stroke="#24324d"
              strokeDasharray="4 4"
            />
            <text
              x={padding.left - 10}
              y={line.y + 4}
              textAnchor="end"
              fill="#94a3b8"
              fontSize="12"
            >
              {line.val.toFixed(1)}
            </text>
          </g>
        ))}

        {/* X-axis line */}
        <line
          x1={padding.left}
          y1={height - padding.bottom}
          x2={width - padding.right}
          y2={height - padding.bottom}
          stroke="#475569"
        />

        {/* X-axis labels (Time) */}
        <text x={padding.left} y={height - padding.bottom + 20} fill="#94a3b8" fontSize="12" textAnchor="middle">T+0s</text>
        <text x={width - padding.right} y={height - padding.bottom + 20} fill="#94a3b8" fontSize="12" textAnchor="middle">T+10s</text>
        
        {/* Axes titles */}
        <text x={width / 2} y={height - 5} fill="#94a3b8" fontSize="13" textAnchor="middle">Time (s)</text>
        <text x={15} y={height / 2} fill="#94a3b8" fontSize="13" textAnchor="middle" transform={`rotate(-90 15 ${height / 2})`}>{yLabel} ({yUnits})</text>

        {/* Lines */}
        {lines ? (
          lines.map(line => renderLine(line.key, line.color))
        ) : (
          renderLine(yKey, color || "#3b82f6")
        )}
      </svg>
    </div>
  );
}
