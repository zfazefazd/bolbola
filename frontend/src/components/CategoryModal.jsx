import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import IconPicker from './IconPicker';

const CategoryModal = ({ isOpen, onClose, onConfirm, category = null }) => {
  const [categoryData, setCategoryData] = useState({
    name: category?.name || '',
    icon: category?.icon || '📂',
    color: category?.color || '#00BFA6',
    description: category?.description || ''
  });
  
  const [showIconPicker, setShowIconPicker] = useState(false);

  const handleSubmit = () => {
    if (categoryData.name.trim()) {
      onConfirm(categoryData);
      setCategoryData({
        name: '',
        icon: '📂',
        color: '#00BFA6',
        description: ''
      });
      onClose();
    }
  };

  const handleInputChange = (field, value) => {
    setCategoryData(prev => ({ ...prev, [field]: value }));
  };

  const colorOptions = [
    '#00BFA6', '#2962FF', '#BB86FC', '#FFD54F', '#FF6B6B', '#9C27B0',
    '#4CAF50', '#FF9800', '#F44336', '#3F51B5', '#009688', '#795548',
    '#607D8B', '#E91E63', '#CDDC39', '#FFC107', '#8BC34A', '#FF5722'
  ];

  // Reset form when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setCategoryData({
        name: category?.name || '',
        icon: category?.icon || '📂',
        color: category?.color || '#00BFA6',
        description: category?.description || ''
      });
    }
  }, [isOpen, category]);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-gradient-to-br from-[#1E1E2F] to-[#2A2A3F] border-[#00BFA6]/20 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center font-[Montserrat] uppercase tracking-wide">
              {category ? '✏️ Edit Category' : '📁 Add New Category'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-6 space-y-4">
            {/* Category Name */}
            <div>
              <label className="block text-sm font-semibold text-[#00BFA6] mb-2">
                Category Name *
              </label>
              <input
                type="text"
                value={categoryData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full py-2 px-3 bg-[#1E1E2F]/50 border border-[#00BFA6]/20 rounded-lg text-white focus:outline-none focus:border-[#00BFA6]/60 focus:ring-2 focus:ring-[#00BFA6]/20"
                placeholder="e.g., Programming, Fitness, Art"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-[#00BFA6] mb-2">
                Description
              </label>
              <textarea
                value={categoryData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full py-2 px-3 bg-[#1E1E2F]/50 border border-[#00BFA6]/20 rounded-lg text-white focus:outline-none focus:border-[#00BFA6]/60 focus:ring-2 focus:ring-[#00BFA6]/20 h-20 resize-none"
                placeholder="Brief description of this category"
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
                    style={{ backgroundColor: `${categoryData.color}20` }}
                  >
                    {categoryData.icon}
                  </button>
                  <input
                    type="text"
                    value={categoryData.icon}
                    onChange={(e) => handleInputChange('icon', e.target.value)}
                    className="flex-1 py-2 px-3 bg-[#1E1E2F]/50 border border-[#00BFA6]/20 rounded-lg text-white text-center focus:outline-none focus:border-[#00BFA6]/60 focus:ring-2 focus:ring-[#00BFA6]/20"
                    placeholder="📂"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">Click the icon to browse options</p>
              </div>
              
              {/* Color Picker */}
              <div className="flex-1">
                <label className="block text-sm font-semibold text-[#00BFA6] mb-2">
                  Color
                </label>
                <div>
                  <div
                    className="w-full h-12 rounded-lg border border-[#00BFA6]/20 mb-2 cursor-pointer flex items-center justify-center text-white font-semibold"
                    style={{ backgroundColor: categoryData.color }}
                  >
                    {categoryData.color}
                  </div>
                  <div className="grid grid-cols-6 gap-1">
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        onClick={() => handleInputChange('color', color)}
                        className={`w-6 h-6 rounded border-2 transition-all duration-300 ${
                          categoryData.color === color
                            ? 'border-white scale-110'
                            : 'border-transparent hover:scale-105'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="bg-gradient-to-r from-[#00BFA6]/10 to-[#2962FF]/10 border border-[#00BFA6]/20 rounded-xl p-3">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
                    style={{ backgroundColor: `${categoryData.color}30`, border: `2px solid ${categoryData.color}` }}
                  >
                    {categoryData.icon}
                  </div>
                  <span className="font-bold" style={{ color: categoryData.color }}>
                    {categoryData.name || 'Category Name'}
                  </span>
                </div>
                <p className="text-xs text-gray-400">Preview of how your category will look</p>
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
              onClick={handleSubmit}
              disabled={!categoryData.name.trim()}
              className="flex-1 bg-gradient-to-r from-[#00BFA6] to-[#2962FF] hover:shadow-lg hover:shadow-[#00BFA6]/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {category ? 'Update Category' : 'Add Category'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Icon Picker Modal */}
      <IconPicker
        isOpen={showIconPicker}
        onClose={() => setShowIconPicker(false)}
        onSelectIcon={(icon) => handleInputChange('icon', icon)}
        currentIcon={categoryData.icon}
      />
    </>
  );
};

export default CategoryModal;