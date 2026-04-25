import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import AuthModal from "@/components/AuthModal";

export default function Layout() {
  const location = useLocation();
  const isChat = location.pathname.startsWith("/chat");

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col h-screen overflow-hidden">
      {!isChat && <Navbar />}
      <main className={`flex-1 flex flex-col ${isChat ? '' : 'pt-16'} overflow-y-auto`}>
        <Outlet />
      </main>
      <AuthModal />
    </div>
  );
}