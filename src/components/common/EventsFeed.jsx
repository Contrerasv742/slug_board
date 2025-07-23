import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabase.js";
import { incrementField, decrementField } from "../../utils/databaseHelpers.js";
import UpVotesSection from "../ui/Vote-Buttons.jsx";
import ActionButton from "../ui/Action-Button.jsx";
import RSVPButton from "../ui/RSVP-Button.jsx";
import EventActions from "../ui/EventActions.jsx";

const EventsFeed = ({
  feedType = "all", // 'all', 'user', 'explore'
  limit = 50,
  autoRefresh = false,
  showCreateButton = true,
  searchValue = "",
}) => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadEvents();

    // Auto-refresh every 30 seconds if enabled
    if (autoRefresh) {
      const interval = setInterval(loadEvents, 30000);
      return () => clearInterval(interval);
    }
  }, [feedType, limit, autoRefresh]);

  const loadEvents = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoadingEvents(true);
    }

    try {
      // Build query based on feed type
      let query = supabase
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
        .order("created_at", { ascending: false })
        .limit(limit);

      // Filter by feed type
      if (feedType === "user") {
        query = query.eq("event_type", "user_created");
      } else if (feedType === "scraped") {
        query = query.eq("event_type", "campus");
      } else if (feedType === "explore") {
        // For explore, prioritize diverse content
        query = query.or("event_type.eq.campus,event_type.eq.user_created");
      }

      const { data, error } = await query;

      if (error) throw error;

      // Transform ALL events to match original post format
      const transformedEvents = data.map((event) => ({
        id: event.event_id,
        userName:
          event.profiles?.name || event.profiles?.username || "Anonymous",
        timeAgo: formatTimeAgo(event.created_at),
        title: event.title,
        description: event.description,
        upvotes: event.upvotes_count || 0,
        downvotes: event.downvotes_count || 0,
        hasComments: (event.comments_count || 0) > 0,
        canShare: true,
        // Database fields for functionality
        eventId: event.event_id,
        hostId: event.host_id,
        eventType: event.event_type || "user_created",
        source: event.source || "manual",
        location: event.location,
        startTime: event.start_time,
        endTime: event.end_time,
        interests: event.related_interests || [],
      }));

      // If no database events, add sample events for demo
      if (transformedEvents.length === 0) {
        const sampleEvents = getSampleEvents();
        setEvents(sampleEvents);
      } else {
        setEvents(transformedEvents);
      }

      setError("");
    } catch (error) {
      console.error("Error loading events:", error);
      setError("Failed to load events. Please try again.");
      
      // Fallback to sample events
      const sampleEvents = getSampleEvents();
      setEvents(sampleEvents);
    } finally {
      setLoadingEvents(false);
      setRefreshing(false);
    }
  };

  // Sample events with your original format
  const getSampleEvents = () => {
    return [
      {
        id: "ASNJK-72800",
        userName: "User Name",
        timeAgo: "2 days ago",
        title: "Post Name...",
        description: "Economics get money",
        upvotes: 534,
        downvotes: 7,
        hasComments: true,
        canShare: true,
        eventId: "ASNJK-72800",
        eventType: "user_created",
        source: "sample",
        location: "Campus Library",
        interests: ["Economics", "Business"],
        rsvpCount: 12,
      },
      {
        id: "ankNJK-72800",
        userName: "User Name",
        timeAgo: "2 days ago",
        title: "General Meeting",
        description: "Stoners Unites",
        upvotes: 420,
        downvotes: 12,
        hasComments: true,
        canShare: true,
        eventId: "ankNJK-72800",
        eventType: "user_created",
        source: "sample",
        location: "Student Center",
        interests: ["Social", "Community"],
        rsvpCount: 45,
      },
      {
        id: "djskna-74938a",
        userName: "User Name",
        timeAgo: "2 days ago",
        title: "Mission 101",
        description: "Learn about campus mission and values",
        upvotes: 69,
        downvotes: 3,
        hasComments: true,
        canShare: true,
        eventId: "djskna-74938a",
        eventType: "campus",
        source: "sample",
        location: "Administration Building",
        interests: ["Academic", "Learning"],
        rsvpCount: 28,
      },
      {
        id: "santa-farmers-market",
        userName: "Santa Cruz Events",
        timeAgo: "1 day ago",
        title: "Downtown Farmers' Market",
        description:
          "Find your favorite Farmers' Market vendors at its new site on Church and Cedar Streets in Downtown Santa Cruz. Featuring organic produce, artisan goods and more.",
        upvotes: 89,
        downvotes: 2,
        hasComments: true,
        canShare: true,
        eventId: "santa-farmers-market",
        eventType: "campus",
        source: "scraped",
        location: "Church and Cedar Streets, Santa Cruz",
        interests: ["Food", "Community", "Health"],
        rsvpCount: 67,
      },
      {
        id: "makers-market-sc",
        userName: "Santa Cruz Events",
        timeAgo: "3 hours ago",
        title: "Santa Cruz Makers Market",
        description:
          "The Santa Cruz Makers Market featuring 40+ local artisan vendors on the 1100 block of Pacific Avenue between Cathcart and Lincoln Streets.",
        upvotes: 156,
        downvotes: 4,
        hasComments: true,
        canShare: true,
        eventId: "makers-market-sc",
        eventType: "campus",
        source: "scraped",
        location: "Downtown Pacific Avenue, Santa Cruz",
        interests: ["Art", "Shopping", "Community"],
        rsvpCount: 134,
      },
    ];
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

  const handleRefresh = () => {
    loadEvents(true);
  };

  // Handle event voting
  const handleEventVote = async (eventId, voteType) => {
    if (!user?.id) {
      console.error("User must be logged in to vote");
      return;
    }

    try {
      // Check if user already voted on this event
      const { data: existingVote, error: fetchError } = await supabase
        .from("EventUpvotes")
        .select("*")
        .eq("event_id", eventId)
        .eq("user_id", user.id)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        throw fetchError;
      }

      if (existingVote) {
        if (existingVote.vote_type === voteType) {
          // Remove vote
          await supabase
            .from("EventUpvotes")
            .delete()
            .eq("id", existingVote.id);

          // Update event count
          const updateField =
            voteType === "upvote" ? "upvotes_count" : "downvotes_count";
          await decrementField("Events", eventId, updateField);
        } else {
          // Switch vote type
          await supabase
            .from("EventUpvotes")
            .update({ vote_type: voteType })
            .eq("id", existingVote.id);

          // Update event counts
          const oldField =
            existingVote.vote_type === "upvote"
              ? "upvotes_count"
              : "downvotes_count";
          const newField =
            voteType === "upvote" ? "upvotes_count" : "downvotes_count";

          await decrementField("Events", eventId, oldField);
          await incrementField("Events", eventId, newField);
        }
      } else {
        // Create new vote
        await supabase.from("EventUpvotes").insert([
          {
            event_id: eventId,
            user_id: user.id,
            vote_type: voteType,
            created_at: new Date().toISOString(),
          },
        ]);

        // Update event count
        const updateField =
          voteType === "upvote" ? "upvotes_count" : "downvotes_count";
        await incrementField("Events", eventId, updateField);
      }

      // Reload events to reflect changes
      await loadEvents(true);
    } catch (error) {
      console.error("Error handling event vote:", error);
    }
  };

  const getEventTypeLabel = (eventType, source) => {
    if (eventType === "campus" && source === "scraped")
      return "🌐 Scraped Event";
    if (eventType === "campus") return "📍 Local Event";
    if (source === "sample") return "💡 Sample Event";
    return "👤 User Post";
  };

  const getEventTypeColor = (eventType, source) => {
    if (eventType === "campus" && source === "scraped")
      return "bg-blue-500/20 text-blue-400";
    if (eventType === "campus") return "bg-green-500/20 text-green-400";
    if (source === "sample") return "bg-yellow-500/20 text-yellow-400";
    return "bg-purple-500/20 text-purple-400";
  };

  if (loadingEvents) {
    return (
      <div className="text-center py-12">
        <div className="text-white text-lg">Loading events...</div>
      </div>
    );
  }

  if (error && events.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-red-400 text-lg mb-4">{error}</div>
        <button
          onClick={() => loadEvents()}
          className="text-purple-400 hover:text-purple-300 underline"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 lg:gap-[32px] w-[95%] sm:w-[85%] lg:w-[80%] max-w-[800px] mx-auto">
      {/* Feed Header */}
      <div className="flex justify-between items-center text-white/70 text-sm">
        <div>
          Showing {events.length} events •
          {feedType === "all" &&
            " Mix of user posts, scraped events & local events"}
          {feedType === "user" && " User-created posts only"}
          {feedType === "scraped" && " Scraped & local events only"}
          {feedType === "explore" && " Diverse content for exploration"}
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="text-purple-400 hover:text-purple-300 transition-colors disabled:opacity-50"
        >
          {refreshing ? "🔄" : "↻"} Refresh
        </button>
      </div>

      {events
        .filter((event) => {
          if (!searchValue) return true;
          const searchLower = searchValue.toLowerCase();
          return (
            event.title.toLowerCase().includes(searchLower) ||
            event.description.toLowerCase().includes(searchLower) ||
            event.interests?.some(interest => 
              interest.toLowerCase().includes(searchLower)
            )
          );
        })
        .map((post) => (
        <article
          key={post.id}
          className="bg-global-2 rounded-[35px] p-3
          sm:p-4 lg:p-[24px] w-full relative"
        >
          {/* Event Type Indicator */}
          <div
            className={`absolute top-2 right-4 text-xs px-2 py-1 rounded-full ${getEventTypeColor(post.eventType, post.source)}`}
          >
            {getEventTypeLabel(post.eventType, post.source)}
          </div>

          {/* Event Actions (Edit/Delete) for Event Owners */}
          <div className="absolute top-2 right-2">
            <EventActions
              eventId={post.eventId || post.id}
              hostId={post.hostId}
              userId={user?.id}
              onEventDeleted={() => {
                // Remove event from local state
                setEvents((prevEvents) =>
                  prevEvents.filter((e) => e.id !== post.id),
                );
              }}
            />
          </div>

          {/* Post Header */}
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 mb-3 lg:mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-global-4 rounded-full flex-shrink-0"></div>
            <div className="flex items-center gap-2 sm:gap-2 lg:gap-[12px] flex-wrap">
              <span className="text-global-1 text-base sm:text:lg lg:text-xl lg:leading-[26px] font-normal">
                {post.userName} •
              </span>
              <span className="text-global-2 text-base sm:text-lg lg:text-xl lg:leading-[26px] font-normal">
                {post.timeAgo}
              </span>
            </div>
          </div>

          {/* Post Title */}
          <Link to={`/post?id=${post.eventId || post.id}`}>
            <h2 className="text-global-1 text-base sm:text-lg lg:text-3xl lg:leading-[36px] font-normal mb-0 lg:mb-[0px] hover:text-purple-600 transition-colors cursor-pointer">
              {post.title}
            </h2>
          </Link>

          {/* Post Description */}
          <h4 className="text-global-1 text-sm sm:text-base lg:text-lg lg:leading-[36px] font-normal mb-0 lg:mb-[0px]">
            {post.description}
          </h4>

          {/* Location & Time Info (for events with location) */}
          {post.location && (
            <div className="text-global-2 text-xs sm:text-sm mt-2 flex items-center gap-2">
              <span>📍 {post.location}</span>
              {post.startTime && (
                <span>🕐 {new Date(post.startTime).toLocaleDateString()}</span>
              )}
            </div>
          )}

          {/* Interests Tags */}
          {post.interests && post.interests.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2 mb-2">
              {post.interests.slice(0, 3).map((interest, index) => (
                <span
                  key={index}
                  className="text-xs bg-global-3 text-global-1 px-2 py-1 rounded-full"
                >
                  {interest}
                </span>
              ))}
            </div>
          )}

          {/* Post Image */}
          <div className="w-full h-32 sm:h-36 lg:h-80 bg-global-5 rounded-[20px] sm:rounded-[25px] lg:rounded-[35px] mb-3 lg:mb-[20px]"></div>

          {/* Post Actions */}
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-[12px] flex-wrap">
            {/* Upvote Section */}
            <UpVotesSection
              upvotes={post.upvotes}
              downvotes={post.downvotes || 0}
              eventId={post.eventId || post.id}
              userId={user?.id}
              light={true}
              upvote_action={() => handleEventVote(post.eventId || post.id, "upvote")}
              downvote_action={() => handleEventVote(post.eventId || post.id, "downvote")}
            />

            {/* RSVP Button */}
            <RSVPButton
              eventId={post.eventId || post.id}
              userId={user?.id}
              initialRsvpCount={post.rsvpCount || 0}
              className="ml-1"
            />

            {/* Comment Button */}
            {post.hasComments && (
              <Link to={`/post?id=${post.eventId || post.id}`}>
                <ActionButton type="comment" onClick={() => {}} />
              </Link>
            )}

            {/* Share Button */}
            {post.canShare && (
              <ActionButton
                type="share"
                onClick={() => {}}
                eventId={post.eventId || post.id}
                userId={user?.id}
                shareMethod="link"
              >
                Share
              </ActionButton>
            )}
          </div>
        </article>
      ))}

      {/* Load More Button for Pagination */}
      {events.length >= limit && (
        <div className="text-center py-6">
          <button
            onClick={() => loadEvents()}
            className="text-purple-400 hover:text-purple-300 underline"
          >
            Load More Events
          </button>
        </div>
      )}

      {/* Create Events Button */}
      {showCreateButton && (
        <Link
          to="/create-post"
          className="fixed bottom-6 right-6 w-[50px] h-[50px] rounded-full 
          bg-global-2 hover:bg-global-3 transition-all duration-200 
          shadow-lg hover:shadow-xl transform hover:scale-105
          flex items-center justify-center z-50 no-underline"
        >
          <span className="text-5xl font-bold leading-none text-starship-animated">
            +
          </span>
        </Link>
      )}
    </div>
  );
};

export default EventsFeed;
