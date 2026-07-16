import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an unhandled exception:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center space-y-5">
          <div className="p-3 bg-red-950/30 border border-red-900 rounded-full">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          
          <div className="space-y-2 max-w-md">
            <h2 className="text-lg font-semibold tracking-tight">Something went wrong</h2>
            <p className="text-sm text-neutral-400">
              An unexpected layout crash occurred. Please retry the operation. If this persists, verify your local configuration.
            </p>
            {this.state.error && (
              <pre className="mt-3 p-3 bg-neutral-900 text-left text-xs font-mono text-red-400 border border-neutral-800 rounded overflow-x-auto max-w-lg">
                {this.state.error.toString()}
              </pre>
            )}
          </div>

          <button
            onClick={this.handleReset}
            className="px-4 py-2 text-xs font-medium bg-neutral-100 text-neutral-900 hover:bg-neutral-200 active:scale-95 rounded-md transition-all"
          >
            Reload Interface
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

