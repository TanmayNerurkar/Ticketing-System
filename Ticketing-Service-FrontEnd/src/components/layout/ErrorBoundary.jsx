import { Component } from 'react';
import { AlertTriangle } from 'lucide-react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-stone-50 p-8">
          <div className="max-w-md w-full bg-white border border-stone-200 rounded p-8 text-center">
            <AlertTriangle
              size={36}
              className="mx-auto text-amber-500 mb-4"
              strokeWidth={1.5}
            />
            <h1 className="text-2xl font-display font-medium text-stone-900 mb-2">
              Something went wrong.
            </h1>
            <p className="text-sm text-stone-600 mb-6">
              An unexpected error occurred. Please refresh the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-stone-900 text-stone-50 rounded text-sm font-medium hover:bg-stone-800"
            >
              Refresh page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}