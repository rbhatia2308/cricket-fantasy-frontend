import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

function ContestPage({ groupId, matchId }) {
  const [contests, setContests] = useState([]);
  const [contestName, setContestName] = useState("");
  const [maxParticipants, setMaxParticipants] = useState(10);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!groupId || !matchId) return;

    const q = query(
      collection(db, "contests"),
      where("groupId", "==", groupId),
      where("matchId", "==", matchId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setContests(list);
    });

    return () => unsubscribe();
  }, [groupId, matchId]);

  const handleCreateContest = async (e) => {
    e.preventDefault();
    setLoading(true);

    const user = auth.currentUser;
    if (!user) {
      alert("You must be logged in");
      return;
    }

    try {
      await addDoc(collection(db, "contests"), {
        name: contestName,
        groupId,
        matchId,
        createdBy: user.uid,
        createdAt: serverTimestamp(),
        maxParticipants,
        participants: [user.uid],
      });

      setContestName("");
      setMaxParticipants(10);
    } catch (err) {
      console.error("Error creating contest:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded-xl mt-6">
      <h2 className="text-xl font-bold mb-4 text-center">Contests for Match</h2>

      <form onSubmit={handleCreateContest} className="space-y-4">
        <div>
          <label className="block font-medium text-gray-700">Contest Name</label>
          <input
            type="text"
            value={contestName}
            onChange={(e) => setContestName(e.target.value)}
            className="w-full p-2 mt-1 border border-gray-300 rounded"
            placeholder="e.g. Top Scorers"
            required
          />
        </div>
        <div>
          <label className="block font-medium text-gray-700">Max Participants</label>
          <input
            type="number"
            value={maxParticipants}
            onChange={(e) => setMaxParticipants(Number(e.target.value))}
            className="w-full p-2 mt-1 border border-gray-300 rounded"
            min={2}
            max={100}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Contest"}
        </button>
      </form>

      <hr className="my-6" />

      <h3 className="text-lg font-semibold mb-2">Existing Contests</h3>
      <ul className="space-y-3">
        {contests.map((contest) => (
          <li key={contest.id} className="p-3 border rounded-md bg-gray-50">
            <strong>{contest.name}</strong> — {contest.participants.length}/{contest.maxParticipants} joined
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ContestPage;
