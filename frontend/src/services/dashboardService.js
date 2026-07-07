import api from "../api/axios";

export const getDepartments = async () => {
  const response = await api.get("/departments");
  return response.data;
};

export const generateToken = async (departmentId) => {
  const response = await api.post("/queue/generate-token", {
    department_id: departmentId,
  });

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
