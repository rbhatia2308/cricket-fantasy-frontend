import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { collection, doc, getDocs, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase";
import ChatBox from "../components/ChatBox";

function GroupPage() {
  const [userGroups, setUserGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [groupMembers, setGroupMembers] = useState([]);

  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (!currentUser) return;

    const q = query(collection(db, "groups"), where("members", "array-contains", currentUser.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const groups = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUserGroups(groups);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleGroupClick = async (groupId) => {
    setSelectedGroupId(groupId);
    const membersSnapshot = await getDocs(collection(db, "groups", groupId, "members"));
    const members = membersSnapshot.docs.map((doc) => doc.data());
    setGroupMembers(members);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h2 className="text-2xl font-bold text-center mb-6">Your Groups</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      import GroupCard from "../components/GroupCard"; // ⬅️ Add this at the top

{userGroups.map((group) => (
  <GroupCard key={group.id} group={group} onClick={() => handleGroupClick(group.id)} />
))}

      </div>

      {selectedGroupId && (
        <div className="bg-white p-4 rounded-xl shadow-md">
          <h3 className="text-xl font-bold mb-4">Group Members</h3>
          <ul className="mb-6">
            {groupMembers.map((member, index) => (
              <li key={index} className="text-gray-700">
                {member.displayName || member.email}
              </li>
            ))}
          </ul>

          <h3 className="text-xl font-bold mb-2 border-t pt-4">Group Chat</h3>
          <ChatBox groupId={selectedGroupId} />
        </div>
      )}
    </div>
  );
}

export default GroupPage;
