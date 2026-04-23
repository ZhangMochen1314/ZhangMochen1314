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
    <div className="min-h-screen bg-slate-950 pt-24 pb-12 px-4 sm:px-6 lg:px-8 selection:bg-emerald-500/30">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 flex items-center space-x-4 border-b border-slate-800 pb-8">
          <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Admin System</h1>
            <p className="text-slate-400 text-sm font-mono mt-1">DeepResValue v2.0 Console</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-slate-900/50 p-1 rounded-xl border border-slate-800 w-fit">
          {[
            { id: 'skills', label: 'Pricing Models', icon: Tag },
            { id: 'packages', label: 'Credit Packages', icon: Gift },
            { id: 'invites', label: 'Access Control', icon: Users },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-5 py-2.5 text-sm font-bold rounded-lg transition-all ${
                activeTab === tab.id 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-lg' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content: Skills */}
        {activeTab === 'skills' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-cyan-500" />
              <h2 className="text-xl font-bold text-white mb-6 font-mono tracking-tight uppercase">New Pricing Model</h2>
              <form onSubmit={handleAddSkill} className="flex flex-wrap items-end gap-6 mb-2">
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">System ID</label>
                  <input required value={newSkill.skill_id} onChange={e=>setNewSkill({...newSkill, skill_id: e.target.value})} className="w-full px-4 py-3 bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl text-white font-mono text-sm transition-colors focus:outline-none" placeholder="DeepResValue-DataClean" />
                </div>
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Display Name</label>
                  <input required value={newSkill.display_name} onChange={e=>setNewSkill({...newSkill, display_name: e.target.value})} className="w-full px-4 py-3 bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl text-white text-sm transition-colors focus:outline-none" placeholder="微观企业指标提取" />
                </div>
                <div className="w-32">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Cost</label>
                  <input required type="number" value={newSkill.cost} onChange={e=>setNewSkill({...newSkill, cost: parseInt(e.target.value)})} className="w-full px-4 py-3 bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl text-white font-mono text-sm transition-colors focus:outline-none" />
                </div>
                <button type="submit" className="px-6 py-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-xl hover:bg-emerald-500 hover:text-slate-900 transition-all font-bold flex items-center h-[46px]"><Plus className="w-4 h-4 mr-2"/> Deploy</button>
              </form>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 font-mono text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4 font-bold">Display Name</th>
                    <th className="px-6 py-4 font-bold">System ID</th>
                    <th className="px-6 py-4 font-bold">Cost / Run</th>
                    <th className="px-6 py-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {skillPrices.map(sp => (
                    <tr key={sp.id} className="hover:bg-slate-800/50 transition-colors group">
                      <td className="px-6 py-5 font-bold text-white">{sp.display_name}</td>
                      <td className="px-6 py-5 font-mono text-slate-500">{sp.skill_id}</td>
                      <td className="px-6 py-5 font-mono text-emerald-400 font-bold">{sp.cost}</td>
                      <td className="px-6 py-5 text-right">
                        <button onClick={() => handleDeleteSkill(sp.id)} className="text-slate-600 hover:text-rose-400 transition-colors p-2 rounded-lg hover:bg-rose-500/10"><Trash2 className="w-4 h-4"/></button>
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
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
              <h2 className="text-xl font-bold text-white mb-6 font-mono tracking-tight uppercase">New Credit Package</h2>
              <form onSubmit={handleAddPackage} className="flex flex-wrap items-end gap-6 mb-2">
                <div className="flex-1 min-w-[150px]">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Package Name</label>
                  <input required value={newPackage.name} onChange={e=>setNewPackage({...newPackage, name: e.target.value})} className="w-full px-4 py-3 bg-slate-950 border border-slate-700 focus:border-blue-500 rounded-xl text-white text-sm transition-colors focus:outline-none" placeholder="Pro Package" />
                </div>
                <div className="flex-1 min-w-[150px]">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Credits</label>
                  <input required type="number" value={newPackage.points} onChange={e=>setNewPackage({...newPackage, points: parseInt(e.target.value)})} className="w-full px-4 py-3 bg-slate-950 border border-slate-700 focus:border-blue-500 rounded-xl text-white font-mono text-sm transition-colors focus:outline-none" />
                </div>
                <div className="flex-1 min-w-[150px]">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Price Label</label>
                  <input required value={newPackage.price} onChange={e=>setNewPackage({...newPackage, price: e.target.value})} className="w-full px-4 py-3 bg-slate-950 border border-slate-700 focus:border-blue-500 rounded-xl text-white font-mono text-sm transition-colors focus:outline-none" placeholder="¥199" />
                </div>
                <div className="flex items-center space-x-3 h-[46px] px-2">
                  <div className="relative flex items-start">
                    <div className="flex items-center h-5">
                      <input type="checkbox" id="is_rec" checked={newPackage.is_recommended} onChange={e=>setNewPackage({...newPackage, is_recommended: e.target.checked})} className="w-5 h-5 rounded bg-slate-950 border-slate-700 text-blue-500 focus:ring-blue-500/20 focus:ring-offset-slate-900" />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="is_rec" className="font-bold text-slate-300">Featured</label>
                    </div>
                  </div>
                </div>
                <button type="submit" className="px-6 py-3 bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded-xl hover:bg-blue-500 hover:text-white transition-all font-bold flex items-center h-[46px]"><Plus className="w-4 h-4 mr-2"/> Publish</button>
              </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {pointPackages.map(pkg => (
                <div key={pkg.id} className={`rounded-2xl p-8 relative transition-all ${pkg.is_recommended ? 'bg-blue-500/5 border border-blue-500/20' : 'bg-slate-900 border border-slate-800'}`}>
                  {pkg.is_recommended && <div className="absolute top-4 right-4 bg-blue-500/20 text-blue-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Featured</div>}
                  <h3 className="text-xl font-bold text-white mb-2">{pkg.name}</h3>
                  <div className="my-6 flex items-baseline">
                    <span className="text-4xl font-black text-white tracking-tighter">{pkg.price}</span>
                  </div>
                  <p className="text-slate-400 font-mono text-sm mb-8 border-t border-slate-800 pt-6">
                    <span className="text-emerald-400 font-bold">{pkg.points}</span> Credits
                  </p>
                  <button onClick={() => handleDeletePackage(pkg.id)} className="w-full py-3 border border-rose-500/20 text-rose-400 rounded-xl hover:bg-rose-500/10 hover:border-rose-500/50 transition-colors font-bold text-sm flex justify-center items-center">
                    <Trash2 className="w-4 h-4 mr-2" /> Terminate Package
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content: Invites */}
        {activeTab === 'invites' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
              <h2 className="text-xl font-bold text-white mb-6 font-mono tracking-tight uppercase">Access Control Matrix</h2>
              <form onSubmit={handleGenerateBeta} className="flex flex-wrap items-end gap-6 mb-2">
                <div className="flex-1 max-w-md">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Master Beta Code (Alphanumeric)</label>
                  <input 
                    required 
                    value={newBetaCode} 
                    onChange={e => setNewBetaCode(e.target.value.toUpperCase())} 
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-700 focus:border-purple-500 rounded-xl text-white font-mono tracking-[0.2em] uppercase text-sm transition-colors focus:outline-none" 
                    placeholder="e.g. DEEPRESVALUE" 
                  />
                </div>
                <button type="submit" className="px-6 py-3 bg-purple-500/10 text-purple-400 border border-purple-500/30 rounded-xl hover:bg-purple-500 hover:text-white transition-all font-bold flex items-center h-[46px]">
                  <Plus className="w-4 h-4 mr-2" /> Generate Key
                </button>
              </form>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 font-mono text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4 font-bold">Invite Key</th>
                    <th className="px-6 py-4 font-bold">Class</th>
                    <th className="px-6 py-4 font-bold">Owner Identity</th>
                    <th className="px-6 py-4 font-bold text-right">Conversions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {invites.map(inv => (
                    <tr key={inv.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-5 font-mono font-bold text-white tracking-widest">{inv.code}</td>
                      <td className="px-6 py-5">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${inv.type === 'Master Beta Code' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-slate-800 text-slate-300 border-slate-700'}`}>
                          {inv.type === 'Master Beta Code' ? 'MASTER' : 'USER'}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-slate-400 font-mono text-xs">{inv.owner_email || 'SYSTEM_ROOT'}</td>
                      <td className="px-6 py-5 text-right font-mono font-bold text-emerald-400">{inv.usage_count}</td>
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