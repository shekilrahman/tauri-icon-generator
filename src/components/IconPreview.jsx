
// src/components/IconPreview.jsx
import React from 'react';

function IconPreview({ image }) {
  return (
    <div className="preview-container">
      <h2>Preview</h2>
      <div className="preview-image">
        <img src={image} alt="Icon preview" />
      </div>
      <p className="preview-caption">Your uploaded icon</p>
    </div>
  );
}

export default IconPreview;