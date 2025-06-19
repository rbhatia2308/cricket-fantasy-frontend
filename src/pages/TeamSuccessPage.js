import React from "react";
import { useNavigate } from "react-router-dom";
import HomeButton from "../components/HomeButton";

function TeamSuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center text-center p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold text-green-700 mb-4">Team Created Successfully!</h2>
        <p className="text-gray-700 mb-6">
          Your fantasy team has been saved. Good luck!
        </p>
        <HomeButton />
      </div>
    </div>
  );
}

export default TeamSuccessPage;
