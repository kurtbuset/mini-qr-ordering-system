import { useAuthStore } from "../store/authStore";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

interface RequestOptions extends RequestInit {
  skipAuth?: boolean;
}

/**
 * Centralized API client that automatically adds Bearer token to requests
 */
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Get authorization headers with Bearer token
   */
  private getAuthHeaders(): HeadersInit {
    const account = useAuthStore.getState().account;
    const headers: HeadersInit = {};

    if (account?.jwtToken) {
      headers["Authorization"] = `Bearer ${account.jwtToken}`;
    } else {
      console.warn("⚠️ No JWT token found in auth store");
    }

    return headers;
  }

  /**
   * Make an authenticated request
   */
  private async request<T>(
    endpoint: string,
    options: RequestOptions = {},
  ): Promise<T> {
    const { skipAuth = false, headers = {}, ...restOptions } = options;

    const config: RequestInit = {
      ...restOptions,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...headers,
        ...(skipAuth ? {} : this.getAuthHeaders()),
      },
    };

    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, config);

      // Handle non-OK responses
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `Request failed with status ${response.status}`;

        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorJson.msg || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }

        console.error("API Error:", {
          url,
          status: response.status,
          statusText: response.statusText,
          error: errorMessage,
        });

        throw new Error(errorMessage);
      }

      // Handle empty responses (like DELETE)
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return response.json();
      }

      return {} as T;
    } catch (error: any) {
      console.error("Fetch error:", {
        url,
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "GET",
    });
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    data?: any,
    options?: RequestOptions,
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    data?: any,
    options?: RequestOptions,
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PATCH request
   */
  async patch<T>(
    endpoint: string,
    data?: any,
    options?: RequestOptions,
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "DELETE",
    });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export class for creating custom instances if needed
export default ApiClient;
