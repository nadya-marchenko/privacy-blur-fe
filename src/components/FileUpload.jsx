import { useRef, useState, useCallback } from 'react';

/**
 * FileUpload Component
 * Handles image file selection via drag & drop or file picker
 */
const FileUpload = ({ onFileSelect, disabled = false }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragOver(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      validateAndSelectFile(files[0]);
    }
  }, [disabled, onFileSelect]);

  const handleFileInputChange = useCallback((e) => {
    const files = e.target.files;
    if (files.length > 0) {
      validateAndSelectFile(files[0]);
    }
  }, [onFileSelect]);

  const validateAndSelectFile = (file) => {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      alert('Please select a valid image file (JPG or PNG)');
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('File size must be less than 10MB');
      return;
    }

    onFileSelect(file);
  };

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div
      className={`file-drop-zone cursor-pointer group ${isDragOver ? 'dragover' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png"
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled}
      />
      
      <div className="flex flex-col items-center justify-center space-y-4">
        {/* Upload Icon */}
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${isDragOver ? 'bg-accent-cyan/20 scale-110' : 'bg-midnight-800 group-hover:bg-midnight-700'}`}>
          <svg 
            className={`w-8 h-8 transition-colors duration-300 ${isDragOver ? 'text-accent-cyan' : 'text-midnight-400 group-hover:text-accent-cyan'}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
            />
          </svg>
        </div>

        {/* Text */}
        <div className="text-center">
          <p className="text-lg font-medium text-midnight-100">
            {isDragOver ? 'Drop your image here' : 'Drag & drop an image'}
          </p>
          <p className="text-sm text-midnight-400 mt-1">
            or <span className="text-accent-cyan hover:underline">browse files</span>
          </p>
        </div>

        {/* Supported formats */}
        <div className="flex items-center gap-3 text-xs text-midnight-500">
          <span className="px-2 py-1 bg-midnight-800/50 rounded-lg">JPG</span>
          <span className="px-2 py-1 bg-midnight-800/50 rounded-lg">PNG</span>
          <span className="text-midnight-600">|</span>
          <span>Max 10MB</span>
        </div>
      </div>

      {/* Decorative corner elements */}
      <div className="absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 border-midnight-600 rounded-tl-lg opacity-50" />
      <div className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 border-midnight-600 rounded-tr-lg opacity-50" />
      <div className="absolute bottom-3 left-3 w-6 h-6 border-l-2 border-b-2 border-midnight-600 rounded-bl-lg opacity-50" />
      <div className="absolute bottom-3 right-3 w-6 h-6 border-r-2 border-b-2 border-midnight-600 rounded-br-lg opacity-50" />
    </div>
  );
};

export default FileUpload;

