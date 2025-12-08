import { Component } from 'react';
import './ErrorBoundary.module.scss';

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree
 */
class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Log error details to console
        console.error('Error caught by Error Boundary:', error, errorInfo);

        // Update state with error details
        this.setState({
            error,
            errorInfo
        });

        // TODO: Send error to error tracking service (e.g., Sentry)
        // logErrorToService(error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
    };

    render() {
        if (this.state.hasError) {
            // Fallback UI
            return (
                <div className="error-boundary">
                    <div className="error-boundary__content">
                        <h1>😕 Oops! Something went wrong</h1>
                        <p>We're sorry, but something unexpected happened.</p>

                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details className="error-boundary__details">
                                <summary>Error Details (Development Only)</summary>
                                <pre className="error-boundary__stack">
                                    {this.state.error.toString()}
                                    {this.state.errorInfo && this.state.errorInfo.componentStack}
                                </pre>
                            </details>
                        )}

                        <div className="error-boundary__actions">
                            <button
                                onClick={this.handleReset}
                                className="error-boundary__button error-boundary__button--primary"
                            >
                                Try Again
                            </button>
                            <button
                                onClick={() => window.location.reload()}
                                className="error-boundary__button error-boundary__button--secondary"
                            >
                                Reload Page
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
