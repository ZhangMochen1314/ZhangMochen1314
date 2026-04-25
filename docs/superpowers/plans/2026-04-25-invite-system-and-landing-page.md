# Invite System and Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor the landing page to open first, use a modal for login/registration, implement an invite-code registration system with point rewards, and add a dynamic algorithmic art background using brand guidelines.

**Architecture:** 
1. Database: Add `invite_code` to `User` model. Add `InviteRecord` to track usage. Add `SystemInvite` for admin-generated codes.
2. Backend: Update `/auth/register` to validate invite codes and distribute points (100 to inviter, 50 to invitee).
3. Frontend: Refactor `App.tsx` and `Home.tsx` to handle modal-based auth. Integrate a p5.js algorithmic background that matches the existing glassmorphism academic style while incorporating Anthropic brand fonts (Poppins/Lora) and accent colors (Blue/Cyan/Orange).

**Tech Stack:** FastAPI, SQLite/SQLAlchemy, React, Tailwind CSS, p5.js (react-p5), Framer Motion.

---

### Task 1: Update Database Models

**Files:**
- Modify: `/workspace/DeepResValue_WebApp/deer-flow/backend/app/auth/models.py`
- Create: `/workspace/DeepResValue_WebApp/deer-flow/backend/scripts/init_invites.py`

- [ ] **Step 1: Add Invite Models and Fields**

Modify `models.py` to add `invite_code` to `User` and create `InviteRecord` and `SystemInvite` models.

```python
# In models.py
import string
import random

def generate_invite_code():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))

# Update User model
class User(Base):
    __tablename__ = "users"
    # ... existing fields
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    credits = Column(Integer, default=50) # Changed default to 50 for new users
    is_active = Column(Boolean, default=True)
    role = Column(String, default="user")
    tier = Column(String, default="free")
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(UTC))
    
    invite_code = Column(String, unique=True, index=True, default=generate_invite_code)
    
    # ... existing relationships

class InviteRecord(Base):
    __tablename__ = "invite_records"
    id = Column(Integer, primary_key=True, index=True)
    inviter_id = Column(Integer, ForeignKey("users.id"), nullable=True) # null if system invite
    invitee_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    code_used = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(UTC))

class SystemInvite(Base):
    __tablename__ = "system_invites"
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, index=True, nullable=False)
    created_by = Column(String, nullable=False, default="admin")
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(UTC))
```

- [ ] **Step 2: Create a script to generate system invites**

Create `init_invites.py` to generate the initial admin invite codes.

```python
# In scripts/init_invites.py
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.auth.models import SystemInvite, Base

DB_URL = "sqlite:///deerflow.db"
engine = create_engine(DB_URL)
Base.metadata.create_all(bind=engine)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def create_system_invite(code: str):
    db = SessionLocal()
    try:
        if db.query(SystemInvite).filter(SystemInvite.code == code).first():
            print(f"Code {code} already exists.")
            return
        invite = SystemInvite(code=code)
        db.add(invite)
        db.commit()
        print(f"Successfully created system invite code: {code}")
    finally:
        db.close()

if __name__ == "__main__":
    if len(sys.argv) > 1:
        create_system_invite(sys.argv[1])
    else:
        create_system_invite("DEEP2026")
        create_system_invite("ADMINVIP")
```

- [ ] **Step 3: Commit**

```bash
git add backend/app/auth/models.py backend/scripts/init_invites.py
git commit -m "feat: add invite code models"
```

### Task 2: Update Authentication API

**Files:**
- Modify: `/workspace/DeepResValue_WebApp/deer-flow/backend/app/auth/router.py`

- [ ] **Step 1: Modify Registration Schema**

In `router.py`, add `invite_code` to the registration request.

```python
from pydantic import BaseModel

class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    invite_code: str  # Required now
```

- [ ] **Step 2: Update the `register` endpoint**

Add logic to validate the code, create the user, update inviter points, and record usage.

```python
from fastapi import HTTPException
from app.auth.models import InviteRecord, SystemInvite

@router.post("/register", response_model=Token)
async def register(user: UserCreate, db: AsyncSession = Depends(get_db)):
    # Validate Invite Code
    inviter = await db.execute(select(User).where(User.invite_code == user.invite_code))
    inviter = inviter.scalar_one_or_none()
    
    system_invite = None
    if not inviter:
        system_invite = await db.execute(select(SystemInvite).where(SystemInvite.code == user.invite_code))
        system_invite = system_invite.scalar_one_or_none()
        
    if not inviter and not system_invite:
        raise HTTPException(status_code=400, detail="Invalid invite code")

    # Check if username or email exists
    query = select(User).where((User.username == user.username) | (User.email == user.email))
    result = await db.execute(query)
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Username or email already registered")
        
    hashed_password = get_password_hash(user.password)
    new_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password,
        credits=50  # 50 points for new user
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    
    # Reward inviter if applicable
    if inviter:
        inviter.credits += 100
        db.add(inviter)
    
    # Record usage
    record = InviteRecord(
        inviter_id=inviter.id if inviter else None,
        invitee_id=new_user.id,
        code_used=user.invite_code
    )
    db.add(record)
    await db.commit()
    
    # Generate token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": new_user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}
```

- [ ] **Step 3: Return `invite_code` in `/me`**

```python
# In router.py, ensure /me returns invite_code
@router.get("/me")
async def read_users_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "role": current_user.role,
        "tier": current_user.tier,
        "credits": current_user.credits,
        "invite_code": current_user.invite_code
    }
```

- [ ] **Step 4: Commit**

```bash
git add backend/app/auth/router.py
git commit -m "feat: implement invite code logic in register endpoint"
```

### Task 3: Algorithmic Art Background Component

**Files:**
- Modify: `/workspace/DeepResValue_WebApp/deer-flow/frontend/package.json`
- Create: `/workspace/DeepResValue_WebApp/deer-flow/frontend/src/components/AlgorithmicBackground.tsx`

- [ ] **Step 1: Install p5.js React wrapper**

Run: `npm install react-p5` in the frontend directory.

- [ ] **Step 2: Create the Algorithmic Art component**

Implement the "Quantum Harmonics" philosophy matching the dark blue/cyan style.

```tsx
// In AlgorithmicBackground.tsx
import React from "react";
import Sketch from "react-p5";

export default function AlgorithmicBackground() {
  const particles: any[] = [];
  const numParticles = 100;

  const setup = (p5: any, canvasParentRef: any) => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight).parent(canvasParentRef);
    p5.background(20, 20, 20); // Dark Anthropic/Academic base (#141413 approx)
    
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: p5.random(p5.width),
        y: p5.random(p5.height),
        vx: p5.random(-1, 1),
        vy: p5.random(-1, 1),
        phase: p5.random(p5.TWO_PI)
      });
    }
  };

  const draw = (p5: any) => {
    p5.background(20, 24, 30, 20); // Fading trail effect
    
    for (let i = 0; i < particles.length; i++) {
      let p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.phase += 0.05;

      // Wrap around edges
      if (p.x < 0) p.x = p5.width;
      if (p.x > p5.width) p.x = 0;
      if (p.y < 0) p.y = p5.height;
      if (p.y > p5.height) p.y = 0;

      // Draw particle (Cyan/Blue glassmorphism feel)
      const r = p5.map(p5.sin(p.phase), -1, 1, 2, 6);
      p5.noStroke();
      p5.fill(106, 155, 204, 150); // Brand Blue #6a9bcc
      p5.circle(p.x, p.y, r);
      
      // Connect nearby particles to form network
      for (let j = i + 1; j < particles.length; j++) {
        let other = particles[j];
        let d = p5.dist(p.x, p.y, other.x, other.y);
        if (d < 100) {
          p5.stroke(120, 140, 93, p5.map(d, 0, 100, 100, 0)); // Brand Green #788c5d
          p5.strokeWeight(0.5);
          p5.line(p.x, p.y, other.x, other.y);
        }
      }
    }
  };

  const windowResized = (p5: any) => {
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
  };

  return <Sketch setup={setup} draw={draw} windowResized={windowResized} className="absolute inset-0 -z-20 opacity-30" />;
}
```

- [ ] **Step 3: Commit**

```bash
git add frontend/package.json frontend/src/components/AlgorithmicBackground.tsx
git commit -m "feat: add p5 algorithmic art background"
```

### Task 4: Auth Modal Component

**Files:**
- Create: `/workspace/DeepResValue_WebApp/deer-flow/frontend/src/components/AuthModal.tsx`

- [ ] **Step 1: Create AuthModal component**

```tsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/useAuthStore";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Alert } from "./ui/alert";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: "login" | "register";
}

export default function AuthModal({ isOpen, onClose, initialView = "login" }: AuthModalProps) {
  const [view, setView] = useState<"login" | "register">(initialView);
  const [formData, setFormData] = useState({ username: "", email: "", password: "", invite_code: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuthStore(state => state.login);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      if (view === "login") {
        await login(formData.username, formData.password);
        onClose();
      } else {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || "Registration failed");
        await login(formData.username, formData.password);
        onClose();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md relative"
          style={{ fontFamily: "'Poppins', Arial, sans-serif" }}
        >
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
          
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            {view === "login" ? "登录 DeepResValue" : "注册内测账号"}
          </h2>
          
          {error && <Alert className="mb-4 text-red-600 bg-red-50 border-red-200">{error}</Alert>}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>用户名</Label>
              <Input required value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} />
            </div>
            {view === "register" && (
              <div className="space-y-2">
                <Label>邮箱</Label>
                <Input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
            )}
            <div className="space-y-2">
              <Label>密码</Label>
              <Input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
            </div>
            {view === "register" && (
              <div className="space-y-2">
                <Label>专属邀请码</Label>
                <Input required value={formData.invite_code} onChange={e => setFormData({...formData, invite_code: e.target.value})} placeholder="必填，邀请人可获得100积分" />
              </div>
            )}
            
            <Button type="submit" className="w-full bg-[#141413] hover:bg-slate-800 text-white" disabled={isLoading}>
              {isLoading ? "处理中..." : view === "login" ? "登录" : "注册并领取50积分"}
            </Button>
          </form>
          
          <div className="mt-4 text-center text-sm text-slate-600">
            {view === "login" ? (
              <p>没有账号？ <button onClick={() => setView("register")} className="text-[#d97757] font-bold hover:underline">使用邀请码注册</button></p>
            ) : (
              <p>已有账号？ <button onClick={() => setView("login")} className="text-[#6a9bcc] font-bold hover:underline">直接登录</button></p>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/components/AuthModal.tsx
git commit -m "feat: add auth modal component with invite code support"
```

### Task 5: Refactor App & Landing Page

**Files:**
- Modify: `/workspace/DeepResValue_WebApp/deer-flow/frontend/src/App.tsx`
- Modify: `/workspace/DeepResValue_WebApp/deer-flow/frontend/src/pages/Home.tsx`

- [ ] **Step 1: Refactor App.tsx**

Remove standalone `/login` and `/register` routes. Everything funnels through the Landing page if not authenticated, except protected routes.

```tsx
// In App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Chat from "@/pages/Chat";
import Datasets from "@/pages/Datasets";
import { useAuthStore } from "@/store/useAuthStore";

const ProtectedRoute = () => {
  const token = useAuthStore((state) => state.token);
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="chat" element={<Chat />} />
            <Route path="chat/:id" element={<Chat />} />
            <Route path="datasets" element={<Datasets />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}
```

- [ ] **Step 2: Update Home.tsx**

Integrate the `AlgorithmicBackground` and `AuthModal`. Add copy about the invite system and update typography to use brand guidelines (`Poppins` for headers, `Lora` for body) while keeping the overall styling.

```tsx
// Inside Home.tsx
import React, { useState } from "react";
import AuthModal from "@/components/AuthModal";
import AlgorithmicBackground from "@/components/AlgorithmicBackground";
import { useAuthStore } from "@/store/useAuthStore";
import { useNavigate } from "react-router-dom";
// ... other imports

export default function Home() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authView, setAuthView] = useState<"login" | "register">("login");
  const token = useAuthStore(state => state.token);
  const navigate = useNavigate();

  const handleCTA = (view: "login" | "register") => {
    if (token) {
      navigate("/chat");
    } else {
      setAuthView(view);
      setIsAuthOpen(true);
    }
  };

  return (
    <div className="bg-[#faf9f5] text-[#141413] font-sans selection:bg-blue-200 selection:text-blue-900 relative min-h-screen">
      <AlgorithmicBackground />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center overflow-hidden z-10">
        
        <motion.h1 
          className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl leading-[1.15]"
          style={{ fontFamily: "'Poppins', Arial, sans-serif" }}
        >
          重塑您的<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6a9bcc] to-[#d97757]">科研工作流</span>
        </motion.h1>
        
        <motion.p 
          className="mt-6 text-xl text-slate-600 max-w-3xl leading-relaxed"
          style={{ fontFamily: "'Lora', Georgia, serif" }}
        >
          专为高校师生与科研人员打造的高端学术研究平台。现已开启内测，<strong className="text-[#d97757]">凭邀请码注册即赠50积分，邀请他人再获100积分，不限次数！</strong>
        </motion.p>
        
        <motion.div className="mt-10 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <button onClick={() => handleCTA("login")} className="inline-flex items-center justify-center px-8 py-3.5 text-base font-medium text-white bg-[#141413] rounded-lg hover:bg-slate-800 transition-colors shadow-lg">
            {token ? "进入研究室" : "登录账号"} <ArrowRight className="ml-2 w-5 h-5" />
          </button>
          {!token && (
            <button onClick={() => handleCTA("register")} className="inline-flex items-center justify-center px-8 py-3.5 text-base font-medium text-[#141413] bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all shadow-sm">
              输入邀请码注册
            </button>
          )}
        </motion.div>
        {/* Keep existing product illustration and feature sections but apply fonts where appropriate */}
      </section>

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} initialView={authView} />
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add frontend/src/App.tsx frontend/src/pages/Home.tsx
git commit -m "feat: refactor home page with modal auth, invite copy, and algorithmic background"
```
