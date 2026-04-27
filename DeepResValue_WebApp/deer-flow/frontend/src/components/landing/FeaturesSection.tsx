import React from 'react';
import { motion } from 'framer-motion';
import { Zap, ShieldCheck, CheckCircle2, Server, Database, Code, Shield } from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const advantages = [
    {
      title: "1. Vibe Coding 革命",
      icon: <Zap size={32} className="text-[var(--theme-accent1)]" />,
      points: ["零代码学习成本", "自然语言即命令", "效率提升10倍以上"]
    },
    {
      title: "2. 国产顶尖AI驱动",
      icon: <Server size={32} className="text-[var(--theme-accent2)]" />,
      points: ["DeepSeek V4 Pro - 100万Token上下文", "数百种学术级统计方法", "国内部署，不依赖国外API"]
    },
    {
      title: "3. 全程透明合规",
      icon: <ShieldCheck size={32} className="text-[var(--theme-accent3)]" />,
      points: ["你主导研究方向", "每步都能解释", "答辩自信应对"]
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
            为什么选择 DeepResValue？
          </h2>
          <p className="text-xl font-body text-gray-400">
            不仅是工具，更是你的专属AI研究导师
          </p>
        </motion.div>

        {/* Three Core Advantages */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {advantages.map((adv, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-[var(--theme-dark-hover)] p-8 rounded-2xl border border-gray-800 hover:border-gray-600 transition-colors"
            >
              <div className="mb-6">{adv.icon}</div>
              <h3 className="text-2xl font-heading font-bold mb-4">{adv.title}</h3>
              <ul className="space-y-3 font-body text-gray-400">
                {adv.points.map((point, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 size={18} className="text-gray-500 mt-1 shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Reproducibility Focus */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-[var(--theme-dark-hover)] to-[var(--theme-card-dark)] rounded-3xl p-8 md:p-12 border border-[var(--theme-accent3)]/20 relative overflow-hidden mb-24"
        >
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-[var(--theme-accent3)] rounded-full mix-blend-screen filter blur-[150px] opacity-10"></div>
          
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2 space-y-6">
              <h3 className="text-3xl font-heading font-bold text-white">
                "你的结果，任何人都能复现"
              </h3>
              <div className="space-y-4 font-body text-lg text-gray-300">
                <p>分析完成后可导出完整代码，支持Python、R、Stata格式。</p>
                <p>答辩时可以清晰展示每一步，审稿人可以验证你的结果。可信度100%。</p>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="flex items-center gap-2 text-[var(--theme-accent3)] font-medium">
                  <Database size={20} /> 方法透明
                </div>
                <div className="flex items-center gap-2 text-[var(--theme-accent3)] font-medium">
                  <CheckCircle2 size={20} /> 结果可信
                </div>
                <div className="flex items-center gap-2 text-[var(--theme-accent3)] font-medium">
                  <Code size={20} /> 代码可导出
                </div>
                <div className="flex items-center gap-2 text-[var(--theme-accent3)] font-medium">
                  <Shield size={20} /> 全程可追溯
                </div>
              </div>
            </div>
            
            <div className="md:w-1/2 bg-[var(--theme-dark)] rounded-2xl p-6 border border-gray-800 shadow-2xl font-mono text-sm text-gray-400">
              <div className="flex gap-2 mb-4 border-b border-gray-800 pb-2">
                <span className="text-[var(--theme-accent2)]">stata_export.do</span>
                <span className="text-gray-600">python_export.py</span>
                <span className="text-gray-600">r_export.R</span>
              </div>
              <p className="text-gray-500 mb-2">/* AI Generated Code from Natural Language */</p>
              <p><span className="text-[var(--theme-accent1)]">import</span> pandas <span className="text-[var(--theme-accent1)]">as</span> pd</p>
              <p><span className="text-[var(--theme-accent1)]">import</span> statsmodels.api <span className="text-[var(--theme-accent1)]">as</span> sm</p>
              <p className="mt-2 text-gray-500"># 1. Load Data</p>
              <p>df = pd.read_csv(<span className="text-[var(--theme-accent3)]">'panel_data.csv'</span>)</p>
              <p className="mt-2 text-gray-500"># 2. Fixed Effects Model</p>
              <p>y = df[<span className="text-[var(--theme-accent3)]">'innovation'</span>]</p>
              <p>X = df[[<span className="text-[var(--theme-accent3)]">'digital_trans'</span>, <span className="text-[var(--theme-accent3)]">'size'</span>, <span className="text-[var(--theme-accent3)]">'age'</span>]]</p>
              <p>model = sm.OLS(y, X).fit(cov_type=<span className="text-[var(--theme-accent3)]">'HC1'</span>)</p>
              <p className="mt-2">print(model.summary())</p>
            </div>
          </div>
        </motion.div>

        {/* Trust Endorsement & Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center font-heading">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className="p-6 bg-[var(--theme-dark-hover)] rounded-2xl border border-gray-800"
          >
            <div className="text-3xl md:text-4xl font-bold text-[var(--theme-accent1)] mb-2">1000+</div>
            <div className="text-sm text-gray-400">已服务用户</div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            viewport={{ once: true }}
            className="p-6 bg-[var(--theme-dark-hover)] rounded-2xl border border-gray-800"
          >
            <div className="text-3xl md:text-4xl font-bold text-[var(--theme-accent2)] mb-2">15分钟</div>
            <div className="text-sm text-gray-400">平均完成时间</div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            viewport={{ once: true }}
            className="p-6 bg-[var(--theme-dark-hover)] rounded-2xl border border-gray-800"
          >
            <div className="text-3xl md:text-4xl font-bold text-[var(--theme-accent3)] mb-2">96%</div>
            <div className="text-sm text-gray-400">用户满意度</div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            viewport={{ once: true }}
            className="p-6 bg-[var(--theme-dark-hover)] rounded-2xl border border-gray-800"
          >
            <div className="text-3xl md:text-4xl font-bold text-[var(--theme-light)] mb-2">50+</div>
            <div className="text-sm text-gray-400">竞赛获奖案例</div>
          </motion.div>
        </div>

      </div>
    </section>
  );
};
