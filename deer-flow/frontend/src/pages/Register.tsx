import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { BrainCircuit, ArrowRight, Loader2, Sparkles, Ticket } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const setAuth = useStore(state => state.setAuth);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, invite_code: inviteCode }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || '注册失败');
      }

      setAuth(
        data.access_token, 
        { id: data.user_id, email: data.email, role: data.role || 'user', my_invite_code: data.my_invite_code },
        data.credits
      );
      navigate('/chat');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white dark:bg-slate-950 font-sans selection:bg-blue-500/30">
      {/* Left Panel: Hero / Branding */}
      <div className="relative hidden lg:flex flex-col justify-between w-1/2 bg-slate-950 overflow-hidden border-r border-white/5">
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/30 rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '10s' }} />
          <div className="absolute top-[30%] left-[20%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[100px] mix-blend-screen animate-pulse" style={{ animationDuration: '12s' }} />
          
          {/* Subtle Grid Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)]" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex items-center p-12">
          <Link to="/" className="flex items-center space-x-3 text-white group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight">DeepResValue</span>
          </Link>
        </div>

        <div className="relative z-10 p-12 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight leading-[1.1] mb-6">
              Join the<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                inner circle.
              </span>
            </h1>
            <p className="text-lg text-slate-400 max-w-md leading-relaxed">
              Use your exclusive invite code to unlock initial credits and start your AI-powered research instantly.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-16 inline-flex items-center space-x-4 px-5 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md"
          >
            <div className="flex -space-x-3">
              {[1,2,3].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-slate-300" />
                </div>
              ))}
            </div>
            <div className="text-sm text-slate-300">
              <span className="text-white font-semibold block">10,000+ Researchers</span>
              Accelerating their workflows daily
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel: Register Form */}
      <div className="flex-1 flex items-center justify-center p-8 sm:p-12 relative bg-slate-50 dark:bg-slate-950">
        {/* Mobile background */}
        <div className="absolute inset-0 z-0 lg:hidden bg-slate-950 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-blue-600/20 blur-[100px]" />
        </div>

        <div className="w-full max-w-md relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-8 sm:p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-2xl border border-slate-200/60 dark:border-slate-800"
          >
            <div className="lg:hidden flex items-center justify-center space-x-3 mb-10">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <BrainCircuit className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight dark:text-white">DeepResValue</span>
            </div>

            <div className="mb-10 text-center lg:text-left">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                加入内测
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
                凭邀请码解锁初始积分并体验所有科研功能
              </p>
            </div>
            
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium border border-red-100 dark:border-red-900/50 flex items-center"
              >
                {error}
              </motion.div>
            )}

            <form className="space-y-6" onSubmit={handleRegister}>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    邮箱地址
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-3.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-sm"
                    placeholder="name@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    密码
                  </label>
                  <input
                    type="password"
                    required
                    className="w-full px-4 py-3.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-sm"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    <Ticket className="w-4 h-4 text-purple-500" />
                    <span>专属邀请码</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all shadow-sm font-mono tracking-widest uppercase"
                    placeholder="输入 8 位邀请码"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex items-center justify-center space-x-2 py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-slate-900 dark:bg-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 disabled:opacity-70 transition-all overflow-hidden shadow-lg"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 dark:via-slate-900/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>兑换邀请码并注册</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
              
              <div className="pt-4 text-center">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  已有账号？{' '}
                  <Link to="/login" className="font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors underline decoration-2 underline-offset-4 decoration-blue-500/30 hover:decoration-blue-500">
                    直接登录
                  </Link>
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}