import { useEffect, useRef } from "react";
import { logoutApi } from "../api/auth.api";

export default function Logout() {
  const hasCalled = useRef(false);

  useEffect(() => {
    if (hasCalled.current) return;
    hasCalled.current = true;
    logoutApi(); 
  }, []);

  return null; 
}