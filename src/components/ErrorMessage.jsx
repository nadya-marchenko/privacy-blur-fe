/**
 * ErrorMessage Component
 * Displays error messages with styling
 */
const ErrorMessage = ({ message, onDismiss }) => {
  if (!message) return null;

  return (
    <div className="flex items-start gap-3 p-4 bg-accent-coral/10 border border-accent-coral/30 rounded-xl animate-fadeIn">
      <div className="w-8 h-8 rounded-lg bg-accent-coral/20 flex items-center justify-center flex-shrink-0">
        <svg className="w-5 h-5 text-accent-coral" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-accent-coral">Error</p>
        <p className="text-sm text-midnight-200 mt-1">{message}</p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="p-1 rounded-lg text-midnight-400 hover:text-accent-coral hover:bg-midnight-800 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;

