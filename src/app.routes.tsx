import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthProvider';
import MainLayout from './layouts/MainLayout.tsx';
import Home from './routes';
import Login from './routes/login';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <Home />
          },
        ]
      }
    ]
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;
