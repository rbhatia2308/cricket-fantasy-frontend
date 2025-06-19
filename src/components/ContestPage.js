import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  addDoc,
  setDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth"; // ✅ Import auth
import HomeButton from "../components/HomeButton";

const ContestPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const matchId = queryParams.get("matchId");
  const matchName = queryParams.get("matchName") || "";

  const [groups, setGroups] = useState([]);
  const [groupId, setGroupId] = useState("");
  const [contestName, setContestName] = useState(matchName);
  const [entryFee, setEntryFee] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const snapshot = await getDocs(collection(db, "groups"));
        const fetchedGroups = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setGroups(fetchedGroups);
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };

    fetchGroups();
  }, []);

  const handleCreateContest = async (e) => {
    e.preventDefault();

    if (!contestName || !entryFee || !maxParticipants || !groupId) {
      setErrorMsg("Please fill in all fields.");
      return;
    }

    if (!currentUser) {
      setErrorMsg("User not authenticated.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      // 1. Create contest under group/match
      const contestRef = collection(
        db,
        "groups",
        groupId,
        "matches",
        matchId,
        "contests"
      );

      const newContestDoc = await addDoc(contestRef, {
        contestName,
        entryFee: parseFloat(entryFee),
        maxParticipants: parseInt(maxParticipants, 10),
        createdAt: Timestamp.now(),
        createdBy: currentUser.uid,
        status: "upcoming",
        matchId,
        matchName,
        groupId,
      });

      // 2. Log contest in group chat
      await addDoc(collection(db, "groups", groupId, "chat"), {
        text: `🎉 New contest created: ${contestName}`,
        type: "system",
        createdAt: Timestamp.now(),
      });

      // ✅ 3. Store contest in users/{uid}/contests/
      await setDoc(
        doc(db, "users", currentUser.uid, "contests", newContestDoc.id),
        {
          contestId: newContestDoc.id,
          contestName,
          entryFee: parseFloat(entryFee),
          maxParticipants: parseInt(maxParticipants, 10),
          createdAt: Timestamp.now(),
          status: "upcoming",
          matchId,
          matchName,
          groupId,
        }
      );

      // ✅ 4. Auto-add creator as a participant
await setDoc(
    doc(db, "groups", groupId, "matches", matchId, "contests", newContestDoc.id, "participants", currentUser.uid),
    {
      uid: currentUser.uid,
      email: currentUser.email,
      displayName: currentUser.displayName || currentUser.email,
      score: 0,
      joinedAt: Timestamp.now(),
    }
  );
  

      setSuccessMsg("Contest created successfully!");
      setContestName(matchName);
      setEntryFee("");
      setMaxParticipants("");
    } catch (error) {
      console.error("Error creating contest:", error);
      setErrorMsg("Failed to create contest.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Create Contest</h2>
        <HomeButton />
      </div>

      {successMsg && <p className="text-green-600 mb-2">{successMsg}</p>}
      {errorMsg && <p className="text-red-600 mb-2">{errorMsg}</p>}

      <form onSubmit={handleCreateContest} className="space-y-4">
        <div>
          <label className="block font-medium">Select Group</label>
          <select
            value={groupId}
            onChange={(e) => setGroupId(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          >
            <option value="">-- Select Group --</option>
            {groups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.groupName || group.id}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium">Contest Name</label>
          <input
            type="text"
            value={contestName}
            onChange={(e) => setContestName(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Entry Fee (₹)</label>
          <input
            type="number"
            value={entryFee}
            onChange={(e) => setEntryFee(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Max Participants</label>
          <input
            type="number"
            value={maxParticipants}
            onChange={(e) => setMaxParticipants(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          {loading ? "Creating..." : "Create Contest"}
        </button>
      </form>
    </div>
  );
};

export default ContestPage;
