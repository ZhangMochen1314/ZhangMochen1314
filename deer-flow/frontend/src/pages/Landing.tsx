import React from 'react';
import { Link } from 'react-router-dom';
import GenerativeBackground from '@/components/GenerativeBackground';
import { motion } from 'framer-motion';

export default function Landing() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen text-white overflow-hidden selection:bg-[#d97757] selection:text-[#141413]">
      <GenerativeBackground />
      
      <div className="relative z-10 flex flex-col items-center justify-center px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-6 inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-sm font-medium tracking-wide text-[#b0aea5]"
        >
          <span className="flex h-2 w-2 rounded-full bg-[#d97757] animate-pulse"></span>
          <span>闭门内测中，凭邀请码加入</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="font-['Poppins'] text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl leading-tight mb-6"
        >
          DeepResValue
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="font-['Lora'] text-xl md:text-2xl text-[#b0aea5] max-w-2xl leading-relaxed mb-12"
        >
          智能数据分析与 Agent 编排引擎。重塑科研工作流，无缝衔接数据清洗、深度实证分析与学术写作。
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6"
        >
          <Link 
            to="/login" 
            className="px-8 py-3.5 rounded-lg font-['Poppins'] font-semibold text-[#141413] bg-[#d97757] hover:bg-[#e0896b] transition-all duration-300 shadow-[0_0_20px_rgba(217,119,87,0.3)] hover:shadow-[0_0_30px_rgba(217,119,87,0.5)] transform hover:-translate-y-0.5"
          >
            登录
          </Link>
          <Link 
            to="/register" 
            className="px-8 py-3.5 rounded-lg font-['Poppins'] font-semibold text-white border border-white/30 bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-all duration-300 transform hover:-translate-y-0.5"
          >
            立即注册
          </Link>
        </motion.div>
      </div>

      {/* Footer / Copyright */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 text-[#b0aea5]/60 text-sm font-['Poppins']"
      >
        © 2026 DeepResValue. All rights reserved.
      </motion.div>
    </div>
  );
}
