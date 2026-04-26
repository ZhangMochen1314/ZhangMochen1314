import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, BarChart2, Database, BrainCircuit, ShieldCheck, Zap, 
  BookOpen, Trophy, Coins, CheckCircle2, XCircle, Code2, LineChart, 
  FileText, User, Bot, Gift, Star, Award, PlayCircle, MessageSquare, 
  Lightbulb, Search, Activity, Edit3, Lock, Users, Sparkles 
} from "lucide-react";
import { useStore } from "@/store/useStore";
import AlgorithmicBackground from "@/components/AlgorithmicBackground";

export default function Home() {
  const { token, setShowAuthModal, pointPackages, skillPrices } = useStore();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);

  const handleStart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (token) {
      navigate('/chat');
    } else {
      setShowAuthModal(true);
    }
  };

  const workflowSteps = [
    {
      id: 1,
      title: "研究设计",
      icon: Lightbulb,
      prompt: "我想研究",
      userMsg: "我想研究数字化转型对企业创新的影响，这个选题可行吗？",
      aiMsg: "可行。建议采用DID方法，因为2020年政策可作为准自然实验..."
    },
    {
      id: 2,
      title: "数据获取",
      icon: Database,
      prompt: "帮我找数据",
      userMsg: "帮我找中国A股上市公司2015-2023年的创新数据",
      aiMsg: "已从CSMAR数据库获取专利申请数据，共15,234条记录..."
    },
    {
      id: 3,
      title: "文献综述",
      icon: BookOpen,
      prompt: "综述一下",
      userMsg: "帮我梳理数字化转型对企业创新的相关文献",
      aiMsg: "检索到顶刊文献47篇，核心观点如下..."
    },
    {
      id: 4,
      title: "实证分析",
      icon: Activity,
      prompt: "分析影响",
      userMsg: "用DID方法分析，检验平行趋势，输出三线表",
      aiMsg: "正在执行双重差分...平行趋势通过，处理效应显著..."
    },
    {
      id: 5,
      title: "论文撰写",
      icon: Edit3,
      prompt: "写成论文",
      userMsg: "帮我写成实证分析章节",
      aiMsg: "已生成符合学术规范的实证部分，包含方法说明、结果展示、稳健性检验..."
    }
  ];

  return (
    <div className="bg-[#FAFAFA] text-slate-800 font-sans selection:bg-blue-200 selection:text-blue-900">
      {/* 1. Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 mx-auto flex flex-col items-center text-center overflow-hidden min-h-[90vh] justify-center border-b border-slate-200 shadow-sm">
        {/* Algorithmic Generative Art Background */}
        <AlgorithmicBackground theme="light" className="absolute inset-0 z-0 pointer-events-none opacity-60" />

        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-screen-xl -z-10 opacity-30 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-200 blur-3xl"></div>
          <div className="absolute top-[20%] right-[-10%] w-[30%] h-[30%] rounded-full bg-indigo-100 blur-3xl"></div>
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center">
          <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center space-x-3 px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-700 text-sm font-medium mb-8 shadow-sm"
        >
          <span className="flex items-center text-orange-500 font-bold"><Sparkles className="w-4 h-4 mr-1"/> Vibe Coding 新范式</span>
          <span className="w-1 h-1 rounded-full bg-slate-300"></span>
          <span className="flex items-center text-amber-500 font-bold"><Trophy className="w-4 h-4 mr-1"/> 国奖直达车</span>
          <span className="w-1 h-1 rounded-full bg-slate-300"></span>
          <span className="flex items-center text-blue-600 font-bold"><Activity className="w-4 h-4 mr-1"/> 全流程覆盖</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 max-w-4xl leading-[1.15]"
        >
          用<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-700">自然语言</span>做数据分析
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 text-2xl text-slate-600 max-w-3xl leading-relaxed font-medium"
        >
          告别代码，开口就能出结果
        </motion.p>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-4 text-lg text-slate-500 max-w-2xl leading-relaxed"
        >
          不再学 Stata、不再敲 Python、不再调 SPSS。<br/>
          用你的母语，说你想分析的，AI 替你执行。
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
        >
          <button onClick={handleStart} className="inline-flex items-center justify-center px-8 py-3.5 text-lg font-medium text-white bg-[#0F172A] rounded-xl hover:bg-slate-800 transition-colors shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transform duration-200">
            免费注册体验 <ArrowRight className="ml-2 w-5 h-5" />
          </button>
          <a href="#demo" className="inline-flex items-center justify-center px-8 py-3.5 text-lg font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
            <PlayCircle className="w-5 h-5 mr-2 text-blue-600"/> 看看回归分析有多简单
          </a>
        </motion.div>

        {/* 震撼对比 */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-20 w-full max-w-5xl"
        >
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-slate-100 rounded-2xl p-8 border border-slate-200 flex flex-col justify-center shadow-inner">
              <h3 className="text-xl font-bold text-slate-500 mb-6 flex items-center justify-center"><XCircle className="w-5 h-5 mr-2"/> 传统方式</h3>
              <ul className="space-y-4 text-slate-600 font-medium text-lg">
                <li className="flex justify-between border-b border-slate-200 pb-2"><span>学Stata</span> <span>2个月</span></li>
                <li className="flex justify-between border-b border-slate-200 pb-2"><span>学Python</span> <span>3个月</span></li>
                <li className="flex justify-between border-b border-slate-200 pb-2"><span>学SPSS</span> <span>1个月</span></li>
                <li className="flex justify-between border-b border-slate-200 pb-2"><span>调试代码</span> <span>数小时</span></li>
                <li className="flex justify-between pt-2"><span>过程</span> <span>记语法、查文档</span></li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 border border-blue-500 flex flex-col justify-center shadow-2xl transform md:scale-105 z-10 relative">
              <div className="absolute -top-4 -right-4 bg-amber-400 text-amber-950 text-xs font-black px-3 py-1.5 rounded-full shadow-lg rotate-12">
                10倍效率提升
              </div>
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center justify-center"><CheckCircle2 className="w-6 h-6 mr-2 text-blue-200"/> DeepResValue 方式</h3>
              <ul className="space-y-4 text-blue-50 font-bold text-lg">
                <li className="flex justify-between border-b border-blue-500/50 pb-2"><span>说出需求</span> <span className="text-white">10秒</span></li>
                <li className="flex justify-between border-b border-blue-500/50 pb-2"><span>AI自动执行</span> <span className="text-white">1分钟</span></li>
                <li className="flex justify-between border-b border-blue-500/50 pb-2"><span>结果输出</span> <span className="text-white">即刻呈现</span></li>
                <li className="flex justify-between border-b border-blue-500/50 pb-2"><span>修改需求</span> <span className="text-white">再说一遍</span></li>
                <li className="flex justify-between pt-2"><span>过程</span> <span className="text-white">自然对话，像问导师</span></li>
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Vibe Coding 新范式 */}
      <section className="py-24 bg-white border-t border-slate-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 font-serif tracking-tight flex items-center justify-center">
              <Sparkles className="w-8 h-8 mr-3 text-blue-600"/> Vibe Coding：用自然语言开启研究新纪元
            </h2>
            <p className="mt-6 text-lg text-slate-600 leading-relaxed">
              <strong>为什么非得学代码？</strong> 传统的 Stata、Python 只是工具，你要的是研究结果，不是编程技能。<br/>
              DeepResValue 让你用<strong>母语</strong>做研究——说出你的想法，AI替你执行。
            </p>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8 items-center justify-center">
            {/* Code Block */}
            <div className="w-full lg:w-1/2 bg-[#1E293B] rounded-2xl p-6 shadow-xl border border-slate-800">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-slate-400 text-xs font-mono ml-2">stata_do_file.do (传统方式)</span>
              </div>
              <pre className="text-sm font-mono text-slate-300 overflow-x-auto">
                <code>
<span className="text-slate-500">* 需要先学语法，查文档</span><br/>
<span className="text-blue-400">reg</span> y x1 x2 x3, robust<br/>
<span className="text-blue-400">estat</span> vif<br/>
<span className="text-blue-400">outreg2</span> using result.doc, replace<br/>
<br/>
<span className="text-slate-500">* 稳健性检验要另外写</span><br/>
<span className="text-blue-400">xtreg</span> y x1 x2, fe<br/>
<span className="text-slate-500">* 每个方法都要查命令</span>
                </code>
              </pre>
            </div>

            {/* Chat Block */}
            <div className="w-full lg:w-1/2 bg-slate-50 rounded-2xl p-6 shadow-xl border border-slate-200">
              <div className="flex items-center space-x-2 mb-6">
                <BrainCircuit className="w-5 h-5 text-blue-600"/>
                <span className="text-slate-700 text-sm font-bold">DeepResValue 方式 (自然语言)</span>
              </div>
              
              <div className="space-y-4">
                {/* User Bubble */}
                <div className="flex justify-end">
                  <div className="bg-blue-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 max-w-[85%] text-sm shadow-sm leading-relaxed">
                    帮我分析数字化转型对企业创新的影响，<br/>
                    用面板数据的固定效应模型，<br/>
                    加上稳健标准误，输出三线表到Word。
                  </div>
                </div>
                {/* AI Bubble */}
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 text-slate-700 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%] text-sm shadow-sm leading-relaxed">
                    <p className="font-bold text-blue-600 mb-2">好的，正在执行...</p>
                    <ul className="space-y-1">
                      <li className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500"/> 固定效应回归完成</li>
                      <li className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500"/> R² = 0.452</li>
                      <li className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500"/> 核心变量显著（p&lt;0.01）</li>
                      <li className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500"/> 三线表已生成</li>
                    </ul>
                    <p className="mt-2 text-slate-500">需要稳健性检验吗？</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 工具替代 */}
      <section className="py-24 bg-slate-900 text-white border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-serif mb-6">📚 这些工具，你可以不用学了</h2>
          <p className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto">
            DeepResValue 底层支持所有这些工具的能力，但你不需要学它们——**自然语言就是你的编程语言**。
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {['Stata', 'SPSS', 'Eviews', 'Python', 'R', 'SAS', 'MATLAB', 'Julia'].map(tool => (
              <div key={tool} className="relative group px-6 py-3 bg-slate-800 rounded-xl border border-slate-700">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-0.5 bg-rose-500/80 -rotate-12 group-hover:rotate-0 transition-transform duration-300"></div>
                </div>
                <span className="text-xl font-bold text-slate-500 opacity-50 relative z-10">{tool}</span>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 max-w-5xl mx-auto">
            {[
              { t: "Stata的回归分析", i: CheckCircle2 },
              { t: "Python的数据处理", i: CheckCircle2 },
              { t: "R的统计建模", i: CheckCircle2 },
              { t: "SPSS的界面友好", i: CheckCircle2 },
              { t: "Eviews的时间序列", i: CheckCircle2 }
            ].map((item, idx) => (
              <div key={idx} className="bg-slate-800/50 rounded-xl p-4 border border-emerald-500/20 flex flex-col items-center justify-center">
                <item.i className="w-8 h-8 text-emerald-400 mb-2"/>
                <span className="font-bold text-sm text-slate-300">{item.t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. 国家级竞赛专区 */}
      <section className="py-24 bg-[#FAFAFA] border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 font-serif tracking-tight flex items-center justify-center">
              <Trophy className="w-8 h-8 mr-3 text-amber-500"/> 统计建模国奖直达车
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              全国大学生统计建模大赛、正大杯、数学建模——用 Vibe Coding 武装你的竞赛之路。
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Case 1 */}
            <div className="bg-white rounded-2xl p-8 border border-amber-100 shadow-xl shadow-amber-500/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-gradient-to-bl from-amber-400 to-orange-500 text-white px-4 py-1 rounded-bl-2xl font-bold text-sm">国赛二等奖</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 mt-4">某高校本科生团队</h3>
              <p className="text-sm text-slate-500 mb-6 border-b border-slate-100 pb-4">全国大学生统计建模大赛</p>
              <ul className="space-y-3 text-sm text-slate-700">
                <li className="flex items-start"><CheckCircle2 className="w-4 h-4 mr-2 text-amber-500 shrink-0 mt-0.5"/> <span><strong>方法：</strong>自然语言描述问题 → AI推荐DID方法 → 即时出结果</span></li>
                <li className="flex items-start"><CheckCircle2 className="w-4 h-4 mr-2 text-amber-500 shrink-0 mt-0.5"/> <span><strong>用时：</strong>2周完成（原需2个月）</span></li>
                <li className="flex items-start"><CheckCircle2 className="w-4 h-4 mr-2 text-amber-500 shrink-0 mt-0.5"/> <span><strong>亮点：</strong>答辩时每一步都能清晰解释</span></li>
              </ul>
            </div>
            {/* Case 2 */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xl relative overflow-hidden transform md:-translate-y-4">
              <div className="absolute top-0 right-0 bg-gradient-to-bl from-slate-400 to-slate-500 text-white px-4 py-1 rounded-bl-2xl font-bold text-sm">全国银奖</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 mt-4">某985研究生</h3>
              <p className="text-sm text-slate-500 mb-6 border-b border-slate-100 pb-4">正大杯市场调研大赛</p>
              <ul className="space-y-3 text-sm text-slate-700">
                <li className="flex items-start"><CheckCircle2 className="w-4 h-4 mr-2 text-slate-400 shrink-0 mt-0.5"/> <span><strong>方法：</strong>自然语言对话完成数据分析全流程</span></li>
                <li className="flex items-start"><CheckCircle2 className="w-4 h-4 mr-2 text-slate-400 shrink-0 mt-0.5"/> <span><strong>亮点：</strong>"不用学代码，专注研究本身"</span></li>
              </ul>
            </div>
            {/* Case 3 */}
            <div className="bg-white rounded-2xl p-8 border border-amber-100 shadow-xl shadow-amber-500/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-gradient-to-bl from-amber-400 to-orange-500 text-white px-4 py-1 rounded-bl-2xl font-bold text-sm">省一等奖</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 mt-4">某双非本科生</h3>
              <p className="text-sm text-slate-500 mb-6 border-b border-slate-100 pb-4">数学建模国赛</p>
              <ul className="space-y-3 text-sm text-slate-700">
                <li className="flex items-start"><CheckCircle2 className="w-4 h-4 mr-2 text-amber-500 shrink-0 mt-0.5"/> <span><strong>方法：</strong>Vibe Coding 完成数据处理和模型构建</span></li>
                <li className="flex items-start"><CheckCircle2 className="w-4 h-4 mr-2 text-amber-500 shrink-0 mt-0.5"/> <span><strong>亮点：</strong>零编程基础，照样拿奖</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. 全流程能力 */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 font-serif tracking-tight">
              全流程覆盖，从构思到论文
            </h2>
            <p className="mt-4 text-lg text-slate-600">点击下方步骤，查看对应的自然语言交互示例</p>
          </div>

          {/* Timeline tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {workflowSteps.map((step, idx) => (
              <button 
                key={step.id}
                onClick={() => setActiveStep(idx)}
                className={`flex items-center px-4 py-3 rounded-xl transition-all ${
                  activeStep === idx 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 transform scale-105' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 text-xs font-bold ${activeStep === idx ? 'bg-white text-blue-600' : 'bg-white text-slate-500'}`}>
                  {step.id}
                </div>
                <span className="font-bold">{step.title}</span>
              </button>
            ))}
          </div>

          {/* Chat Display for active step */}
          <div className="max-w-3xl mx-auto bg-slate-50 border border-slate-200 rounded-3xl p-6 md:p-10 shadow-xl relative overflow-hidden min-h-[280px]">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold mb-2">
                    <MessageSquare className="w-3 h-3 mr-1"/> 你只需要说："{workflowSteps[activeStep].prompt}"
                  </div>
                </div>
                {/* User */}
                <div className="flex justify-end">
                  <div className="bg-blue-600 text-white rounded-2xl rounded-tr-sm px-5 py-3 max-w-[85%] text-[15px] shadow-md">
                    {workflowSteps[activeStep].userMsg}
                  </div>
                </div>
                {/* AI */}
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 text-slate-700 rounded-2xl rounded-tl-sm px-5 py-4 max-w-[85%] text-[15px] shadow-md flex items-start">
                    <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center mr-3 shrink-0 mt-0.5">
                      <BrainCircuit className="w-4 h-4"/>
                    </div>
                    <div className="leading-relaxed">
                      {workflowSteps[activeStep].aiMsg}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* 6. Pricing & 邀请机制 */}
      <section id="pricing" className="py-24 bg-[#0F172A] text-slate-300 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl bg-blue-900/20 blur-[100px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white font-serif tracking-tight">按需计算，邀请得算力</h2>
            <p className="mt-4 text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
              告别昂贵的传统商业软件年费。通过签到、邀请好友获取免费积分，或购买超值额度包。
            </p>
          </div>
          
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Rules & Invites */}
            <div className="lg:col-span-3 space-y-6">
              {/* Invite Card */}
              <div className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 p-8 rounded-3xl border border-indigo-500/30 backdrop-blur-xl shadow-2xl">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-indigo-500/20 rounded-xl mr-4">
                    <Gift className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white flex items-center">🎁 邀请好友，双向得积分</h3>
                    <p className="text-indigo-200 text-sm mt-1">你的专属邀请码，分享即赚</p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center justify-between bg-slate-900/60 rounded-2xl p-6 border border-indigo-500/20 gap-4">
                  <div className="text-center flex-1">
                    <div className="text-sm text-slate-400 mb-1">你获得</div>
                    <div className="text-3xl font-black text-amber-400">100 <span className="text-sm font-normal text-amber-400/70">积分</span></div>
                  </div>
                  <ArrowRight className="w-6 h-6 text-indigo-500 hidden sm:block"/>
                  <div className="text-center flex-1">
                    <div className="text-sm text-slate-400 mb-1">好友获得</div>
                    <div className="text-3xl font-black text-amber-400">50 <span className="text-sm font-normal text-amber-400/70">积分</span></div>
                  </div>
                </div>
                <div className="mt-6 text-sm text-indigo-300 bg-indigo-950/50 p-4 rounded-xl border border-indigo-800/50">
                  <strong>分享文案：</strong>"发现一个神器！不用学代码就能做数据分析，用自然语言说需求，AI自动出结果。注册输入我的邀请码，咱俩都有积分！"
                </div>
              </div>

              {/* Models Pricing */}
              <div className="bg-slate-800/40 p-8 rounded-3xl border border-slate-700/50 backdrop-blur-xl shadow-xl">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-slate-700/50 rounded-xl mr-4">
                    <Coins className="w-6 h-6 text-slate-300" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">单次任务消耗</h3>
                  </div>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-3">
                  {skillPrices.map(sp => (
                    <div key={sp.id} className="flex justify-between items-center p-3 bg-slate-900/50 rounded-xl border border-slate-700/50">
                      <span className="text-slate-300 text-sm">{sp.display_name}</span>
                      <div className="flex items-center">
                        <span className="font-mono font-bold text-blue-400 mr-1">{sp.cost}</span>
                        <span className="text-xs text-slate-500">积分</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Recharge Packages */}
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-b from-blue-600 to-indigo-900 p-1 rounded-3xl shadow-2xl relative overflow-hidden h-full">
                <div className="bg-slate-900/90 backdrop-blur-2xl rounded-[1.4rem] p-8 h-full flex flex-col relative z-10">
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-white tracking-tight">积分充值包</h3>
                    <p className="text-slate-400 mt-2 text-sm">随时扩容您的科研算力，积分永不过期。</p>
                  </div>
                  
                  <div className="space-y-4 flex-1">
                    {pointPackages.map(pkg => (
                      <div 
                        key={pkg.id} 
                        className={`relative p-5 rounded-2xl border transition-all cursor-pointer group overflow-hidden ${
                          pkg.is_recommended 
                            ? 'bg-blue-600/10 border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.15)]' 
                            : 'bg-white/5 border-white/10'
                        }`}
                      >
                        {pkg.is_recommended && (
                          <div className="absolute top-0 right-0 bg-gradient-to-r from-amber-400 to-orange-500 text-amber-950 text-[10px] font-black px-3 py-1 rounded-bl-xl tracking-wider uppercase">
                            最受学生欢迎
                          </div>
                        )}
                        <div className="flex justify-between items-center relative z-10">
                          <div>
                            <div className={`font-bold text-lg mb-1 ${pkg.is_recommended ? 'text-blue-100' : 'text-white'}`}>
                              {pkg.name}
                            </div>
                            <div className="flex items-center space-x-1.5 text-sm">
                              <Zap className={`w-4 h-4 ${pkg.is_recommended ? 'text-amber-400' : 'text-slate-400'}`} />
                              <span className={pkg.is_recommended ? 'text-amber-200' : 'text-slate-300'}>{pkg.points.toLocaleString()} 积分</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-3xl font-black text-white tracking-tight">{pkg.price}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <button onClick={handleStart} className="w-full py-4 px-4 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-100 transition-all text-center mt-8 shadow-xl flex items-center justify-center space-x-2">
                    <span>前往工作区充值</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7 & 8 & 10. 信任背书与核心优势 */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 font-serif tracking-tight">为什么选择 DeepResValue？</h2>
            <p className="mt-4 text-lg text-slate-600">国产顶尖 AI 驱动，结果可信可复现，全程透明合规。</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="p-8 bg-slate-50 rounded-3xl border border-slate-200 text-center">
              <div className="w-16 h-16 mx-auto bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <BrainCircuit className="w-8 h-8"/>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">DeepSeek V4 Pro</h3>
              <p className="text-slate-600">国产顶尖大模型，100万 Token 上下文，深度逻辑推理能力，精准理解复杂研究需求。</p>
            </div>
            <div className="p-8 bg-slate-50 rounded-3xl border border-slate-200 text-center">
              <div className="w-16 h-16 mx-auto bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                <BarChart2 className="w-8 h-8"/>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">学术级分析引擎</h3>
              <p className="text-slate-600">内置数百种统计方法，涵盖因果推断完整体系。方法透明，每个步骤均有学术依据。</p>
            </div>
            <div className="p-8 bg-slate-50 rounded-3xl border border-slate-200 text-center">
              <div className="w-16 h-16 mx-auto bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheck className="w-8 h-8"/>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">数据安全与可复现</h3>
              <p className="text-slate-600">国内本地部署，不依赖国外 API。分析代码支持一键导出 (Python/R/Stata)，结果完全可验证。</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-t border-b border-slate-100">
            <div className="text-center">
              <div className="text-4xl font-black text-blue-600 mb-2">1000+</div>
              <div className="text-sm font-bold text-slate-500">已服务高校用户</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-blue-600 mb-2">15<span className="text-2xl">min</span></div>
              <div className="text-sm font-bold text-slate-500">平均完成时间</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-blue-600 mb-2">96%</div>
              <div className="text-sm font-bold text-slate-500">用户满意度</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-blue-600 mb-2">50+</div>
              <div className="text-sm font-bold text-slate-500">竞赛获奖案例</div>
            </div>
          </div>
          
          {/* Ambassador */}
          <div className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 md:p-12 border border-blue-100 flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-8 text-center md:text-left">
              <h3 className="text-2xl font-bold text-slate-900 mb-2 flex items-center justify-center md:justify-start">
                <Star className="w-6 h-6 mr-2 text-amber-500 fill-amber-500"/> 校园研究大使招募
              </h3>
              <p className="text-slate-600">成为 Vibe Coding 新范式的布道者，享受 10-30% 推广佣金、免费使用权与专属竞赛指导。</p>
            </div>
            <div className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-slate-200 text-center shrink-0">
              <div className="text-sm text-slate-500 mb-1">添加微信申请</div>
              <div className="text-xl font-black text-blue-600 tracking-wider">MoChen11-20</div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Bottom CTA */}
      <section className="py-24 bg-blue-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-8 tracking-tight">别再学代码了，直接用母语做研究</h2>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-12">
            <button onClick={handleStart} className="w-full sm:w-auto px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-xl text-lg flex items-center justify-center">
              免费注册，体验 Vibe Coding <ArrowRight className="w-5 h-5 ml-2"/>
            </button>
            <div className="w-full sm:w-auto px-8 py-4 bg-blue-700/50 border border-blue-500/50 font-bold rounded-xl text-white text-lg flex flex-col items-center justify-center backdrop-blur-sm">
              <span className="text-sm text-blue-200 font-normal mb-1">添加微信咨询获取《避坑指南》</span>
              <span>微信号: MoChen11-20</span>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 text-sm font-medium text-blue-200">
            <span className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-1"/> 注册即送 3 次免费分析</span>
            <span className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-1"/> 输入邀请码额外送 50 积分</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-500 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center mb-6">
            <BrainCircuit className="w-6 h-6 text-slate-400"/>
          </div>
          <p className="font-bold text-slate-300 mb-2 text-lg tracking-tight">DeepResValue 深度研值</p>
          <p className="text-sm mb-6 max-w-md mx-auto">用自然语言做数据分析，告别代码，开口就能出结果。</p>
          <p className="text-xs">© 2026 DeepResValue. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
