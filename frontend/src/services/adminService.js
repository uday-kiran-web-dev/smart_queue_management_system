import api from "../api/axios";

export const getDashboardStats = async () => {
  const response = await api.get("/admin/dashboard");
  return response.data;
};

export const getWaitingQueue = async (departmentId) => {
  const response = await api.get(`/admin/queue/${departmentId}`);
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
