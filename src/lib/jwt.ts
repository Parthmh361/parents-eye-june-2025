import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  role: string;
}

export const getDecodedToken = (token: string): JwtPayload | null => {
  try {
    return jwtDecode<JwtPayload>(token);
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
};
