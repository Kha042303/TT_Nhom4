import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  withCredentials: true, // gửi cookie refreshToken
});

// Gắn accessToken vào header
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Tự refresh token khi 401
API.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;

    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;

      try {
        const res = await API.post("/user/refresh-token");
        const newToken = res.data.accessToken;

        localStorage.setItem("accessToken", newToken);

        original.headers.Authorization = `Bearer ${newToken}`;
        return API(original);

      } catch (refreshErr) {
        console.log("Refresh lỗi:", refreshErr);
        localStorage.removeItem("accessToken");
      }
    }

    return Promise.reject(err);
  }
);

/* ---------------------------
   🟦 EXPORT HÀM LOGIN & REGISTER
---------------------------- */

export async function login(data: { email: string; password: string }) {
  const res = await API.post("/user/login", data);
  return res.data;
}

export async function register(data: { full_name: string; email: string; password: string }) {
  const res = await API.post("/user/register", data);
  return res.data;
}

export default API;
