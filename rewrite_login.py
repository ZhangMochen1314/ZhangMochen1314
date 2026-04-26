import re

with open('/workspace/deer-flow/frontend/src/pages/Login.tsx', 'r') as f:
    content = f.read()

# Make Login accept themeConfig
content = content.replace("export const Login: React.FC = () => {", "import { ThemeConfig } from '@/config/themes';\n\nexport const Login: React.FC<{ themeConfig?: ThemeConfig }> = ({ themeConfig }) => {")

# Mock theme if not provided
content = content.replace("const [isLoading, setIsLoading] = useState(false);", """const [isLoading, setIsLoading] = useState(false);
  const t = themeConfig || {
    bgClass: 'bg-[#141413]',
    bgHex: '#141413',
    trailRgba: 'rgba(20, 20, 19, 0.3)',
    textBase: 'text-[#faf9f5]',
    textMuted: 'text-[#b0aea5]',
    accent1: 'text-[#d97757]', 
    accent2: 'text-[#6a9bcc]', 
    accent3: 'text-[#788c5d]', 
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
  };""")

# Replace classes
content = content.replace("className=\"space-y-6 font-['Poppins']\"", "className={`space-y-6 ${t.fontTitle}`}")
content = content.replace("text-[#e8e6dc]", "${t.textBase}")
content = content.replace("bg-[#141413]", "${t.bgClass}")
content = content.replace("border-[#b0aea5]/30", "${t.textMuted.replace('text-', 'border-')}/30")
content = content.replace("focus:ring-[#d97757]/50", "focus:ring-${t.accent1.replace('text-', '')}/50")
content = content.replace("focus:border-[#d97757]", "focus:${t.accent1Border}")
content = content.replace("text-white placeholder:text-[#b0aea5]/40", "${t.textBase} placeholder:${t.textMuted}/40")

content = content.replace("from-[#d97757]", "${t.accent1From}")
content = content.replace("to-[#e0896b]", "${t.accent1To}")
content = content.replace("hover:from-[#e0896b]", "hover:${t.accent1From}")
content = content.replace("hover:to-[#e89c82]", "hover:${t.accent1To}")
content = content.replace("text-[#141413]", "text-black")
content = content.replace("shadow-[0_0_20px_rgba(217,119,87,0.2)]", "${t.accent1Shadow}")
content = content.replace("hover:shadow-[0_0_30px_rgba(217,119,87,0.4)]", "${t.accent1HoverShadow}")

content = content.replace("text-[#b0aea5]", "${t.textMuted}")
content = content.replace("text-[#d97757]", "${t.accent1}")
content = content.replace("decoration-[#d97757]/30", "decoration-${t.accent1.replace('text-', '')}/30")

def className_replacer(match):
    classes = match.group(1)
    if '${' in classes:
        return f"className={{`{classes}`}}"
    return match.group(0)

content = re.sub(r'className="([^"]+)"', className_replacer, content)

with open('/workspace/deer-flow/frontend/src/pages/Login.tsx', 'w') as f:
    f.write(content)

# Same for Register.tsx
with open('/workspace/deer-flow/frontend/src/pages/Register.tsx', 'r') as f:
    content = f.read()

content = content.replace("export const Register: React.FC = () => {", "import { ThemeConfig } from '@/config/themes';\n\nexport const Register: React.FC<{ themeConfig?: ThemeConfig }> = ({ themeConfig }) => {")

content = content.replace("const [isLoading, setIsLoading] = useState(false);", """const [isLoading, setIsLoading] = useState(false);
  const t = themeConfig || {
    bgClass: 'bg-[#141413]',
    bgHex: '#141413',
    trailRgba: 'rgba(20, 20, 19, 0.3)',
    textBase: 'text-[#faf9f5]',
    textMuted: 'text-[#b0aea5]',
    accent1: 'text-[#d97757]', 
    accent2: 'text-[#6a9bcc]', 
    accent3: 'text-[#788c5d]', 
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
  };""")

content = content.replace("className=\"space-y-5 font-['Poppins']\"", "className={`space-y-5 ${t.fontTitle}`}")
content = content.replace("text-[#e8e6dc]", "${t.textBase}")
content = content.replace("bg-[#141413]", "${t.bgClass}")
content = content.replace("border-[#b0aea5]/30", "${t.textMuted.replace('text-', 'border-')}/30")
content = content.replace("focus:ring-[#d97757]/50", "focus:ring-${t.accent1.replace('text-', '')}/50")
content = content.replace("focus:border-[#d97757]", "focus:${t.accent1Border}")
content = content.replace("text-white placeholder:text-[#b0aea5]/40", "${t.textBase} placeholder:${t.textMuted}/40")

content = content.replace("bg-[#d97757]/10", "${t.accent1Bg}/10")
content = content.replace("border-[#d97757]/30", "${t.accent1Border}/30")
content = content.replace("text-[#d97757] placeholder:text-[#d97757]/40", "${t.accent1} placeholder:${t.accent1}/40")

content = content.replace("from-[#6a9bcc]", "${t.accent2Bg.replace('bg-', 'from-')}")
content = content.replace("to-[#80addb]", "${t.accent2Bg.replace('bg-', 'to-')}")
content = content.replace("hover:from-[#80addb]", "hover:${t.accent2Bg.replace('bg-', 'from-')}")
content = content.replace("hover:to-[#92bc4]", "hover:${t.accent2Bg.replace('bg-', 'to-')}")
content = content.replace("text-[#141413]", "text-white")
content = content.replace("shadow-[0_0_20px_rgba(106,155,204,0.2)]", "shadow-lg")
content = content.replace("hover:shadow-[0_0_30px_rgba(106,155,204,0.4)]", "hover:shadow-xl")

content = content.replace("text-[#b0aea5]", "${t.textMuted}")
content = content.replace("text-[#6a9bcc]", "${t.accent2}")
content = content.replace("decoration-[#6a9bcc]/30", "decoration-${t.accent2.replace('text-', '')}/30")

content = re.sub(r'className="([^"]+)"', className_replacer, content)

with open('/workspace/deer-flow/frontend/src/pages/Register.tsx', 'w') as f:
    f.write(content)
