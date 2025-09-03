import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../context/useAuth";
import {Users, Shield} from "lucide-react";

const Login = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const [name, setName] = useState("");
  const {login} = useAuth();
  const navigate = useNavigate();

  const roles = [
    {
      id: "citizen",
      name: "Citizen",
      description: "Report ocean hazards and incidents",
      icon: Users,
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      id: "admin",
      name: "Government Official",
      description: "Monitor and manage disaster reports",
      icon: Shield,
      color: "bg-green-500 hover:bg-green-600",
    },
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    if (selectedRole && name.trim()) {
      login({
        name: name.trim(),
        role: selectedRole,
        id: Date.now(), // Simple ID generation for demo
      });

      // Redirect based on role
      if (selectedRole === "citizen") {
        navigate("/");
      } else {
        navigate("/dashboard");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 sm:space-y-8">
        <div className="text-center">
          <div className="mx-auto mb-4 sm:mb-6">
            <svg
              className="h-12 w-12 sm:h-16 sm:w-16 mx-auto"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#2563eb"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 13c0 5-3.5 7.5-8 10-4.5-2.5-8-5-8-10V6l8-3 8 3v7Z" />
              <path
                d="M8 12 Q10 10 12 12 T16 12"
                stroke="#2563eb"
                strokeWidth="1.5"
                fill="none"
              />
              <path
                d="M8 15 Q10 13 12 15 T16 15"
                stroke="#2563eb"
                strokeWidth="1.5"
                fill="none"
              />
            </svg>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Sagar Suraksha
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Select your role to continue
          </p>
        </div>

        <form onSubmit={handleLogin} className="mt-6 sm:mt-8 space-y-4 sm:space-y-6">
          <div>
            <label htmlFor="name" className="sr-only">
              Your Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="relative block w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your name"
            />
          </div>

          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg font-medium text-gray-900">
              Choose your role:
            </h3>
            {roles.map((role) => {
              const IconComponent = role.icon;
              return (
                <div key={role.id}>
                  <input
                    type="radio"
                    id={role.id}
                    name="role"
                    value={role.id}
                    checked={selectedRole === role.id}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="sr-only"
                  />
                  <label
                    htmlFor={role.id}
                    className={`flex items-center p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedRole === role.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <IconComponent className="h-6 w-6 sm:h-8 sm:w-8 text-gray-600 mr-3" />
                    <div>
                      <div className="text-base sm:text-lg font-medium text-gray-900">
                        {role.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {role.description}
                      </div>
                    </div>
                  </label>
                </div>
              );
            })}
          </div>

          <button
            type="submit"
            disabled={!selectedRole || !name.trim()}
            className={`group relative w-full flex justify-center py-2 sm:py-3 px-4 border border-transparent text-sm sm:text-base font-medium rounded-md text-white transition-colors ${
              selectedRole && name.trim()
                ? "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Continue as{" "}
            {selectedRole
              ? roles.find((r) => r.id === selectedRole)?.name
              : "User"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
