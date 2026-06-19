import { Account } from "../types/account";
import { apiClient } from "./apiClient";

export const authService = {
  login,
  logout,
  refreshToken,
  register,
};

async function login(email: string, password: string): Promise<Account> {
  const response = await apiClient.post<Account>(
    "/accounts/authenticate",
    { email, password },
    { skipAuth: true },
  );
  return response;
}

async function logout(): Promise<void> {
  try {
    await apiClient.post("/accounts/revoke-token");
  } catch (error) {
    console.error("Logout error:", error);
  }
}

async function refreshToken(): Promise<Account> {
  const response = await apiClient.post<Account>(
    "/accounts/refresh-token",
    {},
    { skipAuth: true },
  );
  return response;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

async function register(data: RegisterData): Promise<Account> {
  const response = await apiClient.post<Account>("/accounts/register", data, {
    skipAuth: true,
  });
  return response;
}
