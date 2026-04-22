import { Link } from "react-router-dom";
import { MessageSquare, Settings, Database, BrainCircuit, Paperclip, Send, LogOut, Plus, BarChart2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useStore } from "@/store/useStore";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, ZAxis } from "recharts";
import { motion, AnimatePresence } from "framer-motion";

export default function Chat() {
  const { messages, addMessage } = useStore();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessageId = Date.now();
    addMessage({ id: newMessageId, role: 'user', content: input });
    setInput('');
    
    // Simulate AI thinking and response
    setTimeout(() => {
      addMessage({
        id: newMessageId + 1,
        role: 'assistant',
        content: '我已收到您的请求。正在调用 statspai 进行分析...\n\n分析完成。这里是 OLS 回归分析的结果摘要：\n\n- **R²**: 0.45\n- **p-value**: < 0.001\n\n右侧面板已为您生成交互式散点图和残差分布。',
        chartData: [
          { x: 10, y: 30, z: 200 },
          { x: 20, y: 50, z: 260 },
          { x: 30, y: 70, z: 400 },
          { x: 40, y: 90, z: 280 },
          { x: 50, y: 110, z: 500 },
          { x: 60, y: 130, z: 200 },
        ]
      });
    }, 1500);
  };

  // 找最后一个有图表数据的消息
  const latestChartData = [...messages].reverse().find(m => m.chartData)?.chartData;

  return (
    <div className="flex h-screen bg-white text-slate-900 font-sans">
      {/* Sidebar */}
      <div className="w-64 border-r border-slate-200 bg-slate-50 flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-200 flex items-center space-x-2 bg-white">
          <BrainCircuit className="w-6 h-6 text-blue-600" />
          <span className="font-bold text-lg tracking-tight">StatsAI</span>
        </div>
        <div className="p-4">
          <button className="w-full flex items-center justify-center space-x-2 bg-white border border-slate-200 text-slate-700 py-2.5 px-4 rounded-lg hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm">
            <Plus className="w-4 h-4" />
            <span className="font-medium text-sm">新建对话</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">历史对话</div>
          {['社会调查回归分析', '期末面板数据处理', '描述性统计探索'].map((t, i) => (
            <button key={i} className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${i === 0 ? 'bg-blue-100 text-blue-800 font-medium' : 'text-slate-600 hover:bg-slate-100'}`}>
              <MessageSquare className="w-4 h-4" />
              <span className="truncate">{t}</span>
            </button>
          ))}
        </div>
        <div className="p-4 border-t border-slate-200 space-y-1">
          <Link to="/datasets" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-100 transition-colors">
            <Database className="w-4 h-4 text-slate-400" />
            <span>数据集管理</span>
          </Link>
          <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-100 transition-colors">
            <Settings className="w-4 h-4 text-slate-400" />
            <span>个人设置</span>
          </button>
          <Link to="/" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-100 transition-colors">
            <LogOut className="w-4 h-4 text-slate-400" />
            <span>返回首页</span>
          </Link>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative min-w-0">
        {/* Header */}
        <div className="h-14 border-b border-slate-200 flex items-center justify-between px-6 bg-white shrink-0">
          <div className="font-medium text-slate-800 flex items-center space-x-2">
            <span>社会调查回归分析</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-xs text-slate-500 font-medium">1.4MB 数据集</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-slate-500">
            <span className="flex w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Deerflow 智能体运行中</span>
          </div>
        </div>
        
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 scroll-smooth">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={msg.id} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] lg:max-w-2xl rounded-2xl px-5 py-4 shadow-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm'}`}>
                  {msg.role === 'assistant' && (
                    <div className="flex items-center space-x-2 mb-3 text-blue-600 border-b border-slate-100 pb-2">
                      <BrainCircuit className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-wider">Statspai 分析智能体</span>
                    </div>
                  )}
                  <div className={`prose prose-sm max-w-none ${msg.role === 'user' ? 'prose-invert text-white/90' : 'text-slate-700'}`}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-200 shrink-0">
          <div className="max-w-4xl mx-auto relative flex items-end bg-white border border-slate-300 rounded-xl shadow-sm focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400 transition-all">
            <button className="p-3 text-slate-400 hover:text-blue-600 transition-colors rounded-bl-xl group" title="上传附件">
              <Paperclip className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
            <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="描述您的科研分析需求，或输入 / 唤出快捷指令..."
              className="w-full max-h-32 min-h-[52px] py-3.5 px-2 resize-none outline-none bg-transparent text-slate-700 placeholder-slate-400"
              rows={1}
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim()}
              className="p-3 text-blue-600 hover:text-blue-700 disabled:text-slate-300 transition-colors rounded-br-xl"
            >
              <Send className={`w-5 h-5 ${input.trim() ? 'hover:translate-x-1 hover:-translate-y-1 transition-transform' : ''}`} />
            </button>
          </div>
          <div className="text-center mt-3 text-xs text-slate-400">
            基于大模型的分析结果仅供参考，请核对重要的学术数据。
          </div>
        </div>
      </div>

      {/* Right Panel: Results & Visualization */}
      <div className="w-96 lg:w-[400px] border-l border-slate-200 bg-white flex flex-col hidden lg:flex shrink-0">
        <div className="h-14 border-b border-slate-200 flex items-center justify-between px-6 bg-slate-50/50 shrink-0">
          <span className="font-semibold text-slate-800 text-sm">图表可视化</span>
          <div className="flex space-x-1">
            <button className="p-1.5 text-slate-400 hover:bg-slate-200 rounded transition-colors"><BarChart2 className="w-4 h-4" /></button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30">
          {latestChartData ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm"
            >
              <h3 className="font-medium text-slate-800 mb-4 text-sm">线性回归模型 - 散点分布</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis type="number" dataKey="x" name="自变量" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                    <YAxis type="number" dataKey="y" name="因变量" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                    <ZAxis type="number" dataKey="z" range={[60, 400]} name="权重" />
                    <RechartsTooltip cursor={{strokeDasharray: '3 3'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                    <Scatter name="数据点" data={latestChartData} fill="#2563eb" fillOpacity={0.6} />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-xs text-slate-500 leading-relaxed">
                  通过 Statspai 分析，模型呈现出显著的正相关关系（R² = 0.45）。数据点较好地拟合了线性假设，无明显异方差性。
                </p>
                <button className="mt-3 w-full py-2 text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 font-medium rounded-md transition-colors">
                  导出高清图表
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <BarChart2 className="w-12 h-12 mb-4 text-slate-200" />
              <p className="text-sm text-center">暂无图表数据<br/>分析完成后将在此处展示可视化结果</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
