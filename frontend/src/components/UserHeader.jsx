import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function UserHeader({ onLogout, onProfile, onSearch, onCart, onHome }) {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const goTo = (path, fallback) => {
    if (typeof fallback === "function") return fallback();
    navigate(path);
  };

  return (
    <header
      className="row"
      style={{
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 16px",
        borderBottom: "1px solid #333",
        background: "#000",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: '1 1 auto' }}>
        <button
          onClick={() => navigate('/admin')}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'inherit',
            fontWeight: 700,
            fontSize: 18,
            cursor: 'pointer',
            padding: 0,
          }}
          aria-label="NendoPop - admin home"
        >
          NendoPop
        </button>
        {/* Search Bar (wider) */}
        <input
          type="text"
          placeholder="Search..."
          className="input header-search"
          style={{ marginRight: 8, flex: 1, minWidth: 240 }}
          onChange={(e) => onSearch?.(e.target.value)}
        />
      </div>

      <div className="row" style={{ alignItems: "center", gap: 16 }}>
        {/* 🏠 Home Button */}
        <button
          className="icon-btn"
          title="Home"
          onClick={() => (onHome ? onHome() : navigate("/home"))}
        >
          {/* Home SVG icon (explicit viewBox + preserveAspectRatio to avoid cropping) */}
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            preserveAspectRatio="xMidYMid meet"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 10L12 3l9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V10z"
              stroke="#ccc"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* 🛒 Cart Button */}
        <button className="icon-btn" title="Cart" onClick={() => (onCart ? onCart() : navigate("/user/cart"))}>
          {/* Cart SVG icon */}
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            preserveAspectRatio="xMidYMid meet"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="9" cy="21" r="1" fill="#ccc" />
            <circle cx="20" cy="21" r="1" fill="#ccc" />
            <path
              d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"
              stroke="#ccc"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* 👤 Profile + Hover Dropdown */}
        <div
          style={{ position: "relative" }}
          onMouseEnter={() => setShowMenu(true)}
          onMouseLeave={() => setShowMenu(false)}
        >
          <button
            className="btn outline"
            title="Profile"
            style={{
              padding: 8,
              borderRadius: "50%",
              border: "none",
              display: "flex",
            }}
            onClick={() => (onProfile ? onProfile() : navigate("/user/profile"))}
          >
            {/* Profile Icon */}
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="none"
              preserveAspectRatio="xMidYMid meet"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12" cy="8" r="4" stroke="#ccc" strokeWidth="2" />
              <path
                d="M4 20c0-4 4-6 8-6s8 2 8 6"
                stroke="#ccc"
                strokeWidth="2"
              />
            </svg>
          </button>

          {showMenu && (
            <div
              style={{
                position: "absolute",
                top: 40,
                right: 0,
                background: "#111",
                border: "1px solid #333",
                borderRadius: 8,
                minWidth: 180,
                boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
                padding: 8,
                zIndex: 20,
              }}
            >
              <button
                className="user-dropdown-btn"
                onClick={() => (onProfile ? onProfile() : navigate("/user/profile"))}
              >
                {/* profile icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M4 21v-2a4 4 0 0 1 3-3.87" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span style={{ marginLeft: 8 }}>My Profile</span>
              </button>

              <button
                className="user-dropdown-btn"
                onClick={() => navigate("/user/orders")}
              >
                {/* orders icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 3h18v4H3z" />
                  <path d="M21 11v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6" />
                  <path d="M7 16v2" />
                </svg>
                <span style={{ marginLeft: 8 }}>My Orders</span>
              </button>

              <button
                className="user-dropdown-btn"
                onClick={() => navigate("/user/reviews")}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 17l-5 3 1-5-4-3 5-1 2-5 2 5 5 1-4 3 1 5z" />
                </svg>
                <span style={{ marginLeft: 8 }}>My Reviews</span>
              </button>
            </div>
          )}
        </div>

        {/* 🚪 Logout Button */}
        <button className="icon-btn" title="Logout" onClick={onLogout}>
          {/* Logout Icon */}
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            preserveAspectRatio="xMidYMid meet"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="4"
              y="4"
              width="12"
              height="16"
              rx="2"
              stroke="#ccc"
              strokeWidth="2"
            />
            <path
              d="M16 12h4m0 0-2-2m2 2-2 2"
              stroke="#ccc"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </header>
  );
}

export default UserHeader;
