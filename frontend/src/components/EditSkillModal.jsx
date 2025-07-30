import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { difficultyLevels } from '../data/mock';

const EditSkillModal = ({ isOpen, onClose, skill, categories, onConfirm }) => {
  const [skillData, setSkillData] = useState({
    name: skill?.name || '',
    difficulty: skill?.difficulty || 'easy',
    icon: skill?.icon || '🎯',
    description: skill?.description || ''
  });

  const handleSubmit = () => {
    if (skillData.name.trim()) {
      onConfirm(skill.id, skillData);
      onClose();
    }
  };

  const handleInputChange = (field, value) => {
    setSkillData(prev => ({ ...prev, [field]: value }));
  };

  if (!skill) return null;

  const currentCategory = categories.find(c => c.id === skill.category_id);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-br from-[#1E1E2F] to-[#2A2A3F] border-[#00BFA6]/20 text-white max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center font-[Montserrat] uppercase tracking-wide">
            ✏️ Edit Skill
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-6 space-y-4">
          {/* Current Category Display */}
          <div className="bg-[#1E1E2F]/30 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                style={{ backgroundColor: `${currentCategory?.color}20`, border: `2px solid ${currentCategory?.color}40` }}
              >
                {skill.icon}
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">{skill.name}</h3>
                <p className="text-[#00BFA6] text-sm">
                  {currentCategory?.icon} {currentCategory?.name}
                </p>
              </div>
            </div>
          </div>

          {/* Skill Name */}
          <div>
            <label className="block text-sm font-semibold text-[#00BFA6] mb-2">
              Skill Name *
            </label>
            <input
              type="text"
              value={skillData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full py-2 px-3 bg-[#1E1E2F]/50 border border-[#00BFA6]/20 rounded-lg text-white focus:outline-none focus:border-[#00BFA6]/60 focus:ring-2 focus:ring-[#00BFA6]/20"
              placeholder="e.g., Python Programming, Guitar Practice"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-[#00BFA6] mb-2">
              Description
            </label>
            <textarea
              value={skillData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full py-2 px-3 bg-[#1E1E2F]/50 border border-[#00BFA6]/20 rounded-lg text-white focus:outline-none focus:border-[#00BFA6]/60 focus:ring-2 focus:ring-[#00BFA6]/20 h-20 resize-none"
              placeholder="Brief description of this skill"
            />
          </div>

          <div className="flex space-x-4">
            {/* Icon */}
            <div className="flex-1">
              <label className="block text-sm font-semibold text-[#00BFA6] mb-2">
                Icon
              </label>
              <input
                type="text"
                value={skillData.icon}
                onChange={(e) => handleInputChange('icon', e.target.value)}
                className="w-full py-2 px-3 bg-[#1E1E2F]/50 border border-[#00BFA6]/20 rounded-lg text-white text-center focus:outline-none focus:border-[#00BFA6]/60 focus:ring-2 focus:ring-[#00BFA6]/20"
                placeholder="🎯"
              />
            </div>
            
            {/* Difficulty */}
            <div className="flex-2">
              <label className="block text-sm font-semibold text-[#00BFA6] mb-2">
                Difficulty
              </label>
              <select
                value={skillData.difficulty}
                onChange={(e) => handleInputChange('difficulty', e.target.value)}
                className="w-full py-2 px-3 bg-[#1E1E2F]/50 border border-[#00BFA6]/20 rounded-lg text-white focus:outline-none focus:border-[#00BFA6]/60 focus:ring-2 focus:ring-[#00BFA6]/20"
              >
                {difficultyLevels.map((level) => (
                  <option key={level.id} value={level.id}>
                    {level.icon} {level.name} ({level.multiplier}x)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Current Stats Display */}
          <div className="bg-gradient-to-r from-[#00BFA6]/10 to-[#2962FF]/10 border border-[#00BFA6]/20 rounded-xl p-4">
            <h4 className="text-[#00BFA6] font-semibold mb-2">Current Progress</h4>
            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              <div>
                <div className="text-[#FFD54F] font-bold">{skill.total_xp || 0}</div>
                <div className="text-gray-300">Total XP</div>
              </div>
              <div>
                <div className="text-[#00BFA6] font-bold">
                  {Math.floor((skill.total_time_minutes || 0) / 60)}h {(skill.total_time_minutes || 0) % 60}m
                </div>
                <div className="text-gray-300">Time Logged</div>
              </div>
              <div>
                <div className="text-[#FF6B6B] font-bold">{skill.streak || 0}</div>
                <div className="text-gray-300">Day Streak</div>
              </div>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-[#FFD54F]/10 border border-[#FFD54F]/20 rounded-xl p-3">
            <p className="text-[#FFD54F] text-sm text-center">
              ⚠️ Changing difficulty will affect future XP earnings, but won't change existing progress.
            </p>
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
            onClick={handleSubmit}
            disabled={!skillData.name.trim()}
            className="flex-1 bg-gradient-to-r from-[#00BFA6] to-[#2962FF] hover:shadow-lg hover:shadow-[#00BFA6]/25 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditSkillModal;