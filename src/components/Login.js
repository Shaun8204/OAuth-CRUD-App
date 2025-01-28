import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setCookie, deleteCookie } from "../utils/cookieUtils";

const CLIENT_ID = "Ov23lizvvyw8K8A3AH8l";
const REDIRECT_URI = "http://localhost:3000/";
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

  const handleLogout = () => {
    // Clear app cookies
    deleteCookie("accessToken");
    deleteCookie("userData");

    // Navigate to GitHub logout and redirect back to your app
    window.location.href = `https://github.com/logout?return_to=${encodeURIComponent(
      "http://localhost:3000/"
    )}`;
  };

  return (
    <div className="login-container">
      <h1 className="login-heading">Login with GitHub</h1>
      {error && <p>{error}</p>}
      <button className="login-button" onClick={handleLogin}>
        Login with GitHub
      </button>

      <style jsx>{`
        .login-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          text-align: center;
        }
        .login-heading {
          font-size: 2rem;
          margin-bottom: 20px;
        }
        .login-button {
          font-size: 1.5rem;
          padding: 15px 30px;
          background-color: #4caf50;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        .login-button:hover {
          background-color: #45a049;
        }
      `}</style>
    </div>
  );
};

export default Login;
