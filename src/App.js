// src/App.js
import React from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import MatchList from "./components/MatchList";
import GroupCreate from "./components/GroupCreate";
import ContestPage from "./components/ContestPage";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
     
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/matches" element={<MatchList />} />
          <Route path="/groups/create" element={<GroupCreate />} />
        <Route path="/contests/:groupId/:matchId" element={<ContestPage />} />
        </Routes>
      
    </AuthProvider>
  );
}

export default App;


