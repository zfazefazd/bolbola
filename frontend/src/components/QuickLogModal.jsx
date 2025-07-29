import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';

const QuickLogModal = ({ isOpen, onClose, skill, onConfirm }) => {
  const [customXP, setCustomXP] = useState('');
  const [selectedXP, setSelectedXP] = useState(null);

  const presetXPOptions = [10, 20, 50, 100];

  const handleConfirm = () => {
    const xpToAdd = selectedXP || parseInt(customXP) || 0;
    if (xpToAdd > 0) {
      onConfirm(skill, xpToAdd);
      setCustomXP('');
      setSelectedXP(null);
      onClose();
    }
  };

  const handlePresetClick = (xp) => {
    setSelectedXP(xp);
    setCustomXP('');
  };

  if (!skill) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-br from-[#1E1E2F] to-[#2A2A3F] border-[#00BFA6]/20 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center font-[Montserrat] uppercase tracking-wide">
            Log XP for {skill.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-6">
          {/* Skill Info */}
          <div className="flex items-center justify-center mb-6">
            <div className="text-6xl mb-2">{skill.icon}</div>
          </div>
          
          <div className="text-center mb-6">
            <p className="text-gray-300 mb-2">{skill.description}</p>
            <div className="flex items-center justify-center space-x-4 text-sm">
              <span className="text-[#FFD54F] font-mono">Level {skill.level}</span>
              <span className="text-[#00BFA6] font-mono">{skill.currentXP} XP</span>
              {skill.streak > 0 && (
                <span className="text-[#FF6B6B] font-mono">🔥 {skill.streak} day streak</span>
              )}
            </div>
          </div>

          {/* XP Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-center text-[#00BFA6]">How much XP did you earn?</h3>
            
            {/* Preset Buttons */}
            <div className="grid grid-cols-2 gap-3">
              {presetXPOptions.map((xp) => (
                <button
                  key={xp}
                  onClick={() => handlePresetClick(xp)}
                  className={`py-3 px-4 rounded-lg font-bold text-lg transition-all duration-300 hover:-translate-y-1 ${
                    selectedXP === xp
                      ? 'bg-gradient-to-r from-[#00BFA6] to-[#2962FF] text-white shadow-lg shadow-[#00BFA6]/25'
                      : 'bg-[#1E1E2F]/50 border border-[#00BFA6]/20 text-[#00BFA6] hover:border-[#00BFA6]/40'
                  }`}
                >
                  +{xp} XP
                </button>
              ))}
            </div>

            {/* Custom Input */}
            <div className="relative">
              <input
                type="number"
                placeholder="Enter custom XP..."
                value={customXP}
                onChange={(e) => {
                  setCustomXP(e.target.value);
                  setSelectedXP(null);
                }}
                className="w-full py-3 px-4 bg-[#1E1E2F]/50 border border-[#00BFA6]/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#00BFA6]/60 focus:ring-2 focus:ring-[#00BFA6]/20 transition-all duration-300"
                min="1"
                max="1000"
              />
              {customXP && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#00BFA6] font-bold">
                  +{customXP} XP
                </div>
              )}
            </div>
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
            disabled={!selectedXP && !customXP}
            className="flex-1 bg-gradient-to-r from-[#00BFA6] to-[#2962FF] hover:shadow-lg hover:shadow-[#00BFA6]/25 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirm +{selectedXP || customXP || 0} XP
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickLogModal;