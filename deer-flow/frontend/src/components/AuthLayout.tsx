import React, { useState } from 'react';
import GenerativeBackground from './GenerativeBackground';
import { BrainCircuit, Palette, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { THEMES, ThemeKey } from '@/config/themes';

export default function AuthLayout({ children, title, subtitle }: { children: React.ReactNode, title: string, subtitle: string }) {
  const [theme, setTheme] = useState<ThemeKey>('default');
  const t = THEMES[theme];

  return (
    <div className={`flex min-h-screen ${t.bgClass} ${t.textBase} ${t.fontBody} selection:${t.accent1Bg} selection:text-white transition-colors duration-700`}>
      
      {/* Theme Switcher Widget */}
      <div className="fixed right-4 top-4 z-[100] flex flex-row gap-2 p-2 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl">
        <div className="flex items-center justify-center pl-2 pr-1 text-white/50"><Palette className="w-4 h-4" /></div>
        {Object.entries(THEMES).map(([k, v]) => (
          <button
            key={k}
            onClick={() => setTheme(k as ThemeKey)}
            className={`group relative w-8 h-8 rounded-full border-2 transition-all overflow-hidden ${theme === k ? 'border-white scale-110' : 'border-transparent hover:border-white/50 hover:scale-105'}`}
            title={v.name}
          >
            <div className={`absolute inset-0 ${v.bgClass}`}></div>
            <div className={`absolute top-0 right-0 w-full h-1/2 bg-gradient-to-br ${v.accent1From} ${v.accent1To} opacity-80`}></div>
            <div className={`absolute bottom-0 left-0 w-1/2 h-full ${v.accent2Bg} opacity-80 blur-sm`}></div>
          </button>
        ))}
      </div>

      {/* Left Pane - Art */}
      <div className={`relative hidden lg:flex lg:w-1/2 overflow-hidden ${t.bgClass}`}>
        <GenerativeBackground 
          bgHex={t.bgHex}
          colors={t.particleColors}
          trailRgba={t.trailRgba}
          lineRgbaPrefix={t.lineRgbaPrefix}
        />
        <div className={`absolute inset-0 bg-gradient-to-r from-${t.bgClass}/40 to-${t.bgClass}/90`} style={{ background: `linear-gradient(to right, ${t.bgHex}66, ${t.bgHex}E6)` }}></div>
        
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link to="/" className="flex items-center space-x-3 w-fit group">
            <div className={`p-2 ${t.accent1Bg}/10 rounded-xl backdrop-blur-sm border ${t.accent1Border}/20 group-hover:${t.accent1Bg}/20 transition-colors`}>
              <BrainCircuit className={`w-6 h-6 ${t.accent1}`} />
            </div>
            <div className="flex flex-col">
              <span className={`${t.fontTitle} font-bold text-xl tracking-wide text-white leading-tight`}>
                DeepRes<span className={t.accent1}>Value</span>
              </span>
              <span className={`text-xs ${t.textMuted} ${t.fontBody} tracking-wider`}>深度研值</span>
            </div>
          </Link>

          <div className="max-w-md">
            <motion.div 
              key={theme} // Re-animate when theme changes
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className={`${t.fontTitle} text-4xl font-bold mb-6 leading-tight`}>
                解构复杂数据，<br />
                <span className={`text-transparent bg-clip-text bg-gradient-to-r ${t.accent1From} ${t.accent2 ? `to-[${t.accent2.replace('text-[', '').replace(']', '')}]` : t.accent1To}`}>发现涌现价值</span>
              </h2>
              <p className={`${t.textMuted} text-lg leading-relaxed`}>
                欢迎来到科研与数据分析的新范式。请在右侧进行身份验证，继续您的深度探索。
              </p>
            </motion.div>
          </div>
          
          <div className={`${t.textMuted}/50 text-sm ${t.fontTitle}`}>
            © {new Date().getFullYear()} DeepResValue Inc.
          </div>
        </div>
      </div>

      {/* Right Pane - Form */}
      <div className="flex flex-col justify-center w-full lg:w-1/2 p-8 sm:p-12 md:p-24 relative">
        <Link to="/" className="lg:hidden absolute top-8 left-8 flex items-center space-x-3">
          <BrainCircuit className={`w-6 h-6 ${t.accent1}`} />
          <div className="flex flex-col">
            <span className={`${t.fontTitle} font-bold text-xl tracking-wide text-white leading-tight`}>
              DeepRes<span className={t.accent1}>Value</span>
            </span>
            <span className={`text-xs ${t.textMuted} ${t.fontBody} tracking-wider`}>深度研值</span>
          </div>
        </Link>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md mx-auto"
        >
          <Link to="/" className={`inline-flex items-center mb-8 text-sm ${t.textMuted} hover:text-white transition-colors group`}>
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            返回落地页
          </Link>
          <div className="mb-10">
            <h1 className={`${t.fontTitle} text-3xl font-bold mb-3`}>{title}</h1>
            <p className={t.textMuted}>{subtitle}</p>
          </div>
          {/* Inject theme context into children via a wrapper if needed, but since children are rendered here, they need to read the theme themselves if they use dynamic classes, or we pass t as a prop. Let's pass t via Context or cloneElement. Using Context is better. */}
          {/* For simplicity without creating a new Context file, we will just pass t to children using React.cloneElement */}
          {React.Children.map(children, child => {
            if (React.isValidElement(child)) {
              // @ts-ignore
              return React.cloneElement(child, { themeConfig: t });
            }
            return child;
          })}
        </motion.div>
      </div>
    </div>
  );
}