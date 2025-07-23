import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabase.js";
import Header from "../../components/common/Header.jsx";
import Sidebar from "../../components/common/Sidebar.jsx";
import ExpandableComment from "../../components/ui/Add-Comment.jsx";
import CommentSection from "../../components/ui/Comments-Section.jsx";
import UpVotesSection from "../../components/ui/Vote-Buttons.jsx";
import ActionButton from "../../components/ui/Action-Button.jsx";
import RSVPButton from "../../components/ui/RSVP-Button.jsx";

const PostDetailPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get("id");
  const { user, profile, loading } = useAuth();

  const [event, setEvent] = useState(null);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [error, setError] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [activeMenuItem, setActiveMenuItem] = useState("");

  // Fallback post data for demonstration
  const fallbackPost = {
    id: "ASNJK-72800",
    userName: "Jamie Silva",
    timeAgo: "2 days ago",
    title: "Photography Club Meetup - Sunset Photo Walk",
    description:
      "Join us for a spectacular sunset photo walk around campus! We'll be exploring the best spots for golden hour photography, sharing tips and techniques, and connecting with fellow photography enthusiasts. Perfect for all skill levels - bring your camera and let's capture some amazing shots together!",
    upvotes: 124,
    downvotes: 3,
    totalComments: 0,
    imageUrl: "/images/sunset-campus.jpg",
  };

  useEffect(() => {
    if (eventId) {
      loadEvent();
    } else {
      setLoadingEvent(false);
    }
  }, [eventId]);

  const loadEvent = async () => {
    setLoadingEvent(true);
    try {
      const { data, error } = await supabase
        .from("Events")
        .select(
          `
          *,
          profiles:host_id (
            name,
            username,
            avatar_url
          )
        `,
        )
        .eq("event_id", eventId)
        .single();

      if (error) throw error;

      // Transform event data to match original post format
      const transformedEvent = {
        id: data.event_id,
        userName: data.profiles?.name || data.profiles?.username || "Anonymous",
        timeAgo: formatTimeAgo(data.created_at),
        title: data.title,
        description: data.description,
        upvotes: data.upvotes_count || 0,
        downvotes: data.downvotes_count || 0,
        totalComments: data.comments_count || 0,
        rsvpCount: data.rsvp_count || 0,
        imageUrl: data.image_url || "/images/sunset-campus.jpg",
      };

      setEvent(transformedEvent);
    } catch (error) {
      console.error("Error loading event:", error);
      setError("Failed to load event");
    } finally {
      setLoadingEvent(false);
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hours ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return "1 day ago";
    if (diffInDays < 7) return `${diffInDays} days ago`;

    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks === 1) return "1 week ago";
    if (diffInWeeks < 4) return `${diffInWeeks} weeks ago`;

    return date.toLocaleDateString();
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleMenuClick = (menuItem) => {
    setActiveMenuItem(menuItem);
  };

  const handleCommentAdded = (newComment) => {
    // Refresh the event to get updated comment count
    if (eventId) {
      loadEvent();
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
    return (
      <div className="min-h-screen bg-global-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-white text-2xl mb-4">
            Please log in to continue
          </h2>
          <button
            onClick={() => navigate("/login")}
            className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-[20px] transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Use loaded event or fallback data
  const post = event || fallbackPost;

  return (
    <div className="flex flex-col min-h-screen bg-global-1 font-ropa">
      {/* Header */}
      <Header
        showSearch={true}
        searchPlaceholder="Search Posts"
        userName={profile?.name || profile?.username || "John Doe"}
        userHandle={profile?.username ? `@${profile.username}` : "@johndoe"}
        userAvatar={profile?.avatar_url || "/images/default-avatar.png"}
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
      />

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar
          activeMenuItem={activeMenuItem}
          onMenuClick={handleMenuClick}
        />

        {/* Post Detail Content */}
        <main className="mt-[80px] flex-1 p-6 sm:p-6 lg:p-[44px_48px] flex justify-center">
          <div className="w-[95%] sm:w-[85%] lg:w-[80%] max-w-[800px] mx-auto">
            {/* Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-global-4
                hover:text-purple-400 mb-6 transition-colors"
            >
              <img
                src="/images/vote-arrow-white.png"
                alt="back"
                className="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4"
              />
              <span className="text-sm lg:text-[18px]">Back to Posts</span>
            </button>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-[20px]">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {/* Main Post */}
            <article
              className="bg-global-2 rounded-[35px] p-3 sm:p-4
              lg:p-[24px] w-full mb-6"
            >
              {/* Post Header */}
              <div
                className="flex items-center gap-2 sm:gap-3 lg:gap-4 mb-3
                lg:mb-4"
              >
                <div
                  className="w-10 h-10 sm:w-12 sm:h-12 lg:w-[56px]
                  lg:h-[56px] bg-gradient-to-br from-purple-400 to-blue-500
                  rounded-full flex-shrink-0"
                ></div>
                <div
                  className="flex items-center gap-2 sm:gap-2 lg:gap-[12px]
                  flex-wrap"
                >
                  <span
                    className="text-global-1 text-sm sm:text-base
                    lg:text-[24px] lg:leading-[26px] font-normal"
                  >
                    {post.userName} •
                  </span>
                  <span
                    className="text-global-2 text-sm sm:text-base
                    lg:text-[24px] lg:leading-[26px] font-normal"
                  >
                    {post.timeAgo}
                  </span>
                </div>
              </div>

              {/* Post Title */}
              <h1
                className="text-global-1 text-lg sm:text-xl lg:text-[32px]
                lg:leading-[36px] font-normal mb-3 lg:mb-4"
              >
                {post.title}
              </h1>

              {/* Post Description */}
              <p
                className="text-global-1 text-sm sm:text-base lg:text-[18px]
                lg:leading-[24px] font-normal mb-4 lg:mb-6"
              >
                {post.description}
              </p>

              {/* Post Image */}
              <div
                className="w-full h-32 sm:h-40 lg:h-[320px] bg-global-5
                rounded-[20px] sm:rounded-[25px] lg:rounded-[35px] mb-3
                lg:mb-[20px]"
              ></div>

              {/* Post Actions */}
              <div className="flex items-center gap-2 sm:gap-3 lg:gap-[12px] flex-wrap">
                {/* Upvote Section */}
                <UpVotesSection
                  upvotes={post.upvotes}
                  downvotes={post.downvotes || 0}
                  eventId={eventId || post.id}
                  userId={user?.id}
                  light={true}
                />

                {/* RSVP Button */}
                <RSVPButton
                  eventId={eventId || post.id}
                  userId={user?.id}
                  initialRsvpCount={post.rsvpCount || 0}
                  className="ml-1"
                />

                {/* Comment Count */}
                <div
                  className="flex items-center gap-2 px-3 py-2 bg-global-3
                  rounded-[15px] lg:rounded-[22px]"
                >
                  <img
                    src="/images/img_speech_bubble.png"
                    alt="comments"
                    className="w-4 h-4 lg:w-[24px] lg:h-[24px]"
                  />
                  <span className="text-global-1 text-xs sm:text-sm lg:text-[20px] font-normal">
                    {post.totalComments} comments
                  </span>
                </div>

                {/* Share Button */}
                <ActionButton
                  type="share"
                  onClick={() => {}}
                  eventId={eventId || post.id}
                  userId={user?.id}
                  shareMethod="link"
                >
                  Share
                </ActionButton>
              </div>
            </article>

            {/* Comment Form */}
            <ExpandableComment
              eventId={eventId || post.id}
              userId={user?.id}
              onCommentAdded={handleCommentAdded}
            />

            {/* Comments Section */}
            <CommentSection eventId={eventId || post.id} userId={user?.id} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default PostDetailPage;
