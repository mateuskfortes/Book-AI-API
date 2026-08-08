import React, {useMemo, useRef, useState} from 'react';
import { ReactReader } from 'react-reader';

const SAMPLE_EPUB = '/sample/moby-dick.epub';

function navigate(path) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

function AuthForm({ mode }) {
  const params = useMemo(() => new URLSearchParams(window.location.search), []);
  const [email, setEmail] = useState(params.get('email') || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(
    params.get('registered') === '1' ? 'Account created. Sign in now.' : ''
  );

  async function submit(event) {
    event.preventDefault();

    if (mode === 'signup' && password !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    const response = await fetch(mode === 'signup' ? '/api/auth/signup' : '/api/auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      setMessage(data.message || 'Authentication failed.');
      return;
    }

    localStorage.setItem('book-ai-token', data.token);
    navigate(mode === 'signup' ? `/signin?registered=1&email=${encodeURIComponent(email)}` : '/read');
  }

  return (
    <main className="page center">
      <form className="card" onSubmit={submit}>
        <h1>{mode === 'signup' ? 'Sign up' : 'Sign in'}</h1>
        <p>{mode === 'signup' ? 'Create an account' : 'Use your account'}</p>
        <div className="status">{message}</div>
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
        />
        {mode === 'signup' ? (
          <input
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            type="password"
            placeholder="Confirm password"
          />
        ) : null}
        <button type="submit">{mode === 'signup' ? 'Create account' : 'Login'}</button>
        <p>
          {mode === 'signup' ? (
            <a href="/signin" onClick={(e) => { e.preventDefault(); navigate('/signin'); }}>
              Sign in
            </a>
          ) : (
            <a href="/signup" onClick={(e) => { e.preventDefault(); navigate('/signup'); }}>
              Create account
            </a>
          )}
        </p>
      </form>
    </main>
  );
}


function ReaderPage() {
  const [location, setLocation] = useState(null);
  const [firstRenderDone, setFirstRenderDone] = useState(false);
  const renditionRef = useRef(null);
  const origin = useState(() =>   window.location.origin)[0];

  // Armazena a referência interna do epub.js para manipulações avançadas
  const locationChanged = (epubcifi) => {
    if (!firstRenderDone) {
      setFirstRenderDone(true);
      return;
    }
    setLocation(epubcifi);
  };

  return (
      <main className="page reader-page" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        {/* Topbar compacta e fixa */}
        <div className="reader-topbar" style={{ height: '50px', padding: '0 20px', display: 'flex', alignItems: 'center', gap: '15px', borderBottom: '1px solid #e0e0e0', background: '#fff' }}>
          <a href="/signin" onClick={(e) => { e.preventDefault(); navigate('/signin'); }} style={{ color: '#007bff', textDecoration: 'none' }}>Sign in</a>
          <a href="/signup" onClick={(e) => { e.preventDefault(); navigate('/signup'); }} style={{ color: '#007bff', textDecoration: 'none' }}>Sign up</a>
        </div>

        {/* Container do Leitor ocupando o restante da tela inteira */}
        <div className="reader-card" style={{ flex: 1, position: 'relative', background: '#fcfbfa' }}>
          <ReactReader
              url={(origin + SAMPLE_EPUB)}
              location={location}
              locationChanged={locationChanged}
              getRendition={(rendition) => {
                renditionRef.current = rendition;

                // Injeta os estilos CSS necessários para liberar a seleção de texto
                rendition.themes.default({
                  'body': {
                    'font-family': '"Helvetica Neue", Helvetica, Arial, sans-serif !important',
                    'color': '#2b2b2b !important',
                    'line-height': '1.6 !important',
                    '-webkit-user-select': 'text !important', /* Safari */
                    '-moz-user-select': 'text !important',    /* Firefox */
                    '-ms-user-select': 'text !important',     /* IE/Edge */
                    'user-select': 'text !important'          /* Padrão (Chrome, etc.) */
                  },
                  'p': {
                    'font-size': '16px !important',
                    'margin-bottom': '1.2em !important'
                  }
                });
              }}
              readerStyles={{
                ...customReaderStyles,
                reader: {
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                },
                // Mantém o clique nas bordas sem bloquear a seleção de texto no meio da página
                prev: {
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  bottom: 0,
                  width: '10%', /* Reduzido levemente para dar mais margem de seleção no centro */
                  zIndex: 10,
                  cursor: 'pointer',
                },
                next: {
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  bottom: 0,
                  width: '10%',
                  zIndex: 10,
                  cursor: 'pointer',
                }
              }}
              epubOptions={{
                allowScriptedContent: false,
                flow: 'paginated'
              }}
              loadingView={<div>Carregando livro...</div>}
          />


        </div>
      </main>
  )
}

// Estilos customizados para os botões de navegação do próprio ReactReader
const customReaderStyles = {
  tocArea: {
    background: '#ffffff',
    transition: 'all 0.3s ease',
    borderRight: '1px solid #e0e0e0'
  },
  arrow: {
    background: 'rgba(0, 0, 0, 0.05)',
    color: '#333',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 10px'
  }
};


export default function App() {
  const [route, setRoute] = useState(`${window.location.pathname}${window.location.search}`);

  React.useEffect(() => {
    const onPop = () => setRoute(`${window.location.pathname}${window.location.search}`);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const path = route.split('?')[0];

  if (path === '/signup') return <AuthForm key={route} mode="signup" />;
  if (path === '/read') return <ReaderPage key={route} />;
  return <AuthForm key={route} mode="signin" />;
}
