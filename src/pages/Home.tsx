import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BarChart2, Database, BrainCircuit, ShieldCheck, Zap, BookOpen, Trophy, Coins } from "lucide-react";

export default function Home() {
  return (
    <div className="bg-[#FAFAFA] text-slate-800 font-sans selection:bg-blue-200 selection:text-blue-900">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-screen-xl -z-10 opacity-40 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100 blur-3xl"></div>
          <div className="absolute top-[20%] right-[-10%] w-[30%] h-[30%] rounded-full bg-indigo-50 blur-3xl"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 text-sm font-medium mb-8 shadow-sm"
        >
          <span className="flex h-2 w-2 rounded-full bg-blue-600"></span>
          <span>学术研究专属：全新数据分析与文献引擎</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 max-w-4xl leading-[1.15]"
        >
          重塑您的<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-700">科研工作流</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 text-xl text-slate-600 max-w-3xl leading-relaxed"
        >
          专为高校师生与科研人员打造的高端学术研究平台。通过自然语言交互，无缝衔接数据清洗、深度实证分析与学术写作。
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 flex flex-wrap justify-center gap-3 max-w-3xl"
        >
          <span className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-50 text-blue-800 text-sm font-semibold border border-blue-100 shadow-sm">
            <Database className="w-4 h-4 mr-2" /> 海量内置科研数据（宏微观）
          </span>
          <span className="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-50 text-indigo-800 text-sm font-semibold border border-indigo-100 shadow-sm">
            <BookOpen className="w-4 h-4 mr-2" /> 自动文献综述
          </span>
          <span className="inline-flex items-center px-4 py-2 rounded-lg bg-amber-50 text-amber-800 text-sm font-semibold border border-amber-100 shadow-sm">
            <Trophy className="w-4 h-4 mr-2" /> 国家级竞赛指导 (正大杯, 统计建模)
          </span>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
        >
          <Link to="/chat" className="inline-flex items-center justify-center px-8 py-3.5 text-base font-medium text-white bg-[#0F172A] rounded-lg hover:bg-slate-800 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform duration-200">
            进入研究室 <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
          <a href="#demo" className="inline-flex items-center justify-center px-8 py-3.5 text-base font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
            查看演示
          </a>
        </motion.div>

        {/* Product Illustration */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-20 w-full max-w-5xl rounded-2xl border border-slate-200/60 bg-white shadow-2xl overflow-hidden flex flex-col p-2 bg-gradient-to-b from-slate-50 to-white ring-1 ring-slate-900/5"
        >
          <img 
            src="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=A%20minimalist%20academic%20data%20analysis%20dashboard%2C%20data%20science%2C%20clean%20ui%2C%20blue%20and%20ivory&image_size=landscape_16_9" 
            alt="Academic Data Analysis Dashboard" 
            className="w-full h-auto rounded-xl shadow-sm border border-slate-100"
          />
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 font-serif">严谨、高效的学术引擎</h2>
            <p className="mt-4 text-lg text-slate-600">从文献调研到数据建模，为您提供全链路的科研支持。</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: BookOpen, title: "自动文献综述", desc: "接入全球顶尖学术数据库，一键生成结构化文献综述，精准提炼研究空白与前沿动态。" },
              { icon: Database, title: "海量内置宏微观数据", desc: "无缝对接 CFPS、CHFS 等权威微观调查数据及各大宏观经济年鉴，即开即用，省去繁琐的数据搜集环节。" },
              { icon: Trophy, title: "国家级竞赛全程指导", desc: "针对“正大杯”、全国大学生统计建模大赛等核心赛事，提供从选题、模型构建到报告撰写的专业辅导。" },
              { icon: BrainCircuit, title: "自然语言数据建模", desc: "通过对话即可完成数据清洗、变量生成及 OLS、面板、工具变量等复杂计量经济学模型的构建与检验。" },
              { icon: BarChart2, title: "出版级图表生成", desc: "一键导出符合 APA、GB/T 7714 等标准的学术图表及三线表，直接用于论文排版。" },
              { icon: ShieldCheck, title: "最高级别数据安全", desc: "研究数据采用端到端加密存储，分析过程完全隔离，确保您的学术成果与独家数据绝对安全。" }
            ].map((f, i) => (
              <div key={i} className="p-8 rounded-2xl bg-[#FAFAFA] border border-slate-100 hover:shadow-lg hover:border-blue-100 transition-all duration-300 group">
                <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-slate-200 text-blue-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{f.title}</h3>
                <p className="text-slate-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing - Dynamic Points */}
      <section id="pricing" className="py-24 bg-[#0F172A] text-slate-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white font-serif">算力积分：按需消耗，透明计费</h2>
            <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">不同类型的学术任务消耗相应的算力积分，微观数据与庞大样本量的复杂运算精准度量。</p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Rules */}
            <div className="lg:col-span-2 bg-slate-800/50 p-8 rounded-3xl border border-slate-700 backdrop-blur-sm">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Coins className="w-6 h-6 mr-3 text-amber-400" /> 动态消耗规则明细
              </h3>
              
              <div className="space-y-6">
                <div className="bg-slate-800 p-5 rounded-xl border border-slate-700/50">
                  <h4 className="text-lg font-semibold text-white mb-3">📊 数据分析类</h4>
                  <ul className="space-y-3">
                    <li className="flex justify-between items-center border-b border-slate-700/50 pb-2">
                      <span>宏观数据分析 (常规样本量)</span>
                      <span className="font-mono text-emerald-400">5 积分/次</span>
                    </li>
                    <li className="flex justify-between items-center border-b border-slate-700/50 pb-2">
                      <span>微观调查数据 (百万级样本量)</span>
                      <span className="font-mono text-amber-400">15 积分/次</span>
                    </li>
                    <li className="flex justify-between items-center text-sm text-slate-400 pt-1">
                      <span>* 数据集超过 50MB 后，每增加 10MB 额外收取 1 积分</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-slate-800 p-5 rounded-xl border border-slate-700/50">
                  <h4 className="text-lg font-semibold text-white mb-3">📝 学术研究类</h4>
                  <ul className="space-y-3">
                    <li className="flex justify-between items-center border-b border-slate-700/50 pb-2">
                      <span>基础文献检索与对话</span>
                      <span className="font-mono text-emerald-400">2 积分/次</span>
                    </li>
                    <li className="flex justify-between items-center border-b border-slate-700/50 pb-2">
                      <span>深度自动文献综述生成</span>
                      <span className="font-mono text-amber-400">20 积分/篇</span>
                    </li>
                    <li className="flex justify-between items-center pb-2">
                      <span>竞赛报告/论文结构指导</span>
                      <span className="font-mono text-rose-400">50 积分/次</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Recharge */}
            <div className="bg-gradient-to-b from-blue-900 to-indigo-900 p-8 rounded-3xl border border-blue-700/50 shadow-2xl flex flex-col relative overflow-hidden">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500 rounded-full blur-3xl opacity-20"></div>
              
              <h3 className="text-2xl font-bold text-white relative z-10">购买算力积分</h3>
              <p className="text-blue-200 mt-2 text-sm relative z-10">新注册用户即赠 100 初始积分</p>
              
              <div className="my-8 relative z-10">
                <div className="bg-white/10 rounded-xl p-4 border border-white/20 mb-4 cursor-pointer hover:bg-white/20 transition-colors">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-white font-bold">基础包</div>
                      <div className="text-blue-200 text-sm">500 积分</div>
                    </div>
                    <div className="text-xl font-bold text-white">¥29</div>
                  </div>
                </div>
                
                <div className="bg-blue-600/40 rounded-xl p-4 border border-blue-400/50 mb-4 cursor-pointer hover:bg-blue-600/60 transition-colors relative">
                  <div className="absolute -top-3 -right-2 bg-amber-400 text-amber-950 text-xs font-bold px-2 py-0.5 rounded shadow">推荐</div>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-white font-bold">科研包</div>
                      <div className="text-blue-200 text-sm">2000 积分</div>
                    </div>
                    <div className="text-xl font-bold text-white">¥99</div>
                  </div>
                </div>

                <div className="bg-white/10 rounded-xl p-4 border border-white/20 cursor-pointer hover:bg-white/20 transition-colors">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-white font-bold">课题组包</div>
                      <div className="text-blue-200 text-sm">10000 积分</div>
                    </div>
                    <div className="text-xl font-bold text-white">¥399</div>
                  </div>
                </div>
              </div>
              
              <Link to="/chat" className="w-full py-3.5 px-4 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-100 transition-colors text-center mt-auto shadow-lg relative z-10">
                立即充值
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-500">
          <p>© 2026 AcademicAI. 赋能严肃学术与数据科学研究。</p>
        </div>
      </footer>
    </div>
  );
}
