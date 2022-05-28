// Create error boundary component for handling errors
import { Component, PropsWithChildren } from "react";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    console.log(error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h1>Something went wrong</h1>;
        </div>
      );
    }
    return this.props.children;
  }
}
