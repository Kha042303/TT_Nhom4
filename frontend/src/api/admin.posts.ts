import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  withCredentials: true, // gửi cookie refreshToken
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
// ✅ List + search + pagination
// mặc định BE nên nhận: page, limit, keyword
export const getAdminPosts = (page = 1, limit = 8, keyword = "") => {
  return API.get("/post", {
    params: {
      page,
      limit,
      keyword,
    },
  });
};

// ✅ Detail
export const getPostDetail = (id: number) => {
  return API.get(`/post/detail/${id}`);
};

// ✅ Change status (active/inactive) — nếu BE yêu cầu body status thì truyền status vào
export const changePostStatus = (
  id: number,
  status: "visible" | "hidden"
) => {
  return API.patch(`/post/change-status/${id}`, {
    status, // ✅ BẮT BUỘC
  });
};

// ✅ Delete
export const deletePost = (id: number) => {
  return API.delete(`/post/delete/${id}`);
};
