import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Clock, BrainCircuit, Code, FileText, Mic, Medal, Star, Award } from 'lucide-react';

export const CompetitionSection: React.FC = () => {
  const painPoints = [
    { icon: <Clock size={20} />, pain: "时间紧（通常2周内完成）", solution: "自然语言即时出结果，效率提升10倍" },
    { icon: <BrainCircuit size={20} />, pain: "不会数据分析方法", solution: "说出研究问题，AI推荐方法" },
    { icon: <Code size={20} />, pain: "代码不会写/老出错", solution: "不用写代码，开口就行" },
    { icon: <FileText size={20} />, pain: "结果格式不规范", solution: "自动生成学术三线表" },
    { icon: <Mic size={20} />, pain: "答辩解释不清", solution: "每一步都有AI解读" }
  ];

  const cases = [
    {
      title: "某高校本科生团队",
      competition: "全国大学生统计建模大赛",
      icon: <Trophy className="text-[var(--theme-accent1)]" size={32} />,
      method: "用自然语言描述研究问题 → AI推荐DID方法 → 即时出结果",
      result: "省一等奖 → 国赛二等奖",
      time: "2周完成（原需2个月）",
      highlight: "答辩时每一步都能清晰解释"
    },
    {
      title: "某985研究生",
      competition: "正大杯市场调研大赛",
      icon: <Medal className="text-[var(--theme-accent2)]" size={32} />,
      method: "自然语言对话完成数据分析全流程",
      result: "全国总决赛银奖",
      time: "不到1周",
      highlight: "\"不用学代码，专注研究本身\""
    },
    {
      title: "某双非本科生",
      competition: "数学建模国赛",
      icon: <Award className="text-[var(--theme-accent3)]" size={32} />,
      method: "Vibe Coding完成数据处理和模型构建",
      result: "省一等奖",
      time: "3天完成",
      highlight: "零编程基础，照样拿奖"
    }
  ];

  return (
    <section className="py-24 bg-[var(--theme-light)] text-[var(--theme-dark)]">
      <div className="container mx-auto px-4 md:px-6">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-4xl mx-auto mb-16"
        >
          <div className="inline-flex items-center justify-center p-3 bg-[var(--theme-accent1)]/10 rounded-full mb-6">
            <Trophy size={40} className="text-[var(--theme-accent1)]" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold font-heading mb-6">
            统计建模国奖直达车
          </h2>
          <p className="text-xl font-body text-gray-600">
            全国大学生统计建模大赛、正大杯、数学建模<br/>
            <span className="font-semibold text-[var(--theme-accent1)]">用Vibe Coding武装你的竞赛之路</span>
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          
          {/* Pain Points */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-6"
          >
            <h3 className="text-2xl font-heading font-bold mb-8">竞赛痛点 vs 解决方案</h3>
            <div className="space-y-4">
              {painPoints.map((item, i) => (
                <div key={i} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--theme-accent2)]"></div>
                  <div className="flex flex-col space-y-3">
                    <div className="flex items-center gap-2 text-gray-500 font-medium">
                      {item.icon} <span className="line-through">{item.pain}</span>
                    </div>
                    <div className="text-[var(--theme-dark)] font-body font-semibold pl-7">
                      ✨ {item.solution}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Cases */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            <h3 className="text-2xl font-heading font-bold mb-8 flex items-center gap-2">
              <Star className="text-[var(--theme-accent1)]" /> 成功案例
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {cases.map((c, i) => (
                <div key={i} className={`bg-white p-6 rounded-2xl shadow-md border border-gray-100 ${i === 2 ? 'md:col-span-2 md:flex md:gap-6 md:items-center' : ''}`}>
                  <div className={`flex items-center gap-4 mb-4 ${i === 2 ? 'md:mb-0 md:w-1/3 md:flex-col md:text-center' : ''}`}>
                    <div className="p-3 bg-gray-50 rounded-xl">
                      {c.icon}
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-lg">{c.title}</h4>
                      <p className="text-sm text-gray-500">{c.competition}</p>
                    </div>
                  </div>
                  <div className={`space-y-3 font-body text-sm ${i === 2 ? 'md:w-2/3 md:space-y-2' : ''}`}>
                    <div className="flex items-start gap-2">
                      <span className="text-gray-400 font-semibold min-w-[40px]">方法:</span>
                      <span className="text-gray-700">{c.method}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-gray-400 font-semibold min-w-[40px]">结果:</span>
                      <span className="font-bold text-[var(--theme-accent1)]">{c.result}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-gray-400 font-semibold min-w-[40px]">用时:</span>
                      <span className="text-gray-700">{c.time}</span>
                    </div>
                    <div className="flex items-start gap-2 pt-2 border-t border-gray-100">
                      <span className="text-gray-400 font-semibold min-w-[40px]">亮点:</span>
                      <span className="text-[var(--theme-accent3)] font-semibold italic">"{c.highlight}"</span>
                    </div>
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
