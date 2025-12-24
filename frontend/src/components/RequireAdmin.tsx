// src/components/RequireAdmin.tsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ADMIN_ROLE_ID = 3;

function getToken() {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("access_token") ||
    ""
  );
}

function isAdminFromStorage(): boolean {
  try {
    const u = JSON.parse(localStorage.getItem("user") || "null");
    if (Array.isArray(u?.user_roles)) {
      return u.user_roles.some(
        (ur: any) =>
          ur?.is_active === true &&
          (ur?.role?.role_name === "admin" || Number(ur?.role_id) === ADMIN_ROLE_ID)
      );
    }
    if (Array.isArray(u?.roles)) return u.roles.includes("admin");
    return false;
  } catch {
    return false;
  }
}

export default function RequireAdmin({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const token = getToken();

  if (!token) return <Navigate to="/signin" replace state={{ from: location }} />;
  if (!isAdminFromStorage()) return <Navigate to="/" replace />;

  return <>{children}</>;
}
