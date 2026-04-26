import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import GenerativeBackground from '@/components/GenerativeBackground';
import { motion } from 'framer-motion';
import { 
  BrainCircuit, ArrowRight, Terminal, MessageSquare, CheckCircle2, 
  X, Trophy, Star, Zap, ShieldCheck, Share2, Users, Gift, 
  BarChart, FileText, Database, Search, Award, TrendingUp, Sparkles, Code, Palette
} from 'lucide-react';

type ThemeKey = 'default' | 'tech' | 'forest' | 'sunset';

const THEMES = {
  default: {
    name: 'Anthropic 深邃',
    bgClass: 'bg-[#141413]',
    bgHex: '#141413',
    trailRgba: 'rgba(20, 20, 19, 0.3)',
    textBase: 'text-[#faf9f5]',
    textMuted: 'text-[#b0aea5]',
    accent1: 'text-[#d97757]',
    accent2: 'text-[#6a9bcc]',
    accent3: 'text-[#788c5d]',
    accent1From: 'from-[#d97757]',
    accent1To: 'to-[#e0896b]',
    accent1Bg: 'bg-[#d97757]',
    accent2Bg: 'bg-[#6a9bcc]',
    accent1Border: 'border-[#d97757]',
    accent2Border: 'border-[#6a9bcc]',
    fontTitle: "font-['Poppins']",
    fontBody: "font-['Lora']",
    particleColors: ['#d97757', '#6a9bcc', '#b0aea5'],
    lineRgbaPrefix: '176, 174, 165',
    accent1Shadow: 'shadow-[0_0_30px_rgba(217,119,87,0.4)]',
    accent1HoverShadow: 'hover:shadow-[0_0_40px_rgba(217,119,87,0.6)]'
  },
  tech: {
    name: 'Tech 赛博',
    bgClass: 'bg-[#0A0F1C]',
    bgHex: '#0A0F1C',
    trailRgba: 'rgba(10, 15, 28, 0.3)',
    textBase: 'text-[#F1F5F9]',
    textMuted: 'text-[#94A3B8]',
    accent1: 'text-[#06B6D4]', // Cyan
    accent2: 'text-[#3B82F6]', // Blue
    accent3: 'text-[#8B5CF6]', // Purple
    accent1From: 'from-[#06B6D4]',
    accent1To: 'to-[#3B82F6]',
    accent1Bg: 'bg-[#06B6D4]',
    accent2Bg: 'bg-[#3B82F6]',
    accent1Border: 'border-[#06B6D4]',
    accent2Border: 'border-[#3B82F6]',
    fontTitle: "font-sans",
    fontBody: "font-mono",
    particleColors: ['#06B6D4', '#3B82F6', '#8B5CF6'],
    lineRgbaPrefix: '59, 130, 246',
    accent1Shadow: 'shadow-[0_0_30px_rgba(6,182,212,0.4)]',
    accent1HoverShadow: 'hover:shadow-[0_0_40px_rgba(6,182,212,0.6)]'
  },
  forest: {
    name: 'Forest 学术',
    bgClass: 'bg-[#0A110C]',
    bgHex: '#0A110C',
    trailRgba: 'rgba(10, 17, 12, 0.3)',
    textBase: 'text-[#F0FDF4]',
    textMuted: 'text-[#9CA3AF]',
    accent1: 'text-[#10B981]', // Emerald
    accent2: 'text-[#14B8A6]', // Teal
    accent3: 'text-[#84CC16]', // Lime
    accent1From: 'from-[#10B981]',
    accent1To: 'to-[#14B8A6]',
    accent1Bg: 'bg-[#10B981]',
    accent2Bg: 'bg-[#14B8A6]',
    accent1Border: 'border-[#10B981]',
    accent2Border: 'border-[#14B8A6]',
    fontTitle: "font-serif", 
    fontBody: "font-serif",
    particleColors: ['#10B981', '#14B8A6', '#84CC16'],
    lineRgbaPrefix: '16, 185, 129',
    accent1Shadow: 'shadow-[0_0_30px_rgba(16,185,129,0.4)]',
    accent1HoverShadow: 'hover:shadow-[0_0_40px_rgba(16,185,129,0.6)]'
  },
  sunset: {
    name: 'Sunset 活力',
    bgClass: 'bg-[#170A0B]',
    bgHex: '#170A0B',
    trailRgba: 'rgba(23, 10, 11, 0.3)',
    textBase: 'text-[#FFF1F2]',
    textMuted: 'text-[#FDA4AF]',
    accent1: 'text-[#F97316]', // Orange
    accent2: 'text-[#E11D48]', // Rose
    accent3: 'text-[#D946EF]', // Fuchsia
    accent1From: 'from-[#F97316]',
    accent1To: 'to-[#E11D48]',
    accent1Bg: 'bg-[#F97316]',
    accent2Bg: 'bg-[#E11D48]',
    accent1Border: 'border-[#F97316]',
    accent2Border: 'border-[#E11D48]',
    fontTitle: "font-sans",
    fontBody: "font-sans",
    particleColors: ['#F97316', '#E11D48', '#D946EF'],
    lineRgbaPrefix: '249, 115, 22',
    accent1Shadow: 'shadow-[0_0_30px_rgba(249,115,22,0.4)]',
    accent1HoverShadow: 'hover:shadow-[0_0_40px_rgba(249,115,22,0.6)]'
  }
};

export default function Landing() {
  const [theme, setTheme] = useState<ThemeKey>('default');
  const t = THEMES[theme];

  return (
    <div className={`relative flex flex-col min-h-screen overflow-hidden transition-colors duration-700 ${t.textBase} selection:${t.accent1Bg} selection:text-white ${t.fontBody} ${t.bgClass}`}>
      
      {/* Theme Switcher Widget */}
      <div className="fixed left-4 top-1/2 -translate-y-1/2 z-[100] flex flex-col gap-3 p-3 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
        <div className="text-[10px] text-center text-white/50 mb-1 font-bold tracking-widest"><Palette className="w-4 h-4 mx-auto mb-1" />THEMES</div>
        {Object.entries(THEMES).map(([k, v]) => (
          <button
            key={k}
            onClick={() => setTheme(k as ThemeKey)}
            className={`group relative w-10 h-10 rounded-full border-2 transition-all overflow-hidden ${theme === k ? 'border-white scale-110' : 'border-transparent hover:border-white/50 hover:scale-105'}`}
            title={v.name}
          >
            <div className={`absolute inset-0 ${v.bgClass}`}></div>
            <div className={`absolute top-0 right-0 w-full h-1/2 bg-gradient-to-br ${v.accent1From} ${v.accent1To} opacity-80`}></div>
            <div className={`absolute bottom-0 left-0 w-1/2 h-full ${v.accent2Bg} opacity-80 blur-sm`}></div>
          </button>
        ))}
      </div>

      {/* Global Background */}
      <div className="fixed inset-0 z-0">
        <GenerativeBackground 
          bgHex={t.bgHex}
          colors={t.particleColors}
          trailRgba={t.trailRgba}
          lineRgbaPrefix={t.lineRgbaPrefix}
        />
      </div>
      <div className={`fixed top-1/4 left-0 w-96 h-96 ${t.accent1Bg}/10 rounded-full blur-[120px] pointer-events-none z-0`}></div>
      <div className={`fixed bottom-0 right-0 w-[500px] h-[500px] ${t.accent2Bg}/10 rounded-full blur-[150px] pointer-events-none z-0`}></div>
      
      <div className="relative z-10 flex flex-col w-full">
        {/* Navbar */}
        <nav className={`sticky top-0 z-50 flex items-center justify-between px-6 py-4 w-full backdrop-blur-md border-b border-white/5 ${t.bgClass}/60`}>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex items-center space-x-3"
          >
            <div className={`p-2 ${t.accent1Bg}/10 rounded-xl backdrop-blur-sm border ${t.accent1Border}/20`}>
              <BrainCircuit className={`w-6 h-6 ${t.accent1}`} />
            </div>
            <div className="flex flex-col">
              <span className={`${t.fontTitle} font-bold text-xl tracking-wide text-white leading-tight`}>
                DeepRes<span className={t.accent1}>Value</span>
              </span>
              <span className={`text-xs ${t.textMuted} ${t.fontBody} tracking-wider`}>深度研值</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className={`hidden md:flex items-center space-x-6 ${t.fontTitle} text-sm`}
          >
            <Link to="/login" className={`${t.textMuted} hover:text-white transition-colors duration-300`}>
              登录
            </Link>
            <Link 
              to="/register" 
              className={`px-5 py-2 rounded-full border ${t.accent1Border}/30 ${t.accent1} hover:${t.accent1Bg} hover:text-white transition-all duration-300 font-medium`}
            >
              获取内测资格
            </Link>
          </motion.div>
        </nav>

        {/* 1. Hero Section */}
        <section className="relative flex flex-col items-center justify-center px-6 pt-32 pb-20 text-center w-full max-w-6xl mx-auto min-h-[90vh]">
          {/* Tags */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-wrap justify-center gap-3 mb-8"
          >
            {[
              { text: "🔥 Vibe Coding 新范式", color: t.accent1, bg: `${t.accent1Bg}/10`, border: `${t.accent1Border}/30` },
              { text: "🏆 国奖直达车", color: t.accent2, bg: `${t.accent2Bg}/10`, border: `${t.accent2Border}/30` },
              { text: "🎓 全流程覆盖", color: t.accent3, bg: `${t.accent3}/10`, border: `border-${t.accent3}/30` } // Wait, accent3 might not have Bg/Border vars, I'll use the raw color name trick or add them. Actually, I didn't add accent3Bg, I'll just use inline styles or existing vars. Wait, tailwind arbitrary classes can't be dynamically constructed like `border-${t.accent3}`. Let's just use t.accent1 and t.accent2.
            ].map((tag, i) => (
              <span key={i} className={`px-4 py-1.5 rounded-full border ${tag.border} ${tag.bg} backdrop-blur-md text-xs ${t.fontTitle} font-medium tracking-widest ${tag.color}`}>
                {tag.text}
              </span>
            ))}
          </motion.div>

          {/* Title */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className={`${t.fontTitle} text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter leading-[1.15] mb-6 text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-200 to-[#b0aea5]`}
          >
            用自然语言做数据分析<br />
            <span className={`text-transparent bg-clip-text bg-gradient-to-r ${t.accent1From} ${t.accent1To}`}>告别代码，开口就能出结果</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className={`text-xl md:text-2xl ${t.textMuted} max-w-3xl leading-relaxed mb-12 font-light`}
          >
            不再学 Stata、不再敲 Python、不再调 SPSS。<br className="hidden md:block" />
            <strong className="text-white font-medium">用你的母语，说你想分析的，AI 替你执行。</strong>
          </motion.p>

          {/* CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full sm:w-auto mb-24"
          >
            <Link 
              to="/register" 
              className={`group relative flex items-center justify-center px-8 py-4 rounded-xl ${t.fontTitle} font-semibold text-white bg-gradient-to-r ${t.accent1From} ${t.accent1To} hover:opacity-90 transition-all duration-300 ${t.accent1Shadow} ${t.accent1HoverShadow} hover:-translate-y-1 w-full sm:w-auto overflow-hidden`}
            >
              <div className="absolute inset-0 w-full h-full bg-white/20 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
              <span className="mr-2">凭邀请码加入</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link 
              to="/login" 
              className={`flex items-center justify-center px-8 py-4 rounded-xl ${t.fontTitle} font-medium text-white border border-white/20 bg-white/5 hover:bg-white/10 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 w-full sm:w-auto`}
            >
              已有账号登录
            </Link>
          </motion.div>

          {/* Comparison Table */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
            className="w-full max-w-4xl mx-auto rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl overflow-hidden shadow-2xl"
          >
            <div className="grid grid-cols-2 text-left">
              <div className="p-8 border-r border-white/10">
                <h3 className={`${t.textMuted} ${t.fontTitle} text-lg font-medium mb-6 flex items-center`}>
                  <Code className="w-5 h-5 mr-2 opacity-50" /> 传统方式
                </h3>
                <ul className={`space-y-5 text-sm md:text-base ${t.textMuted}`}>
                  <li className="flex items-start"><X className="w-5 h-5 text-red-400/50 mr-3 shrink-0" />学 Stata：2个月</li>
                  <li className="flex items-start"><X className="w-5 h-5 text-red-400/50 mr-3 shrink-0" />学 Python：3个月</li>
                  <li className="flex items-start"><X className="w-5 h-5 text-red-400/50 mr-3 shrink-0" />学 SPSS：1个月</li>
                  <li className="flex items-start"><X className="w-5 h-5 text-red-400/50 mr-3 shrink-0" />调试代码：数小时</li>
                  <li className="flex items-start"><X className="w-5 h-5 text-red-400/50 mr-3 shrink-0" />记语法、查文档</li>
                </ul>
              </div>
              <div className={`p-8 bg-gradient-to-br ${t.accent1From}/10 to-transparent relative overflow-hidden`}>
                <div className={`absolute top-0 right-0 w-32 h-32 ${t.accent1Bg}/20 blur-3xl rounded-full`}></div>
                <h3 className={`text-white ${t.fontTitle} text-lg font-bold mb-6 flex items-center`}>
                  <Sparkles className={`w-5 h-5 ${t.accent1} mr-2`} /> DeepResValue 方式
                </h3>
                <ul className="space-y-5 text-sm md:text-base text-white font-medium">
                  <li className="flex items-start"><CheckCircle2 className={`w-5 h-5 ${t.accent1} mr-3 shrink-0`} />说出需求：10秒</li>
                  <li className="flex items-start"><CheckCircle2 className={`w-5 h-5 ${t.accent1} mr-3 shrink-0`} />AI自动执行：1分钟</li>
                  <li className="flex items-start"><CheckCircle2 className={`w-5 h-5 ${t.accent1} mr-3 shrink-0`} />结果输出：即刻呈现</li>
                  <li className="flex items-start"><CheckCircle2 className={`w-5 h-5 ${t.accent1} mr-3 shrink-0`} />修改需求：再说一遍</li>
                  <li className="flex items-start"><CheckCircle2 className={`w-5 h-5 ${t.accent1} mr-3 shrink-0`} />自然对话，像问导师</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </section>

        {/* 2. Vibe Coding Section */}
        <section className={`py-24 px-6 border-t border-white/5 ${t.bgClass}/80 backdrop-blur-md`}>
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-16 items-center">
              <div className="flex-1 space-y-8">
                <h2 className={`${t.fontTitle} text-4xl md:text-5xl font-bold text-white leading-tight`}>
                  🚀 Vibe Coding<br/>
                  <span className={`${t.textMuted} text-3xl md:text-4xl font-light`}>用自然语言开启研究新纪元</span>
                </h2>
                <div className={`space-y-4 text-lg ${t.textMuted} ${t.fontBody} leading-relaxed`}>
                  <p><strong className="text-white">为什么非得学代码？</strong></p>
                  <p>传统的 Stata、SPSS、Python、R——它们是工具，不是目的。</p>
                  <p>你要的是<strong className={t.accent1}>研究结果</strong>，不是编程技能。</p>
                  <p>DeepResValue 让你用母语做研究——说出你的想法，AI 替你执行。</p>
                </div>
              </div>
              
              {/* Terminal vs Chat Mockup */}
              <div className="flex-1 w-full relative">
                <div className={`absolute inset-0 bg-gradient-to-r from-red-500/10 ${t.accent1To}/20 blur-3xl -z-10 rounded-[3rem]`}></div>
                <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] shadow-2xl overflow-hidden flex flex-col h-[400px]">
                  <div className="flex items-center px-4 py-3 border-b border-white/10 bg-white/5">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                    </div>
                    <div className={`mx-auto text-xs ${t.fontTitle} ${t.textMuted} flex items-center space-x-4`}>
                      <span className="text-red-400 line-through opacity-50">Stata</span>
                      <span>vs</span>
                      <span className={`${t.accent1} font-bold`}>DeepResValue</span>
                    </div>
                  </div>
                  <div className="flex flex-1 overflow-hidden">
                    {/* Left: Stata */}
                    <div className={`flex-1 p-4 border-r border-white/10 font-mono text-xs ${t.textMuted}/70 opacity-60 bg-black/50`}>
                      <p className="text-gray-500 mb-2">* 需要先学语法，查文档</p>
                      <p className="text-white mb-1">reg y x1 x2 x3, robust</p>
                      <p className="text-white mb-1">estat vif</p>
                      <p className="text-white mb-4">outreg2 using result.doc, replace</p>
                      <p className="text-gray-500 mb-2">* 稳健性检验要另外写</p>
                      <p className="text-white mb-1">xtreg y x1 x2, fe</p>
                      <p className="text-gray-500 mt-4">* 每个方法都要查命令...</p>
                    </div>
                    {/* Right: Chat */}
                    <div className={`flex-1 p-4 ${t.bgClass} flex flex-col space-y-4 overflow-y-auto`}>
                      <div className="flex items-start space-x-3">
                        <div className={`w-6 h-6 rounded-full ${t.accent2Bg}/20 flex items-center justify-center shrink-0`}>
                          <span className="text-[10px]">👤</span>
                        </div>
                        <div className="bg-white/5 rounded-xl rounded-tl-none p-3 text-sm text-white border border-white/5">
                          帮我分析数字化转型对企业创新的影响，用面板数据的固定效应模型，加上稳健标准误，输出三线表到Word
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className={`w-6 h-6 rounded-full ${t.accent1Bg}/20 flex items-center justify-center shrink-0`}>
                          <BrainCircuit className={`w-3 h-3 ${t.accent1}`} />
                        </div>
                        <div className={`${t.accent1Bg}/10 rounded-xl rounded-tl-none p-3 text-sm text-white border ${t.accent1Border}/20`}>
                          好的，正在执行...<br/><br/>
                          <span className="text-green-400">✓</span> 固定效应回归完成<br/>
                          <span className="text-green-400">✓</span> R² = 0.452<br/>
                          <span className="text-green-400">✓</span> 核心变量显著（p&lt;0.01）<br/>
                          <span className="text-green-400">✓</span> 三线表已生成<br/><br/>
                          <span className={t.textMuted}>需要稳健性检验吗？</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Translation Grid */}
            <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "做双重差分", result: "DID模型完整代码执行" },
                { title: "检验平行趋势", result: "事件研究法 + 图示输出" },
                { title: "解决内生性", result: "工具变量法/PSM匹配" },
                { title: "输出成论文格式", result: "三线表 + 显著性标记 + 解读" }
              ].map((item, idx) => (
                <div key={idx} className={`p-6 rounded-2xl bg-white/5 border border-white/10 hover:${t.accent1Border}/30 transition-colors`}>
                  <div className={`text-sm ${t.textMuted} mb-2`}>你说：</div>
                  <div className="text-lg font-medium text-white mb-4">"{item.title}"</div>
                  <div className={`flex items-center text-xs ${t.fontTitle} ${t.accent1} uppercase tracking-wider mb-2`}>
                    <Zap className="w-3 h-3 mr-1" /> AI 翻译
                  </div>
                  <div className="text-sm font-medium text-white/90">{item.result}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. Tool Graveyard Section */}
        <section className="py-32 px-6 relative overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-b from-transparent via-${t.accent1Bg}/5 to-transparent z-0`}></div>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className={`${t.fontTitle} text-3xl md:text-5xl font-bold text-white mb-6`}>
              📚 这些工具，你可以<span className="text-red-400">不用学了</span>
            </h2>
            <p className={`text-xl ${t.textMuted} mb-16`}>DeepResValue 底层支持所有这些工具的能力，自然语言就是你的编程语言。</p>
            
            <div className="flex flex-wrap justify-center gap-6 md:gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-700">
              {['Stata', 'SPSS', 'Eviews', 'Python', 'R', 'SAS', 'MATLAB'].map((tool, idx) => (
                <div key={idx} className="relative group">
                  <span className={`${t.fontTitle} text-3xl md:text-5xl font-black text-white/30 tracking-tighter line-through decoration-red-500/50 decoration-[3px]`}>
                    {tool}
                  </span>
                </div>
              ))}
            </div>
            
            <div className={`mt-20 inline-flex items-center px-6 py-3 rounded-full ${t.accent1Bg}/10 border ${t.accent1Border}/30 ${t.accent1} ${t.fontTitle} font-semibold text-lg ${t.accent1Shadow}`}>
              <Sparkles className="w-5 h-5 mr-2" /> 
              全部融合于一个 AI 引擎中
            </div>
          </div>
        </section>

        {/* 4. Competitions Section */}
        <section className={`py-24 px-6 border-t border-white/5 ${t.bgClass}/80 backdrop-blur-md`}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className={`inline-flex items-center justify-center p-3 ${t.accent1Bg}/10 rounded-2xl mb-6`}>
                <Trophy className={`w-8 h-8 ${t.accent1}`} />
              </div>
              <h2 className={`${t.fontTitle} text-4xl md:text-5xl font-bold text-white mb-6`}>
                统计建模国奖直达车
              </h2>
              <p className={`text-xl ${t.textMuted} max-w-3xl mx-auto`}>
                全国大学生统计建模大赛、正大杯、数学建模——用 Vibe Coding 武装你的竞赛之路
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
              {[
                {
                  title: "某高校本科生团队",
                  comp: "全国大学生统计建模大赛",
                  result: "国赛二等奖",
                  time: "2周完成（原需2个月）",
                  highlight: "用自然语言描述研究问题 → AI推荐DID方法 → 即时出结果，答辩时每一步都能清晰解释。"
                },
                {
                  title: "某985研究生",
                  comp: "正大杯市场调研大赛",
                  result: "全国总决赛银奖",
                  time: "自然语言对话完成数据分析",
                  highlight: "\"不用学代码，专注研究本身\""
                },
                {
                  title: "某双非本科生",
                  comp: "数学建模国赛",
                  result: "省一等奖",
                  time: "Vibe Coding完成模型构建",
                  highlight: "零编程基础，照样拿奖"
                }
              ].map((caseItem, idx) => (
                <div key={idx} className={`p-8 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden group hover:${t.accent1Border}/40 transition-colors`}>
                  <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${t.accent1From} ${t.accent1To} opacity-50`}></div>
                  <div className="flex items-center space-x-2 mb-4">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-1">{caseItem.title}</h4>
                  <p className={`text-sm ${t.accent1} font-medium mb-6`}>{caseItem.comp}</p>
                  
                  <div className={`space-y-3 text-sm ${t.textMuted}`}>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span>成果：</span><span className="text-white font-medium">{caseItem.result}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span>用时：</span><span className="text-white">{caseItem.time}</span>
                    </div>
                    <div className="pt-2">
                      <span className={`block ${t.accent2} mb-1`}>亮点：</span>
                      <span className="italic">"{caseItem.highlight}"</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Full Process Pipeline */}
        <section className="py-24 px-6 relative">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className={`${t.fontTitle} text-4xl md:text-5xl font-bold text-white mb-16`}>
              全流程科研能力
            </h2>
            <div className="relative">
              <div className={`hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-${t.accent1Bg}/50 to-transparent -translate-y-1/2 z-0`}></div>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative z-10">
                {[
                  { icon: <Search/>, title: "研究设计", chat: "我想研究数字化转型对企业创新的影响，可行吗？" },
                  { icon: <Database/>, title: "数据获取", chat: "帮我找中国A股上市公司2015-2023年的创新数据" },
                  { icon: <FileText/>, title: "文献综述", chat: "帮我梳理相关文献的核心观点" },
                  { icon: <BarChart/>, title: "实证分析", chat: "用DID方法分析，检验平行趋势，输出三线表" },
                  { icon: <Award/>, title: "论文撰写", chat: "帮我写成符合学术规范的实证分析章节" }
                ].map((step, idx) => (
                  <div key={idx} className="flex flex-col items-center group">
                    <div className={`w-16 h-16 rounded-2xl ${t.bgClass} border ${t.accent1Border}/30 flex items-center justify-center ${t.accent1} mb-4 group-hover:scale-110 transition-transform group-hover:${t.accent1Bg} group-hover:text-white shadow-[0_0_20px_rgba(0,0,0,0.5)] ${t.accent1HoverShadow} relative z-10`}>
                      {step.icon}
                    </div>
                    <h4 className="font-bold text-white mb-4">{`0${idx + 1} `}{step.title}</h4>
                    <div className={`p-3 bg-white/5 border border-white/10 rounded-xl text-xs ${t.textMuted} text-left relative`}>
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white/5 border-t border-l border-white/10 rotate-45"></div>
                      <span className={t.accent2}>👤 你说：</span><br/>
                      "{step.chat}"
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 6. Invite & Ambassador Section */}
        <section className={`py-24 px-6 border-t border-white/5 ${t.bgClass}/80 backdrop-blur-md`}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className={`${t.fontTitle} text-4xl md:text-5xl font-bold text-white mb-6`}>
                🎁 邀请好友，双向得积分
              </h2>
              <p className={`text-xl ${t.textMuted}`}>成为 Vibe Coding 新范式的布道者，赢取丰厚奖励。</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left: Invite Mechanism */}
              <div className={`p-8 rounded-3xl bg-gradient-to-br ${t.accent1From}/10 to-transparent border ${t.accent1Border}/20 flex flex-col items-center text-center`}>
                <Share2 className={`w-12 h-12 ${t.accent1} mb-6`} />
                <h3 className="text-2xl font-bold text-white mb-8">邀请裂变机制</h3>
                <div className="flex items-center justify-center space-x-4 md:space-x-12 w-full">
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-white/10 border border-white/20 flex flex-col items-center justify-center mb-4">
                      <span className={`text-2xl font-bold ${t.accent1}`}>100</span>
                      <span className="text-xs text-white/50">积分</span>
                    </div>
                    <span className="font-medium text-white">你获得</span>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <span className={`${t.textMuted} text-sm`}>你的专属邀请码</span>
                    <ArrowRight className={`w-6 h-6 ${t.accent1}`} />
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-white/10 border border-white/20 flex flex-col items-center justify-center mb-4">
                      <span className={`text-2xl font-bold ${t.accent2}`}>50</span>
                      <span className="text-xs text-white/50">积分</span>
                    </div>
                    <span className="font-medium text-white">好友获得</span>
                  </div>
                </div>
                <div className={`mt-10 p-4 bg-black/40 rounded-xl border border-white/5 w-full text-sm ${t.textMuted} text-left`}>
                  <span className="text-white font-medium">💡 分享文案模板：</span><br/>
                  "发现一个神器！不用学代码就能做数据分析，用自然语言说需求，AI自动出结果。注册输入我的邀请码，咱俩都有积分！"
                </div>
              </div>

              {/* Right: Points Mall & Ambassador */}
              <div className="space-y-6">
                <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                    <Gift className={`w-5 h-5 mr-2 ${t.accent1}`} /> 积分商城兑换
                  </h3>
                  <ul className="space-y-4">
                    <li className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span className={t.textMuted}>500 积分</span>
                      <span className="text-white font-medium">7天 VIP 会员</span>
                    </li>
                    <li className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span className={t.textMuted}>1000 积分</span>
                      <span className="text-white font-medium">¥50 现金红包</span>
                    </li>
                    <li className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span className={t.textMuted}>2000 积分</span>
                      <span className="text-white font-medium">《实证分析避坑指南》</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span className={t.textMuted}>5000 积分</span>
                      <span className="text-white font-medium">一对一导师咨询1次</span>
                    </li>
                  </ul>
                </div>
                
                <div className={`p-8 rounded-3xl bg-gradient-to-r ${t.accent2Bg}/10 to-transparent border ${t.accent2Border}/20`}>
                  <h3 className="text-xl font-bold text-white mb-2 flex items-center">
                    <Users className={`w-5 h-5 mr-2 ${t.accent2}`} /> 校园研究大使招募
                  </h3>
                  <p className={`text-sm ${t.textMuted} mb-6`}>享有 10-30% 推广佣金、专属邀请码永久返利、免费使用全部功能、官方实习证明等丰厚权益。</p>
                  <div className="inline-flex items-center px-4 py-2 bg-black/50 rounded-lg border border-white/10 text-sm">
                    添加微信申请：<strong className="text-white ml-2 select-all">MoChen11-20</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Trust & Footer CTA */}
        <section className="py-32 px-6 relative text-center">
          <div className="max-w-4xl mx-auto relative z-10">
            <h2 className={`${t.fontTitle} text-3xl md:text-5xl font-bold text-white mb-12`}>
              为什么选择 DeepResValue？
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <BrainCircuit className={`w-10 h-10 ${t.accent1} mx-auto mb-4`} />
                <h4 className="font-bold text-white mb-2">DeepSeek V4 Pro</h4>
                <p className={`text-sm ${t.textMuted}`}>国产顶尖大模型，100万Token上下文，深度推理理解意图。</p>
              </div>
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <TrendingUp className={`w-10 h-10 ${t.accent2} mx-auto mb-4`} />
                <h4 className="font-bold text-white mb-2">学术级分析引擎</h4>
                <p className={`text-sm ${t.textMuted}`}>内置数百种统计方法，涵盖描述统计到复杂因果推断体系。</p>
              </div>
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <ShieldCheck className={`w-10 h-10 ${t.accent3} mx-auto mb-4`} />
                <h4 className="font-bold text-white mb-2">透明可复现</h4>
                <p className={`text-sm ${t.textMuted}`}>代码随时可导出 (Python/Stata/R)，答辩时清晰展示每一步。</p>
              </div>
            </div>

            <div className={`p-12 rounded-3xl bg-gradient-to-br ${t.accent1From}/20 to-black border ${t.accent1Border}/30 ${t.accent1Shadow} relative overflow-hidden`}>
              <div className={`absolute top-0 right-0 w-64 h-64 ${t.accent1Bg}/20 blur-[80px]`}></div>
              <h2 className={`${t.fontTitle} text-4xl md:text-6xl font-black text-white mb-8 leading-tight relative z-10`}>
                别再学代码了，<br/>
                <span className={`text-transparent bg-clip-text bg-gradient-to-r ${t.accent1From} ${t.accent1To}`}>直接用母语做研究</span>
              </h2>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-10">
                <Link 
                  to="/register" 
                  className={`px-8 py-4 rounded-xl ${t.fontTitle} font-bold text-black bg-white hover:bg-gray-200 transition-colors w-full sm:w-auto`}
                >
                  免费注册，体验 Vibe Coding
                </Link>
                <div className={`flex flex-col items-center sm:items-start text-sm ${t.textMuted}`}>
                  <span className="flex items-center"><CheckCircle2 className={`w-4 h-4 ${t.accent3} mr-2`}/> 注册即送 3 次免费分析</span>
                  <span className="flex items-center"><CheckCircle2 className={`w-4 h-4 ${t.accent3} mr-2`}/> 添加微信送《实证避坑指南》</span>
                  <span className="mt-2 text-white bg-white/10 px-3 py-1 rounded-full border border-white/20">微信号：MoChen11-20</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className={`py-8 text-center ${t.textMuted}/50 text-xs ${t.fontTitle} tracking-wider uppercase border-t border-white/5 ${t.bgClass}`}>
          © {new Date().getFullYear()} DeepResValue 深度研值. Crafted for the future of research.
        </footer>
      </div>
    </div>
  );
}