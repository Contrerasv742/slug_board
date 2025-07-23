import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase.js";

const EventActions = ({
  eventId,
  hostId,
  userId,
  onEventUpdated,
  onEventDeleted,
}) => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  // Only show actions if user owns the event
  if (!userId || userId !== hostId) {
    return null;
  }

  const handleEdit = () => {
    navigate(`/edit-post?id=${eventId}`);
    setShowDropdown(false);
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this event? This action cannot be undone.",
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      // Delete related data first (foreign key constraints)
      const deleteOperations = [
        supabase.from("EventUpvotes").delete().eq("event_id", eventId),
        supabase.from("EventComments").delete().eq("event_id", eventId),
        supabase.from("RSVPs").delete().eq("event_id", eventId),
        supabase.from("EventShares").delete().eq("event_id", eventId),
      ];

      await Promise.all(deleteOperations);

      // Delete the event itself
      const { error } = await supabase
        .from("Events")
        .delete()
        .eq("event_id", eventId);

      if (error) throw error;

      // Notify parent components
      if (onEventDeleted) {
        onEventDeleted(eventId);
      }

      // Navigate back to home
      navigate("/home");
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Failed to delete event. Please try again.");
    } finally {
      setLoading(false);
      setShowDropdown(false);
    }
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        disabled={loading}
        className="p-2 hover:bg-global-3 rounded-full transition-colors disabled:opacity-50"
      >
        <svg
          className="w-5 h-5 text-global-1"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      </button>

      {showDropdown && (
        <>
          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-[15px] shadow-xl border z-50">
            <button
              onClick={handleEdit}
              disabled={loading}
              className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 
                hover:bg-gray-100 transition-colors duration-150 first:rounded-t-[15px]"
            >
              Edit Event
            </button>
            <hr className="my-1 border-gray-200" />
            <button
              onClick={handleDelete}
              disabled={loading}
              className="w-full text-left px-4 py-3 text-sm font-medium text-red-600 
                hover:bg-red-50 transition-colors duration-150 rounded-b-[15px]"
            >
              {loading ? "Deleting..." : "Delete Event"}
            </button>
          </div>

          {/* Backdrop to close dropdown */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowDropdown(false)}
          />
        </>
      )}
    </div>
  );
};

export default EventActions;
