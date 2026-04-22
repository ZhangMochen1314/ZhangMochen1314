import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
  const location = useLocation();
  const isChat = location.pathname.startsWith("/chat");
  const isDatasets = location.pathname === "/datasets";

  // Different padding top depending on page
  // Home has its own top padding (pt-32), Chat is full screen minus navbar, Datasets needs pt-16
  const mainClass = isChat ? "h-[calc(100vh-4rem)] mt-16" : (isDatasets ? "min-h-screen pt-16 bg-slate-50" : "min-h-screen bg-slate-50");

  return (
    <div className="font-sans text-slate-900 selection:bg-blue-200">
      <Navbar />
      <main className={mainClass}>
        <Outlet />
      </main>
    </div>
  );
}