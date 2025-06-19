import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, Timestamp, setDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import HomeButton from "../components/HomeButton"; // ✅ Added import

function CreateGroup() {
  const [groupName, setGroupName] = useState("");
  const [maxMembers, setMaxMembers] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const auth = getAuth();
  const currentUser = auth.currentUser;

  const handleCreateGroup = async (e) => {
    e.preventDefault();

    if (!groupName || !maxMembers) {
      setErrorMsg("Please fill in all fields.");
      return;
    }

    if (!currentUser) {
      setErrorMsg("User not logged in.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const groupRef = collection(db, "groups");
      const newGroup = await addDoc(groupRef, {
        groupName,
        maxMembers: parseInt(maxMembers, 10),
        createdAt: Timestamp.now(),
        members: [currentUser.uid],
      });

      await setDoc(doc(db, "groups", newGroup.id, "members", currentUser.uid), {
        uid: currentUser.uid,
        email: currentUser.email,
        displayName: currentUser.displayName || currentUser.email,
        joinedAt: Timestamp.now(),
      });

      setSuccessMsg(`Group created successfully! Group ID: ${newGroup.id}`);
      setGroupName("");
      setMaxMembers("");
    } catch (error) {
      console.error("Error creating group:", error);
      setErrorMsg("Failed to create group.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 relative">
      {/* ✅ Home Button at top-right */}
      <div className="absolute top-4 right-4">
        <HomeButton />
      </div>

      <h2 className="text-2xl font-bold text-center mb-6">Create a Group</h2>

      <form
        onSubmit={handleCreateGroup}
        className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md"
      >
        <div className="mb-4">
          <label className="block mb-1 text-gray-700 font-semibold">Group Name</label>
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="Enter group name"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-gray-700 font-semibold">Number of Members</label>
          <input
            type="number"
            min="1"
            value={maxMembers}
            onChange={(e) => setMaxMembers(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="Max number of members"
          />
        </div>

        {errorMsg && <p className="text-red-600 text-sm mb-2">{errorMsg}</p>}
        {successMsg && <p className="text-green-600 text-sm mb-2">{successMsg}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          {loading ? "Creating..." : "Create Group"}
        </button>
      </form>
    </div>
  );
}

export default CreateGroup;
