import { Component, type ReactNode } from 'react';

interface State { error: Error | null }

/** Shows a readable message instead of a blank page if a tool crashes. */
export default class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null };
  static getDerivedStateFromError(error: Error): State {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div className="notice error" role="alert" style={{ margin: 16 }}>
          <strong>Something went wrong / कुछ गलत हो गया।</strong>
          <div className="small">{this.state.error.message}</div>
          <button type="button" className="btn btn-ghost" onClick={() => window.location.reload()}>
            Reload / रीलोड
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
