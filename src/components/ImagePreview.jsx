import { useState } from 'react';

/**
 * ImagePreview Component
 * Displays uploaded image with file details
 */
const ImagePreview = ({ file, imageSrc, onRemove }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="glass-card p-4 animate-fadeIn">
      {/* Header with file info */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-cyan/20 to-accent-coral/20 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-accent-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-midnight-100 truncate" title={file.name}>
              {file.name}
            </p>
            <p className="text-xs text-midnight-400">
              {formatFileSize(file.size)}
            </p>
          </div>
        </div>
        
        <button
          onClick={onRemove}
          className="p-2 rounded-lg text-midnight-400 hover:text-accent-coral hover:bg-midnight-800 transition-colors"
          title="Remove image"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Image container */}
      <div className="image-container relative">
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-midnight-900">
            <div className="spinner" />
          </div>
        )}
        <img
          src={imageSrc}
          alt="Preview"
          className={`w-full h-auto max-h-[400px] object-contain transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setIsLoaded(true)}
        />
      </div>
    </div>
  );
};

export default ImagePreview;

