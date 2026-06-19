import { Role } from "./role";

export interface Account {
  id: string;
  title?: string;
  firstName: string;
  lastName: string;
  email: string;
  username?: string;
  role: Role;
  isActive: boolean;
  isVerified?: boolean;
  created?: string;
  updated?: string;
  jwtToken?: string;
  requirePasswordChange?: boolean;
}
