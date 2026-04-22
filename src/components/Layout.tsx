import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col h-screen overflow-hidden">
      <Navbar />
      <main className="flex-1 flex flex-col pt-16 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}