import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { LanguageProvider } from './context/LanguageContext';
import { ClerkAuthProvider } from './context/ClerkAuthProvider';
import './index.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Unhandled React Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', fontFamily: 'sans-serif', textAlign: 'center', background: '#101D35', color: '#FFFFFF', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h1 style={{ color: '#D9A441', fontSize: '2rem', marginBottom: '16px', fontFamily: 'Montserrat, sans-serif' }}>Shloka Yatra 2027</h1>
          <p style={{ maxWidth: '600px', marginBottom: '24px', color: '#E2E8F0' }}>
            We encountered a display issue while loading this page. Please refresh or return to the home page.
          </p>
          <pre style={{ background: 'rgba(0,0,0,0.4)', padding: '16px', borderRadius: '8px', color: '#F87171', fontSize: '0.85rem', maxWidth: '800px', overflowX: 'auto', textAlign: 'left' }}>
            {this.state.error?.toString()}
          </pre>
          <button
            onClick={() => { window.location.href = '/'; }}
            style={{ marginTop: '24px', padding: '12px 28px', borderRadius: '999px', background: '#D9A441', color: '#101D35', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
          >
            Reload Home Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter basename={import.meta.env.BASE_URL || '/'}>
        <ClerkAuthProvider>
          <LanguageProvider>
            <App />
          </LanguageProvider>
        </ClerkAuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
