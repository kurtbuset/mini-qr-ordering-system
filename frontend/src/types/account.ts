import { Role } from "./role";

export interface Account {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username?: string;
  role: Role;
  isActive: boolean;
  jwtToken?: string;
  requirePasswordChange?: boolean;
}
