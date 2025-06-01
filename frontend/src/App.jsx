import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

function AppRoutes({ isLoggedIn, handleLogin }) {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          isLoggedIn ? (
            <Navigate to="/" replace />
          ) : (
            <Login onLogin={handleLogin} />
          )
        }
      />
      <Route
        path="/"
        element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" replace />}
      />
    </Routes>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
    console.log("Login successful", isLoggedIn);
  };

  return (
    <Router>
      <AppRoutes isLoggedIn={isLoggedIn} handleLogin={handleLogin} />
    </Router>
  );
}
