import { Link } from "react-router-dom";
import { CheckCircle, Users, BookOpen } from "lucide-react";

export default function Home() {
  return (
    <div className="home-container fade-in">
      <div className="hero-section">
        <h1 className="hero-title">
          <span className="gradient-text">TaskFlow</span>에 오신 것을 환영합니다
        </h1>
        <p className="hero-subtitle">
          교사와 학생을 위한 스마트한 할 일 관리 플랫폼
        </p>
        <div className="action-buttons">
          <Link to="/login" className="btn btn-outline btn-lg">교사로 시작하기</Link>
          <Link to="/signup" className="btn btn-primary btn-lg">학생으로 시작하기</Link>
        </div>
      </div>

      <div className="features-section">
        <div className="feature-card">
          <div className="feature-icon"><CheckCircle size={32} /></div>
          <h3>간편한 할 일 관리</h3>
          <p>쉽고 빠르게 할 일을 추가하고, 진행 상황을 체크하세요.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon"><Users size={32} /></div>
          <h3>원활한 소통</h3>
          <p>선생님과 학생이 함께 일정을 관리하고 공유합니다.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon"><BookOpen size={32} /></div>
          <h3>학습 효율 향상</h3>
          <p>체계적인 일정 관리로 학습 효율을 극대화하세요.</p>
        </div>
      </div>
    </div>
  );
}
