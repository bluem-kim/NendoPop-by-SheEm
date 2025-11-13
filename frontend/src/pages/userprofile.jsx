import React, { useEffect, useState } from "react";
import apiClient from "../api/client";
import { useNavigate } from "react-router-dom";
import UserHeader from "../components/UserHeader";
import ChangePasswordOtp from "../components/ChangePasswordOtp";

function UserProfile({ user }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [form, setForm] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    phone: "",
    gender: "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [status, setStatus] = useState("");

  // 🧠 Load current user info
  useEffect(() => {
    const currentUser = user || JSON.parse(localStorage.getItem("user") || "null");
    if (currentUser) {
      setForm({
        username: currentUser.username || "",
        email: currentUser.email || "",
        firstName: currentUser.firstName || "",
        lastName: currentUser.lastName || "",
        address: currentUser.address || "",
        phone: currentUser.phone || "",
          gender: currentUser.gender || "",
      });
      const avatarUrl = currentUser?.avatar?.url || currentUser?.avatarUrl || "";
      if (avatarUrl) setAvatarPreview(avatarUrl);
    } else {
      navigate("/login");
    }
  }, [user, navigate]);

  // 🧩 Convert file → base64
  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  // 🖊️ Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 🖼️ Handle avatar selection
  const handleAvatar = (e) => {
    const file = e.target.files?.[0];
    setAvatarFile(file || null);
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
    } else {
      setAvatarPreview("");
    }
  };

  // 💾 Handle Save
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Saving...");
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      let avatarBase64;
      if (avatarFile) avatarBase64 = await fileToBase64(avatarFile);

      const storedUser = JSON.parse(localStorage.getItem("user") || "null");
      const payload = {
        userId: storedUser?._id,
        username: form.username,
        email: form.email,
        firstName: form.firstName,
        lastName: form.lastName,
        address: form.address,
        phone: form.phone,
        gender: form.gender,
        ...(form.password ? { password: form.password } : {}),
        ...(avatarBase64 ? { avatar: avatarBase64 } : {}),
      };

  const { data } = await apiClient.put(`/auth/profile`, payload, { headers });

      if (data?.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        setAvatarPreview(data.user?.avatar?.url || avatarPreview);
      }

      setStatus("Profile updated successfully ✅");
    } catch (error) {
      console.error(error);
      setStatus(error.response?.data?.message || "Failed to update profile ❌");
    }
  };

  // 🚪 Handle logout
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate("/login");
  };

  // 🔍 Handle search
  const handleSearch = (query) => {
    console.log("Searching:", query);
  };

  return (
    <div>
      {/* 🧭 Header */}
      <UserHeader onLogout={handleLogout} onSearch={handleSearch} />

      {/* Tabs */}
      <div className="container" style={{ maxWidth: 800, margin: "64px auto", padding: "16px" }}>
        <div className="row" style={{ gap: 8, marginBottom: 16 }}>
          <button className="btn" style={{ backgroundColor: activeTab === 'profile' ? '#333' : '#666' }} onClick={() => setActiveTab('profile')}>Profile</button>
          <button className="btn" style={{ backgroundColor: activeTab === 'password' ? '#333' : '#666' }} onClick={() => setActiveTab('password')}>Change Password</button>
        </div>

        {activeTab === 'profile' && (
        <>
        <h1 className="text-center mb-16">My Profile</h1>
        <form className="col" onSubmit={handleSubmit}>
          {/* Avatar */}
          <div className="row" style={{ alignItems: "center", marginBottom: 16 }}>
            <div
              style={{
                width: 96,
                height: 96,
                borderRadius: 8,
                border: "1px solid #333",
                overflow: "hidden",
                background: "#111",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="avatar preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <span style={{ fontSize: 12, color: "#bbb" }}>No avatar</span>
              )}
            </div>
            <div className="col" style={{ flex: 1, marginLeft: 16 }}>
              <label>
                Avatar
                <input type="file" accept="image/*" onChange={handleAvatar} className="input" />
              </label>
            </div>
          </div>

          {/* User Info */}
          <label>
            Username
            <input
              name="username"
              className="input"
              value={form.username}
              onChange={handleChange}
              placeholder="Username"
              required
            />
          </label>
          <label>
            Email
            <input
              type="email"
              name="email"
              className="input"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
          </label>

          <div className="row">
            <label style={{ flex: 1 }}>
              First Name
              <input
                name="firstName"
                className="input"
                value={form.firstName}
                onChange={handleChange}
                placeholder="First name"
              />
            </label>
            <label style={{ flex: 1 }}>
              Last Name
              <input
                name="lastName"
                className="input"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Last name"
              />
            </label>
          </div>

          <label>
            Address
            <input
              name="address"
              className="input"
              value={form.address}
              onChange={handleChange}
              placeholder="Address"
            />
          </label>

          <div className="row">
            <label style={{ flex: 1 }}>
              Phone
              <input
                name="phone"
                className="input"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone number"
              />
            </label>
            <label style={{ flex: 1 }}>
              Gender
              <select
                name="gender"
                className="input"
                value={form.gender}
                onChange={handleChange}
              >
                <option value="">Select gender</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="nonbinary">Non-binary</option>
                <option value="other">Other</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
            </label>
          </div>

          {/* Password changes are handled in the separate Change Password tab */}

          {/* Save button */}
          <button className="btn mt-16" type="submit">Save</button>
          {status && (
            <p className="text-center mt-16" style={{ fontSize: "0.875rem" }}>
              {status}
            </p>
          )}
        </form>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="btn mt-16"
          style={{ backgroundColor: "#b33", color: "white" }}
        >
          Logout
        </button>
        </>
        )}

        {activeTab === 'password' && (
          <div style={{ marginTop: 8 }}>
            <ChangePasswordOtp user={user} />
          </div>
        )}
      </div>
    </div>
  );
}

export default UserProfile;
