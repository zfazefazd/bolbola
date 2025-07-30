import React from 'react';
import { Card } from './ui/card';
import RankDisplay from './RankDisplay';

const Leaderboard = ({ leaderboard, currentUser }) => {
  const getRankColor = (rank) => {
    switch (rank) {
      case 1: return '#FFD54F'; // Gold
      case 2: return '#C0C0C0'; // Silver  
      case 3: return '#CD7F32'; // Bronze
      default: return '#00BFA6'; // Teal
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return '👑';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return '🏅';
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white font-[Montserrat] uppercase tracking-wide">
          🏆 Leaderboard
        </h2>
        
        <div className="text-right">
          <p className="text-[#00BFA6] text-sm">Live Rankings</p>
          <p className="text-gray-400 text-xs">Updated in real-time</p>
        </div>
      </div>

      <Card className="bg-gradient-to-br from-[#1E1E2F]/90 to-[#2A2A3F]/90 backdrop-blur-lg border-[#00BFA6]/20 rounded-2xl p-6">
        <div className="space-y-4">
          {leaderboard.map((player, index) => {
            const isCurrentUser = player.id === currentUser?.id;
            
            return (
              <div
                key={player.id}
                className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 hover:-translate-y-1 ${
                  isCurrentUser
                    ? 'bg-gradient-to-r from-[#00BFA6]/20 to-[#2962FF]/20 border-2 border-[#00BFA6]/40 shadow-lg shadow-[#00BFA6]/10'
                    : 'bg-[#1E1E2F]/30 border border-gray-600/20 hover:border-[#00BFA6]/30'
                }`}
              >
                {/* Rank & Avatar */}
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    {/* Rank Badge */}
                    <div 
                      className="absolute -top-2 -left-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold z-10 border-2 border-[#1E1E2F]"
                      style={{ backgroundColor: getRankColor(player.rank) }}
                    >
                      <span className="text-black">#{player.rank}</span>
                    </div>
                    
                    {/* Avatar */}
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#00BFA6] to-[#2962FF] p-0.5">
                      <div className="w-full h-full rounded-full bg-[#1E1E2F] flex items-center justify-center text-2xl">
                        {player.avatar}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className={`font-bold text-lg ${isCurrentUser ? 'text-[#00BFA6]' : 'text-white'}`}>
                        {player.username}
                      </h3>
                      {player.rank <= 3 && (
                        <span className="text-xl">{getRankIcon(player.rank)}</span>
                      )}
                      {isCurrentUser && (
                        <span className="text-xs bg-gradient-to-r from-[#00BFA6] to-[#2962FF] text-white px-2 py-1 rounded-full font-bold">
                          YOU
                        </span>
                      )}
                    </div>
                    
                    {/* Rank Display */}
                    <div className="mt-1">
                      <div className="flex items-center space-x-2">
                        <span 
                          className="text-sm font-bold font-[Montserrat] uppercase"
                          style={{ color: player.currentRank?.color || '#8B4513' }}
                        >
                          {player.currentRank?.tier || 'Iron'} {player.currentRank?.division || 'IV'}
                        </span>
                        <span className="text-xs text-gray-400">
                          • {player.totalXP?.toLocaleString() || '0'} XP
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rank Illustration & Stats */}
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <div>
                        <p className="text-[#FFD54F] font-mono text-xl font-bold">
                          {player.totalXP.toLocaleString()}
                        </p>
                        <p className="text-gray-400 text-xs">Total XP</p>
                      </div>
                      
                      {/* Mini Rank Display */}
                      <div className="ml-2">
                        <RankDisplay 
                          rank={player.currentRank} 
                          totalXP={player.totalXP} 
                          size="small" 
                          showProgress={false}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Trend Indicator */}
                  <div className="w-8 text-center">
                    {player.rank <= 3 && (
                      <div className="text-green-400 text-lg animate-bounce">
                        ↗
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Stats */}
        <div className="mt-6 pt-4 border-t border-gray-600/20">
          <div className="flex items-center justify-between text-sm">
            <div className="text-gray-400">
              Live Rankings • Last updated: just now
            </div>
            <div className="text-[#00BFA6] flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span>Real-time sync active</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Leaderboard;