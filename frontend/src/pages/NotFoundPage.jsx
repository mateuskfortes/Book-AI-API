import { Link } from 'react-router-dom';

// Mostra uma saída de navegação quando a URL não corresponde a uma página.
export default function NotFoundPage() {
  return (
    <main className="page center">
      <section className="card">
        <h1>Page not found</h1>
        <p>The address does not match a page in Book AI.</p>
        <Link to="/">Go to home</Link>
      </section>
    </main>
  );
}
