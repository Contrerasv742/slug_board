import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase.js";
import { incrementField, decrementField } from "../../utils/databaseHelpers.js";

const RSVPButton = ({
  eventId,
  userId,
  initialRsvpCount = 0,
  className = "",
}) => {
  const [rsvpStatus, setRsvpStatus] = useState(null); // null, 'going', 'interested', 'not_going'
  const [rsvpCount, setRsvpCount] = useState(initialRsvpCount);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (eventId && userId) {
      loadExistingRSVP();
    }
  }, [eventId, userId]);

  const loadExistingRSVP = async () => {
    try {
      const { data, error } = await supabase
        .from("RSVPs")
        .select("status")
        .eq("event_id", eventId)
        .eq("user_id", userId)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error loading existing RSVP:", error);
        return;
      }

      if (data) {
        setRsvpStatus(data.status);
      }
    } catch (error) {
      console.error("Error loading RSVP:", error);
    }
  };

  const handleRSVP = async (newStatus) => {
    if (!eventId || !userId) {
      console.error("Event ID or User ID missing");
      return;
    }

    setLoading(true);
    try {
      // Check if user already has an RSVP
      const { data: existingRSVP, error: fetchError } = await supabase
        .from("RSVPs")
        .select("*")
        .eq("event_id", eventId)
        .eq("user_id", userId)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        throw fetchError;
      }

      if (existingRSVP) {
        if (existingRSVP.status === newStatus) {
          // Remove RSVP if clicking the same status
          const { error: deleteError } = await supabase
            .from("RSVPs")
            .delete()
            .eq("id", existingRSVP.id);

          if (deleteError) throw deleteError;

          // Decrement RSVP count only if it was 'going'
          if (existingRSVP.status === "going") {
            await decrementField("Events", eventId, "rsvp_count");
            setRsvpCount((prev) => prev - 1);
          }

          setRsvpStatus(null);
        } else {
          // Update existing RSVP
          const { error: updateError } = await supabase
            .from("RSVPs")
            .update({
              status: newStatus,
              created_at: new Date().toISOString(), // Update timestamp
            })
            .eq("id", existingRSVP.id);

          if (updateError) throw updateError;

          // Update event count based on status changes
          if (existingRSVP.status === "going" && newStatus !== "going") {
            // Was going, now not going - decrement
            await decrementField("Events", eventId, "rsvp_count");
            setRsvpCount((prev) => prev - 1);
          } else if (existingRSVP.status !== "going" && newStatus === "going") {
            // Wasn't going, now going - increment
            await incrementField("Events", eventId, "rsvp_count");
            setRsvpCount((prev) => prev + 1);
          }

          setRsvpStatus(newStatus);
        }
      } else {
        // Create new RSVP
        const { error: insertError } = await supabase.from("RSVPs").insert([
          {
            event_id: eventId,
            user_id: userId,
            status: newStatus,
            created_at: new Date().toISOString(),
          },
        ]);

        if (insertError) throw insertError;

        // Increment RSVP count only if status is 'going'
        if (newStatus === "going") {
          await incrementField("Events", eventId, "rsvp_count");
          setRsvpCount((prev) => prev + 1);
        }

        setRsvpStatus(newStatus);
      }

      setShowDropdown(false);
    } catch (error) {
      console.error("Error handling RSVP:", error);
    } finally {
      setLoading(false);
    }
  };

  const getButtonText = () => {
    switch (rsvpStatus) {
      case "going":
        return "✓ Going";
      case "interested":
        return "★ Interested";
      case "not_going":
        return "✗ Can't Go";
      default:
        return "RSVP";
    }
  };

  const getButtonClasses = () => {
    const baseClasses = `relative inline-flex items-center justify-center gap-2 px-4 py-2 
      rounded-[15px] lg:rounded-[20px] text-sm lg:text-[16px] font-medium 
      transition-all duration-200 ease-out cursor-pointer border-none
      shadow-md hover:shadow-lg active:shadow-sm
      transform hover:scale-105 active:scale-95 ${loading ? "opacity-50 cursor-not-allowed" : ""}`;

    switch (rsvpStatus) {
      case "going":
        return `${baseClasses} bg-green-500 hover:bg-green-600 text-white`;
      case "interested":
        return `${baseClasses} bg-yellow-500 hover:bg-yellow-600 text-white`;
      case "not_going":
        return `${baseClasses} bg-red-500 hover:bg-red-600 text-white`;
      default:
        return `${baseClasses} bg-purple-500 hover:bg-purple-600 text-white`;
    }
  };

  const rsvpOptions = [
    {
      status: "going",
      label: "✓ Going",
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      status: "interested",
      label: "★ Interested",
      color: "bg-yellow-500 hover:bg-yellow-600",
    },
    {
      status: "not_going",
      label: "✗ Can't Go",
      color: "bg-red-500 hover:bg-red-600",
    },
  ];

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        disabled={loading}
        className={getButtonClasses()}
      >
        {getButtonText()}
        {rsvpCount > 0 && (
          <span className="ml-2 px-2 py-1 bg-white/20 rounded-full text-xs">
            {rsvpCount}
          </span>
        )}
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${showDropdown ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {showDropdown && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-[15px] shadow-xl border z-50">
          <div className="py-2">
            {rsvpOptions.map((option) => (
              <button
                key={option.status}
                onClick={() => handleRSVP(option.status)}
                disabled={loading}
                className={`w-full text-left px-4 py-3 text-sm font-medium text-gray-700 
                  hover:bg-gray-100 transition-colors duration-150 first:rounded-t-[15px] 
                  last:rounded-b-[15px] ${rsvpStatus === option.status ? "bg-gray-100" : ""}`}
              >
                <span className="flex items-center gap-2">
                  {option.label}
                  {rsvpStatus === option.status && (
                    <span className="ml-auto text-purple-500">✓</span>
                  )}
                </span>
              </button>
            ))}

            {rsvpStatus && (
              <>
                <hr className="my-2 border-gray-200" />
                <button
                  onClick={() => handleRSVP(rsvpStatus)} // This will remove the RSVP
                  disabled={loading}
                  className="w-full text-left px-4 py-3 text-sm font-medium text-red-600 
                    hover:bg-red-50 transition-colors duration-150 rounded-b-[15px]"
                >
                  Remove RSVP
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Backdrop to close dropdown */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
};

export default RSVPButton;
