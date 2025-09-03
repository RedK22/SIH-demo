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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Shield className="mx-auto h-16 w-16 text-blue-600" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Sagar Suraksha
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Select your role to continue
          </p>
        </div>

        <form onSubmit={handleLogin} className="mt-8 space-y-6">
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
              className="relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your name"
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">
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
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedRole === role.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <IconComponent className="h-8 w-8 text-gray-600 mr-3" />
                    <div>
                      <div className="text-lg font-medium text-gray-900">
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
            className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white transition-colors ${
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
