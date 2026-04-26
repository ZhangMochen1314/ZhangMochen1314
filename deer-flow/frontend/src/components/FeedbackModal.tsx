import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, AlertCircle, MessageSquare } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [type, setType] = useState<"bug" | "suggestion">("bug");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);
  const token = useAuthStore((state) => state.token);

  const handleSubmit = async () => {
    setMessage(null);
    if (!content.trim()) {
      setMessage({ type: 'error', text: "请填写反馈内容" });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ type, content }),
      });

      if (!res.ok) throw new Error("Failed to submit feedback");

      setMessage({ type: 'success', text: "感谢您的反馈！我们会尽快处理。" });
      setContent("");
      setTimeout(() => {
        setMessage(null);
        onClose();
      }, 2000);
    } catch (error) {
      setMessage({ type: 'error', text: "提交失败，请稍后重试" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                <span>意见反馈与报错</span>
              </h3>
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {message && (
                <div className={`p-3 text-sm rounded-lg border ${
                  message.type === 'error' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                }`}>
                  {message.text}
                </div>
              )}
              <div className="flex space-x-4">
                <button
                  onClick={() => setType("bug")}
                  className={`flex-1 py-2.5 px-4 rounded-xl border flex items-center justify-center space-x-2 transition-colors ${
                    type === "bug"
                      ? "bg-red-50 border-red-200 text-red-700 font-medium"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>遇到 Bug</span>
                </button>
                <button
                  onClick={() => setType("suggestion")}
                  className={`flex-1 py-2.5 px-4 rounded-xl border flex items-center justify-center space-x-2 transition-colors ${
                    type === "suggestion"
                      ? "bg-blue-50 border-blue-200 text-blue-700 font-medium"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>功能建议</span>
                </button>
              </div>

              <div>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={
                    type === "bug"
                      ? "请描述您遇到的问题，例如：点击xx按钮后白屏、报错代码是什么..."
                      : "您希望我们增加什么功能？或者有什么改进建议？"
                  }
                  className="w-full h-32 p-4 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none resize-none transition-all"
                />
              </div>
            </div>

            <div className="p-5 border-t border-slate-100 flex justify-end space-x-3 bg-slate-50/50">
              <button
                onClick={onClose}
                className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !content.trim()}
                className="flex items-center space-x-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {isSubmitting ? (
                  <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span>提交反馈</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}