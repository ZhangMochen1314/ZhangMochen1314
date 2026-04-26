import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthModal from "@/components/AuthModal";
import AlgorithmicBackground from "@/components/AlgorithmicBackground";
import { useAuthStore } from "@/store/useAuthStore";
import {
  HeroSection,
  VibeCodingSection,
  ToolsSection,
  CompetitionSection,
  WorkflowSection,
  RewardsSection,
  FeaturesSection,
  CtaSection
} from "@/components/landing";

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
    <div className="bg-[#faf9f5] text-[#141413] font-sans selection:bg-[#6a9bcc]/30 selection:text-[#141413] relative min-h-screen overflow-x-hidden">
      <AlgorithmicBackground />
      
      <HeroSection handleCTA={handleCTA} token={token} />
      <VibeCodingSection />
      <ToolsSection />
      <CompetitionSection />
      <WorkflowSection />
      <RewardsSection />
      <FeaturesSection />
      <CtaSection handleCTA={handleCTA} token={token} />

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} initialView={authView} />
    </div>
  );
}
