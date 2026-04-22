import { Link, useLocation } from "react-router-dom";
import { BarChart2, Zap } from "lucide-react";
import { useStore } from "@/store/useStore";
import { motion } from "framer-motion";

export default function Navbar() {
  const points = useStore(state => state.points);
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <nav className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <BarChart2 className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">StatsAI</span>
          </Link>
        </div>

        {isHome && (
          <div className="hidden md:flex space-x-8">
            <a href="#features" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">核心功能</a>
            <a href="#pricing" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">定价</a>
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
            <span className="text-sm font-bold text-amber-700">{points.toLocaleString()}</span>
            <span className="text-xs font-medium text-amber-600/80">积分</span>
          </motion.div>

          {isHome ? (
            <>
              <Link to="/chat" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">工作区</Link>
              <Link to="/chat" className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors shadow-sm">
                开始使用
              </Link>
            </>
          ) : (
            <Link to="/chat" className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors shadow-sm">
              进入工作区
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}