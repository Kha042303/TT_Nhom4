export const API = "http://localhost:3000/api/v1";

export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data?: T;
  token?: string;
  user?: any;  
}


export interface AuthPayload {
  email: string;
  password: string;
  full_name?: string;
}

export const login = async (data: AuthPayload): Promise<ApiResponse> => {
  const res = await fetch(`${API}/user/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return res.json();
};

export const register = async (data: AuthPayload): Promise<ApiResponse> => {
  const res = await fetch(`${API}/user/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return res.json();
};
