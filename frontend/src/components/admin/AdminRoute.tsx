import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

// Bouclier d'authentification pour interdire l'accès au tableau de bord sans Token
export const AdminRoute = () => {
  const { token } = useAuthStore();
  
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  // Si le token existe, on affiche le Layout enfant (Dashboard)
  return <Outlet />;
};
