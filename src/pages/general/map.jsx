import { useAuth } from "../../contexts/AuthContext";
import Header from '../../components/common/Header.jsx';
import Sidebar from '../../components/common/Sidebar.jsx';

const MapPage = () => {

  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-global-1 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 pt-16 sm:pt-18 lg:pt-20 min-h-screen"> 
      {/* Header */}
      <Header 
        showSearch={true}
        searchPlaceholder="Search Posts"
        userName="John Doe"
        userHandle="@johndoe"
        userAvatar="/images/default-avatar.png"
      />
      
      {/* Main Content Container */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar/>
        
        {/* Map Container */}
        <div className="flex-1 relative">
          <iframe 
            src="https://maps.ucsc.edu/"
            width="86%" 
            height="100%" 
            title="UCSC Interactive Map"
            className="border-none absolute top-[10px] left-[14%]"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
};

export default MapPage;
