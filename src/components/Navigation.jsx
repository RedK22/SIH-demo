import React, { useState } from "react";
import {Link, useNavigate, useLocation} from "react-router-dom";
import {useAuth} from "../context/useAuth";
import {LogOut, Shield, Users, FileText, Home, Menu, X} from "lucide-react";

const Navigation = () => {
  const {user, logout} = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
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
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <svg
              className="h-8 w-8"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 13c0 5-3.5 7.5-8 10-4.5-2.5-8-5-8-10V6l8-3 8 3v7Z" />
              <path
                d="M8 12 Q10 10 12 12 T16 12"
                stroke="white"
                strokeWidth="1.5"
                fill="none"
              />
              <path
                d="M8 15 Q10 13 12 15 T16 15"
                stroke="white"
                strokeWidth="1.5"
                fill="none"
              />
            </svg>
            <h1 className="text-xl font-bold">Sagar Suraksha</h1>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-md hover:bg-blue-500 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
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
                <div className="hidden lg:flex items-center space-x-2">
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
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-1 px-3 py-2 rounded-md bg-green-500 hover:bg-green-600 transition-colors"
              >
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Login</span>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-2">
              {getNavItems().map(({path, label, icon: IconComponent}) => {
                return (
                  <Link
                    key={path}
                    to={path}
                    onClick={closeMobileMenu}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
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
                <>
                  <div className="flex items-center space-x-2 px-3 py-2 text-blue-100">
                    <Users className="h-4 w-4" />
                    <span className="text-sm">
                      {user.name} ({user.role})
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-3 py-2 rounded-md bg-red-500 hover:bg-red-600 transition-colors w-full text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md bg-green-500 hover:bg-green-600 transition-colors"
                >
                  <Users className="h-4 w-4" />
                  <span>Login</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
