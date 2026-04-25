import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useEffect, useRef } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, openAuthModal } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const hasOpenedModal = useRef(false);

  useEffect(() => {
    if (!isAuthenticated && !hasOpenedModal.current) {
      hasOpenedModal.current = true;
      navigate('/', { replace: true, state: { from: location } });
      setTimeout(() => openAuthModal('login'), 100);
    }
  }, [isAuthenticated, navigate, location, openAuthModal]);

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
