import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import EthicsGuide from "./pages/EthicsGuide";
import DocumentModal from "./components/DocumentModal";
import "./index.css";

function EthicsGuard({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const hasConsented = localStorage.getItem("ai_ethics_consent") === "true";
  
  if (!hasConsented) {
    return <Navigate to={`/ethics-guide?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }
  
  return <>{children}</>;
}

function App() {
  const [modalType, setModalType] = useState<"privacy" | "terms" | null>(null);

  const openModal = (type: "privacy" | "terms") => {
    setModalType(type);
  };

  return (
    <Router>
      <div className="app-container">
        <nav className="navbar">
          <div className="nav-brand">
            <Link to="/">TaskFlow</Link>
          </div>
          <div className="nav-links">
            <Link to="/ethics-guide" className="nav-btn">AI 윤리가이드</Link>
            <Link to="/login" className="nav-btn">교사 로그인</Link>
            <Link to="/signup" className="nav-btn primary">학생 회원가입</Link>
          </div>
        </nav>
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ethics-guide" element={<EthicsGuide />} />
            <Route path="/login" element={<EthicsGuard><Login /></EthicsGuard>} />
            <Route path="/signup" element={<EthicsGuard><Signup /></EthicsGuard>} />
            <Route path="/dashboard" element={<EthicsGuard><Dashboard /></EthicsGuard>} />
          </Routes>
        </main>

        <footer className="app-footer">
          <div className="footer-content">
            <div className="footer-info">
              <span>© 2026 TaskFlow. All rights reserved.</span>
              <span>|</span>
              <span>개인정보책임자: 나혜진 교사 (서울원광초등학교)</span>
            </div>
            <div className="footer-links">
              <button onClick={() => openModal("terms")} className="footer-link">이용약관</button>
              <span>|</span>
              <button onClick={() => openModal("privacy")} className="footer-link">개인정보처리방침</button>
            </div>
          </div>
        </footer>

        {modalType && (
          <DocumentModal 
            isOpen={!!modalType} 
            onClose={() => setModalType(null)} 
            type={modalType} 
          />
        )}
      </div>
    </Router>
  );
}

export default App;
