import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Compass, Target, Shield, Eye, ArrowRight, Check } from "lucide-react";

interface GuideItem {
  id: number;
  title: string;
  subTitle: string;
  values: { name: string; type: "primary" | "secondary" | "success" | "warning" }[];
  description: string;
  icon: any;
}

export default function EthicsGuide() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const redirectPath = searchParams.get("redirect") || "/";
  
  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const guides: GuideItem[] = [
    {
      id: 1,
      title: "활용 목적",
      subTitle: "생성형 AI를 쓰기 전, ‘왜’ 쓰는지 말할 수 있어야 해요.",
      values: [
        { name: "주도성", type: "warning" },
        { name: "합목적성", type: "success" }
      ],
      description: "생성형 AI를 사용하기 전에 ‘지금 내가 왜 쓰려고 하지?’라고 스스로 물어보세요. 생성형 AI는 내 생각을 대신해주는 게 아니라, 내 생각을 도와주는 도구임을 기억하세요. 모든 공부에 생성형 AI가 필요한 것은 아니므로, 지금 하는 활동에 생성형 AI를 사용하는 것이 나의 학습에 정말 도움이 될지 먼저 고민해요.",
      icon: Target
    },
    {
      id: 2,
      title: "주도적 학습",
      subTitle: "생성형 AI에게 물어보기 전, 내 생각을 먼저 말해요.",
      values: [
        { name: "주도성", type: "warning" }
      ],
      description: "막막할 때 바로 생성형 AI에게 묻고 싶은 마음이 들 수 있지만, 먼저 스스로 시도해 보아야 나의 성장에 도움이 돼요. 주제에 대해 내가 아는 것과 내 아이디어를 먼저 공책에 적거나 정리한 뒤에 생성형 AI를 활용하세요.",
      icon: Compass
    },
    {
      id: 3,
      title: "비판적 검증",
      subTitle: "생성형 AI가 틀릴 수 있다는 점을 알아요.",
      values: [
        { name: "주도성", type: "warning" }
      ],
      description: "생성형 AI는 틀린 정보를 마치 사실인 것처럼 제시하기도 하므로, 알려준 내용은 항상 ‘정말 맞을까?’ 하고 한 번 더 확인하는 습관을 가져요. 중요한 내용일수록 책을 찾아보거나 선생님께 여쭤보는 등 다른 방법으로도 꼭 다시 확인하세요.",
      icon: Shield
    },
    {
      id: 4,
      title: "사고의 확장",
      subTitle: "생성형 AI와 함께 상상하며 내 생각을 더 크게 키워요.",
      values: [
        { name: "주도성", type: "warning" },
        { name: "합목적성", type: "success" }
      ],
      description: "생성형 AI를 내 생각의 범위를 넓혀주는 도구로 사용해보세요. 생성형 AI의 결과물을 그대로 사용하지 않고, 나의 경험과 생각을 더하여 나만의 색깔을 담은 최종 결과물을 만들어요.",
      icon: Compass
    },
    {
      id: 5,
      title: "안전과 관계",
      subTitle: "나의 정보와 비밀을 말하지 않아요.",
      values: [
        { name: "안전성", type: "primary" }
      ],
      description: "내가 입력한 정보는 어디에서 어떻게 사용될지 모르기 때문에 이름, 주소, 학교, 전화번호 같은 개인정보는 생성형 AI에게 알려주면 안 돼요. 생성형 AI는 계산된 답변을 내놓는 프로그램이라 감정이 없어요. 나의 고민을 털어놓으며 지나치게 의지하기보다, 친구나 부모님, 선생님과의 실제 대화를 통해 마음을 나누어요.",
      icon: Shield
    },
    {
      id: 6,
      title: "투명성·윤리",
      subTitle: "생성형 AI의 도움을 받았다면 숨기지 않고 정직하게 이야기해요.",
      values: [
        { name: "투명성", type: "secondary" }
      ],
      description: "어느 부분이 생성형 AI의 것이고 어느 부분이 나의 것인지 명확히 밝히는 것은 나 자신을 속이지 않는 정직한 태도예요. 생성형 AI를 쓴 사실을 정직하게 밝힐 때 나의 노력이 더 빛나고 가치 있게 인정받을 수 있어요.",
      icon: Eye
    }
  ];

  // Check scroll completion
  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    
    // If user scrolled to 90% of the container, mark as read
    if (scrollTop + clientHeight >= scrollHeight - 50) {
      setScrolledToBottom(true);
    }
  };

  useEffect(() => {
    // Check initial layout to see if it doesn't scroll (already at bottom)
    const checkHeight = () => {
      if (containerRef.current) {
        const { scrollHeight, clientHeight } = containerRef.current;
        if (scrollHeight <= clientHeight) {
          setScrolledToBottom(true);
        }
      }
    };
    checkHeight();
    window.addEventListener("resize", checkHeight);
    return () => window.removeEventListener("resize", checkHeight);
  }, []);

  const handleConsent = () => {
    if (!scrolledToBottom) {
      alert("윤리 가이드를 아래로 스크롤하여 끝까지 읽어주세요.");
      return;
    }
    localStorage.setItem("ai_ethics_consent", "true");
    navigate(redirectPath);
  };

  return (
    <div className="ethics-page-container fade-in">
      <div className="ethics-header">
        <h1 className="gradient-text">초등 AI 윤리 핵심가이드</h1>
        <p className="ethics-subtitle">
          TaskFlow를 시작하기 전에, 안전하고 올바른 생성형 AI 사용을 위한 약속을 꼭 읽어주세요!
        </p>
      </div>

      <div 
        className="ethics-scroll-container glass-panel" 
        ref={containerRef} 
        onScroll={handleScroll}
      >
        <div className="guides-grid">
          {guides.map((guide) => {
            const IconComponent = guide.icon;
            return (
              <div key={guide.id} className="guide-card">
                <div className="guide-card-header">
                  <div className="guide-index-badge">가이드 {guide.id}</div>
                  <div className="guide-value-badges">
                    {guide.values.map((val, idx) => (
                      <span key={idx} className={`value-badge badge-${val.type}`}>
                        {val.name}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="guide-card-body">
                  <div className="guide-icon-wrapper">
                    <IconComponent size={28} />
                  </div>
                  <div className="guide-text-content">
                    <h3 className="guide-section-title">{guide.title}</h3>
                    <h4 className="guide-main-statement">{guide.subTitle}</h4>
                    <p className="guide-description">{guide.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="ethics-footer-actions">
        <div className="scroll-indicator-container">
          {!scrolledToBottom && (
            <p className="scroll-warning-text animate-pulse">
              💡 가이드를 아래로 스크롤하여 모두 읽어주세요.
            </p>
          )}
        </div>

        <button 
          onClick={handleConsent}
          className={`btn btn-lg consent-btn ${scrolledToBottom ? "btn-primary" : "btn-disabled"}`}
          disabled={!scrolledToBottom}
        >
          <Check size={20} style={{ marginRight: '8px' }} />
          <span>나는 윤리 핵심가이드를 빠짐없이 읽고 이를 실천하겠습니다.</span>
          <ArrowRight size={18} style={{ marginLeft: '12px' }} />
        </button>
      </div>
    </div>
  );
}
