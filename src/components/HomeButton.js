import React from "react";
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react"; // Optional: icon from lucide-react

function HomeButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/dashboard")}
      className="fixed top-4 left-4 bg-white border border-gray-300 rounded-full shadow hover:bg-gray-100 px-4 py-2 text-sm font-medium flex items-center space-x-2 transition z-50"
    >
      <Home size={16} />
      <span>Home</span>
    </button>
  );
}

export default HomeButton;
