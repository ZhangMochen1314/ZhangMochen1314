import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { X, User, Zap, Copy, Ticket, CheckCircle2, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserProfileModal({ isOpen, onClose }: Props) {
  const { user, points, logout } = useStore();
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  if (!isOpen || !user) return null;

  const handleCopy = () => {
    if (user.my_invite_code) {
      navigator.clipboard.writeText(user.my_invite_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-800">
        
        {/* Header */}
        <div className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 p-6 pb-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">个人账号管理</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">ID: #{user.id}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-500 dark:text-slate-400"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Account Info */}
          <div>
            <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">登录账号</label>
            <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 font-medium">
              {user.email}
            </div>
          </div>

          {/* Credits */}
          <div>
            <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">当前算力积分</label>
            <div className="flex items-center justify-between px-4 py-4 bg-gradient-to-r from-amber-50 dark:from-amber-900/20 to-orange-50 dark:to-orange-900/10 border border-amber-200/50 dark:border-amber-700/30 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
                </div>
                <div>
                  <div className="text-2xl font-black text-amber-600 dark:text-amber-500">{points}</div>
                  <div className="text-xs font-medium text-amber-600/70 dark:text-amber-500/70">可用额度</div>
                </div>
              </div>
              <a href="/#pricing" onClick={onClose} className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-lg shadow-sm shadow-amber-500/20 transition-colors">
                前往充值
              </a>
            </div>
          </div>

          {/* Invite Code */}
          {user.my_invite_code && (
            <div>
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                <Ticket className="w-3.5 h-3.5" />
                <span>我的专属邀请码</span>
              </label>
              <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50 rounded-xl relative overflow-hidden group">
                <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl -mr-10 -mt-10" />
                <p className="text-xs text-indigo-600/80 dark:text-indigo-400/80 mb-3 relative z-10 leading-relaxed">
                  分享此邀请码给好友，好友注册时填写即可获赠初始积分，您也将获得 <strong className="text-indigo-600 dark:text-indigo-400">邀请返利积分</strong>。
                </p>
                <div className="flex items-center space-x-2 relative z-10">
                  <div className="flex-1 px-4 py-3 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-700/50 rounded-lg text-indigo-700 dark:text-indigo-400 font-mono font-bold tracking-widest text-center text-lg shadow-sm">
                    {user.my_invite_code}
                  </div>
                  <button 
                    onClick={handleCopy}
                    className="h-12 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center justify-center shadow-sm"
                  >
                    {copied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 flex justify-end">
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>退出登录</span>
          </button>
        </div>
        
      </div>
    </div>
  );
}