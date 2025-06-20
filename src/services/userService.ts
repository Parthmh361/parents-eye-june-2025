import axios from "@/lib/axios";

export const loginUser = async (username: string, password: string) => {
  const response = await axios.post("/auth/login", { username, password });
  console.log("Login response:", response.data);
  return response.data;
};
