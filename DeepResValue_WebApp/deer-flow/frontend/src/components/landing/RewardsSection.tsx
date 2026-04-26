import React from 'react';
import { motion } from 'framer-motion';
import { Gift, Users, Share2, DollarSign, Award, ArrowRight } from 'lucide-react';

export const RewardsSection: React.FC = () => {
  return (
    <section className="py-24 bg-[#faf9f5] text-[#141413]">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Referral Rewards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-4xl font-bold font-['Poppins'] mb-4 flex items-center justify-center gap-3">
              <Gift className="text-[#d97757]" size={36} /> 邀请好友，双向得积分
            </h2>
            <p className="text-xl font-['Lora'] text-gray-600">
              分享专属邀请码，和好友一起享受Vibe Coding的便利
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 relative overflow-hidden">
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#d97757] rounded-full mix-blend-screen filter blur-[100px] opacity-20"></div>
              
              <div className="flex flex-col items-center space-y-8">
                <div className="px-6 py-3 bg-[#141413] text-white rounded-full font-['Poppins'] font-bold text-lg flex items-center gap-2 shadow-lg">
                  <Share2 size={20} className="text-[#d97757]" /> 你的专属邀请码
                </div>
                
                <div className="flex items-center justify-between w-full max-w-sm">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-16 h-16 bg-[#d97757]/10 rounded-2xl flex items-center justify-center text-[#d97757]">
                      👤
                    </div>
                    <span className="font-['Poppins'] font-semibold">你获得</span>
                    <span className="text-2xl font-bold text-[#d97757]">100积分</span>
                  </div>
                  
                  <div className="flex-1 flex justify-center text-gray-300">
                    <ArrowRight size={32} />
                  </div>
                  
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-16 h-16 bg-[#6a9bcc]/10 rounded-2xl flex items-center justify-center text-[#6a9bcc]">
                      👥
                    </div>
                    <span className="font-['Poppins'] font-semibold">好友获得</span>
                    <span className="text-2xl font-bold text-[#6a9bcc]">50积分</span>
                  </div>
                </div>
                
                <div className="w-full bg-gray-50 p-5 rounded-xl border border-dashed border-gray-300">
                  <p className="text-sm font-['Lora'] text-gray-600 italic">
                    "发现一个神器！不用学代码就能做数据分析，用自然语言说需求，AI自动出结果。注册输入我的邀请码【XXXX】，咱俩都有积分！"
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-['Poppins'] font-bold mb-6">积分商城兑换</h3>
              <div className="grid grid-cols-1 gap-4 font-['Lora']">
                {[
                  { pts: 500, item: "7天VIP会员" },
                  { pts: 1000, item: "¥50现金红包" },
                  { pts: 2000, item: "《实证分析避坑指南》电子书" },
                  { pts: 5000, item: "一对一导师咨询1次" }
                ].map((reward, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-[#d97757] transition-colors">
                    <span className="font-bold text-[#d97757] w-24">{reward.pts} 积分</span>
                    <span className="text-gray-700 font-medium flex-1 text-right md:text-left">{reward.item}</span>
                    <button className="hidden md:block px-4 py-2 bg-gray-100 hover:bg-[#d97757] hover:text-white rounded-lg text-sm font-['Poppins'] font-semibold transition-colors">
                      兑换
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </motion.div>

        {/* Campus Ambassador */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-[#141413] rounded-3xl p-8 md:p-12 text-[#faf9f5] relative overflow-hidden shadow-2xl"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#788c5d] rounded-full mix-blend-screen filter blur-[120px] opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#6a9bcc] rounded-full mix-blend-screen filter blur-[100px] opacity-20"></div>

          <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
            
            <div className="md:w-1/2 space-y-6 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#788c5d]/20 text-[#788c5d] rounded-full font-['Poppins'] font-semibold text-sm mb-2">
                <Users size={16} /> 校园研究大使招募
              </div>
              <h3 className="text-3xl md:text-4xl font-['Poppins'] font-bold leading-tight">
                成为 Vibe Coding 新范式的布道者
              </h3>
              <p className="text-lg font-['Lora'] text-gray-400">
                加入DeepResValue校园大使计划，不仅获得丰厚收益，更能提升研究能力，拓展学术人脉。
              </p>
              
              <div className="pt-6">
                <div className="inline-block p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <p className="text-gray-300 font-['Lora'] mb-2">申请方式：</p>
                  <p className="text-xl font-['Poppins'] font-bold text-white flex items-center gap-2 justify-center md:justify-start">
                    <span className="text-[#788c5d]">微信添加：</span> MoChen11-20
                  </p>
                  <p className="text-sm text-gray-500 mt-2">备注"校园大使+学校+姓名"</p>
                </div>
              </div>
            </div>

            <div className="md:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#1a1a19] p-5 rounded-2xl border border-gray-800 hover:border-[#d97757]/50 transition-colors">
                <DollarSign className="text-[#d97757] mb-3" size={28} />
                <h4 className="font-['Poppins'] font-bold mb-2">收益</h4>
                <ul className="text-sm font-['Lora'] text-gray-400 space-y-2">
                  <li>• 推广佣金10-30%</li>
                  <li>• 专属邀请码，永久返利</li>
                </ul>
              </div>
              
              <div className="bg-[#1a1a19] p-5 rounded-2xl border border-gray-800 hover:border-[#6a9bcc]/50 transition-colors">
                <Award className="text-[#6a9bcc] mb-3" size={28} />
                <h4 className="font-['Poppins'] font-bold mb-2">成长</h4>
                <ul className="text-sm font-['Lora'] text-gray-400 space-y-2">
                  <li>• 免费使用全部功能</li>
                  <li>• 竞赛指导优先名额</li>
                  <li>• 优秀者参与产品建设</li>
                  <li>• 线上培训：方法论</li>
                </ul>
              </div>

              <div className="bg-[#1a1a19] p-5 rounded-2xl border border-gray-800 hover:border-[#788c5d]/50 transition-colors sm:col-span-2">
                <Trophy className="text-[#788c5d] mb-3" size={28} />
                <h4 className="font-['Poppins'] font-bold mb-2">荣誉</h4>
                <ul className="text-sm font-['Lora'] text-gray-400 space-y-2 flex flex-col sm:flex-row sm:gap-6">
                  <li>• 校园大使证书</li>
                  <li>• 官方实习证明</li>
                  <li>• 年度优秀大使评选</li>
                </ul>
              </div>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
};

function Trophy(props: any) {
  return <Award {...props} />;
}
