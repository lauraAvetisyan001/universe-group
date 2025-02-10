import { UserRole } from "../models/user-role.type";

export interface RegisterRequest {
  fullName: string;
  role: UserRole;
  email: string;
  password: string;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
}

export interface RegisterError{
  message: string;
  error: string;
  statusCode: number;
}

export interface LoginReq {
  email: string;
  password: string;
}

export interface LoginRes {
  access_token: string;
}
