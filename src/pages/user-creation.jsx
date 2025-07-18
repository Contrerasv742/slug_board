import React, { useState } from 'react';

const UserCreationPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic Info
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    
    // Profile Info
    major: '',
    graduationYear: '',
    handle: '',
    bio: '',
    
    // Interests & Goals
    interests: [],
    goals: [],
    
    // Personality (optional)
    personalityTraits: {
      extrovert: 5,
      creative: 5,
      analytical: 5,
      adventurous: 5,
      social: 5
    }
  });

  const [newInterest, setNewInterest] = useState('');
  const [newGoal, setNewGoal] = useState('');

  const predefinedInterests = [
    'Photography', 'Coding', 'Music', 'Sports', 'Art', 'Reading',
    'Gaming', 'Travel', 'Food', 'Fitness', 'Movies', 'Nature'
  ];

  const majors = [
    'Computer Science', 'Engineering', 'Psychology', 'Biology',
    'Business', 'Art', 'Literature', 'Mathematics', 'Physics',
    'Economics', 'History', 'Political Science'
  ];

  const graduationYears = ['2024', '2025', '2026', '2027', '2028'];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePersonalityChange = (trait, value) => {
    setFormData(prev => ({
      ...prev,
      personalityTraits: {
        ...prev.personalityTraits,
        [trait]: value
      }
    }));
  };

  const addInterest = (interest) => {
    if (interest && !formData.interests.includes(interest)) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, interest]
      }));
    }
    setNewInterest('');
  };

  const removeInterest = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }));
  };

  const addGoal = () => {
    if (newGoal && !formData.goals.includes(newGoal)) {
      setFormData(prev => ({
        ...prev,
        goals: [...prev.goals, newGoal]
      }));
    }
    setNewGoal('');
  };

  const removeGoal = (goal) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.filter(g => g !== goal)
    }));
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log('User data:', formData);
    // Handle form submission
    alert('Account created successfully!');
  };

  const renderStepIndicator = () => (
    <div className="flex justify-center mb-8">
      <div className="flex items-center space-x-4">
        {[1, 2, 3, 4].map((step) => (
          <React.Fragment key={step}>
            <div className={`w-8 h-8 rounded-full flex items-center
              justify-center text-sm font-medium ${
              step <= currentStep 
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white' 
                : 'bg-gray-300 text-gray-600'
            }`}>
              {step}
            </div>
            {step < 4 && (
              <div className={`w-12 h-0.5 ${
                step < currentStep ? 'bg-gradient-to-r from-purple-500 to-blue-500' :
                                     'bg-gray-300'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl lg:text-3xl font-normal text-gray-800 mb-2">
          Welcome to Campus Connect
        </h2>
        <p className="text-gray-600">Let's get you started with the basics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2">
            First Name
          </label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            className="w-full px-4 py-3 bg-global-2 border border-gray-200
            rounded-[15px] focus:outline-none focus:ring-2
            focus:ring-purple-500"
            placeholder="Enter your first name"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Last Name
          </label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            className="w-full px-4 py-3 bg-global-2 border border-gray-200
            rounded-[15px] focus:outline-none focus:ring-2
            focus:ring-purple-500"
            placeholder="Enter your last name"
          />
        </div>
      </div>

      <div>
        <label className="block text-gray-700 text-sm font-medium mb-2">
          Email
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          className="w-full px-4 py-3 bg-global-2 border border-gray-200
          rounded-[15px] focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Enter your email address"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Password
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            className="w-full px-4 py-3 bg-global-2 border border-gray-200
            rounded-[15px] focus:outline-none focus:ring-2
            focus:ring-purple-500"
            placeholder="Create a password"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            className="w-full px-4 py-3 bg-global-2 border border-gray-200
            rounded-[15px] focus:outline-none focus:ring-2
            focus:ring-purple-500"
            placeholder="Confirm your password"
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl lg:text-3xl font-normal text-gray-800 mb-2">
          Academic Information
        </h2>
        <p className="text-gray-600">Tell us about your academic journey</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Major
          </label>
          <select
            value={formData.major}
            onChange={(e) => handleInputChange('major', e.target.value)}
            className="w-full px-4 py-3 bg-global-2 border border-gray-200
            rounded-[15px] focus:outline-none focus:ring-2
            focus:ring-purple-500"
          >
            <option value="">Select your major</option>
            {majors.map(major => (
              <option key={major} value={major}>{major}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Graduation Year
          </label>
          <select
            value={formData.graduationYear}
            onChange={(e) => handleInputChange('graduationYear', e.target.value)}
            className="w-full px-4 py-3 bg-global-2 border border-gray-200
            rounded-[15px] focus:outline-none focus:ring-2
            focus:ring-purple-500"
          >
            <option value="">Select graduation year</option>
            {graduationYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-gray-700 text-sm font-medium mb-2">
          Username Handle
        </label>
        <div className="relative"> <span className="absolute left-4 top-1/2
          transform -translate-y-1/2 text-gray-500">@</span>
          <input
            type="text"
            value={formData.handle}
            onChange={(e) => handleInputChange('handle', e.target.value)}
            className="w-full pl-8 pr-4 py-3 bg-global-2 border border-gray-200
            rounded-[15px] focus:outline-none focus:ring-2
            focus:ring-purple-500"
            placeholder="your-username"
          />
        </div>
      </div>

      <div>
        <label className="block text-gray-700 text-sm font-medium mb-2">
          Bio
        </label>
        <textarea
          value={formData.bio}
          onChange={(e) => handleInputChange('bio', e.target.value)}
          rows="4"
          className="w-full px-4 py-3 bg-global-2 border border-gray-200
          rounded-[15px] focus:outline-none focus:ring-2 focus:ring-purple-500
          resize-none"
          placeholder="Tell us about yourself..."
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl lg:text-3xl font-normal text-gray-800 mb-2">
          Interests & Goals
        </h2>
        <p className="text-gray-600">What are you passionate about?</p>
      </div>

      <div>
        <label className="block text-gray-700 text-sm font-medium mb-2">
          Interests
        </label>
        <div className="flex flex-wrap gap-2 mb-3">
          {predefinedInterests.map(interest => (
            <button
              key={interest}
              onClick={() => addInterest(interest)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                formData.interests.includes(interest)
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {interest}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newInterest}
            onChange={(e) => setNewInterest(e.target.value)}
            className="flex-1 px-4 py-2 bg-global-2 border border-gray-200
            rounded-[15px] focus:outline-none focus:ring-2
            focus:ring-purple-500"
            placeholder="Add custom interest..."
          />
          <button
            onClick={() => addInterest(newInterest)}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500
            text-white rounded-[15px] hover:opacity-90"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {formData.interests.map(interest => (
            <span
              key={interest}
              className="bg-gradient-to-r from-purple-500 to-blue-500
              text-white px-3 py-1 rounded-full text-sm flex items-center
              gap-1"
            >
              {interest}
              <button
                onClick={() => removeInterest(interest)}
                className="text-white hover:text-red-200"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-gray-700 text-sm font-medium mb-2">
          Goals
        </label>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            className="flex-1 px-4 py-2 bg-global-2 border border-gray-200
            rounded-[15px] focus:outline-none focus:ring-2
            focus:ring-purple-500"
            placeholder="Add a goal..."
          />
          <button
            onClick={addGoal}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500
            text-white rounded-[15px] hover:opacity-90"
          >
            Add
          </button>
        </div>
        <div className="space-y-2">
          {formData.goals.map((goal, index) => (
            <div key={index} className="flex items-center gap-3 bg-global-1 p-3
              rounded-[15px]">
              <div className="w-2 h-2 bg-purple-500 rounded-full
                flex-shrink-0"></div>
              <span className="flex-1 text-gray-700">{goal}</span>
              <button
                onClick={() => removeGoal(goal)}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl lg:text-3xl font-normal text-gray-800 mb-2">
          Personality Profile
        </h2>
        <p className="text-gray-600">Help others understand you better (optional)</p>
      </div>

      <div className="space-y-6">
        {Object.entries(formData.personalityTraits).map(([trait, value]) => (
          <div key={trait}>
            <div className="flex justify-between mb-2">
              <span className="text-gray-700 capitalize">{trait}</span>
              <span className="text-gray-500">{value}/10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={value}
              onChange={(e) => handlePersonalityChange(trait, parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none
              cursor-pointer"
              style={{
                background: `linear-gradient(to right, #8b5cf6 0%, #3b82f6
                             ${value * 10}%, #e5e7eb ${value * 10}%, #e5e7eb 100%)`
              }}
            />
          </div>
        ))}
      </div>

      <div className="bg-global-2 p-6 rounded-[20px] mt-8">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Preview Your Profile</h3>
        <div className="text-sm text-gray-600 space-y-2">
          <p><strong>Name:</strong> {formData.firstName} {formData.lastName}</p>
          <p><strong>Major:</strong> {formData.major}</p>
          <p><strong>Graduation:</strong> {formData.graduationYear}</p>
          <p><strong>Handle:</strong> @{formData.handle}</p>
          <p><strong>Interests:</strong> {formData.interests.join(', ')}</p>
          <p><strong>Goals:</strong> {formData.goals.length}</p>
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      default: return renderStep1();
    }
  };

  return (
    <div className="min-h-screen bg-global-1">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-[35px] p-8 shadow-lg">
          {renderStepIndicator()}
          
          <div className="min-h-[500px]">
            {renderCurrentStep()}
          </div>

          <div className="flex justify-between mt-8">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`px-6 py-3 rounded-[20px] transition-colors ${
                currentStep === 1 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                  : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
              }`}
            >
              Previous
            </button>
            
            {currentStep < 4 ? (
              <button
                onClick={nextStep}
                className="px-6 py-3 bg-gradient-to-r from-purple-500
                to-blue-500 text-white rounded-[20px] hover:opacity-90
                transition-opacity"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-6 py-3 bg-gradient-to-r from-green-500
                  to-blue-500 text-white rounded-[20px] hover:opacity-90
                  transition-opacity"
              >
                Create Account
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCreationPage;
