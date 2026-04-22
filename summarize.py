import sys
import os

files = [
    ".trae/documents/DeepResValue.md",
    ".trae/documents/prd.md",
    ".trae/documents/technical_architecture.md",
    ".trae/specs/build-commercial-web-app/checklist.md",
    ".trae/specs/build-commercial-web-app/spec.md",
    ".trae/specs/build-commercial-web-app/tasks.md",
    "README.md",
    "StatsPAI",
    "deer-flow",
    "eslint.config.js",
    "index.html",
    "package-lock.json",
    "package.json",
    "postcss.config.js",
    "public/favicon.svg",
    "spatial_mock.csv",
    "src/App.tsx",
    "src/assets/react.svg",
    "src/components/Empty.tsx",
    "src/components/Layout.tsx",
    "src/components/Navbar.tsx",
    "src/hooks/useTheme.ts",
    "src/index.css",
    "src/lib/utils.ts",
    "src/main.tsx",
    "src/pages/Chat.tsx",
    "src/pages/Datasets.tsx",
    "src/pages/Home.tsx",
    "src/store/useStore.ts",
    "src/vite-env.d.ts",
    "tailwind.config.js",
    "test_deerflow.py",
    "test_spatial.py",
    "tsconfig.json",
    "update_config.py",
    "update_uploads_config.py",
    "vite.config.ts"
]

for f in files:
    cmd = f'git --no-pager diff --name-status origin/main...trae/solo-agent-m9K3BP -- "{f}"'
    status = os.popen(cmd).read().strip()
    if status:
        stat_char = status[0]
        if stat_char == 'A':
            print(f"{f}: Added new file")
        elif stat_char == 'M':
            print(f"{f}: Modified file")
        elif stat_char == 'D':
            print(f"{f}: Deleted file")
        else:
            print(f"{f}: {status}")
    else:
        print(f"{f}: No changes detected")
