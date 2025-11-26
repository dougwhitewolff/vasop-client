const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

/**
 * Get auth token from localStorage
 */
function getAuthToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("vasop-token");
}

/**
 * Save auth token to localStorage
 */
function saveAuthToken(token) {
  if (typeof window === "undefined") return;
  localStorage.setItem("vasop-token", token);
}

/**
 * Remove auth token from localStorage
 */
function removeAuthToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("vasop-token");
}

/**
 * Make authenticated API request
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(errorData.message || `HTTP error! status: ${response.status}`);
      error.status = response.status;
      error.isHttpError = true;
      throw error;
    }

    return await response.json();
  } catch (error) {
    console.error("API request error:", error);
    // If this is not an HTTP error (e.g., network error), mark it as such
    if (!error.isHttpError && !error.status) {
      error.isNetworkError = true;
    }
    throw error;
  }
}

/**
 * Auth API functions
 */
export const authAPI = {
  async signup(data) {
    const response = await apiRequest("/vasop/auth/signup", {
      method: "POST",
      body: JSON.stringify(data),
    });
    saveAuthToken(response.token);
    return response;
  },

  async login(data) {
    const response = await apiRequest("/vasop/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
    saveAuthToken(response.token);
    return response;
  },

  async getProfile() {
    return await apiRequest("/vasop/auth/me");
  },

  logout() {
    removeAuthToken();
  },

  async forgotPassword(data) {
    return await apiRequest("/vasop/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async resetPassword(data) {
    return await apiRequest("/vasop/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};

/**
 * Onboarding API functions
 */
export const onboardingAPI = {
  async saveProgress(data) {
    return await apiRequest("/vasop/onboarding/save", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async getMySubmission() {
    return await apiRequest("/vasop/onboarding/my-submission");
  },

  async submit(data) {
    return await apiRequest("/vasop/onboarding/submit", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};

export { getAuthToken, saveAuthToken, removeAuthToken };

