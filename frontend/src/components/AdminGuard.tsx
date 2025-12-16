import React from "react";
import { Navigate } from "react-router-dom";

type Props = {
  children: React.ReactNode;
};

export default function AdminGuard({ children }: Props) {
  const token = localStorage.getItem("accessToken");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // ❌ Chưa đăng nhập
  if (!token || !user) {
    return <Navigate to="/signin" replace />;
  }

  // ❌ Không phải admin (role_id = 3)
  const isAdmin = user.user_roles?.some((r: any) => r.role_id === 3);
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  // ✅ OK
  return <>{children}</>;
}
