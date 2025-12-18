// src/pages/Logout.tsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Logout() {
  const nav = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    (async () => {
      await logout();
      nav("/signin", { replace: true });
    })();
  }, [logout, nav]);

  return <div className="p-6">Đang đăng xuất...</div>;
}
