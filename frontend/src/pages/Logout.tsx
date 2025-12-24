// src/pages/Logout.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logoutApi } from "../api/auth.api";

export default function Logout() {
  const nav = useNavigate();

  useEffect(() => {
    const tk = localStorage.getItem("token") || localStorage.getItem("accessToken") || "";

    localStorage.removeItem("token");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");

    void logoutApi(tk); // gọi BE ngầm
    nav("/signin", { replace: true });
  }, [nav]);

  return null;
}
