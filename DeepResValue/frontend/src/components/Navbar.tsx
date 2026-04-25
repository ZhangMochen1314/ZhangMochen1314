import { Link, useLocation, useNavigate } from "react-router-dom";
import { BrainCircuit, Zap, User as UserIcon, LogOut, LayoutDashboard } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useAuthStore } from "@/store/useAuthStore";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";

export default function Navbar() {
  const points = useStore(state => state.points);
  const { user, isAuthenticated, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";
  const isChat = location.pathname.startsWith("/chat");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (isChat) return null;

  return (
    <nav className={`fixed w-full top-0 z-50 transition-colors duration-300 backdrop-blur-md border-b ${isHome ? 'bg-slate-950/80 border-white/5' : 'bg-white/80 border-slate-200'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${isHome ? 'bg-[#6a9bcc]/20 border border-[#6a9bcc]/30 group-hover:shadow-[0_0_15px_rgba(106,155,204,0.3)]' : 'bg-blue-600'}`}>
              <BrainCircuit className={`w-5 h-5 ${isHome ? 'text-[#6a9bcc]' : 'text-white'}`} />
            </div>
            <span className={`text-xl font-bold tracking-tight ${isHome ? 'text-white' : 'text-slate-900'}`}>深度研值 (DeepResValue)</span>
          </Link>
        </div>

        {isHome ? (
          <div className="hidden md:flex space-x-8">
            <a href="#features" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">核心功能</a>
            <a href="#pricing" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">定价</a>
          </div>
        ) : (
          <div className="hidden md:flex space-x-8">
            <Link to="/chat" className={`text-sm font-medium transition-colors ${location.pathname.startsWith('/chat') ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'}`}>工作区</Link>
            <Link to="/datasets" className={`text-sm font-medium transition-colors ${location.pathname.startsWith('/datasets') ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'}`}>数据中心</Link>
          </div>
        )}

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full shadow-sm border ${isHome ? 'bg-[#d97757]/10 border-[#d97757]/20 backdrop-blur-sm' : 'bg-gradient-to-r from-amber-50 to-amber-100/50 border-amber-200/60'}`}
                title="当前可用积分"
              >
                <div className={`p-1 rounded-full ${isHome ? 'bg-[#d97757]/20' : 'bg-amber-100'}`}>
                  <Zap className={`w-3.5 h-3.5 ${isHome ? 'text-[#d97757] fill-[#d97757]' : 'text-amber-500 fill-amber-500'}`} />
                </div>
                <span className={`text-sm font-bold ${isHome ? 'text-[#d97757]' : 'text-amber-700'}`}>{points.toLocaleString()}</span>
                <span className={`text-xs font-medium ${isHome ? 'text-[#d97757]/70' : 'text-amber-600/80'}`}>积分</span>
              </motion.div>

              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`focus:outline-none w-9 h-9 rounded-full flex items-center justify-center border-2 transition-colors ${isHome ? 'bg-white/5 border-white/10 hover:border-[#6a9bcc]/50 hover:bg-[#6a9bcc]/10' : 'bg-blue-100 border-blue-200 hover:border-blue-300'}`}
                >
                  <UserIcon className={`w-5 h-5 ${isHome ? 'text-slate-300' : 'text-blue-600'}`} />
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-slate-200 py-1 z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                      <p className="text-sm font-bold text-slate-900 truncate">{user?.username}</p>
                      <p className="text-xs text-slate-500 truncate mt-0.5">{user?.email}</p>
                    </div>
                    <div className="py-1">
                      <Link 
                        to="/dashboard" 
                        className="flex items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <LayoutDashboard className="mr-3 h-4 w-4" />
                        <span className="font-medium">控制台</span>
                      </Link>
                      <button 
                        onClick={() => {
                          setIsDropdownOpen(false);
                          handleLogout();
                        }}
                        className="w-full flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="mr-3 h-4 w-4" />
                        <span className="font-medium">退出登录</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {isHome ? (
                <Link to="/chat" className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-slate-900 bg-white rounded-lg hover:bg-slate-100 transition-colors shadow-sm">
                  进入工作区
                </Link>
              ) : (
                <Link to="/" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">返回首页</Link>
              )}
            </>
          ) : (
            <>
              <button onClick={() => useAuthStore.getState().openAuthModal('login')} className={`text-sm font-medium transition-colors ${isHome ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-blue-600'}`}>
                登录
              </button>
              <button onClick={() => useAuthStore.getState().openAuthModal('register')} className={`inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg transition-colors shadow-sm ${isHome ? 'text-white bg-gradient-to-r from-[#6a9bcc] to-[#d97757] hover:shadow-[0_0_15px_rgba(217,119,87,0.4)]' : 'text-white bg-blue-600 hover:bg-blue-700'}`}>
                免费注册
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}