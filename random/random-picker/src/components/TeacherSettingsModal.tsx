import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import styles from './TeacherSettingsModal.module.css';

interface TeacherSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialStudents: string[];
  initialFixedResults: Record<number, string>;
  onSave: (students: string[], fixedResults: Record<number, string>) => void;
}

export const TeacherSettingsModal: React.FC<TeacherSettingsModalProps> = ({
  isOpen,
  onClose,
  initialStudents,
  initialFixedResults,
  onSave
}) => {
  const [studentsInput, setStudentsInput] = useState('');
  const [fixedResults, setFixedResults] = useState<{ drawIndex: number; name: string }[]>([]);

  useEffect(() => {
    if (isOpen) {
      setStudentsInput(initialStudents.join('\n'));
      const fixedArray = Object.entries(initialFixedResults).map(([key, value]) => ({
        drawIndex: Number(key),
        name: value
      }));
      setFixedResults(fixedArray);
    }
  }, [isOpen, initialStudents, initialFixedResults]);

  if (!isOpen) return null;

  const handleSave = () => {
    const studentsArray = studentsInput
      .split('\n')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const newFixedResults: Record<number, string> = {};
    fixedResults.forEach(item => {
      if (item.drawIndex > 0 && item.name.trim() !== '') {
        newFixedResults[item.drawIndex] = item.name.trim();
      }
    });

    onSave(studentsArray, newFixedResults);
    onClose();
  };

  const handleAddFixedResult = () => {
    setFixedResults([...fixedResults, { drawIndex: 1, name: '' }]);
  };

  const handleFixedResultChange = (index: number, field: 'drawIndex' | 'name', value: string | number) => {
    const updated = [...fixedResults];
    updated[index] = { ...updated[index], [field]: value };
    setFixedResults(updated);
  };

  const handleRemoveFixedResult = (index: number) => {
    setFixedResults(fixedResults.filter((_, i) => i !== index));
  };

  return (
    <div className={styles['modal-overlay']} onClick={onClose}>
      <div className={styles['modal-content']} onClick={e => e.stopPropagation()}>
        <div className={styles['modal-header']}>
          <h2>선생님 전용 설정</h2>
          <button className={styles['close-button']} onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className={styles['form-group']}>
          <label>학생 명단 (엔터로 구분)</label>
          <textarea 
            value={studentsInput}
            onChange={(e) => setStudentsInput(e.target.value)}
            placeholder="홍길동&#10;김철수&#10;이영희"
          />
        </div>

        <div className={styles['form-group']}>
          <label>비밀 조작 설정 (N번째 뽑기에 특정 학생 고정)</label>
          <div className={styles['fixed-results-list']}>
            {fixedResults.map((item, index) => (
              <div key={index} className={styles['fixed-result-item']}>
                <input 
                  type="number" 
                  min="1"
                  value={item.drawIndex}
                  onChange={(e) => handleFixedResultChange(index, 'drawIndex', Number(e.target.value))}
                  placeholder="순서"
                />
                <span>번째:</span>
                <input 
                  type="text" 
                  value={item.name}
                  onChange={(e) => handleFixedResultChange(index, 'name', e.target.value)}
                  placeholder="학생 이름"
                />
                <button 
                  className={styles['close-button']}
                  onClick={() => handleRemoveFixedResult(index)}
                  title="삭제"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
          <button className={styles['add-button']} onClick={handleAddFixedResult}>
            + 조작 추가
          </button>
        </div>

        <button className={styles['save-button']} onClick={handleSave}>
          저장
        </button>
      </div>
    </div>
  );
};
