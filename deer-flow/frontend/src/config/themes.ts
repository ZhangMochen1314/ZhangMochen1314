export type ThemeKey = 'default' | 'tech' | 'forest' | 'sunset' | 'ocean' | 'midnight' | 'golden';

export interface ThemeConfig {
  name: string;
  bgClass: string;
  bgHex: string;
  trailRgba: string;
  textBase: string;
  textMuted: string;
  accent1: string;
  accent2: string;
  accent3: string;
  accent1From: string;
  accent1To: string;
  accent1Bg: string;
  accent2Bg: string;
  accent1Border: string;
  accent2Border: string;
  fontTitle: string;
  fontBody: string;
  particleColors: string[];
  lineRgbaPrefix: string;
  accent1Shadow: string;
  accent1HoverShadow: string;
}

export const THEMES: Record<ThemeKey, ThemeConfig> = {
  default: {
    name: 'Anthropic 深邃',
    bgClass: 'bg-[#141413]',
    bgHex: '#141413',
    trailRgba: 'rgba(20, 20, 19, 0.3)',
    textBase: 'text-[#faf9f5]',
    textMuted: 'text-[#b0aea5]',
    accent1: 'text-[#d97757]', // Orange
    accent2: 'text-[#6a9bcc]', // Blue
    accent3: 'text-[#788c5d]', // Green
    accent1From: 'from-[#d97757]',
    accent1To: 'to-[#e0896b]',
    accent1Bg: 'bg-[#d97757]',
    accent2Bg: 'bg-[#6a9bcc]',
    accent1Border: 'border-[#d97757]',
    accent2Border: 'border-[#6a9bcc]',
    fontTitle: "font-['Poppins']",
    fontBody: "font-['Lora']",
    particleColors: ['#d97757', '#6a9bcc', '#b0aea5'],
    lineRgbaPrefix: '176, 174, 165',
    accent1Shadow: 'shadow-[0_0_30px_rgba(217,119,87,0.4)]',
    accent1HoverShadow: 'hover:shadow-[0_0_40px_rgba(217,119,87,0.6)]'
  },
  tech: {
    name: 'Tech 赛博',
    bgClass: 'bg-[#0A0F1C]',
    bgHex: '#0A0F1C',
    trailRgba: 'rgba(10, 15, 28, 0.3)',
    textBase: 'text-[#F1F5F9]',
    textMuted: 'text-[#94A3B8]',
    accent1: 'text-[#06B6D4]', // Cyan
    accent2: 'text-[#3B82F6]', // Blue
    accent3: 'text-[#8B5CF6]', // Purple
    accent1From: 'from-[#06B6D4]',
    accent1To: 'to-[#3B82F6]',
    accent1Bg: 'bg-[#06B6D4]',
    accent2Bg: 'bg-[#3B82F6]',
    accent1Border: 'border-[#06B6D4]',
    accent2Border: 'border-[#3B82F6]',
    fontTitle: "font-sans",
    fontBody: "font-mono",
    particleColors: ['#06B6D4', '#3B82F6', '#8B5CF6'],
    lineRgbaPrefix: '59, 130, 246',
    accent1Shadow: 'shadow-[0_0_30px_rgba(6,182,212,0.4)]',
    accent1HoverShadow: 'hover:shadow-[0_0_40px_rgba(6,182,212,0.6)]'
  },
  forest: {
    name: 'Forest 学术',
    bgClass: 'bg-[#0A110C]',
    bgHex: '#0A110C',
    trailRgba: 'rgba(10, 17, 12, 0.3)',
    textBase: 'text-[#F0FDF4]',
    textMuted: 'text-[#9CA3AF]',
    accent1: 'text-[#10B981]', // Emerald
    accent2: 'text-[#14B8A6]', // Teal
    accent3: 'text-[#84CC16]', // Lime
    accent1From: 'from-[#10B981]',
    accent1To: 'to-[#14B8A6]',
    accent1Bg: 'bg-[#10B981]',
    accent2Bg: 'bg-[#14B8A6]',
    accent1Border: 'border-[#10B981]',
    accent2Border: 'border-[#14B8A6]',
    fontTitle: "font-serif", 
    fontBody: "font-serif",
    particleColors: ['#10B981', '#14B8A6', '#84CC16'],
    lineRgbaPrefix: '16, 185, 129',
    accent1Shadow: 'shadow-[0_0_30px_rgba(16,185,129,0.4)]',
    accent1HoverShadow: 'hover:shadow-[0_0_40px_rgba(16,185,129,0.6)]'
  },
  sunset: {
    name: 'Sunset 活力',
    bgClass: 'bg-[#170A0B]',
    bgHex: '#170A0B',
    trailRgba: 'rgba(23, 10, 11, 0.3)',
    textBase: 'text-[#FFF1F2]',
    textMuted: 'text-[#FDA4AF]',
    accent1: 'text-[#F97316]', // Orange
    accent2: 'text-[#E11D48]', // Rose
    accent3: 'text-[#D946EF]', // Fuchsia
    accent1From: 'from-[#F97316]',
    accent1To: 'to-[#E11D48]',
    accent1Bg: 'bg-[#F97316]',
    accent2Bg: 'bg-[#E11D48]',
    accent1Border: 'border-[#F97316]',
    accent2Border: 'border-[#E11D48]',
    fontTitle: "font-sans",
    fontBody: "font-sans",
    particleColors: ['#F97316', '#E11D48', '#D946EF'],
    lineRgbaPrefix: '249, 115, 22',
    accent1Shadow: 'shadow-[0_0_30px_rgba(249,115,22,0.4)]',
    accent1HoverShadow: 'hover:shadow-[0_0_40px_rgba(249,115,22,0.6)]'
  },
  ocean: {
    name: 'Ocean 深海',
    bgClass: 'bg-[#041E2F]',
    bgHex: '#041E2F',
    trailRgba: 'rgba(4, 30, 47, 0.3)',
    textBase: 'text-[#E0F2FE]',
    textMuted: 'text-[#7DD3FC]',
    accent1: 'text-[#38BDF8]', // Light Blue
    accent2: 'text-[#818CF8]', // Indigo
    accent3: 'text-[#2DD4BF]', // Teal
    accent1From: 'from-[#38BDF8]',
    accent1To: 'to-[#818CF8]',
    accent1Bg: 'bg-[#38BDF8]',
    accent2Bg: 'bg-[#818CF8]',
    accent1Border: 'border-[#38BDF8]',
    accent2Border: 'border-[#818CF8]',
    fontTitle: "font-serif",
    fontBody: "font-sans",
    particleColors: ['#38BDF8', '#818CF8', '#2DD4BF'],
    lineRgbaPrefix: '56, 189, 248',
    accent1Shadow: 'shadow-[0_0_30px_rgba(56,189,248,0.4)]',
    accent1HoverShadow: 'hover:shadow-[0_0_40px_rgba(56,189,248,0.6)]'
  },
  midnight: {
    name: 'Midnight 星系',
    bgClass: 'bg-[#090514]',
    bgHex: '#090514',
    trailRgba: 'rgba(9, 5, 20, 0.3)',
    textBase: 'text-[#F5F3FF]',
    textMuted: 'text-[#A78BFA]',
    accent1: 'text-[#C084FC]', // Purple
    accent2: 'text-[#F472B6]', // Pink
    accent3: 'text-[#60A5FA]', // Blue
    accent1From: 'from-[#C084FC]',
    accent1To: 'to-[#F472B6]',
    accent1Bg: 'bg-[#C084FC]',
    accent2Bg: 'bg-[#F472B6]',
    accent1Border: 'border-[#C084FC]',
    accent2Border: 'border-[#F472B6]',
    fontTitle: "font-mono",
    fontBody: "font-sans",
    particleColors: ['#C084FC', '#F472B6', '#60A5FA'],
    lineRgbaPrefix: '192, 132, 252',
    accent1Shadow: 'shadow-[0_0_30px_rgba(192,132,252,0.4)]',
    accent1HoverShadow: 'hover:shadow-[0_0_40px_rgba(192,132,252,0.6)]'
  },
  golden: {
    name: 'Golden 鎏金',
    bgClass: 'bg-[#1C160C]',
    bgHex: '#1C160C',
    trailRgba: 'rgba(28, 22, 12, 0.3)',
    textBase: 'text-[#FEF3C7]',
    textMuted: 'text-[#D97757]',
    accent1: 'text-[#FBBF24]', // Amber
    accent2: 'text-[#F59E0B]', // Yellow
    accent3: 'text-[#D97757]', // Orange
    accent1From: 'from-[#FBBF24]',
    accent1To: 'to-[#F59E0B]',
    accent1Bg: 'bg-[#FBBF24]',
    accent2Bg: 'bg-[#F59E0B]',
    accent1Border: 'border-[#FBBF24]',
    accent2Border: 'border-[#F59E0B]',
    fontTitle: "font-serif",
    fontBody: "font-serif",
    particleColors: ['#FBBF24', '#F59E0B', '#D97757'],
    lineRgbaPrefix: '251, 191, 36',
    accent1Shadow: 'shadow-[0_0_30px_rgba(251,191,36,0.4)]',
    accent1HoverShadow: 'hover:shadow-[0_0_40px_rgba(251,191,36,0.6)]'
  }
};
