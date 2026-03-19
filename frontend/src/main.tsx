import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Navigate, createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AuthProvider, useAuth } from './lib/auth'
import { SignIn } from './pages/SignIn'
import { SignUp } from './pages/SignUp'
import { VaultsPage } from './pages/Vaults'
import { SavePasswordPage } from './pages/SavePassword'

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { token } = useAuth()
  if (!token) return <Navigate to="/signin" replace />
  return <>{children}</>
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Navigate to="/app" replace /> },
      { path: 'signin', element: <SignIn /> },
      { path: 'signup', element: <SignUp /> },
      {
        path: 'app',
        element: (
          <RequireAuth>
            <Navigate to="/app/vaults" replace />
          </RequireAuth>
        ),
      },
      {
        path: 'app/vaults',
        element: (
          <RequireAuth>
            <VaultsPage />
          </RequireAuth>
        ),
      },
      {
        path: 'app/save',
        element: (
          <RequireAuth>
            <SavePasswordPage />
          </RequireAuth>
        ),
      },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
