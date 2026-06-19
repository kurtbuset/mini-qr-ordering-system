import { Account } from "../types/account";
import { apiClient } from "./apiClient";

export interface UpdateAccountData {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  role?: string;
}

export interface CreateAccountData {
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
}

export const accountService = {
  getAll,
  getById,
  create,
  update,
  delete: _delete,
};

async function getAll(): Promise<Account[]> {
  const response = await apiClient.get<Account[]>("/accounts");
  return response;
}

async function getById(id: string): Promise<Account> {
  const response = await apiClient.get<Account>(`/accounts/${id}`);
  return response;
}

async function create(data: CreateAccountData): Promise<Account> {
  const response = await apiClient.post<Account>("/accounts", data);
  return response;
}

async function update(id: string, data: UpdateAccountData): Promise<Account> {
  const response = await apiClient.put<Account>(`/accounts/${id}`, data);
  return response;
}

async function _delete(id: string): Promise<void> {
  await apiClient.delete(`/accounts/${id}`);
}
