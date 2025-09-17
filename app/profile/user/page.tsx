"use client";

import { useState, useEffect } from "react";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/user/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading profile...</p>;
  if (!user) return <p className="text-center mt-10">User not found</p>;

  // Use latest DiceBear API for human-like avatars
  const seed = user.avatarSeed || Math.random().toString(36).substring(2, 10);
  const avatarUrl =
    user.avatar ||
    `https://api.dicebear.com/6.x/adventurer/svg?seed=${encodeURIComponent(
      seed
    )}&size=128`;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 flex flex-col items-center space-y-6 transform transition-transform hover:-translate-y-2 hover:shadow-3xl">
        {/* Avatar */}
        <div className="relative group">
          <img
            src={avatarUrl}
            alt="Profile Avatar"
            className="w-36 h-36 md:w-48 md:h-48 rounded-full object-cover shadow-lg"
          />
          <div className="absolute inset-0 bg-black bg-opacity-25 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
            <span className="text-white text-sm md:text-base">Change</span>
          </div>
        </div>

        {/* User Info */}
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{user.name}</h1>

        <div className="space-y-3 text-gray-700 dark:text-gray-300 w-full text-center">
          <p>
            <span className="font-semibold">User ID:</span> {user.id}
          </p>
          <p>
            <span className="font-semibold">Email:</span> {user.email}
          </p>
          <p>
            <span className="font-semibold">Date Joined:</span>{" "}
            {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
