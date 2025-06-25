import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { FaUsers, FaUserCircle } from "react-icons/fa";
import { MdSportsCricket } from "react-icons/md";

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
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              Welcome to Fantasy Cricket
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Build teams, join contests, and top the leaderboard!
            </p>
          </div>
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt="Profile"
              className="w-16 h-16 rounded-full border-4 border-indigo-500 shadow"
            />
          ) : (
            <FaUserCircle className="text-5xl text-gray-400" />
          )}
        </div>

        <div className="bg-gray-50 p-4 rounded-xl mb-6">
          <p className="text-md font-medium text-gray-700">
            👤 {user.displayName}
          </p>
          <p className="text-sm text-gray-500">
            📧 {user.email}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
          <div
            onClick={() => navigate("/matches")}
            className="flex items-center gap-4 p-6 bg-blue-100 hover:bg-blue-200 rounded-2xl shadow-md transition cursor-pointer"
          >
            <MdSportsCricket className="text-blue-600 text-3xl" />
            <div>
              <h4 className="text-lg font-semibold text-blue-800">Matches</h4>
              <p className="text-sm text-blue-700">
                View live & upcoming matches.
              </p>
            </div>
          </div>

          <div
            onClick={() => navigate("/groups")}
            className="flex items-center gap-4 p-6 bg-green-100 hover:bg-green-200 rounded-2xl shadow-md transition cursor-pointer"
          >
            <FaUsers className="text-green-600 text-3xl" />
            <div>
              <h4 className="text-lg font-semibold text-green-800">Groups</h4>
              <p className="text-sm text-green-700">
                Create or join private groups.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
