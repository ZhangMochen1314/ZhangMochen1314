import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Chat from "@/pages/Chat";
import Datasets from "@/pages/Datasets";
import Admin from "@/pages/Admin";
import AuthModal from "@/components/AuthModal";
import { useStore } from "@/store/useStore";

// Require Auth Guard
function RequireAuth({ children, requireAdmin = false }: { children: JSX.Element, requireAdmin?: boolean }) {
  const token = useStore((state) => state.token);
  const user = useStore((state) => state.user);
  const setShowAuthModal = useStore((state) => state.setShowAuthModal);

  if (!token) {
    setShowAuthModal(true);
    return <Navigate to="/" replace />;
  }

  if (requireAdmin && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function App() {
  const fetchPricingConfig = useStore(state => state.fetchPricingConfig);

  useEffect(() => {
    fetchPricingConfig();
  }, [fetchPricingConfig]);

  return (
    <Router>
      <AuthModal />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="chat" element={<RequireAuth><Chat /></RequireAuth>} />
          <Route path="chat/:id" element={<RequireAuth><Chat /></RequireAuth>} />
          <Route path="datasets" element={<RequireAuth><Datasets /></RequireAuth>} />
          <Route path="admin" element={<RequireAuth requireAdmin={true}><Admin /></RequireAuth>} />
        </Route>
      </Routes>
    </Router>
  );
}
