import axiosClient from "../api/axiosClient";

export const login = async (data) => {
  return axiosClient.post("/auth/login", data);
};

export const logout = async () => {
  return axiosClient.post("/auth/logout");
}

export const register = async (data) => {
  return axiosClient.post("/auth/register", data);
}

export const refresh = async () => {
  return axiosClient.post("/auth/refresh");
}