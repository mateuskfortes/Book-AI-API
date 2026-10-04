import Button from '../global/Button';

// Mantém controles do leitor fora do componente que gerencia o EPUB.
export default function ReaderToolbar({ isFullscreen, onEnterFullscreen, onLogout }) {
  if (isFullscreen) return null;

  return (
    <header className="reader-toolbar">
      <Button
        className="reader-toolbar__button"
        variant="quiet"
        type="button"
        onClick={onEnterFullscreen}
        title="Abrir livro em tela cheia"
      >
        Tela cheia
      </Button>
      <Button className="reader-toolbar__button" variant="quiet" type="button" onClick={onLogout}>
        Logout
      </Button>
    </header>
  );
}
