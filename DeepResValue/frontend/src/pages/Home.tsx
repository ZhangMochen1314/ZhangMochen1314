import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BarChart2, Database, BrainCircuit, ShieldCheck, Zap, BookOpen, Trophy, Coins, Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import DynamicBackground from "@/components/DynamicBackground";

export default function Home() {
  const [loadingTopUp, setLoadingTopUp] = useState<number | null>(null);
  const navigate = useNavigate();
  const { isAuthenticated, token, openAuthModal } = useAuthStore();

  const handleTopUp = async (amount: number) => {
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }

    setLoadingTopUp(amount);
    try {
      const res = await fetch('/api/points/top-up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ amount })
      });

      if (!res.ok) {
        throw new Error('Top-up failed');
      }

      const data = await res.json();
      if (data.pay_url) {
        window.location.href = data.pay_url;
      }
    } catch (err) {
      console.error(err);
      alert('发起支付失败，请稍后重试');
    } finally {
      setLoadingTopUp(null);
    }
  };

  return (
    <div className="bg-slate-950 text-slate-300 font-sans selection:bg-blue-500/30 selection:text-blue-200 relative min-h-screen overflow-hidden">
      <DynamicBackground />
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center z-10">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-screen-xl -z-10 opacity-30 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/20 blur-[100px]"></div>
          <div className="absolute top-[20%] right-[-10%] w-[30%] h-[30%] rounded-full bg-[#d97757]/10 blur-[100px]"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-slate-300 text-sm font-medium mb-8 shadow-[0_0_15px_rgba(106,155,204,0.15)]"
        >
          <span className="flex h-2 w-2 rounded-full bg-[#6a9bcc] shadow-[0_0_8px_#6a9bcc]"></span>
          <span className="tracking-wide">AI驱动实证分析新研究范式 · 正大杯/统计建模国奖利器</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tight text-white max-w-4xl leading-[1.15] font-serif"
        >
          重塑你的<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6a9bcc] to-[#d97757]">科研战斗力</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 text-xl text-slate-400 max-w-3xl leading-relaxed font-light"
        >
          专为商科与社科领域大学生打造的 AI 学术引擎。内置千万级微观与宏观数据，对话式跑模型、做面板、写综述，让你的论文不仅能发，还能拿奖。
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 flex flex-wrap justify-center gap-3 max-w-3xl"
        >
          <span className="inline-flex items-center px-4 py-2 rounded-lg bg-[#6a9bcc]/10 text-[#6a9bcc] text-sm font-semibold border border-[#6a9bcc]/20 shadow-sm backdrop-blur-sm">
            <Database className="w-4 h-4 mr-2" /> 海量内置科研数据（宏微观）
          </span>
          <span className="inline-flex items-center px-4 py-2 rounded-lg bg-[#788c5d]/10 text-[#788c5d] text-sm font-semibold border border-[#788c5d]/20 shadow-sm backdrop-blur-sm">
            <BookOpen className="w-4 h-4 mr-2" /> 自动文献综述
          </span>
          <span className="inline-flex items-center px-4 py-2 rounded-lg bg-[#d97757]/10 text-[#d97757] text-sm font-semibold border border-[#d97757]/20 shadow-sm backdrop-blur-sm">
            <Trophy className="w-4 h-4 mr-2" /> 国家级竞赛指导
          </span>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6"
        >
          {isAuthenticated ? (
            <Link to="/chat" className="group relative inline-flex items-center justify-center px-8 py-3.5 text-base font-medium text-white bg-[#6a9bcc] rounded-xl overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(106,155,204,0.4)]">
              <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
              <span className="relative flex items-center">进入研究室 <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" /></span>
            </Link>
          ) : (
            <button onClick={() => openAuthModal('register')} className="group relative inline-flex items-center justify-center px-8 py-3.5 text-base font-medium text-white bg-gradient-to-r from-[#6a9bcc] to-[#d97757] rounded-xl overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(217,119,87,0.4)]">
              <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
              <span className="relative flex items-center">使用邀请码注册 <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" /></span>
            </button>
          )}
          <a href="#demo" className="inline-flex items-center justify-center px-8 py-3.5 text-base font-medium text-slate-300 bg-white/5 border border-white/10 backdrop-blur-md rounded-xl hover:bg-white/10 hover:text-white transition-all">
            查看演示
          </a>
        </motion.div>

        {/* Product Illustration */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-24 w-full max-w-5xl rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col p-2 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#6a9bcc]/5 to-[#d97757]/5 pointer-events-none"></div>
          <img 
            src="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=A%20high-end%20academic%20research%20platform%20interface%2C%20data%20visualization%2C%20glowing%20network%20graphs%2C%20microeconomics%20and%20macroeconomics%2C%20deep%20blue%20and%20cyan%2C%20glassmorphism%2C%203d%20render%2C%20unreal%20engine%205%2C%208k%20resolution%2C%20clean%20and%20modern&image_size=landscape_16_9" 
            alt="Academic Data Analysis Dashboard" 
            className="w-full h-auto rounded-xl shadow-inner border border-white/5 relative z-10 opacity-90 hover:opacity-100 transition-opacity"
          />
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-slate-950/80 backdrop-blur-sm border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-white font-serif">不只是工具，更是你的国奖导师</h2>
            <p className="mt-4 text-lg text-slate-400 font-light">一站式解决“找数据难”、“跑模型报错”、“写综述慢”三大核心痛点。</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: BookOpen, title: "结构化文献速读", desc: "扔进百篇英文文献，一键生成带有研究空白 (Research Gap) 与方法对比的矩阵综述。", color: "text-[#6a9bcc]" },
              { icon: Database, title: "开箱即用的宏微观数据", desc: "内置 CFPS、CHFS 等千万级微观数据及宏观年鉴。需要什么变量，说句话就能提取并清洗。", color: "text-[#d97757]" },
              { icon: Trophy, title: "正大杯 / 统计建模国奖指导", desc: "独家内置历年国奖优秀论文分析范式，从选题创新到模型建立，手把手带你冲击国奖。", color: "text-[#788c5d]" },
              { icon: BrainCircuit, title: "自然语言跑模型", desc: "再也不用背 Stata / Python 代码。直接说“帮我跑个双重差分模型，加上个体固定效应”，一秒出结果。", color: "text-[#6a9bcc]" },
              { icon: BarChart2, title: "一键导出核心期刊图表", desc: "所有实证结果（如三线表、平行趋势检验图）自动排版，符合核心期刊与毕业论文标准，直接复制使用。", color: "text-[#d97757]" },
              { icon: ShieldCheck, title: "代码与数据双重溯源", desc: "所有的 AI 分析过程均提供完整的 Python 代码与中间数据下载，确保研究的严谨性与可复现性。", color: "text-[#788c5d]" }
            ].map((f, i) => (
              <div key={i} className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all duration-300 group backdrop-blur-md">
                <div className={`w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${f.color}`}>
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
                <p className="text-slate-400 leading-relaxed font-light">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing - Dynamic Points */}
      <section id="pricing" className="py-24 bg-slate-950 text-slate-300 relative z-10 border-t border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#6a9bcc]/5 via-transparent to-transparent pointer-events-none"></div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white font-serif">算力积分：按需消耗，透明计费</h2>
            <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto font-light">不同类型的学术任务消耗相应的算力积分，微观数据与庞大样本量的复杂运算精准度量。</p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Rules */}
            <div className="lg:col-span-2 bg-slate-900/50 p-8 rounded-3xl border border-white/5 backdrop-blur-md">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Coins className="w-6 h-6 mr-3 text-[#d97757]" /> 动态消耗规则明细
              </h3>
              
              <div className="space-y-6">
                <div className="bg-slate-800/40 p-5 rounded-xl border border-white/5">
                  <h4 className="text-lg font-semibold text-white mb-3">📊 数据提取与分析</h4>
                  <ul className="space-y-3">
                    <li className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span className="font-light text-slate-300">微观企业指标提取 (最精细)</span>
                      <span className="font-mono text-[#d97757]">50 积分/次</span>
                    </li>
                    <li className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span className="font-light text-slate-300">县级 / 市级 / 省级宏观数据</span>
                      <span className="font-mono text-[#6a9bcc]">30 / 20 / 10 积分/次</span>
                    </li>
                    <li className="flex justify-between items-center text-sm text-slate-500 pt-1">
                      <span>* 输出文件大小附加费：每输出 1MB 额外收取 5 积分</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-slate-800/40 p-5 rounded-xl border border-white/5">
                  <h4 className="text-lg font-semibold text-white mb-3">📝 文献与模型指导</h4>
                  <ul className="space-y-3">
                    <li className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span className="font-light text-slate-300">单次专业文献检索</span>
                      <span className="font-mono text-[#788c5d]">20 积分/次</span>
                    </li>
                    <li className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span className="font-light text-slate-300">计量模型诊断与建议</span>
                      <span className="font-mono text-purple-400">按复杂度计算 (1.0~2.0x)</span>
                    </li>
                    <li className="flex justify-between items-center pb-2">
                      <span className="font-light text-slate-300">竞赛报告/论文结构指导</span>
                      <span className="font-mono text-[#d97757]">50 积分/次</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Recharge */}
            <div className="bg-slate-900/80 p-8 rounded-3xl border border-white/10 shadow-[0_0_30px_rgba(106,155,204,0.1)] flex flex-col relative overflow-hidden backdrop-blur-xl group">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#6a9bcc] rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
              
              <h3 className="text-2xl font-bold text-white relative z-10">购买算力积分</h3>
              <p className="text-slate-400 mt-2 text-sm relative z-10 font-light">新注册用户即赠 50 初始积分</p>
              
              <div className="my-8 relative z-10">
                <div 
                  className="bg-white/[0.03] rounded-xl p-4 border border-white/5 mb-4 cursor-pointer hover:bg-white/[0.06] hover:border-white/10 transition-colors"
                  onClick={() => handleTopUp(29)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-white font-medium">基础包</div>
                      <div className="text-slate-400 text-sm font-light">500 积分</div>
                    </div>
                    <div className="text-xl font-bold text-white flex items-center">
                      {loadingTopUp === 29 ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                      ¥29
                    </div>
                  </div>
                </div>
                
                <div 
                  className="bg-[#6a9bcc]/10 rounded-xl p-4 border border-[#6a9bcc]/30 mb-4 cursor-pointer hover:bg-[#6a9bcc]/20 hover:shadow-[0_0_15px_rgba(106,155,204,0.2)] transition-all relative"
                  onClick={() => handleTopUp(99)}
                >
                  <div className="absolute -top-3 -right-2 bg-[#d97757] text-white text-xs font-bold px-2 py-0.5 rounded shadow-lg">推荐</div>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-[#6a9bcc] font-medium">科研包</div>
                      <div className="text-slate-300 text-sm font-light">2000 积分</div>
                    </div>
                    <div className="text-xl font-bold text-white flex items-center">
                      {loadingTopUp === 99 ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                      ¥99
                    </div>
                  </div>
                </div>

                <div 
                  className="bg-white/[0.03] rounded-xl p-4 border border-white/5 cursor-pointer hover:bg-white/[0.06] hover:border-white/10 transition-colors"
                  onClick={() => handleTopUp(399)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-white font-medium">课题组包</div>
                      <div className="text-slate-400 text-sm font-light">10000 积分</div>
                    </div>
                    <div className="text-xl font-bold text-white flex items-center">
                      {loadingTopUp === 399 ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                      ¥399
                    </div>
                  </div>
                </div>
              </div>
              
              <Link to="/chat" className="w-full py-3.5 px-4 bg-white text-slate-950 font-bold rounded-xl hover:bg-slate-200 transition-colors text-center mt-auto shadow-[0_0_15px_rgba(255,255,255,0.1)] relative z-10">
                立即充值
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-white/5 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-center md:text-left text-slate-500 font-light space-y-4 md:space-y-0">
          <p>© 2026 DeepResValue 深度研值. 赋能严肃学术与数据科学研究。</p>
          <div className="flex items-center justify-center space-x-2 text-sm bg-white/5 px-4 py-2 rounded-full border border-white/10">
            <span className="w-2 h-2 rounded-full bg-[#788c5d] shadow-[0_0_8px_#788c5d] animate-pulse"></span>
            <span>添加官方微信号 <strong className="text-white font-medium">MoChen11-20</strong> 领取内测福利</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
