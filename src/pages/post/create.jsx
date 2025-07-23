import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabase.js";
import {
  scrapeEventData,
  scrapeLiveEvents,
  scrapeBatchEvents,
  checkScrapingCapability,
} from "../../utils/improvedScraper.js";
import Header from "../../components/common/Header.jsx";
import Sidebar from "../../components/common/Sidebar.jsx";
import UpVoteSection from "../../components/ui/Vote-Buttons.jsx";
import ActionButton from "../../components/ui/Action-Button.jsx";

import "../../styles/home.css";
import "../../styles/create-post.css";

const CreatePostPage = () => {
  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();
  const [postTitle, setPostTitle] = useState("");
  const [postDescription, setPostDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [interestSearch, setInterestSearch] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [showMoreInterests, setShowMoreInterests] = useState(false);

  // Enhanced scraping functionality (NO PYTHON NEEDED!)
  const [scrapedEvents, setScrapedEvents] = useState([]);
  const [isScraping, setIsScraping] = useState(false);
  const [scrapingUrl, setScrapingUrl] = useState("");
  const [scrapingMode, setScrapingMode] = useState("single"); // 'single', 'batch', 'live'
  const [scrapingResults, setScrapingResults] = useState(null);

  const predefinedInterests = [
    "Photography",
    "Coding",
    "Music",
    "Sports",
    "Art",
    "Reading",
    "Gaming",
    "Travel",
    "Food",
    "Fitness",
    "Movies",
    "Nature",
    "Dancing",
    "Writing",
    "Cooking",
    "Science",
    "Technology",
    "Fashion",
    "Theater",
    "Volunteering",
    "Hiking",
    "Meditation",
    "Languages",
    "History",
    "Economics",
    "Business",
    "Politics",
    "Philosophy",
    "Psychology",
    "Health",
  ];

  // Enhanced browser-based scraping (NO PYTHON!)
  const handleBrowserScraping = async () => {
    if (!scrapingUrl.trim()) {
      alert("Please enter a URL to scrape");
      return;
    }

    setIsScraping(true);
    setScrapingResults(null);

    try {
      console.log("🚀 Starting browser-based scraping (NO PYTHON NEEDED!)...");

      if (scrapingMode === "live") {
        // Live real-time scraping
        const events = await scrapeLiveEvents(scrapingUrl);
        setScrapedEvents(events);
        setScrapingResults({
          success: true,
          message: `Successfully scraped ${events.length} events in real-time!`,
          method: "Browser Live Scraping",
        });
      } else if (scrapingMode === "batch") {
        // Batch scraping multiple URLs
        const urls = scrapingUrl.split("\n").filter((url) => url.trim());
        const results = await scrapeBatchEvents(urls);

        const allEvents = results
          .filter((r) => r.success)
          .flatMap((r) => r.events);
        setScrapedEvents(allEvents);
        setScrapingResults({
          success: true,
          message: `Batch scraped ${allEvents.length} events from ${results.filter((r) => r.success).length}/${urls.length} URLs`,
          method: "Browser Batch Scraping",
          details: results,
        });
      } else {
        // Single URL scraping with enhanced methods
        const events = await scrapeEventData(scrapingUrl);
        setScrapedEvents(events);
        setScrapingResults({
          success: true,
          message: `Found ${events.length} events using browser scraping!`,
          method: "Browser JavaScript Scraping",
        });
      }
    } catch (error) {
      console.error("Browser scraping failed:", error);
      setScrapingResults({
        success: false,
        message: `Scraping failed: ${error.message}`,
        method: "Browser Scraping Error",
      });
    } finally {
      setIsScraping(false);
    }
  };

  // Check if URL is scrapable
  const checkScrapingCompatibility = async () => {
    if (!scrapingUrl.trim()) return;

    try {
      const capability = await checkScrapingCapability(scrapingUrl);
      alert(`
🔍 Scraping Analysis:
• Platform: ${capability.platform}
• Accessible: ${capability.accessible ? "✅ Yes" : "❌ No"}  
• CORS Enabled: ${capability.corsEnabled ? "✅ Yes" : "⚠️ Proxy Required"}
• Recommendation: ${capability.accessible ? "Ready to scrape!" : "May need CORS proxy"}
      `);
    } catch (error) {
      alert(`Analysis failed: ${error.message}`);
    }
  };

  // Load scraped event data into form
  const loadScrapedEvent = (event) => {
    setPostTitle(event.title);
    setPostDescription(event.description);
    setSelectedInterests(event.interests || []);
  };

  // Sample URLs for demonstration
  const sampleUrls = {
    santacruz: "https://www.cityofsantacruz.com/community/special-events",
    eventbrite: "https://www.eventbrite.com/d/ca--santa-cruz/events/",
    meetup:
      "https://www.meetup.com/find/?keywords=tech&location=Santa%20Cruz%2C%20CA",
    facebook: "https://www.facebook.com/events/search/?q=santa%20cruz%20events",
  };

  // Get interests to display based on current state
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
      const eventData = {
        title: postTitle,
        description: postDescription,
        location: "Santa Cruz, CA",
        start_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        end_time: new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString(),
        is_free: true,
        price_info: null,
        external_url: null,
        category: null,
        related_interests: selectedInterests,
        event_type: "user_created",
        source: "manual",
        host_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        upvotes_count: 0,
        downvotes_count: 0,
        comments_count: 0,
        rsvp_count: 0,
      };

      const { data, error } = await supabase
        .from("Events")
        .insert([eventData])
        .select()
        .single();

      if (error) throw error;

      console.log("Event created successfully:", data);
      navigate("/home");
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Failed to create event. Please try again.");
    }
  };

  if (loading) {
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
                  Create a post below
                </h1>
              </div>
              <div>
                <div className="create-post-subtitle">
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse shadow-[0_0_12px_rgba(147,122,250,0.8)] relative z-10"></span>
                  <p className="text-white/90 text-sm lg:text-base font-medium drop-shadow-md relative z-10">
                    Fill in all required information • 🚀 NEW: Browser scraping
                    (NO PYTHON!)
                  </p>
                </div>
              </div>
            </div>

            {/* NEW: Enhanced Browser-Based Event Scraping Section */}
            <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-[25px] p-4 mb-4 border border-purple-500/20">
              <h3 className="text-white text-lg font-medium mb-3 flex items-center">
                🌐 Browser Event Scraping{" "}
                <span className="text-sm text-green-400 ml-2">
                  (NO PYTHON REQUIRED!)
                </span>
              </h3>

              {/* Scraping Mode Selector */}
              <div className="flex gap-2 mb-3">
                <button
                  onClick={() => setScrapingMode("single")}
                  className={`px-3 py-1 rounded-[10px] text-sm transition-colors ${
                    scrapingMode === "single"
                      ? "bg-purple-600 text-white"
                      : "bg-gray-700 text-gray-300"
                  }`}
                >
                  Single URL
                </button>
                <button
                  onClick={() => setScrapingMode("live")}
                  className={`px-3 py-1 rounded-[10px] text-sm transition-colors ${
                    scrapingMode === "live"
                      ? "bg-purple-600 text-white"
                      : "bg-gray-700 text-gray-300"
                  }`}
                >
                  Live Scraping
                </button>
                <button
                  onClick={() => setScrapingMode("batch")}
                  className={`px-3 py-1 rounded-[10px] text-sm transition-colors ${
                    scrapingMode === "batch"
                      ? "bg-purple-600 text-white"
                      : "bg-gray-700 text-gray-300"
                  }`}
                >
                  Batch URLs
                </button>
              </div>

              {/* URL Input */}
              <div className="flex gap-2 mb-3">
                <textarea
                  value={scrapingUrl}
                  onChange={(e) => setScrapingUrl(e.target.value)}
                  placeholder={
                    scrapingMode === "batch"
                      ? "Enter multiple URLs (one per line):\nhttps://eventbrite.com/...\nhttps://meetup.com/..."
                      : "Enter event website URL (e.g., https://eventbrite.com/...)"
                  }
                  className="flex-1 bg-gray-800 text-white rounded-[10px] px-3 py-2 text-sm resize-none"
                  rows={scrapingMode === "batch" ? 3 : 1}
                />
                <button
                  onClick={checkScrapingCompatibility}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-[10px] text-sm transition-colors"
                  title="Check if URL is scrapable"
                >
                  🔍
                </button>
              </div>

              {/* Sample URLs */}
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="text-gray-400 text-sm">Quick fill:</span>
                {Object.entries(sampleUrls).map(([platform, url]) => (
                  <button
                    key={platform}
                    onClick={() => setScrapingUrl(url)}
                    className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded-[8px] transition-colors capitalize"
                  >
                    {platform}
                  </button>
                ))}
              </div>

              {/* Scraping Button */}
              <button
                onClick={handleBrowserScraping}
                disabled={isScraping || !scrapingUrl.trim()}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-[15px] transition-colors text-sm font-medium disabled:cursor-not-allowed"
              >
                {isScraping
                  ? "🔄 Scraping..."
                  : "🚀 Scrape Events (Browser-Only)"}
              </button>

              {/* Scraping Results */}
              {scrapingResults && (
                <div
                  className={`mt-3 p-3 rounded-[10px] text-sm ${
                    scrapingResults.success
                      ? "bg-green-900/30 text-green-300"
                      : "bg-red-900/30 text-red-300"
                  }`}
                >
                  <div className="font-medium">{scrapingResults.method}</div>
                  <div>{scrapingResults.message}</div>
                  {scrapingResults.details && (
                    <div className="text-xs mt-1 opacity-80">
                      {JSON.stringify(scrapingResults.details, null, 2)}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Scraped Events Quick Load */}
            {scrapedEvents.length > 0 && (
              <div className="bg-purple-900/20 rounded-[20px] p-3 mb-4">
                <p className="text-white text-sm mb-2">
                  ✨ Scraped Events (Click to load):
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {scrapedEvents.slice(0, 5).map((event, index) => (
                    <button
                      key={index}
                      onClick={() => loadScrapedEvent(event)}
                      className="text-left bg-purple-800/30 hover:bg-purple-700/30 text-white p-3 rounded-[10px] transition-colors"
                    >
                      <div className="font-medium text-sm">{event.title}</div>
                      <div className="text-xs text-gray-300 mt-1">
                        {event.location} • {event.source} •{" "}
                        {event.interests?.join(", ")}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Existing form fields remain the same... */}
            {/* ... rest of the form code ... */}

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
            <button
              onClick={handleSubmit}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white 
                px-6 py-3 lg:px-8 lg:py-4 rounded-[20px] transition-colors duration-200 
                text-sm lg:text-base font-medium"
            >
              Create Event Post
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreatePostPage;
