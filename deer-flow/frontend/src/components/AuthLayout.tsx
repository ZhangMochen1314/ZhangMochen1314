import React from 'react';
import GenerativeBackground from './GenerativeBackground';
import { BrainCircuit } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function AuthLayout({ children, title, subtitle }: { children: React.ReactNode, title: string, subtitle: string }) {
  return (
    <div className="flex min-h-screen bg-[#141413] text-[#faf9f5] font-['Lora'] selection:bg-[#d97757] selection:text-[#141413]">
      {/* Left Pane - Art */}
      <div className="relative hidden lg:flex lg:w-1/2 overflow-hidden bg-[#0a0a0a]">
        <GenerativeBackground />
        <div className="absolute inset-0 bg-gradient-to-r from-[#141413]/40 to-[#141413]/90"></div>
        
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link to="/" className="flex items-center space-x-3 w-fit">
            <div className="p-2 bg-[#d97757]/10 rounded-xl backdrop-blur-sm border border-[#d97757]/20">
              <BrainCircuit className="w-6 h-6 text-[#d97757]" />
            </div>
            <span className="font-['Poppins'] font-bold text-xl tracking-wide text-white">
              DeepRes<span className="text-[#d97757]">Value</span>
            </span>
          </Link>

          <div className="max-w-md">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="font-['Poppins'] text-4xl font-bold mb-6 leading-tight">
                解构复杂数据，<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d97757] to-[#6a9bcc]">发现涌现价值</span>
              </h2>
              <p className="text-[#b0aea5] text-lg leading-relaxed">
                欢迎来到科研与数据分析的新范式。请在右侧进行身份验证，继续您的深度探索。
              </p>
            </motion.div>
          </div>
          
          <div className="text-[#b0aea5]/50 text-sm font-['Poppins']">
            © {new Date().getFullYear()} DeepResValue Inc.
          </div>
        </div>
      </div>

      {/* Right Pane - Form */}
      <div className="flex flex-col justify-center w-full lg:w-1/2 p-8 sm:p-12 md:p-24 relative">
        <Link to="/" className="lg:hidden absolute top-8 left-8 flex items-center space-x-3">
          <BrainCircuit className="w-6 h-6 text-[#d97757]" />
          <span className="font-['Poppins'] font-bold text-xl tracking-wide text-white">
            DeepRes<span className="text-[#d97757]">Value</span>
          </span>
        </Link>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md mx-auto"
        >
          <div className="mb-10">
            <h1 className="font-['Poppins'] text-3xl font-bold mb-3">{title}</h1>
            <p className="text-[#b0aea5]">{subtitle}</p>
          </div>
          {children}
        </motion.div>
      </div>
    </div>
  );
}