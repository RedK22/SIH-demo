import React, {useState, useEffect} from "react";
import {MapPin, Calendar, Filter, Search, Eye} from "lucide-react";

const AllReports = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [filters, setFilters] = useState({
    status: "all",
    priority: "all",
    search: "",
  });

  useEffect(() => {
    // Load reports from localStorage
    const savedReports = JSON.parse(
      localStorage.getItem("hazardReports") || "[]"
    );

    // Ensure all reports have required fields
    const processedReports = savedReports.map((report) => ({
      ...report,
      priority: report.priority || "medium", // Default to medium if not set
      status: report.status || "pending",
    }));

    setReports(processedReports);
    setFilteredReports(processedReports);
  }, []);

  useEffect(() => {
    let filtered = reports;

    // Apply filters
    if (filters.status !== "all") {
      filtered = filtered.filter((report) => report.status === filters.status);
    }

    if (filters.priority !== "all") {
      filtered = filtered.filter(
        (report) => report.priority === filters.priority
      );
    }

    if (filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(
        (report) =>
          report.title.toLowerCase().includes(searchTerm) ||
          (report.description &&
            report.description.toLowerCase().includes(searchTerm))
      );
    }

    // Sort by timestamp (newest first)
    filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    setFilteredReports(filtered);
  }, [reports, filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const updateReportStatus = (reportId, newStatus) => {
    const updatedReports = reports.map((report) =>
      report.id === reportId ? {...report, status: newStatus} : report
    );
    setReports(updatedReports);
    localStorage.setItem("hazardReports", JSON.stringify(updatedReports));
  };

  const updateReportPriority = (reportId, newPriority) => {
    const updatedReports = reports.map((report) =>
      report.id === reportId ? {...report, priority: newPriority} : report
    );
    setReports(updatedReports);
    localStorage.setItem("hazardReports", JSON.stringify(updatedReports));
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-100 border-red-200";
      case "medium":
        return "text-yellow-600 bg-yellow-100 border-yellow-200";
      case "low":
        return "text-green-600 bg-green-100 border-green-200";
      default:
        return "text-gray-600 bg-gray-100 border-gray-200";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "text-yellow-600 bg-yellow-100 border-yellow-200";
      case "resolved":
        return "text-green-600 bg-green-100 border-green-200";
      case "investigating":
        return "text-blue-600 bg-blue-100 border-blue-200";
      default:
        return "text-gray-600 bg-gray-100 border-gray-200";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          All Hazard Reports
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Manage and review all submitted hazard reports
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
          {/* Search */}
          <div className="flex-1 min-w-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search reports..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="w-full pl-8 sm:pl-10 pr-4 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="investigating">Investigating</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div>
              <select
                value={filters.priority}
                onChange={(e) => handleFilterChange("priority", e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Priority</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>
          </div>

          <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
            Showing {filteredReports.length} of {reports.length} reports
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 text-center">
            <Eye className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No reports found
            </h3>
            <p className="text-gray-600">
              {filters.search ||
              filters.status !== "all" ||
              filters.priority !== "all"
                ? "Try adjusting your filters to see more results."
                : "No reports have been submitted yet."}
            </p>
          </div>
        ) : (
          filteredReports.map((report) => (
            <div
              key={report.id}
              className="bg-white rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                    {report.title}
                  </h3>
                  {report.description && (
                    <p className="text-sm sm:text-base text-gray-600 mb-3">{report.description}</p>
                  )}

                  <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
                    {report.location && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span>
                          {report.location.latitude.toFixed(4)},{" "}
                          {report.location.longitude.toFixed(4)}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>{formatDate(report.timestamp)}</span>
                    </div>

                    <div>
                      <span className="text-gray-400">ID:</span> {report.id}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:items-end space-y-2 mt-4 sm:mt-0 sm:ml-4">
                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(
                        report.priority
                      )}`}
                    >
                      {report.priority} priority
                    </span>
                    <span
                      className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        report.status
                      )}`}
                    >
                      {report.status}
                    </span>
                  </div>

                  <div className="flex space-x-2">
                    <select
                      value={report.priority}
                      onChange={(e) =>
                        updateReportPriority(report.id, e.target.value)
                      }
                      className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                    </select>
                    <select
                      value={report.status}
                      onChange={(e) =>
                        updateReportStatus(report.id, e.target.value)
                      }
                      className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="investigating">Investigating</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </div>
                </div>
              </div>

              {(report.photos?.length > 0 || report.videos?.length > 0) && (
                <div className="border-t pt-4 mt-4">
                  <div className="flex space-x-4 text-sm text-gray-600">
                    {report.photos?.length > 0 && (
                      <span>
                        📷 {report.photos.length} photo
                        {report.photos.length !== 1 ? "s" : ""}
                      </span>
                    )}
                    {report.videos?.length > 0 && (
                      <span>
                        🎥 {report.videos.length} video
                        {report.videos.length !== 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AllReports;
