import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import AuthLayout from '../components/AuthLayout';
import { Loader2, ArrowRight } from 'lucide-react';

export const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);

      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      if (!response.ok) {
        let errorMsg = 'Login failed';
        try {
          const errorData = await response.json();
          errorMsg = errorData.detail || errorMsg;
        } catch {
          // Ignore JSON parse error, fallback to default
        }
        throw new Error(errorMsg);
      }

      const data = await response.json();
      
      const meResponse = await fetch('/auth/me', {
        headers: {
          'Authorization': `Bearer ${data.access_token}`
        }
      });

      if (!meResponse.ok) {
        throw new Error('Failed to fetch user profile');
      }

      const user = await meResponse.json();

      setAuth(data.access_token, user);
      navigate('/chat');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Login failed');
      } else {
        setError('Login failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Welcome Back" 
      subtitle="登录您的账户以继续深入研究"
    >
      <form onSubmit={handleLogin} className="space-y-6 font-['Poppins']">
        {error && (
          <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-xl text-red-400 text-sm font-medium animate-in fade-in slide-in-from-top-2">
            {error}
          </div>
        )}
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#e8e6dc]">Username</label>
          <input
            type="text"
            className="w-full px-4 py-3 bg-[#141413] border border-[#b0aea5]/30 rounded-xl focus:ring-2 focus:ring-[#d97757]/50 focus:border-[#d97757] outline-none transition-all text-white placeholder:text-[#b0aea5]/40"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#e8e6dc]">Password</label>
          <input
            type="password"
            className="w-full px-4 py-3 bg-[#141413] border border-[#b0aea5]/30 rounded-xl focus:ring-2 focus:ring-[#d97757]/50 focus:border-[#d97757] outline-none transition-all text-white placeholder:text-[#b0aea5]/40"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="group relative w-full flex items-center justify-center px-4 py-3.5 bg-gradient-to-r from-[#d97757] to-[#e0896b] hover:from-[#e0896b] hover:to-[#e89c82] text-[#141413] font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(217,119,87,0.2)] hover:shadow-[0_0_30px_rgba(217,119,87,0.4)] disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <div className="absolute inset-0 w-full h-full bg-white/20 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
              <span>Sign In</span>
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>

        <p className="text-center text-[#b0aea5] mt-8 text-sm">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#d97757] font-semibold hover:underline decoration-[#d97757]/30 underline-offset-4 transition-all">
            Apply for Beta
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};