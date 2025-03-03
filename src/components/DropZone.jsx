// src/components/DropZone.jsx
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

function DropZone({ onImageUpload }) {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      onImageUpload(acceptedFiles[0]);
    }
  }, [onImageUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.svg']
    },
    multiple: false
  });

  return (
    <div 
      {...getRootProps()} 
      className={`dropzone ${isDragActive ? 'active' : ''}`}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the image here...</p>
      ) : (
        <div>
          <p>Drag & drop an image here, or click to select</p>
          <p className="dropzone-hint">(PNG with transparency recommended, min 1024x1024px)</p>
        </div>
      )}
    </div>
  );
}

export default DropZone;