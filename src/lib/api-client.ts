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

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Only set Content-Type for JSON requests (not FormData)
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP ${res.status}`);
  }

  return res.json();
}

// ----- Auth -----
export const api = {
  auth: {
    login: (username: string, password: string) =>
      request<{ token: string; user: any }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      }),
    me: () => request<{ user: any }>("/auth/me"),
  },

  // ----- Quotations -----
  quotations: {
    list: () => request<any[]>("/quotations"),
    get: (id: string) => request<any>(`/quotations/${id}`),
    create: (data: any) =>
      request<{ success: boolean; id: string }>("/quotations", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any) =>
      request<{ success: boolean }>(`/quotations/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request<{ success: boolean }>(`/quotations/${id}`, { method: "DELETE" }),
  },

  // ----- Customers -----
  customers: {
    list: () => request<any[]>("/customers"),
    get: (id: string | number) => request<any>(`/customers/${id}`),
    create: (data: any) =>
      request<{ success: boolean; id: number }>("/customers", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string | number, data: any) =>
      request<{ success: boolean }>(`/customers/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: string | number) =>
      request<{ success: boolean }>(`/customers/${id}`, { method: "DELETE" }),
  },

  // ----- Products -----
  products: {
    list: () => request<any[]>("/products"),
    get: (id: string | number) => request<any>(`/products/${id}`),
    create: (data: any) =>
      request<{ success: boolean; id: number }>("/products", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string | number, data: any) =>
      request<{ success: boolean }>(`/products/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: string | number) =>
      request<{ success: boolean }>(`/products/${id}`, { method: "DELETE" }),
  },

  // ----- Users -----
  users: {
    list: () => request<any[]>("/users"),
    get: (id: string) => request<any>(`/users/${id}`),
    create: (data: any) =>
      request<{ success: boolean; id: string }>("/users", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any) =>
      request<{ success: boolean }>(`/users/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request<{ success: boolean }>(`/users/${id}`, { method: "DELETE" }),
  },

  // ----- Templates -----
  templates: {
    list: () => request<any[]>("/templates"),
    create: (data: any) =>
      request<{ success: boolean; id: number }>("/templates", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: number, data: any) =>
      request<{ success: boolean }>(`/templates/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: number) =>
      request<{ success: boolean }>(`/templates/${id}`, { method: "DELETE" }),
  },

  // ----- Settings -----
  settings: {
    get: () => request<any>("/settings"),
    update: (data: any) =>
      request<{ success: boolean }>("/settings", {
        method: "PUT",
        body: JSON.stringify(data),
      }),
  },

  // ----- Boat Specs -----
  boatSpecs: {
    list: () => request<Record<string, any>>("/boat-specs"),
    get: (model: string) => request<any>(`/boat-specs/${encodeURIComponent(model)}`),
    create: (data: any) =>
      request<{ success: boolean }>("/boat-specs", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (model: string, data: any) =>
      request<{ success: boolean }>(`/boat-specs/${encodeURIComponent(model)}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (model: string) =>
      request<{ success: boolean }>(`/boat-specs/${encodeURIComponent(model)}`, {
        method: "DELETE",
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
