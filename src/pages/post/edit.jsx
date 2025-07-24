import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabase.js";
import Header from "../../components/common/Header.jsx";
import Sidebar from "../../components/common/Sidebar.jsx";
import "../../styles/home.css";
import "../../styles/create-post.css";

const EditPostPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get("id");
  const { user, profile, loading } = useAuth();
  
  const [postTitle, setPostTitle] = useState("");
  const [postDescription, setPostDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [interestSearch, setInterestSearch] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [showMoreInterests, setShowMoreInterests] = useState(false);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [eventData, setEventData] = useState(null);

  const predefinedInterests = [
    "Photography", "Coding", "Music", "Sports", "Art", "Reading",
    "Gaming", "Travel", "Food", "Fitness", "Movies", "Nature",
    "Dancing", "Writing", "Cooking", "Science", "Technology", "Fashion",
    "Theater", "Volunteering", "Hiking", "Meditation", "Languages", 
    "History", "Economics", "Business", "Politics", "Philosophy", 
    "Psychology", "Health",
  ];

  useEffect(() => {
    if (eventId) {
      loadEventData();
    } else {
      navigate("/home");
    }
  }, [eventId]);

  const loadEventData = async () => {
    try {
      const { data, error } = await supabase
        .from("Events")
        .select("*")
        .eq("event_id", eventId)
        .single();

      if (error) throw error;

      // Check if user owns this event
      if (data.host_id !== user?.id) {
        alert("You can only edit your own events.");
        navigate("/home");
        return;
      }

      setEventData(data);
      setPostTitle(data.title || "");
      setPostDescription(data.description || "");
      setSelectedInterests(data.related_interests || []);
    } catch (error) {
      console.error("Error loading event:", error);
      alert("Failed to load event data.");
      navigate("/home");
    } finally {
      setLoadingEvent(false);
    }
  };

  const getDisplayedInterests = () => {
    const availableInterests = predefinedInterests.filter(
      (interest) => !selectedInterests.includes(interest),
    );

    if (interestSearch.trim()) {
      return availableInterests.filter((interest) =>
        interest.toLowerCase().includes(interestSearch.toLowerCase()),
      );
    }

    if (showMoreInterests) {
      return availableInterests.slice(0, 15);
    } else {
      return availableInterests.slice(0, 5);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    document.getElementById("image-upload-input").click();
  };

  const handleInterestToggle = (interest) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest],
    );
  };

  const validateForm = () => {
    const errors = {};

    if (!postTitle.trim()) {
      errors.title = "Title is required";
    }

    if (!postDescription.trim()) {
      errors.description = "Description is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const updateData = {
        title: postTitle,
        description: postDescription,
        related_interests: selectedInterests,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("Events")
        .update(updateData)
        .eq("event_id", eventId)
        .select()
        .single();

      if (error) throw error;

      console.log("Event updated successfully:", data);
      navigate(`/post?id=${eventId}`);
    } catch (error) {
      console.error("Error updating event:", error);
      alert("Failed to update event. Please try again.");
    }
  };

  if (loading || loadingEvent) {
    return (
      <div className="min-h-screen bg-global-1 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-global-1">
      <Header
        userName={profile?.name || user?.email || "User"}
        userHandle={profile?.username || `@${user?.email?.split("@")[0]}`}
        userAvatar={profile?.avatar_url}
      />

      <div className="flex flex-1 pt-16 sm:pt-18 lg:pt-24">
        <Sidebar />

        <main className="flex-1 p-6 sm:p-6 lg:pl-[16%] lg:p-[24px_48px] flex justify-center">
          <div className="flex flex-col gap-[20px] lg:gap-[20px] w-[95%] sm:w-[85%] lg:w-[80%] max-w-[800px] mx-auto">
            {/* Page Information */}
            <div className="mb-0 lg:mb-0 text-center">
              <div className="create-post-title">
                <h1 className="text-white text-2xl sm:text-3xl lg:text-[38px] lg:leading-tight font-light drop-shadow-lg relative z-10">
                  Edit Event
                </h1>
              </div>
              <div>
                <div className="create-post-subtitle">
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse shadow-[0_0_12px_rgba(147,122,250,0.8)] relative z-10"></span>
                  <p className="text-white/90 text-sm lg:text-base font-medium drop-shadow-md relative z-10">
                    Update your event information
                  </p>
                </div>
              </div>
            </div>

            {/* Title Input */}
            <div className="w-full">
              <label className="block text-white text-sm lg:text-base font-medium mb-2">
                Event Title *
              </label>
              <input
                type="text"
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                placeholder="Enter your event title..."
                className={`w-full bg-global-3 text-global-1 rounded-[20px] px-4 py-3 lg:px-6 lg:py-4 
                  text-sm lg:text-base transition-colors duration-200 
                  focus:outline-none focus:ring-2 focus:ring-purple-500
                  ${validationErrors.title ? "border-2 border-red-500" : ""}`}
              />
              {validationErrors.title && (
                <p className="text-red-400 text-xs mt-1">
                  {validationErrors.title}
                </p>
              )}
            </div>

            {/* Description Input */}
            <div className="w-full">
              <label className="block text-white text-sm lg:text-base font-medium mb-2">
                Event Description *
              </label>
              <textarea
                value={postDescription}
                onChange={(e) => setPostDescription(e.target.value)}
                placeholder="Describe your event..."
                rows="4"
                className={`w-full bg-global-3 text-global-1 rounded-[20px] px-4 py-3 lg:px-6 lg:py-4 
                  text-sm lg:text-base transition-colors duration-200 resize-none
                  focus:outline-none focus:ring-2 focus:ring-purple-500
                  ${validationErrors.description ? "border-2 border-red-500" : ""}`}
              />
              {validationErrors.description && (
                <p className="text-red-400 text-xs mt-1">
                  {validationErrors.description}
                </p>
              )}
            </div>

            {/* Image Upload */}
            <div className="w-full">
              <label className="block text-white text-sm lg:text-base font-medium mb-2">
                Event Image
              </label>
              <input
                type="file"
                id="image-upload-input"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <div
                onClick={handleImageClick}
                className="w-full h-32 lg:h-40 bg-global-3 rounded-[20px] border-2 border-dashed border-gray-400 
                  flex items-center justify-center cursor-pointer hover:bg-global-5 transition-colors duration-200
                  overflow-hidden"
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-[18px]"
                  />
                ) : (
                  <div className="text-center">
                    <div className="text-gray-600 text-2xl mb-2">📷</div>
                    <p className="text-gray-600 text-sm">
                      Click to upload an image
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Interests Selection */}
            <div className="w-full">
              <label className="block text-white text-sm lg:text-base font-medium mb-2">
                Interests & Tags
              </label>

              {/* Search Bar */}
              <input
                type="text"
                value={interestSearch}
                onChange={(e) => setInterestSearch(e.target.value)}
                placeholder="Search interests..."
                className="w-full bg-global-3 text-global-1 rounded-[15px] px-4 py-2 text-sm 
                  mb-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />

              {/* Selected Interests */}
              {selectedInterests.length > 0 && (
                <div className="mb-3">
                  <p className="text-white text-sm mb-2">Selected:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedInterests.map((interest) => (
                      <span
                        key={interest}
                        onClick={() => handleInterestToggle(interest)}
                        className="bg-purple-600 text-white px-3 py-1 rounded-[12px] text-sm
                          cursor-pointer hover:bg-purple-700 transition-colors duration-200"
                      >
                        {interest} ×
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Available Interests */}
              <div className="flex flex-wrap gap-2">
                {getDisplayedInterests().map((interest) => (
                  <span
                    key={interest}
                    onClick={() => handleInterestToggle(interest)}
                    className="bg-global-3 text-global-1 px-3 py-1 rounded-[12px] text-sm
                      cursor-pointer hover:bg-global-5 transition-colors duration-200"
                  >
                    + {interest}
                  </span>
                ))}

                {!interestSearch.trim() &&
                  !showMoreInterests &&
                  getDisplayedInterests().length === 5 && (
                    <button
                      onClick={() => setShowMoreInterests(true)}
                      className="text-purple-400 hover:text-purple-300 text-sm underline"
                    >
                      Show more...
                    </button>
                  )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                onClick={() => navigate(`/post?id=${eventId}`)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white 
                  px-6 py-3 lg:px-8 lg:py-4 rounded-[20px] transition-colors duration-200 
                  text-sm lg:text-base font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white 
                  px-6 py-3 lg:px-8 lg:py-4 rounded-[20px] transition-colors duration-200 
                  text-sm lg:text-base font-medium"
              >
                Update Event
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditPostPage; 