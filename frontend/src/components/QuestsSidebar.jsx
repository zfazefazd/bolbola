import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { questsAPI } from '../services/api';

const QuestsSidebar = ({ onClaimReward, isCollapsed, onToggle }) => {
  const [quests, setQuests] = useState({ daily: [], weekly: [] });
  const [loading, setLoading] = useState(true);
  const [claimedQuests, setClaimedQuests] = useState(new Set());

  // Load quests data
  useEffect(() => {
    loadQuests();
    // Refresh quests every 30 seconds for live updates
    const interval = setInterval(loadQuests, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadQuests = async () => {
    try {
      const response = await questsAPI.getAll();
      setQuests(response.data);
      
      // Track already claimed quests
      const claimed = new Set();
      [...response.data.daily, ...response.data.weekly].forEach(quest => {
        if (quest.claimed) {
          claimed.add(quest.id);
        }
      });
      setClaimedQuests(claimed);
      
    } catch (error) {
      console.error('Failed to load quests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimQuest = async (questId, xpReward, questName) => {
    if (claimedQuests.has(questId)) return;
    
    try {
      await questsAPI.claimReward(questId);
      setClaimedQuests(prev => new Set([...prev, questId]));
      onClaimReward(`${questName} completed! +${xpReward} XP`);
      
      // Refresh quests after claiming
      setTimeout(loadQuests, 1000);
    } catch (error) {
      console.error('Failed to claim quest reward:', error);
    }
  };

  const renderQuest = (quest, type = 'daily') => {
    const isCompleted = quest.progress >= quest.target_value;
    const isClaimed = quest.claimed || claimedQuests.has(quest.id);
    const progressPercentage = Math.min((quest.progress / quest.target_value) * 100, 100);
    const color = type === 'daily' ? '#FFD54F' : '#BB86FC';

    return (
      <Card key={quest.id} className={`bg-[#1E1E2F]/50 border border-[${color}]/20 rounded-xl p-4 mb-3`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h4 className="text-white font-semibold">{quest.name}</h4>
            <p className="text-gray-300 text-sm mt-1">{quest.description}</p>
          </div>
          <div className="text-right">
            <div className="font-mono text-sm font-bold" style={{ color }}>
              +{quest.xp_reward} XP
            </div>
          </div>
        </div>

        {/* Progress Display */}
        <div className="flex items-center justify-between">
          {type === 'daily' ? (
            // Circular progress for daily quests
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
                  stroke={color}
                  strokeWidth="4"
                  strokeDasharray={`${progressPercentage * 1.75} 175`}
                  strokeLinecap="round"
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-bold text-sm font-mono">
                  {quest.progress}/{quest.target_value}
                </span>
              </div>
            </div>
          ) : (
            // Linear progress for weekly quests
            <div className="flex-1 mr-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-mono text-sm" style={{ color }}>
                  {quest.progress} / {quest.target_value} {quest.quest_type === 'weekly' ? 'days' : ''}
                </span>
                <span className="text-gray-400 text-xs">
                  {Math.round(progressPercentage)}%
                </span>
              </div>
              
              <div className={`relative h-3 bg-[#1E1E2F]/50 rounded-full overflow-hidden border border-[${color}]/20`}>
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: `${progressPercentage}%`,
                    background: `linear-gradient(to right, ${color}, ${color}CC)`
                  }}
                />
              </div>
            </div>
          )}

          <Button
            onClick={() => handleClaimQuest(quest.id, quest.xp_reward, quest.name)}
            disabled={!isCompleted || isClaimed}
            className={`${
              isClaimed 
                ? 'bg-green-600 text-white' 
                : isCompleted 
                  ? `bg-gradient-to-r hover:shadow-lg transition-all duration-300` 
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            } ${type === 'daily' ? 'from-[#FFD54F] to-[#FF6B6B] text-black hover:shadow-[#FFD54F]/25' : 'from-[#BB86FC] to-[#2962FF] hover:shadow-[#BB86FC]/25'}`}
          >
            {isClaimed ? '✓ Claimed' : isCompleted ? 'Claim Reward' : 'In Progress'}
          </Button>
        </div>
      </Card>
    );
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

        {loading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-2 border-[#00BFA6]/20 border-t-[#00BFA6] rounded-full animate-spin mx-auto mb-2" />
            <p className="text-gray-400 text-sm">Loading quests...</p>
          </div>
        ) : (
          <>
            {/* Daily Quests */}
            {quests.daily.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-[#FFD54F] mb-4 flex items-center">
                  ☀️ Daily Quests
                </h3>
                {quests.daily.map(quest => renderQuest(quest, 'daily'))}
              </div>
            )}

            {/* Weekly Challenges */}
            {quests.weekly.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[#BB86FC] mb-4 flex items-center">
                  🏆 Weekly Challenges
                </h3>
                {quests.weekly.map(quest => renderQuest(quest, 'weekly'))}
              </div>
            )}

            {/* No Quests Available */}
            {quests.daily.length === 0 && quests.weekly.length === 0 && !loading && (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">📜</div>
                <h3 className="text-white font-semibold mb-2">No Active Quests</h3>
                <p className="text-gray-400 text-sm">New quests will appear soon!</p>
              </div>
            )}
          </>
        )}

        {/* Quick Stats */}
        <Card className="bg-[#1E1E2F]/30 border border-[#00BFA6]/10 rounded-xl p-4">
          <h4 className="text-[#00BFA6] font-semibold mb-2">Quest Progress</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-300">Daily Completed:</span>
              <span className="text-[#FFD54F] font-mono">
                {quests.daily.filter(q => q.completed).length} / {quests.daily.length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Weekly Completed:</span>
              <span className="text-[#BB86FC] font-mono">
                {quests.weekly.filter(q => q.completed).length} / {quests.weekly.length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Total Rewards Claimed:</span>
              <span className="text-[#00BFA6] font-mono">
                {[...quests.daily, ...quests.weekly].filter(q => q.claimed).length}
              </span>
            </div>
          </div>
        </Card>
      </Card>
    </div>
  );
};

export default QuestsSidebar;