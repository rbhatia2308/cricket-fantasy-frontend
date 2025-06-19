import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import HomeButton from "../components/HomeButton";
import LeaderboardModal from "../components/LeaderboardModal";

function MyContests() {
  const [contests, setContests] = useState([]);
  const [filteredContests, setFilteredContests] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [selectedContest, setSelectedContest] = useState(null);
  const [leaderboardVisible, setLeaderboardVisible] = useState(false);
  const [participants, setParticipants] = useState([]);

  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchContests = async () => {
      if (!currentUser) return;
      setLoading(true);
      try {
        const userContestRef = collection(
          db,
          "users",
          currentUser.uid,
          "contests"
        );
        const snapshot = await getDocs(userContestRef);
        const contestsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setContests(contestsData);
        setFilteredContests(contestsData);
      } catch (error) {
        console.error("Error fetching contests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContests();
  }, [currentUser]);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    if (newFilter === "All") {
      setFilteredContests(contests);
    } else {
      const keyword = newFilter.toLowerCase();
      const filtered = contests.filter((contest) =>
        contest.status?.toLowerCase().includes(keyword)
      );
      setFilteredContests(filtered);
    }
  };

  const handleContestClick = async (contest) => {
    try {
      const ref = collection(
        db,
        "groups",
        contest.groupId,
        "matches",
        contest.matchId,
        "contests",
        contest.contestFirestoreId,
        "participants"
      );

      const snapshot = await getDocs(ref);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setParticipants(data);
      setSelectedContest(contest);
      setLeaderboardVisible(true);
    } catch (err) {
      console.error("Error loading leaderboard:", err);
    }
  };

  const closeLeaderboard = () => {
    setLeaderboardVisible(false);
    setSelectedContest(null);
    setParticipants([]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Contests</h2>
        <HomeButton />
      </div>

      <div className="flex justify-center space-x-2 mb-4">
        {["All", "Live", "Upcoming", "Completed"].map((label) => (
          <button
            key={label}
            onClick={() => handleFilterChange(label)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition ${
              filter === label
                ? "bg-blue-600 text-white"
                : "bg-blue-100 text-blue-800 hover:bg-blue-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-center text-gray-600">Loading contests...</p>
      ) : filteredContests.length === 0 ? (
        <p className="text-center text-gray-500">No contests found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredContests.map((contest) => (
            <div
              key={contest.id}
              className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition"
              onClick={() => handleContestClick(contest)}
            >
              <h3 className="text-lg font-semibold mb-1">
                {contest.contestName}
              </h3>
              <p className="text-sm text-gray-500">
                Entry Fee: ₹{contest.entryFee}
              </p>
              <p className="text-sm text-gray-500">
                Participants: {contest.maxParticipants}
              </p>
              <p className="text-sm text-gray-500">
                Status: {contest.status || "Upcoming"}
              </p>
            </div>
          ))}
        </div>
      )}

      {leaderboardVisible && selectedContest && (
        <LeaderboardModal
          contest={selectedContest}
          participants={participants}
          onClose={closeLeaderboard}
        />
      )}
    </div>
  );
}

export default MyContests;
