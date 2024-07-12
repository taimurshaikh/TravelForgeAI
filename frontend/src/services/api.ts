import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export const getRoot = async () => {
  const response = await api.get("/");
  return response.data;
};
