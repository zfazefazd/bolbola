import React, { useState } from 'react';
import { Card } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

const AchievementsBadges = ({ achievements }) => {
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  
  const earnedAchievements = achievements.filter(a => a.earned);
  const unearned = achievements.filter(a => !a.earned);

  const getAchievementRarity = (xpReward) => {
    if (xpReward >= 1000) return { name: 'Legendary', color: '#FF6347', glow: 'shadow-[#FF6347]/50' };
    if (xpReward >= 500) return { name: 'Epic', color: '#9C27B0', glow: 'shadow-[#9C27B0]/40' };
    if (xpReward >= 200) return { name: 'Rare', color: '#2196F3', glow: 'shadow-[#2196F3]/30' };
    if (xpReward >= 100) return { name: 'Uncommon', color: '#4CAF50', glow: 'shadow-[#4CAF50]/20' };
    return { name: 'Common', color: '#9E9E9E', glow: 'shadow-gray-500/10' };
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white font-[Montserrat] uppercase tracking-wide">
          🏅 Special Achievements
        </h2>
        <div className="text-right">
          <p className="text-[#FFD54F] font-mono text-lg font-bold">
            {earnedAchievements.length} / {achievements.length}
          </p>
          <p className="text-gray-400 text-sm">Unlocked</p>
        </div>
      </div>

      {/* Achievement Categories */}
      <div className="space-y-6">
        {/* Earned Achievements */}
        {earnedAchievements.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-[#00BFA6] mb-4 flex items-center">
              ✨ Unlocked Achievements
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
              {earnedAchievements.map((achievement) => {
                const rarity = getAchievementRarity(achievement.xpReward);
                return (
                  <Card
                    key={achievement.id}
                    onClick={() => setSelectedAchievement(achievement)}
                    className={`bg-gradient-to-br from-[#FFD54F]/20 to-[#00BFA6]/20 border-2 border-[#FFD54F]/40 rounded-xl p-3 cursor-pointer hover:scale-105 hover:shadow-lg ${rarity.glow} transition-all duration-300 group relative overflow-hidden`}
                  >
                    {/* Rarity shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 group-hover:animate-shimmer" />
                    
                    <div className="text-center relative z-10">
                      <div className="text-3xl mb-2 group-hover:animate-bounce">
                        {achievement.icon}
                      </div>
                      <h4 className="text-white font-bold text-xs mb-1 leading-tight">
                        {achievement.name}
                      </h4>
                      <div className="flex items-center justify-center space-x-1 mb-1">
                        <span className="text-[#FFD54F] text-xs font-mono font-bold">
                          +{achievement.xpReward}
                        </span>
                        <span className="text-xs font-bold" style={{ color: rarity.color }}>
                          {rarity.name}
                        </span>
                      </div>
                      {achievement.earnedDate && (
                        <p className="text-gray-400 text-xs">
                          {new Date(achievement.earnedDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Locked Achievements by Type */}
        {unearned.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-400 mb-4 flex items-center">
              🔒 Locked Achievements
            </h3>
            
            {/* Group by type */}
            {['legendary', 'mastery', 'consistency', 'variety', 'special'].map(type => {
              const typeAchievements = unearned.filter(a => a.type === type);
              if (typeAchievements.length === 0) return null;
              
              const typeNames = {
                legendary: '🌟 Legendary',
                mastery: '👑 Mastery', 
                consistency: '⚡ Consistency',
                variety: '🎲 Variety',
                special: '🎉 Special Events'
              };
              
              return (
                <div key={type} className="mb-4">
                  <h4 className="text-md font-semibold text-gray-300 mb-3">
                    {typeNames[type]}
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                    {typeAchievements.map((achievement) => {
                      const rarity = getAchievementRarity(achievement.xpReward);
                      return (
                        <Card
                          key={achievement.id}
                          onClick={() => setSelectedAchievement(achievement)}
                          className="bg-[#1E1E2F]/30 border border-gray-600/20 rounded-xl p-3 cursor-pointer hover:border-gray-500/40 transition-all duration-300 opacity-60 hover:opacity-80 relative"
                        >
                          <div className="text-center">
                            <div className="text-3xl mb-2 grayscale">
                              {achievement.icon}
                            </div>
                            <h4 className="text-gray-300 font-bold text-xs mb-1 leading-tight">
                              {achievement.name}
                            </h4>
                            <div className="flex items-center justify-center space-x-1">
                              <span className="text-gray-500 text-xs font-mono">
                                +{achievement.xpReward}
                              </span>
                              <span className="text-xs" style={{ color: rarity.color, opacity: 0.7 }}>
                                {rarity.name}
                              </span>
                            </div>
                          </div>
                          
                          {/* Lock overlay */}
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-xl">
                            <div className="text-2xl opacity-50">🔒</div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Achievement Detail Modal */}
      <Dialog open={!!selectedAchievement} onOpenChange={() => setSelectedAchievement(null)}>
        <DialogContent className="bg-gradient-to-br from-[#1E1E2F] to-[#2A2A3F] border-[#00BFA6]/20 text-white max-w-md">
          {selectedAchievement && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-center font-[Montserrat] uppercase tracking-wide">
                  Achievement Details
                </DialogTitle>
              </DialogHeader>
              
              <div className="py-6 text-center">
                <div className={`text-8xl mb-4 ${selectedAchievement.earned ? 'animate-bounce' : 'grayscale'}`}>
                  {selectedAchievement.icon}
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-2">
                  {selectedAchievement.name}
                </h3>
                
                <p className="text-gray-300 mb-4">
                  {selectedAchievement.description}
                </p>
                
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <div className={`px-4 py-2 rounded-lg ${
                    selectedAchievement.earned 
                      ? 'bg-gradient-to-r from-[#00BFA6] to-[#2962FF]' 
                      : 'bg-gray-600'
                  }`}>
                    <span className="text-white font-bold">
                      +{selectedAchievement.xpReward} XP Reward
                    </span>
                  </div>
                  
                  <div 
                    className="px-3 py-1 rounded-full text-sm font-bold border-2"
                    style={{ 
                      color: getAchievementRarity(selectedAchievement.xpReward).color,
                      borderColor: getAchievementRarity(selectedAchievement.xpReward).color,
                      backgroundColor: `${getAchievementRarity(selectedAchievement.xpReward).color}20`
                    }}
                  >
                    {getAchievementRarity(selectedAchievement.xpReward).name}
                  </div>
                </div>
                
                {selectedAchievement.earned && selectedAchievement.earnedDate && (
                  <div className="bg-[#1E1E2F]/50 border border-[#00BFA6]/20 rounded-lg p-3">
                    <p className="text-[#00BFA6] text-sm">
                      🎉 Unlocked on {new Date(selectedAchievement.earnedDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                )}
                
                {!selectedAchievement.earned && (
                  <div className="bg-gray-800/50 border border-gray-600/20 rounded-lg p-3">
                    <p className="text-gray-400 text-sm mb-2">
                      🔒 Complete the challenge to unlock this achievement!
                    </p>
                    <p className="text-xs text-gray-500">
                      Type: <span className="capitalize">{selectedAchievement.type}</span>
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AchievementsBadges;