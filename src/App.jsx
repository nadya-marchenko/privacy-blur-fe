import { useState, useCallback, useEffect } from 'react';
import FileUpload from './components/FileUpload';
import ImagePreview from './components/ImagePreview';
import ProcessButton from './components/ProcessButton';
import ResultDisplay from './components/ResultDisplay';
import ErrorMessage from './components/ErrorMessage';
import RequirementsPage from './components/RequirementsPage';
import { detectFaces, fileToBase64 } from './services/visionApi';
import { blurFaces } from './utils/imageBlur';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [originalImageSrc, setOriginalImageSrc] = useState(null);
  const [processedImageSrc, setProcessedImageSrc] = useState(null);
  const [facesCount, setFacesCount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [stage, setStage] = useState('upload'); // 'upload', 'preview', 'result'
  const [view, setView] = useState('main'); // 'main' | 'requirements'

  // Handle file selection
  const handleFileSelect = useCallback((file) => {
    setSelectedFile(file);
    setError(null);
    setProcessedImageSrc(null);
    setFacesCount(0);
    
    // Create object URL for preview
    const objectUrl = URL.createObjectURL(file);
    setOriginalImageSrc(objectUrl);
    setStage('preview');
  }, []);

  // Handle image removal
  const handleRemoveImage = useCallback(() => {
    if (originalImageSrc) {
      URL.revokeObjectURL(originalImageSrc);
    }
    setSelectedFile(null);
    setOriginalImageSrc(null);
    setProcessedImageSrc(null);
    setFacesCount(0);
    setError(null);
    setStage('upload');
    setView('main');
  }, [originalImageSrc]);

  // Handle face detection and blurring
  const handleProcess = useCallback(async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setError(null);

    try {
      // Convert file to base64
      const base64Image = await fileToBase64(selectedFile);
      
      // Detect faces using Vision API
      const result = await detectFaces(base64Image);
      
      setFacesCount(result.count);

      if (result.count === 0) {
        setError('No faces detected in the image. Try uploading a different image with visible faces.');
        setIsProcessing(false);
        return;
      }

      // Apply blur to detected faces
      const blurredImageSrc = await blurFaces(originalImageSrc, result.faces, {
        blurRadius: 25,
        padding: 15,
        shape: 'ellipse',
        blurPasses: 2,
      });

      setProcessedImageSrc(blurredImageSrc);
      setStage('result');
    } catch (err) {
      console.error('Processing error:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsProcessing(false);
    }
  }, [selectedFile, originalImageSrc]);

  // Reset to upload stage
  const handleReset = useCallback(() => {
    handleRemoveImage();
  }, [handleRemoveImage]);

  const showRequirements = useCallback((event) => {
    if (event) {
      event.preventDefault();
    }
    setView('requirements');
  }, []);

  const showMainView = useCallback(() => {
    setView('main');
  }, []);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      if (originalImageSrc) {
        URL.revokeObjectURL(originalImageSrc);
      }
    };
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-cyan/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-coral/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-midnight-800/20 to-transparent rounded-full" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        {view === 'main' && (
          <>
            {/* Header */}
            <header className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-midnight-800/50 rounded-full text-xs text-midnight-300 mb-6">
                <span className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />
                <span>Powered by Google Cloud Vision API</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="gradient-text">Privacy Blur</span>
              </h1>
              <p className="text-lg text-midnight-400 max-w-xl mx-auto">
                Automatically detect and blur faces in your images to protect privacy. 
                Simply upload an image and let AI do the rest.
              </p>
            </header>

            {/* Main content area */}
            <main className="space-y-6">
              {/* Error message */}
              {error && (
                <ErrorMessage 
                  message={error} 
                  onDismiss={() => setError(null)} 
                />
              )}

              {/* Upload stage */}
              {stage === 'upload' && (
                <div className="animate-fadeIn">
                  <FileUpload 
                    onFileSelect={handleFileSelect}
                    disabled={isProcessing}
                  />
                </div>
              )}

              {/* Preview stage */}
              {stage === 'preview' && selectedFile && originalImageSrc && (
                <div className="space-y-6 animate-fadeIn">
                  <ImagePreview
                    file={selectedFile}
                    imageSrc={originalImageSrc}
                    onRemove={handleRemoveImage}
                  />
                  <ProcessButton
                    onClick={handleProcess}
                    isLoading={isProcessing}
                    disabled={!selectedFile || isProcessing}
                  />
                </div>
              )}

              {/* Result stage */}
              {stage === 'result' && processedImageSrc && (
                <div className="animate-fadeIn">
                  <ResultDisplay
                    originalSrc={originalImageSrc}
                    processedSrc={processedImageSrc}
                    facesCount={facesCount}
                    onReset={handleReset}
                  />
                </div>
              )}
            </main>
          </>
        )}

        {view === 'requirements' && (
          <main className="space-y-6">
            <header className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-3">
                <span className="gradient-text">Usage requirements &amp; privacy</span>
              </h1>
              <p className="text-sm md:text-base text-midnight-400 max-w-2xl mx-auto">
                Learn what you need to use the Google Cloud Vision features in this app and how they
                relate to GDPR and use in Europe.
              </p>
            </header>
            <RequirementsPage onBack={showMainView} />
          </main>
        )}

        {/* Footer */}
        <footer className="mt-16 text-center">
          <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 text-sm text-midnight-500">
            <div className="inline-flex items-center gap-2">
              <a 
                href="https://cloud.google.com/vision" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-accent-cyan transition-colors"
              >
                Cloud Vision API
              </a>
              <span className="w-1 h-1 rounded-full bg-midnight-600" />
              <span>Face Detection &amp; Blurring</span>
            </div>
            <span className="hidden md:inline-block w-1 h-1 rounded-full bg-midnight-600" />
            <button
              type="button"
              onClick={showRequirements}
              className="text-xs md:text-sm text-midnight-500 hover:text-accent-cyan underline underline-offset-4 decoration-midnight-700 hover:decoration-accent-cyan transition-colors"
            >
              Usage requirements &amp; GDPR information
            </button>
          </div>
          <p className="text-xs text-midnight-600 mt-3">
            Images are processed client-side. Only face coordinates are retrieved from the API.
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
