import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Chat from "@/pages/Chat";
import Datasets from "@/pages/Datasets";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import { useStore } from "@/store/useStore";

// Require Auth Guard
function RequireAuth({ children }: { children: JSX.Element }) {
  const token = useStore((state) => state.token);
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/" element={<RequireAuth><Layout /></RequireAuth>}>
          <Route index element={<Home />} />
          <Route path="chat" element={<Chat />} />
          <Route path="chat/:id" element={<Chat />} />
          <Route path="datasets" element={<Datasets />} />
        </Route>
      </Routes>
    </Router>
  );
}
