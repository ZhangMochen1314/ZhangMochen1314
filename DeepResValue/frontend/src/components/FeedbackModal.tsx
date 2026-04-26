import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageSquareHeart, Loader2, Bug, Lightbulb, MessageCircle } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [content, setContent] = useState('');
  const [type, setType] = useState<'bug' | 'suggestion' | 'other'>('bug');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { token } = useAuthStore();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content, type })
      });

      if (!res.ok) {
        throw new Error('提交失败，请稍后再试');
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setContent('');
        onClose();
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
        >
          <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center">
              <MessageSquareHeart className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
              产品反馈与建议
            </h2>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {success ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-8 text-center"
              >
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-4">
                  <MessageSquareHeart className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">反馈提交成功！</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">非常感谢您的宝贵建议，我们将尽快处理。</p>
              </motion.div>
            ) : (
              <>
                {error && (
                  <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg border border-red-100 dark:border-red-800/50">
                    {error}
                  </div>
                )}

                <div className="mb-5">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">反馈类型</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'bug', label: '功能异常', icon: Bug, color: 'text-red-500' },
                      { id: 'suggestion', label: '产品建议', icon: Lightbulb, color: 'text-amber-500' },
                      { id: 'other', label: '其他', icon: MessageCircle, color: 'text-blue-500' }
                    ].map(t => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setType(t.id as any)}
                        className={`flex flex-col items-center justify-center py-3 border rounded-xl transition-all ${
                          type === t.id 
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-500/50' 
                            : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800'
                        }`}
                      >
                        <t.icon className={`w-5 h-5 mb-1 ${type === t.id ? t.color : 'text-slate-400'}`} />
                        <span className={`text-xs font-medium ${type === t.id ? 'text-blue-700 dark:text-blue-300' : 'text-slate-600 dark:text-slate-400'}`}>
                          {t.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">具体描述</label>
                  <textarea 
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    required
                    rows={4}
                    placeholder="请详细描述您遇到的问题或建议..."
                    className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all resize-none text-sm"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={loading || !content.trim()}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : '提交反馈'}
                </button>
              </>
            )}
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}