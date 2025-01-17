const TOKEN_KEY = 'token';

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const isAuthenticated = () => {
  return !!getToken();
};

export const checkPermission = (requiredRole: string) => {
  const userRole = JSON.parse(atob(getToken()?.split('.')[1] || '{}')).role;
  return userRole === requiredRole;
};
