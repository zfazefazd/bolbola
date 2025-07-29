import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';

const QuestsSidebar = ({ dailyQuests, weeklyChallenge, onClaimReward, isCollapsed, onToggle }) => {
  const [claimedQuests, setClaimedQuests] = useState(new Set());

  const handleClaimQuest = (questId, xpReward) => {
    if (!claimedQuests.has(questId)) {
      setClaimedQuests(prev => new Set([...prev, questId]));
      onClaimReward(xpReward, `Daily Quest completed! +${xpReward} XP`);
    }
  };

  const handleClaimWeekly = () => {
    if (!claimedQuests.has(weeklyChallenge.id)) {
      setClaimedQuests(prev => new Set([...prev, weeklyChallenge.id]));
      onClaimReward(weeklyChallenge.xpReward, `Weekly Challenge completed! +${weeklyChallenge.xpReward} XP`);
    }
  };

  return (
    <div className={`fixed right-0 top-1/2 transform -translate-y-1/2 z-20 transition-all duration-300 ${
      isCollapsed ? 'translate-x-80' : 'translate-x-0'
    }`}>
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute left-0 top-1/2 transform -translate-x-full -translate-y-1/2 bg-gradient-to-r from-[#00BFA6] to-[#2962FF] text-white p-3 rounded-l-lg hover:shadow-lg hover:shadow-[#00BFA6]/25 transition-all duration-300"
      >
        {isCollapsed ? '◀' : '▶'}
      </button>

      <Card className="w-80 bg-gradient-to-br from-[#1E1E2F]/95 to-[#2A2A3F]/95 backdrop-blur-lg border-[#00BFA6]/20 rounded-l-2xl p-6 max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-white mb-6 text-center font-[Montserrat] uppercase tracking-wide">
          🗡️ Quests & Challenges
        </h2>

        {/* Daily Quests */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-[#FFD54F] mb-4 flex items-center">
            ☀️ Daily Quest
          </h3>
          
          {dailyQuests.map((quest) => {
            const isCompleted = quest.progress >= quest.target;
            const isClaimed = claimedQuests.has(quest.id);
            const progressPercentage = (quest.progress / quest.target) * 100;

            return (
              <Card key={quest.id} className="bg-[#1E1E2F]/50 border border-[#FFD54F]/20 rounded-xl p-4 mb-3">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="text-white font-semibold">{quest.name}</h4>
                    <p className="text-gray-300 text-sm mt-1">{quest.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-[#FFD54F] font-mono text-sm font-bold">
                      +{quest.xpReward} XP
                    </div>
                  </div>
                </div>

                {/* Progress Ring */}
                <div className="flex items-center justify-between">
                  <div className="relative w-16 h-16">
                    <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                      <circle
                        cx="32" cy="32" r="28"
                        fill="none"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="4"
                      />
                      <circle
                        cx="32" cy="32" r="28"
                        fill="none"
                        stroke="#FFD54F"
                        strokeWidth="4"
                        strokeDasharray={`${progressPercentage * 1.75} 175`}
                        strokeLinecap="round"
                        className="transition-all duration-500"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white font-bold text-sm font-mono">
                        {quest.progress}/{quest.target}
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleClaimQuest(quest.id, quest.xpReward)}
                    disabled={!isCompleted || isClaimed}
                    className={`${
                      isClaimed 
                        ? 'bg-green-600 text-white' 
                        : isCompleted 
                          ? 'bg-gradient-to-r from-[#FFD54F] to-[#FF6B6B] text-black hover:shadow-lg hover:shadow-[#FFD54F]/25' 
                          : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    } transition-all duration-300`}
                  >
                    {isClaimed ? '✓ Claimed' : isCompleted ? 'Claim Reward' : 'In Progress'}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Weekly Challenge */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-[#BB86FC] mb-4 flex items-center">
            🏆 Weekly Challenge
          </h3>
          
          <Card className="bg-gradient-to-br from-[#BB86FC]/10 to-[#2962FF]/10 border border-[#BB86FC]/30 rounded-xl p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="text-white font-semibold">{weeklyChallenge.name}</h4>
                <p className="text-gray-300 text-sm mt-1">{weeklyChallenge.description}</p>
              </div>
              <div className="text-right">
                <div className="text-[#BB86FC] font-mono text-lg font-bold">
                  +{weeklyChallenge.xpReward} XP
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[#BB86FC] text-sm font-mono">
                  {weeklyChallenge.progress} / {weeklyChallenge.target} days
                </span>
                <span className="text-gray-400 text-xs">
                  {Math.round((weeklyChallenge.progress / weeklyChallenge.target) * 100)}%
                </span>
              </div>
              
              <div className="relative h-3 bg-[#1E1E2F]/50 rounded-full overflow-hidden border border-[#BB86FC]/20">
                <div 
                  className="h-full bg-gradient-to-r from-[#BB86FC] to-[#2962FF] rounded-full transition-all duration-500"
                  style={{ width: `${(weeklyChallenge.progress / weeklyChallenge.target) * 100}%` }}
                />
              </div>
            </div>

            <Button
              onClick={handleClaimWeekly}
              disabled={weeklyChallenge.progress < weeklyChallenge.target || claimedQuests.has(weeklyChallenge.id)}
              className={`w-full ${
                claimedQuests.has(weeklyChallenge.id)
                  ? 'bg-green-600 text-white' 
                  : weeklyChallenge.progress >= weeklyChallenge.target 
                    ? 'bg-gradient-to-r from-[#BB86FC] to-[#2962FF] hover:shadow-lg hover:shadow-[#BB86FC]/25' 
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              } transition-all duration-300`}
            >
              {claimedQuests.has(weeklyChallenge.id) ? '✓ Claimed' : weeklyChallenge.progress >= weeklyChallenge.target ? 'Claim Reward' : `${weeklyChallenge.target - weeklyChallenge.progress} days remaining`}
            </Button>
          </Card>
        </div>

        {/* Quick Stats */}
        <Card className="bg-[#1E1E2F]/30 border border-[#00BFA6]/10 rounded-xl p-4">
          <h4 className="text-[#00BFA6] font-semibold mb-2">Today's Progress</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-300">XP Earned Today:</span>
              <span className="text-[#FFD54F] font-mono">+240 XP</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Skills Completed:</span>
              <span className="text-[#00BFA6] font-mono">3 / 5</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Current Streak:</span>
              <span className="text-[#FF6B6B] font-mono">🔥 12 days</span>
            </div>
          </div>
        </Card>
      </Card>
    </div>
  );
};

export default QuestsSidebar;