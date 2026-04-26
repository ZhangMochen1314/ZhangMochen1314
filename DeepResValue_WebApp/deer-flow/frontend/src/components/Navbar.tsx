import { Link, useLocation, useNavigate } from "react-router-dom";
import { BrainCircuit, Zap, User, LogOut, ChevronDown } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useAuthStore } from "@/store/useAuthStore";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function Navbar() {
  const points = useStore(state => state.points);
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";
  const isChat = location.pathname.startsWith("/chat");
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  if (isChat) return null;

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
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-50 to-amber-100/50 border border-amber-200/60 rounded-full shadow-sm"
            title="当前可用积分"
          >
            <div className="bg-amber-100 p-1 rounded-full">
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            </div>
            <span className="text-sm font-bold text-amber-700">{user?.credits ?? points.toLocaleString()}</span>
            <span className="text-xs font-medium text-amber-600/80">积分</span>
          </motion.div>

          {user ? (
            <div className="relative">
              <button 
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full transition-colors border border-slate-200"
              >
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center">
                  <User className="w-3.5 h-3.5" />
                </div>
                <span className="text-sm font-medium text-slate-700">{user.username}</span>
                <ChevronDown className="w-4 h-4 text-slate-500" />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50"
                  >
                    <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                      <p className="font-bold text-slate-800 truncate">{user.username}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>
                    <div className="p-2">
                      <div className="px-3 py-2 flex items-center justify-between text-sm">
                        <span className="text-slate-600">剩余积分</span>
                        <span className="font-bold text-amber-600">{user.credits}</span>
                      </div>
                      <div className="px-3 py-2 flex items-center justify-between text-sm">
                        <span className="text-slate-600">我的邀请码</span>
                        <span className="font-mono text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded">{user.invite_code || "无"}</span>
                      </div>
                    </div>
                    <div className="p-2 border-t border-slate-100">
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>退出登录</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            isHome ? (
              <>
                <Link to="/chat" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">工作区</Link>
                <Link to="/chat" className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors shadow-sm">
                  开始使用
                </Link>
              </>
            ) : (
              <Link to="/" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">返回首页</Link>
            )
          )}
        </div>
      </div>
    </nav>
  );
}