"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { checkSession, logout } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import Loader from "../Loader/Loader";

const PRIVATE_PREFIXES = ["/profile", "/notes"];

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const clear = useAuthStore((s) => s.clearIsAuthenticated);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const privateRoute = PRIVATE_PREFIXES.some((p) => pathname?.startsWith(p));
    const publicAuthRoute = pathname === "/sign-in" || pathname === "/sign-up";
    const hasValidUser = Boolean(user?.email);

    if (isAuthenticated && hasValidUser && !publicAuthRoute) {
      setLoading(false);
      return;
    }

    const verify = async () => {
      setLoading(true);
      try {
        const user = await checkSession();
        if (user) {
          setUser(user);
          if (publicAuthRoute) {
            router.replace("/profile");
          }
        } else {
          clear();
          if (privateRoute) {
            await logout();
            router.replace("/sign-in");
          }
        }
      } catch {
        clear();
        if (privateRoute) {
          try {
            await logout();
          } catch {}
          router.replace("/sign-in");
        }
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [pathname, isAuthenticated, user?.email, router, setUser, clear]);

  if (loading) {
    return <Loader />;
  }

  if (!isAuthenticated && PRIVATE_PREFIXES.some((p) => pathname?.startsWith(p))) {
    return null;
  }

  return <>{children}</>;
}
