import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import DocumentModal from "./components/DocumentModal";
import EthicsGuideModal from "./components/EthicsGuideModal";
import "./index.css";

function App() {
  const [hasConsented, setHasConsented] = useState(() => {
    return localStorage.getItem("taskflow_ethics_consent") === "true";
  });
  const [modalType, setModalType] = useState<"privacy" | "terms" | null>(null);
  const [ethicsModalOpen, setEthicsModalOpen] = useState(false);

  const openModal = (type: "privacy" | "terms") => {
    setModalType(type);
  };

  const handleConsentComplete = () => {
    localStorage.setItem("taskflow_ethics_consent", "true");
    setHasConsented(true);
  };

  return (
    <Router>
      <div className="app-container">
        <nav className="navbar">
          <div className="nav-brand">
            <Link to="/">TaskFlow</Link>
          </div>
          <div className="nav-links">
            <Link to="/login" className="nav-btn">교사 로그인</Link>
            <Link to="/signup" className="nav-btn primary">학생 회원가입</Link>
          </div>
        </nav>
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
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
              <button onClick={() => setEthicsModalOpen(true)} className="footer-link">AI 윤리가이드</button>
              <span>|</span>
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

        {/* Global Blocking Gate Modal */}
        {!hasConsented && (
          <EthicsGuideModal 
            isOpen={true} 
            isGate={true} 
            onClose={handleConsentComplete} 
          />
        )}

        {/* User-Triggered Modal (from Navbar) */}
        {ethicsModalOpen && (
          <EthicsGuideModal 
            isOpen={ethicsModalOpen} 
            isGate={false} 
            onClose={() => setEthicsModalOpen(false)} 
          />
        )}
      </div>
    </Router>
  );
}

export default App;
