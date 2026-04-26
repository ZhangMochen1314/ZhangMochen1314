import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, KeyRound, Loader2, Sparkles, ChevronRight } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import AuthBackground from '@/components/AuthBackground';

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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeAuthModal}
          className="absolute inset-0 bg-[#050505]/90 backdrop-blur-xl overflow-hidden"
        >
          {/* Add Algorithmic Art Background for Auth Modal */}
          <div className="absolute inset-0 opacity-60 mix-blend-screen">
            <AuthBackground />
          </div>
        </motion.div>

        {/* Modal */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 30, rotateX: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20, rotateX: -10 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          style={{ perspective: 1000 }}
          className="relative w-full max-w-md bg-[#111113]/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-[0_0_80px_rgba(0,0,0,0.8),inset_0_0_0_1px_rgba(255,255,255,0.05)] overflow-hidden"
        >
          {/* Decorative Glow */}
          <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[50%] bg-[#6a9bcc]/20 blur-[100px] pointer-events-none rounded-full mix-blend-screen"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[50%] bg-[#d97757]/20 blur-[100px] pointer-events-none rounded-full mix-blend-screen"></div>

          {/* Header */}
          <div className="px-8 pt-10 pb-6 relative z-10 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#6a9bcc]/20 to-[#d97757]/20 border border-white/10 mb-6 shadow-inner">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl font-extrabold text-white font-serif mb-3 tracking-tight">
              {isLogin ? '欢迎回来' : '开启研究新纪元'}
            </h2>
            <p className="text-slate-400 font-light">
              {isLogin ? '登录您的 DeepResValue 账号' : '使用邀请码注册，即赠 50 算力积分'}
            </p>
            <button 
              onClick={closeAuthModal}
              className="absolute top-6 right-6 p-2.5 text-slate-500 hover:text-white hover:bg-white/10 rounded-full transition-all z-10 hover:rotate-90 duration-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 pb-10 space-y-6 relative z-10">
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  className="p-4 bg-red-950/40 border border-red-500/50 text-red-400 text-sm rounded-xl backdrop-blur-sm flex items-start shadow-[0_0_20px_rgba(239,68,68,0.1)]"
                >
                  <span className="mr-3">⚠️</span>
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-5">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 pl-1">用户名</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-500 group-focus-within:text-[#6a9bcc] transition-colors" />
                  </div>
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="block w-full pl-12 pr-4 py-3.5 bg-black/40 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-[#6a9bcc]/50 focus:border-[#6a9bcc] transition-all placeholder:text-slate-600 shadow-inner outline-none"
                    placeholder="输入您的用户名"
                  />
                </div>
              </div>

              {!isLogin && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 pl-1">邮箱</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-[#6a9bcc] transition-colors" />
                    </div>
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="block w-full pl-12 pr-4 py-3.5 bg-black/40 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-[#6a9bcc]/50 focus:border-[#6a9bcc] transition-all placeholder:text-slate-600 shadow-inner outline-none"
                      placeholder="输入您的邮箱"
                    />
                  </div>
                </motion.div>
              )}

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 pl-1">密码</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-[#6a9bcc] transition-colors" />
                  </div>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="block w-full pl-12 pr-4 py-3.5 bg-black/40 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-[#6a9bcc]/50 focus:border-[#6a9bcc] transition-all placeholder:text-slate-600 shadow-inner outline-none"
                    placeholder="输入您的密码"
                  />
                </div>
              </div>

              {!isLogin && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <label className="block text-[11px] font-bold text-[#d97757] uppercase tracking-widest mb-2 pl-1 flex items-center">
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
                      className="block w-full pl-12 pr-4 py-3.5 bg-[#d97757]/5 border border-[#d97757]/30 rounded-xl text-white focus:ring-2 focus:ring-[#d97757]/50 focus:border-[#d97757] transition-all placeholder:text-slate-600 uppercase shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] outline-none"
                      placeholder="例如: DEEP-BETA"
                    />
                  </div>
                  <p className="mt-2 text-xs text-[#d97757]/80 font-light pl-1">使用有效邀请码注册，即可获赠 50 初始积分！</p>
                </motion.div>
              )}
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="group relative w-full py-4 px-4 bg-gradient-to-r from-[#6a9bcc] to-[#d97757] text-white font-bold rounded-xl hover:shadow-[0_0_30px_rgba(217,119,87,0.4)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d97757] focus:ring-offset-slate-950 transition-all flex justify-center items-center mt-8 disabled:opacity-70 hover:scale-[1.02] overflow-hidden"
            >
              <div className="absolute inset-0 w-full h-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              {loading ? <Loader2 className="w-5 h-5 animate-spin relative z-10" /> : (
                <span className="relative z-10 flex items-center tracking-wide text-lg">
                  {isLogin ? '立即登录' : '注册并领取积分'}
                  <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>

            <div className="mt-8 text-center text-sm text-slate-500 border-t border-white/5 pt-6">
              {isLogin ? (
                <>
                  没有账号？{' '}
                  <button type="button" onClick={() => openAuthModal('register')} className="text-[#6a9bcc] font-bold hover:text-white transition-colors">
                    使用邀请码注册 <span className="ml-1">→</span>
                  </button>
                </>
              ) : (
                <>
                  已有账号？{' '}
                  <button type="button" onClick={() => openAuthModal('login')} className="text-[#6a9bcc] font-bold hover:text-white transition-colors">
                    直接登录 <span className="ml-1">→</span>
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
