import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { getCookie } from "./utils/cookieUtils";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login"; // Adjust the path as needed
import "devextreme/dist/css/dx.light.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

// Define the Material-UI theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#4caf50", // Primary color (green)
    },
    secondary: {
      main: "#f50057", // Secondary color (pink)
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif", // Default font
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none", // Disable uppercase on buttons
        },
      },
    },
  },
});

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const accessToken = getCookie("accessToken");
    setIsAuthenticated(!!accessToken);
  }, []);

  return (
    <ThemeProvider theme={theme}>
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
    </ThemeProvider>
  );
};

export default App;
