import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  withCredentials: true, // gửi cookie refreshToken
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;

    // Token hết hạn
    if (err.response?.status === 403 && !original._retry) {
      original._retry = true;

      try {
        // 🔄 gọi refresh token
        const res = await API.post("/user/refresh-token");
        const newToken = res.data.accessToken;

        // lưu token mới
        localStorage.setItem("accessToken", newToken);

        // gắn lại token và gọi lại request cũ
        original.headers.Authorization = `Bearer ${newToken}`;
        return API(original);
      } catch (refreshErr) {
        console.log("Refresh token lỗi:", refreshErr);

        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");

        // redirect về login
        window.location.href = "/signin";
      }
    }

    return Promise.reject(err);
  }
);

export async function login(data: {
  email: string;
  password: string;
}) {
  const res = await API.post("/user/login", data);
  return res.data;
}

export async function register(data: {
  full_name: string;
  email: string;
  password: string;
}) {
  const res = await API.post("/user/register", data);
  return res.data;
}

export default API;
