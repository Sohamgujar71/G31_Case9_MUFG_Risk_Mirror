"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import toast, { Toaster } from "react-hot-toast";

export default function AdminDashboard() {
  const [scores, setScores] = useState<any[]>([]);
  const [filteredScores, setFilteredScores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("");

  const avatars = [
    "https://i.pravatar.cc/150?img=1",
    "https://i.pravatar.cc/150?img=2",
    "https://i.pravatar.cc/150?img=3",
    "https://i.pravatar.cc/150?img=4",
    "https://i.pravatar.cc/150?img=5",
  ];

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658"];

  // Fetch scores
  useEffect(() => {
    const fetchScores = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No auth token found. Please log in as admin.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/admin/all-scores", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) setError(data.message || "Failed to fetch scores");
        else setScores(data.scores || []);
      } catch (err) {
        console.error(err);
        setError("Server error while fetching scores");
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, []);

  // Filter & Sort
  useEffect(() => {
    let temp = [...scores].filter(
      (s) =>
        s.user.name.toLowerCase().includes(search.toLowerCase()) ||
        s.user.email.toLowerCase().includes(search.toLowerCase())
    );

    if (sortKey) {
      temp.sort((a, b) => b[sortKey] - a[sortKey]);
    }

    setFilteredScores(temp);
  }, [search, sortKey, scores]);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully!");
    window.location.href = "/auth"; // Redirect to login page
  };

  // Admin actions
  const handleDeleteUser = async (userId: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`/api/admin/delete-user/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete user");

      toast.success("User deleted successfully!");
      setScores(scores.filter((s) => s.user.id !== userId));
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Error deleting user");
    }
  };

  const handleEditScore = (scoreId: number) => {
    // You can navigate to an edit page or open a modal
    toast("Edit score functionality can be implemented here", { icon: "✏️" });
  };

  if (loading) return <p className="text-center mt-10">Loading scores...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>

      {/* Search & Sort */}
      <div className="flex flex-col sm:flex-row justify-between mb-4 gap-4">
        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-1/2 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
        />
        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value)}
          className="w-full sm:w-1/4 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
        >
          <option value="">Sort by...</option>
          <option value="Tscore">Tscore</option>
          <option value="Financial">Financial</option>
          <option value="Health">Health</option>
          <option value="TimeHori">Time Horizon</option>
        </select>
      </div>

      {/* Cards */}
      <div className="space-y-4">
        {filteredScores.map((score, index) => {
          const chartData = [
            { name: "Financial", value: score.Financial },
            { name: "Health", value: score.Health },
            { name: "TimeHorizon", value: score.TimeHori },
          ];

          return (
            <motion.div
              key={score.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 cursor-pointer"
              onClick={() => toggleExpand(score.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img
                    src={avatars[index % avatars.length]}
                    alt="avatar"
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-semibold text-lg">{score.user.name}</p>
                    <p className="text-gray-500 dark:text-gray-300">{score.user.email}</p>
                  </div>
                </div>

                {/* Admin actions */}
                <div className="space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditScore(score.id);
                    }}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg"
                  >
                    Edit Score
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteUser(score.user.id);
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg"
                  >
                    Delete User
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {expandedId === score.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-4"
                  >
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={chartData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={70}
                          fill="#8884d8"
                          label
                        >
                          {chartData.map((entry, i) => (
                            <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
