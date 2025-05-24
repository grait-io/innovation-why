import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './auth.context';

const ProtectedRoute = () => {
  const auth = useAuth();  // Ensure context is handled if null
  const location = useLocation();
  console.log('auth', auth);
  if(!auth || !auth.user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
