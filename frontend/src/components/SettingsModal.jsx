import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import IconPicker from './IconPicker';
import { authAPI } from '../services/api';

const SettingsModal = ({ isOpen, onClose, user, onSave }) => {
  const [settings, setSettings] = useState({
    username: user?.username || '',
    avatar: user?.avatar || '🌟',
    usePredefinedCategories: user?.use_predefined_categories ?? true,
    notifications: true,
    autoSave: true,
    theme: 'dark',
    soundEffects: true,
    dailyGoal: 120, // minutes
    streakReminders: true
  });

  const [showIconPicker, setShowIconPicker] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleInputChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (onSave) {
      onSave(settings);
    }
    onClose();
  };

  const handleResetAllData = async () => {
    if (!showResetConfirm) {
      setShowResetConfirm(true);
      return;
    }

    try {
      setIsResetting(true);
      
      // Fix: Use the proper API service instead of direct fetch
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/reset-user-data`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        alert('✅ All data has been reset successfully! The page will refresh.');
        
        // Clear local storage and reload to refresh the app state
        localStorage.clear();
        window.location.reload();
      } else {
        const errorData = await response.json();
        alert(`❌ Failed to reset data: ${errorData.detail || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Reset error:', error);
      alert('❌ Failed to reset data. Please check your connection and try again.');
    } finally {
      setIsResetting(false);
      setShowResetConfirm(false);
    }
  };

  const avatarOptions = ['🌟', '🚀', '🎯', '⚡', '🔥', '💎', '🦄', '🌊', '🎨', '🎵', '🏆', '🌙'];

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-gradient-to-br from-[#1E1E2F] to-[#2A2A3F] border-[#00BFA6]/20 text-white max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center font-[Montserrat] uppercase tracking-wide">
              ⚙️ Settings
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-6 space-y-6">
            {/* Profile Settings */}
            <div className="bg-[#1E1E2F]/30 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-[#00BFA6] mb-4">👤 Profile Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[#00BFA6] mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={settings.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    className="w-full py-2 px-3 bg-[#1E1E2F]/50 border border-[#00BFA6]/20 rounded-lg text-white focus:outline-none focus:border-[#00BFA6]/60 focus:ring-2 focus:ring-[#00BFA6]/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#00BFA6] mb-2">
                    Avatar
                  </label>
                  <div className="flex items-center space-x-3 mb-3">
                    <button
                      onClick={() => setShowIconPicker(true)}
                      className="w-16 h-16 bg-gradient-to-r from-[#00BFA6] to-[#2962FF] rounded-lg text-3xl flex items-center justify-center hover:scale-110 transition-all duration-300"
                    >
                      {settings.avatar}
                    </button>
                    <div className="flex-1">
                      <p className="text-sm text-gray-300">Click to choose from 50+ icons</p>
                      <p className="text-xs text-gray-400">Or select from popular options below</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-6 gap-2">
                    {avatarOptions.map((avatar) => (
                      <button
                        key={avatar}
                        onClick={() => handleInputChange('avatar', avatar)}
                        className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all duration-300 ${
                          settings.avatar === avatar
                            ? 'bg-gradient-to-r from-[#00BFA6] to-[#2962FF] shadow-lg shadow-[#00BFA6]/25'
                            : 'bg-[#1E1E2F]/50 border border-[#00BFA6]/20 hover:border-[#00BFA6]/40'
                        }`}
                      >
                        {avatar}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* App Preferences */}
            <div className="bg-[#1E1E2F]/30 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-[#00BFA6] mb-4">🎮 App Preferences</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-white">Use Predefined Categories</span>
                    <p className="text-xs text-gray-400">Controls ability to create new custom categories</p>
                  </div>
                  <button
                    onClick={() => handleInputChange('usePredefinedCategories', !settings.usePredefinedCategories)}
                    className={`w-12 h-6 rounded-full transition-all duration-300 ${
                      settings.usePredefinedCategories ? 'bg-gradient-to-r from-[#00BFA6] to-[#2962FF]' : 'bg-gray-600'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                      settings.usePredefinedCategories ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white">Notifications</span>
                  <button
                    onClick={() => handleInputChange('notifications', !settings.notifications)}
                    className={`w-12 h-6 rounded-full transition-all duration-300 ${
                      settings.notifications ? 'bg-gradient-to-r from-[#00BFA6] to-[#2962FF]' : 'bg-gray-600'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                      settings.notifications ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white">Auto-save Progress</span>
                  <button
                    onClick={() => handleInputChange('autoSave', !settings.autoSave)}
                    className={`w-12 h-6 rounded-full transition-all duration-300 ${
                      settings.autoSave ? 'bg-gradient-to-r from-[#00BFA6] to-[#2962FF]' : 'bg-gray-600'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                      settings.autoSave ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white">Sound Effects</span>
                  <button
                    onClick={() => handleInputChange('soundEffects', !settings.soundEffects)}
                    className={`w-12 h-6 rounded-full transition-all duration-300 ${
                      settings.soundEffects ? 'bg-gradient-to-r from-[#00BFA6] to-[#2962FF]' : 'bg-gray-600'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                      settings.soundEffects ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white">Streak Reminders</span>
                  <button
                    onClick={() => handleInputChange('streakReminders', !settings.streakReminders)}
                    className={`w-12 h-6 rounded-full transition-all duration-300 ${
                      settings.streakReminders ? 'bg-gradient-to-r from-[#00BFA6] to-[#2962FF]' : 'bg-gray-600'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                      settings.streakReminders ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Goals & Targets */}
            <div className="bg-[#1E1E2F]/30 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-[#00BFA6] mb-4">🎯 Goals & Targets</h3>
              
              <div>
                <label className="block text-sm font-semibold text-[#00BFA6] mb-2">
                  Daily Time Goal (minutes)
                </label>
                <input
                  type="number"
                  min="15"
                  max="1440"
                  value={settings.dailyGoal}
                  onChange={(e) => handleInputChange('dailyGoal', parseInt(e.target.value) || 120)}
                  className="w-full py-2 px-3 bg-[#1E1E2F]/50 border border-[#00BFA6]/20 rounded-lg text-white focus:outline-none focus:border-[#00BFA6]/60 focus:ring-2 focus:ring-[#00BFA6]/20"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Current goal: {Math.floor(settings.dailyGoal / 60)}h {settings.dailyGoal % 60}m per day
                </p>
              </div>
            </div>

            {/* Data & Privacy */}
            <div className="bg-[#1E1E2F]/30 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-[#00BFA6] mb-4">🔒 Data & Privacy</h3>
              <div className="space-y-2 text-sm text-gray-300">
                <p>• Your data is stored securely in the cloud</p>
                <p>• No personal information is shared with third parties</p>
                <p>• You can export or reset your data at any time</p>
              </div>
            </div>

            {/* Account Actions */}
            <div className="bg-[#1E1E2F]/30 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-[#FF6B6B] mb-4">⚠️ Account Actions</h3>
              <div className="space-y-3">
                <Button
                  variant="outline" 
                  className="w-full border-[#FFD54F] text-[#FFD54F] hover:bg-[#FFD54F]/10"
                  onClick={() => alert('Export functionality coming soon!')}
                >
                  📥 Export Data
                </Button>
                <Button
                  variant="outline"
                  className={`w-full transition-all duration-300 ${
                    showResetConfirm 
                      ? 'border-red-500 bg-red-500/20 text-red-300' 
                      : 'border-[#FF6B6B] text-[#FF6B6B] hover:bg-[#FF6B6B]/10'
                  }`}
                  onClick={handleResetAllData}
                  disabled={isResetting}
                >
                  {isResetting ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-red-300/20 border-t-red-300 rounded-full animate-spin" />
                      <span>Resetting...</span>
                    </div>
                  ) : showResetConfirm ? (
                    '⚠️ Click Again to Confirm Reset'
                  ) : (
                    '🗑️ Reset All Progress'
                  )}
                </Button>
                {showResetConfirm && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                    <p className="text-red-300 text-sm text-center">
                      ⚠️ This will permanently delete all your skills, time logs, achievements, and progress. This action cannot be undone!
                    </p>
                    <Button
                      variant="outline"
                      className="w-full mt-2 border-gray-500 text-gray-400 hover:bg-gray-500/10"
                      onClick={() => setShowResetConfirm(false)}
                    >
                      Cancel Reset
                    </Button>
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
              onClick={handleSave}
              className="flex-1 bg-gradient-to-r from-[#00BFA6] to-[#2962FF] hover:shadow-lg hover:shadow-[#00BFA6]/25"
            >
              Save Settings
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Icon Picker Modal */}
      <IconPicker
        isOpen={showIconPicker}
        onClose={() => setShowIconPicker(false)}
        onSelectIcon={(icon) => handleInputChange('avatar', icon)}
        currentIcon={settings.avatar}
      />
    </>
  );
};

export default SettingsModal;