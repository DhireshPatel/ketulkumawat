"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAdminState } from "./adminClient.js";
import { ADMIN_LOGIN_PATH } from "./constants.js";

/** Returns 'checking' | 'ok' | 'forbidden' | 'error'. Redirects to your existing admin login when logged out. */
export function useAdminGuard() {
  const router = useRouter();
  const [state, setState] = useState("checking");
  useEffect(() => {
    let alive = true;
    getAdminState().then((s) => {
      if (!alive) return;
      if (s === "login") router.replace(ADMIN_LOGIN_PATH);
      else setState(s);
    });
    return () => {
      alive = false;
    };
  }, [router]);
  return state;
}
