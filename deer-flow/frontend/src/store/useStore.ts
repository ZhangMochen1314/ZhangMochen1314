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
  LIT_SEARCH_RATE: 2,
  DATA_LEVEL: {
    PROVINCIAL: 1,
    CITY: 2,
    COUNTY: 3,
    MICRO: 5
  },
  SKILLS: {
    'DeepResValue-Literature-Search': 2,
    'DeepResValue-Literature-Review': 2,
    'DeepResValue-DataCollector': 1,
    'DeepResValue-DataClean': 2,
    'DeepResValue-StatModel': 3,
    'DeepResValue-DID': 5,
    'DeepResValue-SciPlot': 2,
    'DeepResValue-Spatial': 5,
  }
};

interface UserInfo {
  id: number;
  email: string;
  role: string;
  my_invite_code?: string;
}

interface PointPackage {
  id: number;
  name: string;
  points: number;
  price: string;
  is_recommended: boolean;
}

interface SkillPrice {
  id: number;
  skill_id: string;
  display_name: string;
  cost: number;
}

interface AppState {
  token: string | null;
  user: UserInfo | null;
  showAuthModal: boolean;
  pointPackages: PointPackage[];
  skillPrices: SkillPrice[];
  fetchPricingConfig: () => Promise<void>;
  setShowAuthModal: (show: boolean) => void;
  setAuth: (token: string | null, user: UserInfo | null, points: number) => void;
  logout: () => void;
  
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
  deductPoints: (amount: number) => Promise<void>;
  addPoints: (amount: number) => void;
}

export const useStore = create<AppState>((set) => ({
  token: localStorage.getItem('auth_token'),
  user: JSON.parse(localStorage.getItem('auth_user') || 'null'),
  points: parseInt(localStorage.getItem('auth_points') || '0', 10),
  showAuthModal: false,
  pointPackages: [],
  skillPrices: [],
  fetchPricingConfig: async () => {
    try {
      const [packagesRes, pricesRes] = await Promise.all([
        fetch('/api/billing/packages'),
        fetch('/api/billing/prices')
      ]);
      if (packagesRes.ok && pricesRes.ok) {
        const packages = await packagesRes.json();
        const prices = await pricesRes.json();
        set({ pointPackages: packages, skillPrices: prices });
      }
    } catch (e) {
      console.error('Failed to fetch pricing configs', e);
    }
  },
  setShowAuthModal: (show) => set({ showAuthModal: show }),
  setAuth: (token, user, points) => {
    if (token && user) {
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_user', JSON.stringify(user));
      localStorage.setItem('auth_points', points.toString());
      set({ token, user, points });
    } else {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_points');
      set({ token: null, user: null, points: 0 });
    }
  },
  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_points');
    set({ token: null, user: null, points: 0, threadId: null, messages: [] });
  },
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
  deductPoints: async (amount) => {
    // 乐观更新 UI
    set((state) => ({ points: Math.max(0, state.points - amount) }));
    
    // 异步更新后端
    try {
      const state = useStore.getState();
      if (!state.token) return;
      
      const res = await fetch('/api/billing/deduct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.token}`
        },
        body: JSON.stringify({ amount, action: 'manual_deduct' })
      });
      if (!res.ok) {
        console.error("Deduction sync failed");
      }
    } catch (err) {
      console.error(err);
    }
  },
  addPoints: (amount) => set((state) => ({ points: state.points + amount })),
}));
