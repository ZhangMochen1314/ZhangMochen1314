import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className={`flex-1 flex flex-col ${isHome ? 'pt-16' : ''}`}>
        <Outlet />
      </main>
    </div>
  );
}