import * as Sentry from '@sentry/react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.jsx'

// Error reporting (Sentry, project tnt-website): production builds only, so
// local development never reports. The DSN only lets a browser submit events;
// it is not a secret.
if (import.meta.env.PROD) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN ||
      'https://24758042b6500e385d741ccc8b6ba033@o4512256302710784.ingest.de.sentry.io/4512256452395088',
    environment: 'production',
    tracesSampleRate: 0,
    sendDefaultPii: false,
  })
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      refetchOnWindowFocus: false,
    },
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Sentry.ErrorBoundary fallback={<p style={{ padding: 24, fontFamily: 'sans-serif' }}>Something went wrong. Please refresh the page.</p>}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </Sentry.ErrorBoundary>
  </StrictMode>,
)
