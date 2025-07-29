import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { useAuth } from '../../context/AuthContext';

const LoginForm = ({ onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    const result = await login(formData.email, formData.password);
    
    if (!result.success) {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <Card className="bg-gradient-to-br from-[#1E1E2F]/90 to-[#2A2A3F]/90 backdrop-blur-lg border-[#00BFA6]/20 rounded-2xl p-8 w-full max-w-md">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">🌟</div>
        <h1 className="text-3xl font-bold text-white font-[Montserrat] uppercase tracking-wide mb-2">
          Welcome Back
        </h1>
        <p className="text-gray-400">Continue your galactic quest</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-500/20 border border-red-500/40 rounded-lg p-3 text-red-300 text-sm">
            {error}
          </div>
        )}

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
            placeholder="Enter your password"
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
              <span>Signing In...</span>
            </div>
          ) : (
            'Sign In'
          )}
        </Button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-gray-400 text-sm">
          Don't have an account?{' '}
          <button
            onClick={onSwitchToRegister}
            className="text-[#00BFA6] hover:text-[#00BFA6]/80 font-semibold transition-colors duration-300"
          >
            Create Account
          </button>
        </p>
      </div>
    </Card>
  );
};

export default LoginForm;