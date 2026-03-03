import axiosClient from "../api/axiosClient";

export const login = async (data) => {
  return axiosClient.post("/auth/login", data);
};