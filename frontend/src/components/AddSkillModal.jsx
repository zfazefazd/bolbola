import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { difficultyLevels } from '../data/mock';
import { categoriesAPI, settingsAPI } from '../services/api';

const AddSkillModal = ({ isOpen, onClose, categories, onConfirm }) => {
  const [skillData, setSkillData] = useState({
    name: '',
    category_id: '',
    difficulty: 'easy',
    icon: '🎯',
    description: ''
  });
  
  const [showPredefined, setShowPredefined] = useState(true);
  const [predefinedCategories, setPredefinedCategories] = useState([]);
  const [userSettings, setUserSettings] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load user settings and predefined categories when modal opens
  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [settingsRes, predefinedRes] = await Promise.all([
        settingsAPI.get(),
        categoriesAPI.getPredefined()
      ]);
      
      setUserSettings(settingsRes.data);
      setPredefinedCategories(predefinedRes.data);
      setShowPredefined(settingsRes.data.use_predefined_categories);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (skillData.name.trim() && skillData.category_id) {
      onConfirm(skillData);
      setSkillData({
        name: '',
        category_id: '',
        difficulty: 'easy',
        icon: '🎯',
        description: ''
      });
      onClose();
    }
  };

  const handleInputChange = (field, value) => {
    setSkillData(prev => ({ ...prev, [field]: value }));
  };

  const availableCategories = showPredefined ? predefinedCategories : categories;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-br from-[#1E1E2F] to-[#2A2A3F] border-[#00BFA6]/20 text-white max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center font-[Montserrat] uppercase tracking-wide">
            🚀 Add New Skill
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-6 space-y-4">
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

          {/* Category Selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-[#00BFA6]">
                Category *
              </label>
              {userSettings && (
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-400">
                    {showPredefined ? 'Predefined' : 'Custom'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowPredefined(!showPredefined)}
                    className={`w-8 h-4 rounded-full transition-all duration-300 ${
                      showPredefined ? 'bg-gradient-to-r from-[#00BFA6] to-[#2962FF]' : 'bg-gray-600'
                    }`}
                  >
                    <div className={`w-3 h-3 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                      showPredefined ? 'translate-x-4' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>
              )}
            </div>
            
            {loading ? (
              <div className="w-full py-2 px-3 bg-[#1E1E2F]/50 border border-[#00BFA6]/20 rounded-lg text-gray-400">
                Loading categories...
              </div>
            ) : (
              <select
                value={skillData.category_id}
                onChange={(e) => handleInputChange('category_id', e.target.value)}
                className="w-full py-2 px-3 bg-[#1E1E2F]/50 border border-[#00BFA6]/20 rounded-lg text-white focus:outline-none focus:border-[#00BFA6]/60 focus:ring-2 focus:ring-[#00BFA6]/20"
              >
                <option value="">Select a category</option>
                {availableCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            )}
            
            {showPredefined && (
              <p className="text-xs text-gray-400 mt-1">
                💡 Using predefined categories. Toggle off to use your custom categories.
              </p>
            )}
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

          {/* XP Preview */}
          {skillData.difficulty && (
            <div className="bg-gradient-to-r from-[#00BFA6]/10 to-[#2962FF]/10 border border-[#00BFA6]/20 rounded-xl p-3">
              <div className="text-center text-sm">
                <span className="text-gray-300">XP Multiplier: </span>
                <span className="text-[#FFD54F] font-bold">
                  {difficultyLevels.find(d => d.id === skillData.difficulty)?.multiplier}x
                </span>
              </div>
            </div>
          )}
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
            disabled={!skillData.name.trim() || !skillData.category_id || loading}
            className="flex-1 bg-gradient-to-r from-[#00BFA6] to-[#2962FF] hover:shadow-lg hover:shadow-[#00BFA6]/25 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Skill
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddSkillModal;