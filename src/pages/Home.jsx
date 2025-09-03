import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import {useAuth} from "../context/useAuth";
import {
  Shield,
  AlertTriangle,
  BarChart3,
  Users,
  MapPin,
  Camera,
} from "lucide-react";

const Home = () => {
  const {user} = useAuth();
  const [realStats, setRealStats] = useState({
    total: 0,
    active: 0,
    resolved: 0,
  });

  useEffect(() => {
    // Load real stats from localStorage
    const savedReports = JSON.parse(
      localStorage.getItem("hazardReports") || "[]"
    );
    const activeCount = savedReports.filter(
      (report) =>
        report.status === "pending" || report.status === "investigating"
    ).length;
    const resolvedCount = savedReports.filter(
      (report) => report.status === "resolved"
    ).length;

    setRealStats({
      total: savedReports.length,
      active: activeCount,
      resolved: resolvedCount,
    });
  }, []);

  const features = [
    {
      icon: AlertTriangle,
      title: "Report Hazards",
      description:
        "Quickly report ocean hazards with location data and media attachments",
      color: "text-red-500",
    },
    {
      icon: MapPin,
      title: "Real-time Mapping",
      description:
        "View incident locations on interactive maps with hotspot analysis",
      color: "text-blue-500",
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Monitor trends and statistics for better decision making",
      color: "text-green-500",
    },
    {
      icon: Users,
      title: "Role-based Access",
      description: "Different interfaces for citizens and officials",
      color: "text-purple-500",
    },
    {
      icon: Camera,
      title: "Media Support",
      description: "Attach photos and videos to provide visual evidence",
      color: "text-orange-500",
    },
    {
      icon: Shield,
      title: "Verified Reports",
      description: "Official verification system for incident validation",
      color: "text-indigo-500",
    },
  ];

  const statsToShow = [
    {label: "Total Reports", value: realStats.total.toString()},
    {label: "Active Incidents", value: realStats.active.toString()},
    {label: "Resolved Cases", value: realStats.resolved.toString()},
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        <div className="text-center mb-8 sm:mb-16">
          <div className="mx-auto mb-4 sm:mb-6">
            <svg
              className="h-16 w-16 sm:h-20 sm:w-20 mx-auto"
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
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
            Sagar Suraksha
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
            Integrated platform for crowdsourced ocean hazard reporting and
            social media analytics. Helping communities stay safe through
            real-time incident reporting and monitoring.
          </p>

          {user ? (
            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0 justify-center">
              {user.role === "citizen" ? (
                <Link
                  to="/report"
                  className="inline-flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  <AlertTriangle className="h-5 w-5" />
                  <span>Report Incident</span>
                </Link>
              ) : (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  <BarChart3 className="h-5 w-5" />
                  <span>View Dashboard</span>
                </Link>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              <Users className="h-5 w-5" />
              <span>Get Started</span>
            </Link>
          )}
        </div>

        {/* Stats Section */}
        {/* Statistics Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-16">
          {statsToShow.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-4 sm:p-6 text-center"
            >
              <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">
                {stat.value}
              </div>
              <div className="text-sm sm:text-base text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-16">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow"
              >
                <IconComponent className={`h-10 w-10 sm:h-12 sm:w-12 ${feature.color} mb-3 sm:mb-4`} />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6 px-4">
            Join thousands of citizens, officials, and analysts working together
            to protect our oceans.
          </p>
          {!user && (
            <Link
              to="/login"
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              <svg
                className="h-5 w-5"
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
              <span>Start Reporting Today</span>
            </Link>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <svg
              className="h-6 w-6"
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
            <span className="text-lg font-semibold">Sagar Suraksha</span>
          </div>
          <p className="text-gray-400">
            Smart India Hackathon 2025 - Integrated Platform for Ocean Safety
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
