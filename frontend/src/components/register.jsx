import { useState } from "react";
import apiClient from "../api/client";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("⏳ Registering...");

    try {
      const res = await apiClient.post(
        "/api/v1/auth/register",
        formData
      );
      if (res.data.success) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        localStorage.setItem("token", res.data.token);
      }
      setMessage(`✅ Registered successfully as ${res.data.user.username}`);
    } catch (err) {
      console.error(err);
      setMessage(
        err.response?.data?.message || "❌ Registration failed. Try again."
      );
    }
  };

  return (
    <div className="container">
      <div className="col" style={{ maxWidth: 360, margin: "64px auto" }}>
        <h2 className="text-center mb-16">Register</h2>

        <form onSubmit={handleSubmit} className="card col">
          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
            className="input"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="input"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="input"
            required
          />

          <button type="submit" className="btn mt-16">
            Register
          </button>

          {message && (
            <p className="text-center mt-16" style={{ fontSize: "0.875rem" }}>
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
