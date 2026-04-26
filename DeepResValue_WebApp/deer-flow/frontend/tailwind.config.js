/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        serif: ['"Noto Serif SC"', '"Source Han Serif SC"', '"SimSun"', '"Times New Roman"', 'Georgia', 'serif'],
        heading: ['var(--font-heading)', 'sans-serif'],
        body: ['var(--font-body)', 'serif'],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: "var(--card)",
        "card-foreground": "var(--card-foreground)",
        popover: "var(--popover)",
        "popover-foreground": "var(--popover-foreground)",
        primary: "var(--primary)",
        "primary-foreground": "var(--primary-foreground)",
        secondary: "var(--secondary)",
        "secondary-foreground": "var(--secondary-foreground)",
        muted: "var(--muted)",
        "muted-foreground": "var(--muted-foreground)",
        accent: "var(--accent)",
        "accent-foreground": "var(--accent-foreground)",
        destructive: "var(--destructive)",
        "destructive-foreground": "var(--destructive-foreground)",
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
      },
      typography: {
        academic: {
          css: {
            fontFamily: '"Noto Serif SC", "Source Han Serif SC", "SimSun", "Times New Roman", Georgia, serif',
            color: '#1e293b',
            lineHeight: '1.8',
            textAlign: 'justify',
            p: {
              marginTop: '1.25em',
              marginBottom: '1.25em',
              textIndent: '2em', // 像学术论文一样的首行缩进
            },
            h1: {
              fontFamily: '"Noto Serif SC", "Source Han Serif SC", "SimSun", "Times New Roman", Georgia, serif',
              color: '#0f172a',
              fontWeight: '700',
              textAlign: 'center',
            },
            h2: {
              fontFamily: 'Inter, system-ui, sans-serif',
              color: '#1d4ed8',
              fontWeight: '600',
              marginTop: '2em',
              marginBottom: '1em',
              borderBottom: '1px solid #e2e8f0',
              paddingBottom: '0.3em',
            },
            h3: {
              fontFamily: 'Inter, system-ui, sans-serif',
              color: '#1e293b',
              fontWeight: '600',
            },
            img: {
              borderRadius: '0.5rem',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
              margin: '2rem auto',
              display: 'block',
              maxWidth: '100%',
            },
            blockquote: {
              fontStyle: 'italic',
              color: '#475569',
              borderLeftColor: '#3b82f6',
              borderLeftWidth: '4px',
              backgroundColor: '#f8fafc',
              padding: '1rem 1.5rem',
              borderRadius: '0 0.5rem 0.5rem 0',
              p: {
                textIndent: '0',
                marginTop: '0',
                marginBottom: '0',
              }
            },
            table: {
              width: '100%',
              marginTop: '2em',
              marginBottom: '2em',
              borderCollapse: 'collapse',
              fontSize: '0.875rem',
            },
            th: {
              borderBottom: '2px solid #cbd5e1',
              borderTop: '2px solid #cbd5e1',
              padding: '0.75rem',
              textAlign: 'center',
              fontWeight: '600',
              color: '#1e293b',
            },
            td: {
              borderBottom: '1px solid #e2e8f0',
              padding: '0.75rem',
              textAlign: 'center',
            },
            pre: {
              backgroundColor: '#1e293b',
              color: '#f8fafc',
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
              fontSize: '0.875em',
              lineHeight: '1.7142857',
              marginTop: '1.7142857em',
              marginBottom: '1.7142857em',
              borderRadius: '0.5rem',
              padding: '1.1428571em',
              overflowX: 'auto',
            },
            code: {
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            }
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
