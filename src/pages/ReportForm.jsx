import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {MapPin, Camera, Send, AlertTriangle} from "lucide-react";

const ReportForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: null,
    photos: [],
    videos: [],
  });
  const [locationError, setLocationError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Request location permission on component mount
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            location: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
            },
          }));
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setLocationError("Location access denied by user.");
              break;
            case error.POSITION_UNAVAILABLE:
              setLocationError("Location information is unavailable.");
              break;
            case error.TIMEOUT:
              setLocationError("Location request timed out.");
              break;
            default:
              setLocationError(
                "An unknown error occurred while retrieving location."
              );
              break;
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      setLocationError("Geolocation is not supported by this browser.");
    }
  }, []);

  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e, type) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      [type]: [...prev[type], ...files],
    }));
  };

  const removeFile = (index, type) => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert("Title is required");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    try {
      // In a real app, you would send this to your backend
      const report = {
        ...formData,
        id: Date.now(),
        timestamp: new Date().toISOString(),
        status: "pending",
        priority: "medium", // Default priority, can be changed by admin
      };

      // Store in localStorage for demo purposes
      const existingReports = JSON.parse(
        localStorage.getItem("hazardReports") || "[]"
      );
      existingReports.push(report);
      localStorage.setItem("hazardReports", JSON.stringify(existingReports));

      alert("Report submitted successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error submitting report:", error);
      alert("Error submitting report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
        <div className="flex items-center space-x-3 mb-4 sm:mb-6">
          <AlertTriangle className="h-6 w-6 sm:h-8 sm:w-8 text-red-500" />
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Submit Hazard Report
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Location Display */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">Current Location</h3>
                {formData.location ? (
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Latitude: {formData.location.latitude.toFixed(6)}</p>
                    <p>Longitude: {formData.location.longitude.toFixed(6)}</p>
                    <p className="text-xs text-green-600">
                      ✓ Location captured
                    </p>
                  </div>
                ) : locationError ? (
                  <p className="text-sm text-red-600">{locationError}</p>
                ) : (
                  <p className="text-sm text-gray-600">
                    Getting your location...
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Report Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Brief description of the hazard (e.g., Oil spill near coast)"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Detailed Description (Optional)
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Provide additional details about the hazard, its severity, and any immediate impacts observed..."
            />
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Photos (Optional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <div className="text-center">
                <Camera className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-2">
                  <label className="cursor-pointer">
                    <span className="text-blue-600 hover:text-blue-500">
                      Upload photos
                    </span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, "photos")}
                      className="sr-only"
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG, GIF up to 10MB each
                </p>
              </div>

              {formData.photos.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {formData.photos.map((file, index) => (
                    <div
                      key={index}
                      className="relative bg-gray-100 rounded-lg p-2"
                    >
                      <p className="text-xs text-gray-600 truncate">
                        {file.name}
                      </p>
                      <button
                        type="button"
                        onClick={() => removeFile(index, "photos")}
                        className="absolute top-1 right-1 text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Video Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Videos (Optional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <div className="text-center">
                <Camera className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-2">
                  <label className="cursor-pointer">
                    <span className="text-blue-600 hover:text-blue-500">
                      Upload videos
                    </span>
                    <input
                      type="file"
                      multiple
                      accept="video/*"
                      onChange={(e) => handleFileChange(e, "videos")}
                      className="sr-only"
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  MP4, MOV, AVI up to 50MB each
                </p>
              </div>

              {formData.videos.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {formData.videos.map((file, index) => (
                    <div
                      key={index}
                      className="relative bg-gray-100 rounded-lg p-2"
                    >
                      <p className="text-xs text-gray-600 truncate">
                        {file.name}
                      </p>
                      <button
                        type="button"
                        onClick={() => removeFile(index, "videos")}
                        className="absolute top-1 right-1 text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center sm:justify-end">
            <button
              type="submit"
              disabled={isSubmitting || !formData.title.trim()}
              className={`flex items-center justify-center space-x-2 w-full sm:w-auto px-6 py-3 rounded-md font-medium transition-colors ${
                isSubmitting || !formData.title.trim()
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700 text-white"
              }`}
            >
              <Send className="h-5 w-5" />
              <span>{isSubmitting ? "Submitting..." : "Submit Report"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportForm;
