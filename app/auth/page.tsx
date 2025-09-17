"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "@/lib/AuthContext";

export default function AuthPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (isSignup && !name) return toast.error("Name is required");
    if (!email || !password) return toast.error("Email and password required");

    setLoading(true);

    try {
      // ----------------------------
      // ADMIN LOGIN (hardcoded)
      // ----------------------------
      if (!isSignup && email === "admin@gmail.com" && password === "admin") {
        const res = await fetch("/api/auth/admin-login", {
          method: "POST",
        });

        const data = await res.json();
        if (!res.ok) return toast.error(data.message || "Login failed");

        localStorage.setItem("token", data.token);
        toast.success("Welcome, Admin!");
        setLoading(false);
        router.push("/admin/dashboard");
        return;
      }

      // ----------------------------
      // NORMAL USER LOGIN / SIGNUP
      // ----------------------------
      const res = await fetch(`/api/auth/${isSignup ? "signup" : "login"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) return toast.error(data.message || "Something went wrong");

      if (isSignup) {
        setIsSignup(false);
        toast.success("Signup successful! Please log in.");
      } else {
        localStorage.setItem("token", data.token);
        login(data.token, { name: data.user.name, email: data.user.email });
        toast.success(`Welcome!`);
        router.push("/"); // redirect normal users
      }

      setName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      setLoading(false);
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-gray-900 dark:text-gray-100 p-6">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {isSignup ? "Sign Up" : "Login"}
        </h1>

        {isSignup && (
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full mb-4 p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          />
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg mb-4"
        >
          {loading ? "Processing..." : isSignup ? "Sign Up" : "Login"}
        </button>

        <p className="text-center text-sm">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() => setIsSignup(!isSignup)}
          >
            {isSignup ? "Login" : "Sign Up"}
          </span>
        </p>
      </div>
    </div>
  );
}
