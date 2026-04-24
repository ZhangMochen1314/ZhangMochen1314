import { create } from 'zustand';

export interface Message {
  id: string | number;
  role: 'user' | 'assistant';
  content: string;
  reasoning?: string;
  chartData?: Record<string, unknown>;
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
      content: '您好！我是 DeepResValue 科研分析助手。您可以上传自带数据，或者直接让我从**内置科研数据库**中提取数据（如宏观市级数据、上市企业财务指标等）。\n\n另外，您可以开启上方的“文献检索”功能，我会为您搜集真实可靠的中英文文献并提供原文链接。请告诉我您今天的科研需求。' 
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
