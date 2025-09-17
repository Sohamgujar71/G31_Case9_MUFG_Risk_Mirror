"use client";

import { ReactNode, useEffect, useState } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/lib/AuthContext";
import { Toaster } from "react-hot-toast";

export default function RootProviders({ children }: { children: ReactNode }) {
  // optional: only render after client mount to prevent hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null; // avoid SSR/CSR mismatch

  return (
    <ThemeProvider>
      <AuthProvider>
        {children}
        <Toaster position="top-right" reverseOrder={false} />
      </AuthProvider>
    </ThemeProvider>
  );
}
