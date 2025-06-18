import React, { useEffect, useState } from "react";
import { auth } from "../firebase";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>User not logged in</p>;

  return (
    <div>
      <h2>Welcome to Dashboard</h2>
      <p>Name: {user?.displayName}</p>
      <p>Email: {user?.email}</p>
      <img src={user?.photoURL} alt="Profile" width={100} />
    </div>
  );
}

export default Dashboard;

