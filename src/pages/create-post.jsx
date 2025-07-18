import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header.jsx';
import Sidebar from '../components/common/Sidebar.jsx';
import '../styles/home.css';
import { supabase } from '../supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { EventService } from '../services/eventService';

const CreatePostPage = () => {
  const [postTitle, setPostTitle] = useState('');
  const [postDescription, setPostDescription] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [collegeTag, setCollegeTag] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user: authUser } = useAuth();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    document.getElementById('image-upload-input').click();
  };

  const handlePostSubmit = async () => {
    // Debug: Log current form values
    console.log('Form validation check:', {
      title: `"${postTitle}"`,
      titleTrimmed: `"${postTitle.trim()}"`,
      description: `"${postDescription}"`, 
      descriptionTrimmed: `"${postDescription.trim()}"`,
      startTime: `"${startTime}"`
    });

    if (!postTitle.trim()) {
      setError("Please enter an event title.");
      return;
    }

    if (!postDescription.trim()) {
      setError("Please enter an event description.");
      return;
    }

    if (!startTime) {
      setError("Please select a start time for the event.");
      return;
    }

    if (!user?.id) {
      setError("User not authenticated. Please sign in and try again.");
      return;
    }

    // Validate datetime format before starting
    let startTimeISO, endTimeISO;
    try {
      startTimeISO = new Date(startTime).toISOString();
      if (isNaN(Date.parse(startTime))) {
        throw new Error('Invalid start time');
      }
      
      if (endTime) {
        endTimeISO = new Date(endTime).toISOString();
        if (isNaN(Date.parse(endTime))) {
          throw new Error('Invalid end time');
        }
      } else {
        endTimeISO = null;
      }
    } catch (dateError) {
      setError("Invalid date format. Please check your start and end times.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // First, ensure the user exists in the users table
      const { data: existingUser, error: userCheckError } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .single();

      if (userCheckError && userCheckError.code === 'PGRST116') {
        // User doesn't exist in users table, create them
        console.log('Creating user record in users table...');
        const { error: userCreateError } = await supabase
          .from('users')
          .insert({
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || user.email?.split('@')[0],
            provider: user.app_metadata?.provider || 'email'
          });

        if (userCreateError) {
          console.error('Failed to create user record:', userCreateError);
          setError("Failed to set up user account. Please try again.");
          setLoading(false);
          return;
        }
      }

      const eventData = {
        title: postTitle,
        description: postDescription,
        start_time: startTimeISO,
        end_time: endTimeISO,
        location: location || null,
        college_tag: collegeTag || null,
        host_id: user.id
      };

      console.log('Creating event with data:', eventData);
      console.log('Data types:', {
        title: typeof eventData.title,
        description: typeof eventData.description,
        start_time: typeof eventData.start_time,
        host_id: typeof eventData.host_id
      });

      const { data, error } = await EventService.createEvent(eventData);

      if (error) throw error;

      navigate('/home');
    } catch (error) {
      console.error('Event creation error:', error);
      
      // Provide specific error messages for common issues
      if (error.message?.includes('row-level security policy')) {
        setError("Permission denied. Please make sure you're signed in and the database policies are configured correctly.");
      } else if (error.message?.includes('violates not-null constraint')) {
        // Extract which column is null from the error message
        const columnMatch = error.message.match(/column "([^"]+)"/);
        const columnName = columnMatch ? columnMatch[1] : 'unknown field';
        setError(`Missing required field: ${columnName}. Please fill in all required information.`);
      } else if (error.message?.includes('foreign key constraint')) {
        setError("User account not found in database. Please sign out and sign back in.");
      } else if (error.message?.includes('duplicate key')) {
        setError("An event with this information already exists.");
      } else if (error.message?.includes('invalid input syntax')) {
        setError("Invalid data format. Please check your date/time entries.");
      } else if (error.message?.includes('violates')) {
        setError("Database constraint violation. Please check your input and try again.");
      } else {
        setError(error.message || "Failed to create event. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const VoteButton = ({ type, onClick, className = "" }) => (
    <button
      onClick={onClick}
      className={`flex justify-center items-center w-6 h-6 sm:w-8 sm:h-8
                  lg:w-[40px] lg:h-[40px] rounded-[10px] lg:rounded-[20px] border-none
                  cursor-pointer bg-global-3 hover:bg-global-5 transition-colors ${className}`}
    >
      <img
        src="/images/img_arrow.png"
        alt={type === 'up' ? 'upvote' : 'downvote'}
        className={`w-4 h-4 lg:w-5 lg:h-5 ${type === 'down' ? 'rotate-180' : ''}`}
      />
    </button>
  );

  const ActionButton = ({ type, onClick, children, className = "", disabled = false }) => {
    const baseClasses = "flex justify-center items-center text-global-1 text-sm sm:text-base lg:text-[18px] lg:leading-[20px] font-normal";

    if (type === 'comment') {
      return (
        <button
          onClick={onClick}
          disabled={disabled}
          className={`${baseClasses} bg-global-3 hover:bg-global-5 w-10 h-8
                      sm:w-12 sm:h-10 lg:w-[50px] lg:h-[40px] rounded-[15px] lg:rounded-[20px] p-1
                      lg:p-[3px] ${className}`}
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
          disabled={disabled}
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

    if (type === 'post-event') {
      return (
        <button
          onClick={onClick}
          disabled={disabled}
          className={`${baseClasses} gap-1 lg:gap-[4px] px-2 py-2 sm:px-3
                      lg:px-4 lg:py-[3px] rounded-[15px] lg:rounded-[22px]
                    ${className || 'bg-global-3 hover:bg-global-5'}`
          }
          >
          <img
            src="/images/img_speech_bubble.png"
            alt="post event"
            className="w-4 h-4 lg:w-5 lg:h-5"
          />
          {children}
        </button>
      );
    }

    return null;
  };

  return (
    <div className="flex flex-col min-h-screen bg-global-1 font-ropa">
      {/* Header */}
      <Header 
        showSearch={true}
        searchPlaceholder="Search Posts"
        userName={user?.email || "John Doe"}
        userHandle={`@${user?.email?.split('@')[0] || 'johndoe'}`}
        userAvatar="/images/default-avatar.png"
      />

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <Sidebar/>

        {/* Main Page */}
        <main className="flex-1 p-6 sm:p-6 lg:p-[24px_48px] flex
          justify-center">
          <div className="flex flex-col gap-[20px] lg:gap-[20px] w-[95%]
            sm:w-[85%] lg:w-[80%] max-w-[800px] mx-auto">

            {/* Page Information */}
            <div className="mb-0 lg:mb-0 text-center">
              <div className="inline-block px-4 py-2 rounded-[40px] mb-3
                lg:mb-2 bg-gradient-to-br from-white/[0.15] to-white/[0.05]
                border border-white/[0.18]
                shadow-[0_8px_32px_rgba(255,255,255,0.1),inset_0_1px_0_rgba(255,255,255,0.2)]
                hover:from-white/[0.18] hover:to-white/[0.08]
                hover:border-white/[0.25]
                hover:shadow-[0_12px_40px_rgba(255,255,255,0.15),inset_0_1px_0_rgba(255,255,255,0.3)]
                transition-all duration-300 ease-out relative overflow-hidden
                before:absolute before:inset-0 before:rounded-[40px]
                before:bg-gradient-to-br before:from-white/[0.08]
                before:to-transparent before:opacity-0 before:hover:opacity-100
                before:transition-opacity before:duration-300">
                <h1 className="text-[rgba(147,122,250,0.9)] text-2xl
                  sm:text-3xl lg:text-[38px] lg:leading-tight font-light
                  drop-shadow-lg relative z-10">
                  Create an event below
                </h1>
              </div>
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2
                  rounded-full bg-gradient-to-br from-white/[0.12]
                  to-white/[0.04] border border-white/[0.15]
                  shadow-[0_6px_24px_rgba(255,255,255,0.08),inset_0_1px_0_rgba(255,255,255,0.15)]
                  hover:from-white/[0.15] hover:to-white/[0.06]
                  hover:border-white/[0.20]
                  hover:shadow-[0_8px_32px_rgba(255,255,255,0.12),inset_0_1px_0_rgba(255,255,255,0.25)]
                  transition-all duration-300 ease-out relative overflow-hidden
                  before:absolute before:inset-0 before:rounded-full
                  before:bg-gradient-to-br before:from-white/[0.06]
                  before:to-transparent before:opacity-0
                  before:hover:opacity-100 before:transition-opacity
                  before:duration-300">
                  <span className="w-2 h-2 bg-purple-400/80 rounded-full
                    animate-pulse shadow-[0_0_8px_rgba(147,122,250,0.6)]
                    relative z-10"></span>
                  <p className="text-white/70 text-sm lg:text-base
                    drop-shadow-md relative z-10">
                    Fill in all required information
                  </p>
                </div>
              </div>
            </div>

            {/* Create Post */}
            <article className="bg-global-2 rounded-[35px] p-3
              sm:p-4 lg:p-[24px] w-full">
              {/* Post Header */}
              <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 mb-3
                lg:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-[56px]
                  lg:h-[56px] bg-global-4 rounded-full flex-shrink-0"></div>
                <div className="flex items-center gap-2 sm:gap-2
                  lg:gap-[12px] flex-wrap">
                  <span className="text-global-1 text-sm sm:text-base
                    lg:text-[24px] lg:leading-[26px] font-normal">
                    {user?.email || 'User Name'} •
                  </span>
                  <span className="text-global-2 text-sm sm:text-base
                    lg:text-[24px] lg:leading-[26px] font-normal">
                    1 sec ago
                  </span>
                </div>
              </div>

              {/* Event Title Input */}
              <div className="mb-2 lg:mb-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-global-1 text-base sm:text-lg
                    lg:text-[32px] lg:leading-[36px] font-normal">
                    Event Title
                  </span>
                  <span className="w-2 h-2 bg-purple-400/80 rounded-full
                    animate-pulse shadow-[0_0_8px_rgba(147,122,250,0.6)]
                    relative z-10"></span>
                </div>
                <input
                  type="text"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  placeholder="Enter your event title here..."
                  className="w-full bg-global-2 text-global-1 text-base
                  sm:text-lg lg:text-[32px] lg:leading-[36px] font-normal
                  border-none outline-none placeholder-gray-400
                  focus:placeholder-gray-500 shadow-transparent"
                />
              </div>

              {/* Post Description Input */}
              <div className="mb-3 lg:mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-global-1 text-sm sm:text-base
                    lg:text-lg lg:leading-[36px] font-normal">
                    Event Description
                  </span>
                  <span className="w-2 h-2 bg-purple-400/80 rounded-full
                    animate-pulse shadow-[0_0_8px_rgba(147,122,250,0.6)]
                    relative z-10"></span>
                </div>
                <textarea
                  value={postDescription}
                  onChange={(e) => setPostDescription(e.target.value)}
                  placeholder="Describe your event..."
                  rows="3"
                  className="w-full bg-transparent text-global-1 text-sm
                  sm:text-base lg:text-lg lg:leading-[36px] font-normal
                  border-none outline-none placeholder-gray-400
                  focus:placeholder-gray-500 resize-none"
                />
              </div>

              {/* Start Time Input */}
              <div className="mb-3 lg:mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-global-1 text-sm sm:text-base
                    lg:text-lg lg:leading-[36px] font-normal">
                    Start Time
                  </span>
                  <span className="w-2 h-2 bg-purple-400/80 rounded-full
                    animate-pulse shadow-[0_0_8px_rgba(147,122,250,0.6)]
                    relative z-10"></span>
                </div>
                <input
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full bg-global-2 text-global-1 text-sm
                  sm:text-base lg:text-lg lg:leading-[36px] font-normal
                  border border-global-3 rounded-lg px-3 py-2 outline-none
                  focus:border-purple-400"
                />
              </div>

              {/* End Time Input */}
              <div className="mb-3 lg:mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-global-1 text-sm sm:text-base
                    lg:text-lg lg:leading-[36px] font-normal">
                    End Time (Optional)
                  </span>
                </div>
                <input
                  type="datetime-local"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full bg-global-2 text-global-1 text-sm
                  sm:text-base lg:text-lg lg:leading-[36px] font-normal
                  border border-global-3 rounded-lg px-3 py-2 outline-none
                  focus:border-purple-400"
                />
              </div>

              {/* Location Input */}
              <div className="mb-3 lg:mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-global-1 text-sm sm:text-base
                    lg:text-lg lg:leading-[36px] font-normal">
                    Location (Optional)
                  </span>
                </div>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Where is this event taking place?"
                  className="w-full bg-transparent text-global-1 text-sm
                  sm:text-base lg:text-lg lg:leading-[36px] font-normal
                  border-none outline-none placeholder-gray-400
                  focus:placeholder-gray-500"
                />
              </div>

              {/* College Tag Input */}
              <div className="mb-3 lg:mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-global-1 text-sm sm:text-base
                    lg:text-lg lg:leading-[36px] font-normal">
                    Event Category (Optional)
                  </span>
                </div>
                <select
                  value={collegeTag}
                  onChange={(e) => setCollegeTag(e.target.value)}
                  className="w-full bg-global-2 text-global-1 text-sm
                  sm:text-base lg:text-lg lg:leading-[36px] font-normal
                  border border-global-3 rounded-lg px-3 py-2 outline-none
                  focus:border-purple-400"
                >
                  <option value="">Select a category...</option>
                  <option value="Academic">Academic</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Networking">Networking</option>
                  <option value="Music">Music</option>
                  <option value="Sports">Sports</option>
                  <option value="Environmental">Environmental</option>
                  <option value="Social">Social</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Image Upload Section */}
              <div className="mb-3 lg:mb-[20px]">
                <input
                  type="file"
                  id="image-upload-input"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <button
                  onClick={handleImageClick}
                  className="w-full h-32 sm:h-40 lg:h-[320px] bg-global-5
                    rounded-[20px] sm:rounded-[25px] lg:rounded-[35px] border-4 
                    border-dashed border-[#8a2be292] hover:border-[#9a3bf2] 
                    hover:bg-opacity-80 transition-all duration-300 ease-in-out
                    cursor-pointer group relative overflow-hidden"
                >
                  {imagePreview ? (
                    <div className="w-full h-full relative">
                      <img 
                        src={imagePreview}
                        alt="Selected"
                        className="w-full h-full object-cover rounded-[16px]
                        sm:rounded-[21px] lg:rounded-[31px] group-hover:opacity-80
                        transition-opacity duration-300"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 
                        group-hover:bg-opacity-20 transition-all duration-300
                        rounded-[16px] sm:rounded-[21px] lg:rounded-[31px]
                        flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 
                          transition-opacity duration-300 text-white text-sm
                          sm:text-base lg:text-lg font-medium bg-black bg-opacity-50
                          px-4 py-2 rounded-full">
                          Click to change image
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center 
                      justify-center text-gray-400 group-hover:text-gray-300
                      transition-colors duration-300">
                      <div className="text-4xl sm:text-5xl lg:text-6xl mb-2
                        group-hover:scale-110 transition-transform duration-300">
                        📷
                      </div>
                      <div className="text-sm sm:text-base lg:text-lg font-medium
                        group-hover:scale-105 transition-transform duration-300">
                        Click to add an image
                      </div>
                      <div className="text-xs sm:text-sm lg:text-base mt-1
                        opacity-70 group-hover:opacity-90 transition-opacity duration-300">
                        Supports JPG, PNG, GIF
                      </div>
                    </div>
                  )}
                </button>
              </div>

              {/* Error Message */}
              {error && <p className="text-red-500 text-center text-sm mb-2">{error}</p>}

              {/* Post Actions */}
              <div className="flex items-center gap-2 sm:gap-3 lg:gap-[12px]
                flex-wrap">
                {/* Upvote Section */}
                <div className="flex items-center gap-1 lg:gap-0 p-1 lg:p-0
                  bg-global-3 rounded-[15px] lg:rounded-[22px]">
                  <VoteButton type="up" onClick={() => console.log('upvote')} />
                  <span className="text-global-1 text-xs sm:text-sm
                    lg:text-[24px] lg:leading-[26px] font-normal px-2">
                    0 
                  </span>
                  <VoteButton type="down" onClick={() => console.log('downvote')} />
                </div>

                {/* Comment Button */}
                <ActionButton 
                  type="comment" 
                  onClick={() => console.log('comment')}
                />

                {/* Post Event Button */}
                <ActionButton 
                  type="post-event" 
                  onClick={handlePostSubmit}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  disabled={loading}
                >
                  {loading ? 'Posting...' : 'Post Event'}
                </ActionButton>
              </div>
            </article>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreatePostPage;
