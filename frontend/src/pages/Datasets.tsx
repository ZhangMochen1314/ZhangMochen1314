import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Database, Upload, FileText, MoreVertical, Trash2, Library, Zap, Download, Info } from "lucide-react";
import { useStore, POINTS_RATES } from "@/store/useStore";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BUILT_IN_DATASETS = [
  { 
    id: 'b1', name: '上市企业财务指标面板数据 (2010-2023)', type: '微观企业', rows: '2.4M', baseSize: 120, points: POINTS_RATES.DATA_LEVEL.MICRO,
    variables: ['stkcd (股票代码)', 'year (年份)', 'ROA (总资产收益率)', 'ROE (净资产收益率)', 'Lev (资产负债率)', 'Size (企业规模/总资产自然对数)', 'TobinQ (托宾Q值)', 'Cash (现金流比率)', 'Age (上市年限)', 'Board (董事会规模)']
  },
  { 
    id: 'b2', name: '全国县域宏观经济统计数据 (2000-2022)', type: '宏观县域', rows: '450K', baseSize: 45, points: POINTS_RATES.DATA_LEVEL.COUNTY,
    variables: ['county_code (县域行政代码)', 'year (年份)', 'GDP (地区生产总值/万元)', 'pop (年末常住人口/万人)', 'gov_rev (一般公共预算收入/万元)', 'industry_ratio (第二产业增加值占比)', 'agr_output (农业总产值)']
  },
  { 
    id: 'b3', name: '全国地级市统计年鉴面板数据 (2000-2023)', type: '宏观市级', rows: '85K', baseSize: 15, points: POINTS_RATES.DATA_LEVEL.CITY,
    variables: ['city_code (城市代码)', 'year (年份)', 'GDP (地区生产总值/亿元)', 'FDI (实际利用外资金额/万美元)', 'patent_count (专利申请授权数/件)', 'green_area (建成区绿化覆盖面积/公顷)', 'hospital_beds (医院床位数/张)']
  },
  { 
    id: 'b4', name: '各省份宏观经济及创新指数面板数据 (2005-2023)', type: '宏观省级', rows: '15K', baseSize: 2, points: POINTS_RATES.DATA_LEVEL.PROVINCIAL,
    variables: ['prov_code (省级代码)', 'year (年份)', 'GDP (地区生产总值/亿元)', 'CPI (居民消费价格指数)', 'RD_exp (R&D内部经费支出/万元)', 'edu_exp (教育支出/万元)', 'urban_ratio (城镇化率)']
  },
];

export default function Datasets() {
  const { datasets, removeDataset } = useStore();
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<'my' | 'builtin'>('my');
  const navigate = useNavigate();

  // Extraction Modal State
  const [extractModalOpen, setExtractModalOpen] = useState(false);
  const [varDictModalOpen, setVarDictModalOpen] = useState(false);
  const [selectedDataset, setSelectedDataset] = useState<typeof BUILT_IN_DATASETS[0] | null>(null);
  const [yearRange, setYearRange] = useState([2015, 2022]);

  const handleExtractClick = (ds: typeof BUILT_IN_DATASETS[0]) => {
    setSelectedDataset(ds);
    setYearRange([2015, 2022]);
    setExtractModalOpen(true);
  };

  const handleVarDictClick = (ds: typeof BUILT_IN_DATASETS[0]) => {
    setSelectedDataset(ds);
    setVarDictModalOpen(true);
  };

  const handleConfirmExtraction = () => {
    if (!selectedDataset) return;
    
    // Simulate navigation to chat with a pre-filled message or command
    const instruction = `提取 ${selectedDataset.name} 的数据 (${yearRange[0]}-${yearRange[1]})，并进行初步的描述性统计分析。`;
    // In a real app, you might pass this via state or a URL parameter
    setExtractModalOpen(false);
    navigate(`/chat?instruction=${encodeURIComponent(instruction)}`);
  };

  const getEstimatedSize = () => {
    if (!selectedDataset) return 0;
    const ratio = Math.max(0.1, (yearRange[1] - yearRange[0] + 1) / 24); // 24 is roughly max years (2000-2023)
    return parseFloat((selectedDataset.baseSize * ratio).toFixed(1));
  };

  const getEstimatedPoints = () => {
    if (!selectedDataset) return 0;
    const estSize = getEstimatedSize();
    // Assuming size penalty applies for every full MB, or fraction
    const sizePenalty = Math.ceil(estSize) * POINTS_RATES.SIZE_RATE_PER_MB;
    return selectedDataset.points + sizePenalty;
  };

  return (
    <div className="text-slate-900 font-sans selection:bg-blue-200 bg-slate-50 min-h-screen">
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/chat" className="text-slate-500 hover:text-slate-900 transition-colors p-2 -ml-2 rounded-full hover:bg-slate-100">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-blue-600" />
            <span className="text-lg font-bold tracking-tight text-slate-900">数据管理与供应</span>
          </div>
        </div>
        <div>
          <button 
            onClick={() => setIsUploading(true)}
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Upload className="w-4 h-4 mr-2" /> 上传自带数据
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex space-x-1 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('my')}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors flex items-center space-x-2 ${
              activeTab === 'my' 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>我的自带数据</span>
          </button>
          <button
            onClick={() => setActiveTab('builtin')}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors flex items-center space-x-2 ${
              activeTab === 'builtin' 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <Library className="w-4 h-4" />
            <span>内置科研数据库</span>
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {activeTab === 'my' ? (
            <>
              <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
                <h2 className="text-lg font-semibold text-slate-900">已上传的文件</h2>
                <div className="flex space-x-2 text-sm text-slate-500">
                  <span>已使用容量: 17.5 MB / 500 MB</span>
                </div>
              </div>
              <div className="overflow-x-auto min-h-[400px]">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                      <th className="p-4 font-medium">文件名</th>
                      <th className="p-4 font-medium">大小</th>
                      <th className="p-4 font-medium">行数</th>
                      <th className="p-4 font-medium">上传时间</th>
                      <th className="p-4 font-medium text-right">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <AnimatePresence>
                      {datasets.map((ds) => (
                        <motion.tr 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          key={ds.id} 
                          className="hover:bg-blue-50/30 transition-colors group"
                        >
                          <td className="p-4">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                <FileText className="w-5 h-5" />
                              </div>
                              <span className="font-medium text-slate-700">{ds.name}</span>
                            </div>
                          </td>
                          <td className="p-4 text-sm text-slate-500">{ds.size}</td>
                          <td className="p-4 text-sm text-slate-500">{ds.rows.toLocaleString()}</td>
                          <td className="p-4 text-sm text-slate-500">{ds.date}</td>
                          <td className="p-4 text-right">
                            <div className="flex justify-end items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => removeDataset(ds.id)}
                                className="p-2 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors" 
                                title="删除"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                              <button className="p-2 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-100 transition-colors" title="更多">
                                <MoreVertical className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                    {datasets.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-12 text-center text-slate-500">
                          <Database className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                          <p>暂无自带数据集，点击右上角上传</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <>
              <div className="p-6 border-b border-slate-200 bg-slate-50/50">
                <h2 className="text-lg font-semibold text-slate-900 mb-1">系统内置权威科研数据库</h2>
                <p className="text-sm text-slate-500">支持通过对话框直接输入自然语言查询，系统将自动转化为 SQL 提取并扣除相应积分。</p>
              </div>
              <div className="overflow-x-auto min-h-[400px]">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                      <th className="p-4 font-medium">数据库名称</th>
                      <th className="p-4 font-medium">数据维度</th>
                      <th className="p-4 font-medium">数据量级</th>
                      <th className="p-4 font-medium text-right">基础查询消耗</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {BUILT_IN_DATASETS.map((ds) => (
                      <tr key={ds.id} className="hover:bg-amber-50/30 transition-colors group">
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                              <Library className="w-5 h-5" />
                            </div>
                            <span className="font-medium text-slate-700">{ds.name}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                            {ds.type}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-slate-500">约 {ds.rows} 行</td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleVarDictClick(ds)}
                              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-800 rounded-md text-sm font-medium shadow-sm transition-all"
                            >
                              <Info className="w-3.5 h-3.5" />
                              <span>变量说明</span>
                            </button>
                            <button
                              onClick={() => handleExtractClick(ds)}
                              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:border-blue-400 text-slate-700 hover:text-blue-600 rounded-md text-sm font-medium shadow-sm transition-all group-hover:bg-blue-50"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>提取分析</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="p-6 bg-blue-50/50 border-t border-blue-100 mt-auto">
                  <div className="flex items-start space-x-3">
                    <div className="mt-0.5">
                      <Zap className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-blue-900">如何使用内置数据？</h4>
                      <p className="text-sm text-blue-800/80 mt-1 leading-relaxed">
                        无需手动下载或清洗！在工作区对话框中直接告诉 AI 助手您的需求，例如：<br/>
                        <span className="inline-block mt-2 px-2 py-1 bg-white rounded border border-blue-200 font-mono text-xs">
                          "帮我提取 2018-2022 年所有上市公司的资产负债率和 ROA 数据，并做描述性统计"
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Simple Upload Modal Mock */}
      {isUploading && (
        <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md"
          >
            <h3 className="text-lg font-bold text-slate-900 mb-4">上传自带数据集</h3>
            <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 flex flex-col items-center justify-center text-slate-500 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 mb-3 text-slate-400" />
              <p className="text-sm font-medium text-slate-700">点击或拖拽文件到此处</p>
              <p className="text-xs mt-1">支持 CSV, Excel, SPSS (.sav)</p>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button 
                onClick={() => setIsUploading(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
              >
                取消
              </button>
              <button 
                onClick={() => setIsUploading(false)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
              >
                上传
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Built-in Data Extraction Modal */}
      {extractModalOpen && selectedDataset && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg border border-slate-100"
          >
            <div className="flex items-start justify-between mb-5">
              <div>
                <h3 className="text-xl font-bold text-slate-900 flex items-center">
                  <Database className="w-5 h-5 mr-2 text-blue-600" /> 数据提取配置
                </h3>
                <p className="text-sm text-slate-500 mt-1">{selectedDataset.name}</p>
              </div>
              <div className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded text-xs font-medium border border-slate-200">
                {selectedDataset.type}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">时间区间筛选</label>
                <div className="flex items-center space-x-3">
                  <input 
                    type="number" 
                    value={yearRange[0]} 
                    onChange={(e) => setYearRange([parseInt(e.target.value) || 2000, yearRange[1]])}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                  <span className="text-slate-400">至</span>
                  <input 
                    type="number" 
                    value={yearRange[1]} 
                    onChange={(e) => setYearRange([yearRange[0], parseInt(e.target.value) || 2023])}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <h4 className="text-sm font-semibold text-slate-800 mb-3 flex items-center">
                  <Info className="w-4 h-4 mr-1.5 text-blue-500" /> 预估消耗明细
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>基础维度费 ({selectedDataset.type})</span>
                    <span className="font-medium text-slate-800">{selectedDataset.points} 积分</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>数据量附加费 (约 {getEstimatedSize()} MB)</span>
                    <span className="font-medium text-slate-800">{Math.ceil(getEstimatedSize()) * POINTS_RATES.SIZE_RATE_PER_MB} 积分</span>
                  </div>
                  <div className="pt-3 mt-2 border-t border-slate-200 flex justify-between items-center">
                    <span className="font-bold text-slate-900">总计预估消耗</span>
                    <span className="text-lg font-bold text-amber-600 flex items-center">
                      <Zap className="w-4 h-4 mr-1 fill-amber-500" />
                      {getEstimatedPoints()} 积分
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end space-x-3">
              <button 
                onClick={() => setExtractModalOpen(false)}
                className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                取消
              </button>
              <button 
                onClick={handleConfirmExtraction}
                className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm hover:shadow transition-all flex items-center"
              >
                生成指令并发送至工作区 <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Variable Dictionary Modal */}
      {varDictModalOpen && selectedDataset && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl border border-slate-100 max-h-[80vh] flex flex-col"
          >
            <div className="flex items-start justify-between mb-5 shrink-0">
              <div>
                <h3 className="text-xl font-bold text-slate-900 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-indigo-600" /> 变量字典与说明文档
                </h3>
                <p className="text-sm text-slate-500 mt-1">{selectedDataset.name}</p>
              </div>
              <div className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded text-xs font-medium border border-indigo-100">
                包含 {selectedDataset.variables.length} 个指标
              </div>
            </div>

            <div className="overflow-y-auto flex-1 pr-2 space-y-3">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                  本数据集涵盖以下经过标准化清洗的核心变量，您可在对话工作区中直接引用以下指标名称或中文含义进行数据提取与实证分析。
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedDataset.variables.map((v, i) => {
                    const [en, cn] = v.split(' (');
                    return (
                      <div key={i} className="flex flex-col p-3 bg-white border border-slate-100 rounded-lg shadow-sm">
                        <span className="font-mono text-sm font-bold text-blue-700 mb-1">{en}</span>
                        <span className="text-sm text-slate-500">{cn ? cn.replace(')', '') : ''}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end shrink-0">
              <button 
                onClick={() => setVarDictModalOpen(false)}
                className="px-5 py-2.5 text-sm font-medium text-white bg-slate-800 hover:bg-slate-900 rounded-xl transition-colors shadow-sm"
              >
                关闭文档
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
