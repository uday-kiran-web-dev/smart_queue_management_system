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



export const callStudent = async (tokenId) => {
  const response = await api.put(`/admin/call/${tokenId}`);
  return response.data;
};

export const completeService = async (tokenId, feedback) => {
  const response = await api.put(`/admin/complete/${tokenId}`, { feedback });
  return response.data;
};

export const skipStudent = async (tokenId, feedback) => {
  const response = await api.put(`/admin/skip/${tokenId}`, { feedback });
  return response.data;
};

export const cancelStudent = async (tokenId, feedback) => {
  const response = await api.put(`/admin/cancel/${tokenId}`, { feedback });
  return response.data;
};

export const getQueueHistory = async () => {
  const response = await api.get("/admin/history");
  return response.data;
};

export const createDepartment = async ({ name, description }) => {
  const response = await api.post("/departments", {
    name,
    description,
  });
  return response.data;
};
