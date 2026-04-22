import { Link } from "react-router-dom";
import { MessageSquare, Settings, Database, BrainCircuit, Paperclip, Send, LogOut, Plus, BarChart2, Globe, FileType, X, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useStore } from "@/store/useStore";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, ZAxis } from "recharts";
import { motion, AnimatePresence } from "framer-motion";

export default function Chat() {
  const { messages, addMessage, updateLastMessage, upsertMessage, threadId, setThreadId } = useStore();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState('导师模式');
  const [useNetwork, setUseNetwork] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Create thread if not exists
  const ensureThread = async () => {
    if (threadId) return threadId;
    try {
      const res = await fetch('/api/langgraph/threads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setThreadId(data.thread_id);
      return data.thread_id;
    } catch (e) {
      console.error("Failed to create thread", e);
      return null;
    }
  };

  const sendToDeerflow = async (userText: string, providedTid?: string) => {
    setIsLoading(true);

    const tid = providedTid || await ensureThread();
    if (!tid) {
      upsertMessage({
        id: Date.now().toString(),
        role: 'assistant',
        content: "\n\n**[Error]**: Failed to create thread. Please check if the agent server is running."
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/threads/${tid}/runs/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assistant_id: "lead_agent",
          input: {
            messages: [{ role: 'user', content: userText }]
          },
          config: {
            recursion_limit: 100,
            configurable: {
              model_name: "deepseek-reasoner",
              thinking_enabled: true
            }
          },
          stream_mode: ["messages"]
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      let buffer = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || ""; // keep the incomplete line in buffer

        let currentEvent = "";

        for (const line of lines) {
          if (line.startsWith("event: ")) {
            currentEvent = line.substring(7).trim();
          } else if (line.startsWith("data: ") && currentEvent === "messages/partial") {
            try {
              const data = JSON.parse(line.substring(6));
              if (Array.isArray(data) && data.length > 0) {
                const msgData = data[0];
                if (msgData.type === 'AIMessageChunk') {
                  const contentChunk = msgData.content || (msgData.kwargs && msgData.kwargs.content) || "";
                  const reasoningChunk = msgData.additional_kwargs?.reasoning_content || "";
                  
                  // Use zustand store method to handle accumulating chunks for this specific message ID
                  if (contentChunk || reasoningChunk) {
                    upsertMessage({
                      id: msgData.id,
                      role: 'assistant',
                      content: contentChunk,
                      reasoning: reasoningChunk
                    });
                  }
                }
              }
            } catch (e) {
              // ignore parse errors for incomplete chunks
            }
          }
        }
      }
    } catch (err) {
      console.error(err);
      upsertMessage({
        id: Date.now().toString(),
        role: 'assistant',
        content: "\n\n**[Error]**: Failed to connect to DeerFlow agent."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSend = async () => {
    if ((!input.trim() && selectedFiles.length === 0) || isLoading || isUploading) return;
    
    setIsUploading(true);
    const tid = await ensureThread();
    if (!tid) {
      upsertMessage({
        id: Date.now().toString(),
        role: 'assistant',
        content: "\n\n**[Error]**: Failed to create thread. Please check if the agent server is running."
      });
      setIsUploading(false);
      return;
    }

    // Upload files if any
    let uploadStatusText = "";
    if (selectedFiles.length > 0) {
      const formData = new FormData();
      selectedFiles.forEach(file => {
        formData.append('files', file);
      });

      try {
        const uploadRes = await fetch(`/api/threads/${tid}/uploads`, {
          method: 'POST',
          body: formData,
        });
        
        if (!uploadRes.ok) {
          throw new Error(`Upload failed: ${uploadRes.status}`);
        }
        
        uploadStatusText = `\n\n*(已上传 ${selectedFiles.length} 个文件)*`;
        setSelectedFiles([]);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (err) {
        console.error("Upload error:", err);
        upsertMessage({
          id: Date.now().toString(),
          role: 'assistant',
          content: "\n\n**[Error]**: Failed to upload files."
        });
        setIsUploading(false);
        return;
      }
    }

    setIsUploading(false);

    const newMessageId = Date.now().toString();
    const displayUserText = input + uploadStatusText;
    
    // Add mode and network search prefixes for backend processing
    let systemPrefix = `[${mode}] `;
    if (useNetwork) {
      systemPrefix += `[启用联网搜索] `;
    }
    
    // Store message in UI (without system prefixes)
    addMessage({ id: newMessageId, role: 'user', content: displayUserText || "分析已上传的数据" });
    
    const backendPayloadText = systemPrefix + (input || "请分析我刚刚上传的数据集");
    setInput('');
    
    sendToDeerflow(backendPayloadText, tid);
  };

  const handleOptionClick = async (option: { label: string; value: string }) => {
    if (isLoading) return;
    const userMsgId = Date.now().toString();
    const userText = `请执行：${option.label}`;
    addMessage({ id: userMsgId, role: 'user', content: userText });
    
    // Ensure we have a thread before sending
    const tid = await ensureThread();
    if (tid) {
      sendToDeerflow(userText, tid);
    }
  };

  // 找最后一个有图表数据的消息
  const latestChartData = [...messages].reverse().find(m => m.chartData)?.chartData;

  return (
    <div className="flex h-screen bg-white text-slate-900 font-sans">
      {/* Sidebar */}
      <div className="w-64 border-r border-slate-200 bg-slate-50 flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-200 flex items-center space-x-2 bg-white">
          <BrainCircuit className="w-6 h-6 text-blue-600" />
          <span className="font-bold text-lg tracking-tight">DeepResValue 深度研值</span>
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
          <div className="font-medium text-slate-800 flex items-center space-x-4">
            <span>当前对话</span>
            <div className="flex bg-slate-100 p-1 rounded-lg">
              {['导师模式', '学术模式', '专业助手'].map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    mode === m 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
            <button
              onClick={() => setUseNetwork(!useNetwork)}
              className={`flex items-center space-x-1 px-3 py-1 text-xs font-medium rounded-md transition-colors border ${
                useNetwork 
                  ? 'bg-blue-50 text-blue-600 border-blue-200' 
                  : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Globe className={`w-3.5 h-3.5 ${useNetwork ? 'text-blue-500' : 'text-slate-400'}`} />
              <span>{useNetwork ? '联网已开启' : '联网搜索'}</span>
            </button>
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
                    {msg.reasoning && (
                      <div className="mb-4 p-3 bg-slate-100/50 rounded-lg text-slate-500 border border-slate-100 text-xs leading-relaxed italic">
                        <div className="font-semibold text-slate-600 not-italic mb-1 flex items-center space-x-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                          <span>思考过程</span>
                        </div>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.reasoning}</ReactMarkdown>
                      </div>
                    )}
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.content || (!msg.content && msg.reasoning ? "*模型正在思考中...*" : "")}
                    </ReactMarkdown>
                  </div>
                  {msg.options && msg.options.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-3">
                      {msg.options.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => handleOptionClick(opt)}
                          className="flex items-center px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white border border-blue-100 rounded-lg text-sm font-medium transition-colors shadow-sm"
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
            {isLoading && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="max-w-[85%] lg:max-w-2xl rounded-2xl px-5 py-4 shadow-sm bg-white border border-slate-200 text-slate-800 rounded-tl-sm">
                  <div className="flex items-center space-x-2 mb-3 text-blue-600 border-b border-slate-100 pb-2">
                    <BrainCircuit className="w-4 h-4 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider">Statspai 分析智能体思考中...</span>
                  </div>
                  <div className="flex space-x-2 items-center h-6">
                    <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                    <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-200 shrink-0">
          <div className="max-w-4xl mx-auto relative">
            {selectedFiles.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center space-x-2 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                    <FileType className="w-4 h-4 text-slate-500" />
                    <span className="text-xs text-slate-700 truncate max-w-[150px]">{file.name}</span>
                    <button 
                      onClick={() => handleRemoveFile(index)}
                      className="text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <div className={`flex items-end bg-white border rounded-xl shadow-sm transition-all ${
              input.trim() || selectedFiles.length > 0 
                ? 'border-blue-400 ring-2 ring-blue-100' 
                : 'border-slate-300 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400'
            }`}>
              <input 
                type="file" 
                multiple 
                ref={fileInputRef}
                className="hidden" 
                onChange={handleFileChange}
                accept=".dta,.sav,.py,.do,.r,.zip,.csv,.xlsx,.xls,.pdf,.doc,.docx"
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-3 text-slate-400 hover:text-blue-600 transition-colors rounded-bl-xl group" 
                title="上传附件"
              >
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
                disabled={(!input.trim() && selectedFiles.length === 0) || isLoading || isUploading}
                className="p-3 text-blue-600 hover:text-blue-700 disabled:text-slate-300 transition-colors rounded-br-xl"
              >
                {isUploading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className={`w-5 h-5 ${(input.trim() || selectedFiles.length > 0) && !isLoading ? 'hover:translate-x-1 hover:-translate-y-1 transition-transform' : ''}`} />
                )}
              </button>
            </div>
          </div>
          <div className="text-center mt-3 text-xs text-slate-400">
            支持上传 .dta, .sav, .csv, .xlsx 等格式。基于大模型的分析结果仅供参考，请核对重要的学术数据。
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
