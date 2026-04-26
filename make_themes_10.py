import json

themes = {
    'ocean': {
        'name': 'Ocean Depths',
        'bgHex': '#1a2332',
        'textBaseHex': '#f1faee',
        'textMutedHex': '#a8dadc',
        'accent1Hex': '#2d8b8b',
        'accent2Hex': '#a8dadc',
        'accent3Hex': '#f1faee',
        'fontTitle': "font-['Montserrat',sans-serif]",
        'fontBody': "font-['Inter',sans-serif]"
    },
    'sunset': {
        'name': 'Sunset Blvd',
        'bgHex': '#264653',
        'textBaseHex': '#e9c46a',
        'textMutedHex': '#f4a261',
        'accent1Hex': '#e76f51',
        'accent2Hex': '#f4a261',
        'accent3Hex': '#e9c46a',
        'fontTitle': "font-['Playfair_Display',serif]",
        'fontBody': "font-['Inter',sans-serif]"
    },
    'forest': {
        'name': 'Forest Canopy',
        'bgHex': '#2d4a2b',
        'textBaseHex': '#faf9f6',
        'textMutedHex': '#a4ac86',
        'accent1Hex': '#a4ac86',
        'accent2Hex': '#7d8471',
        'accent3Hex': '#faf9f6',
        'fontTitle': "font-['Playfair_Display',serif]",
        'fontBody': "font-['Lora',serif]"
    },
    'minimalist': {
        'name': 'Modern Minimalist',
        'bgHex': '#ffffff',
        'textBaseHex': '#36454f',
        'textMutedHex': '#708090',
        'accent1Hex': '#708090',
        'accent2Hex': '#d3d3d3',
        'accent3Hex': '#36454f',
        'fontTitle': "font-['Space_Grotesk',sans-serif]",
        'fontBody': "font-['Inter',sans-serif]"
    },
    'golden': {
        'name': 'Golden Hour',
        'bgHex': '#4a403a',
        'textBaseHex': '#d4b896',
        'textMutedHex': '#c1666b',
        'accent1Hex': '#f4a900',
        'accent2Hex': '#c1666b',
        'accent3Hex': '#d4b896',
        'fontTitle': "font-['Poppins',sans-serif]",
        'fontBody': "font-['Lora',serif]"
    },
    'arctic': {
        'name': 'Arctic Frost',
        'bgHex': '#fafafa',
        'textBaseHex': '#4a6fa5',
        'textMutedHex': '#c0c0c0',
        'accent1Hex': '#4a6fa5',
        'accent2Hex': '#d4e4f7',
        'accent3Hex': '#c0c0c0',
        'fontTitle': "font-['Montserrat',sans-serif]",
        'fontBody': "font-['Inter',sans-serif]"
    },
    'desert': {
        'name': 'Desert Rose',
        'bgHex': '#e8d5c4',
        'textBaseHex': '#5d2e46',
        'textMutedHex': '#b87d6d',
        'accent1Hex': '#d4a5a5',
        'accent2Hex': '#b87d6d',
        'accent3Hex': '#5d2e46',
        'fontTitle': "font-['Cormorant_Garamond',serif]",
        'fontBody': "font-['Lora',serif]"
    },
    'tech': {
        'name': 'Tech Innovation',
        'bgHex': '#1e1e1e',
        'textBaseHex': '#ffffff',
        'textMutedHex': '#00ffff',
        'accent1Hex': '#0066ff',
        'accent2Hex': '#00ffff',
        'accent3Hex': '#ffffff',
        'fontTitle': "font-['Space_Grotesk',sans-serif]",
        'fontBody': "font-['Inter',sans-serif]"
    },
    'botanical': {
        'name': 'Botanical Garden',
        'bgHex': '#f5f3ed',
        'textBaseHex': '#4a7c59',
        'textMutedHex': '#b7472a',
        'accent1Hex': '#f9a620',
        'accent2Hex': '#4a7c59',
        'accent3Hex': '#b7472a',
        'fontTitle': "font-['Playfair_Display',serif]",
        'fontBody': "font-['Lora',serif]"
    },
    'midnight': {
        'name': 'Midnight Galaxy',
        'bgHex': '#2b1e3e',
        'textBaseHex': '#e6e6fa',
        'textMutedHex': '#a490c2',
        'accent1Hex': '#4a4e8f',
        'accent2Hex': '#a490c2',
        'accent3Hex': '#e6e6fa',
        'fontTitle': "font-['Cinzel',serif]",
        'fontBody': "font-['Inter',sans-serif]"
    }
}

def hex_to_rgb(hex_color):
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

theme_keys = list(themes.keys())
out = f"export type ThemeKey = '{'\' | \''.join(theme_keys)}';\n\n"

out += """export interface ThemeConfig {
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
  _safelist?: string;
}

export const THEMES: Record<ThemeKey, ThemeConfig> = {\n"""

for k, v in themes.items():
    bg_rgb = hex_to_rgb(v['bgHex'])
    a1_rgb = hex_to_rgb(v['accent1Hex'])
    out += f"  {k}: {{\n"
    out += f"    name: '{v['name']}',\n"
    out += f"    bgClass: 'bg-[{v['bgHex']}]',\n"
    out += f"    bgHex: '{v['bgHex']}',\n"
    out += f"    trailRgba: 'rgba({bg_rgb[0]}, {bg_rgb[1]}, {bg_rgb[2]}, 0.3)',\n"
    out += f"    textBase: 'text-[{v['textBaseHex']}]',\n"
    out += f"    textMuted: 'text-[{v['textMutedHex']}]',\n"
    out += f"    accent1: 'text-[{v['accent1Hex']}]',\n"
    out += f"    accent2: 'text-[{v['accent2Hex']}]',\n"
    out += f"    accent3: 'text-[{v['accent3Hex']}]',\n"
    out += f"    accent1From: 'from-[{v['accent1Hex']}]',\n"
    out += f"    accent1To: 'to-[{v['accent2Hex']}]',\n"
    out += f"    accent1Bg: 'bg-[{v['accent1Hex']}]',\n"
    out += f"    accent2Bg: 'bg-[{v['accent2Hex']}]',\n"
    out += f"    accent1Border: 'border-[{v['accent1Hex']}]',\n"
    out += f"    accent2Border: 'border-[{v['accent2Hex']}]',\n"
    out += f"    fontTitle: \"{v['fontTitle']}\",\n"
    out += f"    fontBody: \"{v['fontBody']}\",\n"
    out += f"    particleColors: ['{v['accent1Hex']}', '{v['accent2Hex']}', '{v['accent3Hex']}'],\n"
    out += f"    lineRgbaPrefix: '{a1_rgb[0]}, {a1_rgb[1]}, {a1_rgb[2]}',\n"
    out += f"    accent1Shadow: 'shadow-[0_0_30px_rgba({a1_rgb[0]},{a1_rgb[1]},{a1_rgb[2]},0.4)]',\n"
    out += f"    accent1HoverShadow: 'hover:shadow-[0_0_40px_rgba({a1_rgb[0]},{a1_rgb[1]},{a1_rgb[2]},0.6)]',\n"
    out += f"    _safelist: 'border-[{v['textMutedHex']}] ring-[{v['accent1Hex']}] focus:ring-[{v['accent1Hex']}] decoration-[{v['accent1Hex']}] border-[{v['accent1Hex']}] text-[{v['accent1Hex']}] focus:ring-[{v['accent1Hex']}] from-[{v['accent2Hex']}] to-[{v['accent2Hex']}] decoration-[{v['accent2Hex']}]'\n"
    out += "  },\n"

out = out.rstrip(',\n') + "\n};\n"

with open('/workspace/deer-flow/frontend/src/config/themes.ts', 'w') as f:
    f.write(out)
