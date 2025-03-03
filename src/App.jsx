// src/App.jsx
import React, { useState, useRef } from 'react';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import './App.css';
import IconPreview from './components/IconPreview';
import DropZone from './components/DropZone';
import IconGenerationOptions from './components/IconGenerationOptions';

function App() {
  const [image, setImage] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [quality, setQuality] = useState(90);
  const [generatingIcons, setGeneratingIcons] = useState(false);
  const [progress, setProgress] = useState(0);
  const canvasRef = useRef(null);

  const handleImageUpload = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          setImage(img);
          setImageData(e.target.result);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const resizeImage = (img, width, height) => {
    const canvas = canvasRef.current;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw the image on the canvas with resizing
    ctx.drawImage(img, 0, 0, width, height);
    
    // Return as PNG
    return canvas.toDataURL('image/png', quality / 100);
  };

  const makeRoundImage = (img, size) => {
    const canvas = canvasRef.current;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Create a circular clipping path
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    
    // Draw the image inside the circular clipping path
    ctx.drawImage(img, 0, 0, size, size);
    
    // Return as PNG
    return canvas.toDataURL('image/png', quality / 100);
  };

  const dataURLtoBlob = (dataURL) => {
    const parts = dataURL.split(';base64,');
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const uInt8Array = new Uint8Array(raw.length);
    
    for (let i = 0; i < raw.length; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }
    
    return new Blob([uInt8Array], { type: contentType });
  };

  const generateIcons = async () => {
    if (!image) return;
    
    setGeneratingIcons(true);
    setProgress(0);
    
    const zip = new JSZip();
    
    try {
      // Define icon sizes for different platforms
      const icons = {
        // Windows icons
        'icons/32x32.png': [32, 32],
        
        // macOS icons
        'icons/128x128.png': [128, 128],
        'icons/128x128@2x.png': [256, 256],
        'icons/32x32@2x.png': [64, 64],
        'icons/icon.png': [1024, 1024],
        
        // iOS icons
        'icons/ios/16.png': [16, 16],
        'icons/ios/20.png': [20, 20],
        'icons/ios/29.png': [29, 29],
        'icons/ios/32.png': [32, 32],
        'icons/ios/40.png': [40, 40],
        'icons/ios/50.png': [50, 50],
        'icons/ios/57.png': [57, 57],
        'icons/ios/58.png': [58, 58],
        'icons/ios/60.png': [60, 60],
        'icons/ios/64.png': [64, 64],
        'icons/ios/72.png': [72, 72],
        'icons/ios/76.png': [76, 76],
        'icons/ios/80.png': [80, 80],
        'icons/ios/87.png': [87, 87],
        'icons/ios/100.png': [100, 100],
        'icons/ios/114.png': [114, 114],
        'icons/ios/120.png': [120, 120],
        'icons/ios/128.png': [128, 128],
        'icons/ios/144.png': [144, 144],
        'icons/ios/152.png': [152, 152],
        'icons/ios/167.png': [167, 167],
        'icons/ios/180.png': [180, 180],
        'icons/ios/192.png': [192, 192],
        'icons/ios/256.png': [256, 256],
        'icons/ios/512.png': [512, 512],
        'icons/ios/1024.png': [1024, 1024],
        
        // Linux icons
        'icons/256x256.png': [256, 256],
        'icons/512x512.png': [512, 512],
        'icons/1024x1024.png': [1024, 1024],
      };
      
      // Android icons
      const androidDensities = {
        "android/mipmap-mdpi": 48,
        "android/mipmap-hdpi": 72,
        "android/mipmap-xhdpi": 96,
        "android/mipmap-xxhdpi": 144,
        "android/mipmap-xxxhdpi": 192,
      };
      
      // Generate standard icons
      const totalItems = Object.keys(icons).length + Object.keys(androidDensities).length * 3;
      let processedItems = 0;
      
      for (const [path, [width, height]] of Object.entries(icons)) {
        const dataURL = resizeImage(image, width, height);
        const blob = dataURLtoBlob(dataURL);
        zip.file(path, blob);
        
        processedItems++;
        setProgress(Math.round((processedItems / totalItems) * 100));
        
        // Allow UI to update by yielding to the event loop
        await new Promise(resolve => setTimeout(resolve, 0));
      }
      
      // Generate Android icons
      for (const [densityPath, size] of Object.entries(androidDensities)) {
        // Standard launcher icon
        const launcherURL = resizeImage(image, size, size);
        const launcherBlob = dataURLtoBlob(launcherURL);
        zip.file(`${densityPath}/ic_launcher.png`, launcherBlob);
        
        // Foreground icon
        const foregroundURL = resizeImage(image, size, size);
        const foregroundBlob = dataURLtoBlob(foregroundURL);
        zip.file(`${densityPath}/ic_launcher_foreground.png`, foregroundBlob);
        
        // Round icon
        const roundURL = makeRoundImage(image, size);
        const roundBlob = dataURLtoBlob(roundURL);
        zip.file(`${densityPath}/ic_launcher_round.png`, roundBlob);
        
        processedItems += 3;
        setProgress(Math.round((processedItems / totalItems) * 100));
        
        // Allow UI to update by yielding to the event loop
        await new Promise(resolve => setTimeout(resolve, 0));
      }
      
      // Generate the zip file
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, 'tauri-icons.zip');
      
    } catch (error) {
      console.error('Error generating icons:', error);
      alert(`Error generating icons: ${error.message}`);
    } finally {
      setGeneratingIcons(false);
      setProgress(0);
    }
  };

  return (
    <div className="app-container">
      <h1>Tauri Icon Generator</h1>
      <p className="description">
        Upload an image to generate all the required icons for your Tauri application
      </p>
      
      <DropZone onImageUpload={handleImageUpload} />
      
      {image && (
        <>
          <IconPreview image={imageData} />
          
          <IconGenerationOptions 
            quality={quality}
            setQuality={setQuality}
            onGenerate={generateIcons}
            generating={generatingIcons}
            progress={progress}
          />
        </>
      )}
      
      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}

export default App;