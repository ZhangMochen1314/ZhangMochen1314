import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BarChart2, Database, BrainCircuit, ShieldCheck, Zap, BookOpen, Trophy, Coins } from "lucide-react";
import { useStore } from "@/store/useStore";

export default function Home() {
  const { token, setShowAuthModal } = useStore();
  const navigate = useNavigate();

  const handleStart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (token) {
      navigate('/chat');
    } else {
      setShowAuthModal(true);
    }
  };

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
          <button onClick={handleStart} className="inline-flex items-center justify-center px-8 py-3.5 text-base font-medium text-white bg-[#0F172A] rounded-lg hover:bg-slate-800 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform duration-200">
            进入研究室 <ArrowRight className="ml-2 w-5 h-5" />
          </button>
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
            src="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=A%20high-end%20academic%20research%20platform%20interface%2C%20data%20visualization%2C%20glowing%20network%20graphs%2C%20microeconomics%20and%20macroeconomics%2C%20deep%20blue%20and%20cyan%2C%20glassmorphism%2C%203d%20render%2C%20unreal%20engine%205%2C%208k%20resolution%2C%20clean%20and%20modern&image_size=landscape_16_9" 
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white font-serif tracking-tight">按需计算，为学生减负</h2>
            <p className="mt-4 text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
              告别昂贵的传统商业软件年费。在 DeepResValue，您只需为您真正运行的模型和查询的数据支付极少的算力成本。用更低的门槛，享受顶尖实验室级别的学术算力。
            </p>
          </div>
          
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Rules */}
            <div className="lg:col-span-3 space-y-6">
              <div className="bg-slate-800/40 p-8 rounded-3xl border border-slate-700/50 backdrop-blur-xl hover:bg-slate-800/60 transition-colors shadow-2xl">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-amber-500/10 rounded-xl mr-4">
                    <Coins className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">模型算力与服务定价</h3>
                    <p className="text-slate-400 text-sm mt-1">每次调用智能体执行特定学术任务时消耗的算力积分</p>
                  </div>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  {useStore.getState().skillPrices.map(sp => (
                    <div key={sp.id} className="flex justify-between items-center p-4 bg-slate-900/50 rounded-2xl border border-slate-700/50 hover:border-slate-600 transition-colors group">
                      <span className="text-slate-300 font-medium group-hover:text-white transition-colors">{sp.display_name}</span>
                      <div className="flex items-center">
                        <span className="font-mono text-xl font-bold text-blue-400 mr-1">{sp.cost}</span>
                        <span className="text-xs text-slate-500">积分/次</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 p-8 rounded-3xl border border-blue-800/30 backdrop-blur-xl flex items-start space-x-4">
                <div className="p-3 bg-blue-500/20 rounded-full flex-shrink-0">
                  <ShieldCheck className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white mb-2">学生认证专属福利</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    使用 <code className="text-blue-300 bg-blue-900/30 px-1.5 py-0.5 rounded">.edu.cn</code> 邮箱注册的用户，每月系统将自动发放 <strong className="text-amber-400">100</strong> 额度研究赞助积分。如需大规模微观数据跑批，请选择右侧适合您的扩容套餐。
                  </p>
                </div>
              </div>
            </div>
            
            {/* Recharge */}
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-b from-blue-600 to-indigo-900 p-1 rounded-3xl shadow-2xl relative overflow-hidden h-full">
                {/* Glowing effects */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl"></div>
                
                <div className="bg-slate-900/90 backdrop-blur-2xl rounded-[1.4rem] p-8 h-full flex flex-col relative z-10">
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-white tracking-tight">积分充值包</h3>
                    <p className="text-slate-400 mt-2 text-sm">随时扩容您的科研算力，买得多省得多，积分永不过期。</p>
                  </div>
                  
                  <div className="space-y-4 flex-1">
                    {useStore.getState().pointPackages.map(pkg => (
                      <div 
                        key={pkg.id} 
                        className={`relative p-5 rounded-2xl border transition-all cursor-pointer group overflow-hidden ${
                          pkg.is_recommended 
                            ? 'bg-blue-600/10 border-blue-500/50 hover:bg-blue-600/20 shadow-[0_0_30px_rgba(59,130,246,0.15)]' 
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
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
                              <span className={pkg.is_recommended ? 'text-amber-200' : 'text-slate-300'}>包含 {pkg.points.toLocaleString()} 积分</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-3xl font-black text-white tracking-tight">{pkg.price}</div>
                            {pkg.points > 1000 && (
                              <div className="text-xs text-emerald-400 font-medium mt-1">单价立减 {(1 - parseInt(pkg.price.replace('¥', '')) / (pkg.points * 0.058)).toFixed(2).split('.')[1]}%</div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <button onClick={handleStart} className="w-full py-4 px-4 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-100 transition-all text-center mt-8 shadow-xl shadow-white/10 flex items-center justify-center space-x-2 group">
                    <span>前往工作区充值</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-500">
          <p>© 2026 DeepResValue. 赋能严肃学术与数据科学研究。</p>
        </div>
      </footer>
    </div>
  );
}
