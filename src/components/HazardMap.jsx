import React, {useEffect, useState} from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";

// Fix default markers in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const MapUpdater = ({center}) => {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView([center.lat, center.lng], 12);
    }
  }, [center, map]);

  return null;
};

const HazardMap = ({reports, userLocation}) => {
  const [mapCenter, setMapCenter] = useState([19.076, 72.8777]); // Default to Mumbai

  useEffect(() => {
    if (userLocation) {
      setMapCenter([userLocation.lat, userLocation.lng]);
    } else if (reports.length > 0) {
      // Center on reports if available
      const avgLat =
        reports.reduce(
          (sum, report) => sum + (report.location?.latitude || 0),
          0
        ) / reports.length;
      const avgLng =
        reports.reduce(
          (sum, report) => sum + (report.location?.longitude || 0),
          0
        ) / reports.length;

      if (avgLat && avgLng) {
        setMapCenter([avgLat, avgLng]);
      }
    }
  }, [reports, userLocation]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "#ef4444"; // red
      case "medium":
        return "#f59e0b"; // yellow
      case "low":
        return "#10b981"; // green
      default:
        return "#6b7280"; // gray
    }
  };

  const getPriorityRadius = (priority) => {
    switch (priority) {
      case "high":
        return 12;
      case "medium":
        return 8;
      case "low":
        return 6;
      default:
        return 6;
    }
  };

  const getStatusOpacity = (status) => {
    switch (status) {
      case "resolved":
        return 0.4;
      case "investigating":
        return 0.7;
      case "pending":
        return 0.9;
      default:
        return 0.7;
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="h-96 w-full rounded-lg overflow-hidden shadow-md">
      <MapContainer
        center={mapCenter}
        zoom={12}
        className="h-full w-full"
        zoomControl={true}
      >
        <MapUpdater center={{lat: mapCenter[0], lng: mapCenter[1]}} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User Location Marker */}
        {userLocation && (
          <CircleMarker
            center={[userLocation.lat, userLocation.lng]}
            radius={8}
            pathOptions={{
              color: "#3b82f6",
              fillColor: "#3b82f6",
              fillOpacity: 0.8,
              weight: 3,
            }}
          >
            <Popup>
              <div className="text-sm">
                <strong>Your Location</strong>
                <br />
                {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
              </div>
            </Popup>
          </CircleMarker>
        )}

        {/* Report Markers */}
        {reports
          .filter((report) => report.location)
          .map((report) => (
            <CircleMarker
              key={report.id}
              center={[report.location.latitude, report.location.longitude]}
              radius={getPriorityRadius(report.priority)}
              pathOptions={{
                color: getPriorityColor(report.priority),
                fillColor: getPriorityColor(report.priority),
                fillOpacity: getStatusOpacity(report.status),
                weight: 2,
              }}
            >
              <Popup>
                <div className="text-sm max-w-xs">
                  <div className="font-semibold text-gray-900 mb-2">
                    {report.title}
                  </div>

                  {report.description && (
                    <div className="text-gray-600 mb-2">
                      {report.description.length > 100
                        ? report.description.substring(0, 100) + "..."
                        : report.description}
                    </div>
                  )}

                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Priority:</span>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          report.priority === "high"
                            ? "bg-red-100 text-red-700"
                            : report.priority === "medium"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {report.priority}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-500">Status:</span>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          report.status === "resolved"
                            ? "bg-green-100 text-green-700"
                            : report.status === "investigating"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {report.status}
                      </span>
                    </div>

                    <div className="text-gray-500 text-xs pt-1">
                      {formatDate(report.timestamp)}
                    </div>

                    <div className="text-gray-400 text-xs">ID: {report.id}</div>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          ))}
      </MapContainer>
    </div>
  );
};

export default HazardMap;
