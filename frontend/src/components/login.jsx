import React, { useState } from "react";
import apiClient from "../api/client";
import { useNavigate, useLocation } from "react-router-dom";

const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await apiClient.post("/api/v1/auth/login", {
        email,
        password,
      });

      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
        setUser(data.user);

        // Redirect to target if provided (preserve intended destination), else role-based
        const params = new URLSearchParams(location.search);
        const redirect = params.get('redirect');
        if (redirect) {
          navigate(redirect);
        } else if (data.user.isAdmin) {
          navigate("/admin");
        } else {
          navigate("/home");
        }
      }
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="container">
      <div className="col" style={{ maxWidth: 360, margin: "64px auto" }}>
        <h2 className="text-center mb-16">Login</h2>

        <form onSubmit={handleLogin} className="card col">
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            required
          />

          <button type="submit" className="btn mt-16">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
