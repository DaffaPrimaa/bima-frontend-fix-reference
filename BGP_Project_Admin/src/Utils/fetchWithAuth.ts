const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

export const getRefreshToken = (): string | undefined => {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("refresh_token="))
    ?.split("=")[1];
};

const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const newAccessToken = data.data?.access_token;
    const newRefreshToken = data.data?.refresh_token;

    if (!newAccessToken) return null;

    // Update cookies
    document.cookie = `token=${newAccessToken}; path=/;`;
    if (newRefreshToken) {
      document.cookie = `refresh_token=${newRefreshToken}; path=/;`;
    }

    return newAccessToken;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    return null;
  }
};

/**
 * A wrapper around the native fetch API that automatically handles 401 Unauthorized responses
 * by attempting to refresh the access token and retrying the request.
 */
export const fetchWithAuth = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  let response = await fetch(input, init);

  if (response.status === 401) {
    if (!isRefreshing) {
      isRefreshing = true;
      refreshPromise = refreshAccessToken().finally(() => {
        isRefreshing = false;
        refreshPromise = null;
      });
    }

    const newToken = await refreshPromise;

    if (newToken) {
      // Construct new init options with the new token
      const currentInit = init ? { ...init } : {};
      const retryHeaders = new Headers(currentInit.headers);
      retryHeaders.set("Authorization", `Bearer ${newToken}`);
      currentInit.headers = retryHeaders;
      
      // Retry the request
      response = await fetch(input, currentInit);
    } else {
      // Refresh failed or no refresh token, log out
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      
      // Prevent infinite redirect loop if already on login
      if (window.location.pathname !== "/auth-login") {
        window.location.href = "/auth-login";
      }
    }
  }

  return response;
};
