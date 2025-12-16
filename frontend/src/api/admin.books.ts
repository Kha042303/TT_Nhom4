import API from "../../api";

// GET danh sách sách + lọc + phân trang (nếu backend có hỗ trợ page/limit/q)
export const getAdminBooks = (page = 1, limit = 10, q = "") => {
  return API.get("/book", {
    params: { page, limit, q },
  });
};

// GET chi tiết sách
export const getBookDetail = (id: number) => {
  return API.get(`/book/detail/${id}`);
};

// Đổi trạng thái sách
export const changeBookStatus = (
  id: number,
  status: "active" | "inactive"
) => {
  return API.patch(`/book/change-status/${id}`, { status });
};

// Xóa sách
export const deleteBook = (id: number) => {
  return API.delete(`/book/delete/${id}`);
};
