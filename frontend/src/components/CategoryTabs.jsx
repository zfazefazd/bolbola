import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import CategoryModal from './CategoryModal';
import IconPicker from './IconPicker';
import { formatTime } from '../data/mock';

const CategoryTabs = ({ categories, activeCategory, onCategoryChange, skills, onAddCategory, onEditCategory }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    icon: '📂',
    color: '#00BFA6',
    description: ''
  });

  const getCategoryStats = (categoryId) => {
    const categorySkills = skills.filter(skill => skill.category_id === categoryId);
    if (categorySkills.length === 0) return { percentage: 0, totalTime: 0, totalXP: 0 };
    
    const totalTime = categorySkills.reduce((sum, skill) => sum + (skill.total_time_minutes || 0), 0);
    const totalXP = categorySkills.reduce((sum, skill) => sum + (skill.total_xp || 0), 0);
    
    // Calculate percentage based on average skill progress
    const avgLevel = categorySkills.reduce((sum, skill) => {
      const level = Math.floor((skill.total_time_minutes || 0) / 120) + 1;
      return sum + level;
    }, 0) / categorySkills.length;
    
    const percentage = Math.min((avgLevel / 10) * 100, 100); // Max at level 10 = 100%
    
    return { 
      percentage: Math.round(percentage), 
      totalTime,
      totalXP 
    };
  };

  const handleAddCategory = () => {
    if (newCategory.name.trim()) {
      onAddCategory(newCategory);
      setNewCategory({
        name: '',
        icon: '📂',
        color: '#00BFA6',
        description: ''
      });
      setIsAddModalOpen(false);
    }
  };

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };

  const handleUpdateCategory = (categoryData) => {
    onEditCategory(selectedCategory, categoryData);
    setSelectedCategory(null);
    setIsEditModalOpen(false);
  };

  return (
    <>
      <Card className="bg-[#1E1E2F]/90 backdrop-blur-lg border-[#00BFA6]/20 rounded-2xl p-4 mb-6 sticky top-4 z-10">
        <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
          {categories.map((category) => {
            const stats = getCategoryStats(category.id);
            const isActive = activeCategory === category.id;
            
            return (
              <div key={category.id} className="flex-shrink-0 group relative">
                <button
                  onClick={() => onCategoryChange(category.id)}
                  className={`p-4 rounded-xl transition-all duration-300 hover:-translate-y-1 ${
                    isActive 
                      ? 'bg-gradient-to-br from-[#00BFA6]/20 to-[#2962FF]/20 border-2 border-[#00BFA6]/40' 
                      : 'bg-[#1E1E2F]/50 border border-gray-600/20 hover:border-[#00BFA6]/30'
                  }`}
                >
                  {/* XP Ring */}
                  <div className="relative w-16 h-16 mx-auto mb-3">
                    <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                      <circle
                        cx="32" cy="32" r="28"
                        fill="none"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="4"
                      />
                      <circle
                        cx="32" cy="32" r="28"
                        fill="none"
                        stroke={category.color}
                        strokeWidth="4"
                        strokeDasharray={`${stats.percentage * 1.75} 175`}
                        strokeLinecap="round"
                        className="transition-all duration-500"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl mb-1">{category.icon}</div>
                        <div className="text-xs font-bold text-white font-mono">
                          {stats.percentage}%
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Category Name */}
                  <div className="text-center">
                    <h3 className="text-white font-bold text-sm uppercase tracking-wide font-[Montserrat]">
                      {category.name}
                    </h3>
                    <p className="text-gray-400 text-xs font-mono mt-1">
                      {formatTime(stats.totalTime)} • {stats.totalXP} XP
                    </p>
                  </div>
                </button>
                
                {/* Edit Button (show on hover) */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditCategory(category);
                  }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-[#FFD54F] hover:bg-[#FFD54F]/80 rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-all duration-300"
                  title="Edit Category"
                >
                  ✏️
                </button>
                
                {/* Hover Tooltip */}
                <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-[#1E1E2F] border border-[#00BFA6]/20 rounded-lg px-3 py-2 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-20">
                  <div className="font-bold">{formatTime(stats.totalTime)} logged</div>
                  <div className="text-[#00BFA6]">{stats.totalXP} XP earned</div>
                  <div className="text-gray-300">{category.description}</div>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-[#1E1E2F]" />
                </div>
              </div>
            );
          })}
          
          {/* Add Category Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex-shrink-0 w-24 h-24 bg-[#1E1E2F]/30 border-2 border-dashed border-[#00BFA6]/40 rounded-xl flex items-center justify-center text-[#00BFA6] hover:bg-[#00BFA6]/10 hover:border-[#00BFA6]/60 transition-all duration-300 hover:-translate-y-1 group"
          >
            <div className="text-center">
              <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">➕</div>
              <div className="text-xs font-bold">Add</div>
            </div>
          </button>
        </div>
      </Card>

      {/* Add Category Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="bg-gradient-to-br from-[#1E1E2F] to-[#2A2A3F] border-[#00BFA6]/20 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center font-[Montserrat] uppercase tracking-wide">
              Add New Category
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#00BFA6] mb-2">
                Category Name
              </label>
              <input
                type="text"
                value={newCategory.name}
                onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                className="w-full py-2 px-3 bg-[#1E1E2F]/50 border border-[#00BFA6]/20 rounded-lg text-white focus:outline-none focus:border-[#00BFA6]/60 focus:ring-2 focus:ring-[#00BFA6]/20"
                placeholder="e.g., Learning, Fitness, Hobbies"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#00BFA6] mb-2">
                Description
              </label>
              <input
                type="text"
                value={newCategory.description}
                onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                className="w-full py-2 px-3 bg-[#1E1E2F]/50 border border-[#00BFA6]/20 rounded-lg text-white focus:outline-none focus:border-[#00BFA6]/60 focus:ring-2 focus:ring-[#00BFA6]/20"
                placeholder="Brief description of this category"
              />
            </div>

            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-[#00BFA6] mb-2">
                  Icon
                </label>
                <input
                  type="text"
                  value={newCategory.icon}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, icon: e.target.value }))}
                  className="w-full py-2 px-3 bg-[#1E1E2F]/50 border border-[#00BFA6]/20 rounded-lg text-white text-center focus:outline-none focus:border-[#00BFA6]/60 focus:ring-2 focus:ring-[#00BFA6]/20"
                  placeholder="📂"
                />
              </div>
              
              <div className="flex-1">
                <label className="block text-sm font-semibold text-[#00BFA6] mb-2">
                  Color
                </label>
                <input
                  type="color"
                  value={newCategory.color}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, color: e.target.value }))}
                  className="w-full h-10 bg-[#1E1E2F]/50 border border-[#00BFA6]/20 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button
              onClick={() => setIsAddModalOpen(false)}
              variant="outline"
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-600/20"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddCategory}
              disabled={!newCategory.name.trim()}
              className="flex-1 bg-gradient-to-r from-[#00BFA6] to-[#2962FF] hover:shadow-lg hover:shadow-[#00BFA6]/25 disabled:opacity-50"
            >
              Add Category
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CategoryTabs;