import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { Loader2, Sparkles } from 'lucide-react';

export const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password, invite_code: inviteCode }),
      });

      if (!response.ok) {
        let errorMsg = 'Registration failed';
        try {
          const errorData = await response.json();
          errorMsg = errorData.detail || errorMsg;
        } catch {
          // Ignore JSON parse error, fallback to default
        }
        throw new Error(errorMsg);
      }

      navigate('/login');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Registration failed');
      } else {
        setError('Registration failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Request Access" 
      subtitle="加入 DeepResValue 闭门内测，开启智能数据编排"
    >
      <form onSubmit={handleRegister} className="space-y-5 font-['Poppins']">
        {error && (
          <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-xl text-red-400 text-sm font-medium animate-in fade-in slide-in-from-top-2">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#e8e6dc]">Username</label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-[#141413] border border-[#b0aea5]/30 rounded-xl focus:ring-2 focus:ring-[#d97757]/50 focus:border-[#d97757] outline-none transition-all text-white placeholder:text-[#b0aea5]/40"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#e8e6dc]">Invite Code</label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-[#d97757]/10 border border-[#d97757]/30 rounded-xl focus:ring-2 focus:ring-[#d97757]/50 focus:border-[#d97757] outline-none transition-all text-[#d97757] placeholder:text-[#d97757]/40 font-mono tracking-wider"
              placeholder="e.g. DEEP2026"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#e8e6dc]">Email Address</label>
          <input
            type="email"
            className="w-full px-4 py-3 bg-[#141413] border border-[#b0aea5]/30 rounded-xl focus:ring-2 focus:ring-[#d97757]/50 focus:border-[#d97757] outline-none transition-all text-white placeholder:text-[#b0aea5]/40"
            placeholder="you@university.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#e8e6dc]">Password</label>
          <input
            type="password"
            className="w-full px-4 py-3 bg-[#141413] border border-[#b0aea5]/30 rounded-xl focus:ring-2 focus:ring-[#d97757]/50 focus:border-[#d97757] outline-none transition-all text-white placeholder:text-[#b0aea5]/40"
            placeholder="Create a strong password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="group relative w-full flex items-center justify-center px-4 py-3.5 mt-2 bg-gradient-to-r from-[#6a9bcc] to-[#80addb] hover:from-[#80addb] hover:to-[#92bc4] text-[#141413] font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(106,155,204,0.2)] hover:shadow-[0_0_30px_rgba(106,155,204,0.4)] disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <div className="absolute inset-0 w-full h-full bg-white/20 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
              <span>Request Access</span>
              <Sparkles className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform" />
            </>
          )}
        </button>

        <p className="text-center text-[#b0aea5] mt-8 text-sm">
          Already invited?{' '}
          <Link to="/login" className="text-[#6a9bcc] font-semibold hover:underline decoration-[#6a9bcc]/30 underline-offset-4 transition-all">
            Sign In here
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};