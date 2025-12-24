// src/components/RequireAuth.tsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

function getToken() {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("access_token") ||
    ""
  );
}

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const token = getToken();

  if (!token) return <Navigate to="/signin" replace state={{ from: location }} />;
  return <>{children}</>;
}
