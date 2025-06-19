// src/components/GroupCard.js
import React from "react";

function GroupCard({ group, onClick }) {
  return (
    <div
      className="bg-white p-4 shadow-md rounded-xl cursor-pointer hover:shadow-lg transition duration-200"
      onClick={onClick}
    >
      <h3 className="text-lg font-semibold mb-1">{group.name}</h3>
      <p className="text-sm text-gray-500">Members: {group.members.length}</p>
    </div>
  );
}

export default GroupCard;
