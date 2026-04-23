import { Link, useLocation, useNavigate } from "react-router-dom";
import { BrainCircuit, Zap, LogOut, Ticket, Copy, CheckCircle2, ShieldCheck } from "lucide-react";
import { useStore } from "@/store/useStore";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function Navbar() {
  const { points, user, logout, setShowAuthModal } = useStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [showInvite, setShowInvite] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const isHome = location.pathname === "/";
  const isChat = location.pathname.startsWith("/chat");

  if (isChat) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const copyToClipboard = () => {
    if (user?.my_invite_code) {
      navigator.clipboard.writeText(user.my_invite_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <nav className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <BrainCircuit className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">DeepResValue</span>
          </Link>
        </div>

        {isHome ? (
          <div className="hidden md:flex space-x-8">
            <a href="#features" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">核心功能</a>
            <a href="#pricing" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">定价</a>
          </div>
        ) : (
          <div className="hidden md:flex space-x-8">
            <Link to="/chat" className={`text-sm font-medium transition-colors ${location.pathname.startsWith('/chat') ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'}`}>工作区</Link>
            <Link to="/datasets" className={`text-sm font-medium transition-colors ${location.pathname.startsWith('/datasets') ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'}`}>数据中心</Link>
          </div>
        )}

        <div className="flex items-center space-x-4">
          {user ? (
            <>
              {/* Invite Code Feature */}
              {user.my_invite_code && (
                <div className="relative">
                  <button 
                    onClick={() => setShowInvite(!showInvite)}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-600 border border-purple-200 rounded-full transition-colors text-sm font-medium"
                  >
                    <Ticket className="w-3.5 h-3.5" />
                    <span>邀请返利</span>
                  </button>

                  <AnimatePresence>
                    {showInvite && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 shadow-xl rounded-xl p-4 z-50"
                      >
                        <h4 className="text-sm font-bold text-slate-800 mb-2">您的专属拉新邀请码</h4>
                        <p className="text-xs text-slate-500 mb-4">
                          每邀请一位新用户成功注册，您将获得 <strong className="text-amber-500">100</strong> 积分奖励！
                        </p>
                        
                        <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg p-2">
                          <span className="font-mono font-bold text-lg text-slate-700 tracking-wider">
                            {user.my_invite_code}
                          </span>
                          <button 
                            onClick={copyToClipboard}
                            className="p-1.5 hover:bg-slate-200 rounded-md transition-colors text-slate-500 hover:text-slate-700"
                            title="复制邀请码"
                          >
                            {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              <div className="text-sm text-slate-500 mr-2">{user.email}</div>
              
              {user.role === 'admin' && (
                <Link to="/admin" className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-full shadow-sm transition-colors" title="管理后台">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span className="text-sm font-bold">后台</span>
                </Link>
              )}

              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-50 to-amber-100/50 border border-amber-200/60 rounded-full shadow-sm"
                title="当前可用积分"
              >
                <div className="bg-amber-100 p-1 rounded-full">
                  <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                </div>
                <span className="text-sm font-bold text-amber-700">{points.toLocaleString()}</span>
                <span className="text-xs font-medium text-amber-600/80">积分</span>
              </motion.div>
              <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100">
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button 
              onClick={() => setShowAuthModal(true)} 
              className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
            >
              登录 / 注册
            </button>
          )}

          {isHome ? (
            <>
              <Link to="/chat" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">工作区</Link>
              <Link to="/chat" className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors shadow-sm">
                开始使用
              </Link>
            </>
          ) : (
            <Link to="/" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">返回首页</Link>
          )}
        </div>
      </div>
    </nav>
  );
}