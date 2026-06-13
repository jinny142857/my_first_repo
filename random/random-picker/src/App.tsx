import { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { GachaCapsule } from './components/GachaCapsule';
import { TeacherSettingsModal } from './components/TeacherSettingsModal';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { AppState } from './types';
import './App.css';

interface CapsuleData {
  id: string;
  name: string;
  isOpened: boolean;
}

function App() {
  const [appState, setAppState] = useLocalStorage<AppState>('randomPickerState', {
    students: [],
    fixedResults: {},
    drawCount: 0
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [extractCount, setExtractCount] = useState<number>(1);
  const [capsules, setCapsules] = useState<CapsuleData[]>([]);

  // Ctrl+Shift+T keyboard shortcut for settings
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 't') {
        setIsModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleDraw = () => {
    if (appState.students.length === 0) {
      alert("선생님 설정에서 학생 명단을 먼저 추가해주세요.");
      return;
    }
    
    const nextDrawCount = appState.drawCount + 1;
    let selectedStudents: string[] = [];

    if (appState.fixedResults[nextDrawCount]) {
      selectedStudents.push(appState.fixedResults[nextDrawCount]);
      if (extractCount > 1) {
        const remainingStudents = appState.students.filter(s => s !== appState.fixedResults[nextDrawCount]);
        const shuffled = [...remainingStudents].sort(() => 0.5 - Math.random());
        selectedStudents = selectedStudents.concat(shuffled.slice(0, extractCount - 1));
      }
    } else {
      const shuffled = [...appState.students].sort(() => 0.5 - Math.random());
      selectedStudents = shuffled.slice(0, Math.min(extractCount, appState.students.length));
    }

    const newCapsules: CapsuleData[] = selectedStudents.map((name, index) => ({
      id: `capsule-${Date.now()}-${index}`,
      name,
      isOpened: false
    }));

    setCapsules(newCapsules);
    
    setAppState(prev => ({
      ...prev,
      drawCount: nextDrawCount
    }));
  };

  const handleOpenCapsule = (id: string) => {
    setCapsules(prev => 
      prev.map(capsule => 
        capsule.id === id ? { ...capsule, isOpened: true } : capsule
      )
    );
  };

  const handleSaveSettings = (newStudents: string[], newFixedResults: Record<number, string>) => {
    setAppState(prev => ({
      ...prev,
      students: newStudents,
      fixedResults: newFixedResults
    }));
  };

  const handleResetDrawCount = () => {
    if (confirm("뽑기 횟수를 초기화하시겠습니까? (비밀 조작 순서가 1부터 다시 시작됩니다)")) {
      setAppState(prev => ({
        ...prev,
        drawCount: 0
      }));
      setCapsules([]);
    }
  };

  return (
    <div className="app-container">
      <div className="glass-panel main-panel">
        <h1>발표자 랜덤 뽑기</h1>
        <p className="subtitle">
          현재까지 뽑은 인원: <span className="highlight">{appState.drawCount}</span>명
        </p>

        <div className="capsules-wrapper" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px', width: '100%', margin: '2rem 0', minHeight: '150px' }}>
          {capsules.length === 0 ? (
            <p style={{ color: '#94a3b8', marginTop: '50px' }}>아직 뽑힌 구슬이 없습니다.</p>
          ) : (
            capsules.map((capsule, index) => (
              <GachaCapsule
                key={capsule.id}
                id={capsule.id}
                name={capsule.name}
                isOpened={capsule.isOpened}
                onOpen={handleOpenCapsule}
                delayIndex={index}
              />
            ))
          )}
        </div>

        <div className="controls">
          <div className="count-control">
            <label htmlFor="extractCount">뽑을 인원: </label>
            <input 
              id="extractCount"
              type="number" 
              min="1" 
              max={appState.students.length > 0 ? appState.students.length : 1}
              value={extractCount}
              onChange={(e) => setExtractCount(Math.max(1, Number(e.target.value)))}
              disabled={appState.students.length === 0}
              className="extract-input"
            />
            <span>명</span>
          </div>
          
          <button 
            className="draw-button" 
            onClick={handleDraw} 
            disabled={appState.students.length === 0}
          >
            발표자 뽑기!
          </button>
          
          {appState.drawCount > 0 && (
            <button className="reset-button" onClick={handleResetDrawCount}>
              횟수 초기화
            </button>
          )}
        </div>
      </div>

      <button className="hidden-settings-btn" onClick={() => setIsModalOpen(true)} title="설정 (Ctrl+Shift+T)">
        <Settings size={20} />
      </button>

      <TeacherSettingsModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        initialStudents={appState.students}
        initialFixedResults={appState.fixedResults}
        onSave={handleSaveSettings}
      />
    </div>
  );
}

export default App;
