import React from 'react';
import { Link } from 'react-router-dom';
import GenerativeBackground from '@/components/GenerativeBackground';
import { motion } from 'framer-motion';
import { BrainCircuit, ArrowRight } from 'lucide-react';

export default function Landing() {
  return (
    <div className="relative flex flex-col min-h-screen text-[#faf9f5] overflow-hidden selection:bg-[#d97757] selection:text-[#141413] font-['Lora']">
      <GenerativeBackground />
      
      {/* Navbar */}
      <nav className="relative z-20 flex items-center justify-between px-8 py-6 w-full max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex items-center space-x-3"
        >
          <div className="p-2 bg-[#d97757]/10 rounded-xl backdrop-blur-sm border border-[#d97757]/20">
            <BrainCircuit className="w-6 h-6 text-[#d97757]" />
          </div>
          <span className="font-['Poppins'] font-bold text-xl tracking-wide text-white">
            DeepRes<span className="text-[#d97757]">Value</span>
          </span>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="hidden md:flex items-center space-x-6 font-['Poppins'] text-sm"
        >
          <Link to="/login" className="text-[#b0aea5] hover:text-white transition-colors duration-300">
            登录
          </Link>
          <Link 
            to="/register" 
            className="px-5 py-2 rounded-full border border-[#d97757]/30 text-[#d97757] hover:bg-[#d97757] hover:text-[#141413] transition-all duration-300 font-medium"
          >
            获取内测资格
          </Link>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center w-full max-w-5xl mx-auto">
        
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8 inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-[#6a9bcc]/30 bg-[#6a9bcc]/10 backdrop-blur-md text-xs font-['Poppins'] font-medium tracking-widest uppercase text-[#6a9bcc]"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6a9bcc] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#6a9bcc]"></span>
          </span>
          <span>Private Beta / Invite Only</span>
        </motion.div>

        {/* Title */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="font-['Poppins'] text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter leading-[1.1] mb-8 text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-[#b0aea5]"
        >
          重塑科研流的<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d97757] to-[#e0896b]">智能编排引擎</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="text-lg md:text-2xl text-[#b0aea5] max-w-2xl leading-relaxed mb-12 font-light"
        >
          DeepResValue 提供强大的 Agent 协同能力，无缝衔接数据清洗、深度实证分析与学术写作。让数据自己开口说话。
        </motion.p>

        {/* CTAPs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 w-full sm:w-auto"
        >
          <Link 
            to="/register" 
            className="group relative flex items-center justify-center px-8 py-4 rounded-xl font-['Poppins'] font-semibold text-[#141413] bg-gradient-to-r from-[#d97757] to-[#e0896b] hover:from-[#e0896b] hover:to-[#e89c82] transition-all duration-300 shadow-[0_0_30px_rgba(217,119,87,0.4)] hover:shadow-[0_0_40px_rgba(217,119,87,0.6)] hover:-translate-y-1 w-full sm:w-auto overflow-hidden"
          >
            <div className="absolute inset-0 w-full h-full bg-white/20 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
            <span className="mr-2">凭邀请码加入</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link 
            to="/login" 
            className="flex items-center justify-center px-8 py-4 rounded-xl font-['Poppins'] font-medium text-white border border-white/20 bg-white/5 hover:bg-white/10 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 w-full sm:w-auto"
          >
            已有账号登录
          </Link>
        </motion.div>
      </main>

      {/* Decorative gradient orbs for extra depth */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-[#d97757]/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#6a9bcc]/10 rounded-full blur-[150px] pointer-events-none -z-10"></div>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="relative z-20 pb-8 pt-12 text-center text-[#b0aea5]/50 text-xs font-['Poppins'] tracking-wider uppercase"
      >
        © {new Date().getFullYear()} DeepResValue. Crafted for the future.
      </motion.footer>
    </div>
  );
}