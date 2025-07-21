import { Link } from 'react-router-dom';
import Header from '../../components/common/Header.jsx';
import Sidebar from '../../components/common/Sidebar.jsx';
import UpVotesSection from '../../components/ui/Vote-Buttons.jsx';
import ActionButton from '../../components/ui/Action-Button.jsx';
import '../../styles/home.css'

const HomePage = () => {
  const feedPosts = [
    {
      id: 1,
      userName: 'User Name',
      timeAgo: '2 days ago',
      title: 'Post Name...',
      description: 'Economics get money',
      upvotes: 534,
      hasComments: true,
      canShare: true
    },
    {
      id: 2,
      userName: 'User Name',
      timeAgo: '2 days ago',
      title: 'General Meeting',
      description: 'Stoners Unites',
      upvotes: 420,
      hasComments: true,
      canShare: true
    },
    {
      id: 3,
      userName: 'User Name',
      timeAgo: '2 days ago',
      title: 'Mission 101',
      upvotes: 69,
      hasComments: true,
      canShare: true
    }
  ];

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
      <div className="flex flex-1 pt-16 sm:pt-18 lg:pt-20"> 
        {/* Sidebar */}
        <Sidebar/>

        {/* Mobile Menu Button */}
        <button className="block lg:hidden fixed top-4 left-4 z-50 p-3
          bg-global-1 rounded-lg border border-white border-opacity-60
          cursor-pointer">
          <div className="w-6 h-6 flex flex-col justify-center items-center">
            <span className="block w-5 h-0.5 bg-sidebar-1 mb-1"></span>
            <span className="block w-5 h-0.5 bg-sidebar-1 mb-1"></span>
            <span className="block w-5 h-0.5 bg-sidebar-1"></span>
          </div>
        </button>

        {/* Feed Content */}
        <main className="flex-1 lg:pl-[16%] p-6 sm:p-6 lg:p-[44px_48px] flex justify-center">
          <div className="flex flex-col gap-4 lg:gap-[32px] w-[95%] sm:w-[85%]
            lg:w-[80%] max-w-[800px] mx-auto">
            {feedPosts.map((post) => (
              <article key={post.id} className="bg-global-2 rounded-[35px] p-3
                sm:p-4 lg:p-[24px] w-full">
                {/* Post Header */}
                <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 mb-3
                  lg:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14
                    lg:h-14 bg-global-4 rounded-full flex-shrink-0">
                  </div>
                  <div className="flex items-center gap-2 sm:gap-2
                    lg:gap-[12px] flex-wrap">
                    <span className="text-global-1 text-base sm:text:lg
                      lg:text-xl lg:leading-[26px] font-normal">
                      {post.userName} •
                    </span>
                    <span className="text-global-2 text-base sm:text-lg
                      lg:text-xl lg:leading-[26px] font-normal">
                      {post.timeAgo}
                    </span>
                  </div>
                </div>

                {/* Post Title */}
                <h2 className="text-global-1 text-base sm:text-lg
                  lg:text-3xl lg:leading-[36px] font-normal mb-0
                  lg:mb-[0px]">
                  {post.title}
                </h2>

                {/* Post Description */}
                <h4 className="text-global-1 text-sm sm:text-base lg:text-lg
                  lg:leading-[36px] font-normal mb-0 lg:mb-[0px]">
                  {post.description}
                </h4>

                {/* Post Image */}
                <div className="w-full h-32 sm:h-36 lg:h-80 bg-global-5
                  rounded-[20px] sm:rounded-[25px] lg:rounded-[35px] mb-3
                  lg:mb-[20px]">
                </div>

                {/* Post Actions */}
                <div className="flex items-center gap-2 sm:gap-3 lg:gap-[12px]
                  flex-wrap">
                  {/* Upvote Section */}
                  <UpVotesSection
                    upvotes={post.upvotes}
                    light={true}
                  />

                  {/* Comment Button */}
                  {post.hasComments && (
                    <ActionButton 
                      type="comment" 
                      onClick={() => console.log('comment')}
                    />
                  )}

                  {/* Share Button */}
                  {post.canShare && (
                    <ActionButton 
                      type="share" 
                      onClick={() => console.log('share')}
                    >
                      Share
                    </ActionButton>
                  )}
                </div>
              </article>
            ))}
          </div>
        </main>
      </div>

      {/* Create Events */}
      <Link
        to="/create-post"
        className="fixed bottom-6 right-6 w-[50px] h-[50px] rounded-full 
        bg-global-2 hover:bg-global-3 transition-all duration-200 
        shadow-lg hover:shadow-xl transform hover:scale-105
        flex items-center justify-center z-50 no-underline"
      >
        <span className="text-5xl font-bold leading-none text-starship-animated">
          +
        </span>
      </Link>

    </div>
  );
};

export default HomePage;
