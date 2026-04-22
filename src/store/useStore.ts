import { create } from 'zustand';

export interface Message {
  id: string | number;
  role: 'user' | 'assistant';
  content: string;
  reasoning?: string;
  chartData?: any;
  options?: { label: string; value: string }[];
}

export interface Dataset {
  id: number;
  name: string;
  size: string;
  rows: number;
  date: string;
}

// Points Calculation Constants
export const POINTS_RATES = {
  DATA_LEVEL: {
    MICRO: 50,      // 微观数据
    COUNTY: 30,     // 县级数据
    CITY: 20,       // 市级数据
    PROVINCIAL: 10, // 省级数据
  },
  SIZE_RATE_PER_MB: 5,   // 每 MB 消耗的积分
  COMPLEXITY_RATE: {
    LOW: 1,
    MEDIUM: 1.5,
    HIGH: 2,
  },
  LIT_SEARCH_RATE: 20,   // 每次文献检索消耗
};

interface AppState {
  threadId: string | null;
  messages: Message[];
  datasets: Dataset[];
  points: number;
  setThreadId: (id: string) => void;
  addMessage: (msg: Message) => void;
  updateLastMessage: (content: string) => void;
  upsertMessage: (msg: Message) => void;
  setMessages: (msgs: Message[]) => void;
  addDataset: (ds: Dataset) => void;
  removeDataset: (id: number) => void;
  deductPoints: (amount: number) => void;
  addPoints: (amount: number) => void;
}

export const useStore = create<AppState>((set) => ({
  threadId: null,
  messages: [
    { 
      id: 1, 
      role: 'assistant', 
      content: '您好！我是基于 Deerflow 2.0 构建的科研分析助手。您可以上传数据集，并用自然语言描述您的实证分析需求。例如："请帮我做一份描述性统计报告" 或 "利用 OLS 跑一下这两个变量的回归"。' 
    }
  ],
  datasets: [
    { id: 1, name: "2024年社会调查问卷数据.csv", size: "2.4 MB", rows: 1250, date: "2024-04-20" },
    { id: 2, name: "宏观经济面板数据_1990_2020.xlsx", size: "15.1 MB", rows: 45000, date: "2024-04-18" },
  ],
  points: 1000, // 默认积分
  setThreadId: (id) => set({ threadId: id }),
  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
  updateLastMessage: (content) => set((state) => {
    // Keep this for backward compatibility if needed, but we will add upsertMessage
    const newMessages = [...state.messages];
    if (newMessages.length > 0 && newMessages[newMessages.length - 1].role === 'assistant') {
      const lastMsg = newMessages[newMessages.length - 1];
      newMessages[newMessages.length - 1] = { ...lastMsg, content };
    } else {
      newMessages.push({ id: Date.now().toString(), role: 'assistant', content });
    }
    return { messages: newMessages };
  }),
  upsertMessage: (msg: Message) => set((state) => {
    const newMessages = [...state.messages];
    const index = newMessages.findIndex(m => m.id === msg.id);
    if (index !== -1) {
      const existingMsg = newMessages[index];
      // Accumulate content and reasoning streams
      const updatedContent = existingMsg.content + (msg.content || "");
      const updatedReasoning = (existingMsg.reasoning || "") + (msg.reasoning || "");
      
      newMessages[index] = { 
        ...existingMsg, 
        ...msg,
        content: updatedContent,
        reasoning: updatedReasoning
      };
    } else {
      newMessages.push(msg);
    }
    return { messages: newMessages };
  }),
  setMessages: (msgs) => set({ messages: msgs }),
  addDataset: (ds) => set((state) => ({ datasets: [...state.datasets, ds] })),
  removeDataset: (id) => set((state) => ({ datasets: state.datasets.filter(d => d.id !== id) })),
  deductPoints: (amount) => set((state) => ({ points: Math.max(0, state.points - amount) })),
  addPoints: (amount) => set((state) => ({ points: state.points + amount })),
}));
