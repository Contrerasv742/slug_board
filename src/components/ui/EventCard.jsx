import React, { useState } from 'react';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import CommentSection from './CommentSection';

TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo('en-US');

// External Event Image Component
const ExternalEventImage = ({ event }) => {
  if (event.event_type !== 'external') return null;

  const getGradientByCategory = (category) => {
    switch (category) {
      case 'Music':
        return 'from-pink-600/20 to-purple-600/20 border-pink-400/30';
      case 'Technology':
        return 'from-blue-600/20 to-cyan-600/20 border-blue-400/30';
      case 'Sports':
      case 'Sports & Fitness':
        return 'from-green-600/20 to-teal-600/20 border-green-400/30';
      case 'Food':
      case 'Food & Drink':
        return 'from-orange-600/20 to-red-600/20 border-orange-400/30';
      case 'Art':
      case 'Arts & Culture':
        return 'from-purple-600/20 to-indigo-600/20 border-purple-400/30';
      case 'Health & Wellness':
        return 'from-emerald-600/20 to-green-600/20 border-emerald-400/30';
      case 'Education':
        return 'from-yellow-600/20 to-orange-600/20 border-yellow-400/30';
      default:
        return 'from-gray-600/20 to-gray-700/20 border-gray-400/30';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Music': return '🎵';
      case 'Technology': return '💻';
      case 'Sports':
      case 'Sports & Fitness': return '⚽';
      case 'Food':
      case 'Food & Drink': return '🍕';
      case 'Art':
      case 'Arts & Culture': return '🎨';
      case 'Health & Wellness': return '🧘';
      case 'Education': return '📚';
      default: return '🌐';
    }
  };

  return (
    <div className={`mb-4 h-32 lg:h-48 bg-gradient-to-br ${getGradientByCategory(event.category)} rounded-lg border flex items-center justify-center`}>
      <div className="text-center">
        <div className="text-4xl lg:text-6xl mb-2 lg:mb-3">{getCategoryIcon(event.category)}</div>
        <p className="text-white font-medium text-sm lg:text-lg">{event.source}</p>
        <p className="text-gray-300 text-xs lg:text-sm">External Event</p>
      </div>
    </div>
  );
};

// Source Badge Component
const SourceBadge = ({ event }) => {
  if (event.event_type !== 'external') return null;

  const getBadgeStyle = () => {
    switch (event.source) {
      case 'City Events':
      case 'City of Santa Cruz':
        return 'bg-blue-600 text-white border border-blue-400';
      case 'Downtown Association':
        return 'bg-purple-600 text-white border border-purple-400';
      case 'Meetup':
        return 'bg-red-600 text-white border border-red-400';
      case 'Community Markets':
        return 'bg-green-600 text-white border border-green-400';
      case 'Local Studios':
        return 'bg-pink-600 text-white border border-pink-400';
      case 'UCSC Admissions':
        return 'bg-yellow-600 text-black border border-yellow-400';
      case 'Venue Events':
        return 'bg-orange-600 text-white border border-orange-400';
      case 'Hiking Groups':
        return 'bg-teal-600 text-white border border-teal-400';
      default:
        return 'bg-gray-600 text-white border border-gray-400';
    }
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBadgeStyle()} flex items-center gap-1`}>
      <span>🌐</span>
      <span>{event.source}</span>
    </span>
  );
};

// External Link Button Component
const ExternalLinkButton = ({ event }) => {
  if (event.event_type !== 'external' || !event.external_url) return null;

  return (
    <a
      href={event.external_url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-full text-sm transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
    >
      <span>🔗</span>
      <span>View on {event.source}</span>
    </a>
  );
};

// Price Display Component
const PriceDisplay = ({ event }) => {
  if (!event.price_info && !event.is_free) return null;

  return (
    <div className="flex items-center gap-2 text-sm mb-2">
      <span className="font-semibold">💰 Price:</span>
      <span className={event.is_free ? 'text-green-400 font-medium' : 'text-global-1'}>
        {event.is_free ? 'FREE' : event.price_info}
      </span>
    </div>
  );
};

const EventCard = ({ 
  event, 
  variant = 'full', // 'compact' or 'full'
  onRSVP, 
  user,
  className = ""
}) => {
  const [visibleComments, setVisibleComments] = useState(false);

  const toggleComments = () => {
    setVisibleComments(!visibleComments);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(`${event.title} - ${event.description}`);
      alert('Event link copied to clipboard!');
    }
  };

  const ActionButton = ({ type, onClick, children, className = "" }) => {
    const baseClasses = "flex justify-center items-center text-global-1 text-sm sm:text-base lg:text-[18px] lg:leading-[20px] font-normal";

    if (type === 'comment') {
      return (
        <button 
          onClick={onClick}
          className={`${baseClasses} gap-1 lg:gap-[4px] px-2 py-2 sm:px-3 lg:px-4 lg:py-[3px] rounded-[15px] lg:rounded-[22px] bg-global-3 hover:bg-global-5 ${className}`}
        >
          <img 
            src="/images/img_speech_bubble.png" 
            alt="comment" 
            className="w-4 h-4 lg:w-5 lg:h-5"
          />
          {children}
        </button>
      );
    }

    if (type === 'share') {
      return (
        <button 
          onClick={onClick}
          className={`${baseClasses} gap-1 lg:gap-[4px] px-2 py-2 sm:px-3 lg:px-4 lg:py-[3px] rounded-[15px] lg:rounded-[22px] bg-global-3 hover:bg-global-5 ${className}`}
        >
          <img 
            src="/images/share_arrow.png" 
            alt="share" 
            className="w-4 h-4 lg:w-5 lg:h-5"
          />
          {children}
        </button>
      );
    }

    return null;
  };

  // Compact variant (for community events)
  if (variant === 'compact') {
    return (
      <article className={`bg-global-2 rounded-[25px] p-4 lg:p-5 
        shadow-lg hover:shadow-xl transition-all duration-300 
        border border-white/[0.08] hover:border-purple-400/30
        hover:bg-gradient-to-br hover:from-global-2 hover:to-purple-900/5 ${className}`}>
        
        {/* Compact Header */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-md overflow-hidden">
            {event.users?.avatar_url ? (
              <img
                src={event.users.avatar_url}
                className="w-full h-full object-cover rounded-full"
                alt="User Avatar"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                {event.users?.full_name?.charAt(0)?.toUpperCase() || 
                 event.users?.name?.charAt(0)?.toUpperCase() || 
                 event.users?.email?.charAt(0)?.toUpperCase() || 
                 event.organizer?.name?.charAt(0)?.toUpperCase() || 
                 'A'}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-global-1 font-medium truncate">
                {event.users?.full_name || 
                 event.users?.name || 
                 event.users?.email?.split('@')[0] || 
                 event.organizer?.name ||
                 'Anonymous'}
              </span>
              <SourceBadge event={event} />
              <span className="w-1 h-1 bg-purple-400 rounded-full flex-shrink-0"></span>
              <span className="text-global-2 truncate">
                {event.created_at ? timeAgo.format(new Date(event.created_at)) : 
                 event.start_time ? timeAgo.format(new Date(event.start_time)) : 'Just now'}
              </span>
            </div>
          </div>
        </div>

        {/* Compact Content */}
        <div className="mb-4">
          <h3 className="text-global-1 text-lg lg:text-xl font-semibold mb-2 leading-tight line-clamp-2">
            {event.title}
          </h3>
          <p className="text-global-1 text-sm lg:text-base leading-relaxed line-clamp-3 opacity-90">
            {event.description}
          </p>
          
          {/* Price info for external events */}
          {event.event_type === 'external' && (
            <PriceDisplay event={event} />
          )}
          
          {/* Event Image */}
          {event.event_type === 'external' ? (
            <ExternalEventImage event={event} />
          ) : event.image_url ? (
            <div className="mt-3">
              <img 
                src={event.image_url}
                alt={event.title}
                className="w-full h-32 object-cover rounded-lg shadow-md"
              />
            </div>
          ) : null}
        </div>

        {/* Interest Tags - Compact */}
        {event.related_interests && event.related_interests.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1.5">
              {event.related_interests.slice(0, 4).map((interest, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-full text-xs font-medium shadow-sm"
                >
                  {interest}
                </span>
              ))}
              {event.related_interests.length > 4 && (
                <span className="px-2 py-1 bg-purple-400/20 text-purple-300 rounded-full text-xs">
                  +{event.related_interests.length - 4}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Compact Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-global-3/20">
          {event.event_type === 'external' ? (
            <ExternalLinkButton event={event} />
          ) : (
            <button
              onClick={() => onRSVP && onRSVP(event.id)}
              className="flex items-center gap-1.5 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:shadow-md"
            >
              <span>👍</span>
              <span>RSVP</span>
            </button>
          )}
          <div className="flex items-center gap-2">
            <button 
              onClick={toggleComments}
              className="flex items-center gap-1 px-3 py-2 rounded-full bg-global-3/50 hover:bg-purple-600/20 text-global-1 text-sm transition-all duration-200"
            >
              <img src="/images/img_speech_bubble.png" alt="comments" className="w-4 h-4 opacity-70" />
              <span>0</span>
            </button>
            <button 
              onClick={handleShare}
              className="p-2 rounded-full bg-global-3/50 hover:bg-purple-600/20 transition-all duration-200"
            >
              <img src="/images/share_arrow.png" alt="share" className="w-4 h-4 opacity-70" />
            </button>
          </div>
        </div>
        
        {visibleComments && (
          <div className="mt-4 pt-4 border-t border-global-3/20">
            <CommentSection postId={event.id} user={user} />
          </div>
        )}
      </article>
    );
  }

  // Full variant (for campus events and external events)
  return (
    <article className={`bg-global-2 rounded-[25px] p-6 lg:p-[24px] 
      shadow-md hover:shadow-lg transition-all duration-300 
      border border-global-3/10 hover:border-orange-400/20 ${className}`}>
      
      {/* Event Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-[40px] lg:h-[40px] bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-md overflow-hidden">
          {event.users?.avatar_url ? (
            <img
              src={event.users.avatar_url}
              className="w-full h-full object-cover rounded-full"
              alt="User Avatar"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white text-sm font-bold">
              {event.users?.full_name?.charAt(0)?.toUpperCase() || 
               event.users?.name?.charAt(0)?.toUpperCase() || 
               event.users?.email?.charAt(0)?.toUpperCase() || 
               event.organizer?.name?.charAt(0)?.toUpperCase() || 
               'A'}
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-global-1 text-sm sm:text-base lg:text-[18px] font-medium">
              {event.users?.full_name || 
               event.users?.name || 
               event.users?.email?.split('@')[0] || 
               event.organizer?.name ||
               'Campus Admin'}
            </span>
            <SourceBadge event={event} />
            <span className="w-1.5 h-1.5 bg-orange-400 rounded-full"></span>
            <span className="text-global-2 text-sm lg:text-[16px] font-normal">
              {event.start_time ? timeAgo.format(new Date(event.start_time)) : 
               event.created_at ? timeAgo.format(new Date(event.created_at)) : 'No date set'}
            </span>
          </div>
        </div>
      </div>

      {/* Event Content */}
      <div className="mb-4">
        <h3 className="text-global-1 text-lg sm:text-xl lg:text-[24px] lg:leading-[26px] font-normal mb-2">
          {event.title}
        </h3>
        <p className="text-global-1 text-sm sm:text-base lg:text-[18px] lg:leading-[20px] mb-3">
          {event.description}
        </p>
        
        {/* Price info for external events */}
        {event.event_type === 'external' && (
          <PriceDisplay event={event} />
        )}
        
        {/* Event Image */}
        {event.event_type === 'external' ? (
          <ExternalEventImage event={event} />
        ) : event.image_url ? (
          <div className="mb-4">
            <img 
              src={event.image_url}
              alt={event.title}
              className="w-full h-48 object-cover rounded-lg shadow-md"
            />
          </div>
        ) : null}
        
        {/* Event Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {event.start_time && (
            <div className="flex items-center gap-2">
              <span className="text-global-1 font-semibold">📅 Start:</span>
              <span className="text-global-1">
                {new Date(event.start_time).toLocaleDateString()} {new Date(event.start_time).toLocaleTimeString()}
              </span>
            </div>
          )}
          {event.end_time && (
            <div className="flex items-center gap-2">
              <span className="text-global-1 font-semibold">⏰ End:</span>
              <span className="text-global-1">
                {new Date(event.end_time).toLocaleDateString()} {new Date(event.end_time).toLocaleTimeString()}
              </span>
            </div>
          )}
          {event.location && (
            <div className="flex items-center gap-2">
              <span className="text-global-1 font-semibold">📍 Location:</span>
              <span className="text-global-1">{event.location}</span>
            </div>
          )}
          {event.college_tag && (
            <div className="flex items-center gap-2">
              <span className="text-global-1 font-semibold">🏷️ Tag:</span>
              <span className="text-global-1">{event.college_tag}</span>
            </div>
          )}
        </div>

        {/* Interest Tags - Full */}
        {event.related_interests && event.related_interests.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {event.related_interests.map((interest, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-full text-sm font-medium shadow-sm"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Event Actions */}
      <div className="flex items-center gap-4 pt-4 border-t border-global-3/20">
        {event.event_type === 'external' ? (
          <ExternalLinkButton event={event} />
        ) : (
          <button
            onClick={() => onRSVP && onRSVP(event.id)}
            className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white px-5 py-2.5 rounded-full hover:shadow-md transition-all duration-200 font-medium"
          >
            <span>📅</span>
            <span>RSVP</span>
          </button>
        )}
        
        {/* Comment Button */}
        <ActionButton 
          type="comment" 
          onClick={toggleComments}
        >
          0
        </ActionButton>
        
        {/* Share Button */}
        <ActionButton 
          type="share" 
          onClick={handleShare}
        >
          Share
        </ActionButton>
      </div>
      
      {visibleComments && (
        <div className="mt-4 pt-4 border-t border-global-3/20">
          <CommentSection postId={event.id} user={user} />
        </div>
      )}
    </article>
  );
};

export default EventCard;