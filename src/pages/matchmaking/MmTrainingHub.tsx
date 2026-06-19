import React, { useState } from 'react';

interface Chapter {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
}

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIdx: number;
  explanation: string;
}

interface TrainingModule {
  id: string;
  title: string;
  description: string;
  progress: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'locked';
  assignedByQC: boolean;
  chapters: Chapter[];
  quiz: QuizQuestion[];
}

interface QCAudit {
  id: string;
  score: number;
  date: string;
  summary: string;
  unread: boolean;
  rubric: { criterion: string; score: number; max: number; note: string }[];
}

export const MmTrainingHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'modules' | 'qc_feedback'>('modules');
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);

  // Active Quiz State
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScorePercent, setQuizScorePercent] = useState<number | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Matchmaking specific training modules
  const [modules, setModules] = useState<TrainingModule[]>([
    {
      id: 'm1',
      title: 'Understanding Job Requirements',
      description: 'Master how to read a shipper\'s posted job, extract key details (route, truck type, HMV license class), and understand SLA requirements.',
      progress: 100,
      status: 'completed',
      assignedByQC: false,
      chapters: [
        { id: 'c1_1', title: 'Route Extraction & Cargo Types', duration: '2:15', completed: true },
        { id: 'c1_2', title: 'License Matching Classifications', duration: '3:05', completed: true }
      ],
      quiz: [
        { id: 1, question: 'What is the SLA target for filling a Super Premium job posting?', options: ['10 days', '7 days', '15 days'], correctIdx: 1, explanation: 'The target SLA for a Super Premium job is 7 days, whereas Premium is 10 days.' },
        { id: 2, question: 'Which license type is required to match heavy multi-axle trailers?', options: ['LMV class', 'HMV class', 'MCV class'], correctIdx: 1, explanation: 'HMV (Heavy Motor Vehicle) license class is required for long-haul heavy trailers.' }
      ]
    },
    {
      id: 'm2',
      title: 'Driver-Job Matching Logic',
      description: 'Learn how to query the Driver Search database and rank matches by route compatibility and active availability.',
      progress: 50,
      status: 'in_progress',
      assignedByQC: true, // QC remediation required
      chapters: [
        { id: 'c2_1', title: 'Sourcing filters: Route states', duration: '3:40', completed: true },
        { id: 'c2_2', title: 'Analyzing Match % calculations', duration: '2:50', completed: false }
      ],
      quiz: [
        { id: 1, question: 'How is the Match % calculated in Driver Search?', options: ['Based on driver age only', 'Based on route overlap, truck type, and license compatibility', 'It is randomly generated'], correctIdx: 1, explanation: 'Match % ranks candidates by comparing route preferences, truck segments, and license requirements.' }
      ]
    },
    {
      id: 'm3',
      title: '3-Way Intro Best Practices',
      description: 'Understanding how to introduce driver and transporter dispatchers on WhatsApp and confirm joining dates.',
      progress: 0,
      status: 'not_started',
      assignedByQC: false,
      chapters: [
        { id: 'c3_1', title: 'WhatsApp Group setup rules', duration: '2:40', completed: false },
        { id: 'c3_2', title: 'Following up within 24 hours', duration: '3:15', completed: false }
      ],
      quiz: [
        { id: 1, question: 'Within what timeframe must you follow up on a 3-way WhatsApp group intro?', options: ['24 hours', '48 hours', '1 week'], correctIdx: 0, explanation: 'To prevent leads going cold, follow-up must happen within 24 hours.' }
      ]
    }
  ]);

  // Simulated QC Audits list
  const audits: QCAudit[] = [
    {
      id: 'A_8812',
      score: 72,
      date: '17 Jun 2026',
      summary: 'Incorrectly pitched route details to candidate. Quoted wrong ADVANCE payment for JD-12034. Action: Complete driver-job matching training.',
      unread: true,
      rubric: [
        { criterion: 'Greeting Protocol', score: 9, max: 10, note: 'Polite and clear opening' },
        { criterion: 'Job Context Chip Compliance', score: 6, max: 20, note: 'Fumbled job details mid-call (did not consult Context Chip)' },
        { criterion: 'Objection Resolution', score: 14, max: 20, note: 'Needs more study on Hindi Devanagari script response trees' },
        { criterion: 'SLA Speed Fill', score: 18, max: 20, note: 'On track for EOD targets' }
      ]
    }
  ];

  const handleToggleChapter = (moduleId: string, chapterId: string) => {
    setModules(prev => prev.map(m => {
      if (m.id === moduleId) {
        const updatedChapters = m.chapters.map(c => 
          c.id === chapterId ? { ...c, completed: !c.completed } : c
        );
        const completedCount = updatedChapters.filter(c => c.completed).length;
        const progress = Math.round((completedCount / updatedChapters.length) * 100);
        return {
          ...m,
          chapters: updatedChapters,
          progress,
          status: progress === 100 ? 'completed' : 'in_progress'
        };
      }
      return m;
    }));
  };

  const handleAnswerSelect = (questionId: number, optionIdx: number) => {
    setQuizAnswers(prev => ({ ...prev, [questionId]: optionIdx }));
  };

  const handleQuizSubmit = (module: TrainingModule) => {
    let correctCount = 0;
    module.quiz.forEach(q => {
      if (quizAnswers[q.id] === q.correctIdx) {
        correctCount++;
      }
    });

    const percent = Math.round((correctCount / module.quiz.length) * 100);
    setQuizScorePercent(percent);
    setQuizSubmitted(true);

    if (percent >= 70) {
      triggerToast(`Quiz Passed! Score: ${percent}% ✓`);
    } else {
      triggerToast(`Quiz Failed. Score: ${percent}% (Needs ≥70%) ⚠️`);
    }
  };

  const selectedModule = modules.find(m => m.id === selectedModuleId);

  return (
    <main className="flex h-[calc(100vh-60px)] bg-white overflow-hidden relative text-xs">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-1.5 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-[#8E44AD]"></span>
          {toastMessage}
        </div>
      )}

      {/* Left Navigation Sidebar */}
      <aside className="w-56 bg-gray-50 border-r border-gray-200 p-4 flex flex-col justify-between shrink-0">
        <div className="space-y-4">
          <h3 className="text-xs font-extrabold text-gray-800 uppercase tracking-wide border-b border-gray-200 pb-2">
            Caller Training Hub
          </h3>

          <div className="flex flex-col gap-2 font-bold text-gray-450 select-none">
            <button
              onClick={() => { setActiveTab('modules'); setSelectedModuleId(null); }}
              className={`flex items-center gap-2 p-2.5 rounded-lg text-left transition-colors ${
                activeTab === 'modules' ? 'bg-purple-100 text-[#7D3C98]' : 'hover:bg-gray-100 hover:text-gray-700'
              }`}
            >
              <span className="material-symbols-outlined text-sm">school</span>
              <span>Training Modules</span>
            </button>

            <button
              onClick={() => { setActiveTab('qc_feedback'); setSelectedModuleId(null); }}
              className={`flex items-center gap-2 p-2.5 rounded-lg text-left transition-colors ${
                activeTab === 'qc_feedback' ? 'bg-purple-100 text-[#7D3C98]' : 'hover:bg-gray-100 hover:text-gray-700'
              }`}
            >
              <span className="material-symbols-outlined text-sm">verified_user</span>
              <span>QC Feedback Audits</span>
            </button>
          </div>
        </div>

        {/* Conditional probation banner */}
        <div className="bg-purple-50 border border-purple-200 p-3 rounded-xl select-none">
          <span className="text-[10px] font-extrabold text-purple-750 uppercase tracking-wider block">Probationary Period</span>
          <p className="text-[9.5px] text-gray-450 leading-relaxed mt-1">
            Complete all assigned remediation modules to successfully pass the probation review checkpoint.
          </p>
        </div>
      </aside>

      {/* Main Workspace (Modules/Details) */}
      <section className="flex-1 flex flex-col overflow-hidden bg-white">
        
        {activeTab === 'modules' && !selectedModuleId && (
          <div className="p-6 overflow-y-auto space-y-4">
            <h3 className="text-xs font-extrabold text-gray-800 uppercase tracking-wide">Available Sourcing Modules</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {modules.map(m => (
                <div 
                  key={m.id}
                  onClick={() => { setSelectedModuleId(m.id); setQuizSubmitted(false); setQuizAnswers({}); setQuizScorePercent(null); }}
                  className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between min-h-[140px] relative"
                >
                  {m.assignedByQC && (
                    <span className="absolute top-2.5 right-2.5 bg-red-100 text-red-700 text-[8.5px] font-black px-1.5 py-0.5 rounded-full animate-pulse border border-red-200">
                      QC ASSIGNED REMEDIATION
                    </span>
                  )}
                  <div>
                    <h4 className="font-extrabold text-gray-800 text-xs">{m.title}</h4>
                    <p className="text-[10.5px] text-gray-400 font-semibold leading-relaxed mt-1.5">{m.description}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center text-[10px]">
                    <div className="flex items-center gap-1.5 flex-1 max-w-[120px]">
                      <div className="w-full bg-gray-150 h-1 rounded-full overflow-hidden">
                        <div className="bg-[#8E44AD] h-full" style={{ width: `${m.progress}%` }}></div>
                      </div>
                      <span className="font-bold text-gray-500">{m.progress}%</span>
                    </div>

                    <span className="text-[#8E44AD] font-bold hover:underline">Start Course →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Module Detail View */}
        {activeTab === 'modules' && selectedModule && (
          <div className="flex-1 flex overflow-hidden">
            {/* Chapters list (left) */}
            <div className="w-72 border-r border-gray-250 p-4 space-y-4 overflow-y-auto shrink-0 bg-gray-50/30">
              <button 
                onClick={() => setSelectedModuleId(null)}
                className="text-gray-500 hover:text-gray-800 font-bold flex items-center gap-0.5 mb-2"
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span> Back to Modules
              </button>

              <h3 className="font-extrabold text-gray-800 text-xs">{selectedModule.title}</h3>
              <p className="text-[10.5px] text-gray-450 leading-relaxed">{selectedModule.description}</p>

              <div className="space-y-2 pt-2 border-t border-gray-150">
                <span className="text-[9.5px] font-bold text-gray-400 uppercase tracking-wider block">CHAPTERS LIST</span>
                <div className="space-y-1.5">
                  {selectedModule.chapters.map(c => (
                    <label key={c.id} className="flex justify-between items-center p-2 bg-white border border-gray-150 rounded-lg cursor-pointer hover:bg-gray-50">
                      <div className="flex items-center gap-2 font-semibold text-gray-700">
                        <input 
                          type="checkbox" 
                          checked={c.completed}
                          onChange={() => handleToggleChapter(selectedModule.id, c.id)}
                          className="rounded text-[#8E44AD] focus:ring-[#8E44AD]"
                        />
                        <span className="truncate max-w-[150px]">{c.title}</span>
                      </div>
                      <span className="font-mono text-gray-400 text-[10px]">{c.duration}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Video & Quiz Panel (right) */}
            <div className="flex-1 p-6 overflow-y-auto space-y-5">
              
              {/* Video Player */}
              <div className="aspect-video w-full max-w-lg bg-gray-900 rounded-xl relative overflow-hidden flex items-center justify-center text-white select-none">
                <div className="text-center space-y-2">
                  <span className="material-symbols-outlined text-4xl cursor-pointer hover:scale-110 transition-transform">play_circle</span>
                  <p className="font-bold">Play Sourcing Video Tutorial</p>
                  <p className="text-[10px] text-gray-400 font-mono">Module {selectedModule.id} · Chapter 2</p>
                </div>
              </div>

              {/* Quiz questions */}
              <div className="space-y-4 pt-4 border-t border-gray-150">
                <div className="flex justify-between items-center">
                  <h4 className="text-[10px] font-extrabold text-gray-450 uppercase tracking-wider">Module Remediation Quiz</h4>
                  {quizScorePercent !== null && (
                    <span className={`font-bold px-2 py-0.5 rounded ${
                      quizScorePercent >= 70 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700 animate-pulse'
                    }`}>
                      Score: {quizScorePercent}% {quizScorePercent >= 70 ? '(PASS ✓)' : '(FAIL ⚠️)'}
                    </span>
                  )}
                </div>

                <div className="space-y-3">
                  {selectedModule.quiz.map(q => {
                    const selectedIdx = quizAnswers[q.id];
                    return (
                      <div key={q.id} className="bg-gray-50 border border-gray-150 p-4 rounded-xl space-y-3">
                        <p className="font-bold text-gray-800">{q.id}. {q.question}</p>
                        
                        <div className="grid grid-cols-1 gap-2">
                          {q.options.map((opt, oIdx) => {
                            const isSelected = selectedIdx === oIdx;
                            const isCorrect = q.correctIdx === oIdx;
                            let btnStyle = 'border-gray-200 hover:bg-gray-100 text-gray-700 bg-white';
                            
                            if (quizSubmitted) {
                              if (isCorrect) btnStyle = 'bg-green-50 border-green-500 text-green-700 font-bold';
                              else if (isSelected) btnStyle = 'bg-red-50 border-red-500 text-red-700';
                            } else if (isSelected) {
                              btnStyle = 'bg-purple-100 border-[#8E44AD] text-[#7D3C98] font-bold';
                            }

                            return (
                              <button
                                key={oIdx}
                                type="button"
                                disabled={quizSubmitted}
                                onClick={() => handleAnswerSelect(q.id, oIdx)}
                                className={`text-left p-2.5 rounded-lg border text-xs transition-all ${btnStyle}`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>

                        {quizSubmitted && (
                          <p className="text-[10px] text-gray-500 font-semibold leading-relaxed mt-2 p-2 bg-white rounded border border-gray-100">
                            💡 Explanation: {q.explanation}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>

                {!quizSubmitted ? (
                  <button
                    onClick={() => handleQuizSubmit(selectedModule)}
                    className="bg-[#8E44AD] hover:bg-[#7D3C98] text-white px-5 py-2.5 rounded-xl font-bold shadow-md shadow-purple-150 transition-all active:scale-95 text-xs"
                  >
                    Submit Quiz Answers
                  </button>
                ) : (
                  <button
                    onClick={() => { setQuizSubmitted(false); setQuizAnswers({}); setQuizScorePercent(null); }}
                    className="bg-white border border-gray-200 text-gray-500 px-5 py-2.5 rounded-xl font-bold hover:bg-gray-100 transition-all text-xs"
                  >
                    Retry Quiz
                  </button>
                )}
              </div>

            </div>
          </div>
        )}

        {/* QC Feedback Audits list */}
        {activeTab === 'qc_feedback' && (
          <div className="p-6 overflow-y-auto space-y-4">
            <h3 className="text-xs font-extrabold text-gray-800 uppercase tracking-wide">Quality Control Performance Audits</h3>
            
            {audits.map(audit => (
              <div key={audit.id} className="bg-white border border-gray-250 rounded-xl p-4 shadow-sm space-y-3">
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-850 text-xs">Audit Ref: {audit.id}</span>
                      <span className={`text-[8.5px] font-black px-1.5 py-0.5 rounded-full border uppercase ${
                        audit.unread ? 'bg-red-50 text-red-700 border-red-200 animate-pulse' : 'bg-gray-100 text-gray-500 border-gray-200'
                      }`}>
                        {audit.unread ? 'NEW UNREAD' : 'Audited'}
                      </span>
                    </div>
                    <span className="text-gray-400 block text-[9.5px] font-semibold mt-0.5">Audited on: {audit.date}</span>
                  </div>

                  <span className="text-xl font-extrabold text-red-600">{audit.score}% Score</span>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center select-none font-bold text-gray-500">
                  {audit.rubric.map((rub, i) => (
                    <div key={i} className="bg-gray-50 p-2 border border-gray-150 rounded">
                      <span className="text-gray-400 block text-[9px] uppercase">{rub.criterion}</span>
                      <span className="text-xs text-gray-800 font-extrabold">{rub.score} / {rub.max}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-gray-50/50 p-2.5 rounded border border-gray-150 text-gray-700 leading-relaxed font-semibold italic">
                  "{audit.summary}"
                </div>
              </div>
            ))}
          </div>
        )}

      </section>

    </main>
  );
};

export default MmTrainingHub;
