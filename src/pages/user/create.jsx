import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const UserCreationPage = () => {
  const navigate = useNavigate();
  const { signUp, loading: authLoading } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic Info
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",

    // Profile Info
    major: "",
    graduationYear: "",
    handle: "",
    bio: "",

    // Interests & Goals
    interests: [],
    goals: [],

    // Personality (optional)
    personalityTraits: {
      extrovert: 5,
      creative: 5,
      analytical: 5,
      adventurous: 5,
      social: 5,
    },
  });

  const [newGoal, setNewGoal] = useState("");
  const [interestSearch, setInterestSearch] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

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
  ];

  const majors = [
    "Computer Science",
    "Engineering",
    "Psychology",
    "Biology",
    "Business",
    "Art",
    "Literature",
    "Mathematics",
    "Physics",
    "Economics",
    "History",
    "Political Science",
  ];

  const graduationYears = [
    "2017",
    "2018",
    "2019",
    "2020",
    "2021",
    "2022",
    "2023",
    "2024",
    "2025",
    "2026",
    "2027",
    "2028",
  ];

  // Password Verification
  const verifyPasswords = () => {
    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match");
      return false;
    }
    if (formData.password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return false;
    }
    setPasswordError("");
    return true;
  };

  // Validation functions
  const validateStep1 = () => {
    const errors = {};

    if (!formData.firstName.trim()) errors.firstName = "First name is required";
    if (!formData.lastName.trim()) errors.lastName = "Last name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    if (!formData.password) errors.password = "Password is required";
    if (!formData.confirmPassword)
      errors.confirmPassword = "Confirm password is required";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0 && verifyPasswords();
  };

  const validateStep2 = () => {
    const errors = {};

    if (!formData.major) errors.major = "Major is required";
    if (!formData.graduationYear)
      errors.graduationYear = "Graduation year is required";
    if (!formData.handle.trim()) errors.handle = "Username handle is required";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep3 = () => {
    const errors = {};

    if (formData.interests.length < 5) {
      errors.interests = "Please select at least 5 interests";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear validation errors when user types
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }

    // Clear password error when user types
    if (field === "password" || field === "confirmPassword") {
      setPasswordError("");
    }
  };

  const handlePersonalityChange = (trait, value) => {
    setFormData((prev) => ({
      ...prev,
      personalityTraits: {
        ...prev.personalityTraits,
        [trait]: value,
      },
    }));
  };

  const addInterest = (interest) => {
    if (interest && !formData.interests.includes(interest)) {
      setFormData((prev) => ({
        ...prev,
        interests: [...prev.interests, interest],
      }));

      // Clear interests validation error when adding
      if (validationErrors.interests) {
        setValidationErrors((prev) => ({
          ...prev,
          interests: undefined,
        }));
      }
    }
  };

  const removeInterest = (interest) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.filter((i) => i !== interest),
    }));
  };

  const addGoal = () => {
    if (newGoal && !formData.goals.includes(newGoal)) {
      setFormData((prev) => ({
        ...prev,
        goals: [...prev.goals, newGoal],
      }));
    }
    setNewGoal("");
  };

  const removeGoal = (goal) => {
    setFormData((prev) => ({
      ...prev,
      goals: prev.goals.filter((g) => g !== goal),
    }));
  };

  // Filter interests based on search
  const filteredInterests = predefinedInterests.filter(
    (interest) =>
      interest.toLowerCase().includes(interestSearch.toLowerCase()) &&
      !formData.interests.includes(interest),
  );

  const nextStep = () => {
    let isValid = false;

    // Validate current step
    if (currentStep === 1) {
      isValid = validateStep1();
    } else if (currentStep === 2) {
      isValid = validateStep2();
    } else if (currentStep === 3) {
      isValid = validateStep3();
    } else {
      isValid = true;
    }

    if (isValid && currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    // Final validation
    if (!validateStep3()) return;

    try {
      const { data, error } = await signUp(formData.email, formData.password, {
        first_name: formData.firstName,
        last_name: formData.lastName,
        major: formData.major,
        graduation_year: formData.graduationYear,
      });

      if (error) {
        alert(`Sign-up failed: ${error.message}`);
        return;
      }

      alert("Account created! Please check your email to confirm.");
      navigate("/home");
    } catch (e) {
      alert(`Unexpected error: ${e.message}`);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex justify-center mb-8">
      <div className="flex items-center space-x-4">
        {[1, 2, 3, 4].map((step) => (
          <React.Fragment key={step}>
            <div
              className={`w-8 h-8 rounded-full flex items-center
              justify-center text-sm font-medium ${
                step <= currentStep
                  ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                  : "bg-gray-300 text-gray-600"
              }`}
            >
              {step}
            </div>
            {step < 4 && (
              <div
                className={`w-12 h-0.5 ${
                  step < currentStep
                    ? "bg-gradient-to-r from-purple-500 to-blue-500"
                    : "bg-gray-300"
                }`}
              />
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
          <label className="text-gray-700 text-sm font-medium mb-2 flex items-center gap-2">
            First Name
            <span
              className="w-2 h-2 bg-purple-400/80 rounded-full
              animate-pulse shadow-[0_0_8px_rgba(147,122,250,0.6)]
              relative z-10"
            ></span>
          </label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            className={`w-full px-4 py-3 bg-global-2 border rounded-[15px] 
            focus:outline-none focus:ring-2 focus:ring-purple-500 ${
              validationErrors.firstName ? "border-red-500" : "border-gray-200"
            }`}
            placeholder="Enter your first name"
          />
          {validationErrors.firstName && (
            <p className="text-red-500 text-xs mt-1">
              {validationErrors.firstName}
            </p>
          )}
        </div>
        <div>
          <label className="text-gray-700 text-sm font-medium mb-2 flex items-center gap-2">
            Last Name
            <span
              className="w-2 h-2 bg-purple-400/80 rounded-full
              animate-pulse shadow-[0_0_8px_rgba(147,122,250,0.6)]
              relative z-10"
            ></span>
          </label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            className={`w-full px-4 py-3 bg-global-2 border rounded-[15px] 
            focus:outline-none focus:ring-2 focus:ring-purple-500 ${
              validationErrors.lastName ? "border-red-500" : "border-gray-200"
            }`}
            placeholder="Enter your last name"
          />
          {validationErrors.lastName && (
            <p className="text-red-500 text-xs mt-1">
              {validationErrors.lastName}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="text-gray-700 text-sm font-medium mb-2 flex items-center gap-2">
          Email
          <span
            className="w-2 h-2 bg-purple-400/80 rounded-full
            animate-pulse shadow-[0_0_8px_rgba(147,122,250,0.6)]
            relative z-10"
          ></span>
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          className={`w-full px-4 py-3 bg-global-2 border rounded-[15px] 
          focus:outline-none focus:ring-2 focus:ring-purple-500 ${
            validationErrors.email ? "border-red-500" : "border-gray-200"
          }`}
          placeholder="Enter your email address"
        />
        {validationErrors.email && (
          <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-gray-700 text-sm font-medium mb-2 flex items-center gap-2">
            Password
            <span
              className="w-2 h-2 bg-purple-400/80 rounded-full
              animate-pulse shadow-[0_0_8px_rgba(147,122,250,0.6)]
              relative z-10"
            ></span>
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            className={`w-full px-4 py-3 bg-global-2 border rounded-[15px] 
            focus:outline-none focus:ring-2 focus:ring-purple-500 ${
              validationErrors.password ? "border-red-500" : "border-gray-200"
            }`}
            placeholder="Create a password"
          />
          {validationErrors.password && (
            <p className="text-red-500 text-xs mt-1">
              {validationErrors.password}
            </p>
          )}
        </div>
        <div>
          <label className="text-gray-700 text-sm font-medium mb-2 flex items-center gap-2">
            Confirm Password
            <span
              className="w-2 h-2 bg-purple-400/80 rounded-full
              animate-pulse shadow-[0_0_8px_rgba(147,122,250,0.6)]
              relative z-10"
            ></span>
          </label>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) =>
              handleInputChange("confirmPassword", e.target.value)
            }
            className={`w-full px-4 py-3 bg-global-2 border rounded-[15px] 
            focus:outline-none focus:ring-2 focus:ring-purple-500 ${
              validationErrors.confirmPassword
                ? "border-red-500"
                : "border-gray-200"
            }`}
            placeholder="Confirm your password"
          />
          {validationErrors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">
              {validationErrors.confirmPassword}
            </p>
          )}
        </div>
      </div>

      {passwordError && (
        <div className="text-red-500 text-sm mt-2 text-center">
          {passwordError}
        </div>
      )}
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
          <label className="text-gray-700 text-sm font-medium mb-2 flex items-center gap-2">
            Major
            <span
              className="w-2 h-2 bg-purple-400/80 rounded-full
              animate-pulse shadow-[0_0_8px_rgba(147,122,250,0.6)]
              relative z-10"
            ></span>
          </label>
          <select
            value={formData.major}
            onChange={(e) => handleInputChange("major", e.target.value)}
            className={`w-full px-4 py-3 bg-global-2 border rounded-[15px] 
            focus:outline-none focus:ring-2 focus:ring-purple-500 ${
              validationErrors.major ? "border-red-500" : "border-gray-200"
            }`}
          >
            <option value="">Select your major</option>
            {majors.map((major) => (
              <option key={major} value={major}>
                {major}
              </option>
            ))}
          </select>
          {validationErrors.major && (
            <p className="text-red-500 text-xs mt-1">
              {validationErrors.major}
            </p>
          )}
        </div>
        <div>
          <label className="text-gray-700 text-sm font-medium mb-2 flex items-center gap-2">
            Graduation Year
            <span
              className="w-2 h-2 bg-purple-400/80 rounded-full
              animate-pulse shadow-[0_0_8px_rgba(147,122,250,0.6)]
              relative z-10"
            ></span>
          </label>
          <select
            value={formData.graduationYear}
            onChange={(e) =>
              handleInputChange("graduationYear", e.target.value)
            }
            className={`w-full px-4 py-3 bg-global-2 border rounded-[15px] 
            focus:outline-none focus:ring-2 focus:ring-purple-500 ${
              validationErrors.graduationYear
                ? "border-red-500"
                : "border-gray-200"
            }`}
          >
            <option value="">Select graduation year</option>
            {graduationYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          {validationErrors.graduationYear && (
            <p className="text-red-500 text-xs mt-1">
              {validationErrors.graduationYear}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="text-gray-700 text-sm font-medium mb-2 flex items-center gap-2">
          Username Handle
          <span
            className="w-2 h-2 bg-purple-400/80 rounded-full
            animate-pulse shadow-[0_0_8px_rgba(147,122,250,0.6)]
            relative z-10"
          ></span>
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
            @
          </span>
          <input
            type="text"
            value={formData.handle}
            onChange={(e) => handleInputChange("handle", e.target.value)}
            className={`w-full pl-8 pr-4 py-3 bg-global-2 border rounded-[15px] 
            focus:outline-none focus:ring-2 focus:ring-purple-500 ${
              validationErrors.handle ? "border-red-500" : "border-gray-200"
            }`}
            placeholder="your-username"
          />
        </div>
        {validationErrors.handle && (
          <p className="text-red-500 text-xs mt-1">{validationErrors.handle}</p>
        )}
      </div>

      <div>
        <label className="block text-gray-700 text-sm font-medium mb-2">
          Bio
        </label>
        <textarea
          value={formData.bio}
          onChange={(e) => handleInputChange("bio", e.target.value)}
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
        <label className="text-gray-700 text-sm font-medium mb-2 flex items-center gap-2">
          Find Interests
          <span
            className="w-2 h-2 bg-purple-400/80 rounded-full
            animate-pulse shadow-[0_0_8px_rgba(147,122,250,0.6)]
            relative z-10"
          ></span>
          <span className="text-xs text-gray-500">(minimum 5 required)</span>
        </label>
        <input
          type="text"
          value={interestSearch}
          onChange={(e) => setInterestSearch(e.target.value)}
          className="w-full px-4 py-3 bg-global-2 border border-gray-200
          rounded-[15px] focus:outline-none focus:ring-2
          focus:ring-purple-500 mb-3"
          placeholder="Search for interests..."
        />

        <div className="flex flex-wrap gap-2 mb-4 max-h-32 overflow-y-auto">
          {filteredInterests.map((interest) => (
            <button
              key={interest}
              onClick={() => addInterest(interest)}
              className="px-3 py-1 rounded-full text-sm bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
            >
              + {interest}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          {formData.interests.map((interest) => (
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

        {validationErrors.interests && (
          <p className="text-red-500 text-xs mt-2">
            {validationErrors.interests}
          </p>
        )}

        <div className="text-xs text-gray-500 mt-2">
          Selected: {formData.interests.length}/5 minimum
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
            <div
              key={index}
              className="flex items-center gap-3 bg-global-2 p-3
              rounded-[15px]"
            >
              <div
                className="w-2 h-2 bg-purple-500 rounded-full
                flex-shrink-0"
              ></div>
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
        <p className="text-gray-600">
          Help others understand you better (optional)
        </p>
      </div>

      <div className="space-y-6">
        {Object.entries(formData.personalityTraits).map(([trait, value]) => (
          <div key={trait}>
            <div className="flex justify-between mb-2">
              <span className="text-gray-700 capitalize">{trait}</span>
              <span className="text-gray-500">{value}/10</span>
            </div>
            <div className="relative">
              <input
                type="range"
                min="1"
                max="10"
                value={value}
                onChange={(e) =>
                  handlePersonalityChange(trait, parseInt(e.target.value))
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #8b5cf6 0%, #3b82f6
                               ${value * 10 - 20}%, #e5e7eb ${value * 10}%, #e5e7eb 100%)`,
                }}
              />
              <style>{`
                .slider::-webkit-slider-thumb {
                  appearance: none;
                  width: 20px;
                  height: 20px;
                  border-radius: 50%;
                  background: linear-gradient(45deg, #8b5cf6, #3b82f6);
                  cursor: pointer;
                  border: 2px solid white;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                }
                .slider::-moz-range-thumb {
                  width: 20px;
                  height: 20px;
                  border-radius: 50%;
                  background: linear-gradient(45deg, #8b5cf6, #3b82f6);
                  cursor: pointer;
                  border: 2px solid white;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                }
              `}</style>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-global-2 p-6 rounded-[20px] mt-8">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          Preview Your Profile
        </h3>
        <div className="text-sm text-gray-600 space-y-2">
          <p>
            <strong>Name:</strong> {formData.firstName} {formData.lastName}
          </p>
          <p>
            <strong>Major:</strong> {formData.major}
          </p>
          <p>
            <strong>Graduation:</strong> {formData.graduationYear}
          </p>
          <p>
            <strong>Handle:</strong> @{formData.handle}
          </p>
          <p>
            <strong>Interests:</strong> {formData.interests.join(", ")}
          </p>
          <p>
            <strong>Goals:</strong> {formData.goals.length}
          </p>
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      default:
        return renderStep1();
    }
  };

  return (
    <div className="min-h-screen bg-global-1">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-[35px] p-8 shadow-lg">
          {renderStepIndicator()}

          <div className="">{renderCurrentStep()}</div>

          <div className="flex justify-between mt-8">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`px-6 py-3 rounded-[20px] transition-colors ${
                currentStep === 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gray-300 text-gray-700 hover:bg-gray-400"
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
