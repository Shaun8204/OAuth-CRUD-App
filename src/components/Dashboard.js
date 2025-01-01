import React, { useState, useEffect } from "react";
import { getCookie, deleteCookie } from "../utils/cookieUtils"; // Ensure proper imports
import CRUD from "./CRUD";
import { Box, Typography, Avatar, Button, Paper } from "@mui/material";

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([
    { name: "John", id: 1, githubId: "john123" },
    { name: "Kane", id: 2, githubId: "Kane456" },
    { name: "Bigshow", id: 3, githubId: "Bigshow456" },
    { name: "AJ", id: 4, githubId: "AJ456" },
  ]);

  useEffect(() => {
    const accessToken = getCookie("accessToken");

    if (accessToken) {
      // Mock user data for demonstration
      const mockUserData = {
        login: "Shaun8204",
        avatar_url: "https://avatars.githubusercontent.com/u/1234567?v=4",
        name: "Shaun",
      };
      setUserData(mockUserData);
    } else {
      setError("No access token found");
    }
  }, []);

  const handleLogout = () => {
    deleteCookie("accessToken");
    deleteCookie("userData");
    window.location.href = "https://github.com/logout";
    setTimeout(() => {
      window.location.href = "/";
    }, 1000);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Dashboard
      </Typography>
      {error && (
        <Typography variant="body1" color="error">
          {error}
        </Typography>
      )}
      {userData && (
        <Paper
          sx={{
            p: 3,
            mb: 4,
            display: "flex",
            alignItems: "center",
            gap: 3,
            backgroundColor: "#f5f5f5",
          }}
        >
          <Avatar
            src={userData.avatar_url}
            alt="Avatar"
            sx={{ width: 80, height: 80 }}
          />
          <Box>
            <Typography variant="h5">Welcome, {userData.login}</Typography>
            <Typography variant="body1">Name: {userData.name}</Typography>
          </Box>
        </Paper>
      )}
      <CRUD users={users} setUsers={setUsers} />
      <Button
        variant="contained"
        color="error"
        sx={{ mt: 4 }}
        onClick={handleLogout} // Properly binds the function here
      >
        Logout
      </Button>
    </Box>
  );
};

export default Dashboard;
