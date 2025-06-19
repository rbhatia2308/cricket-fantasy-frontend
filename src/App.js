// src/App.js
import React from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import MatchList from "./components/MatchList";
import GroupCreate from "./components/GroupCreate";
import ContestPage from "./components/ContestPage";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import GroupPage from "./pages/GroupPage";
import MyContests from "./pages/MyContests";
import CreateTeamPage from "./pages/CreateTeamPage";
import TeamSuccessPage from "./pages/TeamSuccessPage";









function App() {
  return (
    <AuthProvider>
     
        <Routes>
        <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/matches" element={<MatchList />} />
          <Route path="/groups/create" element={<GroupCreate />} />
        <Route path="/contests/:groupId/:matchId" element={<ContestPage />} />
        <Route path="/create-contest" element={<ContestPage />} /> 
        <Route path="/groups" element={<GroupPage />} />
        <Route path="/my-contests" element={<MyContests />} />
        <Route path="/create-team" element={<CreateTeamPage />} />
        <Route path="/team-success" element={<TeamSuccessPage />} />


        </Routes>
      
    </AuthProvider>
  );
}

export default App;


