import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BarChart2, Database, BrainCircuit, ShieldCheck, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-200">
      {/* Navigation */}
      <nav className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <BarChart2 className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">StatsAI</span>
          </div>
          <div className="hidden md:flex space-x-8">
            <a href="#features" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">核心功能</a>
            <a href="#pricing" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">定价</a>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/chat" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">登录</Link>
            <Link to="/chat" className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors shadow-sm">
              开始使用
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium mb-8"
        >
          <span className="flex h-2 w-2 rounded-full bg-blue-600"></span>
          <span>全新升级：集成 Deerflow 2.0 智能体</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 max-w-4xl leading-[1.1]"
        >
          与您的科研数据<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">直接对话</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 text-xl text-slate-600 max-w-2xl leading-relaxed"
        >
          专为大学生和科研人员打造的智能实证分析平台。无需编写代码，只需通过自然语言交互，即可完成数据清洗、描述性统计及深度回归分析。
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
        >
          <Link to="/chat" className="inline-flex items-center justify-center px-8 py-3.5 text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform duration-200">
            进入工作区 <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
          <a href="#demo" className="inline-flex items-center justify-center px-8 py-3.5 text-base font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
            查看演示
          </a>
        </motion.div>

        {/* Product Mockup */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-20 w-full max-w-5xl rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden flex flex-col"
        >
          <div className="h-12 bg-slate-100 border-b border-slate-200 flex items-center px-4 space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-amber-400"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
          </div>
          <div className="flex h-[500px] bg-slate-50">
            {/* Sidebar mock */}
            <div className="w-64 border-r border-slate-200 bg-white p-4 hidden md:block">
              <div className="h-8 bg-slate-100 rounded-md w-full mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                <div className="h-4 bg-slate-100 rounded w-5/6"></div>
                <div className="h-4 bg-slate-100 rounded w-2/3"></div>
              </div>
            </div>
            {/* Chat mock */}
            <div className="flex-1 p-6 flex flex-col justify-end space-y-6">
              <div className="flex justify-end">
                <div className="bg-blue-600 text-white rounded-2xl rounded-tr-sm px-4 py-2 max-w-[80%]">
                  <p className="text-sm">帮我分析一下这份社会调查数据的性别和收入的关系，做个回归。</p>
                </div>
              </div>
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 shadow-sm text-slate-800 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[80%]">
                  <div className="flex items-center space-x-2 mb-2 text-blue-600">
                    <BrainCircuit className="w-4 h-4" />
                    <span className="text-xs font-semibold">分析智能体</span>
                  </div>
                  <p className="text-sm mb-3">好的，我已经为您运行了 OLS 回归分析。结果显示性别对收入有显著影响（p &lt; 0.05）。</p>
                  <div className="h-32 bg-slate-50 rounded border border-slate-100 flex items-end justify-around px-4 pb-2 pt-4">
                    <div className="w-8 bg-blue-400 rounded-t h-[60%]"></div>
                    <div className="w-8 bg-indigo-400 rounded-t h-[80%]"></div>
                    <div className="w-8 bg-blue-300 rounded-t h-[40%]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900">强大的底层驱动，极简的交互体验</h2>
            <p className="mt-4 text-lg text-slate-600">融合开源社区最佳实践，将专业数据分析能力平民化。</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: BrainCircuit, title: "Deerflow 2.0 智能体", desc: "搭载最新一代多智能体框架，精准理解学术意图，自动规划分析路径。" },
              { icon: BarChart2, title: "Statspai 引擎集成", desc: "内置专业开源实证分析库，支持描述统计、相关性、回归模型等多种社会科学分析方法。" },
              { icon: Database, title: "智能数据清洗", desc: "上传杂乱的 Excel 或 CSV，AI 会自动识别缺失值并推荐处理策略。" },
              { icon: Zap, title: "秒级响应", desc: "优化的云端计算架构，即便是大规模样本数据也能在数秒内返回可视化结果。" },
              { icon: ShieldCheck, title: "学术隐私安全", desc: "数据分析全程加密，分析完成后即时释放，绝不用于模型训练，保障您的科研数据安全。" }
            ].map((f, i) => (
              <div key={i} className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-slate-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">适合所有人的定价</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col">
              <h3 className="text-2xl font-bold text-slate-900">基础版</h3>
              <p className="text-slate-500 mt-2">适合日常课程作业及小规模数据探索</p>
              <div className="my-6">
                <span className="text-4xl font-extrabold text-slate-900">免费</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center text-slate-600"><ShieldCheck className="w-5 h-5 text-emerald-500 mr-2" /> 每日 20 次对话</li>
                <li className="flex items-center text-slate-600"><ShieldCheck className="w-5 h-5 text-emerald-500 mr-2" /> 支持最大 10MB 数据集</li>
                <li className="flex items-center text-slate-600"><ShieldCheck className="w-5 h-5 text-emerald-500 mr-2" /> 基础描述性统计分析</li>
              </ul>
              <Link to="/chat" className="w-full py-3 px-4 bg-slate-100 text-slate-900 font-medium rounded-lg hover:bg-slate-200 transition-colors text-center">
                免费开始
              </Link>
            </div>
            
            <div className="bg-blue-600 p-8 rounded-3xl border border-blue-500 shadow-xl flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-amber-400 text-amber-950 text-xs font-bold px-3 py-1 rounded-bl-lg">
                最受欢迎
              </div>
              <h3 className="text-2xl font-bold text-white">专业版</h3>
              <p className="text-blue-100 mt-2">为毕业论文及正式科研项目量身定制</p>
              <div className="my-6 text-white">
                <span className="text-4xl font-extrabold">¥29</span><span className="text-blue-200"> / 月</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1 text-white">
                <li className="flex items-center text-blue-50"><ShieldCheck className="w-5 h-5 text-blue-300 mr-2" /> 无限制对话次数</li>
                <li className="flex items-center text-blue-50"><ShieldCheck className="w-5 h-5 text-blue-300 mr-2" /> 支持最大 500MB 数据集</li>
                <li className="flex items-center text-blue-50"><ShieldCheck className="w-5 h-5 text-blue-300 mr-2" /> 高级实证分析（面板数据、多重共线性检验等）</li>
                <li className="flex items-center text-blue-50"><ShieldCheck className="w-5 h-5 text-blue-300 mr-2" /> 导出出版级图表及分析报告</li>
              </ul>
              <Link to="/chat" className="w-full py-3 px-4 bg-white text-blue-600 font-medium rounded-lg hover:bg-slate-50 transition-colors text-center">
                立即升级
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-500">
          <p>© 2026 StatsAI. Powered by Deerflow 2.0 & Statspai.</p>
        </div>
      </footer>
    </div>
  );
}
