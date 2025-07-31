// Enhanced Mock data for Galactic Quest with Time Tracking & LoL Ranks

// Difficulty levels with XP multipliers
export const difficultyLevels = [
  { id: 'trivial', name: 'Trivial', multiplier: 1.0, color: '#4CAF50', icon: '🟢' },
  { id: 'easy', name: 'Easy', multiplier: 1.5, color: '#8BC34A', icon: '🟡' },
  { id: 'medium', name: 'Medium', multiplier: 2.0, color: '#FFC107', icon: '🟠' },
  { id: 'hard', name: 'Hard', multiplier: 2.5, color: '#FF9800', icon: '🔴' },
  { id: 'extreme', name: 'Extreme', multiplier: 3.0, color: '#F44336', icon: '🟤' },
  { id: 'legendary', name: 'Legendary', multiplier: 3.5, color: '#9C27B0', icon: '🟣' }
];

// League of Legends inspired rank system
export const rankSystem = [
  // Iron
  { tier: 'Iron', division: 'IV', totalRank: 1, minXP: 0, maxXP: 999, color: '#8B4513', bgColor: '#2D1810' },
  { tier: 'Iron', division: 'III', totalRank: 2, minXP: 1000, maxXP: 1999, color: '#8B4513', bgColor: '#2D1810' },
  { tier: 'Iron', division: 'II', totalRank: 3, minXP: 2000, maxXP: 2999, color: '#8B4513', bgColor: '#2D1810' },
  { tier: 'Iron', division: 'I', totalRank: 4, minXP: 3000, maxXP: 3999, color: '#8B4513', bgColor: '#2D1810' },
  
  // Bronze
  { tier: 'Bronze', division: 'IV', totalRank: 5, minXP: 4000, maxXP: 5999, color: '#CD7F32', bgColor: '#3D2F1A' },
  { tier: 'Bronze', division: 'III', totalRank: 6, minXP: 6000, maxXP: 7999, color: '#CD7F32', bgColor: '#3D2F1A' },
  { tier: 'Bronze', division: 'II', totalRank: 7, minXP: 8000, maxXP: 9999, color: '#CD7F32', bgColor: '#3D2F1A' },
  { tier: 'Bronze', division: 'I', totalRank: 8, minXP: 10000, maxXP: 11999, color: '#CD7F32', bgColor: '#3D2F1A' },
  
  // Silver
  { tier: 'Silver', division: 'IV', totalRank: 9, minXP: 12000, maxXP: 14999, color: '#C0C0C0', bgColor: '#2A2A2A' },
  { tier: 'Silver', division: 'III', totalRank: 10, minXP: 15000, maxXP: 17999, color: '#C0C0C0', bgColor: '#2A2A2A' },
  { tier: 'Silver', division: 'II', totalRank: 11, minXP: 18000, maxXP: 20999, color: '#C0C0C0', bgColor: '#2A2A2A' },
  { tier: 'Silver', division: 'I', totalRank: 12, minXP: 21000, maxXP: 23999, color: '#C0C0C0', bgColor: '#2A2A2A' },
  
  // Gold
  { tier: 'Gold', division: 'IV', totalRank: 13, minXP: 24000, maxXP: 27999, color: '#FFD700', bgColor: '#3D3D1A' },
  { tier: 'Gold', division: 'III', totalRank: 14, minXP: 28000, maxXP: 31999, color: '#FFD700', bgColor: '#3D3D1A' },
  { tier: 'Gold', division: 'II', totalRank: 15, minXP: 32000, maxXP: 35999, color: '#FFD700', bgColor: '#3D3D1A' },
  { tier: 'Gold', division: 'I', totalRank: 16, minXP: 36000, maxXP: 39999, color: '#FFD700', bgColor: '#3D3D1A' },
  
  // Platinum
  { tier: 'Platinum', division: 'IV', totalRank: 17, minXP: 40000, maxXP: 44999, color: '#00CED1', bgColor: '#1A3D3D' },
  { tier: 'Platinum', division: 'III', totalRank: 18, minXP: 45000, maxXP: 49999, color: '#00CED1', bgColor: '#1A3D3D' },
  { tier: 'Platinum', division: 'II', totalRank: 19, minXP: 50000, maxXP: 54999, color: '#00CED1', bgColor: '#1A3D3D' },
  { tier: 'Platinum', division: 'I', totalRank: 20, minXP: 55000, maxXP: 59999, color: '#00CED1', bgColor: '#1A3D3D' },
  
  // Diamond
  { tier: 'Diamond', division: 'IV', totalRank: 21, minXP: 60000, maxXP: 69999, color: '#1E90FF', bgColor: '#1A1A3D' },
  { tier: 'Diamond', division: 'III', totalRank: 22, minXP: 70000, maxXP: 79999, color: '#1E90FF', bgColor: '#1A1A3D' },
  { tier: 'Diamond', division: 'II', totalRank: 23, minXP: 80000, maxXP: 89999, color: '#1E90FF', bgColor: '#1A1A3D' },
  { tier: 'Diamond', division: 'I', totalRank: 24, minXP: 90000, maxXP: 99999, color: '#1E90FF', bgColor: '#1A1A3D' },
  
  // Master
  { tier: 'Master', division: '', totalRank: 25, minXP: 100000, maxXP: 149999, color: '#9370DB', bgColor: '#3D1A3D' },
  
  // Grandmaster
  { tier: 'Grandmaster', division: '', totalRank: 26, minXP: 150000, maxXP: 199999, color: '#FF1493', bgColor: '#3D1A2A' },
  
  // Challenger
  { tier: 'Challenger', division: '', totalRank: 27, minXP: 200000, maxXP: 999999999, color: '#FF6347', bgColor: '#3D2A1A' }
];

export const categories = [
  {
    id: 'mind',
    name: 'Mind',
    color: '#00BFA6',
    icon: '🧠',
    description: 'Mental development and learning'
  },
  {
    id: 'body', 
    name: 'Body',
    color: '#2962FF',
    icon: '💪',
    description: 'Physical fitness and health'
  },
  {
    id: 'creativity',
    name: 'Creativity', 
    color: '#BB86FC',
    icon: '🎨',
    description: 'Creative expression and arts'
  },
  {
    id: 'productivity',
    name: 'Productivity',
    color: '#FFD54F',
    icon: '⚡',
    description: 'Work efficiency and organization'
  },
  {
    id: 'social',
    name: 'Social',
    color: '#FF6B6B',
    icon: '🤝',
    description: 'Relationships and communication'
  },
  {
    id: 'spiritual',
    name: 'Spiritual',
    color: '#9C27B0',
    icon: '🕯️',
    description: 'Inner peace and mindfulness'
  }
];

export const initialSkills = [
  // Mind category
  {
    id: 'daily-reading',
    name: 'Daily Reading',
    category: 'mind',
    difficulty: 'easy',
    totalTimeMinutes: 840, // 14 hours
    totalXP: 1260, // 840 * 1.5
    icon: '📚',
    description: 'Read for intellectual growth',
    streak: 5,
    lastLoggedAt: '2025-07-27T20:30:00Z',
    createdAt: '2025-07-20T10:00:00Z'
  },
  {
    id: 'meditation',
    name: 'Meditation',
    category: 'mind', 
    difficulty: 'medium',
    totalTimeMinutes: 300, // 5 hours
    totalXP: 600, // 300 * 2.0
    icon: '🧘',
    description: '15 minutes mindfulness practice',
    streak: 3,
    lastLoggedAt: '2025-07-27T07:00:00Z',
    createdAt: '2025-07-22T08:00:00Z'
  },
  
  // Body category
  {
    id: 'morning-workout',
    name: 'Morning Workout',
    category: 'body',
    difficulty: 'hard',
    totalTimeMinutes: 450, // 7.5 hours
    totalXP: 1125, // 450 * 2.5
    icon: '🏃',
    description: 'High intensity training',
    streak: 7,
    lastLoggedAt: '2025-07-27T06:30:00Z',
    createdAt: '2025-07-18T06:00:00Z'
  },
  
  // Creativity category
  {
    id: 'digital-art',
    name: 'Digital Art',
    category: 'creativity',
    difficulty: 'extreme',
    totalTimeMinutes: 720, // 12 hours
    totalXP: 2160, // 720 * 3.0
    icon: '🎨',
    description: 'Create digital masterpieces',
    streak: 4,
    lastLoggedAt: '2025-07-26T22:00:00Z',
    createdAt: '2025-07-15T14:00:00Z'
  },
  
  // Productivity category
  {
    id: 'deep-work',
    name: 'Deep Work Sessions',
    category: 'productivity',
    difficulty: 'legendary',
    totalTimeMinutes: 360, // 6 hours
    totalXP: 1260, // 360 * 3.5
    icon: '🎯',
    description: 'Focused productive work',
    streak: 8,
    lastLoggedAt: '2025-07-27T16:00:00Z',
    createdAt: '2025-07-19T09:00:00Z'
  }
];

// 20 Special achievements for unusual activities
export const specialAchievements = [
  {
    id: 'night-owl',
    name: 'Night Owl',
    description: 'Log activity between 2-5 AM',
    icon: '🦉',
    earned: false,
    xpReward: 100,
    type: 'time-based'
  },
  {
    id: 'early-bird',
    name: 'Early Bird',
    description: 'Log activity before 6 AM',
    icon: '🐦',
    earned: true,
    earnedDate: '2025-07-25',
    xpReward: 75,
    type: 'time-based'
  },
  {
    id: 'marathon-session',
    name: 'Marathon Master',
    description: 'Spend 5+ hours on one skill in a day',
    icon: '🏃‍♂️',
    earned: false,
    xpReward: 200,
    type: 'duration'
  },
  {
    id: 'category-explorer',
    name: 'Category Explorer',
    description: 'Try a new skill category for the first time',
    icon: '🗺️',
    earned: true,
    earnedDate: '2025-07-22',
    xpReward: 50,
    type: 'exploration'
  },
  {
    id: 'weekend-warrior',
    name: 'Weekend Warrior',
    description: 'Log activities on both Saturday and Sunday',
    icon: '⚔️',
    earned: true,
    earnedDate: '2025-07-26',
    xpReward: 150,
    type: 'consistency'
  },
  {
    id: 'speed-demon',
    name: 'Speed Demon',
    description: 'Log 10 different activities in one day',
    icon: '⚡',
    earned: false,
    xpReward: 300,
    type: 'variety'
  },
  {
    id: 'perfectionist',
    name: 'Perfectionist',
    description: 'Complete 7 days without missing any planned activities',
    icon: '💎',
    earned: false,
    xpReward: 500,
    type: 'consistency'
  },
  {
    id: 'legendary-grinder',
    name: 'Legendary Grinder',
    description: 'Spend 100+ hours on Legendary difficulty activities',
    icon: '🌟',
    earned: false,
    xpReward: 1000,
    type: 'difficulty'
  },
  {
    id: 'social-butterfly',
    name: 'Social Butterfly',
    description: 'Log 20+ hours of social activities in a week',
    icon: '🦋',
    earned: false,
    xpReward: 250,
    type: 'category'
  },
  {
    id: 'mind-over-matter',
    name: 'Mind Over Matter',
    description: 'Balance 50+ hours each in Mind and Body categories',
    icon: '🧠💪',
    earned: false,
    xpReward: 400,
    type: 'balance'
  },
  {
    id: 'creative-genius',
    name: 'Creative Genius',
    description: 'Reach 10,000 XP in Creativity category',
    icon: '🎭',
    earned: false,
    xpReward: 750,
    type: 'mastery'
  },
  {
    id: 'productivity-guru',
    name: 'Productivity Guru',
    description: 'Maintain 30-day streak in Productivity',
    icon: '📈',
    earned: false,
    xpReward: 600,
    type: 'mastery'
  },
  {
    id: 'midnight-madness',
    name: 'Midnight Madness',
    description: 'Log activity exactly at midnight (12:00 AM)',
    icon: '🌙',
    earned: false,
    xpReward: 150,
    type: 'time-based'
  },
  {
    id: 'holiday-hero',
    name: 'Holiday Hero',
    description: 'Log activities on 3 major holidays',
    icon: '🎉',
    earned: false,
    xpReward: 300,
    type: 'special'
  },
  {
    id: 'triple-threat',
    name: 'Triple Threat',
    description: 'Reach level 10 in 3 different categories',
    icon: '🎯',
    earned: false,
    xpReward: 800,
    type: 'achievement'
  },
  {
    id: 'time-lord',
    name: 'Time Lord',
    description: 'Log activities for 365 consecutive days',
    icon: '⏰',
    earned: false,
    xpReward: 2000,
    type: 'legendary'
  },
  {
    id: 'variety-seeker',
    name: 'Variety Seeker',
    description: 'Try all 6 difficulty levels in one week',
    icon: '🎲',
    earned: false,
    xpReward: 200,
    type: 'variety'
  },
  {
    id: 'comeback-kid',
    name: 'Comeback Kid',
    description: 'Return after a 7+ day break and log activity',
    icon: '🔄',
    earned: false,
    xpReward: 100,
    type: 'resilience'
  },
  {
    id: 'zen-master',
    name: 'Zen Master',
    description: 'Log meditation activity for 100+ hours total',
    icon: '☯️',
    earned: false,
    xpReward: 500,
    type: 'mastery'
  },
  {
    id: 'ultimate-champion',
    name: 'Ultimate Champion',
    description: 'Reach Challenger rank',
    icon: '🏆',
    earned: false,
    xpReward: 5000,
    type: 'legendary'
  }
];

export const dailyQuests = [
  {
    id: 'daily-grind',
    name: 'Daily Grind',
    description: 'Log time in 3 different skills today',
    progress: 1,
    target: 3,
    xpReward: 75,
    completed: false
  },
  {
    id: 'time-investor',
    name: 'Time Investor',
    description: 'Spend 2+ hours on any activity today',
    progress: 0,
    target: 120, // minutes
    xpReward: 100,
    completed: false
  }
];

export const weeklyChallenge = {
  id: 'consistency-master',
  name: 'Consistency Master',
  description: 'Log activity every day this week',
  progress: 4,
  target: 7,
  xpReward: 300,
  completed: false
};

// Mock user data
export const currentUser = {
  id: 'user-123',
  username: 'GalacticHero',
  email: 'hero@galactic.quest',
  avatar: '🌟',
  totalXP: 6405, // Sum of all skill XP
  currentRank: getCurrentRank(6405),
  joinedAt: '2025-07-15T10:00:00Z',
  lastActive: '2025-07-27T20:30:00Z'
};

export const leaderboard = [
  {
    id: 'user-456',
    username: 'SkillMaster_Elite',
    avatar: '🦸‍♂️',
    totalXP: 25420,
    currentRank: getCurrentRank(25420),
    rank: 1
  },
  {
    id: 'user-789', 
    username: 'TimeWarrior',
    avatar: '⚔️',
    totalXP: 18890,
    currentRank: getCurrentRank(18890),
    rank: 2
  },
  {
    id: 'user-123', // Current user
    username: 'GalacticHero',
    avatar: '🌟',
    totalXP: 6405,
    currentRank: getCurrentRank(6405),
    rank: 3
  },
  {
    id: 'user-321',
    username: 'QuestCrusher',
    avatar: '💪',
    totalXP: 4230,
    currentRank: getCurrentRank(4230),
    rank: 4
  },
  {
    id: 'user-654',
    username: 'FocusedMind',
    avatar: '🧠',
    totalXP: 3180,
    currentRank: getCurrentRank(3180),
    rank: 5
  }
];

// Utility functions
export function getCurrentRank(totalXP) {
  for (let i = rankSystem.length - 1; i >= 0; i--) {
    if (totalXP >= rankSystem[i].minXP) {
      return rankSystem[i];
    }
  }
  return rankSystem[0]; // Default to Iron IV
}

export function getNextRank(currentRank) {
  const currentIndex = rankSystem.findIndex(rank => 
    rank.tier === currentRank.tier && rank.division === currentRank.division
  );
  
  if (currentIndex < rankSystem.length - 1) {
    return rankSystem[currentIndex + 1];
  }
  return null; // Already at highest rank
}

export function getRankProgress(totalXP, currentRank) {
  const nextRank = getNextRank(currentRank);
  if (!nextRank) {
    return { percentage: 100, xpNeeded: 0, xpProgress: totalXP - currentRank.minXP };
  }
  
  const xpInCurrentRank = totalXP - currentRank.minXP;
  const xpNeededForNext = nextRank.minXP - currentRank.minXP;
  const percentage = Math.min((xpInCurrentRank / xpNeededForNext) * 100, 100);
  
  return {
    percentage: Math.round(percentage),
    xpNeeded: Math.max(0, nextRank.minXP - totalXP), // Ensure never negative
    xpProgress: xpInCurrentRank,
    xpTotal: xpNeededForNext
  };
}

export function calculateTimeToXP(minutes, difficulty) {
  const difficultyData = difficultyLevels.find(d => d.id === difficulty);
  return Math.round(minutes * (difficultyData?.multiplier || 1.0));
}

export function formatTime(minutes) {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
}