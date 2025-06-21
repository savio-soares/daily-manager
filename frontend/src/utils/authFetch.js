// Adiciona o token JWT no header Authorization de todas as requisições fetch
export function authFetch(url, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  // Usa a variável de ambiente para a base da API
  const baseUrl = process.env.REACT_APP_API_URL || '';
  const fullUrl = url.startsWith('http') ? url : baseUrl + url;
  return fetch(fullUrl, { ...options, headers });
}
