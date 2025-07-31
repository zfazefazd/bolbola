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
  
  // Use actual rank armor images from the uploaded League of Legends rank image
  const getRankIllustration = (tierName, division) => {
    const tier = tierName?.toLowerCase() || 'iron';
    
    // Map each rank to its position in the uploaded image (3x3 grid)
    const rankPositions = {
      'iron': { x: 0, y: 0 }, // Top-left
      'bronze': { x: 1, y: 0 }, // Top-center  
      'silver': { x: 2, y: 0 }, // Top-right
      'gold': { x: 3, y: 0 }, // Top-far-right
      'platinum': { x: 4, y: 0 }, // Top-end
      'diamond': { x: 0, y: 1 }, // Bottom-left
      'master': { x: 1, y: 1 }, // Bottom-center
      'grandmaster': { x: 2, y: 1 }, // Bottom-center-right
      'challenger': { x: 3, y: 1 } // Bottom-right
    };
    
    const position = rankPositions[tier] || rankPositions['iron'];
    
    return {
      background: 'transparent',
      backgroundImage: 'url(/rank_icons.jpg)',
      backgroundPosition: `-${position.x * 200}px -${position.y * 200}px`,
      backgroundSize: '1000px 400px', // Adjust based on original image size
      illustration: '', // No emoji, using background image
      particles: [],
      glow: `shadow-lg`
    };
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
                {' '}to {nextRank.tier}{nextRank.division ? ` ${nextRank.division}` : ''}
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