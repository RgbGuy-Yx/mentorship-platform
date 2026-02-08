import { Component } from 'react';
import { AlertCircle } from 'lucide-react';

/**
 * Error Boundary Component
 * 
 * Catches errors in child components and displays a fallback UI
 * Prevents entire app from crashing when a component has an error
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full bg-white rounded-lg border border-gray-200 p-8 text-center shadow-lg">
            <AlertCircle className="mx-auto text-red-600 mb-4" size={48} />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h1>
            <p className="text-gray-600 mb-6">
              We encountered an error while rendering this page. Please try refreshing the page.
            </p>
            <details className="mb-6 text-left bg-gray-50 p-4 rounded border border-gray-200">
              <summary className="font-semibold text-gray-700 cursor-pointer mb-2">
                Error Details
              </summary>
              <pre className="text-xs text-red-600 overflow-auto max-h-40">
                {this.state.error?.toString()}
              </pre>
            </details>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
