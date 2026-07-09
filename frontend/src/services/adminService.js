import api from "../api/axios";

export const getDashboardStats = async () => {
  const response = await api.get("/admin/dashboard");
  return response.data;
};

// Retrieve waiting queue tokens. If a departmentId is provided, fetch tokens for that department;
// otherwise fetch all waiting tokens across all departments.
export const getWaitingQueue = async (departmentId) => {
  const url = departmentId ? `/admin/queue/${departmentId}` : `/admin/queue`;
  const response = await api.get(url);
  return response.data;
};

// Retrieve all tokens regardless of status (used for the "All" tab)
export const getAllTokens = async () => {
  // The admin/history endpoint returns the full token history sorted by creation time.
  // It includes tokens of all statuses, which matches the requirement for the "All"
  // view on the admin token‑management page.
  const response = await api.get("/admin/history");
  return response.data;
};

export const callNextStudent = async (departmentId) => {
  const response = await api.post(`/admin/call-next/${departmentId}`);
  return response.data;
};

export const completeService = async (tokenId) => {
  const response = await api.put(`/admin/complete/${tokenId}`);
  return response.data;
};

export const skipStudent = async (tokenId) => {
  const response = await api.put(`/admin/skip/${tokenId}`);
  return response.data;
};

export const getQueueHistory = async () => {
  const response = await api.get("/admin/history");
  return response.data;
};

export const createDepartment = async ({ name, description }) => {
  const response = await api.post("/departments/", {
    name,
    description,
  });
  return response.data;
};
