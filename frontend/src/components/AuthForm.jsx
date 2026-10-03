import { useMemo, useState } from 'react';
import { navigate } from '../utils/navigation';

// Renderiza os formulários de cadastro e login usando o mesmo contrato da API.
export default function AuthForm({ mode }) {
  const params = useMemo(() => new URLSearchParams(window.location.search), []);
  const [email, setEmail] = useState(params.get('email') || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(
    params.get('registered') === '1' ? 'Account created. Sign in now.' : ''
  );

  // Valida o formulário, autentica o usuário e guarda o JWT no navegador.
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
