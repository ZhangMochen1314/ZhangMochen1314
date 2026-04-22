import { Link } from "react-router-dom";
import { ArrowLeft, Database, Upload, FileText, MoreVertical, Trash2 } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Datasets() {
  const { datasets, removeDataset } = useStore();
  const [isUploading, setIsUploading] = useState(false);

  return (
    <div className="text-slate-900 font-sans selection:bg-blue-200">
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/chat" className="text-slate-500 hover:text-slate-900 transition-colors p-2 -ml-2 rounded-full hover:bg-slate-100">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-blue-600" />
            <span className="text-lg font-bold tracking-tight text-slate-900">数据集管理</span>
          </div>
        </div>
        <div>
          <button 
            onClick={() => setIsUploading(true)}
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Upload className="w-4 h-4 mr-2" /> 上传数据集
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
            <h2 className="text-lg font-semibold text-slate-900">我的数据文件</h2>
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
                      <p>暂无数据集，点击右上角上传</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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
            <h3 className="text-lg font-bold text-slate-900 mb-4">上传数据集</h3>
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
    </div>
  );
}
