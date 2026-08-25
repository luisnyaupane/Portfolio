/**
 * api.js — centralised API access layer.
 * Every fetch() call in the app goes through here so the base URL and
 * error-handling behaviour only need to change in one place hb.
 */
const API_BASE_URL = (() => {
  // If served from the same host as the backend, this could be relative ('/api').
  // For local dev, the backend is assumed to run on 127.0.0.1:8000.
  return 'https://portfolio-qfxg.onrender.com/api';
})();

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function apiRequest(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;
  let response;
  try {
    response = await fetch(url, {
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      ...options,
    });
  } catch (networkErr) {
    throw new ApiError('Network error — please check your connection and try again.', 0);
  }

  if (!response.ok) {
    let detail = `Request failed (${response.status})`;
    try {
      const data = await response.json();
      detail = data.detail || JSON.stringify(data);
    } catch (_) { /* ignore parse errors */ }
    throw new ApiError(detail, response.status);
  }

  if (response.status === 204) return null;
  return response.json();
}

const Api = {
  getProfile: () => apiRequest('/profile/'),
  getSkills: () => apiRequest('/skills/'),
  getProjects: (page = 1) => apiRequest(`/projects/?page=${page}`),
  getFeaturedProjects: () => apiRequest('/projects/?featured=true'),
  getProject: (id) => apiRequest(`/projects/${id}/`),
  getExperience: () => apiRequest('/experience/'),
  getEducation: () => apiRequest('/education/'),
  sendContactMessage: (payload) =>
    apiRequest('/contact/', { method: 'POST', body: JSON.stringify(payload) }),
};
