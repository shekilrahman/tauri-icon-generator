


// src/components/IconGenerationOptions.jsx
import React from 'react';

function IconGenerationOptions({ quality, setQuality, onGenerate, generating, progress }) {
  return (
    <div className="options-container">
      <h2>Generation Options</h2>
      
      <div className="option">
        <label htmlFor="quality">PNG Quality: {quality}%</label>
        <input
          type="range"
          id="quality"
          min="1"
          max="100"
          value={quality}
          onChange={(e) => setQuality(parseInt(e.target.value))}
          disabled={generating}
        />
      </div>
      
      <button 
        className="generate-button" 
        onClick={onGenerate} 
        disabled={generating}
      >
        {generating ? 'Generating...' : 'Generate Icons'}
      </button>
      
      {generating && (
        <div className="progress-container">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="progress-text">{progress}%</div>
        </div>
      )}
      
      <div className="info-box">
        <h3>What you'll get:</h3>
        <ul>
          <li>Windows icons in various sizes</li>
          <li>macOS icons in standard formats</li>
          <li>iOS icons for all required dimensions</li>
          <li>Android adaptive icons (standard, round, foreground)</li>
          <li>Linux icons in multiple resolutions</li>
        </ul>
        <p>All icons will be packaged in a ZIP file with the correct directory structure for Tauri.</p>
      </div>
    </div>
  );
}

export default IconGenerationOptions;