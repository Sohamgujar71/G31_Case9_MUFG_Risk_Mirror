"use client";

import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { useState, useRef, useEffect } from "react";
import { User as UserIcon, LogOut, FileText, Settings, HelpCircle, Coins } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Navigation() {
  const router = useRouter();
  const { user, logout } = useAuth(); //  use context
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Brand */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link href="/" className="font-semibold tracking-tight text-xl">
            RISK MIRROR
          </Link>
        </motion.div>

        {/* Menu */}
        <div className="flex items-center gap-3 relative">
          {!user ? (
            <>
              {["AI Assistant", "About", "Rewards", "Login / Sign Up"].map((item, i) => {
                const hrefs = ["/ai-assistant", "/about", "/rewards", "/auth"];
                return (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.08, rotateX: 5, rotateY: -5 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  >
                    <Link href={hrefs[i]} className="rounded-lg px-3 py-2 text-sm hover:bg-muted block">
                      {item}
                    </Link>
                  </motion.div>
                );
              })}
            </>
          ) : (
            <>
              {[
                { label: "AI Assistant", href: "/ai-assistant" },
                { label: "About", href: "/about" },
                { label: "Rewards", href: "/rewards" },
              ].map((link, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.08, rotateX: 5, rotateY: -5 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  <Link href={link.href} className="rounded-lg px-3 py-2 text-sm hover:bg-muted block">
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              {/* Profile Dropdown */}
              <div className="relative">
                <motion.div
                  className="rounded-full p-2 hover:bg-muted cursor-pointer flex items-center justify-center"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  whileTap={{ scale: 0.9, rotate: -10 }}
                >
                  <UserIcon className="w-6 h-6 text-blue-500" />
                </motion.div>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      ref={dropdownRef}
                      initial={{ opacity: 0, y: -10, scale: 0.95, rotateX: -15 }}
                      animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95, rotateX: -15 }}
                      transition={{ duration: 0.3 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
                    >
                      <div className="py-2">
                        <Link
                          href="/profile/user"
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <UserIcon className="w-4 h-4" />
                          Profile
                        </Link>
                        <Link
                          href="/profile/previous-risk-scores"
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <FileText className="w-4 h-4" />
                          Risk History
                        </Link>
                        <Link
                          href="/profile/help"
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <HelpCircle className="w-4 h-4" />
                          Help
                        </Link>
                        <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                        <button
                          onClick={() => {
                            logout();
                            router.push("/");
                          }}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}

          {/* Theme Toggle */}
          <motion.div whileHover={{ rotate: 15 }} whileTap={{ scale: 0.9 }}>
            <ThemeToggle />
          </motion.div>
        </div>
      </nav>
    </header>
  );
}