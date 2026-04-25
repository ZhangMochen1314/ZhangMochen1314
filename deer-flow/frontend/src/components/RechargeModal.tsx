import { X, MessageCircle } from "lucide-react";

interface RechargeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RechargeModal({ isOpen, onClose }: RechargeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
      <div className="relative w-full max-w-sm p-6 bg-white rounded-2xl shadow-2xl dark:bg-slate-800">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="text-center">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">获取额度</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            请添加管理员微信获取更多额度
          </p>
          
          <div className="flex justify-center mb-6">
            <div className="p-2 border-2 border-slate-100 rounded-xl bg-white">
              <img 
                src="/wechat-admin.png" 
                alt="管理员微信二维码" 
                className="w-48 h-48 object-contain"
              />
            </div>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-start space-x-3 text-left">
            <MessageCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800 dark:text-blue-300 leading-relaxed">
              <p className="font-semibold mb-1">如何充值？</p>
              <p>请扫描上方二维码添加管理员微信。添加时请备注您的<strong>注册邮箱</strong>，付款后管理员将为您手动充值积分。</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}