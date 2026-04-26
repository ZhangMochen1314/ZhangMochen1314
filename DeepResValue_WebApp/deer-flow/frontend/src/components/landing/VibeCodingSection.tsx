import React from 'react';
import { motion } from 'framer-motion';
import { Code, MessageSquare, CheckCircle, ArrowRight } from 'lucide-react';

export const VibeCodingSection: React.FC = () => {
  return (
    <section className="py-24 bg-[#faf9f5] text-[#141413]">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-['Poppins'] mb-6">
            🚀 Vibe Coding：用自然语言开启研究新纪元
          </h2>
          <div className="text-lg md:text-xl font-['Lora'] text-gray-700 space-y-4">
            <p className="font-semibold text-2xl">为什么非得学代码？</p>
            <p>传统的Stata、SPSS、Eviews、Python、R——它们是工具，不是目的。你要的是研究结果，不是编程技能。</p>
            <p className="text-[#d97757] font-semibold">DeepResValue让你用母语做研究——说出你的想法，AI替你执行。</p>
          </div>
        </motion.div>

        {/* Code vs Natural Language Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden bg-[#1a1a19] shadow-xl border border-gray-800 flex flex-col"
          >
            <div className="bg-[#2a2a2a] px-4 py-3 flex items-center gap-2 text-gray-400 font-['Poppins'] text-sm">
              <Code size={16} /> 传统方式（Stata代码）
            </div>
            <div className="p-6 font-mono text-sm md:text-base text-gray-300 flex-grow">
              <p className="text-gray-500 mb-1">* 需要先学语法，查文档</p>
              <p><span className="text-[#6a9bcc]">reg</span> y x1 x2 x3, <span className="text-[#d97757]">robust</span></p>
              <p><span className="text-[#6a9bcc]">estat</span> vif</p>
              <p><span className="text-[#6a9bcc]">outreg2</span> using result.doc, <span className="text-[#d97757]">replace</span></p>
              <p className="text-gray-500 mt-4 mb-1">* 稳健性检验要另外写</p>
              <p><span className="text-[#6a9bcc]">xtreg</span> y x1 x2, <span className="text-[#d97757]">fe</span></p>
              <p className="text-gray-500 mt-4">* 每个方法都要查命令，极易报错</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden bg-[#141413] shadow-xl border border-[#788c5d]/30 flex flex-col relative"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#788c5d] rounded-full mix-blend-screen filter blur-[80px] opacity-10"></div>
            <div className="bg-[#1a2518] px-4 py-3 flex items-center gap-2 text-[#788c5d] font-['Poppins'] text-sm font-semibold">
              <MessageSquare size={16} /> DeepResValue方式（自然语言）
            </div>
            <div className="p-6 font-['Lora'] text-base md:text-lg text-gray-200 flex-grow space-y-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#faf9f5]/10 flex items-center justify-center shrink-0">👤</div>
                <div className="bg-[#2a2a29] p-4 rounded-2xl rounded-tl-none border border-gray-700">
                  帮我分析数字化转型对企业创新的影响，用面板数据的固定效应模型，加上稳健标准误，输出三线表到Word。
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#788c5d]/20 text-[#788c5d] flex items-center justify-center shrink-0">🤖</div>
                <div className="bg-[#1e2a1c] p-4 rounded-2xl rounded-tl-none border border-[#788c5d]/30 space-y-2">
                  <p>好的，正在执行...</p>
                  <p className="flex items-center gap-2 text-[#788c5d]"><CheckCircle size={16} /> 固定效应回归完成</p>
                  <p className="flex items-center gap-2 text-[#788c5d]"><CheckCircle size={16} /> R² = 0.452</p>
                  <p className="flex items-center gap-2 text-[#788c5d]"><CheckCircle size={16} /> 核心变量显著（p&lt;0.01）</p>
                  <p className="flex items-center gap-2 text-[#788c5d]"><CheckCircle size={16} /> 三线表已生成</p>
                  <p className="pt-2 border-t border-[#788c5d]/20">需要稳健性检验吗？</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Advantages & Translation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-['Poppins'] font-bold mb-6 flex items-center gap-2">
              核心优势
            </h3>
            <div className="space-y-4 font-['Lora']">
              {[
                { label: "学习成本", old: "数月甚至数年", new: "0学习成本" },
                { label: "出错概率", old: "语法错误、逻辑错误", new: "AI理解意图，自动纠错" },
                { label: "调试时间", old: "几小时甚至几天", new: "即时反馈，随时调整" },
                { label: "适用人群", old: "有编程基础的人", new: "所有人" },
                { label: "可复现性", old: "需要记录繁琐代码", new: "对话记录自动保存，代码可导出" }
              ].map((item, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                  <span className="font-semibold text-gray-800 mb-2 sm:mb-0 w-24">{item.label}</span>
                  <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-sm md:text-base">
                    <span className="text-gray-500 line-through decoration-gray-300 flex-1">{item.old}</span>
                    <ArrowRight size={16} className="hidden sm:block text-[#d97757]" />
                    <span className="text-[#788c5d] font-bold flex-1">{item.new}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-['Poppins'] font-bold mb-6">
              AI "翻译" 能力
            </h3>
            <div className="grid grid-cols-1 gap-4 font-['Lora']">
              {[
                { say: "做双重差分", do: "DID模型完整代码执行" },
                { say: "检验平行趋势", do: "事件研究法 + 图示输出" },
                { say: "解决内生性", do: "工具变量法 / PSM匹配" },
                { say: "输出成论文格式", do: "三线表 + 显著性标记 + 结果解读" }
              ].map((item, i) => (
                <div key={i} className="p-5 bg-[#141413] text-[#faf9f5] rounded-xl relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#d97757]/0 via-[#d97757]/5 to-[#d97757]/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3">
                    <div className="text-gray-400">你说：<span className="text-white">"{item.say}"</span></div>
                    <ArrowRight size={16} className="hidden md:block text-[#6a9bcc]" />
                    <div className="text-[#6a9bcc]">AI执行：<span className="font-semibold">{item.do}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
};
