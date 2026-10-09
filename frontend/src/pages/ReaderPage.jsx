import { useEffect, useRef, useState } from 'react';
import { ReactReader, ReactReaderStyle } from 'react-reader';
import { useNavigate } from 'react-router-dom';
import ReaderToolbar from '../components/reader/ReaderToolbar';
import { clearStoredToken } from '../utils/tokenStorage';
import './reader.css';

const SAMPLE_EPUB = '/sample/moby-dick.epub';

// Exibe o EPUB e mantém a navegação por clique nas laterais da página.
export default function ReaderPage() {
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [firstRenderDone, setFirstRenderDone] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const renditionRef = useRef(null);
  const readerPageRef = useRef(null);
  const fullscreenHistoryRef = useRef(false);
  const origin = useState(() => window.location.origin)[0];

  useEffect(() => {
    // Sincroniza o estado React quando o navegador entra ou sai de fullscreen.
    const handleFullscreenChange = () => {
      const active = document.fullscreenElement === readerPageRef.current;
      setIsFullscreen(active);

      // Remove a entrada auxiliar criada para o botão quando Esc encerra fullscreen.
      if (!active && fullscreenHistoryRef.current) {
        fullscreenHistoryRef.current = false;
        if (window.history.state?.readerFullscreen) window.history.back();
      }
    };

    // O voltar deve encerrar fullscreen antes de trocar a rota do leitor.
    const handlePopState = () => {
      if (fullscreenHistoryRef.current && document.fullscreenElement === readerPageRef.current) {
        fullscreenHistoryRef.current = false;
        void document.exitFullscreen();
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    window.addEventListener('popstate', handlePopState);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Ignora a posição inicial do leitor para evitar uma mudança visual falsa.
  const locationChanged = (epubcifi) => {
    if (!firstRenderDone) {
      setFirstRenderDone(true);
      return;
    }
    setLocation(epubcifi);
  };

  // Entra em fullscreen e cria uma entrada auxiliar para o botão voltar.
  const enterFullscreen = async () => {
    if (!readerPageRef.current?.requestFullscreen || document.fullscreenElement) return;

    await readerPageRef.current.requestFullscreen();
    window.history.pushState({ ...window.history.state, readerFullscreen: true }, '', window.location.href);
    fullscreenHistoryRef.current = true;
  };

  // Apaga o token local e retorna à autenticação pelo roteador React.
  const handleLogout = () => {
    clearStoredToken();
    navigate('/signin');
  };

  return (
    <main
      ref={readerPageRef}
      className={`page reader-page${isFullscreen ? ' is-fullscreen' : ''}`}
    >
      <ReaderToolbar
        isFullscreen={isFullscreen}
        onEnterFullscreen={enterFullscreen}
        onLogout={handleLogout}
      />

      <div className="reader-card">
        <ReactReader
          url={origin + SAMPLE_EPUB}
          location={location}
          locationChanged={locationChanged}
          getRendition={(rendition) => {
            renditionRef.current = rendition;

            // Libera seleção de texto e mantém a leitura legível dentro do EPUB.
            rendition.themes.default({
              body: {
                'font-family': '"Helvetica Neue", Helvetica, Arial, sans-serif !important',
                color: '#2b2b2b !important',
                'line-height': '1.6 !important',
                '-webkit-user-select': 'text !important',
                '-moz-user-select': 'text !important',
                '-ms-user-select': 'text !important',
                'user-select': 'text !important'
              },
              p: {
                'font-size': '16px !important',
                'margin-bottom': '1.2em !important'
              }
            });
          }}
          readerStyles={customReaderStyles}
          epubOptions={{ allowScriptedContent: false, flow: 'paginated' }}
          loadingView={<div>Carregando livro...</div>}
        />
      </div>
    </main>
  );
}

// Preserva as camadas padrão para que a página cubra o índice fechado durante a navegação.
const customReaderStyles = {
  ...ReactReaderStyle,
  readerArea: {
    ...ReactReaderStyle.readerArea,
    transition: 'none'
  },
  tocArea: {
    ...ReactReaderStyle.tocArea,
    background: '#ffffff',
    borderRight: '1px solid #e0e0e0'
  },
  reader: {
    ...ReactReaderStyle.reader,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  // Ocupa 40% de cada lateral sem bloquear a seleção no centro.
  prev: {
    ...ReactReaderStyle.prev,
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: '40%',
    zIndex: 10,
    cursor: 'pointer',
    margin: 0,
    padding: 0,
    background: 'transparent',
    border: 'none',
    color: 'transparent'
  },
  next: {
    ...ReactReaderStyle.next,
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: '40%',
    zIndex: 10,
    cursor: 'pointer',
    margin: 0,
    padding: 0,
    background: 'transparent',
    border: 'none',
    color: 'transparent'
  },
  arrow: {
    ...ReactReaderStyle.arrow,
    background: 'transparent',
    color: 'transparent',
    border: 'none',
    borderRadius: 0,
    boxShadow: 'none',
    outline: 'none',
    width: '100%',
    height: '100%',
    margin: 0,
    padding: 0,
    display: 'block'
  }
};
