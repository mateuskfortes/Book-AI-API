import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../global/Button';
import { saveStoredToken } from '../../utils/tokenStorage';

// Renderiza login ou cadastro e mantém o contrato atual da API de autenticação.
export default function AuthForm({ mode }) {
  const navigate = useNavigate();
  const params = useMemo(() => new URLSearchParams(window.location.search), []);
  const [email, setEmail] = useState(params.get('email') || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(
    params.get('registered') === '1' ? 'Account created. Sign in now.' : ''
  );

  // Valida o formulário, autentica o usuário e guarda o JWT localmente.
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

    saveStoredToken(data.token);
    navigate(mode === 'signup' ? `/signin?registered=1&email=${encodeURIComponent(email)}` : '/read');
  }

  return (
    <main className="page center">
      <form className="card" onSubmit={submit}>
        <h1>{mode === 'signup' ? 'Sign up' : 'Sign in'}</h1>
        <p>{mode === 'signup' ? 'Create an account' : 'Use your account'}</p>
        <div className="status">{message}</div>
        <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="Email" />
        <input
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          type="password"
          placeholder="Password"
        />
        {mode === 'signup' ? (
          <input
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            type="password"
            placeholder="Confirm password"
          />
        ) : null}
        <Button type="submit">{mode === 'signup' ? 'Create account' : 'Login'}</Button>
        <p>
          {mode === 'signup' ? (
            <Link to="/signin">Sign in</Link>
          ) : (
            <Link to="/signup">Create account</Link>
          )}
        </p>
      </form>
    </main>
  );
}
