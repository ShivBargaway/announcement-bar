import React from "react";

export default function FilledCircle({ color = "black", width = "10px", ...props }) {
  return (
    <div className="ProgressCircle">
      <div className="Circle-Box" style={{ height: width, width, ...props }}>
        <div
          className="pie full-circle"
          style={{
            "--p": 100,
            "--c": color,
            "--w": width,
            "--b": width,
            background: color,
            borderRadius: "100%",
            margin: "unset",
          }}
        />
      </div>
    </div>
  );
}
