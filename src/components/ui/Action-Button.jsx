import { useState } from "react";
import { supabase } from "../../lib/supabase.js";

const ActionButton = ({
  type,
  onClick,
  children,
  className = "",
  eventId,
  userId,
  shareMethod = "link", // Default share method
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [loading, setLoading] = useState(false);

  const baseClasses = `flex justify-center items-center border-none cursor-pointer 
    bg-global-3 hover:bg-global-5 transition-all duration-200 ease-out
    shadow-md hover:shadow-lg active:shadow-sm
    transform hover:scale-105 active:scale-95 ${loading ? "opacity-50 cursor-not-allowed" : ""}`;

  const handleClick = async (e) => {
    if (loading) return;

    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 150);

    // Handle share action with database
    if (type === "share" && eventId && userId) {
      await handleShare();
    }

    onClick(e);
  };

  const handleShare = async () => {
    setLoading(true);
    try {
      // Record the share action in the database
      const { error } = await supabase.from("EventShares").insert([
        {
          event_id: eventId,
          user_id: userId,
          share_method: shareMethod,
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      // Optional: Show share modal or copy link to clipboard
      if (shareMethod === "link") {
        const eventUrl = `${window.location.origin}/post?id=${eventId}`;
        try {
          await navigator.clipboard.writeText(eventUrl);
          // You could show a toast notification here
          console.log("Link copied to clipboard");
        } catch (clipboardError) {
          console.error("Failed to copy to clipboard:", clipboardError);
          // Fallback: select the text
          const textArea = document.createElement("textarea");
          textArea.value = eventUrl;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand("copy");
          document.body.removeChild(textArea);
        }
      }

      console.log("Share recorded successfully");
    } catch (error) {
      console.error("Error recording share:", error);
    } finally {
      setLoading(false);
    }
  };

  if (type === "comment") {
    return (
      <button
        onClick={handleClick}
        disabled={loading}
        className={`${baseClasses} w-10 h-8 sm:w-12 sm:h-10 lg:w-[50px]
                    lg:h-[40px] rounded-[15px] lg:rounded-[20px] p-1 lg:p-[3px]
                    hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)]
                    active:shadow-[0_2px_4px_rgba(0,0,0,0.1)]
                    ${isPressed ? "animate-pulse" : ""}
                    ${className}`}
      >
        <img
          src="/images/img_speech_bubble.png"
          alt="comments"
          className={`w-5 h-4 sm:w-6 sm:h-5 lg:w-[30px] lg:h-[30px] 
                     transition-transform duration-200 
                     ${isPressed ? "scale-110" : ""}`}
        />
      </button>
    );
  }

  if (type === "share") {
    return (
      <button
        onClick={handleClick}
        disabled={loading}
        className={`${baseClasses} gap-1 lg:gap-[4px] px-2 py-2 sm:px-3 lg:px-4
                    lg:py-[3px] rounded-[15px] lg:rounded-[22px] 
                    hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)]
                    active:shadow-[0_2px_4px_rgba(0,0,0,0.1)]
                    ${isPressed ? "animate-pulse" : ""}
                    ${className}`}
      >
        <img
          src="/images/share_arrow.png"
          alt="share"
          className={`w-3 h-3 sm:w-4 sm:h-4 lg:w-[32px] lg:h-[32px]
                     transition-transform duration-200
                     ${isPressed ? "scale-110 rotate-12" : ""}`}
        />
        <span
          className={`text-global-1 text-xs sm:text-sm lg:text-[24px]
          lg:leading-[26px] font-normal transition-all duration-200
          ${isPressed ? "scale-105" : ""}`}
        >
          {loading ? "Sharing..." : children || "Share"}
        </span>
      </button>
    );
  }

  // Default fallback for other button types
  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`${baseClasses} ${className}`}
    >
      {children}
    </button>
  );
};

export default ActionButton;
