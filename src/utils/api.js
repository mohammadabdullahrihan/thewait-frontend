import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 10000,
});

// Request interceptor – attach JWT token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor – handle auth errors
API.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// Auth & Gamification
export const authAPI = {
  register: (data) => API.post("/auth/register", data),
  login: (data) => API.post("/auth/login", data),
  getMe: () => API.get("/auth/me"),
  updateProfile: (data) => API.put("/auth/profile", data),
};

export const awardAPI = {
  toggleFocusMode: (active, minutes = 0) =>
    API.post("/auth/focus-mode", { active, minutes }),
  awardBadge: (badgeId) => API.post("/auth/award-badge", { badgeId }),
  getBadges: () => API.get("/auth/badges"),
};

// Routines
export const routineAPI = {
  get: (date, name = "Daily") => API.get(`/routines/${date}?name=${name}`),
  save: (data) => API.post("/routines", data),
  toggleTask: (date, taskId, completed, name = "Daily") =>
    API.put(`/routines/${date}/task/${taskId}`, { completed, name }),
  deleteTask: (date, taskId, name = "Daily") =>
    API.delete(`/routines/${date}/task/${taskId}?name=${name}`),
  deleteRoutine: (date, name = "Daily") =>
    API.delete(`/routines/${date}?name=${name}`),
  getWeek: (startDate) => API.get(`/routines/week/${startDate}`),
  getAllForDate: (date) => API.get(`/routines/${date}/list/all`),
  copy: (data) => API.post("/routines/copy", data),
};

// Habits
export const habitAPI = {
  get: (date) => API.get(`/habits/${date}`),
  save: (date, data) => API.post(`/habits/${date}`, data),
  getHistory: (days) => API.get(`/habits/history/${days}`),
  getStreak: () => API.get("/habits/streak/info"),
};

// Journal
export const journalAPI = {
  get: (date) => API.get(`/journal/${date}`),
  save: (date, data) => API.post(`/journal/${date}`, data),
  list: (limit) => API.get(`/journal/list/${limit}`),
  moodTrend: () => API.get("/journal/mood/trend"),
  getPopularTags: () => API.get("/journal/tags/popular"),
};

// Study
export const studyAPI = {
  getAll: () => API.get("/study"),
  get: (subject) => API.get(`/study/${subject}`),
  logSession: (subject, data) => API.post(`/study/${subject}/session`, data),
  addScore: (subject, data) => API.post(`/study/${subject}/score`, data),
  addTopic: (subject, data) => API.post(`/study/${subject}/topic`, data),
  toggleTopic: (subject, topicId, completed) =>
    API.put(`/study/${subject}/topic/${topicId}`, { completed }),
};

// Workout
export const workoutAPI = {
  get: (date) => API.get(`/workout/${date}`),
  log: (data) => API.post("/workout", data),
  history: (days) => API.get(`/workout/history/${days}`),
  delete: (id) => API.delete(`/workout/${id}`),
  getMuscleStats: () => API.get("/workout/muscle/stats"),
};

// Milestones
export const milestoneAPI = {
  get: () => API.get("/milestones"),
  save: (data) => API.post("/milestones", data),
  update: (id, data) => API.put(`/milestones/${id}`, data),
  delete: (id) => API.delete(`/milestones/${id}`),
};

// Analytics
export const analyticsAPI = {
  getDashboard: () => API.get("/analytics/dashboard"),
  heatmap: () => API.get("/analytics/heatmap"),
  getAIInsights: () => API.get("/analytics/ai-insights"),
};

export default API;
