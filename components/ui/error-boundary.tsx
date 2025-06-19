import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from './button';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can log the error to an error reporting service here
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[400px] w-full flex-col items-center justify-center gap-4 rounded-lg border border-destructive/50 bg-destructive/10 p-8 text-center">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <h2 className="text-2xl font-semibold text-destructive">
            Something went wrong
          </h2>
          <p className="text-muted-foreground">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <Button
            variant="outline"
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
          >
            Try again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export function ErrorMessage({ error }: { error: Error | string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
      <AlertCircle className="h-5 w-5" />
      <p className="text-sm">
        {typeof error === 'string' ? error : error.message}
      </p>
    </div>
  );
} 