import { Account } from "../types/account";
import { apiClient } from "./apiClient";

export interface UpdateAccountData {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export const accountService = {
  getById,
  update,
};

async function getById(id: string): Promise<Account> {
  const response = await apiClient.get<Account>(`/accounts/${id}`);
  return response;
}

async function update(id: string, data: UpdateAccountData): Promise<Account> {
  const response = await apiClient.put<Account>(`/accounts/${id}`, data);
  return response;
}
