/**
 * Google Cloud Vision API Service
 * Handles face detection requests
 */

const VISION_API_URL = 'https://vision.googleapis.com/v1/images:annotate';

/**
 * Get the API key from environment variables
 * Supports both Vite (VITE_) and Create React App (REACT_APP_) prefixes
 */
const getApiKey = () => {
  // Vite environment variable
  if (import.meta.env.VITE_GOOGLE_CLOUD_API_KEY) {
    return import.meta.env.VITE_GOOGLE_CLOUD_API_KEY;
  }
  
  // Fallback for other build systems
  if (typeof process !== 'undefined' && process.env?.REACT_APP_GOOGLE_CLOUD_API_KEY) {
    return process.env.REACT_APP_GOOGLE_CLOUD_API_KEY;
  }
  
  return null;
};

/**
 * Convert image file to base64 string
 * @param {File} file - The image file to convert
 * @returns {Promise<string>} - Base64 encoded image without data URL prefix
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

/**
 * Detect faces in an image using Google Cloud Vision API
 * @param {string} base64Image - Base64 encoded image
 * @returns {Promise<Object>} - Face detection results
 */
export const detectFaces = async (base64Image) => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    throw new Error(
      'Google Cloud API key not found. Please set VITE_GOOGLE_CLOUD_API_KEY in your .env file.'
    );
  }

  const requestBody = {
    requests: [
      {
        image: {
          content: base64Image,
        },
        features: [
          {
            type: 'FACE_DETECTION',
            maxResults: 50, // Maximum number of faces to detect
          },
        ],
      },
    ],
  };

  try {
    const response = await fetch(`${VISION_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData.error?.message || `API request failed with status ${response.status}`;
      throw new Error(errorMessage);
    }

    const data = await response.json();
    
    // Extract face annotations from response
    const faceAnnotations = data.responses?.[0]?.faceAnnotations || [];
    
    // Transform the response to a simpler format
    const faces = faceAnnotations.map((face, index) => ({
      id: index,
      boundingPoly: face.boundingPoly,
      fdBoundingPoly: face.fdBoundingPoly, // Face detection bounding poly (tighter fit)
      confidence: face.detectionConfidence,
      landmarks: face.landmarks,
      rollAngle: face.rollAngle,
      panAngle: face.panAngle,
      tiltAngle: face.tiltAngle,
    }));

    return {
      faces,
      count: faces.length,
      raw: data.responses?.[0],
    };
  } catch (error) {
    if (error.message.includes('API key')) {
      throw error;
    }
    throw new Error(`Face detection failed: ${error.message}`);
  }
};

/**
 * Get bounding box coordinates from face annotation
 * @param {Object} face - Face annotation object
 * @returns {Object} - { x, y, width, height }
 */
export const getFaceBoundingBox = (face) => {
  // Use fdBoundingPoly for a tighter fit around the face, fallback to boundingPoly
  const poly = face.fdBoundingPoly || face.boundingPoly;
  
  if (!poly?.vertices || poly.vertices.length < 4) {
    return null;
  }

  const vertices = poly.vertices;
  
  // Handle cases where x or y might be undefined (means 0)
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

