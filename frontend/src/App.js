import React, { useState, useEffect } from 'react';
import './App.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthPage from './components/auth/AuthPage';
import Header from './components/Header';
import CategoryTabs from './components/CategoryTabs';
import SkillCard from './components/SkillCard';
import TimeLogModal from './components/TimeLogModal';
import QuestsSidebar from './components/QuestsSidebar';
import AchievementsBadges from './components/AchievementsBadges';
import Leaderboard from './components/Leaderboard';
import ToastNotification from './components/ToastNotification';
import { 
  categoriesAPI, 
  skillsAPI, 
  timeLogsAPI, 
  leaderboardAPI, 
  achievementsAPI,
  handleApiError 
} from './services/api';

// Add custom CSS for animations
const customStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Open+Sans:wght@400;600&family=Roboto+Mono:wght@400;700&display=swap');
  
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  .animate-shimmer {
    animation: shimmer 2s infinite;
  }
  
  body {
    background: linear-gradient(135deg, #1E1E2F 0%, #2A2A3F 50%, #1E1E2F 100%);
    min-height: 100vh;
    font-family: 'Open Sans', sans-serif;
  }
  
  .font-montserrat {
    font-family: 'Montserrat', sans-serif;
  }
  
  .font-mono {
    font-family: 'Roboto Mono', monospace;
  }
`;

const MainApp = () => {
  const { user, loading: authLoading, updateUser } = useAuth();
  const [skills, setSkills] = useState([]);
  const [categories, setCategories] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load all data when user is authenticated
  useEffect(() => {
    if (user) {
      loadAllData();
    }
  }, [user]);

  // Set up custom styles
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = customStyles;
    document.head.appendChild(styleElement);

    return () => {
      if (document.head.contains(styleElement)) {
        document.head.removeChild(styleElement);
      }
    };
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [categoriesRes, skillsRes, achievementsRes, leaderboardRes] = await Promise.all([
        categoriesAPI.getAll(),
        skillsAPI.getAll(),
        achievementsAPI.getAll(),
        leaderboardAPI.get()
      ]);

      setCategories(categoriesRes.data);
      setSkills(skillsRes.data);
      setAchievements(achievementsRes.data);
      setLeaderboard(leaderboardRes.data.entries);

      // Set default active category if we have categories
      if (categoriesRes.data.length > 0 && activeCategory === 'all') {
        setActiveCategory(categoriesRes.data[0].id);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
      setToast({
        message: 'Failed to load data: ' + handleApiError(error),
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredSkills = skills.filter(skill => 
    activeCategory === 'all' || skill.category_id === activeCategory
  );

  const handleLogTime = (skill) => {
    setSelectedSkill(skill);
    setIsLogModalOpen(true);
  };

  const handleConfirmTime = async (skill, timeMinutes) => {
    try {
      const response = await timeLogsAPI.create({
        skill_id: skill.id,
        minutes: timeMinutes
      });

      // Update the skill in local state
      const updatedSkills = skills.map(s => 
        s.id === skill.id 
          ? { 
              ...s, 
              total_time_minutes: s.total_time_minutes + timeMinutes,
              total_xp: s.total_xp + response.data.xp_earned,
              streak: s.streak + 1,
              last_logged_at: response.data.logged_at
            }
          : s
      );
      setSkills(updatedSkills);

      // Update user's total XP and rank
      const newTotalXP = user.total_xp + response.data.xp_earned;
      updateUser({
        total_xp: newTotalXP,
        // Note: The backend calculates the new rank, but for immediate UI update we'll refetch user data
      });

      // Refresh leaderboard
      const leaderboardRes = await leaderboardAPI.get();
      setLeaderboard(leaderboardRes.data.entries);

      setToast({
        message: `+${response.data.xp_earned} XP earned! ${formatTime(timeMinutes)} logged for ${skill.name}`,
        type: 'success'
      });
    } catch (error) {
      console.error('Failed to log time:', error);
      setToast({
        message: 'Failed to log time: ' + handleApiError(error),
        type: 'error'
      });
    }
  };

  const handleClaimReward = (xpAmount, message) => {
    setToast({
      message: message,
      type: 'achievement'
    });
  };

  const handleEditSkill = async (skill) => {
    // TODO: Implement edit skill modal
    console.log('Edit skill:', skill.name);
  };

  const handleDeleteSkill = async (skill) => {
    if (window.confirm(`Are you sure you want to delete "${skill.name}"?`)) {
      try {
        await skillsAPI.delete(skill.id);
        setSkills(skills.filter(s => s.id !== skill.id));
        setToast({
          message: `${skill.name} has been deleted.`,
          type: 'success'
        });
      } catch (error) {
        console.error('Failed to delete skill:', error);
        setToast({
          message: 'Failed to delete skill: ' + handleApiError(error),
          type: 'error'
        });
      }
    }
  };

  const handleAddCategory = async (categoryData) => {
    try {
      const response = await categoriesAPI.create(categoryData);
      setCategories(prev => [...prev, response.data]);
      setToast({
        message: `Category "${categoryData.name}" added successfully!`,
        type: 'success'
      });
    } catch (error) {
      console.error('Failed to add category:', error);
      setToast({
        message: 'Failed to add category: ' + handleApiError(error),
        type: 'error'
      });
    }
  };

  const handleEditCategory = (category) => {
    // TODO: Implement edit category functionality
    console.log('Edit category:', category.name);
  };

  const formatTime = (minutes) => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1E1E2F] via-[#2A2A3F] to-[#1E1E2F] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#00BFA6]/20 border-t-[#00BFA6] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Loading Galactic Quest...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1E1E2F] via-[#2A2A3F] to-[#1E1E2F] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🌟</div>
          <div className="w-16 h-16 border-4 border-[#00BFA6]/20 border-t-[#00BFA6] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Loading your galactic data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E1E2F] via-[#2A2A3F] to-[#1E1E2F] p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Header 
          user={user}
          totalXP={user.total_xp}
          onProfileClick={() => console.log('Profile clicked')}
          onSettingsClick={() => console.log('Settings clicked')}
        />

        {/* Category Navigation */}
        {categories.length > 0 && (
          <CategoryTabs 
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            skills={skills}
            onAddCategory={handleAddCategory}
            onEditCategory={handleEditCategory}
          />
        )}

        <div className="flex gap-6">
          {/* Main Content */}
          <div className="flex-1">
            {/* Skills Grid */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white font-montserrat uppercase tracking-wide">
                  {activeCategory === 'all' ? '🎯 All Skills' : `${categories.find(c => c.id === activeCategory)?.icon} ${categories.find(c => c.id === activeCategory)?.name} Skills`}
                </h2>
                <button className="px-4 py-2 bg-gradient-to-r from-[#00BFA6] to-[#2962FF] text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-[#00BFA6]/25 transition-all duration-300 hover:-translate-y-1">
                  + Add New Skill
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSkills.map((skill) => (
                  <SkillCard
                    key={skill.id}
                    skill={skill}
                    category={categories.find(c => c.id === skill.category_id)}
                    onLogTime={handleLogTime}
                    onEditSkill={handleEditSkill}
                    onDeleteSkill={handleDeleteSkill}
                  />
                ))}
              </div>

              {filteredSkills.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🚀</div>
                  <h3 className="text-xl font-bold text-white mb-2">No skills in this category yet</h3>
                  <p className="text-gray-400 mb-6">Start your galactic quest by adding your first skill!</p>
                  <button className="px-6 py-3 bg-gradient-to-r from-[#00BFA6] to-[#2962FF] text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-[#00BFA6]/25 transition-all duration-300 hover:-translate-y-1">
                    Add Your First Skill
                  </button>
                </div>
              )}
            </div>

            {/* Achievements */}
            <AchievementsBadges achievements={achievements} />

            {/* Leaderboard */}
            <Leaderboard leaderboard={leaderboard} currentUser={user} />
          </div>
        </div>

        {/* Quests Sidebar */}
        <QuestsSidebar 
          dailyQuests={[]} // TODO: Implement quests in backend
          weeklyChallenge={{}} // TODO: Implement weekly challenges
          onClaimReward={handleClaimReward}
          isCollapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* Time Log Modal */}
        <TimeLogModal
          isOpen={isLogModalOpen}
          onClose={() => setIsLogModalOpen(false)}
          skill={selectedSkill}
          onConfirm={handleConfirmTime}
        />

        {/* Toast Notifications */}
        {toast && (
          <ToastNotification
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App;