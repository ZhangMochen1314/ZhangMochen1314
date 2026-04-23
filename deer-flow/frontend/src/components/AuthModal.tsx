import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { BrainCircuit, ArrowRight, Loader2, Sparkles, Ticket, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AuthModal() {
  const { showAuthModal, setShowAuthModal, setAuth } = useStore();
  const [isLogin, setIsLogin] = useState(true);
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
    }
  }, [showAuthModal]);

  if (!showAuthModal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const body = isLogin 
        ? { email, password }
        : { email, password, invite_code: inviteCode };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

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
        className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
      >
        <motion.div 
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-white dark:bg-slate-950 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
        >
          {/* Close Button */}
          <button 
            onClick={() => setShowAuthModal(false)}
            className="absolute top-4 right-4 z-20 p-2 bg-white/10 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500 dark:text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left Panel: Hero / Branding */}
          <div className="relative hidden md:flex flex-col justify-between w-1/2 bg-slate-950 overflow-hidden border-r border-white/5 p-10">
            <div className="absolute inset-0 z-0">
              <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/30 rounded-full blur-[100px] mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
              <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-600/20 rounded-full blur-[100px] mix-blend-screen animate-pulse" style={{ animationDuration: '10s' }} />
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)]" />
            </div>

            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center space-x-3 text-white">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <BrainCircuit className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-extrabold tracking-tight">DeepResValue</span>
              </div>

              <div className="mt-auto mb-8">
                <h1 className="text-4xl font-bold text-white tracking-tight leading-[1.1] mb-4">
                  {isLogin ? 'Empower your' : 'Join the'}<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                    {isLogin ? 'research journey.' : 'inner circle.'}
                  </span>
                </h1>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {isLogin 
                    ? 'Your intelligent co-pilot for literature review, data analysis, and spatial econometrics.' 
                    : 'Use your exclusive invite code to unlock initial credits and start your AI-powered research instantly.'}
                </p>
              </div>
            </div>
          </div>

          {/* Right Panel: Form */}
          <div className="flex-1 p-8 md:p-10 relative bg-white dark:bg-slate-900">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                {isLogin ? '欢迎回来' : '加入内测'}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
                {isLogin ? '输入您的账户信息继续访问' : '凭邀请码解锁初始积分并体验'}
              </p>
            </div>
            
            {error && (
              <div className="mb-6 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium border border-red-100 dark:border-red-900/50">
                {error}
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  邮箱地址
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                  placeholder="name@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    密码
                  </label>
                  {isLogin && (
                    <a href="#" className="text-xs font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 transition-colors">
                      忘记密码？
                    </a>
                  )}
                </div>
                <input
                  type="password"
                  required
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {!isLogin && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                  <label className="flex items-center space-x-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 mt-5">
                    <Ticket className="w-4 h-4 text-purple-500" />
                    <span>专属邀请码</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all font-mono tracking-widest uppercase"
                    placeholder="输入 8 位邀请码"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                  />
                </motion.div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex items-center justify-center space-x-2 py-3 px-4 mt-6 border border-transparent text-sm font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 transition-all overflow-hidden shadow-md"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>{isLogin ? '立即登录' : '兑换并注册'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
              
              <div className="pt-4 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError('');
                  }}
                  className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {isLogin ? '没有账号？使用邀请码注册' : '已有账号？直接登录'}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}