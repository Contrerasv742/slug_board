import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header.jsx';
import Sidebar from '../components/common/Sidebar.jsx';
import UpVoteSection from '../components/ui/Vote-Buttons.jsx';
import ActionButton from '../components/ui/Action-Button.jsx';

import '../styles/home.css'
import '../styles/create-post.css'

const CreatePostPage = () => {
  const [postTitle, setPostTitle] = useState('');
  const [postDescription, setPostDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [interestSearch, setInterestSearch] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [showMoreInterests, setShowMoreInterests] = useState(false);

  const predefinedInterests = [
    'Photography', 'Coding', 'Music', 'Sports', 'Art', 'Reading',
    'Gaming', 'Travel', 'Food', 'Fitness', 'Movies', 'Nature',
    'Dancing', 'Writing', 'Cooking', 'Science', 'Technology', 'Fashion',
    'Theater', 'Volunteering', 'Hiking', 'Meditation', 'Languages', 'History',
    'Economics', 'Business', 'Politics', 'Philosophy', 'Psychology', 'Health'
  ];

  // Get interests to display based on current state
  const getDisplayedInterests = () => {
    const availableInterests = predefinedInterests.filter(interest => 
      !selectedInterests.includes(interest)
    );

    // If searching, show filtered results
    if (interestSearch.trim()) {
      return availableInterests.filter(interest =>
        interest.toLowerCase().includes(interestSearch.toLowerCase())
      );
    }

    // If not searching, show based on expansion state
    if (showMoreInterests) {
      return availableInterests.slice(0, 15);
    } else {
      return availableInterests.slice(0, 5);
    }
  };

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

  const addInterest = (interest) => {
    if (interest && !selectedInterests.includes(interest)) {
      setSelectedInterests(prev => [...prev, interest]);
      
      // Clear validation error when adding
      if (validationErrors.interests) {
        setValidationErrors(prev => ({
          ...prev,
          interests: undefined
        }));
      }
    }
  };

  const removeInterest = (interest) => {
    setSelectedInterests(prev => prev.filter(i => i !== interest));
  };

  const handleInputChange = (field, value) => {
    // Clear validation errors when user types
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const validPost = () => {
    const errors = {};
    
    if (!postTitle.trim()) errors.postTitle = 'Post title is required';
    if (!postDescription.trim()) errors.postDescription = 'Post description is required';
    if (selectedInterests.length < 3) {
      errors.interests = 'Please select at least 3 interests';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePostSubmit = () => {
    if (!validPost()) {
      return;
    }

    const postData = {
      title: postTitle,
      description: postDescription,
      image: selectedImage,
      interests: selectedInterests
    };

    console.log('Post data:', postData);
    alert('Post created successfully!');
    useNavigate('/');
  };

  return (
    <div className="flex flex-col min-h-screen bg-global-1 font-ropa">

      {/* Header */}
      <Header 
        showSearch={true}
        searchPlaceholder="Search Posts"
        userName="John Doe"
        userHandle="@johndoe"
        userAvatar="/images/default-avatar.png"
      />

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar/>

        {/* Main Page */}
        <main className="flex-1 p-6 sm:p-6 lg:p-[24px_48px] flex
          justify-center">
          <div className="flex flex-col gap-[20px] lg:gap-[20px] w-[95%]
            sm:w-[85%] lg:w-[80%] max-w-[800px] mx-auto">

            {/* Page Information */}
            <div className="mb-0 lg:mb-0 text-center">
              <div className="create-post-title">
                <h1 className="text-white text-2xl sm:text-3xl lg:text-[38px]
                  lg:leading-tight font-light drop-shadow-lg relative z-10">
                  Create a post below
                </h1>
              </div>
              <div>
                <div className="create-post-subtitle">
                  <span className="w-2 h-2 bg-purple-400 rounded-full
                    animate-pulse shadow-[0_0_12px_rgba(147,122,250,0.8)]
                    relative z-10"></span>
                  <p className="text-white/90 text-sm lg:text-base font-medium
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
                    User Name •
                  </span>
                  <span className="text-global-2 text-sm sm:text-base
                    lg:text-[24px] lg:leading-[26px] font-normal">
                    1 sec ago
                  </span>
                </div>
              </div>

              {/* Post Title Input */}
              <div className="mb-2 lg:mb-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-global-1 text-base sm:text-lg
                    lg:text-[32px] lg:leading-[36px] font-normal">
                    Post Title
                  </span>
                  <span className="w-2 h-2 bg-purple-400/80 rounded-full
                    animate-pulse shadow-[0_0_8px_rgba(147,122,250,0.6)]
                    relative z-10"></span>
                </div>
                <input
                  type="text"
                  value={postTitle}
                  onChange={(e) => {
                    setPostTitle(e.target.value);
                    handleInputChange('postTitle', e.target.value);
                  }}
                  placeholder="Enter your post title here..."
                  className={`w-full bg-global-2 text-global-1 text-base
                  sm:text-lg lg:text-[32px] lg:leading-[36px] font-normal
                  border-none outline-none placeholder-gray-400
                  focus:placeholder-gray-500 shadow-transparent ${
                    validationErrors.postTitle ? 'border-b-2 border-red-500' : ''
                  }`}
                />
                {validationErrors.postTitle && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.postTitle}</p>
                )}
              </div>

              {/* Post Description Input */}
              <div className="mb-3 lg:mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-global-1 text-sm sm:text-base
                    lg:text-lg lg:leading-[36px] font-normal">
                    Post Description
                  </span>
                  <span className="w-2 h-2 bg-purple-400/80 rounded-full
                    animate-pulse shadow-[0_0_8px_rgba(147,122,250,0.6)]
                    relative z-10"></span>
                </div>
                <input
                  type="text"
                  value={postDescription}
                  onChange={(e) => {
                    setPostDescription(e.target.value);
                    handleInputChange('postDescription', e.target.value);
                  }}
                  placeholder="Describe your post..."
                  className={`w-full bg-transparent text-global-1 text-sm
                  sm:text-base lg:text-lg lg:leading-[36px] font-normal
                  border-none outline-none placeholder-gray-400
                  focus:placeholder-gray-500 ${
                    validationErrors.postDescription ? 'border-b-2 border-red-500' : ''
                  }`}
                />
                {validationErrors.postDescription && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.postDescription}</p>
                )}
              </div>

              {/* Interests Section */}
              <div className="mb-3 lg:mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-global-1 text-sm sm:text-base
                    lg:text-lg lg:leading-[36px] font-normal">
                    Related Interests
                  </span>
                  <span className="w-2 h-2 bg-purple-400/80 rounded-full
                    animate-pulse shadow-[0_0_8px_rgba(147,122,250,0.6)]
                    relative z-10"></span>
                  <span className="text-xs text-gray-500">(minimum 3 required)</span>
                </div>
                
                {/* Search input - only show when expanded or searching */}
                {(showMoreInterests || interestSearch.trim()) && (
                  <input
                    type="text"
                    value={interestSearch}
                    onChange={(e) => setInterestSearch(e.target.value)}
                    className="w-full px-3 py-2 bg-global-3 border border-gray-300
                    rounded-2xl lg:rounded-3xl focus:outline-none focus:ring-2
                    focus:ring-purple-500 mb-3 text-sm lg:text-base"
                    placeholder="Search for interests..."
                  />
                )}
                
                {/* Display interests */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {getDisplayedInterests().map(interest => (
                    <button
                      key={interest}
                      onClick={() => addInterest(interest)}
                      className="px-3 py-1 rounded-full text-sm lg:text-base
                      bg-global-3 text-global-1 hover:bg-global-2
                      transition-colors border border-gray-300"
                    >
                      + {interest}
                    </button>
                  ))}
                </div>

                {/* More Interests Button */}
                {!showMoreInterests && !interestSearch.trim() && (
                  <button
                    onClick={() => setShowMoreInterests(true)}
                    className="px-3 py-2 mb-3 bg-gradient-to-r from-purple-500
                    to-blue-500 text-white rounded-full text-sm lg:text-base
                    hover:from-purple-600 hover:to-blue-600 transition-all
                    duration-200 shadow-md hover:shadow-lg"
                  >
                    More Interests
                  </button>
                )}

                {/* Show fewer button when expanded */}
                {showMoreInterests && !interestSearch.trim() && (
                  <button
                    onClick={() => setShowMoreInterests(false)}
                    className="px-3 py-1 mb-3 bg-gray-500 text-white
                    rounded-full text-sm lg:text-base hover:bg-gray-600
                    transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Show Fewer
                  </button>
                )}
                
                {/* Selected interests */}
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedInterests.map(interest => (
                    <button
                      key={interest}
                      onClick={() => removeInterest(interest)}
                      className="bg-gradient-to-r from-purple-500 to-blue-500
                      text-white px-3 py-1 rounded-full flex items-center
                      gap-1 hover:text-red-200 text-sm lg:text-base"
                    >
                      {interest} ×
                    </button>
                  ))}
                </div>
                
                {validationErrors.interests && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.interests}</p>
                )}
                
                <div className="text-xs text-gray-500 mt-1">
                  Selected: {selectedInterests.length}/3 minimum
                </div>
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

              {/* Post Actions */}
              <div className="flex items-center gap-2 sm:gap-3 lg:gap-[12px]
                flex-wrap">
                {/* Upvote Section */}
                <UpVoteSection/>

                {/* Comment Button */}
                <ActionButton 
                  type="comment" 
                  onClick={() => console.log('comment')}
                />

                {/* Post Event Button */}
                <ActionButton 
                  type="share"
                  onClick={handlePostSubmit}
                >
                  Post Event
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
