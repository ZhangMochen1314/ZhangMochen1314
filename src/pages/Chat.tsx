import { Link } from "react-router-dom";
import { MessageSquare, Settings, Database, BrainCircuit, Paperclip, Send, LogOut, Plus, Globe, FileType, X, Loader2, BookOpen, FileText, Filter, Trophy, LineChart, PieChart, Map } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useStore } from "@/store/useStore";
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
      const res = await fetch('/api/threads', {
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
          } else if (line.startsWith("data: ") && (currentEvent === "messages/partial" || currentEvent === 'messages')) {
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
    <div className="flex h-full bg-white text-slate-900 font-sans">
      {/* Sidebar */}
      <div className="w-64 border-r border-slate-200 bg-slate-50 flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-200 flex items-center space-x-2 bg-white">
          <BrainCircuit className="w-6 h-6 text-blue-600" />
          <span className="font-bold text-lg tracking-tight">DeepResValue</span>
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
              title="开启后将消耗积分联网检索最新中英文文献"
            >
              <Globe className={`w-3.5 h-3.5 ${useNetwork ? 'text-blue-500' : 'text-slate-400'}`} />
              <span>{useNetwork ? '文献检索已开启' : '文献检索'}</span>
            </button>
          </div>
          <div className="flex items-center space-x-2 text-sm text-slate-500">
            <span className="flex w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Deerflow 智能体运行中</span>
          </div>
        </div>
        
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 scroll-smooth pb-32">
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
                  <div className={`prose prose-sm max-w-none ${msg.role === 'user' ? 'prose-invert text-white/90' : 'prose-academic'}`}>
                    {msg.reasoning && (
                      <div className="mb-4 p-4 bg-slate-50 rounded-lg text-slate-500 border border-slate-100 text-xs leading-relaxed italic font-sans shadow-inner">
                        <div className="font-semibold text-slate-600 not-italic mb-1 flex items-center space-x-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                          <span>思考过程</span>
                        </div>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.reasoning}</ReactMarkdown>
                      </div>
                    )}
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      components={{
                        img: ({node, ...props}) => (
                          <figure className="my-6">
                            <img {...props} className="mx-auto rounded-lg shadow-md max-h-[500px] object-contain border border-slate-200" />
                            {props.alt && <figcaption className="text-center text-sm text-slate-500 mt-2 font-sans italic">{props.alt}</figcaption>}
                          </figure>
                        )
                      }}
                    >
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
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent pb-6 shrink-0 z-20">
          <div className="max-w-4xl mx-auto relative">
            {selectedFiles.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center space-x-2 bg-white shadow-sm px-3 py-1.5 rounded-lg border border-slate-200">
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
            
            <div className={`flex items-end bg-white border rounded-2xl shadow-lg transition-all ${
              input.trim() || selectedFiles.length > 0 
                ? 'border-blue-400 ring-4 ring-blue-100/50 shadow-blue-900/5' 
                : 'border-slate-200 focus-within:ring-4 focus-within:ring-blue-100/50 focus-within:border-blue-400 shadow-slate-200/50'
            }`}>
              <input 
                type="file" 
                multiple 
                ref={fileInputRef}
                className="hidden" 
                onChange={handleFileChange}
                accept=".dta,.sav,.py,.do,.r,.zip,.csv,.xlsx,.xls,.pdf,.doc,.docx"
              />
              <div className="relative group">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-4 text-slate-400 hover:text-blue-600 transition-colors rounded-bl-2xl" 
                  title="上传附件"
                >
                  <Paperclip className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>
                <div className="absolute bottom-full left-0 mb-2 w-64 bg-slate-800 text-white text-xs rounded-lg py-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl z-50">
                  支持上传 .dta, .sav, .csv, .xlsx, .pdf, .docx 等格式。基于大模型的分析结果仅供参考，请核对重要学术数据。
                  <div className="absolute top-full left-4 -mt-1 w-2 h-2 bg-slate-800 transform rotate-45"></div>
                </div>
              </div>
              
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
                className="w-full max-h-32 min-h-[56px] py-4 px-2 resize-none outline-none bg-transparent text-slate-700 placeholder-slate-400 font-medium"
                rows={1}
              />
              <button 
                onClick={handleSend}
                disabled={(!input.trim() && selectedFiles.length === 0) || isLoading || isUploading}
                className="p-4 text-blue-600 hover:text-blue-700 disabled:text-slate-300 transition-colors rounded-br-2xl"
              >
                {isUploading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className={`w-5 h-5 ${(input.trim() || selectedFiles.length > 0) && !isLoading ? 'hover:translate-x-1 hover:-translate-y-1 transition-transform' : ''}`} />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel: Research Toolbox */}
      <div className="w-80 lg:w-[320px] border-l border-slate-200 bg-slate-50/50 flex flex-col hidden lg:flex shrink-0">
        <div className="h-14 border-b border-slate-200 flex items-center justify-between px-6 bg-white shrink-0 shadow-sm z-10">
          <span className="font-bold text-slate-800 text-[15px] tracking-tight">核心科研模块</span>
          <div className="flex space-x-1">
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-[10px] font-bold uppercase tracking-wider">工具箱</span>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-5">
          <div className="grid grid-cols-1 gap-3">
            {[
              { id: 'lit-search', icon: BookOpen, title: '文献检索', desc: '中英文核心期刊自动搜集与总结', color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100', hover: 'hover:border-indigo-300 hover:shadow-md' },
              { id: 'lit-review', icon: FileText, title: '文献综述', desc: '一键生成结构化学术综述报告', color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-100', hover: 'hover:border-violet-300 hover:shadow-md' },
              { id: 'data-collect', icon: Database, title: '数据搜集', desc: '内置宏微观科研面板数据直取', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', hover: 'hover:border-blue-300 hover:shadow-md' },
              { id: 'data-clean', icon: Filter, title: '数据清洗', desc: '缺失值/异常值/缩尾自动化处理', color: 'text-cyan-600', bg: 'bg-cyan-50', border: 'border-cyan-100', hover: 'hover:border-cyan-300 hover:shadow-md' },
              { id: 'modeling', icon: Trophy, title: '2026建模大赛指导', desc: '国赛/美赛实战模型及写作辅导', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', hover: 'hover:border-amber-300 hover:shadow-md' },
              { id: 'did-analysis', icon: LineChart, title: 'DID分析', desc: '双重差分、平行趋势检验与PSM', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', hover: 'hover:border-emerald-300 hover:shadow-md' },
              { id: 'sci-plot', icon: PieChart, title: '科研绘图', desc: '一键生成论文级高清统计图表', color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100', hover: 'hover:border-rose-300 hover:shadow-md' },
              { id: 'spatial', icon: Map, title: '空间计量', desc: '空间权重矩阵与SDM模型计算', color: 'text-fuchsia-600', bg: 'bg-fuchsia-50', border: 'border-fuchsia-100', hover: 'hover:border-fuchsia-300 hover:shadow-md' },
            ].map((tool) => (
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                key={tool.id}
                onClick={() => {
                  const command = `启动【${tool.title}】技能：请引导我进行相关操作。`;
                  setInput(command);
                  // Focus input visually could be added here
                }}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 bg-white ${tool.border} ${tool.hover} flex items-start space-x-4 group`}
              >
                <div className={`p-2.5 rounded-lg ${tool.bg} ${tool.color} group-hover:scale-110 transition-transform`}>
                  <tool.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <h4 className="font-bold text-slate-800 text-sm mb-1">{tool.title}</h4>
                  <p className="text-xs text-slate-500 leading-snug">{tool.desc}</p>
                </div>
              </motion.button>
            ))}
          </div>

          <div className="mt-8 p-4 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <BrainCircuit className="w-6 h-6 text-blue-400 mb-3" />
            <h4 className="font-bold text-sm mb-1">DeepResValue 智能引擎</h4>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              点击上方核心模块卡片，智能体将自动挂载对应技能和工具包，为您提供端到端的科研支持。
            </p>
            <div className="flex items-center space-x-2 text-xs font-medium text-blue-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>引擎状态：在线</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
