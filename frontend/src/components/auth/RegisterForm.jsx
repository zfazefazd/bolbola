import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { useAuth } from '../../context/AuthContext';

const RegisterForm = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    avatar: '🌟'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const avatarOptions = ['🌟', '🚀', '⚡', '🎯', '💎', '🏆', '🎮', '🦸‍♂️', '🦸‍♀️', '🧙‍♂️', '🧙‍♀️', '🔥'];

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError('');
  };

  const handleAvatarSelect = (avatar) => {
    setFormData(prev => ({ ...prev, avatar }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!formData.username || !formData.email || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (formData.username.length < 3) {
      setError('Username must be at least 3 characters long');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    const result = await register(
      formData.username,
      formData.email,
      formData.password,
      formData.avatar
    );
    
    if (!result.success) {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <Card className="bg-gradient-to-br from-[#1E1E2F]/90 to-[#2A2A3F]/90 backdrop-blur-lg border-[#00BFA6]/20 rounded-2xl p-8 w-full max-w-md">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">{formData.avatar}</div>
        <h1 className="text-3xl font-bold text-white font-[Montserrat] uppercase tracking-wide mb-2">
          Join the Quest
        </h1>
        <p className="text-gray-400">Start your galactic adventure</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-500/20 border border-red-500/40 rounded-lg p-3 text-red-300 text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-[#00BFA6] mb-2">
            Choose Your Avatar
          </label>
          <div className="grid grid-cols-6 gap-2">
            {avatarOptions.map((avatar) => (
              <button
                key={avatar}
                type="button"
                onClick={() => handleAvatarSelect(avatar)}
                className={`p-2 rounded-lg text-2xl transition-all duration-300 hover:scale-110 ${
                  formData.avatar === avatar
                    ? 'bg-gradient-to-r from-[#00BFA6] to-[#2962FF] shadow-lg shadow-[#00BFA6]/25'
                    : 'bg-[#1E1E2F]/50 border border-[#00BFA6]/20 hover:border-[#00BFA6]/40'
                }`}
                disabled={loading}
              >
                {avatar}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#00BFA6] mb-2">
            Username
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full py-3 px-4 bg-[#1E1E2F]/50 border border-[#00BFA6]/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#00BFA6]/60 focus:ring-2 focus:ring-[#00BFA6]/20 transition-all duration-300"
            placeholder="Choose a username"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#00BFA6] mb-2">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full py-3 px-4 bg-[#1E1E2F]/50 border border-[#00BFA6]/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#00BFA6]/60 focus:ring-2 focus:ring-[#00BFA6]/20 transition-all duration-300"
            placeholder="Enter your email"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#00BFA6] mb-2">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full py-3 px-4 bg-[#1E1E2F]/50 border border-[#00BFA6]/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#00BFA6]/60 focus:ring-2 focus:ring-[#00BFA6]/20 transition-all duration-300"
            placeholder="Create a password"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#00BFA6] mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full py-3 px-4 bg-[#1E1E2F]/50 border border-[#00BFA6]/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#00BFA6]/60 focus:ring-2 focus:ring-[#00BFA6]/20 transition-all duration-300"
            placeholder="Confirm your password"
            disabled={loading}
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-[#00BFA6] to-[#2962FF] text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-[#00BFA6]/25 transition-all duration-300 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              <span>Creating Account...</span>
            </div>
          ) : (
            'Create Account'
          )}
        </Button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-gray-400 text-sm">
          Already have an account?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-[#00BFA6] hover:text-[#00BFA6]/80 font-semibold transition-colors duration-300"
          >
            Sign In
          </button>
        </p>
      </div>
    </Card>
  );
};

export default RegisterForm;