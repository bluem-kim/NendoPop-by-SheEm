import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminHeader from "../components/AdminHeader";
import AdminSidebar from "../components/AdminSidebar";

function AdminDashboard({ user }) {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate("/login");
  };

  return (
    <div>
      <AdminHeader
        onLogout={handleLogout}
        onToggleSidebar={() => setIsSidebarOpen((v) => !v)}
      />
      {isSidebarOpen && (
        <div className="backdrop" onClick={() => setIsSidebarOpen(false)} />
      )}
      <div className="row" style={{ alignItems: "flex-start" }}>
        <AdminSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onLogout={handleLogout}
        />
        <main className="container" style={{ padding: 16 }}>
          <div className="card col" style={{ maxWidth: 800, margin: "32px auto" }}>
            <h1 className="text-center mb-16">Admin Dashboard ⚙️</h1>
            <p>Welcome back, <strong>{user.username}</strong> (Admin)</p>
            <p className="mb-16">Email: {user.email}</p>

            <div className="mb-16">
              <h3>Management Tools</h3>
              <ul style={{ listStyle: "none", padding: 0 }}>
                <li>🧑‍💻 Manage Users</li>
                <li>📦 Manage Products</li>
                <li>📊 View Reports</li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
