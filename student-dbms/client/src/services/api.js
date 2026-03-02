import axios from "axios";

const API = axios.create({ baseURL: "/api/students" });

// ── GET all students ──
export const fetchStudents = () => API.get("/");

// ── SEARCH students ──
export const searchStudents = (query) =>
  API.get("/search", { params: { q: query } });

// ── ADD student ──
export const addStudent = (data) => API.post("/", data);

// ── UPDATE student ──
export const updateStudent = (id, data) => API.put(`/${id}`, data);

// ── DELETE student ──
export const deleteStudent = (id) => API.delete(`/${id}`);
