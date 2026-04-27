import { Link, useLocation, useNavigate } from "react-router-dom";
import { MessageSquare, Settings, Database, BrainCircuit, Paperclip, Send, LogOut, Plus, Globe, FileType, X, Loader2, BookOpen, FileText, Filter, Trophy, LineChart, PieChart, Map, ChevronLeft, ChevronRight, Palette, FolderOpen, Image as ImageIcon, Code, File as FileIcon, Download, AlertCircle, Zap, Target, Lightbulb, Sparkles, Rocket, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { useStore, POINTS_RATES } from "@/store/useStore";
import { useAuthStore } from "@/store/useAuthStore";
import { motion, AnimatePresence } from "framer-motion";

type Theme = 'light' | 'dark' | 'eye-care';
type FileCategory = 'all' | 'doc' | 'image' | 'data' | 'code';

interface WorkspaceFile {
  id: string;
  name: string;
  category: FileCategory;
  timestamp: number;
}

interface CustomSkill {
  name: string;
  description: string;
  category: string;
}

const CORE_SKILLS = [
  { id: 'empirical-selector', icon: Target, title: '核心变量筛选', desc: '基于语义与统计显著性的双重特征选择', color: 'text-[var(--theme-accent1)]', bg: 'bg-[var(--theme-accent1)]/10', border: 'border-[var(--theme-accent1)]/20', hover: 'hover:border-[var(--theme-accent1)]' },
  { id: 'lit-search', icon: BookOpen, title: '文献检索', desc: '中英文核心期刊自动搜集与总结', color: 'text-[var(--theme-accent2)]', bg: 'bg-[var(--theme-accent2)]/10', border: 'border-[var(--theme-accent2)]/20', hover: 'hover:border-[var(--theme-accent2)]' },
  { id: 'lit-review', icon: FileText, title: '文献综述', desc: '一键生成结构化学术综述报告', color: 'text-[var(--theme-accent3)]', bg: 'bg-[var(--theme-accent3)]/10', border: 'border-[var(--theme-accent3)]/20', hover: 'hover:border-[var(--theme-accent3)]' },
  { id: 'data-collect', icon: Database, title: '数据搜集', desc: '内置宏微观科研面板数据直取', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/30', border: 'border-blue-100 dark:border-blue-800', hover: 'hover:border-blue-300 dark:hover:border-blue-500' },
  { id: 'data-clean', icon: Filter, title: '数据清洗', desc: '缺失值/异常值/缩尾自动化处理', color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-50 dark:bg-cyan-900/30', border: 'border-cyan-100 dark:border-cyan-800', hover: 'hover:border-cyan-300 dark:hover:border-cyan-500' },
  { id: 'modeling', icon: Trophy, title: '2026建模大赛指导', desc: '国赛/美赛实战模型及写作辅导', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/30', border: 'border-amber-100 dark:border-amber-800', hover: 'hover:border-amber-300 dark:hover:border-amber-500' },
  { id: 'did-analysis', icon: LineChart, title: 'DID分析', desc: '双重差分、平行趋势检验与PSM', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/30', border: 'border-emerald-100 dark:border-emerald-800', hover: 'hover:border-emerald-300 dark:hover:border-emerald-500' },
  { id: 'sci-plot', icon: PieChart, title: '科研绘图', desc: '一键生成论文级高清统计图表', color: 'text-[var(--theme-accent1)]', bg: 'bg-[var(--theme-accent1)]/10', border: 'border-[var(--theme-accent1)]/20', hover: 'hover:border-[var(--theme-accent1)]' },
  { id: 'spatial', icon: Map, title: '空间计量', desc: '空间权重矩阵与SDM模型计算', color: 'text-fuchsia-600 dark:text-fuchsia-400', bg: 'bg-fuchsia-50 dark:bg-fuchsia-900/30', border: 'border-fuchsia-100 dark:border-fuchsia-800', hover: 'hover:border-fuchsia-300 dark:hover:border-fuchsia-500' },
];

export default function Chat() {
  const { messages, addMessage, upsertMessage, threadId, setThreadId } = useStore();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatMode, setChatMode] = useState<'flash' | 'thinking' | 'pro' | 'ultra'>('pro');
  const [modelName, setModelName] = useState('deepseek-reasoner');
  const [reasoningEffort, setReasoningEffort] = useState<'low' | 'medium' | 'high'>('medium');
  const [useNetwork, setUseNetwork] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<typeof CORE_SKILLS[0][]>([]);
  const [customSkills, setCustomSkills] = useState<CustomSkill[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // UI State
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
  const [theme, setTheme] = useState<Theme>('light');
  const [isFilesDrawerOpen, setIsFilesDrawerOpen] = useState(false);
  const [activeFileCategory, setActiveFileCategory] = useState<FileCategory>('all');
  const [historyThreads, setHistoryThreads] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [workspaceFiles] = useState<WorkspaceFile[]>([
    { id: '1', name: '数据集_2024.csv', category: 'data', timestamp: Date.now() - 3600000 },
    { id: '2', name: '文献综述草稿.docx', category: 'doc', timestamp: Date.now() - 7200000 },
    { id: '3', name: '回归散点图.png', category: 'image', timestamp: Date.now() - 10800000 },
    { id: '4', name: '清洗脚本.py', category: 'code', timestamp: Date.now() - 14400000 },
  ]);

  const [interceptAction, setInterceptAction] = useState<{ cost: number, onConfirm: () => void } | null>(null);

  const token = useAuthStore((state) => state.token);
  const getAuthHeaders = () => {
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const instruction = params.get('instruction');
    if (instruction) {
      setInput(instruction);
      // Clean up URL without triggering a refresh
      navigate('/chat', { replace: true });
    }
  }, [location, navigate]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch History
  useEffect(() => {
    const fetchHistory = async () => {
      if (!token) return;
      setIsLoadingHistory(true);
      try {
        // Backend implementation uses POST /api/threads/search for listing threads
        const res = await fetch('/api/threads/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
          },
          body: JSON.stringify({ limit: 50, offset: 0 })
        });
        if (res.ok) {
          const data = await res.json();
          // Sort by updated_at descending
          data.sort((a: any, b: any) => {
            const timeA = new Date(a.updated_at || a.created_at || 0).getTime();
            const timeB = new Date(b.updated_at || b.created_at || 0).getTime();
            return timeB - timeA;
          });
          setHistoryThreads(data || []);
        }
      } catch (err) {
        console.error("Failed to fetch history threads", err);
      } finally {
        setIsLoadingHistory(false);
      }
    };
    fetchHistory();
  }, [token]);

  // Fetch Custom Skills from backend
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await fetch('/api/skills/custom', {
          headers: { ...(token ? { 'Authorization': `Bearer ${token}` } : {}) }
        });
        if (res.ok) {
          const data = await res.json();
          setCustomSkills(data.skills || []);
        }
      } catch (err) {
        console.error("Failed to fetch custom skills", err);
      }
    };
    fetchSkills();
  }, [token]);

  // Create thread if not exists
  const ensureThread = async () => {
    if (threadId) return threadId;
    try {
      const res = await fetch('/api/threads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
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
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({
          assistant_id: "lead_agent",
          input: {
            messages: [{ role: 'user', content: userText }]
          },
          config: {
            recursion_limit: chatMode === 'ultra' ? 200 : 100,
            configurable: {
              model_name: modelName,
              thinking_enabled: chatMode === 'thinking' || chatMode === 'ultra',
              reasoning_effort: reasoningEffort
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
            } catch {
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
        content: "\n\n**[Error]**: Failed to connect to DeepResValue agent."
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

  const handleSend = () => {
    if ((!input.trim() && selectedFiles.length === 0 && selectedSkills.length === 0) || isLoading || isUploading) return;

    let cost = 0;
    if (useNetwork) cost += POINTS_RATES.LIT_SEARCH_RATE; // 文献检索/联网 消耗积分
    if (input.includes('提取') && (input.includes('数据') || input.includes('指标'))) {
      // 简单根据关键词拦截，如果提取微观企业指标
      if (input.includes('企业')) cost += POINTS_RATES.DATA_LEVEL.MICRO;
      else if (input.includes('县')) cost += POINTS_RATES.DATA_LEVEL.COUNTY;
      else if (input.includes('市')) cost += POINTS_RATES.DATA_LEVEL.CITY;
      else cost += POINTS_RATES.DATA_LEVEL.PROVINCIAL; // 默认省级宏观
    }

    if (cost > 0) {
      setInterceptAction({ cost, onConfirm: executeSend });
    } else {
      executeSend();
    }
  };

  const executeSend = async () => {
    setInterceptAction(null);
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
      try {
        const formData = new FormData();
        for (let i = 0; i < selectedFiles.length; i++) {
          formData.append('files', selectedFiles[i]);
        }

        const uploadRes = await fetch(`/api/threads/${tid}/uploads`, {
          method: 'POST',
          headers: {
            ...getAuthHeaders()
          },
          body: formData
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

    let skillsPrefix = "";
    if (selectedSkills.length > 0) {
      skillsPrefix = selectedSkills.map(s => `@${s.title}`).join(' ') + ' ';
    }

    const newMessageId = Date.now().toString();
    const displayUserText = skillsPrefix + input + uploadStatusText;
    
    // Add mode and network search prefixes for backend processing
    const modeNameMap = {
      flash: '闪电模式',
      thinking: '推理模式',
      pro: '专业模式',
      ultra: '终极模式'
    };
    let systemPrefix = `[${modeNameMap[chatMode]}] `;
    if (useNetwork) {
      systemPrefix += `[启用联网搜索] `;
    }
    
    // Store message in UI (without system prefixes)
    addMessage({ id: newMessageId, role: 'user', content: displayUserText || "分析已上传的数据" });
    
    const backendPayloadText = systemPrefix + skillsPrefix + (input || "请分析我刚刚上传的数据集");
    setInput('');
    setSelectedSkills([]);
    
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

  // 找最后一个有图表数据的消息 (已移除未使用的 latestChartData)

  const handleFileReference = (file: WorkspaceFile) => {
    setInput(prev => prev + ` [文件引用: ${file.name}] `);
    setIsFilesDrawerOpen(false);
  };

  const handleSelectThread = async (t: any) => {
    setThreadId(t.thread_id);
    setLeftSidebarOpen(false); // mobile responsive maybe, but let's just keep it
    // Optional: fetch messages for this thread if there's an API, 
    // or if the backend /api/threads/{thread_id}/history exists we can use it.
    // For now, we just clear messages and wait for the user to chat, or fetch history.
    useStore.getState().setMessages([]);
    setIsLoadingHistory(true);
    try {
      const res = await fetch(`/api/threads/${t.thread_id}/history?limit=100`, {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const historyData = await res.json();
        // The history is returned in descending order (latest first)
        // Each entry has `values.messages`
        // We need to parse them.
        if (historyData && historyData.length > 0) {
          // Check the most recent checkpoint that has messages
          const latest = historyData[0];
          if (latest.values && latest.values.messages) {
            const msgs = latest.values.messages.map((m: any, i: number) => {
              const role = m.type === 'human' || m.type === 'user' ? 'user' : 'assistant';
              let content = m.content || '';
              if (Array.isArray(m.content)) {
                content = m.content.map((c: any) => c.text || '').join('\n');
              }
              return {
                id: m.id || `${t.thread_id}-${i}`,
                role,
                content,
                reasoning: m.additional_kwargs?.reasoning_content || ''
              };
            });
            useStore.getState().setMessages(msgs);
          }
        }
      }
    } catch (err) {
      console.error('Failed to load thread history', err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleNewChat = () => {
    setThreadId('');
    useStore.getState().setMessages([
      { 
        id: Date.now().toString(), 
        role: 'assistant', 
        content: '您好！我是 DeepResValue 科研分析助手。您可以上传自带数据，或者直接让我从**内置科研数据库**中提取数据（如宏观市级数据、上市企业财务指标等）。\n\n另外，您可以开启上方的“文献检索”功能，我会为您搜集真实可靠的中英文文献并提供原文链接。请告诉我您今天的科研需求。' 
      }
    ]);
  };

  const getThemeClasses = () => {
    switch (theme) {
      case 'dark':
        return 'bg-slate-900 text-slate-100';
      case 'eye-care':
        return 'bg-[#C7EDCC] text-slate-800'; // 经典护眼豆沙绿
      default:
        return 'bg-white text-slate-900';
    }
  };

  const getSidebarClasses = () => {
    switch (theme) {
      case 'dark':
        return 'bg-slate-800 border-slate-700';
      case 'eye-care':
        return 'bg-[#DCEFDF] border-[#B5DAB9]';
      default:
        return 'bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className={`flex h-full font-sans transition-colors duration-300 ${getThemeClasses()}`}>
      {/* Sidebar */}
      <AnimatePresence initial={false}>
        {leftSidebarOpen && (
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 256, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className={`border-r flex flex-col shrink-0 overflow-hidden ${getSidebarClasses()}`}
          >
            <div className={`p-4 border-b flex items-center space-x-2 shrink-0 ${theme === 'dark' ? 'bg-slate-900 border-slate-700' : (theme === 'eye-care' ? 'bg-[#C7EDCC] border-[#B5DAB9]' : 'bg-white border-slate-200')}`}>
              <BrainCircuit className={`w-6 h-6 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
              <span className="font-bold text-lg tracking-tight whitespace-nowrap">DeepResValue</span>
            </div>
            <div className="p-4 space-y-2 shrink-0">
              <button 
                onClick={handleNewChat}
                className="w-full flex items-center justify-center space-x-2 bg-blue-600 border border-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-all shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span className="font-medium text-sm whitespace-nowrap">新建对话</span>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 whitespace-nowrap">历史对话</div>
              {isLoadingHistory ? (
                <div className="text-center py-4">
                  <Loader2 className="w-5 h-5 animate-spin mx-auto text-slate-400" />
                </div>
              ) : historyThreads.length === 0 ? (
                <div className="text-center py-4 text-slate-400 text-xs">暂无历史对话</div>
              ) : (
                historyThreads.map((t) => (
                  <button 
                    key={t.thread_id} 
                    onClick={() => handleSelectThread(t)}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm transition-colors whitespace-nowrap ${
                      threadId === t.thread_id 
                        ? (theme === 'dark' ? 'bg-blue-900/40 text-blue-300 font-medium' : 'bg-blue-100 text-blue-800 font-medium')
                        : (theme === 'dark' ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-600 hover:bg-white/50')
                    }`}
                  >
                    <MessageSquare className="w-4 h-4 shrink-0" />
                    <span className="truncate">{t.values?.title || t.metadata?.title || '未命名对话'}</span>
                  </button>
                ))
              )}
            </div>
            <div className={`p-4 border-t space-y-3 shrink-0 ${theme === 'dark' ? 'border-slate-700' : (theme === 'eye-care' ? 'border-[#B5DAB9]' : 'border-slate-200')}`}>
              {/* 主题切换移至此处 */}
              <div className={`flex items-center justify-between p-1.5 rounded-lg border ${theme === 'dark' ? 'border-slate-700 bg-slate-800' : (theme === 'eye-care' ? 'border-[#A3D1A8] bg-[#C7EDCC]' : 'border-slate-200 bg-slate-100')}`}>
                <div className="flex items-center text-xs font-medium pl-1 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                  <Palette className="w-3.5 h-3.5 mr-1" /> 主题
                </div>
                <div className="flex space-x-1">
                  {(['light', 'dark', 'eye-care'] as Theme[]).map(t => (
                    <button
                      key={t}
                      onClick={() => setTheme(t)}
                      className={`w-6 h-6 rounded-md flex items-center justify-center transition-transform ${
                        theme === t ? 'scale-110 shadow-sm ring-2 ring-blue-400/50' : 'hover:scale-105 opacity-70'
                      } ${
                        t === 'light' ? 'bg-white border border-slate-200' : 
                        t === 'dark' ? 'bg-slate-900 border border-slate-700' : 
                        'bg-[#C7EDCC] border border-[#B5DAB9]'
                      }`}
                      title={t === 'light' ? '默认亮色' : t === 'dark' ? '暗色模式' : '护眼绿'}
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-1">
                <Link to="/datasets" className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors whitespace-nowrap ${theme === 'dark' ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-600 hover:bg-white/50'}`}>
                  <Database className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>数据中心</span>
                </Link>
                <button className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors whitespace-nowrap ${theme === 'dark' ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-600 hover:bg-white/50'}`}>
                  <Settings className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>个人设置</span>
                </button>
                <Link to="/" className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors whitespace-nowrap ${theme === 'dark' ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-600 hover:bg-white/50'}`}>
                  <LogOut className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>返回首页</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative min-w-0 transition-all duration-300">
        {/* Header */}
        <div className={`h-14 border-b flex items-center justify-between px-4 shrink-0 z-30 transition-colors ${theme === 'dark' ? 'bg-slate-900 border-slate-700' : (theme === 'eye-care' ? 'bg-[#C7EDCC] border-[#B5DAB9]' : 'bg-white border-slate-200')}`}>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
              className={`p-1.5 rounded-md transition-colors ${theme === 'dark' ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
              title={leftSidebarOpen ? "收起左侧栏" : "展开左侧栏"}
            >
              <ChevronLeft className={`w-5 h-5 transition-transform ${!leftSidebarOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {/* 会话文件抽屉入口 */}
            <div className="relative">
              <button 
                onClick={() => setIsFilesDrawerOpen(!isFilesDrawerOpen)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md transition-colors border ${
                  isFilesDrawerOpen
                    ? 'bg-blue-50 border-blue-200 text-blue-600'
                    : (theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50')
                }`}
              >
                <FolderOpen className={`w-4 h-4 ${isFilesDrawerOpen ? 'text-blue-500' : 'text-slate-400'}`} />
                <span className="text-sm font-medium">会话文件 ({workspaceFiles.length})</span>
              </button>

              {/* 会话文件下拉面板 (Files Drawer) */}
              <AnimatePresence>
                {isFilesDrawerOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50"
                  >
                    <div className="flex p-2 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                      {[
                        { id: 'all', label: '全部' },
                        { id: 'doc', label: '文档' },
                        { id: 'image', label: '图片' },
                        { id: 'data', label: '数据' },
                        { id: 'code', label: '代码' },
                      ].map(cat => (
                        <button
                          key={cat.id}
                          onClick={() => setActiveFileCategory(cat.id as FileCategory)}
                          className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                            activeFileCategory === cat.id 
                              ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-800 dark:text-white' 
                              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                          }`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                    <div className="max-h-64 overflow-y-auto p-2">
                      {workspaceFiles
                        .filter(f => activeFileCategory === 'all' || f.category === activeFileCategory)
                        .map(file => (
                          <button
                            key={file.id}
                            onClick={() => handleFileReference(file)}
                            className="w-full flex items-center justify-between p-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg group transition-colors text-left"
                          >
                            <div className="flex items-center space-x-3 overflow-hidden">
                              <div className={`p-1.5 rounded-md ${
                                file.category === 'doc' ? 'bg-blue-100 text-blue-600' :
                                file.category === 'image' ? 'bg-purple-100 text-purple-600' :
                                file.category === 'data' ? 'bg-emerald-100 text-emerald-600' :
                                'bg-amber-100 text-amber-600'
                              }`}>
                                {file.category === 'doc' && <FileIcon className="w-4 h-4" />}
                                {file.category === 'image' && <ImageIcon className="w-4 h-4" />}
                                {file.category === 'data' && <Database className="w-4 h-4" />}
                                {file.category === 'code' && <Code className="w-4 h-4" />}
                              </div>
                              <div className="truncate">
                                <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{file.name}</p>
                                <p className="text-xs text-slate-400">{new Date(file.timestamp).toLocaleTimeString()}</p>
                              </div>
                            </div>
                            <span className="text-xs text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                              引用
                            </span>
                          </button>
                        ))}
                      {workspaceFiles.filter(f => activeFileCategory === 'all' || f.category === activeFileCategory).length === 0 && (
                        <div className="text-center py-6 text-slate-400 text-sm">
                          该分类下暂无文件
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>



            {customSkills.length > 0 && (
              <div className={`flex p-1 rounded-lg ml-2 overflow-x-auto max-w-sm ${theme === 'dark' ? 'bg-slate-800' : (theme === 'eye-care' ? 'bg-[#DCEFDF]' : 'bg-slate-100')}`}>
                {customSkills.map((skill) => (
                  <button
                    key={skill.name}
                    onClick={() => {
                      const prompt = `请使用技能 [${skill.name}] 来帮助我处理接下来的任务。技能描述：${skill.description}`;
                      setInput(prompt);
                    }}
                    title={skill.description}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors flex-shrink-0 mr-1 ${
                      theme === 'dark' ? 'text-slate-400 hover:bg-slate-700 hover:text-blue-400' : 'text-slate-600 hover:bg-white hover:text-blue-600'
                    }`}
                  >
                    ⚡ {skill.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <div className={`flex items-center space-x-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              <span className={`flex w-2 h-2 rounded-full ${isLoading ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></span>
              <span className="hidden sm:inline">
                {isLoading ? '正在运行...' : '休息状态'}
              </span>
            </div>
            
            <button 
              onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
              className={`p-1.5 rounded-md transition-colors ${theme === 'dark' ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
              title={rightSidebarOpen ? "收起工具箱" : "展开工具箱"}
            >
              <ChevronRight className={`w-5 h-5 transition-transform ${!rightSidebarOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
        
        {/* Chat Messages */}
        <div className={`flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth pb-32 ${theme === 'dark' ? 'bg-slate-900/50' : (theme === 'eye-care' ? 'bg-[#C7EDCC]/50' : 'bg-slate-50/50')}`}>
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={msg.id} 
                className={`flex w-[90%] mx-auto ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`rounded-3xl px-5 py-3 ${
                  msg.role === 'user' 
                    ? (theme === 'dark' ? 'bg-[#1E293B] text-slate-100 max-w-[80%]' : 'bg-[#F1F5F9] text-slate-800 max-w-[80%]') 
                    : (theme === 'dark' ? 'text-slate-200 w-full' : 'bg-white border border-slate-100 shadow-sm text-slate-800 w-full')
                }`}>
                  {msg.role === 'assistant' && (
                    <div className="flex items-center space-x-2 mb-4 text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-700/50 pb-3">
                      <div className="w-6 h-6 rounded-full bg-slate-900 dark:bg-slate-100 flex items-center justify-center">
                        <BrainCircuit className="w-3.5 h-3.5 text-white dark:text-slate-900" />
                      </div>
                      <span className="text-sm font-bold tracking-tight">DeepResValue</span>
                    </div>
                  )}
                  <div className={`prose prose-sm max-w-none ${msg.role === 'user' ? 'prose-slate dark:prose-invert text-base leading-relaxed' : 'prose-academic'}`}>
                    {msg.reasoning && (
                      <div className={`mb-4 p-4 rounded-lg text-xs leading-relaxed italic font-sans shadow-inner ${
                        theme === 'dark' ? 'bg-slate-900/50 text-slate-400 border border-slate-700' : 'bg-slate-50 text-slate-500 border border-slate-100'
                      }`}>
                        <div className={`font-semibold not-italic mb-1 flex items-center space-x-1.5 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                          <span>思考过程</span>
                        </div>
                        <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>{msg.reasoning}</ReactMarkdown>
                      </div>
                    )}
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm, remarkMath]}
                      rehypePlugins={[rehypeKatex]}
                      components={{
                        img: ({...props}) => {
                          const downloadImage = (url: string) => {
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `chart_${Date.now()}_${Math.random().toString(36).substring(2, 9)}.png`;
                            a.click();
                          };
                          return (
                            <figure className="my-6 w-full flex flex-col items-center group relative">
                              <img {...props} className="w-full h-auto object-contain border border-slate-200 rounded-lg shadow-md" />
                              <button 
                                onClick={() => downloadImage(props.src || '')} 
                                className="absolute top-2 right-2 bg-white/80 p-2 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white text-slate-700"
                                title="下载图片"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                              {props.alt && <figcaption className="text-center text-sm text-slate-500 mt-2 font-sans italic">{props.alt}</figcaption>}
                            </figure>
                          );
                        }
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
                className="flex justify-start w-[90%] mx-auto"
              >
                <div className="w-full rounded-2xl px-6 py-5 bg-white border border-slate-100 shadow-sm text-slate-800">
                  <div className="flex items-center space-x-2 mb-4 text-slate-700 border-b border-slate-100 pb-3">
                    <div className="w-6 h-6 rounded-full bg-slate-900 flex items-center justify-center">
                      <BrainCircuit className="w-3.5 h-3.5 text-white animate-pulse" />
                    </div>
                    <span className="text-sm font-bold tracking-tight">DeepResValue 思考中...</span>
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
        <div className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t pb-6 shrink-0 z-20 ${
          theme === 'dark' ? 'from-slate-900 via-slate-900 to-transparent' : 
          (theme === 'eye-care' ? 'from-[#C7EDCC] via-[#C7EDCC] to-transparent' : 'from-slate-50 via-slate-50 to-transparent')
        }`}>
          <div className="w-[90%] mx-auto relative">
            {(selectedFiles.length > 0 || selectedSkills.length > 0) && (
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedSkills.map((skill, index) => (
                  <div key={`skill-${index}`} className={`flex items-center space-x-1.5 shadow-sm px-3 py-1.5 rounded-lg border ${
                    theme === 'dark' ? 'bg-indigo-900/30 border-indigo-800 text-indigo-300' : 'bg-indigo-50 border-indigo-200 text-indigo-700'
                  }`}>
                    <Zap className="w-3.5 h-3.5" />
                    <span className="text-xs font-medium">{skill.title}</span>
                    <button 
                      onClick={() => setSelectedSkills(selectedSkills.filter((_, i) => i !== index))}
                      className={`${theme === 'dark' ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-500 hover:text-indigo-700'} ml-1 transition-colors`}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                {selectedFiles.map((file, index) => (
                  <div key={`file-${index}`} className={`flex items-center space-x-2 shadow-sm px-3 py-1.5 rounded-lg border ${
                    theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
                  }`}>
                    <FileType className={`w-4 h-4 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`} />
                    <span className="text-xs truncate max-w-[150px]">{file.name}</span>
                    <button 
                      onClick={() => handleRemoveFile(index)}
                      className={`${theme === 'dark' ? 'text-slate-500 hover:text-red-400' : 'text-slate-400 hover:text-red-500'} transition-colors`}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <div className={`flex flex-col border rounded-3xl shadow-lg transition-all p-2 ${
              theme === 'dark' 
                ? (input.trim() || selectedFiles.length > 0 || selectedSkills.length > 0 ? 'bg-[#1E293B] border-blue-500/50 ring-4 ring-blue-900/20' : 'bg-[#1E293B] border-slate-700/50 focus-within:ring-4 focus-within:ring-blue-900/20 focus-within:border-blue-500/50')
                : (input.trim() || selectedFiles.length > 0 || selectedSkills.length > 0 ? 'bg-white border-blue-200 ring-4 ring-blue-50 shadow-blue-900/5' : 'bg-white border-slate-200 focus-within:ring-4 focus-within:ring-blue-50 focus-within:border-blue-200 shadow-slate-200/50')
            }`}>
              {/* Top Settings Bar like deerflow 2.0 */}
              <div className="flex items-center space-x-3 px-2 pt-1 pb-2 mb-1 border-b border-slate-100 dark:border-slate-700/50">
                <div className={`flex p-0.5 rounded-lg ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'}`}>
                  {[
                    { id: 'flash', name: '闪电', icon: Zap },
                    { id: 'thinking', name: '推理', icon: Lightbulb },
                    { id: 'pro', name: '专业', icon: Sparkles },
                    { id: 'ultra', name: '终极', icon: Rocket }
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setChatMode(m.id as any)}
                      className={`flex items-center space-x-1 px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                        chatMode === m.id
                          ? (theme === 'dark' ? 'bg-slate-700 text-blue-400 shadow-sm' : 'bg-white text-blue-600 shadow-sm')
                          : (theme === 'dark' ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-700')
                      }`}
                    >
                      <m.icon className="w-3.5 h-3.5" />
                      <span>{m.name}</span>
                    </button>
                  ))}
                </div>

                <div className={`h-4 w-px ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`}></div>

                {/* Model Selector (Simplified) */}
                <select
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  className={`text-xs font-medium outline-none bg-transparent cursor-pointer ${
                    theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  <option value="deepseek-reasoner">DeepSeek R1 (Reasoner)</option>
                  <option value="deepseek-chat">DeepSeek V3 (Chat)</option>
                  <option value="claude-3.5-sonnet">Claude 3.5 Sonnet</option>
                  <option value="gpt-4o">GPT-4o</option>
                </select>

                {(chatMode === 'thinking' || chatMode === 'ultra') && (
                  <>
                    <div className={`h-4 w-px ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
                    <select
                      value={reasoningEffort}
                      onChange={(e) => setReasoningEffort(e.target.value as any)}
                      className={`text-xs font-medium outline-none bg-transparent cursor-pointer ${
                        theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                      }`}
                    >
                      <option value="low">浅层推理 (Low)</option>
                      <option value="medium">标准推理 (Medium)</option>
                      <option value="high">深度推理 (High)</option>
                    </select>
                  </>
                )}
              </div>

              <div className="flex items-end">
                <input 
                  type="file" 
                  multiple 
                  ref={fileInputRef}
                  className="hidden" 
                  onChange={handleFileChange}
                  accept=".dta,.sav,.py,.do,.r,.zip,.csv,.xlsx,.xls,.pdf,.doc,.docx"
                />

                <div className="relative group self-center ml-1">
                  <button 
                    onClick={() => setUseNetwork(!useNetwork)}
                    className={`p-2.5 transition-colors rounded-xl ${
                      theme === 'dark' 
                        ? (useNetwork ? 'text-indigo-400 bg-slate-800' : 'text-slate-400 hover:text-indigo-400 hover:bg-slate-800') 
                        : (useNetwork ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 hover:text-indigo-600 hover:bg-slate-50')
                    }`} 
                  >
                    <Globe className={`w-5 h-5 ${useNetwork ? 'animate-pulse' : ''}`} />
                  </button>
                  <div className={`absolute bottom-full left-0 mb-2 w-48 text-white text-xs rounded-lg py-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl z-50 ${
                    theme === 'dark' ? 'bg-slate-700' : 'bg-slate-800'
                  }`}>
                    {useNetwork ? '联网搜索已开启，将消耗积分' : '点击开启智能联网搜索'}
                    <div className={`absolute top-full left-4 -mt-1 w-2 h-2 transform rotate-45 ${
                      theme === 'dark' ? 'bg-slate-700' : 'bg-slate-800'
                    }`}></div>
                  </div>
                </div>
                
                <div className="relative group self-center ml-1">
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className={`p-2.5 transition-colors rounded-xl ${
                      theme === 'dark' ? 'text-slate-400 hover:text-blue-400 hover:bg-slate-800' : 'text-slate-400 hover:text-blue-600 hover:bg-slate-50'
                    }`} 
                    title="上传附件"
                  >
                    <Paperclip className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </button>
                  <div className={`absolute bottom-full left-0 mb-2 w-64 text-white text-xs rounded-lg py-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl z-50 ${
                    theme === 'dark' ? 'bg-slate-700' : 'bg-slate-800'
                  }`}>
                    支持上传 .dta, .sav, .csv, .xlsx, .pdf, .docx 等格式。基于大模型的分析结果仅供参考，请核对重要学术数据。
                    <div className={`absolute top-full left-4 -mt-1 w-2 h-2 transform rotate-45 ${
                      theme === 'dark' ? 'bg-slate-700' : 'bg-slate-800'
                    }`}></div>
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
                  placeholder="向 DeepResValue 提问..."
                  className={`w-full max-h-32 min-h-[44px] py-3 px-3 mx-1 resize-none outline-none bg-transparent text-[15px] leading-relaxed ${
                    theme === 'dark' ? 'text-slate-200 placeholder-slate-500' : 'text-slate-700 placeholder-slate-400'
                  }`}
                  rows={1}
                />
                <button 
                  onClick={handleSend}
                  disabled={(!input.trim() && selectedFiles.length === 0 && selectedSkills.length === 0) || isLoading || isUploading}
                  className={`p-2.5 transition-all rounded-xl self-center mr-1 flex items-center justify-center ${
                    theme === 'dark' 
                      ? 'disabled:text-slate-600 disabled:bg-transparent text-white bg-blue-600 hover:bg-blue-500' 
                      : 'disabled:text-slate-400 disabled:bg-transparent text-white bg-slate-900 hover:bg-slate-800 shadow-sm'
                  }`}
                >
                  {isUploading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className={`w-5 h-5 ${(input.trim() || selectedFiles.length > 0 || selectedSkills.length > 0) && !isLoading ? 'hover:translate-x-1 hover:-translate-y-1 transition-transform' : ''}`} />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel: Research Toolbox */}
      <AnimatePresence initial={false}>
        {rightSidebarOpen && (
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className={`border-l flex flex-col shrink-0 z-10 transition-colors duration-300 overflow-hidden hidden lg:flex ${
              theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 
              (theme === 'eye-care' ? 'bg-[#DCEFDF]/50 border-[#B5DAB9]' : 'bg-slate-50/50 border-slate-200')
            }`}
          >
            <div className={`h-14 border-b flex items-center justify-between px-6 shrink-0 shadow-sm z-10 ${
              theme === 'dark' ? 'bg-slate-900 border-slate-700' : 
              (theme === 'eye-care' ? 'bg-[#C7EDCC] border-[#B5DAB9]' : 'bg-white border-slate-200')
            }`}>
              <span className={`font-bold text-[15px] tracking-tight ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>核心科研模块</span>
              <div className="flex space-x-1">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  theme === 'dark' ? 'bg-blue-900/50 text-blue-400' : 
                  (theme === 'eye-care' ? 'bg-[#A3D1A8] text-[#2C5F2D]' : 'bg-blue-100 text-blue-700')
                }`}>工具箱</span>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-5">
              <div className="grid grid-cols-1 gap-3">
                {CORE_SKILLS.map((tool) => (
                  <motion.button
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    key={tool.id}
                    onClick={() => {
                      if (selectedSkills.length === 0) {
                        setSelectedSkills([tool]);
                      } else if (selectedSkills[0].id !== tool.id) {
                        setSelectedSkills([tool]);
                      }
                      if (!input) {
                        setInput('请引导我进行相关操作。');
                      }
                    }}
                    className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-start space-x-4 group ${
                      theme === 'dark' ? 'bg-slate-800 shadow-sm' : 
                      (theme === 'eye-care' ? 'bg-white/80 shadow-sm' : 'bg-white shadow-sm hover:shadow-md')
                    } ${tool.border} ${tool.hover}`}
                  >
                    <div className={`p-2.5 rounded-lg ${tool.bg} ${tool.color} group-hover:scale-110 transition-transform`}>
                      <tool.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <h4 className={`font-bold text-sm mb-1 ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>{tool.title}</h4>
                      <p className={`text-xs leading-snug ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{tool.desc}</p>
                    </div>
                  </motion.button>
                ))}
              </div>

              <div className={`mt-8 p-4 rounded-xl shadow-lg relative overflow-hidden ${
                theme === 'dark' ? 'bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-blue-800/50' : 
                'bg-gradient-to-br from-slate-800 to-slate-900 text-white'
              }`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
                <BrainCircuit className={`w-6 h-6 mb-3 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-400'}`} />
                <h4 className={`font-bold text-sm mb-1 ${theme === 'dark' ? 'text-slate-200' : ''}`}>DeepResValue 智能引擎</h4>
                <p className={`text-xs leading-relaxed mb-4 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-300'}`}>
                  点击上方核心模块卡片，智能体将自动挂载对应技能和工具包，为您提供端到端的科研支持。
                </p>
                <div className="flex items-center space-x-2 text-xs font-medium text-blue-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>引擎状态：在线</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Intercept Action Modal */}
      <AnimatePresence>
        {interceptAction && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              className={`w-full max-w-md rounded-2xl p-6 shadow-2xl ${theme === 'dark' ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-100'}`}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-amber-100 text-amber-600 rounded-full">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>积分消耗确认</h3>
              </div>
              <p className={`text-sm mb-6 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                当前指令涉及联网文献检索或系统内置数据提取，预计将消耗 <strong className="text-amber-500 text-lg mx-1">{interceptAction.cost}</strong> 积分。是否继续？
              </p>
              <div className="flex justify-end space-x-3">
                <button 
                  onClick={() => setInterceptAction(null)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${theme === 'dark' ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  取消
                </button>
                <button 
                  onClick={() => {
                    const confirmFn = interceptAction.onConfirm;
                    setInterceptAction(null);
                    // 扣除积分
                    useStore.getState().deductPoints(interceptAction.cost);
                    confirmFn();
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                >
                  确认并发送
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
