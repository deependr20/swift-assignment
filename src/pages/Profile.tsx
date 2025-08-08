import React from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import { User } from "../types";

// Constants
const SWIFT_LOGO_URL =
  "https://cdn.prod.website-files.com/6509887b9119507025235a5a/650ada40fd6cf3427547c9d8_Swift%20logo.svg";
const USERS_API_URL = "https://jsonplaceholder.typicode.com/users";

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { data: users, loading, error } = useApi<User[]>(USERS_API_URL);

  // Get the first user for profile display
  const user = users?.[0];

  // Navigation handlers
  const handleBackClick = () => navigate("/dashboard");

  // Helper function to get user initials
  const getUserInitials = (name: string): string => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  };

  // Reusable Header Component
  const Header: React.FC<{
    userInitials?: string;
    userName?: string;
    userStatus?: string;
    avatarBgColor?: string;
  }> = ({
    userInitials = "...",
    userName = "Loading...",
    userStatus = "Please wait",
    avatarBgColor = "bg-gray-400",
  }) => (
    <div className="bg-white border-b border-gray-200 shadow-lg">
      <div className="md:px-10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <img src={SWIFT_LOGO_URL} alt="Swift Logo" className="h-10 w-auto" />
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div
              className={`w-8 h-8 ${avatarBgColor} rounded-full flex items-center justify-center text-sm font-medium text-white`}>
              {userInitials}
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-medium text-gray-900">
                {userName}
              </div>
              <div className="text-xs text-gray-500">{userStatus}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center min-h-screen justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
            <p className="mt-4 text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error/No Data State Component
  const ErrorState: React.FC<{ message: string; buttonText: string }> = ({
    message,
    buttonText,
  }) => (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <div className="text-gray-600 text-xl mb-4">{message}</div>
        <button
          onClick={handleBackClick}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          {buttonText}
        </button>
      </div>
    </div>
  );

  // No User State
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header
          userInitials="?"
          userName="No Data"
          userStatus="User not found"
        />
        <ErrorState
          message="No user data found"
          buttonText="Back to Dashboard"
        />
      </div>
    );
  }

  // Form Field Component
  const FormField: React.FC<{
    label: string;
    value: string;
    className?: string;
  }> = ({ label, value, className = "" }) => (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-gray-900">
        {value}
      </div>
    </div>
  );

  // Back Button Component
  const BackButton: React.FC = () => (
    <div className="flex items-center mb-6">
      <button
        onClick={handleBackClick}
        className="flex items-center text-gray-600 hover:text-gray-800 transition-colors mr-3">
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <span className="font-semibold text-xl text-gray-900">
        Welcome, {user.name}
      </span>
    </div>
  );

  // User Avatar Component
  const UserAvatar: React.FC<{ user: User }> = ({ user }) => (
    <div className="flex items-center mb-8">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 text-xl font-semibold mr-6">
        {getUserInitials(user.name)}
      </div>
      <div>
        <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
        <p className="text-gray-500">{user.email}</p>
      </div>
    </div>
  );

  // Main Profile Content
  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        userInitials={getUserInitials(user.name)}
        userName={user.name}
        userStatus="Administrator"
        avatarBgColor="bg-blue-600"
      />

      <div className="px-6 py-6 max-w-[80rem] mx-auto">
        <BackButton />

        {/* Profile Card */}
        <div className="bg-white  rounded-lg shadow-sm border border-gray-200 md:py-12 py-8 md:px-12 px-8 max-w-[80rem] mx-auto">
          <UserAvatar user={user} />

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormField
              label="User ID"
              value={user.id.toString().padStart(8, "0")}
            />
            <FormField label="Name" value={user.name} />
            <FormField label="Email ID" value={user.email} />
            <FormField
              label="Address"
              value={`${user.address.street}, ${user.address.suite}, ${user.address.city}`}
            />
            <FormField
              label="Phone"
              value={user.phone}
              className="md:col-span-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
