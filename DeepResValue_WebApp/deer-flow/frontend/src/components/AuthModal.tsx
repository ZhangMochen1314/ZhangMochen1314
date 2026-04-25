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
  const setAuth = useAuthStore(state => state.setAuth);

  // Sync initial view when modal opens
  React.useEffect(() => {
    if (isOpen) setView(initialView);
  }, [isOpen, initialView]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#141413]/60 backdrop-blur-md p-4"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-[#faf9f5] p-8 rounded-3xl shadow-2xl w-full max-w-md relative border border-[#e8e6dc]"
            style={{ fontFamily: "'Lora', Georgia, serif" }}
          >
            <button 
              onClick={onClose} 
              className="absolute top-5 right-5 p-2 text-[#b0aea5] hover:text-[#141413] hover:bg-[#e8e6dc] rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h2 
              className="text-3xl font-bold text-[#141413] mb-2 tracking-tight"
              style={{ fontFamily: "'Poppins', Arial, sans-serif" }}
            >
              {view === "login" ? "Welcome Back" : "Join the Waitlist"}
            </h2>
            
            <p className="text-[#b0aea5] mb-6 text-sm">
              {view === "login" 
                ? "登录您的 DeepResValue 账号继续研究。" 
                : "使用邀请码注册，即赠 50 积分启动您的科研工作流。"}
            </p>
  
            {error && <Alert className="mb-6 text-[#d97757] bg-[#d97757]/10 border-[#d97757]/20 rounded-xl">{error}</Alert>}
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label className="text-[#141413] font-medium">用户名</Label>
                <Input 
                  required 
                  value={formData.username} 
                  onChange={e => setFormData({...formData, username: e.target.value})} 
                  className="rounded-xl border-[#e8e6dc] bg-white focus:border-[#6a9bcc] focus:ring-[#6a9bcc]"
                  placeholder="学术账号名"
                />
              </div>
              {view === "register" && (
                <div className="space-y-2">
                  <Label className="text-[#141413] font-medium">邮箱</Label>
                  <Input 
                    type="email" 
                    required 
                    value={formData.email} 
                    onChange={e => setFormData({...formData, email: e.target.value})} 
                    className="rounded-xl border-[#e8e6dc] bg-white focus:border-[#6a9bcc] focus:ring-[#6a9bcc]"
                    placeholder="name@university.edu.cn"
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label className="text-[#141413] font-medium">密码</Label>
                <Input 
                  type="password" 
                  required 
                  value={formData.password} 
                  onChange={e => setFormData({...formData, password: e.target.value})} 
                  className="rounded-xl border-[#e8e6dc] bg-white focus:border-[#6a9bcc] focus:ring-[#6a9bcc]"
                  placeholder="••••••••"
                />
              </div>
              {view === "register" && (
                <div className="space-y-2">
                  <Label className="text-[#141413] font-medium">专属邀请码</Label>
                  <Input 
                    required 
                    value={formData.invite_code} 
                    onChange={e => setFormData({...formData, invite_code: e.target.value})} 
                    placeholder="必填，邀请人可获得100积分"
                    className="rounded-xl border-[#e8e6dc] bg-white focus:border-[#6a9bcc] focus:ring-[#6a9bcc]"
                  />
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full bg-[#141413] hover:bg-[#2a2a29] text-white rounded-xl py-6 mt-4 transition-all" 
                disabled={isLoading}
                style={{ fontFamily: "'Poppins', Arial, sans-serif" }}
              >
                {isLoading ? "处理中..." : view === "login" ? "Sign In" : "Register & Claim Credits"}
              </Button>
            </form>
            
            <div className="mt-8 text-center text-sm text-[#141413]/70">
              {view === "login" ? (
                <p>没有账号？ <button onClick={() => setView("register")} type="button" className="text-[#d97757] font-semibold hover:underline">使用邀请码注册</button></p>
              ) : (
                <p>已有账号？ <button onClick={() => setView("login")} type="button" className="text-[#6a9bcc] font-semibold hover:underline">直接登录</button></p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
