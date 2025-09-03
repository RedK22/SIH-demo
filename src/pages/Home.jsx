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
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <Shield className="h-20 w-20 text-blue-600 mx-auto mb-6" />
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Sagar Suraksha
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Integrated platform for crowdsourced ocean hazard reporting and
            social media analytics. Helping communities stay safe through
            real-time incident reporting and monitoring.
          </p>

          {user ? (
            <div className="space-x-4">
              {user.role === "citizen" ? (
                <Link
                  to="/report"
                  className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  <AlertTriangle className="h-5 w-5" />
                  <span>Report Incident</span>
                </Link>
              ) : (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {statsToShow.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-6 text-center"
            >
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <IconComponent className={`h-12 w-12 ${feature.color} mb-4`} />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Join thousands of citizens, officials, and analysts working together
            to protect our oceans.
          </p>
          {!user && (
            <Link
              to="/login"
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              <Shield className="h-5 w-5" />
              <span>Start Reporting Today</span>
            </Link>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="h-6 w-6" />
            <span className="text-lg font-semibold">Sagar Suraksha</span>
          </div>
          <p className="text-gray-400">
            Smart India Hackathon 2024 - Integrated Platform for Ocean Safety
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
