import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!user) return <p className="text-center mt-10 text-red-600">User not logged in</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Welcome to Dashboard</h2>
        <div className="mb-4">
          <p className="text-lg">👤 {user?.displayName}</p>
          <p className="text-gray-600 text-sm">📧 {user?.email}</p>
          {user?.photoURL && (
            <img
              src={user.photoURL}
              alt="Profile"
              className="w-20 h-20 rounded-full mx-auto mt-4 shadow"
            />
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
          <div
            className="bg-blue-500 hover:bg-blue-600 text-white py-6 rounded-xl shadow cursor-pointer text-xl font-semibold transition"
            onClick={() => navigate("/matches")}
          >
            🏏 Matches
          </div>
          <div
            className="bg-green-500 hover:bg-green-600 text-white py-6 rounded-xl shadow cursor-pointer text-xl font-semibold transition"
            onClick={() => navigate("/groups")}
          >
            👥 Groups
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;


