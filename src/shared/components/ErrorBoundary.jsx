import { AlertTriangle, Home,RefreshCw } from 'lucide-react';
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-950 transition-colors">
          <div className="max-w-md w-full p-10 glass-card rounded-[3rem] text-center space-y-8 border-2 border-rose-500/20 shadow-2xl shadow-rose-500/10">
            <div className="w-24 h-24 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto text-rose-500">
              <AlertTriangle size={48} />
            </div>
            <div className="space-y-3">
              <h1 className="text-3xl font-black font-outfit text-gray-900 dark:text-white">Something went wrong</h1>
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                An unexpected error occurred. Don't worry, our team has been notified.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => window.location.reload()}
                className="w-full py-4 bg-yellow-500 hover:bg-yellow-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-yellow-500/20 flex items-center justify-center gap-2"
              >
                <RefreshCw size={18} /> Refresh Page
              </button>
              <a 
                href="/"
                className="w-full py-4 bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2"
              >
                <Home size={18} /> Back to Home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
