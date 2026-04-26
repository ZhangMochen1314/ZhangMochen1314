import React from 'react';
import { motion } from 'framer-motion';
import { Play, ArrowRight, Zap, Trophy, BookOpen } from 'lucide-react';

interface HeroSectionProps {
  handleCTA: (view: "login" | "register") => void;
  token: string | null;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ handleCTA, token }) => {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-[#141413] text-[#faf9f5] pt-20 pb-16">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#d97757] rounded-full mix-blend-screen filter blur-[128px] opacity-20 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#6a9bcc] rounded-full mix-blend-screen filter blur-[128px] opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="container mx-auto px-4 md:px-6 z-10">
        <div className="flex flex-col items-center text-center space-y-10">
          
          {/* Tags */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap justify-center gap-3"
          >
            <span className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#faf9f5]/10 border border-[#faf9f5]/20 text-sm font-['Poppins']">
              <Zap size={16} className="text-[#d97757]" /> Vibe Coding 新范式
            </span>
            <span className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#faf9f5]/10 border border-[#faf9f5]/20 text-sm font-['Poppins']">
              <Trophy size={16} className="text-[#d97757]" /> 国奖直达车
            </span>
            <span className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#faf9f5]/10 border border-[#faf9f5]/20 text-sm font-['Poppins']">
              <BookOpen size={16} className="text-[#d97757]" /> 全流程覆盖
            </span>
          </motion.div>

          {/* Main Headers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-4xl space-y-6"
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight font-['Poppins'] leading-tight">
              用自然语言做<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d97757] to-[#6a9bcc]">数据分析</span>
              <br />
              告别代码，开口出结果
            </h1>
            <p className="text-xl md:text-2xl text-[#faf9f5]/80 font-['Lora'] max-w-2xl mx-auto leading-relaxed">
              不再学Stata、不再敲Python、不再调SPSS。用你的母语，说你想分析的，AI替你执行。
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <button 
              onClick={() => handleCTA(token ? 'login' : 'register')}
              className="px-8 py-4 rounded-lg bg-[#d97757] hover:bg-[#d97757]/90 text-[#faf9f5] font-['Poppins'] font-semibold text-lg flex items-center justify-center gap-2 transition-all transform hover:scale-105"
            >
              {token ? '进入研究室' : '免费注册体验'} <ArrowRight size={20} />
            </button>
            <button 
              className="px-8 py-4 rounded-lg bg-[#faf9f5]/10 hover:bg-[#faf9f5]/20 text-[#faf9f5] font-['Poppins'] font-semibold text-lg flex items-center justify-center gap-2 backdrop-blur-sm transition-all"
            >
              <Play size={20} /> 看看有多简单
            </button>
          </motion.div>

          {/* Comparison Table / Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="w-full max-w-5xl mt-12"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-[#faf9f5]/20 shadow-2xl">
              <div className="bg-[#1a1a19] p-8 flex flex-col justify-center border-b md:border-b-0 md:border-r border-[#faf9f5]/20">
                <h3 className="text-xl font-['Poppins'] text-[#faf9f5]/60 mb-6 font-semibold">传统方式</h3>
                <ul className="space-y-4 font-['Lora'] text-lg text-[#faf9f5]/70">
                  <li className="flex items-center gap-3"><span className="text-[#d97757]">×</span> 学Stata：2个月</li>
                  <li className="flex items-center gap-3"><span className="text-[#d97757]">×</span> 学Python：3个月</li>
                  <li className="flex items-center gap-3"><span className="text-[#d97757]">×</span> 学SPSS：1个月</li>
                  <li className="flex items-center gap-3"><span className="text-[#d97757]">×</span> 调试代码：数小时</li>
                  <li className="flex items-center gap-3"><span className="text-[#d97757]">×</span> 记语法、查文档</li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-[#1a1a19] to-[#2a2520] p-8 flex flex-col justify-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#788c5d] rounded-full mix-blend-screen filter blur-[64px] opacity-20"></div>
                <h3 className="text-2xl font-['Poppins'] text-[#788c5d] mb-6 font-bold flex items-center gap-2">
                  <Zap size={24} /> DeepResValue 方式
                </h3>
                <ul className="space-y-4 font-['Lora'] text-xl font-medium text-[#faf9f5]">
                  <li className="flex items-center gap-3"><span className="text-[#788c5d]">✓</span> 说出需求：10秒</li>
                  <li className="flex items-center gap-3"><span className="text-[#788c5d]">✓</span> AI自动执行：1分钟</li>
                  <li className="flex items-center gap-3"><span className="text-[#788c5d]">✓</span> 结果输出：即刻呈现</li>
                  <li className="flex items-center gap-3"><span className="text-[#788c5d]">✓</span> 修改需求：再说一遍</li>
                  <li className="flex items-center gap-3"><span className="text-[#788c5d]">✓</span> 自然对话，像问导师</li>
                </ul>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
