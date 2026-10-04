// Mantém um estado visual enquanto a aplicação valida uma sessão.
export default function LoadingState({ message }) {
  return (
    <main className="page center">
      <section className="card" aria-live="polite">
        <p>{message}</p>
      </section>
    </main>
  );
}
