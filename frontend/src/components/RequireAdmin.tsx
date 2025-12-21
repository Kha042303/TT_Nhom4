import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ADMIN_ROLE_ID = 3;

function getStoredToken() {
  return localStorage.getItem("token") || localStorage.getItem("accessToken") || "";
}

function isAdminFromStorage(): boolean {
  try {
    const u = JSON.parse(localStorage.getItem("user") || "null");
    return (
      u?.user_roles?.some((ur: any) => ur?.is_active === true && ur?.role_id === ADMIN_ROLE_ID) ??
      false
    );
  } catch {
    return false;
  }
}

export default function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { loading, token } = useAuth();
  const location = useLocation();

  if (loading) return null;

  const t = token || getStoredToken();
  if (!t) return <Navigate to="/signin" replace state={{ from: location }} />;

  if (!isAdminFromStorage()) return <Navigate to="/" replace />;

  return <>{children}</>;
}
