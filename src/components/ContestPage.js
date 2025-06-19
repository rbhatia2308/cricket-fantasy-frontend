import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

function ContestPage() {
  const { groupId, matchId } = useParams();
  const [contestName, setContestName] = useState("");
  const [entryFee, setEntryFee] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleCreateContest = async (e) => {
    e.preventDefault();

    if (!contestName || !entryFee || !maxParticipants) {
      setErrorMsg("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const contestRef = collection(db, "groups", groupId, "matches", matchId, "contests");
      await addDoc(contestRef, {
        contestName,
        entryFee: parseFloat(entryFee),
        maxParticipants: parseInt(maxParticipants, 10),
        createdAt: Timestamp.now(),
      });

      setSuccessMsg("Contest created successfully!");
      setContestName("");
      setEntryFee("");
      setMaxParticipants("");
    } catch (error) {
      console.error("Error creating contest:", error);
      setErrorMsg("Failed to create contest. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 mt-10 shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-6 text-center">
        Create Contest for Match <span className="text-blue-600">{matchId}</span>
      </h2>

      {successMsg && <p className="text-green-600 mb-4">{successMsg}</p>}
      {errorMsg && <p className="text-red-600 mb-4">{errorMsg}</p>}

      <form onSubmit={handleCreateContest} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Contest Name</label>
          <input
            type="text"
            value={contestName}
            onChange={(e) => setContestName(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="e.g. Mega League"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Entry Fee (₹)</label>
          <input
            type="number"
            value={entryFee}
            onChange={(e) => setEntryFee(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            min="0"
            placeholder="e.g. 50"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Max Participants</label>
          <input
            type="number"
            value={maxParticipants}
            onChange={(e) => setMaxParticipants(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            min="2"
            placeholder="e.g. 100"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold"
        >
          {loading ? "Creating..." : "Create Contest"}
        </button>
      </form>
    </div>
  );
}

export default ContestPage;
