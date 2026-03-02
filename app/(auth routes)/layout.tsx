"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";


export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    // ensure client-side navigation uses fresh data
    router.refresh();
  }, [router]);

  return <>{children}</>;
}
