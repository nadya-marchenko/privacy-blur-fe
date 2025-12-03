import { useState } from 'react';
import { downloadImage } from '../utils/imageBlur';

/**
 * ResultDisplay Component
 * Shows before/after comparison and download option
 */
const ResultDisplay = ({ originalSrc, processedSrc, facesCount, onReset }) => {
  const [viewMode, setViewMode] = useState('split'); // 'split', 'original', 'processed'
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = () => {
    setIsDownloading(true);
    try {
      const timestamp = new Date().toISOString().slice(0, 10);
      downloadImage(processedSrc, `privacy-blur-${timestamp}.png`);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setTimeout(() => setIsDownloading(false), 1000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Bar */}
      <div className="glass-card p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Faces detected badge */}
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-accent-cyan/10 to-accent-coral/10 rounded-xl border border-accent-cyan/20">
              <div className="w-8 h-8 rounded-lg bg-accent-cyan/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-accent-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-midnight-400">Faces Detected</p>
                <p className="text-lg font-bold text-accent-cyan">{facesCount}</p>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center gap-2 text-sm text-green-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Processing complete</span>
            </div>
          </div>

          {/* View mode toggle */}
          <div className="flex items-center gap-1 p-1 bg-midnight-800/50 rounded-xl">
            {['split', 'original', 'processed'].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                  viewMode === mode
                    ? 'bg-accent-cyan text-midnight-950'
                    : 'text-midnight-300 hover:text-midnight-100'
                }`}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Image Comparison */}
      <div className="glass-card p-4 overflow-hidden">
        {viewMode === 'split' ? (
          <div className="grid md:grid-cols-2 gap-4">
            {/* Original */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-midnight-300">
                <span className="w-2 h-2 rounded-full bg-midnight-500" />
                <span>Original</span>
              </div>
              <div className="image-container">
                <img
                  src={originalSrc}
                  alt="Original"
                  className="w-full h-auto max-h-[400px] object-contain"
                />
              </div>
            </div>

            {/* Processed */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-midnight-300">
                <span className="w-2 h-2 rounded-full bg-accent-cyan" />
                <span>Blurred</span>
              </div>
              <div className="image-container">
                <img
                  src={processedSrc}
                  alt="Processed with blurred faces"
                  className="w-full h-auto max-h-[400px] object-contain"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="image-container">
            <img
              src={viewMode === 'original' ? originalSrc : processedSrc}
              alt={viewMode === 'original' ? 'Original' : 'Processed'}
              className="w-full h-auto max-h-[600px] object-contain"
            />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="btn-primary flex items-center gap-2"
        >
          {isDownloading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Downloading...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Download Image</span>
            </>
          )}
        </button>

        <button
          onClick={onReset}
          className="px-6 py-3 font-medium text-midnight-300 hover:text-white bg-midnight-800/50 hover:bg-midnight-700 rounded-xl transition-all duration-300 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Process Another Image</span>
        </button>
      </div>
    </div>
  );
};

export default ResultDisplay;

