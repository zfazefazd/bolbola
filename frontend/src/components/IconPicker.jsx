import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';

// 50+ icon options organized by categories
const iconCategories = [
  {
    name: 'Learning & Education',
    icons: ['📚', '📖', '✏️', '📝', '🧠', '🎓', '💡', '🔬', '🧪', '📊', '💻', '⌨️', '🖥️', '📱']
  },
  {
    name: 'Sports & Fitness',
    icons: ['💪', '🏃‍♂️', '🏃‍♀️', '🚴‍♂️', '🚴‍♀️', '🏋️‍♂️', '🏋️‍♀️', '🤸‍♂️', '🤸‍♀️', '🏊‍♂️', '🏊‍♀️', '⚽', '🏀', '🎾', '🏈', '⚾', '🏐', '🏓', '🥊', '🥋']
  },
  {
    name: 'Creative Arts',
    icons: ['🎨', '🖌️', '✏️', '🖍️', '🎭', '🎪', '🎬', '📷', '📸', '🎵', '🎶', '🎸', '🎹', '🎤', '🎺', '🎻', '🥁']
  },
  {
    name: 'Work & Productivity',
    icons: ['💼', '📋', '📈', '📉', '⚡', '🎯', '⏰', '⏱️', '📅', '📆', '🗓️', '✅', '📌', '📎', '🖇️']
  },
  {
    name: 'Health & Wellness',
    icons: ['🧘‍♂️', '🧘‍♀️', '☯️', '🕯️', '💊', '🩺', '❤️', '💚', '😌', '😊', '🌿', '🌱', '🍃', '🌺', '🌸']
  },
  {
    name: 'Social & Communication',
    icons: ['🤝', '👥', '🗣️', '💬', '📞', '📧', '✉️', '🎉', '🎊', '🤗', '👋', '🙏', '❤️', '💝', '🎁']
  },
  {
    name: 'Travel & Adventure',
    icons: ['✈️', '🚗', '🚲', '🚶‍♂️', '🚶‍♀️', '🧭', '🗺️', '🏔️', '🏕️', '🏖️', '🌍', '🌎', '🌏', '🎒', '📍']
  },
  {
    name: 'Food & Cooking',
    icons: ['🍳', '👨‍🍳', '👩‍🍳', '🥘', '🍽️', '🍴', '🔪', '🥄', '🍕', '🍔', '🥗', '🍜', '☕', '🍷', '🧑‍🍳']
  },
  {
    name: 'Hobbies & Games',
    icons: ['🎮', '🕹️', '🎲', '🃏', '♟️', '🧩', '🎯', '🎪', '🎠', '🎡', '🎢', '🎰', '🎳', '🎱', '🪀']
  },
  {
    name: 'Nature & Environment',
    icons: ['🌳', '🌲', '🌴', '🌵', '🌿', '🍀', '🌾', '🌻', '🌹', '🌷', '🌺', '🌸', '🦋', '🐝', '🌊']
  }
];

const IconPicker = ({ isOpen, onClose, onSelectIcon, currentIcon }) => {
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredIcons = iconCategories[selectedCategory].icons.filter(icon => {
    if (!searchTerm) return true;
    // Simple search by category name or visual similarity
    return iconCategories[selectedCategory].name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleIconSelect = (icon) => {
    onSelectIcon(icon);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-br from-[#1E1E2F] to-[#2A2A3F] border-[#00BFA6]/20 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center font-[Montserrat] uppercase tracking-wide">
            🎨 Choose an Icon
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          {/* Search */}
          <div>
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2 px-3 bg-[#1E1E2F]/50 border border-[#00BFA6]/20 rounded-lg text-white focus:outline-none focus:border-[#00BFA6]/60 focus:ring-2 focus:ring-[#00BFA6]/20"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {iconCategories.map((category, index) => (
              <button
                key={index}
                onClick={() => setSelectedCategory(index)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-300 ${
                  selectedCategory === index
                    ? 'bg-gradient-to-r from-[#00BFA6] to-[#2962FF] text-white'
                    : 'bg-[#1E1E2F]/50 border border-[#00BFA6]/20 text-[#00BFA6] hover:border-[#00BFA6]/40'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Current Icon */}
          {currentIcon && (
            <div className="text-center">
              <p className="text-sm text-gray-400 mb-2">Current icon:</p>
              <div className="text-4xl">{currentIcon}</div>
            </div>
          )}

          {/* Icon Grid */}
          <div className="grid grid-cols-8 gap-3 max-h-64 overflow-y-auto">
            {filteredIcons.map((icon, index) => (
              <button
                key={index}
                onClick={() => handleIconSelect(icon)}
                className={`w-12 h-12 rounded-lg text-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                  currentIcon === icon
                    ? 'bg-gradient-to-r from-[#00BFA6] to-[#2962FF] shadow-lg shadow-[#00BFA6]/25'
                    : 'bg-[#1E1E2F]/50 border border-[#00BFA6]/20 hover:border-[#00BFA6]/40'
                }`}
              >
                {icon}
              </button>
            ))}
          </div>

          {/* Custom Input */}
          <div className="border-t border-[#00BFA6]/20 pt-4">
            <p className="text-sm text-gray-400 mb-2">Or enter a custom emoji:</p>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="🎯"
                maxLength="2"
                className="flex-1 py-2 px-3 bg-[#1E1E2F]/50 border border-[#00BFA6]/20 rounded-lg text-white text-center focus:outline-none focus:border-[#00BFA6]/60 focus:ring-2 focus:ring-[#00BFA6]/20"
                onChange={(e) => {
                  if (e.target.value.length > 0) {
                    handleIconSelect(e.target.value);
                  }
                }}
              />
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
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IconPicker;