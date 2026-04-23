import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Chat from "@/pages/Chat";
import Datasets from "@/pages/Datasets";
import AuthModal from "@/components/AuthModal";
import { useStore } from "@/store/useStore";

// Require Auth Guard
function RequireAuth({ children }: { children: JSX.Element }) {
  const token = useStore((state) => state.token);
  const setShowAuthModal = useStore((state) => state.setShowAuthModal);
  const location = useLocation();

  if (!token) {
    // If they hit a protected route, open modal and bounce them to home
    setShowAuthModal(true);
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function App() {
  return (
    <Router>
      <AuthModal />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="chat" element={<RequireAuth><Chat /></RequireAuth>} />
          <Route path="chat/:id" element={<RequireAuth><Chat /></RequireAuth>} />
          <Route path="datasets" element={<RequireAuth><Datasets /></RequireAuth>} />
        </Route>
      </Routes>
    </Router>
  );
}
