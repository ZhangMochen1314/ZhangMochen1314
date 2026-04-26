import React from 'react';
import { motion } from 'framer-motion';
import { X, Check } from 'lucide-react';

export const ToolsSection: React.FC = () => {
  const tools = ['Stata', 'SPSS', 'Eviews', 'Python', 'R', 'SAS', 'MATLAB', 'Julia'];
  
  const scenarios = [
    { want: "描述性统计", say: "给我看一下数据的基本情况", do: "均值、标准差、分布图" },
    { want: "回归分析", say: "分析X对Y的影响，控制Z", do: "OLS/固定效应 + 三线表" },
    { want: "因果推断", say: "用DID方法分析政策效果", do: "平行趋势 + 处理效应" },
    { want: "文献综述", say: "帮我找这个领域的核心文献", do: "顶刊检索 + 观点提取" },
    { want: "论文写作", say: "帮我写实证部分", do: "规范学术输出" }
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
            📚 这些工具，你可以不用学了
          </h2>
          <p className="text-xl font-body text-gray-400">
            自然语言就是你的编程语言
          </p>
        </motion.div>

        {/* Tools Wall */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-20 max-w-4xl mx-auto">
          {tools.map((tool, index) => (
            <motion.div
              key={tool}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="px-6 py-4 rounded-xl bg-[var(--theme-dark-hover)] border border-gray-800 flex items-center justify-center gap-3 text-xl font-heading font-semibold text-gray-500 opacity-60 group-hover:opacity-100 transition-opacity">
                <X className="text-[var(--theme-accent1)]" size={24} />
                <span className="line-through decoration-[var(--theme-accent1)] decoration-2">{tool}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Explanation */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h3 className="text-3xl font-heading font-bold leading-tight">
              DeepResValue 底层支持<br/>
              <span className="text-[var(--theme-accent2)]">所有这些工具的能力</span>
            </h3>
            
            <ul className="space-y-4 font-body text-lg text-gray-300">
              <li className="flex items-center gap-3"><Check className="text-[var(--theme-accent3)]" /> Stata 的回归分析</li>
              <li className="flex items-center gap-3"><Check className="text-[var(--theme-accent3)]" /> Python 的数据处理</li>
              <li className="flex items-center gap-3"><Check className="text-[var(--theme-accent3)]" /> R 的统计建模</li>
              <li className="flex items-center gap-3"><Check className="text-[var(--theme-accent3)]" /> SPSS 的界面友好</li>
              <li className="flex items-center gap-3"><Check className="text-[var(--theme-accent3)]" /> Eviews 的时间序列</li>
            </ul>

            <div className="p-6 rounded-xl bg-gradient-to-r from-[var(--theme-accent1)]/10 to-transparent border-l-4 border-[var(--theme-accent1)]">
              <p className="font-body text-xl text-gray-200">
                但你不需要学它们 —— <strong className="text-white">自然语言就是你的编程语言。</strong>
              </p>
            </div>
          </motion.div>

          {/* Use Cases Table */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-[var(--theme-dark-hover)] rounded-2xl border border-gray-800 overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left font-body">
                <thead className="bg-[var(--theme-card-dark)] font-heading text-gray-300">
                  <tr>
                    <th className="p-4 font-semibold">你想要的</th>
                    <th className="p-4 font-semibold">你说的</th>
                    <th className="p-4 font-semibold">AI执行的</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800 text-gray-400">
                  {scenarios.map((s, i) => (
                    <tr key={i} className="hover:bg-[#222221] transition-colors">
                      <td className="p-4 font-medium text-gray-200 whitespace-nowrap">{s.want}</td>
                      <td className="p-4 italic">"{s.say}"</td>
                      <td className="p-4 text-[var(--theme-accent2)]">{s.do}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
