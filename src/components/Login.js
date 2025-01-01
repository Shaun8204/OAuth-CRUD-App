import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setCookie } from "../utils/cookieUtils";

const CLIENT_ID = "Ov23lizvvyw8K8A3AH8l"; // Your GitHub client ID
const REDIRECT_URI = "http://localhost:3000/"; // Your redirect URL

const Login = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const code = queryParams.get("code");

    if (code) {
      // Simulate successful token retrieval and user login
      handleMockLogin(code);
    }
  }, []);

  const handleMockLogin = (code) => {
    // Mocking access token retrieval
    const mockAccessToken = "mock_access_token";
    const mockUserData = {
      login: "Shaun8204",
      avatar_url: "https://avatars.githubusercontent.com/u/1234567?v=4",
      name: "Shaun",
    };

    // Store token and user data in cookies
    setCookie("accessToken", mockAccessToken);
    setCookie("userData", JSON.stringify(mockUserData));

    // Redirect to the dashboard
    navigate("/dashboard");
  };

  const handleLogin = () => {
    // Redirect the user to GitHub's OAuth page
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}`;
  };

  return (
    <div>
      <h1>Login with GitHub</h1>
      {error && <p>{error}</p>}
      <button onClick={handleLogin}>Login with GitHub</button>
    </div>
  );
};

export default Login;
