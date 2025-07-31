import React from 'react';
import { getRankProgress, getNextRank } from '../data/mock';

const RankDisplay = ({ rank, totalXP, size = 'large', showProgress = true }) => {
  // Add null checks for rank
  if (!rank || !rank.tier) {
    return (
      <div className="flex flex-col items-center">
        <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center">
          <div className="text-2xl">⚙️</div>
        </div>
        <div className="text-center mt-4">
          <h3 className="font-bold text-gray-400">Loading Rank...</h3>
        </div>
      </div>
    );
  }

  const progress = getRankProgress(totalXP, rank);
  const nextRank = getNextRank(rank);
  
  // Clean gaming rank illustrations - emoji-based system that works well
  const getRankIllustration = (tierName, division) => {
    const tier = tierName?.toLowerCase() || 'iron';
    
    switch (tier) {
      case 'iron':
        return {
          background: 'linear-gradient(135deg, #8B4513 0%, #A0522D 50%, #8B4513 100%)',
          illustration: '⚙️',
          particles: ['🔩', '⚙️', '🔧'],
          glow: 'shadow-[#8B4513]/20'
        };
      case 'bronze':
        return {
          background: 'linear-gradient(135deg, #CD7F32 0%, #DAA520 50%, #CD7F32 100%)',
          illustration: '🥉',
          particles: ['✨', '🥉', '⭐'],
          glow: 'shadow-[#CD7F32]/30'
        };
      case 'silver':
        return {
          background: 'linear-gradient(135deg, #C0C0C0 0%, #E8E8E8 50%, #C0C0C0 100%)',
          illustration: '🥈',
          particles: ['✨', '🥈', '💫'],
          glow: 'shadow-[#C0C0C0]/40'
        };
      case 'gold':
        return {
          background: 'linear-gradient(135deg, #FFD700 0%, #FFF700 50%, #FFD700 100%)',
          illustration: '🥇',
          particles: ['✨', '🏆', '👑'],
          glow: 'shadow-[#FFD700]/50'
        };
      case 'platinum':
        return {
          background: 'linear-gradient(135deg, #00CED1 0%, #40E0D0 50%, #00CED1 100%)',
          illustration: '💎',
          particles: ['💎', '✨', '🌟'],
          glow: 'shadow-[#00CED1]/60'
        };
      case 'diamond':
        return {
          background: 'linear-gradient(135deg, #1E90FF 0%, #4169E1 50%, #1E90FF 100%)',
          illustration: '💍',
          particles: ['💍', '💎', '⭐'],
          glow: 'shadow-[#1E90FF]/70'
        };
      case 'master':
        return {
          background: 'linear-gradient(135deg, #9370DB 0%, #BA55D3 50%, #9370DB 100%)',
          illustration: '🔮',
          particles: ['🔮', '✨', '🌟'],
          glow: 'shadow-[#9370DB]/80'
        };
      case 'grandmaster':
        return {
          background: 'linear-gradient(135deg, #FF1493 0%, #FF69B4 50%, #FF1493 100%)',
          illustration: '👑',
          particles: ['👑', '⚡', '🌟'],
          glow: 'shadow-[#FF1493]/90'
        };
      case 'challenger':
        return {
          background: 'linear-gradient(135deg, #FF6347 0%, #FF4500 30%, #FFD700 70%, #FF6347 100%)',
          illustration: '🌟',
          particles: ['🌟', '⚡', '🔥'],
          glow: 'shadow-[#FF6347]/100 shadow-2xl'
        };
      default:
        return {
          background: 'linear-gradient(135deg, #8B4513 0%, #A0522D 50%, #8B4513 100%)',
          illustration: '⚙️',
          particles: ['🔩'],
          glow: 'shadow-[#8B4513]/20'
        };
    }
  };

  const rankArt = getRankIllustration(rank?.tier, rank?.division);
  const sizeClass = size === 'large' ? 'w-32 h-32' : size === 'medium' ? 'w-20 h-20' : 'w-12 h-12';
  const textSize = size === 'large' ? 'text-2xl' : size === 'medium' ? 'text-lg' : 'text-sm';

  return (
    <div className="flex flex-col items-center">
      {/* Rank Badge */}
      <div className="relative mb-4">
        {/* Animated particles around higher ranks */}
        {rank?.tier && ['master', 'grandmaster', 'challenger'].includes(rank.tier.toLowerCase()) && (
          <div className="absolute inset-0 animate-spin-slow">
            {rankArt.particles.map((particle, i) => (
              <div
                key={i}
                className="absolute text-lg animate-pulse"
                style={{
                  top: `${20 + Math.sin((i * 120) * Math.PI / 180) * 40}%`,
                  left: `${50 + Math.cos((i * 120) * Math.PI / 180) * 40}%`,
                  animationDelay: `${i * 0.5}s`
                }}
              >
                {particle}
              </div>
            ))}
          </div>
        )}
        
        <div 
          className={`${sizeClass} rounded-full p-1 ${rankArt.glow} hover:scale-110 transition-all duration-300`}
          style={{ background: rankArt.background }}
        >
          <div className="w-full h-full rounded-full bg-[#1E1E2F]/20 backdrop-blur-sm flex items-center justify-center">
            <div className={`${textSize} animate-pulse`}>
              {rankArt.illustration}
            </div>
          </div>
        </div>
        
        {/* Rank progression indicator */}
        {showProgress && nextRank && (
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
            <div className="w-16 h-2 bg-[#1E1E2F]/50 rounded-full overflow-hidden border border-gray-600/20">
              <div 
                className="h-full bg-gradient-to-r from-[#00BFA6] to-[#2962FF] rounded-full transition-all duration-500"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Rank Text */}
      <div className="text-center">
        <h3 
          className={`font-bold font-[Montserrat] uppercase tracking-wide ${textSize}`}
          style={{ color: rank?.color || '#8B4513' }}
        >
          {rank?.tier || 'Iron'}{rank?.division ? ` ${rank.division}` : ''}
        </h3>
        
        {showProgress && (
          <div className="mt-2 space-y-1">
            <p className="text-[#FFD54F] font-mono text-sm">
              {(totalXP || 0).toLocaleString()} XP
            </p>
            
            {nextRank ? (
              <div className="text-xs text-gray-400">
                <span className="text-[#00BFA6]">{(progress?.xpNeeded || 0).toLocaleString()} XP</span>
                {' '}to {nextRank.tier} {nextRank.division}
              </div>
            ) : (
              <div className="text-xs text-[#FFD700]">
                🏆 Highest Rank Achieved!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RankDisplay;