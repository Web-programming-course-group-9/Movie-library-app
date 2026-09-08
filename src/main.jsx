import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Authentication from './screens/Authentication.jsx'
import { AuthenticationMode } from './screens/authenticationMode.js'
import NotFound from './screens/NotFound.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import UserProvider from './context/UserProvider.jsx'

const router = createBrowserRouter([
  {
    errorElement: <NotFound />,
  },
  {
    path: '/signin',
    element: <Authentication authenticationMode={AuthenticationMode.SignIn} />,
  },
  {
    path: '/signup',
    element: <Authentication authenticationMode={AuthenticationMode.SignUp} />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <App />,
      },
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </StrictMode>,
)
