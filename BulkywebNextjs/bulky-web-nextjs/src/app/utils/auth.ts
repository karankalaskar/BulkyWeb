const TOKEN_KEY = "auth_token";

export const setToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
    window.dispatchEvent(new Event("authChanged"));  
  }
};

export const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
};

export const removeToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
    window.dispatchEvent(new Event("authChanged"));  
  }
};

/**
 * Decode the JWT and return the user's role(s).
 */
export const getUserRole = (): string | null => {
  const token = getToken();
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const roleClaim =
      payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
      payload.role ||
      payload.roles;

    if (Array.isArray(roleClaim)) return roleClaim[0];
    return roleClaim || null;
  } catch {
    return null;
  }
};

export const getImageUrl = (url: string | undefined) =>
  url
    ? url.startsWith("http")
      ? url
      : `https://localhost:7199${url.replace(/\\/g, "/")}`
    : "";
