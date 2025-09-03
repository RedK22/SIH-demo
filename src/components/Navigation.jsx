import React from "react";
import {Link, useNavigate, useLocation} from "react-router-dom";
import {useAuth} from "../context/useAuth";
import {LogOut, Shield, Users, FileText, Home} from "lucide-react";

const Navigation = () => {
  const {user, logout} = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const getNavItems = () => {
    const commonItems = [{path: "/", label: "Home", icon: Home}];

    if (!user) {
      return commonItems;
    }

    switch (user.role) {
      case "citizen":
        return [
          ...commonItems,
          {path: "/report", label: "Submit Report", icon: FileText},
        ];
      case "admin":
        return [
          ...commonItems,
          {path: "/dashboard", label: "Dashboard", icon: Shield},
          {path: "/reports", label: "All Reports", icon: FileText},
        ];
      default:
        return commonItems;
    }
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8" />
            <h1 className="text-xl font-bold">Sagar Suraksha</h1>
          </div>

          <div className="flex items-center space-x-4">
            {getNavItems().map(({path, label, icon: IconComponent}) => {
              return (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                    isActive(path)
                      ? "bg-blue-700 text-white"
                      : "text-blue-100 hover:bg-blue-500 hover:text-white"
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  <span>{label}</span>
                </Link>
              );
            })}

            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">
                    {user.name} ({user.role})
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 px-3 py-2 rounded-md bg-red-500 hover:bg-red-600 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-1 px-3 py-2 rounded-md bg-green-500 hover:bg-green-600 transition-colors"
              >
                <Users className="h-4 w-4" />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
