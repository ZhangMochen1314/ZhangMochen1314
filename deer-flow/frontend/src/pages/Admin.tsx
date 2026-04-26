import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { Navigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface AdminUser {
  id: number;
  username: string;
  email: string;
  role: string;
  credits: number;
  my_invite_code: string;
  created_at: string;
}

export default function Admin() {
  const { user, token } = useAuthStore();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState<number | null>(null);
  const [addAmount, setAddAmount] = useState<number>(100);
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);

  if (user?.role !== "admin") {
    return <Navigate to="/home" replace />;
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setUsers(data.users || []);
    } catch (error) {
      setMessage({ type: 'error', text: "无法加载用户列表" });
    } finally {
      setLoading(false);
    }
  };

  const handleAddCredits = async (userId: number) => {
    setMessage(null);
    setAddingId(userId);
    try {
      const res = await fetch("/api/admin/add_credits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ user_id: userId, amount: addAmount }),
      });
      
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      
      setMessage({ type: 'success', text: `充值成功，当前积分：${data.new_credits}` });
      
      // Update local state
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, credits: data.new_credits } : u
        )
      );
    } catch (error) {
      setMessage({ type: 'error', text: "充值失败" });
    } finally {
      setAddingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-t-base text-t-text p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/home" className="p-2 hover:bg-t-surface rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        </div>

        {message && (
          <div className={`p-4 mb-6 text-sm rounded-lg border ${
            message.type === 'error' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200'
          }`}>
            {message.text}
          </div>
        )}

        <div className="bg-t-surface border border-t-border rounded-xl overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-t-muted">加载中...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-t-base/50 border-b border-t-border text-sm text-t-muted">
                    <th className="p-4 font-medium">ID</th>
                    <th className="p-4 font-medium">用户 / 邮箱</th>
                    <th className="p-4 font-medium">邀请码</th>
                    <th className="p-4 font-medium">角色</th>
                    <th className="p-4 font-medium">当前积分</th>
                    <th className="p-4 font-medium">注册时间</th>
                    <th className="p-4 font-medium text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-t-border">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-t-base/30 transition-colors">
                      <td className="p-4 text-t-muted">#{u.id}</td>
                      <td className="p-4">
                        <div className="font-medium">{u.username}</div>
                        <div className="text-sm text-t-muted">{u.email}</div>
                      </td>
                      <td className="p-4 font-mono text-sm">{u.my_invite_code || '-'}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${u.role === 'admin' ? 'bg-t-accent1/20 text-t-accent1' : 'bg-t-border text-t-muted'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-t-accent1">{u.credits}</td>
                      <td className="p-4 text-sm text-t-muted">
                        {u.created_at ? new Date(u.created_at).toLocaleString() : '-'}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <input 
                            type="number" 
                            className="w-20 px-2 py-1 bg-t-base border border-t-border rounded text-sm focus:outline-none focus:border-t-accent1"
                            value={addAmount}
                            onChange={(e) => setAddAmount(Number(e.target.value))}
                            placeholder="数量"
                          />
                          <button
                            onClick={() => handleAddCredits(u.id)}
                            disabled={addingId === u.id}
                            className="px-3 py-1 bg-t-accent1 text-black rounded text-sm font-medium hover:bg-opacity-90 disabled:opacity-50 transition-colors"
                          >
                            {addingId === u.id ? "充值中..." : "加积分"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-t-muted">暂无用户数据</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
