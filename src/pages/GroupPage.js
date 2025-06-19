import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, doc, getDocs, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase";
import ChatBox from "../components/ChatBox";
import GroupCard from "../components/GroupCard";
import HomeButton from "../components/HomeButton"; // ✅ Added import

function GroupPage() {
  const [userGroups, setUserGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [groupMembers, setGroupMembers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    const q = query(collection(db, "groups"), where("members", "array-contains", currentUser.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const groups = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      console.log("Fetched groups:", groups);
      setUserGroups(groups);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleGroupClick = async (groupId) => {
    setSelectedGroupId(groupId);
    try {
      const membersSnapshot = await getDocs(collection(db, "groups", groupId, "members"));
      const members = membersSnapshot.docs.map((doc) => doc.data());
      setGroupMembers(members);
    } catch (error) {
      console.error("Error fetching group members:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-center w-full">Your Groups</h2>
        <div className="absolute right-4 top-4">
          <HomeButton /> {/* ✅ Home button placed here */}
        </div>
      </div>

      {userGroups.length === 0 ? (
        <p className="text-center text-gray-600">You are not part of any groups yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {userGroups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              onClick={() => handleGroupClick(group.id)}
            />
          ))}
        </div>
      )}

      {selectedGroupId && (
        <div className="bg-white p-4 rounded-xl shadow-md">
          <h3 className="text-xl font-bold mb-4">Group Members</h3>
          <ul className="mb-4">
            {groupMembers.map((member, index) => (
              <li key={index} className="text-gray-700">
                {member.displayName || member.email || "Unnamed Member"}
              </li>
            ))}
          </ul>
          <ChatBox groupId={selectedGroupId} />
        </div>
      )}
    </div>
  );
}

export default GroupPage;
