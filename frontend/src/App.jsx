import { useEffect, useState } from 'react';
import AuthForm from './components/AuthForm';
import ReaderPage from './components/ReaderPage';

// Controla as rotas públicas do frontend sem introduzir um roteador adicional.
export default function App() {
  const [route, setRoute] = useState(`${window.location.pathname}${window.location.search}`);

  // Mantém a tela sincronizada com navegações feitas pela History API.
  useEffect(() => {
    const onPop = () => setRoute(`${window.location.pathname}${window.location.search}`);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const path = route.split('?')[0];

  if (path === '/signup') return <AuthForm key={route} mode="signup" />;
  if (path === '/read') return <ReaderPage key={route} />;
  return <AuthForm key={route} mode="signin" />;
}
