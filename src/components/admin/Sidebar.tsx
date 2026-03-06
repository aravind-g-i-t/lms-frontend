import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  FolderOpen,
  Ticket,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../redux/store";
import { adminLogout } from "../../services/adminServices";

const navigationItems = [
  { name: "Dashboard",     icon: LayoutDashboard, href: "/admin/dashboard" },
  { name: "Learners",      icon: Users,           href: "/admin/learners" },
  { name: "Instructors",   icon: GraduationCap,   href: "/admin/instructors" },
  { name: "Courses",       icon: BookOpen,        href: "/admin/courses" },
  { name: "Categories",    icon: FolderOpen,      href: "/admin/categories" },
  { name: "Coupons",       icon: Ticket,          href: "/admin/coupons" },
  { name: "Verifications", icon: ShieldCheck,     href: "/admin/verifications" },
];

export function AdminSidebar() {
  const dispatch   = useDispatch<AppDispatch>();
  const navigate   = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await dispatch(adminLogout()).unwrap();
      navigate("/admin/signin");
    } catch (error: unknown) {
      let message = "Network error. Logging out locally.";
      if (error instanceof Error) message = error.message;
      console.error("Logout error:", message);
      navigate("/admin/signin");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

        .sidebar-root {
          font-family: 'DM Sans', sans-serif;
          background: #0a0f1a;
          border-right: 1px solid #1a2236;
          display: flex;
          flex-direction: column;
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }
        .sidebar-root::before {
          content: '';
          position: absolute;
          top: -80px;
          left: -80px;
          width: 240px;
          height: 240px;
          background: radial-gradient(circle, rgba(13,148,136,0.07) 0%, transparent 70%);
          pointer-events: none;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 12px;
          border-radius: 10px;
          font-size: 13.5px;
          font-weight: 500;
          color: #7a8eab;
          text-decoration: none;
          transition: background 0.15s ease, color 0.15s ease, transform 0.12s ease;
          white-space: nowrap;
          position: relative;
        }
        .nav-link:hover {
          background: #131c2e;
          color: #e2e8f0;
          transform: translateX(2px);
        }
        .nav-link.active {
          background: linear-gradient(135deg, #0d9488 0%, #0891b2 100%);
          color: #ffffff;
          box-shadow: 0 4px 14px rgba(13,148,136,0.30);
        }
        .nav-link.active svg {
          filter: drop-shadow(0 0 4px rgba(255,255,255,0.4));
        }

        .nav-link.collapsed {
          justify-content: center;
          padding: 9px;
        }

        .collapse-btn {
          background: #131c2e;
          border: 1px solid #1e2d45;
          border-radius: 8px;
          color: #7a8eab;
          cursor: pointer;
          padding: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s ease, color 0.15s ease;
        }
        .collapse-btn:hover {
          background: #1e2d45;
          color: #e2e8f0;
        }

        .divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, #1e2d45, transparent);
          margin: 8px 12px;
        }

        .logout-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 9px 12px;
          border-radius: 10px;
          font-size: 13.5px;
          font-weight: 600;
          color: #f87171;
          background: rgba(239,68,68,0.06);
          border: 1px solid rgba(239,68,68,0.12);
          cursor: pointer;
          transition: background 0.15s ease, border-color 0.15s ease, transform 0.12s ease, box-shadow 0.15s ease;
          white-space: nowrap;
          font-family: 'DM Sans', sans-serif;
        }
        .logout-btn:hover {
          background: rgba(239,68,68,0.14);
          border-color: rgba(239,68,68,0.30);
          transform: translateX(2px);
          box-shadow: 0 4px 14px rgba(239,68,68,0.15);
          color: #fca5a5;
        }
        .logout-btn:active {
          transform: translateX(0);
        }
        .logout-btn.collapsed {
          justify-content: center;
          padding: 9px;
        }
        .logout-btn.spinning svg {
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .brand-text {
          font-size: 14px;
          font-weight: 700;
          letter-spacing: -0.3px;
          background: linear-gradient(135deg, #5eead4 0%, #38bdf8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          white-space: nowrap;
        }

        .brand-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: linear-gradient(135deg, #0d9488, #0891b2);
          box-shadow: 0 0 8px rgba(13,148,136,0.6);
          flex-shrink: 0;
        }

        .section-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #3a4d66;
          padding: 0 12px;
          margin-bottom: 4px;
          white-space: nowrap;
          overflow: hidden;
        }
      `}</style>

      <div
        className="sidebar-root"
        style={{ width: isCollapsed ? 64 : 224, minHeight: "100vh" }}
      >
        {/* ── Brand Header ── */}
        <div style={{ padding: "16px 12px 12px", borderBottom: "1px solid #131c2e" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: isCollapsed ? "center" : "space-between", gap: 8 }}>
            {!isCollapsed && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, overflow: "hidden" }}>
                <span className="brand-dot" />
                <span className="brand-text">NlightN Admin</span>
              </div>
            )}
            <button className="collapse-btn" onClick={() => setIsCollapsed(!isCollapsed)}>
              {isCollapsed
                ? <ChevronRight style={{ width: 15, height: 15 }} />
                : <ChevronLeft  style={{ width: 15, height: 15 }} />
              }
            </button>
          </div>
        </div>

        {/* ── Navigation ── */}
        <div style={{ flex: 1, padding: "12px 8px 8px", display: "flex", flexDirection: "column" }}>
          {!isCollapsed && <p className="section-label">Navigation</p>}

          <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  end
                  className={({ isActive }) =>
                    `nav-link${isActive ? " active" : ""}${isCollapsed ? " collapsed" : ""}`
                  }
                  title={isCollapsed ? item.name : undefined}
                >
                  <Icon style={{ width: 17, height: 17, flexShrink: 0 }} />
                  {!isCollapsed && <span>{item.name}</span>}
                </NavLink>
              );
            })}
          </nav>

          {/* ── Divider + Logout ── */}
          <div className="divider" style={{ marginTop: 10 }} />

          <button
            className={`logout-btn${isCollapsed ? " collapsed" : ""}${isLoggingOut ? " spinning" : ""}`}
            onClick={handleLogout}
            disabled={isLoggingOut}
            title={isCollapsed ? "Logout" : undefined}
          >
            <LogOut style={{ width: 17, height: 17, flexShrink: 0 }} />
            {!isCollapsed && <span>{isLoggingOut ? "Signing out…" : "Logout"}</span>}
          </button>
        </div>
      </div>
    </>
  );
}