export interface Theme {
  name: string;
  colors: {
    bg: string;
    text: string;
    border: string;
    muted: string;
    accent1: string;
    accent2: string;
    accent3: string;
    darkHover: string;
    cardDark: string;
    accent1Hover: string;
    accent2Hover: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
}

export const themes: Record<string, Theme> = {
  default: {
    name: "Anthropic Default",
    colors: {
      bg: "#faf9f5",
      text: "#141413",
      border: "#e8e6dc",
      muted: "#b0aea5",
      accent1: "#d97757",
      accent2: "#6a9bcc",
      accent3: "#788c5d",
      darkHover: "#1a1a19",
      cardDark: "#2a2a29",
      accent1Hover: "#c4684a",
      accent2Hover: "#5885b5",
    },
    fonts: {
      heading: "'Poppins', Arial, sans-serif",
      body: "'Lora', Georgia, serif",
    }
  },
  oceanDepths: {
    name: "Ocean Depths",
    colors: {
      bg: "#f1faee",
      text: "#1a2332",
      border: "#a8dadc",
      muted: "#457b9d",
      accent1: "#2d8b8b",
      accent2: "#a8dadc",
      accent3: "#1d3557",
      darkHover: "#232e42",
      cardDark: "#1a2332",
      accent1Hover: "#226a6a",
      accent2Hover: "#8ab4b6",
    },
    fonts: {
      heading: "Arial, sans-serif",
      body: "Georgia, serif",
    }
  },
  sunsetBoulevard: {
    name: "Sunset Boulevard",
    colors: {
      bg: "#fff8f0",
      text: "#264653",
      border: "#e9c46a",
      muted: "#9b7f57",
      accent1: "#e76f51",
      accent2: "#f4a261",
      accent3: "#e9c46a",
      darkHover: "#31596a",
      cardDark: "#264653",
      accent1Hover: "#cf5e43",
      accent2Hover: "#d98e54",
    },
    fonts: {
      heading: "Georgia, serif",
      body: "Arial, sans-serif",
    }
  },
  forestCanopy: {
    name: "Forest Canopy",
    colors: {
      bg: "#faf9f6",
      text: "#2d4a2b",
      border: "#e2e8e2",
      muted: "#7d8471",
      accent1: "#2d4a2b",
      accent2: "#7d8471",
      accent3: "#a4ac86",
      darkHover: "#395d36",
      cardDark: "#1e331c",
      accent1Hover: "#1f331d",
      accent2Hover: "#64695a",
    },
    fonts: {
      heading: "Georgia, serif",
      body: "Arial, sans-serif",
    }
  },
  modernMinimalist: {
    name: "Modern Minimalist",
    colors: {
      bg: "#ffffff",
      text: "#111111",
      border: "#eeeeee",
      muted: "#888888",
      accent1: "#36454f",
      accent2: "#708090",
      accent3: "#d3d3d3",
      darkHover: "#222222",
      cardDark: "#1a1a1a",
      accent1Hover: "#28333b",
      accent2Hover: "#5b6875",
    },
    fonts: {
      heading: "Arial, sans-serif",
      body: "Arial, sans-serif",
    }
  },
  goldenHour: {
    name: "Golden Hour",
    colors: {
      bg: "#fffaf0",
      text: "#4a403a",
      border: "#fcecd4",
      muted: "#d4b896",
      accent1: "#f4a900",
      accent2: "#c1666b",
      accent3: "#d4b896",
      darkHover: "#5c5049",
      cardDark: "#38312d",
      accent1Hover: "#d99600",
      accent2Hover: "#a6565a",
    },
    fonts: {
      heading: "Arial, sans-serif",
      body: "Arial, sans-serif",
    }
  },
  arcticFrost: {
    name: "Arctic Frost",
    colors: {
      bg: "#fafafa",
      text: "#1a2a3a",
      border: "#e2e8f0",
      muted: "#a0aec0",
      accent1: "#4a6fa5",
      accent2: "#d4e4f7",
      accent3: "#c0c0c0",
      darkHover: "#243a52",
      cardDark: "#14202c",
      accent1Hover: "#385682",
      accent2Hover: "#b6c5d6",
    },
    fonts: {
      heading: "Arial, sans-serif",
      body: "Arial, sans-serif",
    }
  },
  desertRose: {
    name: "Desert Rose",
    colors: {
      bg: "#fff5f5",
      text: "#5d2e46",
      border: "#f7e4e4",
      muted: "#c6a8a8",
      accent1: "#d4a5a5",
      accent2: "#b87d6d",
      accent3: "#e8d5c4",
      darkHover: "#733956",
      cardDark: "#4a2438",
      accent1Hover: "#bc9090",
      accent2Hover: "#9c685a",
    },
    fonts: {
      heading: "Georgia, serif",
      body: "Arial, sans-serif",
    }
  },
  techInnovation: {
    name: "Tech Innovation",
    colors: {
      bg: "#f8fafc",
      text: "#0f172a",
      border: "#e2e8f0",
      muted: "#64748b",
      accent1: "#0066ff",
      accent2: "#00ffff",
      accent3: "#3b82f6",
      darkHover: "#1e293b",
      cardDark: "#020617",
      accent1Hover: "#0052cc",
      accent2Hover: "#00cccc",
    },
    fonts: {
      heading: "Arial, sans-serif",
      body: "Arial, sans-serif",
    }
  },
  botanicalGarden: {
    name: "Botanical Garden",
    colors: {
      bg: "#f5f3ed",
      text: "#2a3b2c",
      border: "#d1e6d9",
      muted: "#7a9c8b",
      accent1: "#4a7c59",
      accent2: "#f9a620",
      accent3: "#b7472a",
      darkHover: "#364d39",
      cardDark: "#1f2b20",
      accent1Hover: "#385e43",
      accent2Hover: "#d98f1a",
    },
    fonts: {
      heading: "Georgia, serif",
      body: "Arial, sans-serif",
    }
  },
  midnightGalaxy: {
    name: "Midnight Galaxy",
    colors: {
      bg: "#f4f4f8",
      text: "#2b1e3e",
      border: "#d7d7e2",
      muted: "#7b7b9e",
      accent1: "#4a4e8f",
      accent2: "#a490c2",
      accent3: "#6B46C1",
      darkHover: "#3a2853",
      cardDark: "#1d1429",
      accent1Hover: "#383b6e",
      accent2Hover: "#8b78a6",
    },
    fonts: {
      heading: "Arial, sans-serif",
      body: "Arial, sans-serif",
    }
  }
};

export const applyTheme = (themeKey: string) => {
  const theme = themes[themeKey] || themes.default;
  const root = document.documentElement;
  
  root.style.setProperty('--theme-light', theme.colors.bg);
  root.style.setProperty('--theme-dark', theme.colors.text);
  root.style.setProperty('--theme-border', theme.colors.border);
  root.style.setProperty('--theme-muted', theme.colors.muted);
  root.style.setProperty('--theme-accent1', theme.colors.accent1);
  root.style.setProperty('--theme-accent2', theme.colors.accent2);
  root.style.setProperty('--theme-accent3', theme.colors.accent3);
  root.style.setProperty('--theme-dark-hover', theme.colors.darkHover);
  root.style.setProperty('--theme-card-dark', theme.colors.cardDark);
  root.style.setProperty('--theme-accent1-hover', theme.colors.accent1Hover);
  root.style.setProperty('--theme-accent2-hover', theme.colors.accent2Hover);
  
  root.style.setProperty('--font-heading', theme.fonts.heading);
  root.style.setProperty('--font-body', theme.fonts.body);
};
