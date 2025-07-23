import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Header from "../../components/common/Header.jsx";
import Sidebar from "../../components/common/Sidebar.jsx";

const EditPostPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const eventId = searchParams.get("id");

  return (
    <div className="flex flex-col min-h-screen bg-global-1 font-ropa">
      <Header showSearch={false} searchPlaceholder="Edit Event" />
      <div className="flex flex-1 pt-16 sm:pt-18 lg:pt-20">
        <Sidebar />
        <main className="flex-1 p-6 sm:p-6 lg:p-[44px_48px] flex flex-col items-center justify-start text-white">
          <h1 className="text-2xl mb-6">Edit Event (Coming Soon)</h1>
          <p className="mb-4">Event ID: {eventId || "Unknown"}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded"
          >
            ← Go Back
          </button>
        </main>
      </div>
    </div>
  );
};

export default EditPostPage; 