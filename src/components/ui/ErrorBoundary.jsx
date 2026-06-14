import { Component } from 'react'
import { ErrorState } from './index'

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error', error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 bg-white/50 backdrop-blur-md rounded-2xl border border-red-500/10">
          <ErrorState
            message={this.state.error?.message || 'A rendering error occurred in this section of the app.'}
            onRetry={this.handleRetry}
          />
        </div>
      )
    }

    return this.props.children
  }
}
