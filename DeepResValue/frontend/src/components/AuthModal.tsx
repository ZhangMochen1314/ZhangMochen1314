import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, KeyRound, Loader2, Sparkles } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useNavigate } from 'react-router-dom';

export default function AuthModal() {
  const { isAuthModalOpen, authModalMode, closeAuthModal, openAuthModal, login } = useAuthStore();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isAuthModalOpen) return null;

  const isLogin = authModalMode === 'login';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || '登录失败');

        // Fetch user details
        const meRes = await fetch('/api/auth/me', {
          headers: { 'Authorization': `Bearer ${data.access_token}` }
        });
        if (meRes.ok) {
          const userData = await meRes.json();
          login(data.access_token, userData);
          navigate('/dashboard');
        }
      } else {
        if (!inviteCode) {
          throw new Error('请输入邀请码');
        }
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password, invite_code: inviteCode })
        });
        
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || '注册失败');

        // Login after register
        const loginRes = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        if (loginRes.ok) {
          const loginData = await loginRes.json();
          login(loginData.access_token, data);
          navigate('/dashboard');
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeAuthModal}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Modal */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-slate-950/80 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_0_60px_rgba(0,0,0,0.8)] overflow-hidden"
        >
          {/* Header */}
          <div className="px-8 py-8 border-b border-white/5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#6a9bcc]/10 to-[#d97757]/10 pointer-events-none"></div>
            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-white font-serif mb-2">
                {isLogin ? '欢迎回来' : '开启研究新纪元'}
              </h2>
              <p className="text-sm text-slate-400 font-light">
                {isLogin ? '登录您的 DeepResValue 账号' : '使用邀请码注册，即赠 50 算力积分'}
              </p>
            </div>
            <button 
              onClick={closeAuthModal}
              className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white hover:bg-white/10 rounded-full transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            {error && (
              <div className="p-4 bg-red-950/40 border border-red-500/30 text-red-400 text-sm rounded-xl backdrop-blur-sm flex items-start">
                <span className="mr-2">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">用户名</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-500 group-focus-within:text-[#6a9bcc] transition-colors" />
                  </div>
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="block w-full pl-12 pr-4 py-3.5 bg-black/40 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-[#6a9bcc]/50 focus:border-[#6a9bcc] transition-all placeholder:text-slate-600 shadow-inner"
                    placeholder="输入您的用户名"
                  />
                </div>
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">邮箱</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-[#6a9bcc] transition-colors" />
                    </div>
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="block w-full pl-12 pr-4 py-3.5 bg-black/40 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-[#6a9bcc]/50 focus:border-[#6a9bcc] transition-all placeholder:text-slate-600 shadow-inner"
                      placeholder="输入您的邮箱"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">密码</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-[#6a9bcc] transition-colors" />
                  </div>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="block w-full pl-12 pr-4 py-3.5 bg-black/40 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-[#6a9bcc]/50 focus:border-[#6a9bcc] transition-all placeholder:text-slate-600 shadow-inner"
                    placeholder="输入您的密码"
                  />
                </div>
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-xs font-bold text-[#d97757] uppercase tracking-wider mb-2 flex items-center">
                    <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                    内测邀请码 (必填)
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <KeyRound className="h-5 w-5 text-slate-500 group-focus-within:text-[#d97757] transition-colors" />
                    </div>
                    <input 
                      type="text" 
                      value={inviteCode}
                      onChange={(e) => setInviteCode(e.target.value)}
                      required
                      className="block w-full pl-12 pr-4 py-3.5 bg-black/40 border border-[#d97757]/30 rounded-xl text-white focus:ring-2 focus:ring-[#d97757]/50 focus:border-[#d97757] transition-all placeholder:text-slate-600 uppercase shadow-inner"
                      placeholder="例如: DEEP-BETA"
                    />
                  </div>
                  <p className="mt-2 text-xs text-[#d97757]/80 font-light">使用有效邀请码注册，即可获赠 50 初始积分！</p>
                </div>
              )}
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 px-4 bg-gradient-to-r from-[#6a9bcc] to-[#d97757] text-white font-bold rounded-xl hover:shadow-[0_0_20px_rgba(217,119,87,0.4)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d97757] focus:ring-offset-slate-950 transition-all flex justify-center items-center mt-8 disabled:opacity-70 hover:scale-[1.02]"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isLogin ? '登录' : '注册并领取积分')}
            </button>

            <div className="mt-8 text-center text-sm text-slate-500 border-t border-white/5 pt-6">
              {isLogin ? (
                <>
                  没有账号？{' '}
                  <button type="button" onClick={() => openAuthModal('register')} className="text-[#6a9bcc] font-bold hover:text-white transition-colors border-b border-transparent hover:border-white">
                    使用邀请码注册
                  </button>
                </>
              ) : (
                <>
                  已有账号？{' '}
                  <button type="button" onClick={() => openAuthModal('login')} className="text-[#6a9bcc] font-bold hover:text-white transition-colors border-b border-transparent hover:border-white">
                    直接登录
                  </button>
                </>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
