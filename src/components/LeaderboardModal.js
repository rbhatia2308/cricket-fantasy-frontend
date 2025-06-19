// src/components/LeaderboardModal.js
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const LeaderboardModal = ({ contest, onClose, participants = [] }) => {
  const [loading, setLoading] = useState(!participants.length);
  const [data, setData] = useState(participants);

  useEffect(() => {
    const fetchParticipants = async () => {
      if (participants.length > 0) {
        // Already passed from MyContests
        return;
      }

      setLoading(true);
      try {
        const ref = collection(
          db,
          "groups",
          contest.groupId,
          "matches",
          contest.matchId,
          "contests",
          contest.contestFirestoreId || contest.id, // fallback if needed
          "participants"
        );

        const snapshot = await getDocs(ref);
        const fetched = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(fetched);
      } catch (err) {
        console.error("Error fetching participants:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, [contest, participants]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
        <h3 className="text-xl font-bold mb-4">
          Leaderboard - {contest.contestName}
        </h3>
        <button
          className="absolute top-2 right-3 text-gray-500 hover:text-red-600 text-lg"
          onClick={onClose}
        >
          ✕
        </button>

        {loading ? (
          <p className="text-gray-500 text-center">Loading leaderboard...</p>
        ) : data.length === 0 ? (
          <p className="text-gray-500 text-center">No participants yet.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {data
              .sort((a, b) => (b.score || 0) - (a.score || 0))
              .map((p, index) => (
                <li key={p.id} className="py-2 flex justify-between">
                  <span>
                    #{index + 1} - {p.displayName || p.email || "Anonymous"}
                  </span>
                  <span className="font-bold">{p.score || 0} pts</span>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default LeaderboardModal;
