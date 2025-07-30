import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { formatTime } from '../data/mock';
import RankDisplay from './RankDisplay';

const ProfileModal = ({ isOpen, onClose, user, userStats }) => {
  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-br from-[#1E1E2F] to-[#2A2A3F] border-[#00BFA6]/20 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center font-[Montserrat] uppercase tracking-wide">
            🌟 User Profile
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-6 space-y-6">
          {/* User Avatar & Basic Info */}
          <div className="flex items-center space-x-6 bg-[#1E1E2F]/30 rounded-xl p-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#00BFA6] to-[#2962FF] p-1 animate-pulse">
                <div className="w-full h-full rounded-full bg-[#1E1E2F] flex items-center justify-center text-3xl">
                  {user.avatar}
                </div>
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-1">{user.username}</h2>
              <p className="text-[#00BFA6] text-lg font-mono">Galactic Explorer</p>
              <p className="text-gray-400 text-sm">
                📧 {user.email}
              </p>
              <p className="text-gray-400 text-sm">
                🗓️ Member since {new Date(user.joined_at).toLocaleDateString()}
              </p>
              <p className="text-gray-400 text-sm">
                ⏱️ Last active: {new Date(user.last_active).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Rank Display */}
          <div className="bg-[#1E1E2F]/30 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-[#00BFA6] mb-4 text-center">Current Rank</h3>
            <div className="flex justify-center">
              <RankDisplay 
                rank={user.current_rank} 
                totalXP={user.total_xp} 
                size="large" 
                showProgress={true}
              />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-[#00BFA6]/10 to-[#2962FF]/10 border border-[#00BFA6]/20 rounded-xl p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#FFD54F] mb-1">
                  {(user.total_xp || 0).toLocaleString()}
                </div>
                <div className="text-xs text-gray-300">Total XP</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#BB86FC]/10 to-[#2962FF]/10 border border-[#BB86FC]/20 rounded-xl p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#BB86FC] mb-1">
                  {formatTime(user.total_time_minutes || 0)}
                </div>
                <div className="text-xs text-gray-300">Time Logged</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#FFD54F]/10 to-[#FF6B6B]/10 border border-[#FFD54F]/20 rounded-xl p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#FFD54F] mb-1">
                  {userStats?.total_skills || 0}
                </div>
                <div className="text-xs text-gray-300">Skills</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#FF6B6B]/10 to-[#FFD54F]/10 border border-[#FF6B6B]/20 rounded-xl p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#FF6B6B] mb-1">
                  {userStats?.current_streak || 0}
                </div>
                <div className="text-xs text-gray-300">Current Streak</div>
              </div>
            </div>
          </div>

          {/* Detailed Stats */}
          {userStats && (
            <div className="bg-[#1E1E2F]/30 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-[#00BFA6] mb-4">📊 Detailed Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Total Logged Entries:</span>
                    <span className="text-white font-mono">{userStats.total_logs || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Average XP per Skill:</span>
                    <span className="text-[#FFD54F] font-mono">{Math.round(userStats.avg_xp_per_skill || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Average Time per Skill:</span>
                    <span className="text-[#00BFA6] font-mono">{formatTime(Math.round(userStats.avg_time_per_skill || 0))}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Current Rank:</span>
                    <span className="text-white font-mono">{user.current_rank?.tier} {user.current_rank?.division}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Rank Progress:</span>
                    <span className="text-[#BB86FC] font-mono">
                      {user.current_rank ? `${user.total_xp}/${user.current_rank.max_xp} XP` : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Achievement Preview */}
          <div className="bg-[#1E1E2F]/30 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-[#00BFA6] mb-4">🏆 Recent Achievements</h3>
            <div className="text-center text-gray-400">
              <p>Your achievements will appear here!</p>
              <p className="text-sm mt-2">Keep logging time to unlock achievements 🎯</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-center">
          <Button
            onClick={onClose}
            className="bg-gradient-to-r from-[#00BFA6] to-[#2962FF] hover:shadow-lg hover:shadow-[#00BFA6]/25"
          >
            Close Profile
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileModal;