import { Navigate, useNavigate } from 'react-router-dom';
import Button from '../components/global/Button';
import LoadingState from '../components/global/LoadingState';
import { useValidatedSession } from '../hooks/useValidatedSession';

// Exibe o acesso ao leitor para sessões válidas e envia visitantes ao login.
export default function HomePage() {
  const sessionStatus = useValidatedSession();
  const navigate = useNavigate();

  if (sessionStatus === 'checking') {
    return <LoadingState message="Checking your session..." />;
  }
  if (sessionStatus !== 'authenticated') return <Navigate to="/signin" replace />;

  return (
    <main className="page center">
      <Button type="button" onClick={() => navigate('/read')}>
        Read the book
      </Button>
    </main>
  );
}
