import React, { useEffect, useRef } from "react";

export default function ProgressCircle({
  score,
  width = "150px",
  border = "20px",
  fontSize = "24px",
  color,
  showLightColor,
  restartAnimation = true, // New prop with default value
  removePercentage = false,
}) {
  const circleRef = useRef(null);

  const normalizedScore = Math.min(Math.max(score, 0), 100);
  const roundedScore = Math.round(normalizedScore);
  const prevScoreRef = useRef(roundedScore);

  const circleColor =
    color ||
    (normalizedScore > 75
      ? "rgba(0, 122, 92, 1)"
      : normalizedScore > 50
      ? "rgba(183, 126, 11, 1)"
      : "rgba(197, 40, 12, 1)");

  const lightColor = () => {
    if (color || !showLightColor) return "none";
    else if (normalizedScore > 75) return "rgba(205, 254, 212, 1)";
    else if (normalizedScore > 50) return "rgba(255, 241, 227, 1)";
    else return "rgba(254, 232, 235, 1)";
  };

  useEffect(() => {
    const circle = circleRef.current;
    if (!circle) return;

    const radius = circle.r.baseVal.value;
    const circumference = radius * 2 * Math.PI;

    circle.style.strokeDasharray = `${circumference} ${circumference}`;

    const offset = circumference - (normalizedScore / 100) * circumference;

    if (restartAnimation) {
      // Reset to initial state before starting the animation
      circle.style.transition = "none";
      circle.style.strokeDashoffset = circumference;

      // Trigger a reflow to apply the initial state
      circle.getBoundingClientRect();

      // Start the animation with the new score
      circle.style.transition = "stroke-dashoffset 0.5s ease-out";
      circle.style.strokeDashoffset = offset;
    } else {
      // Animate from previous score to new score
      const prevOffset = circumference - (prevScoreRef.current / 100) * circumference;
      circle.style.strokeDashoffset = prevOffset;

      // Trigger a reflow to apply the previous offset
      circle.getBoundingClientRect();

      // Animate to the new offset
      circle.style.transition = "stroke-dashoffset 0.5s ease-out";
      circle.style.strokeDashoffset = offset;
    }

    // Update the previous score
    prevScoreRef.current = normalizedScore;
  }, [normalizedScore, restartAnimation]);

  const size = parseInt(width);
  const strokeWidth = parseInt(border);
  const radius = (size - strokeWidth) / 2;
  const viewBox = `0 0 ${size} ${size}`;

  return (
    <div className="ProgressCircle">
      {" "}
      <svg width={width} height={width} viewBox={viewBox}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill={lightColor()}
          stroke="#D9D9D9"
          strokeWidth={strokeWidth}
        />
        <circle
          ref={circleRef}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={circleColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dy=".3em"
          fontSize={fontSize}
          fill={showLightColor && !color ? circleColor : "black"}
        >
          {Math.round(roundedScore)}
          {!removePercentage && "%"}
        </text>
      </svg>
    </div>
  );
}
