import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { difficultyLevels } from '../data/mock';
import { categoriesAPI, settingsAPI } from '../services/api';
import IconPicker from './IconPicker';

const AddSkillModal = ({ isOpen, onClose, categories, onConfirm }) => {
  const [skillData, setSkillData] = useState({
    name: '',
    category_id: '',
    difficulty: 'easy',
    icon: '🎯',
    description: ''
  });
  
  const [predefinedCategories, setPredefinedCategories] = useState([]);
  const [userSettings, setUserSettings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);

  // Load user settings and predefined categories when modal opens
  useEffect(() => {
    if (isOpen) {
      loadData();
      // Reset form when opening
      setSkillData({
        name: '',
        category_id: '',
        difficulty: 'easy',
        icon: '🎯',
        description: ''
      });
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
    } catch (error) {
      console.error('Failed to load data:', error);
      // Fallback to default values on error
      setUserSettings({ use_predefined_categories: true });
      setPredefinedCategories([]);
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

  // Use only user categories since they already include predefined ones created during registration
  // No need to combine predefined and custom categories as they're already combined in the user's categories
  const getAllAvailableCategories = () => {
    return categories || [];
  };

  const availableCategories = getAllAvailableCategories();

  return (
    <>
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

            {/* Category Selection - Fixed to show all categories */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-[#00BFA6]">
                  Category *
                </label>
                <div className="text-xs text-gray-400">
                  {availableCategories.length} available
                </div>
              </div>
              
              {loading ? (
                <div className="w-full py-2 px-3 bg-[#1E1E2F]/50 border border-[#00BFA6]/20 rounded-lg text-gray-400">
                  Loading categories...
                </div>
              ) : availableCategories.length === 0 ? (
                <div className="w-full py-2 px-3 bg-[#1E1E2F]/50 border border-red-500/20 rounded-lg text-red-400">
                  ⚠️ No categories available. Please create a category first.
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
              
              <p className="text-xs text-gray-400 mt-1">
                💡 You can add skills to both predefined and custom categories
              </p>
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
              {/* Icon with Picker */}
              <div className="flex-1">
                <label className="block text-sm font-semibold text-[#00BFA6] mb-2">
                  Icon
                </label>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowIconPicker(true)}
                    className="w-12 h-12 bg-[#1E1E2F]/50 border border-[#00BFA6]/20 rounded-lg text-2xl flex items-center justify-center hover:border-[#00BFA6]/40 transition-all duration-300"
                  >
                    {skillData.icon}
                  </button>
                  <input
                    type="text"
                    value={skillData.icon}
                    onChange={(e) => handleInputChange('icon', e.target.value)}
                    className="flex-1 py-2 px-3 bg-[#1E1E2F]/50 border border-[#00BFA6]/20 rounded-lg text-white text-center focus:outline-none focus:border-[#00BFA6]/60 focus:ring-2 focus:ring-[#00BFA6]/20"
                    placeholder="🎯"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">Click icon to browse 50+ options</p>
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

      {/* Icon Picker Modal */}
      <IconPicker
        isOpen={showIconPicker}
        onClose={() => setShowIconPicker(false)}
        onSelectIcon={(icon) => handleInputChange('icon', icon)}
        currentIcon={skillData.icon}
      />
    </>
  );
};

export default AddSkillModal;