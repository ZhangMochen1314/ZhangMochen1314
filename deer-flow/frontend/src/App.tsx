import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Chat from "@/pages/Chat";
import Datasets from "@/pages/Datasets";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="chat" element={<Chat />} />
          <Route path="chat/:id" element={<Chat />} />
          <Route path="datasets" element={<Datasets />} />
        </Route>
      </Routes>
    </Router>
  );
}
