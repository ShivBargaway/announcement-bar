import React from "react";

export default function OnBoardingSteps(props) {
  const { field, stepCount } = props;

  return (
    <div className="col-md-6 col-md-offset-3">
      <ul className="progressbar">
        {field.map((item) => (
          <li key={item.step} className={stepCount >= item.step ? "active" : ""}>
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
