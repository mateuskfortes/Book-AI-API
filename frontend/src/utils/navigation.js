// Atualiza a rota do React sem recarregar a página e preserva o estado da aplicação.
export function navigate(path) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

// Remove a sessão armazenada no navegador antes de voltar para o login.
export function logout() {
  localStorage.removeItem('book-ai-token');
  navigate('/signin');
}
