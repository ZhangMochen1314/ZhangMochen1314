import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/useAuthStore";
import { X, BrainCircuit } from "lucide-react";
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
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const setAuth = useAuthStore(state => state.setAuth);

  // Sync initial view when modal opens
  React.useEffect(() => {
    if (isOpen) setView(initialView);
  }, [isOpen, initialView]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (view === "register" && !termsAccepted) {
      setError("Please agree to the Terms of Service.");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      if (view === "register") {
        const res = await fetch("/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: formData.username,
            email: formData.email,
            password: formData.password,
            invite_code: formData.invite_code
          })
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.detail || "Registration failed");
        }
      }

      // Login
      const loginData = new URLSearchParams();
      loginData.append('username', formData.username);
      loginData.append('password', formData.password);

      const loginRes = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: loginData.toString(),
      });

      if (!loginRes.ok) {
        const errData = await loginRes.json();
        throw new Error(errData.detail || "Login failed");
      }

      const tokenData = await loginRes.json();

      const meRes = await fetch('/auth/me', {
        headers: { 'Authorization': `Bearer ${tokenData.access_token}` }
      });

      if (!meRes.ok) throw new Error("Failed to fetch user info");
      const user = await meRes.json();

      setAuth(tokenData.access_token, user);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--theme-dark)]/80 backdrop-blur-xl p-4"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-[var(--theme-light)]/95 backdrop-blur-md p-10 rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.15)] w-full max-w-md relative border border-white/60"
            style={{ fontFamily: "var(--font-body)" }}
          >
            <button 
              onClick={onClose} 
              className="absolute top-6 right-6 p-2 text-[var(--theme-muted)] hover:text-[var(--theme-dark)] hover:bg-[var(--theme-border)]/50 rounded-full transition-all"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex justify-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[var(--theme-dark)] flex items-center justify-center shadow-lg">
                <BrainCircuit className="w-6 h-6 text-[var(--theme-light)]" />
              </div>
            </div>
            
            <div className="text-center mb-8">
              <h2 
                className="text-3xl font-bold text-[var(--theme-dark)] mb-3 tracking-tight"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {view === "login" ? "Welcome Back" : "Join the Waitlist"}
              </h2>
              
              <p className="text-[var(--theme-muted)] text-sm leading-relaxed px-4">
                {view === "login" 
                  ? "登录您的 DeepResValue 账号继续研究。" 
                  : <>使用邀请码注册，即赠 <span className="text-[var(--theme-accent1)] font-semibold">50 积分</span> 启动您的科研工作流。</>}
              </p>
            </div>
  
            {error && <Alert className="mb-6 text-[var(--theme-accent1)] bg-[var(--theme-accent1)]/10 border-[var(--theme-accent1)]/20 rounded-xl">{error}</Alert>}
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2.5">
                <Label className="text-[var(--theme-dark)] font-semibold text-sm tracking-wide">用户名</Label>
                <Input 
                  required 
                  value={formData.username} 
                  onChange={e => setFormData({...formData, username: e.target.value})} 
                  className="rounded-xl border-transparent bg-black/[0.03] hover:bg-black/[0.05] focus:bg-white focus:border-[var(--theme-accent2)] focus:ring-4 focus:ring-[var(--theme-accent2)]/20 transition-all px-4 py-6 text-base"
                  placeholder="学术账号名"
                />
              </div>
              {view === "register" && (
                <div className="space-y-2.5">
                  <Label className="text-[var(--theme-dark)] font-semibold text-sm tracking-wide">邮箱</Label>
                  <Input 
                    type="email" 
                    required 
                    value={formData.email} 
                    onChange={e => setFormData({...formData, email: e.target.value})} 
                    className="rounded-xl border-transparent bg-black/[0.03] hover:bg-black/[0.05] focus:bg-white focus:border-[var(--theme-accent2)] focus:ring-4 focus:ring-[var(--theme-accent2)]/20 transition-all px-4 py-6 text-base"
                    placeholder="name@university.edu.cn"
                  />
                </div>
              )}
              <div className="space-y-2.5">
                <Label className="text-[var(--theme-dark)] font-semibold text-sm tracking-wide">密码</Label>
                <Input 
                  type="password" 
                  required 
                  value={formData.password} 
                  onChange={e => setFormData({...formData, password: e.target.value})} 
                  className="rounded-xl border-transparent bg-black/[0.03] hover:bg-black/[0.05] focus:bg-white focus:border-[var(--theme-accent2)] focus:ring-4 focus:ring-[var(--theme-accent2)]/20 transition-all px-4 py-6 text-base"
                  placeholder="••••••••"
                />
              </div>
              {view === "register" && (
              <div className="space-y-2.5">
                <Label className="text-[var(--theme-dark)] font-semibold text-sm tracking-wide">内测邀请码</Label>
                <Input 
                  required 
                  value={formData.invite_code} 
                  onChange={e => setFormData({...formData, invite_code: e.target.value})} 
                  placeholder="必填，需使用官方内测码或好友邀请码注册"
                  className="rounded-xl border-transparent bg-black/[0.03] hover:bg-black/[0.05] focus:bg-white focus:border-[var(--theme-accent2)] focus:ring-4 focus:ring-[var(--theme-accent2)]/20 transition-all px-4 py-6 text-base"
                />
              </div>
            )}

            {view === "register" && (
              <div className="flex items-center space-x-2 mt-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-[var(--theme-dark)] focus:ring-[var(--theme-dark)]"
                  required
                />
                <Label htmlFor="terms" className="text-sm text-[var(--theme-muted)]">
                  I agree to the <a href="#" className="text-[var(--theme-accent2)] hover:underline">Terms of Service</a>
                </Label>
              </div>
            )}
            
            <Button 
                type="submit" 
                className="w-full bg-[var(--theme-dark)] hover:bg-[var(--theme-dark-hover)] text-white rounded-xl py-7 mt-6 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl text-base tracking-wide" 
                disabled={isLoading}
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {isLoading ? "处理中..." : view === "login" ? "Sign In" : "Register & Claim Credits"}
              </Button>
            </form>
            
            <div className="mt-8 text-center text-sm text-[var(--theme-muted)]">
              {view === "login" ? (
                <p>没有账号？ <button onClick={() => setView("register")} type="button" className="text-[var(--theme-accent1)] font-semibold hover:text-[var(--theme-accent1-hover)] transition-colors">使用邀请码注册</button></p>
              ) : (
                <p>已有账号？ <button onClick={() => setView("login")} type="button" className="text-[var(--theme-accent2)] font-semibold hover:text-[var(--theme-accent2-hover)] transition-colors">直接登录</button></p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
