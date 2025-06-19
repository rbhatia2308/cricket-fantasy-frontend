// src/App.js
import React from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import MatchList from "./components/MatchList";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
     
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/matches" element={<MatchList />} />
        </Routes>
      
    </AuthProvider>
  );
}

export default App;


