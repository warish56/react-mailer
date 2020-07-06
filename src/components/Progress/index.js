import React from "react";

import "./style.css";

const Progress = ({ progress }) => {
  return (
    <div className="progress-container">
      <div
        style={{
          transform: `translateX(-${100 - progress}%)`,
        }}
        className="progress-content"
      />
    </div>
  );
};

export default Progress;
