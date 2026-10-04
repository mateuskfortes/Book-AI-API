import { Navigate, Outlet } from 'react-router-dom';
import LoadingState from '../components/global/LoadingState';
import { useValidatedSession } from '../hooks/useValidatedSession';

// Só exibe as rotas filhas quando o backend confirma o JWT salvo.
export default function RequireSession() {
  const sessionStatus = useValidatedSession();

  if (sessionStatus === 'checking') return <LoadingState message="Checking your session..." />;
  if (sessionStatus !== 'authenticated') return <Navigate to="/signin" replace />;

  return <Outlet />;
}
