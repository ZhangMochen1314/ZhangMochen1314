import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { Loader2, Sparkles } from 'lucide-react';

import { ThemeConfig } from '@/config/themes';

export const Register: React.FC<{ themeConfig?: ThemeConfig }> = ({ themeConfig }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const t = themeConfig || {
    bgClass: '${t.bgClass}',
    bgHex: '#141413',
    trailRgba: 'rgba(20, 20, 19, 0.3)',
    textBase: 'text-[#faf9f5]',
    textMuted: '${t.textMuted}',
    accent1: 'text-[#d97757]', 
    accent2: '${t.accent2}', 
    accent3: 'text-[#788c5d]', 
    accent1From: 'from-[#d97757]',
    accent1To: 'to-[#e0896b]',
    accent1Bg: 'bg-[#d97757]',
    accent2Bg: 'bg-[#6a9bcc]',
    accent1Border: 'border-[#d97757]',
    accent2Border: 'border-[#6a9bcc]',
    fontTitle: "font-['Poppins']",
    fontBody: "font-['Lora']",
    particleColors: ['#d97757', '#6a9bcc', '#b0aea5'],
    lineRgbaPrefix: '176, 174, 165',
    accent1Shadow: 'shadow-[0_0_30px_rgba(217,119,87,0.4)]',
    accent1HoverShadow: 'hover:shadow-[0_0_40px_rgba(217,119,87,0.6)]'
  };
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) {
      setError('请阅读并同意《服务条款》与《隐私政策》');
      return;
    }
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
      <form onSubmit={handleRegister} className={`space-y-5 ${t.fontTitle}`}>
        {error && (
          <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-xl text-red-400 text-sm font-medium animate-in fade-in slide-in-from-top-2">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className={`block text-sm font-medium ${t.textBase}`}>Username</label>
            <input
              type="text"
              className={`w-full px-4 py-3 ${t.bgClass} border ${t.textMuted.replace('text-', 'border-')}/30 rounded-xl focus:ring-2 focus:ring-${t.accent1.replace('text-', '')}/50 focus:${t.accent1Border} outline-none transition-all ${t.textBase} placeholder:${t.textMuted}/40`}
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className={`block text-sm font-medium ${t.textBase}`}>Invite Code</label>
            <span className={`text-xs ${t.textMuted}`}>加微信 <strong className="text-white select-all">MoChen11-20</strong> 获取</span>
          </div>
          <input
              type="text"
              className={`w-full px-4 py-3 ${t.accent1Bg}/10 border ${t.accent1Border}/30 rounded-xl focus:ring-2 focus:ring-${t.accent1.replace('text-', '')}/50 focus:${t.accent1Border} outline-none transition-all ${t.accent1} placeholder:${t.accent1}/40 font-mono tracking-wider`}
              placeholder="e.g. DEEP2026"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className={`block text-sm font-medium ${t.textBase}`}>Email Address</label>
          <input
            type="email"
            className={`w-full px-4 py-3 ${t.bgClass} border ${t.textMuted.replace('text-', 'border-')}/30 rounded-xl focus:ring-2 focus:ring-${t.accent1.replace('text-', '')}/50 focus:${t.accent1Border} outline-none transition-all ${t.textBase} placeholder:${t.textMuted}/40`}
            placeholder="you@university.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <label className={`block text-sm font-medium ${t.textBase}`}>Password</label>
          <input
            type="password"
            className={`w-full px-4 py-3 ${t.bgClass} border ${t.textMuted.replace('text-', 'border-')}/30 rounded-xl focus:ring-2 focus:ring-${t.accent1.replace('text-', '')}/50 focus:${t.accent1Border} outline-none transition-all ${t.textBase} placeholder:${t.textMuted}/40`}
            placeholder="Create a strong password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <div className="flex items-start space-x-3 mt-4">
          <div className="flex items-center h-5">
            <input
              id="terms"
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className={`w-4 h-4 rounded border-${t.accent1.replace('text-', '')} text-${t.accent1.replace('text-', '')} focus:ring-${t.accent1.replace('text-', '')} bg-transparent cursor-pointer`}
            />
          </div>
          <label htmlFor="terms" className={`text-xs ${t.textMuted} leading-tight`}>
            我已阅读并同意 <a href="#" className={`${t.accent1} hover:underline`}>《服务条款》</a> 与 <a href="#" className={`${t.accent1} hover:underline`}>《隐私政策》</a>。我了解本产品由 AI 驱动，分析结果仅供参考，不构成绝对的学术/商业决策依据；我承诺上传的数据不会用于非法用途。
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading || !agreeTerms}
          className={`group relative w-full flex items-center justify-center px-4 py-3.5 mt-2 bg-gradient-to-r ${t.accent2Bg.replace('bg-', 'from-')} ${t.accent2Bg.replace('bg-', 'to-')} hover:${t.accent2Bg.replace('bg-', 'from-')} hover:${t.accent2Bg.replace('bg-', 'to-')} text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden`}
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

        <p className={`text-center ${t.textMuted} mt-8 text-sm`}>
          Already invited?{' '}
          <Link to="/login" className={`${t.accent2} font-semibold hover:underline decoration-${t.accent2.replace('text-', '')}/30 underline-offset-4 transition-all`}>
            Sign In here
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};