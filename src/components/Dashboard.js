import React from "react";
import { auth } from "../firebase";

function Dashboard() {
  const user = auth.currentUser;

  return (
    <div>
      <h2>Welcome to Dashboard</h2>
      {user && (
        <>
          <p>Name: {user.displayName}</p>
          <p>Email: {user.email}</p>
          <img src={user.photoURL} alt="Profile" width={100} />
        </>
      )}
    </div>
  );
}

export default Dashboard;
