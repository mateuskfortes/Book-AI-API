import { useEffect, useState } from 'react';
import { clearStoredToken, getStoredToken } from '../utils/tokenStorage';

/** Valida a sessão persistida e distingue JWT inválido de API indisponível. */
export function useValidatedSession() {
  const [sessionStatus, setSessionStatus] = useState('checking');

  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      setSessionStatus('anonymous');
      return undefined;
    }

    const controller = new AbortController();

    // Só apaga o JWT quando a API confirmar explicitamente que ele é inválido.
    const validateToken = async () => {
      try {
        const response = await fetch('/api/auth/validate', {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal
        });
        const result = await response.json().catch(() => null);

        if (controller.signal.aborted) return;
        if (!response.ok || typeof result?.valid !== 'boolean') {
          setSessionStatus('unavailable');
          return;
        }

        if (!result.valid) clearStoredToken();
        setSessionStatus(result.valid ? 'authenticated' : 'anonymous');
      } catch {
        if (!controller.signal.aborted) setSessionStatus('unavailable');
      }
    };

    void validateToken();
    return () => controller.abort();
  }, []);

  return sessionStatus;
}
