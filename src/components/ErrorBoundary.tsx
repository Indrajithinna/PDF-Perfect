import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return {
            hasError: true,
            error,
            errorInfo: null,
        };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
        this.setState({
            error,
            errorInfo,
        });
    }

    private handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
    };

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-600 p-4">
                    <div className="glass-card max-w-2xl w-full p-8 text-center">
                        <div className="mb-6">
                            <AlertTriangle className="w-20 h-20 text-red-500 mx-auto mb-4" />
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">
                                Oops! Something went wrong
                            </h1>
                            <p className="text-gray-600">
                                We're sorry for the inconvenience. An unexpected error has occurred.
                            </p>
                        </div>

                        {this.state.error && (
                            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg text-left">
                                <p className="font-semibold text-red-800 mb-2">Error Details:</p>
                                <p className="text-sm text-red-700 font-mono break-all">
                                    {this.state.error.toString()}
                                </p>
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={this.handleReset}
                                className="btn-primary flex items-center justify-center gap-2"
                            >
                                <RefreshCw className="w-5 h-5" />
                                Try Again
                            </button>
                            <button
                                onClick={() => window.location.href = '/'}
                                className="btn-secondary"
                            >
                                Go to Home
                            </button>
                        </div>

                        <div className="mt-6 text-sm text-gray-500">
                            <p>If this problem persists, please contact support.</p>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
