import React, {useState} from "react";
import {Eye, X, Download, Camera, Video} from "lucide-react";

const MediaPreview = ({photos = [], videos = []}) => {
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const openPreview = (media, type) => {
    // Check if media is already a stored object with data URL
    if (media.data) {
      setSelectedMedia({
        src: media.data,
        type,
        name: media.name,
        size: media.size,
      });
      setShowModal(true);
    } else {
      // Handle File objects
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedMedia({
          src: e.target.result,
          type,
          name: media.name,
          size: media.size,
        });
        setShowModal(true);
      };
      reader.readAsDataURL(media);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedMedia(null);
  };

  const downloadMedia = () => {
    if (selectedMedia) {
      const link = document.createElement("a");
      link.href = selectedMedia.src;
      link.download = selectedMedia.name;
      link.click();
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const totalMedia = photos.length + videos.length;

  if (totalMedia === 0) {
    return <span className="text-sm text-gray-400">No media</span>;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-4 text-sm">
        {photos.length > 0 && (
          <div className="flex items-center space-x-1">
            <Camera className="h-4 w-4 text-blue-500" />
            <span className="text-gray-600">
              {photos.length} photo{photos.length !== 1 ? "s" : ""}
            </span>
          </div>
        )}
        {videos.length > 0 && (
          <div className="flex items-center space-x-1">
            <Video className="h-4 w-4 text-green-500" />
            <span className="text-gray-600">
              {videos.length} video{videos.length !== 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {photos.map((photo, index) => (
          <button
            key={`photo-${index}`}
            onClick={() => openPreview(photo, "image")}
            className="flex items-center space-x-1 px-2 py-1 bg-blue-50 hover:bg-blue-100 rounded text-xs text-blue-600 border border-blue-200 transition-colors"
          >
            <Eye className="h-3 w-3" />
            <span>Photo {index + 1}</span>
          </button>
        ))}

        {videos.map((video, index) => (
          <button
            key={`video-${index}`}
            onClick={() => openPreview(video, "video")}
            className="flex items-center space-x-1 px-2 py-1 bg-green-50 hover:bg-green-100 rounded text-xs text-green-600 border border-green-200 transition-colors"
          >
            <Eye className="h-3 w-3" />
            <span>Video {index + 1}</span>
          </button>
        ))}
      </div>

      {/* Modal */}
      {showModal && selectedMedia && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <div>
                <h3 className="font-semibold text-lg">{selectedMedia.name}</h3>
                <p className="text-sm text-gray-500">
                  {formatFileSize(selectedMedia.size)}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={downloadMedia}
                  className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                  title="Download"
                >
                  <Download className="h-5 w-5 text-gray-600" />
                </button>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                  title="Close"
                >
                  <X className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              {selectedMedia.type === "image" ? (
                <img
                  src={selectedMedia.src}
                  alt={selectedMedia.name}
                  className="max-w-full max-h-[70vh] object-contain mx-auto"
                />
              ) : (
                <video
                  src={selectedMedia.src}
                  controls
                  className="max-w-full max-h-[70vh] mx-auto"
                >
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaPreview;
