import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  MessageSquare, 
  Database, 
  BrainCircuit, 
  ShieldCheck, 
  BookOpen, 
  Trophy, 
  Code,
  Sparkles,
  CheckCircle2,
  Gift,
  Share2,
  Users,
  ChevronRight,
  Lock,
  FileText
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import DynamicBackground from "@/components/DynamicBackground";

export default function Home() {
  const { isAuthenticated, openAuthModal } = useAuthStore();

  return (
    <div className="bg-slate-950 text-slate-300 font-sans selection:bg-[#6a9bcc]/30 selection:text-[#6a9bcc] relative min-h-screen overflow-x-hidden">
      <DynamicBackground />
      
      {/* 1. Hero Section */}
      <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-screen-xl -z-10 opacity-30 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#6a9bcc]/20 blur-[120px]"></div>
          <div className="absolute top-[20%] right-[-10%] w-[30%] h-[30%] rounded-full bg-[#d97757]/10 blur-[120px]"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center space-x-4 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-slate-200 text-sm font-medium mb-8 shadow-[0_0_15px_rgba(106,155,204,0.15)]"
        >
          <span className="flex items-center text-[#d97757]"><Sparkles className="w-4 h-4 mr-1.5" /> Vibe Coding 新范式</span>
          <span className="w-1 h-1 rounded-full bg-white/30"></span>
          <span className="flex items-center text-[#788c5d]"><Trophy className="w-4 h-4 mr-1.5" /> 国奖直达车</span>
          <span className="w-1 h-1 rounded-full bg-white/30"></span>
          <span className="flex items-center text-[#6a9bcc]"><CheckCircle2 className="w-4 h-4 mr-1.5" /> 全流程覆盖</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tight text-white max-w-4xl leading-[1.15] font-serif"
        >
          用自然语言做数据分析<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6a9bcc] via-white to-[#d97757]">告别代码，开口就能出结果</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 text-xl text-slate-400 max-w-2xl leading-relaxed font-light"
        >
          不再学 Stata、不再敲 Python、不再调 SPSS。<br/>
          用你的母语，说你想分析的，AI 替你执行。
        </motion.p>

        {/* 震撼对比卡片 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="p-6 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm flex flex-col justify-center">
            <h3 className="text-slate-500 font-medium mb-4 text-sm uppercase tracking-wider">传统方式</h3>
            <ul className="space-y-3 text-left">
              <li className="flex items-center text-slate-400"><span className="w-1.5 h-1.5 rounded-full bg-slate-600 mr-3"></span>学 Stata：2个月</li>
              <li className="flex items-center text-slate-400"><span className="w-1.5 h-1.5 rounded-full bg-slate-600 mr-3"></span>学 Python：3个月</li>
              <li className="flex items-center text-slate-400"><span className="w-1.5 h-1.5 rounded-full bg-slate-600 mr-3"></span>学 SPSS：1个月</li>
              <li className="flex items-center text-slate-400"><span className="w-1.5 h-1.5 rounded-full bg-slate-600 mr-3"></span>调试代码：数小时</li>
            </ul>
          </div>
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#6a9bcc]/10 to-[#d97757]/10 border border-white/10 backdrop-blur-sm relative overflow-hidden flex flex-col justify-center">
            <div className="absolute top-0 right-0 p-3 opacity-20"><BrainCircuit className="w-24 h-24 text-white" /></div>
            <h3 className="text-white font-medium mb-4 text-sm uppercase tracking-wider relative z-10">DeepResValue 方式</h3>
            <ul className="space-y-3 text-left relative z-10">
              <li className="flex items-center text-white font-medium"><span className="w-1.5 h-1.5 rounded-full bg-[#6a9bcc] shadow-[0_0_8px_#6a9bcc] mr-3"></span>说出需求：10秒</li>
              <li className="flex items-center text-white font-medium"><span className="w-1.5 h-1.5 rounded-full bg-[#6a9bcc] shadow-[0_0_8px_#6a9bcc] mr-3"></span>AI自动执行：1分钟</li>
              <li className="flex items-center text-white font-medium"><span className="w-1.5 h-1.5 rounded-full bg-[#6a9bcc] shadow-[0_0_8px_#6a9bcc] mr-3"></span>结果输出：即刻呈现</li>
              <li className="flex items-center text-white font-medium"><span className="w-1.5 h-1.5 rounded-full bg-[#d97757] shadow-[0_0_8px_#d97757] mr-3"></span>修改需求：再说一遍</li>
            </ul>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6"
        >
          {isAuthenticated ? (
            <Link to="/chat" className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-[#6a9bcc] rounded-xl overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(106,155,204,0.4)]">
              <span className="absolute inset-0 w-full h-full rounded-xl opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
              <span className="relative flex items-center">进入研究室 <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" /></span>
            </Link>
          ) : (
            <button onClick={() => openAuthModal('register')} className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-[#6a9bcc] to-[#d97757] rounded-xl overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(217,119,87,0.4)]">
              <span className="absolute inset-0 w-full h-full rounded-xl opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
              <span className="relative flex items-center">免费注册，体验 Vibe Coding <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" /></span>
            </button>
          )}
        </motion.div>
      </section>

      {/* 2. Vibe Coding 新范式 */}
      <section className="py-24 relative z-10 border-t border-white/5 bg-slate-950/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white font-serif mb-4 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-[#d97757] mr-3" />
              Vibe Coding：用自然语言开启研究新纪元
            </h2>
            <p className="text-lg text-slate-400 font-light">
              为什么非得学代码？传统的 Stata、Python、R 只是工具，你要的是研究结果。<br/>
              DeepResValue 让你用母语做研究——说出你的想法，AI 替你执行。
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-stretch">
            {/* 传统代码 */}
            <div className="rounded-2xl bg-black/40 border border-slate-800 p-6 flex flex-col h-full font-mono text-sm relative">
              <div className="absolute top-4 right-4 px-3 py-1 rounded bg-slate-800 text-slate-400 text-xs font-sans">传统 Stata 代码</div>
              <div className="text-slate-500 mb-4 font-sans"># 需要先学语法，查文档，处理报错</div>
              <div className="space-y-2 text-slate-300 flex-1">
                <p><span className="text-pink-500">reg</span> y x1 x2 x3, <span className="text-purple-400">robust</span></p>
                <p><span className="text-pink-500">estat</span> vif</p>
                <p><span className="text-pink-500">outreg2</span> <span className="text-blue-400">using</span> result.doc, <span className="text-purple-400">replace</span></p>
                <p className="text-slate-600 mt-4"># 稳健性检验要另外写</p>
                <p><span className="text-pink-500">xtreg</span> y x1 x2, <span className="text-purple-400">fe</span></p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800 text-slate-500 font-sans text-sm">
                学习成本：数月甚至数年<br/>出错概率：极高
              </div>
            </div>

            {/* Vibe Coding */}
            <div className="rounded-2xl bg-gradient-to-b from-[#6a9bcc]/10 to-transparent border border-[#6a9bcc]/20 p-6 flex flex-col h-full relative">
              <div className="absolute top-4 right-4 px-3 py-1 rounded bg-[#6a9bcc]/20 text-[#6a9bcc] text-xs font-bold shadow-[0_0_10px_rgba(106,155,204,0.2)]">DeepResValue 方式</div>
              
              <div className="flex-1 space-y-6 mt-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0">👤</div>
                  <div className="bg-slate-800/80 rounded-2xl rounded-tl-none p-4 text-slate-200 text-sm border border-white/5 shadow-md">
                    帮我分析数字化转型对企业创新的影响，用面板数据的固定效应模型，加上稳健标准误，输出三线表到Word。
                  </div>
                </div>
                
                <div className="flex items-start gap-4 flex-row-reverse">
                  <div className="w-8 h-8 rounded-full bg-[#6a9bcc] flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(106,155,204,0.5)]">🤖</div>
                  <div className="bg-[#6a9bcc]/10 rounded-2xl rounded-tr-none p-4 text-white text-sm border border-[#6a9bcc]/30 shadow-md">
                    <p className="mb-2 text-[#6a9bcc] font-medium">好的，正在执行...</p>
                    <ul className="space-y-1 text-slate-300">
                      <li className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-2 text-[#788c5d]" /> 固定效应回归完成</li>
                      <li className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-2 text-[#788c5d]" /> R² = 0.452</li>
                      <li className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-2 text-[#788c5d]" /> 核心变量显著 (p&lt;0.01)</li>
                      <li className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-2 text-[#788c5d]" /> 三线表已生成</li>
                    </ul>
                    <p className="mt-3 text-sm text-[#d97757]">需要进行稳健性检验吗？</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-white/10 text-white font-sans text-sm flex justify-between">
                <span>学习成本：<strong className="text-[#6a9bcc]">0</strong></span>
                <span>AI理解意图，自动纠错</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 你不需要再学的工具 */}
      <section className="py-24 relative z-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white font-serif mb-4">这些工具，你可以不用学了</h2>
            <p className="text-slate-400">DeepResValue 底层支持所有这些工具的能力，但自然语言就是你的编程语言。</p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-16 max-w-4xl mx-auto">
            {['Stata', 'SPSS', 'Eviews', 'Python', 'R', 'SAS', 'MATLAB', 'Julia'].map((tool) => (
              <div key={tool} className="relative group">
                <div className="px-6 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-500 font-bold text-lg line-through opacity-60 flex items-center">
                  {tool}
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-xs font-bold border border-red-500/30 backdrop-blur-sm">无需学习</span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden max-w-5xl mx-auto backdrop-blur-sm">
            <div className="grid md:grid-cols-3 bg-white/5 p-4 font-bold text-white text-sm">
              <div className="px-4">你想要的</div>
              <div className="px-4">你说的</div>
              <div className="px-4 text-[#6a9bcc]">AI 执行的</div>
            </div>
            {[
              { want: "描述性统计", say: "给我看一下数据的基本情况", do: "均值、标准差、分布图" },
              { want: "回归分析", say: "分析X对Y的影响，控制Z", do: "OLS/固定效应 + 三线表" },
              { want: "因果推断", say: "用DID方法分析政策效果", do: "平行趋势 + 处理效应" },
              { want: "文献综述", say: "帮我找这个领域的核心文献", do: "顶刊检索 + 观点提取" },
              { want: "论文写作", say: "帮我写实证部分", do: "规范学术输出" },
            ].map((row, i) => (
              <div key={i} className="grid md:grid-cols-3 border-t border-white/5 p-4 text-sm hover:bg-white/[0.03] transition-colors">
                <div className="px-4 text-slate-300 flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-[#d97757] mr-3"></span>{row.want}</div>
                <div className="px-4 text-slate-400 italic">"{row.say}"</div>
                <div className="px-4 text-white font-medium flex items-center"><ArrowRight className="w-4 h-4 mr-2 text-[#6a9bcc]" /> {row.do}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. 国家级竞赛专区 */}
      <section className="py-24 relative z-10 border-t border-white/5 bg-gradient-to-b from-transparent to-[#788c5d]/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-[#788c5d]/20 border border-[#788c5d]/30 mb-6 shadow-[0_0_20px_rgba(120,140,93,0.3)]">
              <Trophy className="w-8 h-8 text-[#788c5d]" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white font-serif mb-4">统计建模国奖直达车</h2>
            <p className="text-lg text-slate-400 font-light max-w-2xl mx-auto">
              全国大学生统计建模大赛、正大杯、数学建模——用 Vibe Coding 武装你的竞赛之路
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                title: "某高校本科生团队",
                contest: "全国大学生统计建模大赛",
                result: "国赛二等奖",
                time: "2周完成 (原需2个月)",
                highlight: "答辩时每一步都能清晰解释"
              },
              {
                title: "某 985 研究生",
                contest: "正大杯市场调研大赛",
                result: "全国总决赛银奖",
                time: "自然语言对话完成全流程",
                highlight: "不用学代码，专注研究本身"
              },
              {
                title: "某双非本科生",
                contest: "数学建模国赛",
                result: "省级一等奖",
                time: "Vibe Coding 数据处理",
                highlight: "零编程基础，照样拿奖"
              }
            ].map((caseItem, i) => (
              <div key={i} className="bg-slate-900/80 border border-[#788c5d]/20 rounded-2xl p-6 backdrop-blur-md hover:border-[#788c5d]/50 hover:shadow-[0_10px_30px_rgba(120,140,93,0.15)] transition-all">
                <h3 className="text-white font-bold text-lg mb-1">{caseItem.title}</h3>
                <p className="text-[#788c5d] text-sm font-medium mb-6">{caseItem.contest}</p>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <Trophy className="w-4 h-4 text-amber-400 mr-3 mt-0.5" />
                    <div>
                      <div className="text-xs text-slate-500">最终成绩</div>
                      <div className="text-white font-medium">{caseItem.result}</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Zap className="w-4 h-4 text-[#6a9bcc] mr-3 mt-0.5" />
                    <div>
                      <div className="text-xs text-slate-500">效率提升</div>
                      <div className="text-slate-300 text-sm">{caseItem.time}</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Sparkles className="w-4 h-4 text-[#d97757] mr-3 mt-0.5" />
                    <div>
                      <div className="text-xs text-slate-500">核心亮点</div>
                      <div className="text-slate-300 text-sm">"{caseItem.highlight}"</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. 全流程能力 */}
      <section className="py-24 relative z-10 border-t border-white/5 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white font-serif mb-16">自然语言驱动的全流程能力</h2>
          
          <div className="relative max-w-5xl mx-auto">
            {/* 连接线 */}
            <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-transparent via-[#6a9bcc]/30 to-transparent -z-10"></div>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { step: "①", title: "研究设计", action: '"我想研究..."', icon: BrainCircuit },
                { step: "②", title: "数据获取", action: '"帮我找数据..."', icon: Database },
                { step: "③", title: "文献综述", action: '"综述一下..."', icon: BookOpen },
                { step: "④", title: "实证分析", action: '"分析影响..."', icon: BarChart2 },
                { step: "⑤", title: "论文撰写", action: '"写成论文..."', icon: FileText }
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center group cursor-default">
                  <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center mb-4 group-hover:bg-[#6a9bcc]/20 group-hover:border-[#6a9bcc]/50 group-hover:shadow-[0_0_20px_rgba(106,155,204,0.3)] transition-all z-10">
                    <item.icon className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors" />
                  </div>
                  <div className="text-white font-bold mb-1">{item.step} {item.title}</div>
                  <div className="text-xs text-[#6a9bcc] bg-[#6a9bcc]/10 px-2 py-1 rounded border border-[#6a9bcc]/20 mt-2 font-mono">
                    {item.action}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6 & 7. 邀请机制与校园大使 */}
      <section className="py-24 relative z-10 border-t border-white/5 bg-gradient-to-b from-transparent to-[#d97757]/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* 邀请好友 */}
            <div className="bg-slate-900/80 rounded-3xl p-8 border border-white/10 backdrop-blur-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#d97757]/10 rounded-full blur-3xl"></div>
              <h3 className="text-2xl font-bold text-white flex items-center mb-6 relative z-10">
                <Gift className="w-6 h-6 mr-3 text-[#d97757]" /> 邀请好友，双向得积分
              </h3>
              
              <div className="flex items-center justify-center space-x-4 mb-8 relative z-10">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-2 text-2xl">😎</div>
                  <div className="text-sm text-slate-400">你获得</div>
                  <div className="font-bold text-[#d97757]">+100 积分</div>
                </div>
                <div className="flex-1 flex items-center justify-center opacity-50">
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-white to-transparent"></div>
                  <Share2 className="w-5 h-5 mx-2 text-white" />
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-white to-transparent"></div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-[#d97757]/20 border border-[#d97757]/30 flex items-center justify-center mx-auto mb-2 text-2xl">🤩</div>
                  <div className="text-sm text-slate-400">好友获得</div>
                  <div className="font-bold text-[#d97757]">+50 积分</div>
                </div>
              </div>

              <div className="bg-black/30 rounded-xl p-4 border border-white/5 relative z-10">
                <h4 className="text-sm font-bold text-white mb-3 border-b border-white/5 pb-2">积分商城兑换</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between text-slate-300"><span>500 积分</span> <span className="text-white">7天VIP会员</span></li>
                  <li className="flex justify-between text-slate-300"><span>1000 积分</span> <span className="text-white">¥50现金红包</span></li>
                  <li className="flex justify-between text-slate-300"><span>2000 积分</span> <span className="text-white">《实证分析避坑指南》电子书</span></li>
                  <li className="flex justify-between text-slate-300"><span>5000 积分</span> <span className="text-[#d97757] font-medium">一对一导师咨询1次</span></li>
                </ul>
              </div>
            </div>

            {/* 校园大使 */}
            <div className="bg-slate-900/80 rounded-3xl p-8 border border-white/10 backdrop-blur-md relative overflow-hidden flex flex-col">
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#6a9bcc]/10 rounded-full blur-3xl"></div>
              <h3 className="text-2xl font-bold text-white flex items-center mb-2 relative z-10">
                <Users className="w-6 h-6 mr-3 text-[#6a9bcc]" /> 校园研究大使招募
              </h3>
              <p className="text-slate-400 text-sm mb-6 relative z-10">成为 Vibe Coding 新范式的布道者</p>

              <div className="grid grid-cols-2 gap-4 mb-8 relative z-10">
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <div className="text-lg mb-1">💰</div>
                  <div className="text-white font-medium text-sm">推广佣金 10-30%</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <div className="text-lg mb-1">🎓</div>
                  <div className="text-white font-medium text-sm">免费使用全部功能</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <div className="text-lg mb-1">🔥</div>
                  <div className="text-white font-medium text-sm">专属邀请码永久返利</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <div className="text-lg mb-1">🏆</div>
                  <div className="text-white font-medium text-sm">官方实习证明/证书</div>
                </div>
              </div>

              <div className="mt-auto bg-[#6a9bcc]/10 rounded-xl p-4 border border-[#6a9bcc]/20 text-center relative z-10">
                <p className="text-sm text-slate-300 mb-2">添加微信申请</p>
                <div className="text-xl font-bold text-white tracking-wider">MoChen11-20</div>
                <p className="text-xs text-[#6a9bcc] mt-1">备注 "校园大使+学校+姓名"</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8 & 10. 核心优势与信任背书 */}
      <section className="py-24 relative z-10 border-t border-white/5 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white font-serif mb-4">为什么选择 DeepResValue？</h2>
            <p className="text-slate-400">国产顶尖 AI 驱动，结果可信可复现</p>
          </div>

          {/* 统计条 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            <div className="text-center p-6 bg-white/[0.02] rounded-2xl border border-white/5">
              <div className="text-3xl font-bold text-white mb-1">1000+</div>
              <div className="text-sm text-slate-500">已服务用户</div>
            </div>
            <div className="text-center p-6 bg-white/[0.02] rounded-2xl border border-white/5">
              <div className="text-3xl font-bold text-white mb-1">15<span className="text-xl">min</span></div>
              <div className="text-sm text-slate-500">平均完成时间</div>
            </div>
            <div className="text-center p-6 bg-white/[0.02] rounded-2xl border border-white/5">
              <div className="text-3xl font-bold text-white mb-1">96%</div>
              <div className="text-sm text-slate-500">用户满意度</div>
            </div>
            <div className="text-center p-6 bg-white/[0.02] rounded-2xl border border-white/5">
              <div className="text-3xl font-bold text-white mb-1">50+</div>
              <div className="text-sm text-slate-500">竞赛获奖案例</div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center"><BrainCircuit className="w-5 h-5 mr-2 text-[#6a9bcc]" /> DeepSeek V4 Pro 底座</h3>
              <p className="text-slate-400 text-sm leading-relaxed">搭载国产顶尖大模型，支持 100万 Token 超长上下文与深度推理。完美理解复杂的学术要求与计量经济学逻辑。</p>
            </div>
            <div className="p-6 border-t md:border-t-0 md:border-l border-white/10">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center"><Code className="w-5 h-5 mr-2 text-[#788c5d]" /> 结果可信可复现</h3>
              <p className="text-slate-400 text-sm leading-relaxed">你的结果，任何人都能复现。分析完成后可导出完整 Python/R/Stata 代码。答辩时清晰展示每一步，审稿人可轻松验证。</p>
            </div>
            <div className="p-6 border-t md:border-t-0 md:border-l border-white/10">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center"><Lock className="w-5 h-5 mr-2 text-[#d97757]" /> 全程透明合规</h3>
              <p className="text-slate-400 text-sm leading-relaxed">国内服务器独立部署，不依赖国外 API，保障独家数据绝对安全。你主导研究方向，AI 负责执行，合规无忧。</p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. 底部 CTA */}
      <section className="py-32 relative z-10 border-t border-white/5 bg-slate-950 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#6a9bcc]/5 to-transparent"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold text-white font-serif mb-8 leading-tight">
            别再学代码了，<br/>直接用母语做研究
          </h2>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            {isAuthenticated ? (
              <Link to="/chat" className="w-full sm:w-auto px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-[#6a9bcc] to-[#d97757] rounded-xl hover:scale-105 transition-transform shadow-[0_0_30px_rgba(106,155,204,0.3)]">
                进入工作区
              </Link>
            ) : (
              <button onClick={() => openAuthModal('register')} className="w-full sm:w-auto px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-[#6a9bcc] to-[#d97757] rounded-xl hover:scale-105 transition-transform shadow-[0_0_30px_rgba(106,155,204,0.3)]">
                免费注册，体验 Vibe Coding
              </button>
            )}
            
            <div className="w-full sm:w-auto px-8 py-4 text-lg font-medium text-slate-300 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm flex flex-col items-center">
              <span>添加微信咨询</span>
              <span className="text-sm text-[#6a9bcc] mt-0.5">MoChen11-20</span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-400">
            <span className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-1 text-[#788c5d]" /> 注册即送 50 初始积分</span>
            <span className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-1 text-[#788c5d]" /> 输入邀请码额外奖励</span>
            <span className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-1 text-[#788c5d]" /> 加微信送《实证避坑指南》</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-12 relative z-10 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-center md:text-left text-slate-600 font-light space-y-4 md:space-y-0 text-sm">
          <div>
            <p className="font-bold text-slate-400 text-base mb-1">DeepResValue 深度研值</p>
            <p>© 2026 赋能严肃学术与数据科学研究。</p>
          </div>
          <div className="flex items-center justify-center space-x-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
            <span className="w-2 h-2 rounded-full bg-[#788c5d] shadow-[0_0_8px_#788c5d] animate-pulse"></span>
            <span>客服微信: <strong className="text-slate-300 font-medium">MoChen11-20</strong></span>
          </div>
        </div>
      </footer>
    </div>
  );
}