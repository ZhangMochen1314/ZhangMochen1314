import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { ShieldCheck, Plus, Save, Trash2, Tag, Gift, Users } from 'lucide-react';

export default function Admin() {
  const { token, fetchPricingConfig, pointPackages, skillPrices } = useStore();
  const [activeTab, setActiveTab] = useState<'skills' | 'packages' | 'invites'>('skills');
  const [invites, setInvites] = useState<any[]>([]);

  // Forms
  const [newSkill, setNewSkill] = useState({ skill_id: '', display_name: '', cost: 10 });
  const [newPackage, setNewPackage] = useState({ name: '', points: 1000, price: '¥0', is_recommended: false });
  const [newBetaCode, setNewBetaCode] = useState('');

  useEffect(() => {
    fetchPricingConfig();
    if (activeTab === 'invites') fetchInvites();
  }, [activeTab]);

  const fetchInvites = async () => {
    const res = await fetch('/api/admin/invite_codes', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) setInvites(await res.json());
  };

  const handleGenerateBeta = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBetaCode.trim()) return;
    
    const res = await fetch(`/api/admin/generate_beta_code?code=${newBetaCode.trim()}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      alert("✅ 生成成功！");
      setNewBetaCode('');
      fetchInvites();
    } else {
      const data = await res.json();
      alert("❌ 生成失败: " + data.detail);
    }
  };

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/admin/skill_prices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(newSkill)
    });
    fetchPricingConfig();
    setNewSkill({ skill_id: '', display_name: '', cost: 10 });
  };

  const handleDeleteSkill = async (id: number) => {
    await fetch(`/api/admin/skill_prices/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    fetchPricingConfig();
  };

  const handleAddPackage = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/admin/point_packages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(newPackage)
    });
    fetchPricingConfig();
    setNewPackage({ name: '', points: 1000, price: '¥0', is_recommended: false });
  };

  const handleDeletePackage = async (id: number) => {
    await fetch(`/api/admin/point_packages/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    fetchPricingConfig();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center space-x-3">
          <ShieldCheck className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">控制台 (Admin Dashboard)</h1>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-8 border-b border-slate-200 dark:border-slate-800">
          {[
            { id: 'skills', label: '技能定价管理', icon: Tag },
            { id: 'packages', label: '充值套餐管理', icon: Gift },
            { id: 'invites', label: '邀请码与拉新', icon: Users },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id 
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content: Skills */}
        {activeTab === 'skills' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-bold mb-4 dark:text-white">新增/修改技能定价</h2>
              <form onSubmit={handleAddSkill} className="flex flex-wrap items-end gap-4 mb-6">
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium mb-1 dark:text-slate-300">技能标识 (skill_id)</label>
                  <input required value={newSkill.skill_id} onChange={e=>setNewSkill({...newSkill, skill_id: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 dark:text-white" placeholder="e.g. DeepResValue-DataClean" />
                </div>
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium mb-1 dark:text-slate-300">前端显示名称</label>
                  <input required value={newSkill.display_name} onChange={e=>setNewSkill({...newSkill, display_name: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 dark:text-white" placeholder="e.g. 微观企业指标提取" />
                </div>
                <div className="w-32">
                  <label className="block text-sm font-medium mb-1 dark:text-slate-300">消耗积分</label>
                  <input required type="number" value={newSkill.cost} onChange={e=>setNewSkill({...newSkill, cost: parseInt(e.target.value)})} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 dark:text-white" />
                </div>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"><Plus className="w-4 h-4 mr-1"/> 保存</button>
              </form>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">
                  <tr>
                    <th className="p-4 font-medium">显示名称</th>
                    <th className="p-4 font-medium">后台标识符</th>
                    <th className="p-4 font-medium">每次消耗积分</th>
                    <th className="p-4 font-medium text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {skillPrices.map(sp => (
                    <tr key={sp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="p-4 font-medium dark:text-white">{sp.display_name}</td>
                      <td className="p-4 font-mono text-slate-500">{sp.skill_id}</td>
                      <td className="p-4 text-amber-600 font-bold">{sp.cost}</td>
                      <td className="p-4 text-right">
                        <button onClick={() => handleDeleteSkill(sp.id)} className="text-red-500 hover:text-red-700 p-1"><Trash2 className="w-4 h-4"/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab Content: Packages */}
        {activeTab === 'packages' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-bold mb-4 dark:text-white">新增充值套餐</h2>
              <form onSubmit={handleAddPackage} className="flex flex-wrap items-end gap-4 mb-6">
                <div className="flex-1 min-w-[150px]">
                  <label className="block text-sm font-medium mb-1 dark:text-slate-300">套餐名称</label>
                  <input required value={newPackage.name} onChange={e=>setNewPackage({...newPackage, name: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 dark:text-white" placeholder="e.g. 豪华包" />
                </div>
                <div className="flex-1 min-w-[150px]">
                  <label className="block text-sm font-medium mb-1 dark:text-slate-300">包含积分</label>
                  <input required type="number" value={newPackage.points} onChange={e=>setNewPackage({...newPackage, points: parseInt(e.target.value)})} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 dark:text-white" />
                </div>
                <div className="flex-1 min-w-[150px]">
                  <label className="block text-sm font-medium mb-1 dark:text-slate-300">价格展示</label>
                  <input required value={newPackage.price} onChange={e=>setNewPackage({...newPackage, price: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 dark:text-white" placeholder="e.g. ¥199" />
                </div>
                <div className="flex items-center space-x-2 pb-2">
                  <input type="checkbox" id="is_rec" checked={newPackage.is_recommended} onChange={e=>setNewPackage({...newPackage, is_recommended: e.target.checked})} className="rounded text-blue-600 focus:ring-blue-500" />
                  <label htmlFor="is_rec" className="text-sm font-medium dark:text-slate-300">设为推荐</label>
                </div>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"><Plus className="w-4 h-4 mr-1"/> 保存</button>
              </form>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {pointPackages.map(pkg => (
                  <div key={pkg.id} className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6 relative">
                    {pkg.is_recommended && <div className="absolute top-4 right-4 bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded">推荐</div>}
                    <h3 className="text-lg font-bold dark:text-white">{pkg.name}</h3>
                    <div className="my-4">
                      <span className="text-3xl font-extrabold text-blue-600">{pkg.price}</span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 mb-6">包含 <strong className="text-slate-900 dark:text-white">{pkg.points}</strong> 个算力积分</p>
                    <button onClick={() => handleDeletePackage(pkg.id)} className="w-full py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex justify-center items-center">
                      <Trash2 className="w-4 h-4 mr-2" /> 删除套餐
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Invites */}
        {activeTab === 'invites' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-bold mb-4 dark:text-white">自定义超级内测码</h2>
              <form onSubmit={handleGenerateBeta} className="flex flex-wrap items-end gap-4">
                <div className="flex-1 max-w-md">
                  <label className="block text-sm font-medium mb-1 dark:text-slate-300">超级内测码 (支持字母数字组合，例如：DUANYIXUN)</label>
                  <input 
                    required 
                    value={newBetaCode} 
                    onChange={e => setNewBetaCode(e.target.value.toUpperCase())} 
                    className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 dark:text-white font-mono tracking-widest uppercase" 
                    placeholder="e.g. DUANYIXUN" 
                  />
                </div>
                <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center shadow-sm">
                  <Plus className="w-4 h-4 mr-2" /> 生成超级内测码
                </button>
              </form>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">
                  <tr>
                    <th className="p-4 font-medium">邀请码</th>
                    <th className="p-4 font-medium">类型</th>
                    <th className="p-4 font-medium">所有者</th>
                    <th className="p-4 font-medium text-right">已拉新人数</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {invites.map(inv => (
                    <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="p-4 font-mono font-bold dark:text-white">{inv.code}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${inv.type === 'Master Beta Code' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                          {inv.type}
                        </span>
                      </td>
                      <td className="p-4 text-slate-500">{inv.owner_email || '系统 (官方)'}</td>
                      <td className="p-4 text-right font-bold text-emerald-600">{inv.usage_count} 人</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}