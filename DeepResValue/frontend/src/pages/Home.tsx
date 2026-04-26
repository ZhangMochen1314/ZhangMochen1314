import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
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
  FileText,
  Zap,
  BarChart2,
  Command,
  Loader2
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import DynamicBackground from "@/components/DynamicBackground";

const FadeIn = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }}
    className={className}
  >
    {children}
  </motion.div>
);

export default function Home() {
  const { isAuthenticated, openAuthModal } = useAuthStore();
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, 100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  return (
    <div className="bg-[#0a0a0c] text-slate-300 font-sans selection:bg-[#6a9bcc]/30 selection:text-[#6a9bcc] relative min-h-screen overflow-x-hidden">
      <DynamicBackground />
      
      {/* Texture Overlay */}
      <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

      {/* Grid Background */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

      {/* 1. Hero Section */}
      <section className="relative pt-40 pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center z-10 min-h-screen justify-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-screen-xl -z-10 opacity-40 pointer-events-none">
          <div className="absolute top-[-10%] left-[10%] w-[30%] h-[40%] rounded-full bg-[#6a9bcc]/20 blur-[150px] mix-blend-screen"></div>
          <div className="absolute top-[20%] right-[10%] w-[25%] h-[30%] rounded-full bg-[#d97757]/15 blur-[150px] mix-blend-screen"></div>
        </div>

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="flex flex-col items-center w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center space-x-4 px-6 py-2.5 rounded-full bg-[#ffffff05] border border-white/10 backdrop-blur-xl text-slate-200 text-sm font-medium mb-10 shadow-[0_4px_24px_-8px_rgba(106,155,204,0.2)] hover:bg-[#ffffff08] transition-colors"
          >
            <span className="flex items-center text-[#d97757]"><Sparkles className="w-4 h-4 mr-2" /> Vibe Coding 新范式</span>
            <span className="w-1 h-1 rounded-full bg-white/20"></span>
            <span className="flex items-center text-[#788c5d]"><Trophy className="w-4 h-4 mr-2" /> 国奖直达车</span>
            <span className="w-1 h-1 rounded-full bg-white/20"></span>
            <span className="flex items-center text-[#6a9bcc]"><Command className="w-4 h-4 mr-2" /> 全流程覆盖</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="text-6xl sm:text-7xl md:text-[5.5rem] font-extrabold tracking-[-0.03em] text-white max-w-5xl leading-[1.05] font-serif"
          >
            用自然语言做数据分析<br/>
            <span className="relative inline-block mt-4">
              <span className="absolute -inset-1 block bg-gradient-to-r from-[#6a9bcc]/20 via-[#d97757]/20 to-transparent blur-2xl rounded-full"></span>
              <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-[#6a9bcc] via-white to-[#d97757]">告别代码，开口即出结果</span>
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="mt-10 text-xl md:text-2xl text-slate-400 max-w-3xl leading-relaxed font-light tracking-wide"
          >
            不再学 Stata、不再敲 Python、不再调 SPSS。<br/>
            用你的母语，说你想分析的，<span className="text-white font-medium">AI 替你执行。</span>
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            className="mt-14 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 w-full max-w-lg justify-center"
          >
            {isAuthenticated ? (
              <Link to="/chat" className="group relative w-full inline-flex items-center justify-center px-8 py-5 text-lg font-bold text-white bg-[#1c1c1c] border border-white/10 rounded-2xl overflow-hidden transition-all hover:scale-[1.02] hover:bg-[#252525] hover:border-[#6a9bcc]/50 hover:shadow-[0_0_40px_rgba(106,155,204,0.3)]">
                <span className="relative flex items-center tracking-wide">进入研究室 <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1.5 transition-transform" /></span>
              </Link>
            ) : (
              <button onClick={() => openAuthModal('register')} className="group relative w-full inline-flex items-center justify-center px-8 py-5 text-lg font-bold text-white bg-gradient-to-r from-[#6a9bcc] to-[#d97757] rounded-2xl overflow-hidden transition-all hover:scale-[1.02] hover:shadow-[0_0_50px_rgba(217,119,87,0.4)]">
                <span className="absolute inset-0 w-full h-full rounded-2xl opacity-0 group-hover:opacity-20 bg-white transition-opacity"></span>
                <span className="relative flex items-center tracking-wide shadow-sm">免费注册，体验 Vibe Coding <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1.5 transition-transform" /></span>
              </button>
            )}
          </motion.div>
        </motion.div>
      </section>

      {/* 2. Vibe Coding 新范式 */}
      <section className="py-32 relative z-10 border-t border-white/5 bg-[#0a0a0c]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white font-serif mb-6 flex items-center justify-center tracking-tight">
              <Sparkles className="w-10 h-10 text-[#d97757] mr-4" />
              Vibe Coding
            </h2>
            <p className="text-xl text-slate-400 font-light leading-relaxed">
              为什么非得学代码？传统的 Stata、Python、R 只是工具，你要的是研究结果。<br/>
              DeepResValue 让你用母语做研究——<span className="text-white">说出你的想法，AI 替你执行。</span>
            </p>
          </FadeIn>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
            {/* 传统代码 */}
            <FadeIn delay={0.1} className="rounded-[2rem] bg-[#111113] border border-white/5 p-8 flex flex-col h-full font-mono text-sm relative overflow-hidden group hover:border-white/10 transition-colors shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-slate-800 to-slate-700"></div>
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-slate-800"></div>
                  <div className="w-3 h-3 rounded-full bg-slate-800"></div>
                  <div className="w-3 h-3 rounded-full bg-slate-800"></div>
                </div>
                <div className="px-3 py-1 rounded-full bg-white/5 text-slate-400 text-xs font-sans tracking-wider uppercase">传统方式</div>
              </div>
              
              <div className="text-slate-500 mb-6 font-sans text-base"># 需要先学语法，查文档，处理报错</div>
              <div className="space-y-3 text-slate-300 flex-1 text-base leading-relaxed">
                <div className="flex"><span className="text-slate-600 mr-4 select-none">1</span><p><span className="text-[#d97757]">reg</span> y x1 x2 x3, <span className="text-[#6a9bcc]">robust</span></p></div>
                <div className="flex"><span className="text-slate-600 mr-4 select-none">2</span><p><span className="text-[#d97757]">estat</span> vif</p></div>
                <div className="flex"><span className="text-slate-600 mr-4 select-none">3</span><p><span className="text-[#d97757]">outreg2</span> <span className="text-emerald-400">using</span> result.doc, <span className="text-[#6a9bcc]">replace</span></p></div>
                <div className="flex"><span className="text-slate-600 mr-4 select-none">4</span><p className="text-slate-600"># 稳健性检验要另外写</p></div>
                <div className="flex"><span className="text-slate-600 mr-4 select-none">5</span><p><span className="text-[#d97757]">xtreg</span> y x1 x2, <span className="text-[#6a9bcc]">fe</span></p></div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-white/5 text-slate-500 font-sans text-sm flex justify-between items-center bg-black/20 -mx-8 -mb-8 px-8 py-6">
                <div>学习成本：<span className="text-slate-300">数月甚至数年</span></div>
                <div>出错概率：<span className="text-red-400/80">极高</span></div>
              </div>
            </FadeIn>

            {/* Vibe Coding */}
            <FadeIn delay={0.2} className="rounded-[2rem] bg-gradient-to-b from-[#6a9bcc]/10 to-[#111113] border border-[#6a9bcc]/20 p-8 flex flex-col h-full relative overflow-hidden group hover:border-[#6a9bcc]/40 transition-colors shadow-[0_0_50px_rgba(106,155,204,0.05)]">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#6a9bcc] to-[#d97757]"></div>
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-[#6a9bcc]/40"></div>
                  <div className="w-3 h-3 rounded-full bg-[#d97757]/40"></div>
                  <div className="w-3 h-3 rounded-full bg-[#788c5d]/40"></div>
                </div>
                <div className="px-3 py-1 rounded-full bg-[#6a9bcc]/20 text-[#6a9bcc] text-xs font-bold font-sans tracking-wider uppercase shadow-[0_0_15px_rgba(106,155,204,0.2)]">DeepResValue</div>
              </div>
              
              <div className="flex-1 space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center shrink-0 border border-white/10 shadow-lg">👤</div>
                  <div className="bg-[#1c1c1c] rounded-2xl rounded-tl-none p-5 text-slate-200 text-base border border-white/5 shadow-xl leading-relaxed">
                    帮我分析数字化转型对企业创新的影响，用面板数据的固定效应模型，加上稳健标准误，输出三线表到Word。
                  </div>
                </div>
                
                <div className="flex items-start gap-4 flex-row-reverse">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6a9bcc] to-blue-600 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(106,155,204,0.4)]">🤖</div>
                  <div className="bg-[#6a9bcc]/10 rounded-2xl rounded-tr-none p-5 text-white text-base border border-[#6a9bcc]/20 shadow-xl backdrop-blur-md">
                    <p className="mb-4 text-[#6a9bcc] font-bold flex items-center"><Loader2 className="w-4 h-4 mr-2 animate-spin" /> 正在执行...</p>
                    <ul className="space-y-3 text-slate-200 font-medium">
                      <li className="flex items-center"><CheckCircle2 className="w-5 h-5 mr-3 text-[#788c5d]" /> 固定效应回归完成</li>
                      <li className="flex items-center"><CheckCircle2 className="w-5 h-5 mr-3 text-[#788c5d]" /> R² = 0.452</li>
                      <li className="flex items-center"><CheckCircle2 className="w-5 h-5 mr-3 text-[#788c5d]" /> 核心变量显著 (p&lt;0.01)</li>
                      <li className="flex items-center"><CheckCircle2 className="w-5 h-5 mr-3 text-[#788c5d]" /> 三线表已生成</li>
                    </ul>
                    <div className="mt-5 p-3 rounded-xl bg-black/20 border border-white/5 flex items-center justify-between">
                      <span className="text-sm text-[#d97757]">需要进行稳健性检验吗？</span>
                      <button className="px-3 py-1.5 rounded-lg bg-[#d97757]/20 text-[#d97757] text-xs font-bold hover:bg-[#d97757]/30 transition-colors">一键执行</button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-[#6a9bcc]/20 text-white font-sans text-sm flex justify-between items-center bg-[#6a9bcc]/5 -mx-8 -mb-8 px-8 py-6">
                <div>学习成本：<strong className="text-[#6a9bcc] text-lg">0</strong></div>
                <div className="flex items-center text-[#6a9bcc]"><Sparkles className="w-4 h-4 mr-2" /> AI 理解意图，自动纠错</div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 3. 你不需要再学的工具 */}
      <section className="py-32 relative z-10 border-t border-white/5 bg-[#050505] overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-screen-xl -z-10 opacity-20 pointer-events-none">
          <div className="absolute top-[20%] left-[20%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-[#1a1a24] to-[#2a1b18] blur-[100px]"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white font-serif mb-6 tracking-tight">这些工具，你可以<span className="text-[#d97757] italic">彻底放下</span>了</h2>
            <p className="text-xl text-slate-400 font-light max-w-2xl mx-auto">DeepResValue 底层支持所有这些工具的能力，但自然语言就是你的编程语言。</p>
          </FadeIn>

          <FadeIn delay={0.2} className="flex flex-wrap justify-center gap-4 md:gap-6 mb-24 max-w-5xl mx-auto">
            {['Stata', 'SPSS', 'Eviews', 'Python', 'R', 'SAS', 'MATLAB', 'Julia'].map((tool, i) => (
              <motion.div 
                key={tool} 
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, type: "spring", stiffness: 200, damping: 20 }}
                className="relative group cursor-crosshair"
              >
                <div className="px-8 py-4 rounded-2xl bg-[#111113] border border-white/5 text-slate-500 font-bold text-xl md:text-2xl line-through decoration-red-500/50 decoration-2 opacity-50 group-hover:opacity-20 transition-all shadow-inner">
                  {tool}
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity scale-90 group-hover:scale-100 duration-300">
                  <span className="bg-red-500/10 text-red-400 px-3 py-1.5 rounded-lg text-sm font-bold border border-red-500/20 backdrop-blur-md shadow-[0_0_20px_rgba(239,68,68,0.2)]">无需学习</span>
                </div>
              </motion.div>
            ))}
          </FadeIn>

          <FadeIn delay={0.3} className="bg-[#111113]/80 border border-white/5 rounded-[2rem] overflow-hidden max-w-5xl mx-auto backdrop-blur-xl shadow-2xl">
            <div className="grid md:grid-cols-3 bg-black/40 p-6 font-bold text-slate-300 text-sm uppercase tracking-wider border-b border-white/5">
              <div className="px-4 flex items-center"><MessageSquare className="w-4 h-4 mr-2 text-[#d97757]" /> 你想要的</div>
              <div className="px-4 flex items-center"><BrainCircuit className="w-4 h-4 mr-2 text-slate-400" /> 你说的</div>
              <div className="px-4 flex items-center"><Zap className="w-4 h-4 mr-2 text-[#6a9bcc]" /> AI 执行的</div>
            </div>
            {[
              { want: "描述性统计", say: "给我看一下数据的基本情况", do: "均值、标准差、分布图" },
              { want: "回归分析", say: "分析X对Y的影响，控制Z", do: "OLS/固定效应 + 三线表" },
              { want: "因果推断", say: "用DID方法分析政策效果", do: "平行趋势 + 处理效应" },
              { want: "文献综述", say: "帮我找这个领域的核心文献", do: "顶刊检索 + 观点提取" },
              { want: "论文写作", say: "帮我写实证部分", do: "规范学术输出" },
            ].map((row, i) => (
              <div key={i} className="grid md:grid-cols-3 border-t border-white/5 p-6 text-base hover:bg-white/[0.02] transition-colors group">
                <div className="px-4 text-white font-medium flex items-center group-hover:text-[#d97757] transition-colors">{row.want}</div>
                <div className="px-4 text-slate-400 italic">"{row.say}"</div>
                <div className="px-4 text-white font-medium flex items-center"><ArrowRight className="w-5 h-5 mr-3 text-[#6a9bcc] opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" /> {row.do}</div>
              </div>
            ))}
          </FadeIn>
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
            <div className="bg-slate-900/80 rounded-3xl p-8 border border-white/10 backdrop-blur-md relative overflow-hidden group hover:shadow-[0_0_30px_rgba(217,119,87,0.1)] transition-all">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#d97757]/10 rounded-full blur-3xl group-hover:bg-[#d97757]/20 transition-colors"></div>
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
            <div className="bg-slate-900/80 rounded-3xl p-8 border border-white/10 backdrop-blur-md relative overflow-hidden flex flex-col group hover:shadow-[0_0_30px_rgba(106,155,204,0.1)] transition-all">
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#6a9bcc]/10 rounded-full blur-3xl group-hover:bg-[#6a9bcc]/20 transition-colors"></div>
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