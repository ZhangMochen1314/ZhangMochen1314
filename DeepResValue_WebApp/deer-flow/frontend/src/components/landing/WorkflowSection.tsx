import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Database, BookOpen, BarChart3, Edit3, ArrowRight, Filter } from 'lucide-react';

export const WorkflowSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      id: 1,
      title: "研究设计",
      icon: <Lightbulb size={24} />,
      say: "我想研究数字化转型对企业创新的影响，这个选题可行吗？",
      reply: "可行。建议采用DID方法，因为2020年政策可作为准自然实验..."
    },
    {
      id: 2,
      title: "数据获取",
      icon: <Database size={24} />,
      say: "帮我找中国A股上市公司2015-2023年的创新数据",
      reply: "已从CSMAR数据库获取专利申请数据，共15,234条记录..."
    },
    {
      id: 3,
      title: "变量筛选",
      icon: <Filter size={24} />,
      say: "帮我从数据中选出与创新相关的核心控制变量，并确保结果显著",
      reply: "已通过双重过滤：提取企业规模、资产负债率等5个语义相关变量，OLS检验后剔除了不显著项，最终保留3个核心控制变量..."
    },
    {
      id: 4,
      title: "文献综述",
      icon: <BookOpen size={24} />,
      say: "帮我梳理数字化转型对企业创新的相关文献",
      reply: "检索到顶刊文献47篇，核心观点如下..."
    },
    {
      id: 5,
      title: "实证分析",
      icon: <BarChart3 size={24} />,
      say: "用DID方法分析，检验平行趋势，输出三线表",
      reply: "正在执行双重差分...平行趋势通过，处理效应显著..."
    },
    {
      id: 6,
      title: "论文撰写",
      icon: <Edit3 size={24} />,
      say: "帮我写成实证分析章节",
      reply: "已生成符合学术规范的实证部分，包含方法说明、结果展示、稳健性检验..."
    }
  ];

  return (
    <section className="py-24 bg-[var(--theme-dark)] text-[var(--theme-light)]">
      <div className="container mx-auto px-4 md:px-6">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-heading mb-6">
            全流程能力
          </h2>
          <p className="text-xl font-body text-gray-400">
            从选题到成文，每个环节都只需自然语言
          </p>
        </motion.div>

        {/* Desktop Process Flow */}
        <div className="hidden md:flex justify-between items-center max-w-5xl mx-auto mb-16 relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-800 -z-10 -translate-y-1/2"></div>
          {steps.map((step, index) => (
            <motion.div 
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center cursor-pointer group"
              onClick={() => setActiveStep(index)}
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${activeStep === index ? 'bg-[var(--theme-accent2)] text-white shadow-[0_0_20px_rgba(106,155,204,0.5)] scale-110' : 'bg-[var(--theme-dark-hover)] text-gray-400 border border-gray-700 group-hover:border-[var(--theme-accent2)] group-hover:text-[var(--theme-accent2)]'}`}>
                {step.icon}
              </div>
              <div className="mt-4 text-center">
                <p className={`font-heading font-semibold transition-colors ${activeStep === index ? 'text-[var(--theme-accent2)]' : 'text-gray-400'}`}>
                  {step.id}. {step.title}
                </p>
                <p className="text-xs text-gray-500 mt-1">自然语言交互</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile Process Flow (Vertical) */}
        <div className="md:hidden flex flex-col space-y-4 mb-12">
          {steps.map((step, index) => (
            <div 
              key={step.id}
              onClick={() => setActiveStep(index)}
              className={`flex items-center p-4 rounded-xl border transition-all ${activeStep === index ? 'bg-[#1a2026] border-[var(--theme-accent2)] text-white' : 'bg-[var(--theme-dark-hover)] border-gray-800 text-gray-400'}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${activeStep === index ? 'bg-[var(--theme-accent2)] text-white' : 'bg-gray-800 text-gray-400'}`}>
                {step.icon}
              </div>
              <div className="flex-1">
                <p className="font-heading font-semibold">{step.title}</p>
              </div>
              {activeStep !== index && <ArrowRight size={16} />}
            </div>
          ))}
        </div>

        {/* Interaction Display */}
        <motion.div 
          className="max-w-3xl mx-auto bg-[var(--theme-dark-hover)] rounded-2xl border border-gray-800 overflow-hidden shadow-2xl relative"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--theme-accent2)] rounded-full mix-blend-screen filter blur-[100px] opacity-10 pointer-events-none"></div>
          
          <div className="bg-[#222221] px-6 py-4 border-b border-gray-800 flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <span className="font-heading text-sm text-gray-400 font-medium">DeepResValue Assistant - {steps[activeStep].title}</span>
          </div>
          
          <div className="p-6 md:p-8 font-body space-y-8 min-h-[300px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={`chat-${activeStep}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center shrink-0 text-xl">👤</div>
                  <div className="bg-[var(--theme-card-dark)] p-5 rounded-2xl rounded-tl-none border border-gray-700 text-gray-200 md:text-lg">
                    {steps[activeStep].say}
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-[var(--theme-accent2)]/20 text-[var(--theme-accent2)] flex items-center justify-center shrink-0 text-xl">🤖</div>
                  <div className="bg-[#1a2530] p-5 rounded-2xl rounded-tl-none border border-[var(--theme-accent2)]/30 text-[var(--theme-accent2)] md:text-lg leading-relaxed shadow-[inset_0_0_20px_rgba(106,155,204,0.05)]">
                    {steps[activeStep].reply}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
