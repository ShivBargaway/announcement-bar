import React, { useEffect, useRef } from "react";

export function ScoreSvg({ title, score }) {
  const parsedScore = parseFloat(score);
  const formattedScore = isNaN(parsedScore) ? 0 : parsedScore * 100;
  const formattedScoreText = formattedScore != 0 ? formattedScore.toFixed(0) : "-";
  const colorStroke =
    formattedScore < 50
      ? "rgb(204, 0, 0)"
      : formattedScore >= 51 && formattedScore <= 80
      ? "rgb(255, 170, 51)"
      : "rgb(0, 136, 0)";
  const colorFill =
    formattedScore < 50
      ? "rgb(204, 0, 0)"
      : formattedScore >= 51 && formattedScore <= 80
      ? "rgb(255, 170, 51)"
      : "rgb(0, 136, 0)";

  const svgRef = useRef(null);

  useEffect(() => {
    const svg = svgRef.current;
    const path = svg.querySelector(".CircularProgressbar-path");
    const text = svg.querySelector(".CircularProgressbar-text");

    path.style.stroke = colorStroke;
    text.style.fill = colorFill;

    const strokeOffset = ((100 - formattedScore) / 100) * 289.027;
    path.style.strokeDashoffset = strokeOffset + "px";

    text.textContent = formattedScoreText;
  }, [formattedScore]);

  return (
    <svg className="CircularProgressbar" viewBox="0 0 100 100" data-test-id="CircularProgressbar" ref={svgRef}>
      <circle
        className="CircularProgressbar-background"
        cx="50"
        cy="50"
        r="50"
        style={{
          fill:
            formattedScore < 50
              ? "rgb(204, 0, 0)"
              : formattedScore >= 51 && formattedScore <= 80
              ? "rgb(255, 170, 51)"
              : "rgb(0, 136, 0)",
          opacity: 0.1,
        }}
      />
      <path
        className="CircularProgressbar-trail"
        d="
          M 50,50
          m 0,-46
          a 46,46 0 1 1 0,92
          a 46,46 0 1 1 0,-92
        "
        strokeWidth="8"
        fillOpacity="0"
        style={{
          stroke: "rgba(255, 234, 234, 0.1)",
          strokeDasharray: "290px, 290px",
          strokeDashoffset: "0px",
        }}
      />
      <path
        className="CircularProgressbar-path"
        d="
          M 50,50
          m 0,-46
          a 46,46 0 1 1 0,92
          a 46,46 0 1 1 0,-92
        "
        strokeWidth="8"
        fillOpacity="0"
        style={{
          stroke:
            formattedScore < 50
              ? "rgb(204, 0, 0)"
              : formattedScore >= 51 && formattedScore <= 80
              ? "rgb(255, 170, 51)"
              : "rgb(0, 136, 0)",
          transitionDuration: "0.7s",
          strokeDasharray: "290px, 290px",
          strokeDashoffset: "280px",
        }}
      />
      <text className="CircularProgressbar-text" x="50" y="50" style={{ fill: "rgb(255, 51, 51)" }}>
        {formattedScoreText}
      </text>
    </svg>
  );
}
