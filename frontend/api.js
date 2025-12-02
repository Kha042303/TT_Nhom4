export const API = "http://localhost:8080/api";

// --- ĐĂNG NHẬP ---
export const login = async (data) => {
    const res = await fetch(`${API}/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return res.json();
};
// --- ĐĂNG KÝ ---
export const register = async (data) => {
    const res = await fetch(`${API}/user/register`, { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return res.json();
};


