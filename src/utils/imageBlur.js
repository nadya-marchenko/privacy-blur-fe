/**
 * Image Blur Utility
 * Uses Canvas API to apply blur effects to specific regions
 */

/**
 * Apply blur effect to faces in an image
 * @param {string} imageSrc - Source URL or data URL of the image
 * @param {Array} faces - Array of face objects with bounding box info
 * @param {Object} options - Blur options
 * @returns {Promise<string>} - Data URL of the processed image
 */
export const blurFaces = (imageSrc, faces, options = {}) => {
  const {
    blurRadius = 40,
    padding = 20, // Extra padding around face bounds
    shape = 'ellipse', // 'rectangle' or 'ellipse'
    blurPasses = 3, // Number of blur passes for stronger effect
  } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      try {
        // Create main canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        
        // Draw original image
        ctx.drawImage(img, 0, 0);
        
        // Process each face
        faces.forEach((face) => {
          const box = getFaceBoundingBox(face);
          if (!box) return;
          
          // Add padding to the bounding box
          const paddedBox = {
            x: Math.max(0, box.x - padding),
            y: Math.max(0, box.y - padding),
            width: Math.min(canvas.width - box.x + padding, box.width + padding * 2),
            height: Math.min(canvas.height - box.y + padding, box.height + padding * 2),
          };
          
          // Apply blur to the face region
          applyBlurToRegion(ctx, paddedBox, blurRadius, shape, blurPasses);
        });
        
        // Convert canvas to data URL
        const dataUrl = canvas.toDataURL('image/png', 1.0);
        resolve(dataUrl);
      } catch (error) {
        reject(new Error(`Failed to process image: ${error.message}`));
      }
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image for processing'));
    };
    
    img.src = imageSrc;
  });
};

/**
 * Get bounding box from face annotation
 */
const getFaceBoundingBox = (face) => {
  const poly = face.fdBoundingPoly || face.boundingPoly;
  
  if (!poly?.vertices || poly.vertices.length < 4) {
    return null;
  }

  const vertices = poly.vertices;
  const xs = vertices.map(v => v.x || 0);
  const ys = vertices.map(v => v.y || 0);
  
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
};

/**
 * Apply heavy pixelation blur effect to a specific region
 * Uses aggressive downscaling + CSS blur filter for maximum anonymization
 */
const applyBlurToRegion = (ctx, box, blurRadius, shape, blurPasses) => {
  const { x, y, width, height } = box;
  
  // Create a temporary canvas for the face region
  const tempCanvas = document.createElement('canvas');
  const tempCtx = tempCanvas.getContext('2d');
  
  tempCanvas.width = width;
  tempCanvas.height = height;
  
  // Copy the face region to temp canvas
  tempCtx.drawImage(
    ctx.canvas,
    x, y, width, height,
    0, 0, width, height
  );
  
  // Heavy pixelation: scale down to very small size
  // The smaller the scale, the more pixelated/blurred the result
  const pixelSize = Math.max(8, Math.floor(blurRadius / 4));
  const smallWidth = Math.max(4, Math.floor(width / pixelSize));
  const smallHeight = Math.max(4, Math.floor(height / pixelSize));
  
  // Create pixelation canvas
  const pixelCanvas = document.createElement('canvas');
  const pixelCtx = pixelCanvas.getContext('2d');
  
  // Disable image smoothing for pixelated look during downscale
  pixelCanvas.width = smallWidth;
  pixelCanvas.height = smallHeight;
  pixelCtx.imageSmoothingEnabled = false;
  pixelCtx.drawImage(tempCanvas, 0, 0, smallWidth, smallHeight);
  
  // Create intermediate canvas for blur passes
  const blurCanvas = document.createElement('canvas');
  const blurCtx = blurCanvas.getContext('2d');
  blurCanvas.width = width;
  blurCanvas.height = height;
  
  // Scale back up with smoothing for initial blur
  blurCtx.imageSmoothingEnabled = true;
  blurCtx.imageSmoothingQuality = 'high';
  blurCtx.drawImage(pixelCanvas, 0, 0, width, height);
  
  // Apply multiple CSS blur passes for extra smoothing
  const blurAmount = Math.max(10, Math.floor(blurRadius / 2));
  
  for (let pass = 0; pass < blurPasses; pass++) {
    // Create pass canvas
    const passCanvas = document.createElement('canvas');
    const passCtx = passCanvas.getContext('2d');
    passCanvas.width = width;
    passCanvas.height = height;
    
    // Apply CSS blur filter
    passCtx.filter = `blur(${blurAmount}px)`;
    
    // Draw with extra margin to avoid edge artifacts
    const margin = blurAmount * 2;
    passCtx.drawImage(
      blurCanvas, 
      -margin, -margin, 
      width + margin * 2, height + margin * 2
    );
    
    // Copy back
    blurCtx.filter = 'none';
    blurCtx.drawImage(passCanvas, 0, 0);
  }
  
  // Apply the blurred region back to main canvas with shape mask
  ctx.save();
  
  if (shape === 'ellipse') {
    // Create elliptical clip path
    ctx.beginPath();
    ctx.ellipse(
      x + width / 2,
      y + height / 2,
      width / 2,
      height / 2,
      0,
      0,
      Math.PI * 2
    );
    ctx.clip();
  } else {
    // Create rounded rectangle clip path
    const radius = Math.min(width, height) * 0.15;
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, radius);
    ctx.clip();
  }
  
  // Draw blurred region
  ctx.drawImage(blurCanvas, x, y);
  
  ctx.restore();
};

/**
 * Download an image from a data URL
 * @param {string} dataUrl - The data URL of the image
 * @param {string} filename - The filename for download
 */
export const downloadImage = (dataUrl, filename = 'blurred-image.png') => {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Get image dimensions from a source
 * @param {string} src - Image source URL
 * @returns {Promise<{width: number, height: number}>}
 */
export const getImageDimensions = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };
    img.onerror = reject;
    img.src = src;
  });
};
