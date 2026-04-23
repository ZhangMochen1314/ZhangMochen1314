import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { BrainCircuit, ArrowRight, Loader2, Sparkles, Ticket, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AlgorithmicBackground from './AlgorithmicBackground';

export default function AuthModal() {
  const { showAuthModal, setShowAuthModal, setAuth } = useStore();
  const [isLogin, setIsLogin] = useState(true);
  const [isReset, setIsReset] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!showAuthModal) {
      // Reset state when closed
      setError('');
      setEmail('');
      setPassword('');
      setInviteCode('');
      setIsReset(false);
      setIsLogin(true);
    }
  }, [showAuthModal]);

  if (!showAuthModal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isReset) {
        const res = await fetch('/api/auth/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, new_password: password, invite_code: inviteCode }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.detail || '密码重置失败');
        }

        alert('✅ 密码重置成功，请使用新密码登录！');
        setIsReset(false);
        setIsLogin(true);
        setPassword('');
        setLoading(false);
        return;
      }

      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const body = isLogin 
        ? { email, password }
        : { email, password, invite_code: inviteCode };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const contentType = res.headers.get("content-type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        throw new Error('服务器响应异常');
      }

      if (!res.ok) {
        throw new Error(data.detail || (isLogin ? '登录失败' : '注册失败'));
      }

      setAuth(
        data.access_token, 
        { id: data.user_id, email: data.email, role: data.role || 'user', my_invite_code: data.my_invite_code },
        data.credits
      );
      setShowAuthModal(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-sans selection:bg-emerald-500/30"
      >
        <AlgorithmicBackground />
        
        <motion.div 
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="relative w-full max-w-5xl bg-slate-900/40 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden flex flex-col md:flex-row z-10"
        >
          {/* Close Button */}
          <button 
            onClick={() => setShowAuthModal(false)}
            className="absolute top-4 right-4 z-20 p-2.5 bg-white/5 hover:bg-white/10 rounded-full transition-all text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left Panel: Hero / Branding */}
          <div className="relative hidden md:flex flex-col justify-between w-1/2 p-12 border-r border-white/5">
            {/* Ambient Lighting */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px]" />
              <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center space-x-3 text-white mb-auto">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center shadow-lg">
                  <BrainCircuit className="w-5 h-5 text-emerald-400" />
                </div>
                <span className="text-2xl font-bold tracking-tighter text-white">DeepResValue</span>
              </div>

              <div className="mt-auto mb-8">
                <div className="inline-block px-3 py-1 mb-6 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold tracking-wider uppercase">
                  v2.0 Architecture
                </div>
                <h1 className="text-5xl font-extrabold text-white tracking-tight leading-[1.05] mb-6">
                  {isReset ? 'Secure your' : (isLogin ? 'Empower your' : 'Join the')}<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                    {isReset ? 'account access.' : (isLogin ? 'research journey.' : 'inner circle.')}
                  </span>
                </h1>
                <p className="text-base text-slate-400 leading-relaxed font-light">
                  {isReset
                    ? 'Use your exclusive invite code to reset your password and regain access to your workspace.'
                    : (isLogin 
                      ? 'Your intelligent co-pilot for literature review, data analysis, and spatial econometrics.' 
                      : 'Use your exclusive invite code to unlock initial credits and start your AI-powered research instantly.')}
                </p>
              </div>
            </div>
          </div>

          {/* Right Panel: Form */}
          <div className="flex-1 p-8 md:p-12 relative bg-slate-900/60 flex flex-col justify-center">
            <div className="mb-10">
              <h2 className="text-3xl font-bold text-white tracking-tight">
                {isReset ? '重置密码' : (isLogin ? '欢迎回来' : '加入内测')}
              </h2>
              <p className="text-slate-400 mt-2 text-sm font-light">
                {isReset ? '使用超级内测码重置您的密码' : (isLogin ? '输入您的账户信息继续访问' : '凭邀请码解锁初始积分并体验')}
              </p>
            </div>
            
            {error && (
              <div className="mb-8 p-4 rounded-xl bg-rose-500/10 text-rose-400 text-sm font-medium border border-rose-500/20 flex items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-3"></div>
                {error}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  邮箱地址
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all font-mono text-sm"
                  placeholder="name@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    {isReset ? '新密码' : '密码'}
                  </label>
                  {isLogin && !isReset && (
                    <button 
                      type="button" 
                      onClick={() => { setIsReset(true); setIsLogin(false); setError(''); }}
                      className="text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                      忘记密码？
                    </button>
                  )}
                </div>
                <input
                  type="password"
                  required
                  className="w-full px-4 py-3.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all font-mono text-sm"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {(!isLogin || isReset) && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                  <label className="flex items-center space-x-2 text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 mt-6">
                    <Ticket className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{isReset ? '超级内测码' : '专属邀请码'}</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-mono tracking-widest uppercase text-sm"
                    placeholder="输入 8 位邀请码"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                  />
                </motion.div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-between px-6 py-4 mt-8 border border-emerald-500/30 rounded-xl text-white bg-emerald-500/10 hover:bg-emerald-500/20 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 disabled:opacity-50 transition-all group"
              >
                <span className="font-bold tracking-wide">
                  {loading ? 'Processing...' : (isReset ? '确认重置' : (isLogin ? '立即登录' : '兑换并注册'))}
                </span>
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/40 transition-colors">
                    <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                )}
              </button>
              
              <div className="pt-6 text-center border-t border-white/5">
                <button
                  type="button"
                  onClick={() => {
                    if (isReset) {
                      setIsReset(false);
                      setIsLogin(true);
                    } else {
                      setIsLogin(!isLogin);
                    }
                    setError('');
                  }}
                  className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
                >
                  {isReset ? '记起密码了？返回登录' : (isLogin ? '没有账号？使用邀请码注册' : '已有账号？直接登录')}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}