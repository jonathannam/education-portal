import { ROLE } from "../consts";

export interface AuthResponse {
  username: string;
  role: string;
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: number;
  username: string;
  role: ROLE;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}
