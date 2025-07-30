import React from 'react';
import { Card } from './ui/card';
import RankDisplay from './RankDisplay';

const Header = ({ user, totalXP, onProfileClick, onSettingsClick }) => {
  return (
    <Card className="bg-gradient-to-r from-[#1E1E2F]/90 to-[#2A2A3F]/90 backdrop-blur-lg border-[#00BFA6]/20 rounded-2xl p-6 mb-6">
      <div className="flex items-center justify-between">
        {/* User Avatar & Info */}
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00BFA6] to-[#2962FF] p-0.5 animate-pulse">
              <div className="w-full h-full rounded-full bg-[#1E1E2F] flex items-center justify-center text-2xl">
                {user.avatar}
              </div>
            </div>
            {user.levelUp && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#FFD54F] rounded-full flex items-center justify-center animate-bounce">
                <span className="text-xs font-bold text-black">!</span>
              </div>
            )}
          </div>
          <div>
            <h2 className="text-white font-bold text-xl">{user.username}</h2>
            <p className="text-[#00BFA6] text-sm font-mono">Galactic Explorer</p>
            <p className="text-gray-400 text-xs">
              Member since {new Date(user.joined_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Rank Display */}
        <div className="flex-1 flex justify-center">
          <RankDisplay 
            rank={user.currentRank} 
            totalXP={totalXP} 
            size="large" 
            showProgress={true}
          />
        </div>

        {/* Actions Section */}
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-[#FFD54F] font-mono text-2xl font-bold">{(totalXP || 0).toLocaleString()}</p>
            <p className="text-gray-400 text-sm">Total XP</p>
          </div>
          
          <button 
            onClick={onProfileClick}
            className="px-4 py-2 bg-gradient-to-r from-[#00BFA6] to-[#2962FF] text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-[#00BFA6]/25 transition-all duration-300 hover:-translate-y-1"
          >
            View Profile
          </button>
          
          <button 
            onClick={onSettingsClick}
            className="p-3 bg-[#1E1E2F]/50 border border-[#00BFA6]/20 rounded-lg text-[#00BFA6] hover:bg-[#00BFA6]/10 hover:border-[#00BFA6]/40 transition-all duration-300 hover:-translate-y-1"
          >
            ⚙️
          </button>
        </div>
      </div>
    </Card>
  );
};

export default Header;