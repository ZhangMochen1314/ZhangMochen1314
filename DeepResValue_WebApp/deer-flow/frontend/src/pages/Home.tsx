import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BarChart2, Database, BrainCircuit, ShieldCheck, BookOpen, Trophy, Coins, Award, Target, Sparkles } from "lucide-react";
import AuthModal from "@/components/AuthModal";
import AlgorithmicBackground from "@/components/AlgorithmicBackground";
import { useAuthStore } from "@/store/useAuthStore";

export default function Home() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authView, setAuthView] = useState<"login" | "register">("login");
  const token = useAuthStore(state => state.token);
  const navigate = useNavigate();

  const handleCTA = (view: "login" | "register") => {
    if (token) {
      navigate("/chat");
    } else {
      setAuthView(view);
      setIsAuthOpen(true);
    }
  };

  return (
    <div className="bg-[#faf9f5] text-[#141413] font-sans selection:bg-[#6a9bcc]/30 selection:text-[#141413] relative min-h-screen">
      <AlgorithmicBackground />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center z-10">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-[#e8e6dc] text-[#141413] text-sm font-medium mb-8 shadow-sm"
          style={{ fontFamily: "'Poppins', Arial, sans-serif" }}
        >
          <Award className="w-4 h-4 text-[#d97757]" />
          <span>全新上线：DeepResValue 深度研值</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight text-[#141413] max-w-5xl leading-[1.15]"
          style={{ fontFamily: "'Poppins', Arial, sans-serif" }}
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d97757] to-[#6a9bcc]">AI驱动实证分析</span><br/>新研究范式
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          className="mt-6 text-xl text-[#141413]/80 max-w-3xl leading-relaxed"
          style={{ fontFamily: "'Lora', Georgia, serif" }}
        >
          作为你的<strong className="text-[#141413] font-bold">统计建模国奖利器</strong>与<strong className="text-[#141413] font-bold">正大杯专业导师</strong>，DeepResValue 深度研值一站式赋能你的冠军之路。
          从创新选题、海量微观数据获取，到复杂计量经济学模型构建与规范论文导出，助你打造无可挑剔的竞赛作品。
          <br/><br/>
          <strong className="text-[#d97757] font-semibold">内测现已开启：凭邀请码注册即赠 50 积分，邀请队友再获 100 积分！</strong>
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex flex-wrap justify-center gap-3 max-w-3xl"
          style={{ fontFamily: "'Poppins', Arial, sans-serif" }}
        >
          <span className="inline-flex items-center px-4 py-2 rounded-xl bg-white/60 backdrop-blur-sm text-[#141413] text-sm font-semibold border border-[#e8e6dc] shadow-sm">
            <Target className="w-4 h-4 mr-2 text-[#d97757]" /> 统计建模国奖
          </span>
          <span className="inline-flex items-center px-4 py-2 rounded-xl bg-white/60 backdrop-blur-sm text-[#141413] text-sm font-semibold border border-[#e8e6dc] shadow-sm">
            <Trophy className="w-4 h-4 mr-2 text-[#6a9bcc]" /> 正大杯市调大赛
          </span>
          <span className="inline-flex items-center px-4 py-2 rounded-xl bg-white/60 backdrop-blur-sm text-[#141413] text-sm font-semibold border border-[#e8e6dc] shadow-sm">
            <Sparkles className="w-4 h-4 mr-2 text-[#788c5d]" /> 挑战杯/大创
          </span>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
          style={{ fontFamily: "'Poppins', Arial, sans-serif" }}
        >
          <button 
            onClick={() => handleCTA("login")} 
            className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-[#141413] rounded-xl hover:bg-[#2a2a29] transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transform duration-300"
          >
            {token ? "进入研究室" : "立即登录系统"} <ArrowRight className="ml-2 w-5 h-5" />
          </button>
          {!token && (
            <button 
              onClick={() => handleCTA("register")} 
              className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-[#141413] bg-white border border-[#e8e6dc] rounded-xl hover:bg-[#e8e6dc]/50 hover:border-[#b0aea5] transition-all shadow-sm"
            >
              输入邀请码注册
            </button>
          )}
        </motion.div>

        {/* Product Illustration */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-24 w-full max-w-5xl rounded-3xl border border-[#e8e6dc] bg-white/50 backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col p-2 ring-1 ring-[#141413]/5 relative"
        >
          {/* Simulated Glass Reflection */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/40 via-white/10 to-transparent pointer-events-none"></div>
          <img 
            src="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=A%20high-end%20academic%20research%20platform%20interface%2C%20data%20visualization%2C%20glowing%20network%20graphs%2C%20microeconomics%20and%20macroeconomics%2C%20deep%20blue%20and%20cyan%2C%20glassmorphism%2C%203d%20render%2C%20unreal%20engine%205%2C%208k%20resolution%2C%20clean%20and%20modern&image_size=landscape_16_9" 
            alt="Academic Data Analysis Dashboard" 
            className="w-full h-auto rounded-2xl shadow-sm border border-[#e8e6dc]/50 relative z-10"
          />
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-white border-t border-[#e8e6dc] relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl font-bold text-[#141413] tracking-tight" style={{ fontFamily: "'Poppins', Arial, sans-serif" }}>
              打造无可挑剔的竞赛作品
            </h2>
            <p className="mt-6 text-lg text-[#141413]/70 leading-relaxed" style={{ fontFamily: "'Lora', Georgia, serif" }}>
              从海量数据的清洗挖掘，到高级计量模型的精准检验，再到符合核心期刊标准的图表导出，DeepResValue 为您的团队提供降维打击般的竞赛优势。
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: BookOpen, title: "文献降维提炼", desc: "极速生成高维结构化文献综述，直击研究痛点与创新空白，让你的选题报告赢在起跑线。", color: "#6a9bcc" },
              { icon: Database, title: "独家数据引擎", desc: "无缝调取 CFPS、CHFS 微观调查数据及各省市宏观经济年鉴，告别繁琐的八爪鱼式搜集。", color: "#d97757" },
              { icon: Trophy, title: "金牌赛事向导", desc: "专为“正大杯”与“统计建模”定制，提供符合评委视角的实证框架设计与报告行文指导。", color: "#788c5d" },
              { icon: BrainCircuit, title: "对话即建模", desc: "用自然语言即可指挥系统完成 OLS、面板数据分析及工具变量检验，让文科生也能玩转计量经济学。", color: "#6a9bcc" },
              { icon: BarChart2, title: "出版级图表", desc: "一键导出符合 APA 规范的高清学术图表及完美三线表，无需在 Excel 与 Word 间疲于奔命。", color: "#d97757" },
              { icon: ShieldCheck, title: "数据绝对隔离", desc: "采用端到端加密体系，独家竞赛创意与调研数据严格封存，保障您的智慧结晶不受侵犯。", color: "#788c5d" }
            ].map((f, i) => (
              <div key={i} className="p-8 rounded-3xl bg-[#faf9f5] border border-[#e8e6dc] hover:shadow-xl hover:-translate-y-1 hover:border-[#b0aea5] transition-all duration-300 group">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-[#e8e6dc] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <f.icon className="w-7 h-7" style={{ color: f.color }} />
                </div>
                <h3 className="text-xl font-bold text-[#141413] mb-3" style={{ fontFamily: "'Poppins', Arial, sans-serif" }}>{f.title}</h3>
                <p className="text-[#141413]/70 leading-relaxed text-sm" style={{ fontFamily: "'Lora', Georgia, serif" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing - Dynamic Points */}
      <section id="pricing" className="py-24 bg-[#141413] text-[#faf9f5] relative z-10 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-full bg-[#6a9bcc]/10 blur-[120px] pointer-events-none"></div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-[#faf9f5] tracking-tight" style={{ fontFamily: "'Poppins', Arial, sans-serif" }}>
              算力积分：按需消耗，透明计费
            </h2>
            <p className="mt-6 text-lg text-[#b0aea5] max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: "'Lora', Georgia, serif" }}>
              每一次深度计算与高难度数据提取均精确度量。拒绝昂贵的年费订阅，让每一分预算都转化为实质的科研产出。
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Rules */}
            <div className="lg:col-span-2 bg-[#2a2a29]/40 p-10 rounded-[2rem] border border-[#b0aea5]/20 backdrop-blur-md">
              <h3 className="text-2xl font-bold text-white mb-8 flex items-center" style={{ fontFamily: "'Poppins', Arial, sans-serif" }}>
                <Coins className="w-6 h-6 mr-3 text-[#d97757]" /> 动态消耗明细
              </h3>
              
              <div className="space-y-6" style={{ fontFamily: "'Lora', Georgia, serif" }}>
                <div className="bg-[#141413] p-6 rounded-2xl border border-[#b0aea5]/10">
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Database className="w-5 h-5 mr-2 text-[#6a9bcc]" /> 数据提取与分析
                  </h4>
                  <ul className="space-y-4">
                    <li className="flex justify-between items-center border-b border-[#b0aea5]/10 pb-3">
                      <span className="text-[#e8e6dc]">微观企业/家庭指标提取 (最高精度)</span>
                      <span className="font-mono text-[#d97757] font-medium">50 积分/次</span>
                    </li>
                    <li className="flex justify-between items-center border-b border-[#b0aea5]/10 pb-3">
                      <span className="text-[#e8e6dc]">县级 / 市级 / 省级宏观数据</span>
                      <span className="font-mono text-[#6a9bcc] font-medium">30 / 20 / 10 积分</span>
                    </li>
                    <li className="flex justify-between items-center text-sm text-[#b0aea5] pt-1">
                      <span>* 输出文件大小附加费：每输出 1MB 额外收取 5 积分</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-[#141413] p-6 rounded-2xl border border-[#b0aea5]/10">
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <BookOpen className="w-5 h-5 mr-2 text-[#788c5d]" /> 文献与模型指导
                  </h4>
                  <ul className="space-y-4">
                    <li className="flex justify-between items-center border-b border-[#b0aea5]/10 pb-3">
                      <span className="text-[#e8e6dc]">单次深度专业文献检索</span>
                      <span className="font-mono text-[#788c5d] font-medium">20 积分/次</span>
                    </li>
                    <li className="flex justify-between items-center border-b border-[#b0aea5]/10 pb-3">
                      <span className="text-[#e8e6dc]">计量模型诊断与多重共线性检验</span>
                      <span className="font-mono text-[#6a9bcc] font-medium">动态计算 (1.0~2.0x)</span>
                    </li>
                    <li className="flex justify-between items-center pb-2">
                      <span className="text-[#e8e6dc]">核心赛事报告/论文结构诊断</span>
                      <span className="font-mono text-[#d97757] font-medium">50 积分/次</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Recharge */}
            <div className="bg-gradient-to-b from-[#2a2a29] to-[#141413] p-10 rounded-[2rem] border border-[#b0aea5]/20 shadow-2xl flex flex-col items-center text-center relative overflow-hidden">
              <h3 className="text-2xl font-bold text-white relative z-10" style={{ fontFamily: "'Poppins', Arial, sans-serif" }}>算力充值</h3>
              <p className="text-[#b0aea5] mt-3 text-sm relative z-10 mb-8" style={{ fontFamily: "'Lora', Georgia, serif" }}>
                请添加管理员微信（MoChen11-20），发送账单截图进行手动充值。
              </p>
              
              <div className="relative z-10 bg-white p-4 rounded-2xl shadow-xl mb-8 transform hover:scale-105 transition-transform duration-300">
                <img 
                  src="/wechat-qr.png" 
                  alt="Admin WeChat QR Code" 
                  className="w-40 h-40 object-cover rounded-xl"
                />
              </div>

              <div className="w-full space-y-4 relative z-10 mb-6" style={{ fontFamily: "'Poppins', Arial, sans-serif" }}>
                <div className="bg-white/5 hover:bg-white/10 transition-colors rounded-xl p-4 border border-white/10 flex justify-between items-center cursor-pointer">
                  <div className="text-left">
                    <div className="text-white font-semibold">冲刺包</div>
                    <div className="text-[#6a9bcc] text-sm">500 积分</div>
                  </div>
                  <div className="text-xl font-bold text-white">¥29</div>
                </div>
                
                <div className="bg-[#6a9bcc]/20 hover:bg-[#6a9bcc]/30 transition-colors rounded-xl p-4 border border-[#6a9bcc]/40 flex justify-between items-center relative cursor-pointer shadow-[0_0_15px_rgba(106,155,204,0.15)]">
                  <div className="absolute -top-3 -right-2 bg-[#d97757] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">热卖组合</div>
                  <div className="text-left">
                    <div className="text-white font-semibold">国奖包</div>
                    <div className="text-[#6a9bcc] text-sm">2000 积分</div>
                  </div>
                  <div className="text-xl font-bold text-white">¥99</div>
                </div>

                <div className="bg-white/5 hover:bg-white/10 transition-colors rounded-xl p-4 border border-white/10 flex justify-between items-center cursor-pointer">
                  <div className="text-left">
                    <div className="text-white font-semibold">实验室包</div>
                    <div className="text-[#6a9bcc] text-sm">10000 积分</div>
                  </div>
                  <div className="text-xl font-bold text-white">¥399</div>
                </div>
              </div>
              
              <p className="text-[#b0aea5]/60 mt-auto text-xs relative z-10 leading-relaxed" style={{ fontFamily: "'Lora', Georgia, serif" }}>
                支付时请备注您的注册邮箱，系统核对后即时到账。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#faf9f5] border-t border-[#e8e6dc] py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-[#b0aea5]" style={{ fontFamily: "'Poppins', Arial, sans-serif" }}>
          <p>© 2026 DeepResValue 深度研值. 赋能数据科学与严谨学术研究。</p>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} initialView={authView} />
    </div>
  );
}
