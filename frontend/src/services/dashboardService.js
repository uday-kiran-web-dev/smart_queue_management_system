import api from "../api/axios";

export const getDepartments = async () => {
  const response = await api.get("/departments");
  return response.data;
};

export const generateToken = async (
  departmentId,
  purpose = "",
  scheduledAt = null,
) => {
  const payload = {
    department_id: departmentId,
    purpose: purpose,
  };
  // Include scheduled_at only if provided (ISO string)
  if (scheduledAt) {
    payload.scheduled_at = scheduledAt;
  }
  const response = await api.post("/queue/generate-token", payload);

  return response.data;
};

export const getMyToken = async () => {
  const response = await api.get("/queue/my-token");
  return response.data;
};

export const getMyPosition = async () => {
  const response = await api.get("/queue/my-position");
  return response.data;
};

export const updateProfile = async (updateData) => {
  const response = await api.put("/auth/update-profile", updateData);
  return response.data;
};

export const cancelToken = async (tokenId) => {
  const response = await api.put(`/queue/cancel-token/${tokenId}`);
  return response.data;
};
