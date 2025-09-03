import React, {useState, useEffect} from "react";
import {
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
} from "lucide-react";
import HazardMap from "../components/HazardMap";

const Dashboard = () => {
  const [reports, setReports] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    resolved: 0,
    high: 0,
    medium: 0,
    low: 0,
  });

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.log("Location access denied or unavailable:", error);
        }
      );
    }
  }, []);

  useEffect(() => {
    // Load reports from localStorage
    const savedReports = JSON.parse(
      localStorage.getItem("hazardReports") || "[]"
    );

    // Ensure all reports have required fields but don't add demo data
    const updatedReports = savedReports.map((report) => ({
      ...report,
      priority: report.priority || "medium", // Default to medium if not set
      status: report.status || "pending",
    }));

    setReports(updatedReports);
    if (JSON.stringify(updatedReports) !== JSON.stringify(savedReports)) {
      localStorage.setItem("hazardReports", JSON.stringify(updatedReports));
    }
  }, []);

  useEffect(() => {
    // Calculate statistics
    const newStats = reports.reduce(
      (acc, report) => {
        acc.total++;
        acc[report.status]++;
        acc[report.priority]++;
        return acc;
      },
      {
        total: 0,
        pending: 0,
        resolved: 0,
        high: 0,
        medium: 0,
        low: 0,
      }
    );
    setStats(newStats);
  }, [reports]);

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "low":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "resolved":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Sagar Suraksha Monitoring Dashboard
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Real-time overview of reported ocean hazards and incidents
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-gray-500">Total Reports</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-600" />
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-gray-500">Pending</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {stats.pending}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-gray-500">Resolved</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {stats.resolved}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Priority Distribution */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
          Priority Distribution
        </h2>
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-medium text-gray-700">
              High Priority
            </span>
            <div className="flex items-center space-x-2">
              <div className="w-20 sm:w-32 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-red-500 h-2 rounded-full"
                  style={{
                    width: `${
                      stats.total ? (stats.high / stats.total) * 100 : 0
                    }%`,
                  }}
                ></div>
              </div>
              <span className="text-xs sm:text-sm text-gray-600 w-6">{stats.high}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-medium text-gray-700">
              Medium Priority
            </span>
            <div className="flex items-center space-x-2">
              <div className="w-20 sm:w-32 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-500 h-2 rounded-full"
                  style={{
                    width: `${
                      stats.total ? (stats.medium / stats.total) * 100 : 0
                    }%`,
                  }}
                ></div>
              </div>
              <span className="text-xs sm:text-sm text-gray-600 w-6">{stats.medium}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-medium text-gray-700">
              Low Priority
            </span>
            <div className="flex items-center space-x-2">
              <div className="w-20 sm:w-32 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{
                    width: `${
                      stats.total ? (stats.low / stats.total) * 100 : 0
                    }%`,
                  }}
                ></div>
              </div>
              <span className="text-xs sm:text-sm text-gray-600 w-6">{stats.low}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Heatmap */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
          Interactive Incident Map
        </h2>
        <div className="mb-3 sm:mb-4 flex flex-wrap gap-2 sm:gap-4">
          <div className="flex items-center space-x-1 sm:space-x-2">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full"></div>
            <span className="text-xs sm:text-sm text-gray-600">Low Priority</span>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-yellow-500 rounded-full"></div>
            <span className="text-xs sm:text-sm text-gray-600">Medium Priority</span>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-full"></div>
            <span className="text-xs sm:text-sm text-gray-600">High Priority</span>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded-full"></div>
            <span className="text-xs sm:text-sm text-gray-600">Your Location</span>
          </div>
        </div>

        <HazardMap reports={reports} userLocation={userLocation} />

        <div className="mt-4 text-sm text-gray-600 space-y-1">
          <p>• Circle size indicates priority level</p>
          <p>• Circle opacity shows status (dimmer = resolved)</p>
          <p>• Click on markers for detailed information</p>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Recent Reports</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Report
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reports.slice(0, 10).map((report) => (
                <tr key={report.id}>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {report.title}
                      </div>
                      {report.description && (
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {report.description}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {report.location ? (
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-1" />
                        {report.location.latitude.toFixed(4)},{" "}
                        {report.location.longitude.toFixed(4)}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">No location</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(
                        report.priority
                      )}`}
                    >
                      {report.priority || "Unknown"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        report.status
                      )}`}
                    >
                      {report.status || "Pending"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatDate(report.timestamp)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
