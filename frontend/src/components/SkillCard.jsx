import React, { useState } from 'react';
import { Card } from './ui/card';
import { difficultyLevels, formatTime } from '../data/mock';

const SkillCard = ({ skill, category, onLogTime, onEditSkill, onDeleteSkill, onShowStats }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const getDifficultyInfo = () => {
    return difficultyLevels.find(d => d.id === skill.difficulty) || difficultyLevels[0];
  };

  const getTimeBasedLevel = () => {
    // Simple level calculation based on total time (every 2 hours = 1 level)
    return Math.floor((skill.total_time_minutes || 0) / 120) + 1;
  };

  const getProgressToNextLevel = () => {
    const currentLevel = getTimeBasedLevel();
    const minutesForCurrentLevel = (currentLevel - 1) * 120;
    const minutesForNextLevel = currentLevel * 120;
    const progressMinutes = (skill.total_time_minutes || 0) - minutesForCurrentLevel;
    const neededMinutes = minutesForNextLevel - minutesForCurrentLevel;
    const percentage = Math.min((progressMinutes / neededMinutes) * 100, 100);
    
    return {
      current: progressMinutes,
      needed: neededMinutes,
      percentage: Math.round(percentage),
      nextLevelMinutes: minutesForNextLevel
    };
  };

  // Fix: Provide fallback for category if undefined
  const getCategoryInfo = () => {
    if (!category) {
      return {
        color: '#00BFA6', // Default color
        name: 'Unknown Category',
        icon: '📂'
      };
    }
    return category;
  };

  const difficultyInfo = getDifficultyInfo();
  const level = getTimeBasedLevel();
  const progress = getProgressToNextLevel();
  const isNearLevelUp = progress.percentage > 80;
  const lastActive = skill.last_logged_at ? new Date(skill.last_logged_at) : null;
  const categoryInfo = getCategoryInfo();

  return (
    <Card 
      className="bg-gradient-to-br from-[#1E1E2F]/90 to-[#2A2A3F]/90 backdrop-blur-lg border border-gray-600/20 rounded-2xl p-6 hover:border-[#00BFA6]/40 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#00BFA6]/20 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
            style={{ backgroundColor: `${categoryInfo.color}20`, border: `2px solid ${categoryInfo.color}40` }}
          >
            {skill.icon}
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">{skill.name}</h3>
            <div className="flex items-center space-x-2">
              <span className="text-[#FFD54F] font-mono text-sm font-bold">
                Level {level}
              </span>
              {skill.streak > 0 && (
                <div className="flex items-center space-x-1 bg-[#FF6B6B]/20 px-2 py-1 rounded-full">
                  <span className="text-xs">🔥</span>
                  <span className="text-[#FF6B6B] text-xs font-bold">{skill.streak}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {isNearLevelUp && (
          <div className="animate-pulse">
            <div className="w-3 h-3 bg-[#FFD54F] rounded-full animate-ping" />
          </div>
        )}
      </div>

      {/* Description & Difficulty */}
      <div className="mb-4">
        <p className="text-gray-300 text-sm mb-2">{skill.description}</p>
        <div className="flex items-center justify-between">
          <div 
            className="flex items-center space-x-2 px-2 py-1 rounded-full text-xs border"
            style={{ 
              borderColor: difficultyInfo.color,
              backgroundColor: `${difficultyInfo.color}20`
            }}
          >
            <span>{difficultyInfo.icon}</span>
            <span className="font-bold" style={{ color: difficultyInfo.color }}>
              {difficultyInfo.name}
            </span>
            <span className="text-gray-300">({difficultyInfo.multiplier}x)</span>
          </div>
          
          {lastActive && (
            <div className="text-xs text-gray-400">
              Last: {lastActive.toLocaleDateString()}
            </div>
          )}
        </div>
      </div>

      {/* Time & XP Progress */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <div className="text-[#00BFA6] text-sm font-mono">
            <span className="font-bold">{formatTime(skill.total_time_minutes || 0)}</span>
            <span className="text-gray-400 ml-2">• {skill.total_xp || 0} XP</span>
          </div>
          <span className="text-gray-400 text-xs">
            Next level: {formatTime(progress.nextLevelMinutes)}
          </span>
        </div>
        
        <div className="relative h-3 bg-[#1E1E2F]/50 rounded-full overflow-hidden border border-gray-600/20">
          {/* Segments */}
          <div className="absolute inset-0 flex">
            {[...Array(10)].map((_, i) => (
              <div 
                key={i} 
                className="flex-1 border-r border-[#1E1E2F] last:border-r-0"
              />
            ))}
          </div>
          
          {/* Progress Fill */}
          <div 
            className={`h-full rounded-full transition-all duration-500 ease-out ${
              isNearLevelUp 
                ? 'bg-gradient-to-r from-[#FFD54F] to-[#FF6B6B] animate-pulse' 
                : 'bg-gradient-to-r from-[#00BFA6] to-[#2962FF]'
            }`}
            style={{ width: `${progress.percentage}%` }}
          />
          
          {/* Shimmer Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
        </div>
        
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>{formatTime(progress.current)}</span>
          <span>{formatTime(progress.needed)} needed</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => onLogTime(skill)}
          className="flex-1 bg-gradient-to-r from-[#00BFA6] to-[#2962FF] text-white font-semibold py-2 px-4 rounded-lg hover:shadow-lg hover:shadow-[#00BFA6]/25 transition-all duration-300 hover:-translate-y-1 mr-2"
        >
          ⏱️ Log Time
        </button>
        
        {/* Quick Action Icons (show on hover) */}
        <div className={`flex space-x-2 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <button 
            onClick={() => onEditSkill(skill)}
            className="p-2 bg-[#1E1E2F]/50 border border-[#FFD54F]/20 rounded-lg text-[#FFD54F] hover:bg-[#FFD54F]/10 hover:border-[#FFD54F]/40 transition-all duration-300"
            title="Edit Skill"
          >
            ✏️
          </button>
          <button 
            onClick={() => onShowStats && onShowStats(skill)}
            className="p-2 bg-[#1E1E2F]/50 border border-[#BB86FC]/20 rounded-lg text-[#BB86FC] hover:bg-[#BB86FC]/10 hover:border-[#BB86FC]/40 transition-all duration-300"
            title="View Statistics"
          >
            📊
          </button>
          <button 
            onClick={() => onDeleteSkill(skill)}
            className="p-2 bg-[#1E1E2F]/50 border border-[#FF6B6B]/20 rounded-lg text-[#FF6B6B] hover:bg-[#FF6B6B]/10 hover:border-[#FF6B6B]/40 transition-all duration-300"
            title="Delete Skill"
          >
            🗑️
          </button>
        </div>
      </div>
    </Card>
  );
};

export default SkillCard;