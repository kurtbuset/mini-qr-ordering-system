import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Account } from "../types/account";
import { Role } from "../types/role";
import { authService } from "../services/authService";

interface AuthState {
  account: Account | null;
  isLoading: boolean;
  isInitialized: boolean;
  refreshTokenTimeout: ReturnType<typeof setTimeout> | null;  // return any type with whatever setTimeout returns
}

interface AuthActions {
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  setAccount: (account: Account | null) => void;
  setLoading: (isLoading: boolean) => void;
  setInitialized: (isInitialized: boolean) => void;
  startRefreshTokenTimer: (jwtToken: string) => void;
  stopRefreshTokenTimer: () => void;
  hasRole: (roles: Role[]) => boolean;
  initialize: () => Promise<void>;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  devtools(
    (set, get) => ({
      // State
      account: null,
      isLoading: true,
      isInitialized: false,
      refreshTokenTimeout: null,

      // Actions
      setAccount: (account) => set({ account }),

      setLoading: (isLoading) => set({ isLoading }),

      setInitialized: (isInitialized) => set({ isInitialized }),

      startRefreshTokenTimer: (jwtToken: string) => {
        const state = get();

        // Clear existing timeout
        if (state.refreshTokenTimeout) {
          clearTimeout(state.refreshTokenTimeout);
        }

        try {
          // Parse json object from base64 encoded jwt token
          const tokenParts = jwtToken.split(".");
          if (tokenParts.length !== 3) return;

          const jwtPayload = JSON.parse(atob(tokenParts[1]));

          // Set a timeout to refresh the token a minute before it expires
          const expires = new Date(jwtPayload.exp * 1000);
          const timeout = expires.getTime() - Date.now() - 60 * 1000;

          if (timeout > 0) {
            const timeoutId = setTimeout(async () => {
              try {
                await get().refreshToken();
              } catch (error) {
                console.error("Token refresh failed:", error);
                get().logout();
              }
            }, timeout);


            console.log(typeof timeoutId)

            set({ refreshTokenTimeout: timeoutId });
          }
        } catch (error) {
          console.error("Failed to parse JWT token:", error);
        }
      },

      stopRefreshTokenTimer: () => {
        const state = get();
        if (state.refreshTokenTimeout) {
          clearTimeout(state.refreshTokenTimeout);
          set({ refreshTokenTimeout: null });
        }
      },

      login: async (email: string, password: string) => {
        try {
          const loggedInAccount = await authService.login(email, password);
          console.log("✅ Login successful:", {
            hasAccount: !!loggedInAccount,
            hasToken: !!loggedInAccount.jwtToken,
            accountId: loggedInAccount.id,
            role: loggedInAccount.role,
          });
          set({ account: loggedInAccount });

          if (loggedInAccount.jwtToken) {
            get().startRefreshTokenTimer(loggedInAccount.jwtToken);
          }
        } catch (error) {
          console.error("Login error:", error);
          throw error;
        }
      },

      logout: () => {
        authService.logout().catch(console.error);
        get().stopRefreshTokenTimer();
        set({ account: null });
      },

      refreshToken: async () => {
        try {
          const refreshedAccount = await authService.refreshToken();
          set({ account: refreshedAccount });

          if (refreshedAccount.jwtToken) {
            get().startRefreshTokenTimer(refreshedAccount.jwtToken);
          }
        } catch (error) {
          console.error("Token refresh failed:", error);
          throw error;
        }
      },

      hasRole: (roles: Role[]): boolean => {
        const state = get();
        if (!state.account) return false;
        return roles.includes(state.account.role);
      },

      initialize: async () => {
        set({ isLoading: true });
        try {
          const refreshedAccount = await authService.refreshToken();
          set({ account: refreshedAccount, isInitialized: true });

          if (refreshedAccount.jwtToken) {
            get().startRefreshTokenTimer(refreshedAccount.jwtToken);
          }
        } catch (error) {
          // No valid refresh token, user needs to login
          console.log("No valid session found");
          set({ account: null, isInitialized: true });
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    { name: "AuthStore" },
  ),
);

// Computed values (selectors)
export const selectIsAuthenticated = (state: AuthStore) => !!state.account;
export const selectAccount = (state: AuthStore) => state.account;
export const selectIsLoading = (state: AuthStore) => state.isLoading;
export const selectIsInitialized = (state: AuthStore) => state.isInitialized;
