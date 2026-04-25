import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useStore } from "@/store/useStore";
import { motion } from "framer-motion";
import { Zap, CreditCard, Clock, Activity, ArrowRight, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

interface LedgerEntry {
  id: number;
  transaction_type: string;
  amount: number;
  balance_after: number;
  description: string | null;
  created_at: string;
}

function BillingHistory() {
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = useAuthStore(state => state.token);

  useEffect(() => {
    const fetchLedger = async () => {
      try {
        const response = await fetch("/api/points/ledger", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error("获取账单流水失败");
        }
        
        const data = await response.json();
        setLedger(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "未知错误");
      } finally {
        setLoading(false);
      }
    };

    fetchLedger();
  }, [token]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center">
        <Activity className="w-5 h-5 mr-2" />
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-slate-800 flex items-center">
          <Clock className="w-5 h-5 mr-2 text-slate-500" />
          账单流水
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm">
              <th className="px-6 py-3 font-medium">时间</th>
              <th className="px-6 py-3 font-medium">类型</th>
              <th className="px-6 py-3 font-medium">描述</th>
              <th className="px-6 py-3 font-medium text-right">数额</th>
              <th className="px-6 py-3 font-medium text-right">余额</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {ledger.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                  暂无账单记录
                </td>
              </tr>
            ) : (
              ledger.map((entry) => (
                <tr key={entry.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">
                    {formatDate(entry.created_at)}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      entry.amount >= 0 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {entry.transaction_type === 'recharge' ? '充值' : 
                       entry.transaction_type === 'consume' ? '消费' : entry.transaction_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {entry.description || '-'}
                  </td>
                  <td className={`px-6 py-4 text-sm font-medium text-right whitespace-nowrap flex justify-end items-center ${
                    entry.amount > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {entry.amount > 0 ? (
                      <ArrowUpRight className="w-4 h-4 mr-1" />
                    ) : (
                      <ArrowDownLeft className="w-4 h-4 mr-1" />
                    )}
                    {entry.amount > 0 ? '+' : ''}{entry.amount}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-700 text-right whitespace-nowrap">
                    {entry.balance_after}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuthStore();
  const points = useStore(state => state.points);

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-slate-900 mb-2">控制台概览</h1>
          <p className="text-slate-600">管理您的账户信息与积分使用记录</p>
        </motion.div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-start space-x-4"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-xl font-bold text-blue-600">
                {user?.username?.[0]?.toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-800">账户信息</h2>
              <div className="mt-2 space-y-1">
                <p className="text-sm text-slate-600"><span className="text-slate-400 w-16 inline-block">用户名：</span> {user?.username}</p>
                <p className="text-sm text-slate-600"><span className="text-slate-400 w-16 inline-block">邮箱：</span> {user?.email}</p>
                <p className="text-sm text-slate-600">
                  <span className="text-slate-400 w-16 inline-block">状态：</span> 
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                    正常
                  </span>
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-800 mb-1">可用积分</h2>
                <p className="text-sm text-slate-500">用于文献检索、数据分析等功能</p>
              </div>
              <div className="bg-amber-100 p-3 rounded-xl">
                <Zap className="w-6 h-6 text-amber-500 fill-amber-500" />
              </div>
            </div>
            <div className="flex items-end justify-between">
              <div className="flex items-baseline space-x-1">
                <span className="text-4xl font-bold text-slate-900">{points.toLocaleString()}</span>
                <span className="text-slate-500 font-medium">积分</span>
              </div>
              <Link 
                to="/#pricing" 
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors shadow-sm"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                充值
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Billing History Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <BillingHistory />
        </motion.div>
        
      </div>
    </div>
  );
}