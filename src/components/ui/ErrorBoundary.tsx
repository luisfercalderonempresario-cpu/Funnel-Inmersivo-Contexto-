import React, { ErrorInfo, ReactNode } from 'react';
import { ErrorScreen } from './ErrorScreen';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[Contexto ErrorBoundary] Caught error:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  private handleContinue = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <ErrorScreen
          onRetry={this.handleRetry}
          onContinue={this.handleContinue}
          title="INTERRUPCIÓN DE SEÑAL"
          description="Se ha producido un error inesperado al procesar la secuencia interactiva. Tu expediente se encuentra protegido."
        />
      );
    }

    return this.props.children;
  }
}
