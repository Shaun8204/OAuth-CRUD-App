import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { getCookie } from "./utils/cookieUtils";
import Dashboard from "./components/Dashboard";
import "devextreme/dist/css/dx.light.css";

import Login from "./components/Login"; // Adjust the path as needed

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const accessToken = getCookie("accessToken");
    setIsAuthenticated(!!accessToken);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <Dashboard />
            ) : (
              <p>You are not authorized. Please log in.</p>
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
