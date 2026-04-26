import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MessageCircle, Gift, Check, Sparkles } from 'lucide-react';

interface CtaSectionProps {
  handleCTA: (view: "login" | "register") => void;
  token: string | null;
}

export const CtaSection: React.FC<CtaSectionProps> = ({ handleCTA, token }) => {
  return (
    <section className="py-24 bg-[#141413] text-[#faf9f5] border-t border-gray-800 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-[#d97757] rounded-full mix-blend-screen filter blur-[150px] opacity-10 pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="inline-flex items-center justify-center p-3 bg-[#faf9f5]/5 rounded-full mb-8 border border-gray-800">
            <Sparkles size={24} className="text-[#d97757]" />
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold font-['Poppins'] mb-8 leading-tight">
            "别再学代码了，<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d97757] to-[#6a9bcc]">
              直接用母语做研究
            </span>"
          </h2>
          
          <p className="text-xl md:text-2xl font-['Lora'] text-gray-400 mb-12">
            让代码消失，让研究回归本质。
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
            <button 
              onClick={() => handleCTA(token ? 'login' : 'register')}
              className="w-full sm:w-auto px-8 py-5 rounded-xl bg-[#d97757] hover:bg-[#d97757]/90 text-[#faf9f5] font-['Poppins'] font-bold text-lg flex items-center justify-center gap-3 transition-all transform hover:scale-105 shadow-[0_0_40px_rgba(217,119,87,0.3)]"
            >
              {token ? '进入研究室' : '免费注册，体验Vibe Coding'} <ArrowRight size={24} />
            </button>
            
            <div className="flex flex-col items-center sm:items-start">
              <button className="w-full sm:w-auto px-8 py-5 rounded-xl bg-[#2a2a29] hover:bg-[#3a3a39] text-[#faf9f5] font-['Poppins'] font-bold text-lg flex items-center justify-center gap-3 transition-colors border border-gray-700">
                <MessageCircle size={24} className="text-[#6a9bcc]" /> 添加微信咨询
              </button>
              <span className="text-sm text-gray-500 mt-2 font-['Lora']">微信号：MoChen11-20</span>
            </div>
          </div>

          {/* Registration Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto text-left font-['Lora']">
            <div className="bg-[#1a1a19] p-5 rounded-xl border border-gray-800 flex items-start gap-3">
              <Gift className="text-[#788c5d] shrink-0 mt-1" size={20} />
              <div>
                <p className="font-semibold text-gray-200">注册福利</p>
                <p className="text-sm text-gray-400">注册即送 3 次免费分析</p>
              </div>
            </div>
            <div className="bg-[#1a1a19] p-5 rounded-xl border border-gray-800 flex items-start gap-3">
              <Gift className="text-[#d97757] shrink-0 mt-1" size={20} />
              <div>
                <p className="font-semibold text-gray-200">邀请福利</p>
                <p className="text-sm text-gray-400">输入邀请码额外送 50 积分</p>
              </div>
            </div>
            <div className="bg-[#1a1a19] p-5 rounded-xl border border-gray-800 flex items-start gap-3">
              <Gift className="text-[#6a9bcc] shrink-0 mt-1" size={20} />
              <div>
                <p className="font-semibold text-gray-200">咨询福利</p>
                <p className="text-sm text-gray-400">添加微信送《避坑指南》</p>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
      
      {/* Footer Brand Info */}
      <div className="mt-24 pt-8 border-t border-gray-900 bg-[#0a0a0a]">
        <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-['Lora'] text-gray-600">
          <div className="flex items-center gap-2">
            <span className="font-['Poppins'] font-bold text-gray-300 text-lg">DeepResValue</span> 
            <span className="hidden md:inline">|</span> 
            <span>深度研值</span>
          </div>
          <div className="text-center md:text-left">
            "用自然语言做数据分析，告别代码，开口就能出结果"
          </div>
          <div>
            &copy; {new Date().getFullYear()} DeepResValue. All rights reserved.
          </div>
        </div>
      </div>
    </section>
  );
};
