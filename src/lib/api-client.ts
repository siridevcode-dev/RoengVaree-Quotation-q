// Centralized API client with JWT token injection

const API_BASE = "/api";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("qm_token");
}

export function setToken(token: string) {
  localStorage.setItem("qm_token", token);
}

export function clearToken() {
  localStorage.removeItem("qm_token");
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: any;
}

async function request<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("qm_token") : null;
  const config = { ...options };
  
  // Create headers
  const headers: Record<string, string> = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(config.headers as Record<string, string> || {}),
  };

  // Only set Content-Type for JSON requests (not FormData)
  if (!(config.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  // Prepare final fetch options
  const fetchOptions: RequestInit = {
    ...config,
    headers,
  };

  // Only add body if it's not a GET or if a body was explicitly provided
  const method = (config.method || "GET").toUpperCase();
  if (method !== "GET" && method !== "HEAD") {
    if (config.body) {
      fetchOptions.body = typeof config.body === "string" ? config.body : JSON.stringify(config.body);
    } else if (method === "POST" || method === "PUT" || method === "PATCH") {
      // For mutations, default to empty object if no body
      fetchOptions.body = JSON.stringify({});
    }
    // For DELETE, we don't default to empty object body anymore
  }

  const res = await fetch(`${API_BASE}${path}`, fetchOptions);

  if (!res.ok) {
    let errorMessage = `HTTP ${res.status}: ${res.statusText}`;
    try {
      const errorData = await res.json();
      errorMessage = errorData.error || errorData.message || errorMessage;
    } catch {
      // Not JSON, use default
    }
    console.error(`API Error: ${errorMessage}`, { path, method, status: res.status });
    throw new Error(errorMessage);
  }

  return res.json() as Promise<T>;
}

// ----- Auth -----
export const api = {
  auth: {
    login: (username: string, password: string) =>
      request<any>("/auth/login", {
        method: "POST",
        body: { username, password },
      }),
    me: () => request<any>("/auth/me"),
  },

  // ----- Quotations -----
  quotations: {
    list: () => request<any[]>("/quotations"),
    get: (id: string) => {
      if (!id) throw new Error("ID is required");
      return request<any>(`/quotations/${encodeURIComponent(id)}`);
    },
    create: (data: any) =>
      request<any>("/quotations", {
        method: "POST",
        body: data,
      }),
    update: (id: string, data: any) => {
      if (!id) throw new Error("ID is required for update");
      return request<any>(`/quotations/${encodeURIComponent(id)}`, {
        method: "PUT",
        body: data,
      });
    },
    delete: (id: string) => {
      // Allow empty string ID to handle orphaned/untitled records
      return request<{ success: boolean }>(`/quotations/${encodeURIComponent(id || "")}`, {
        method: "DELETE",
      });
    },
    getHistory: (id: string) => request<any[]>(`/quotations/${id}/history`),
  },

  // ----- Customers -----
  customers: {
    list: () => request<any[]>("/customers"),
    get: (id: string | number) => {
      if (!id) throw new Error("ID is required");
      return request<any>(`/customers/${encodeURIComponent(id)}`);
    },
    create: (data: any) =>
      request<{ success: boolean; id: number }>("/customers", {
        method: "POST",
        body: data,
      }),
    update: (id: string | number, data: any) => {
      if (!id) throw new Error("ID is required for update");
      return request<{ success: boolean }>(`/customers/${encodeURIComponent(id)}`, {
        method: "PUT",
        body: data,
      });
    },
    delete: (id: string | number) => {
      if (!id) throw new Error("ID is required for deletion");
      return request<{ success: boolean }>(`/customers/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
    },
  },

  // ----- Products -----
  products: {
    list: () => request<any[]>("/products"),
    get: (id: string | number) => {
      if (!id) throw new Error("ID is required");
      return request<any>(`/products/${encodeURIComponent(id)}`);
    },
    create: (data: any) =>
      request<{ success: boolean; id: number }>("/products", {
        method: "POST",
        body: data,
      }),
    update: (id: string | number, data: any) => {
      if (!id) throw new Error("ID is required for update");
      return request<{ success: boolean }>(`/products/${encodeURIComponent(id)}`, {
        method: "PUT",
        body: data,
      });
    },
    delete: (id: string | number) => {
      if (!id) throw new Error("ID is required for deletion");
      return request<{ success: boolean }>(`/products/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
    },
  },

  // ----- Users -----
  users: {
    list: () => request<any[]>("/users"),
    get: (id: string) => {
      if (!id) throw new Error("ID is required");
      return request<any>(`/users/${encodeURIComponent(id)}`);
    },
    create: (data: any) =>
      request<{ success: boolean; id: string }>("/users", {
        method: "POST",
        body: data,
      }),
    update: (id: string, data: any) => {
      if (!id) throw new Error("ID is required for update");
      return request<{ success: boolean }>(`/users/${encodeURIComponent(id)}`, {
        method: "PUT",
        body: data,
      });
    },
    delete: (id: string) => {
      if (!id) throw new Error("ID is required for deletion");
      return request<{ success: boolean }>(`/users/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
    },
  },

  // ----- Templates -----
  templates: {
    list: () => request<any[]>("/templates"),
    create: (data: any) =>
      request<{ success: boolean; id: number }>("/templates", {
        method: "POST",
        body: data,
      }),
    update: (id: number, data: any) => {
      if (!id) throw new Error("ID is required for update");
      return request<{ success: boolean }>(`/templates/${id}`, {
        method: "PUT",
        body: data,
      });
    },
    delete: (id: number) => {
      if (!id) throw new Error("ID is required for deletion");
      return request<{ success: boolean }>(`/templates/${id}`, {
        method: "DELETE",
      });
    },
  },

  // ----- Settings -----
  settings: {
    get: () => request<any>("/settings"),
    update: (data: any) =>
      request<{ success: boolean }>("/settings", {
        method: "PUT",
        body: data,
      }),
  },

  // ----- Boat Specs -----
  boatSpecs: {
    list: () => request<Record<string, any>>("/boat-specs"),
    get: (model: string) => request<any>(`/boat-specs/${encodeURIComponent(model)}`),
    create: (data: any) =>
      request<{ success: boolean }>("/boat-specs", {
        method: "POST",
        body: data,
      }),
    update: (model: string, data: any) => {
      if (!model) throw new Error("Model is required for update");
      return request<{ success: boolean }>(`/boat-specs/${encodeURIComponent(model)}`, {
        method: "PUT",
        body: data,
      });
    },
    delete: (model: string) => {
      if (!model) throw new Error("Model is required for deletion");
      return request<{ success: boolean }>(`/boat-specs/${encodeURIComponent(model)}`, {
        method: "DELETE",
      });
    },
  },

  // ----- Production Costs -----
  productionCosts: {
    list: () => request<any[]>("/production-costs"),
    get: (id: string | number) => {
      if (!id) throw new Error("ID is required");
      return request<any>(`/production-costs/${encodeURIComponent(id)}`);
    },
    create: (data: any) =>
      request<{ success: boolean; id: number }>("/production-costs", {
        method: "POST",
        body: data,
      }),
    update: (id: string | number, data: any) => {
      if (!id) throw new Error("ID is required for update");
      return request<{ success: boolean }>(`/production-costs/${encodeURIComponent(id)}`, {
        method: "PUT",
        body: data,
      });
    },
    delete: (id: string | number) => {
      if (!id) throw new Error("ID is required for deletion");
      return request<{ success: boolean }>(`/production-costs/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
    },
  },

  // ----- Purchase Requisitions/Orders (PR/PO) -----
  purchaseOrders: {
    list: (type?: "PO" | "PR") =>
      request<any[]>(`/purchase-orders${type ? `?type=${type}` : ""}`),
    get: (id: string) => {
      if (!id) throw new Error("ID is required");
      return request<any>(`/purchase-orders/${encodeURIComponent(id)}`);
    },
    create: (data: any) =>
      request<{ success: boolean; id: string }>("/purchase-orders", {
        method: "POST",
        body: data,
      }),
    update: (id: string, data: any) => {
      if (!id) throw new Error("ID is required for update");
      return request<{ success: boolean }>(`/purchase-orders/${encodeURIComponent(id)}`, {
        method: "PUT",
        body: data,
      });
    },
    delete: (id: string) => {
      if (!id) throw new Error("ID is required for deletion");
      return request<{ success: boolean }>(`/purchase-orders/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
    },
  },

  // ----- Activity Logs -----
  activityLogs: {
    list: (userId?: string, limit?: number) => {
      const params = new URLSearchParams();
      if (userId) params.set("userId", userId);
      if (limit) params.set("limit", String(limit));
      const qs = params.toString();
      return request<any[]>(`/activity-logs${qs ? `?${qs}` : ""}`);
    },
    create: (data: { userId?: string; userName?: string; action: string; description?: string }) =>
      request<{ success: boolean }>("/activity-logs", {
        method: "POST",
        body: data,
      }),
  },

  // ----- Upload -----
  upload: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return request<{ success: boolean; url: string; originalName: string }>("/upload", {
      method: "POST",
      body: formData,
    });
  },
};
