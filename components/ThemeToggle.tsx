"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const active = theme === "system" ? systemTheme : theme;

  return (
    <button
      onClick={() => setTheme(active === "dark" ? "light" : "dark")}
      className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm shadow-sm hover:shadow transition"
      aria-label="Toggle theme"
    >
      {active === "dark" ? <Sun size={16} /> : <Moon size={16} />}
      <span className="hidden sm:block">{active === "dark" ? "Light" : "Dark"} mode</span>
    </button>
  );
}
