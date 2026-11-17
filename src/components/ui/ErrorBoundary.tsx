"use client";

import { Component, ReactNode, ErrorInfo } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { SmartButton } from "./SmartButton";
import { Icon } from "./Icon";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  /** Changing any value clears the error, so a retry can actually recover. */
  resetKeys?: unknown[];
  onError?: (error: Error, info: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false, error: null };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidUpdate(prevProps: Props) {
    if (!this.state.hasError || !this.props.resetKeys) return;
    const prev = prevProps.resetKeys ?? [];
    const next = this.props.resetKeys;
    const changed = next.length !== prev.length || next.some((v, i) => !Object.is(v, prev[i]));
    if (changed) this.setState({ hasError: false, error: null });
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Replace with the real reporter (Sentry) when the observability layer lands.
    console.error("Uncaught error:", error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (!this.state.hasError) return this.props.children;
    if (this.props.fallback) return this.props.fallback;

    return (
      <div
        role="alert"
        className="flex flex-col items-center justify-center p-12 rounded-2xl border border-semantic-error/20 bg-semantic-error/5 text-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-semantic-error/10 flex items-center justify-center mb-6 text-semantic-error">
          <Icon icon={AlertTriangle} size={28} />
        </div>
        <h3 className="text-lg font-display font-bold text-ink-900 dark:text-white mb-2">
          Something went wrong
        </h3>
        <p className="text-sm text-ink-500 dark:text-ink-300 max-w-md mb-8">
          We encountered an unexpected error. Our team has been notified. Please try again.
        </p>
        <SmartButton featureKey="global.retry_action" onClick={this.handleRetry} leftIcon={RefreshCw}>
          Try Again
        </SmartButton>
      </div>
    );
  }
}
