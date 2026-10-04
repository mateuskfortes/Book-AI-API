const TOKEN_STORAGE_KEY = 'book-ai-token';

/** Retorna o JWT mantido localmente após o cadastro ou login. */
export function getStoredToken() {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

/** Salva o JWT retornado pela API para validar a sessão em rotas protegidas. */
export function saveStoredToken(token) {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

/** Remove a sessão local após logout ou rejeição explícita do JWT. */
export function clearStoredToken() {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}
