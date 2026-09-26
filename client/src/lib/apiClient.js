// src/lib/apiClient.js
//
// Wrapper fetch tipis untuk konsumsi Koreksi API.
// Set VITE_API_URL di .env FE kamu, contoh: VITE_API_URL=http://localhost:3000/api
// (Kalau pakai CRA bukan Vite, ganti import.meta.env jadi process.env.REACT_APP_API_URL)

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const TOKEN_KEY = "koreksi_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}
export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

class ApiError extends Error {
  constructor(message, status, errors) {
    super(message);
    this.status = status;
    this.errors = errors; // array error validasi zod (kalau ada)
  }
}

async function request(path, { method = "GET", body, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };

  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const json = await res.json().catch(() => null);

  if (!res.ok || !json?.success) {
    throw new ApiError(
      json?.message || "Terjadi kesalahan.",
      res.status,
      json?.errors,
    );
  }

  return json.data;
}

export const api = {
  // ===== Auth =====
  register: (payload) =>
    request("/auth/register", { method: "POST", body: payload, auth: false }),
  login: (payload) =>
    request("/auth/login", { method: "POST", body: payload, auth: false }),
  me: () => request("/auth/me"),

  // ===== Class =====
  createClass: (payload) =>
    request("/classes", { method: "POST", body: payload }),
  listClasses: () => request("/classes"),
  joinClass: (code) =>
    request("/classes/join", { method: "POST", body: { code } }),
  getClass: (id) => request(`/classes/${id}`),
  getClassMembers: (id) => request(`/classes/${id}/members`),

  // ===== Assignment =====
  createAssignment: (classId, payload) =>
    request(`/classes/${classId}/assignments`, {
      method: "POST",
      body: payload,
    }),
  listAssignments: (classId) => request(`/classes/${classId}/assignments`),
  getAssignment: (id) => request(`/assignments/${id}`),
  updateAssignment: (id, payload) =>
    request(`/assignments/${id}`, { method: "PUT", body: payload }),
  deleteAssignment: (id) => request(`/assignments/${id}`, { method: "DELETE" }),

  // ===== Submission =====
  submitAssignment: (assignmentId, content) =>
    request(`/assignments/${assignmentId}/submissions`, {
      method: "POST",
      body: { content },
    }),
  listSubmissions: (assignmentId) =>
    request(`/assignments/${assignmentId}/submissions`),
  getSubmission: (id) => request(`/submissions/${id}`),

  // ===== Review =====
  createReview: (submissionId, payload) =>
    request(`/submissions/${submissionId}/reviews`, {
      method: "POST",
      body: payload,
    }),
  listReviews: (submissionId) =>
    request(`/submissions/${submissionId}/reviews`),
  getResults: (classId, assignmentId) =>
    request(`/classes/${classId}/assignments/${assignmentId}/results`),
};

export { ApiError };
