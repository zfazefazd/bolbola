import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { difficultyLevels, calculateTimeToXP, formatTime } from '../data/mock';

const TimeLogModal = ({ isOpen, onClose, skill, onConfirm }) => {
  const [timeInput, setTimeInput] = useState({ hours: 0, minutes: 15 });
  const [selectedPreset, setSelectedPreset] = useState(null);

  const presetTimes = [
    { label: '15 min', hours: 0, minutes: 15 },
    { label: '30 min', hours: 0, minutes: 30 },
    { label: '1 hour', hours: 1, minutes: 0 },
    { label: '2 hours', hours: 2, minutes: 0 }
  ];

  const getTotalMinutes = () => {
    return selectedPreset ? 
      (selectedPreset.hours * 60 + selectedPreset.minutes) : 
      (timeInput.hours * 60 + timeInput.minutes);
  };

  const getXPEarned = () => {
    const totalMinutes = getTotalMinutes();
    return calculateTimeToXP(totalMinutes, skill?.difficulty || 'easy');
  };

  const getDifficultyInfo = () => {
    return difficultyLevels.find(d => d.id === skill?.difficulty) || difficultyLevels[0];
  };

  const handleConfirm = () => {
    const totalMinutes = getTotalMinutes();
    if (totalMinutes > 0) {
      onConfirm(skill, totalMinutes);
      setTimeInput({ hours: 0, minutes: 15 });
      setSelectedPreset(null);
      onClose();
    }
  };

  const handlePresetClick = (preset) => {
    setSelectedPreset(preset);
    setTimeInput({ hours: 0, minutes: 15 });
  };

  const handleCustomTimeChange = (field, value) => {
    setSelectedPreset(null);
    // Fix: Convert value to number and ensure it's valid
    const numValue = parseInt(value, 10);
    const finalValue = isNaN(numValue) ? 0 : Math.max(0, numValue);
    
    // Set reasonable limits
    if (field === 'hours' && finalValue > 23) return;
    if (field === 'minutes' && finalValue > 59) return;
    
    setTimeInput(prev => ({
      ...prev,
      [field]: finalValue
    }));
  };

  // Reset form when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setTimeInput({ hours: 0, minutes: 15 });
      setSelectedPreset(null);
    }
  }, [isOpen]);

  if (!skill) return null;

  const difficultyInfo = getDifficultyInfo();
  const totalMinutes = getTotalMinutes();
  const xpEarned = getXPEarned();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-br from-[#1E1E2F] to-[#2A2A3F] border-[#00BFA6]/20 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center font-[Montserrat] uppercase tracking-wide">
            Log Time for {skill.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-6">
          {/* Skill Info */}
          <div className="flex items-center justify-center mb-6">
            <div className="text-6xl mb-2">{skill.icon}</div>
          </div>
          
          <div className="text-center mb-6">
            <p className="text-gray-300 mb-3">{skill.description}</p>
            
            {/* Difficulty Badge */}
            <div className="flex items-center justify-center space-x-2 mb-3">
              <div 
                className="flex items-center space-x-2 px-3 py-1 rounded-full border-2"
                style={{ 
                  borderColor: difficultyInfo.color,
                  backgroundColor: `${difficultyInfo.color}20`
                }}
              >
                <span>{difficultyInfo.icon}</span>
                <span className="font-bold text-sm" style={{ color: difficultyInfo.color }}>
                  {difficultyInfo.name}
                </span>
                <span className="text-xs text-gray-300">
                  ({difficultyInfo.multiplier}x XP)
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-4 text-sm">
              <span className="text-[#00BFA6] font-mono">
                Total: {formatTime(skill.total_time_minutes || 0)}
              </span>
              <span className="text-[#FFD54F] font-mono">
                {skill.total_xp || 0} XP
              </span>
              {skill.streak > 0 && (
                <span className="text-[#FF6B6B] font-mono">🔥 {skill.streak} days</span>
              )}
            </div>
          </div>

          {/* Time Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-center text-[#00BFA6]">
              How much time did you spend?
            </h3>
            
            {/* Preset Buttons */}
            <div className="grid grid-cols-2 gap-3">
              {presetTimes.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => handlePresetClick(preset)}
                  className={`py-3 px-4 rounded-lg font-bold text-lg transition-all duration-300 hover:-translate-y-1 ${
                    selectedPreset === preset
                      ? 'bg-gradient-to-r from-[#00BFA6] to-[#2962FF] text-white shadow-lg shadow-[#00BFA6]/25'
                      : 'bg-[#1E1E2F]/50 border border-[#00BFA6]/20 text-[#00BFA6] hover:border-[#00BFA6]/40'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Custom Time Input */}
            <div className="bg-[#1E1E2F]/30 rounded-xl p-4 border border-[#00BFA6]/10">
              <h4 className="text-sm font-semibold text-[#00BFA6] mb-3 text-center">
                Or set custom time:
              </h4>
              <div className="flex items-center justify-center space-x-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={timeInput.hours}
                    onChange={(e) => handleCustomTimeChange('hours', e.target.value)}
                    className="w-16 py-2 px-3 bg-[#1E1E2F]/50 border border-[#00BFA6]/20 rounded-lg text-white text-center focus:outline-none focus:border-[#00BFA6]/60 focus:ring-2 focus:ring-[#00BFA6]/20"
                    placeholder="0"
                  />
                  <span className="text-gray-300 text-sm">hours</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={timeInput.minutes}
                    onChange={(e) => handleCustomTimeChange('minutes', e.target.value)}
                    className="w-16 py-2 px-3 bg-[#1E1E2F]/50 border border-[#00BFA6]/20 rounded-lg text-white text-center focus:outline-none focus:border-[#00BFA6]/60 focus:ring-2 focus:ring-[#00BFA6]/20"
                    placeholder="0"
                  />
                  <span className="text-gray-300 text-sm">minutes</span>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-2 text-center">
                Tip: You can type numbers directly into the fields
              </p>
            </div>

            {/* XP Preview */}
            {totalMinutes > 0 && (
              <div className="bg-gradient-to-r from-[#00BFA6]/10 to-[#2962FF]/10 border border-[#00BFA6]/20 rounded-xl p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#FFD54F] mb-1">
                    +{xpEarned} XP
                  </div>
                  <div className="text-sm text-gray-300">
                    {formatTime(totalMinutes)} × {difficultyInfo.multiplier}x = {xpEarned} XP
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-600/20"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={totalMinutes === 0}
            className="flex-1 bg-gradient-to-r from-[#00BFA6] to-[#2962FF] hover:shadow-lg hover:shadow-[#00BFA6]/25 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Log {formatTime(totalMinutes)} (+{xpEarned} XP)
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TimeLogModal;