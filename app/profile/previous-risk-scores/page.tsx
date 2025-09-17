"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

export default function PreviousRiskScores() {
  const [scores, setScores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeScore, setActiveScore] = useState<any | null>(null);

  const colors = { Financial: "#10b981", Health: "#facc15", TimeHori: "#3b82f6" };

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${window.location.origin}/api/risk-scores/get`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch scores");
        setScores(data.scores);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchScores();
  }, []);

  if (loading) return <p>Loading previous risk scores...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (scores.length === 0) return <p>No previous risk scores found.</p>;

  const openDashboard = (score: any) => {
    setActiveScore(score);
  };

  const closeDashboard = () => setActiveScore(null);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Previous Risk Scores</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {scores.map((score) => (
          <motion.div
            key={score.id}
            className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
            whileHover={{ scale: 1.03 }}
            onClick={() => openDashboard(score)}
          >
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              {new Date(score.createdAt).toLocaleString()}
            </p>
            <h2 className="text-xl font-bold mb-4">Total Score: {score.Tscore}</h2>

            <div className="space-y-2">
              {["Financial", "Health", "TimeHori"].map((cat) => (
                <div key={cat}>
                  <p className="font-medium text-gray-700 dark:text-gray-200">
                    {cat === "TimeHori" ? "Time Horizon" : cat}
                  </p>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full`}
                      style={{ width: `${score[cat]}%`, backgroundColor: colors[cat] }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Dashboard Modal */}
      {activeScore && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-auto">
          <motion.div
            className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl w-full max-w-5xl"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <h2 className="text-2xl font-bold mb-6">Detailed Risk Dashboard</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Small Cards */}
              {["Financial", "Health", "TimeHori"].map((cat) => (
                <div
                  key={cat}
                  className="p-4 bg-gray-100 dark:bg-gray-700 rounded-xl shadow-md flex flex-col items-center"
                >
                  <p className="text-sm mb-2">{cat === "TimeHori" ? "Time Horizon" : cat}</p>
                  <h3 className="text-xl font-bold mb-2">{activeScore[cat]}</h3>
                  <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{ width: `${activeScore[cat]}%`, backgroundColor: colors[cat] }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Contribution to Total Score</h3>
                <PieChart width={300} height={250}>
                  <Pie
                    data={[
                      { name: "Financial", value: activeScore.Financial },
                      { name: "Health", value: activeScore.Health },
                      { name: "Time Horizon", value: activeScore.TimeHori },
                    ]}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {["#10b981", "#facc15", "#3b82f6"].map((color, index) => (
                      <Cell key={index} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Scores Overview</h3>
                <BarChart
                  width={300}
                  height={250}
                  data={[
                    { name: "Financial", score: activeScore.Financial },
                    { name: "Health", score: activeScore.Health },
                    { name: "Time Horizon", score: activeScore.TimeHori },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="score" fill="#3b82f6" />
                </BarChart>
              </div>
            </div>

            <button
              className="mt-6 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
              onClick={closeDashboard}
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
