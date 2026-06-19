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

export const DwTrainingHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'modules' | 'qc_feedback'>('modules');
  
  // Selection for Module Detail View
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

  // 6 Specified Training Modules
  const [modules, setModules] = useState<TrainingModule[]>([
    {
      id: 'm1',
      title: 'Product Knowledge',
      description: 'Master our three core subscriptions (Job Ready, Verified, Trusted) and benefits.',
      progress: 100,
      status: 'completed',
      assignedByQC: false,
      chapters: [
        { id: 'c1_1', title: 'Driver Subscription Tiers Overview', duration: '2:15', completed: true },
        { id: 'c1_2', title: 'Selling Point Differentiation', duration: '3:40', completed: true }
      ],
      quiz: [
        { id: 1, question: 'What is the pricing of the Verified Plan for Drivers?', options: ['₹199', '₹299', '₹499'], correctIdx: 1, explanation: 'The Verified Plan is priced at ₹299 for 3 months.' },
        { id: 2, question: 'Which plan offers 100% payment protection fund cover?', options: ['Job Ready', 'Verified', 'Trusted'], correctIdx: 2, explanation: 'The Trusted Plan (₹499) provides the Payment Protection guarantee.' }
      ]
    },
    {
      id: 'm2',
      title: 'Script Mastery',
      description: 'How to greet, transition, pitch, and close calls using standard protocols.',
      progress: 60,
      status: 'in_progress',
      assignedByQC: true, // QC Remediation assigned
      chapters: [
        { id: 'c2_1', title: 'Greeting & Dialogue Introduction', duration: '3:10', completed: true },
        { id: 'c2_2', title: 'Softphone Connect Techniques', duration: '2:45', completed: true },
        { id: 'c2_3', title: 'Price Plan Upsell Strategy', duration: '4:15', completed: false }
      ],
      quiz: [
        { id: 1, question: 'How should you open a driver welcome call?', options: ['Directly pitch the ₹499 plan', 'Friendly greeting and confirm call availability', 'Ask for payment information immediately'], correctIdx: 1, explanation: 'Always greet warmly and verify if it is a good time to speak.' },
        { id: 2, question: 'What is the QC-recommended call duration norm for DW callers?', options: ['2–8 minutes', '5–15 minutes', '10–30 minutes'], correctIdx: 0, explanation: 'The QC call duration guideline for Driver Welcome is 2 to 8 minutes.' },
        { id: 3, question: 'What is the immediate action after an agreement?', options: ['Close call and hang up', 'Trigger payment link via WhatsApp and explain steps', 'Transfer call to TL immediately'], correctIdx: 1, explanation: 'Always trigger the secure payment link and walk the driver through payment steps.' },
        { id: 4, question: 'What should be written in lead notes?', options: ['Driver salary expectations', 'Specific responses, objections, or next callbacks', 'No remarks needed'], correctIdx: 1, explanation: 'Always log specific conversation details for subsequent callback quality.' },
        { id: 5, question: 'How do you handle a driver requesting callback?', options: ['Insist on finishing call now', 'Confirm preferred date & time and save schedule', 'Discard the lead'], correctIdx: 1, explanation: 'Schedule a callback using the calendar tool to respect driver availability.' }
      ]
    },
    {
      id: 'm3',
      title: 'CRM Usage',
      description: 'Understanding queues, filter tabs, note fields, and callbacks scheduling.',
      progress: 0,
      status: 'not_started',
      assignedByQC: false,
      chapters: [
        { id: 'c3_1', title: 'Call Queue Mechanics', duration: '2:00', completed: false },
        { id: 'c3_2', title: 'Disposition Gates', duration: '3:30', completed: false }
      ],
      quiz: [
        { id: 1, question: 'Can you bypass the Post-Call Form after a call ends?', options: ['Yes, any time', 'No, it is a blocking gate', 'Only for callbacks'], correctIdx: 1, explanation: 'The Post-Call Form is a strict blocking modal to maintain data integrity.' }
      ]
    },
    {
      id: 'm4',
      title: 'Objection Handling',
      description: 'Handling price complaints, trust queries, competitor comparison, and app deletion.',
      progress: 0,
      status: 'not_started',
      assignedByQC: false,
      chapters: [
        { id: 'c4_1', title: 'Price objection resolutions', duration: '3:05', completed: false },
        { id: 'c4_2', title: 'Resolving competitor issues', duration: '2:50', completed: false }
      ],
      quiz: [
        { id: 1, question: 'What is the counter argument to "Price is too high"?', options: ['It is a business investment with quick ROI', 'Tell them to call competitor', 'Offer a discount immediately'], correctIdx: 0, explanation: 'Emphasize that the fee is an investment that yields multiples in job opportunities.' }
      ]
    },
    {
      id: 'm5',
      title: 'HR Policies',
      description: 'Attendance streak targets, base salary salary gates, and incentives policies.',
      progress: 0,
      status: 'locked', // locked until previous completed
      assignedByQC: false,
      chapters: [
        { id: 'c5_1', title: 'Base Salary salary gate explained', duration: '2:25', completed: false }
      ],
      quiz: []
    },
    {
      id: 'm6',
      title: 'QC Standards',
      description: 'Audit evaluation grids, compliance score thresholds, and Fatal Errors.',
      progress: 0,
      status: 'locked',
      assignedByQC: false,
      chapters: [
        { id: 'c6_1', title: 'Quality Audits Rubric Overview', duration: '3:10', completed: false }
      ],
      quiz: []
    }
  ]);

  // QC Audits list
  const [audits, setAudits] = useState<QCAudit[]>([
    {
      id: 'A_1029',
      score: 72,
      date: '17 Jun 2026',
      summary: 'Incorrect price quoted for Trusted Plan. Action required: complete Script Mastery course.',
      unread: true,
      rubric: [
        { criterion: 'Greeting Protocol', score: 10, max: 10, note: 'Polite and professional' },
        { criterion: 'Product Details Accuracy', score: 12, max: 20, note: 'Quoted wrong price for Trusted Plan' },
        { criterion: 'Objection Resolution', score: 15, max: 20, note: 'Need stronger ROI arguments' },
        { criterion: 'Finalizing Call Link', score: 15, max: 20, note: 'No follow up sent' },
        { criterion: 'Dispositions Logging', score: 20, max: 30, note: 'Correctly tagged' }
      ]
    },
    {
      id: 'A_0988',
      score: 88,
      date: '12 Jun 2026',
      summary: 'Excellent greeting. Good resolution of trust objection. Keep it up!',
      unread: false,
      rubric: [
        { criterion: 'Greeting Protocol', score: 10, max: 10, note: 'Polite' },
        { criterion: 'Product Details Accuracy', score: 18, max: 20, note: 'Clear specifications' },
        { criterion: 'Objection Resolution', score: 17, max: 20, note: 'Handled well' },
        { criterion: 'Finalizing Call Link', score: 18, max: 20, note: 'Proper closed' },
        { criterion: 'Dispositions Logging', score: 25, max: 30, note: 'Logged correctly' }
      ]
    }
  ]);

  const selectedModule = modules.find(m => m.id === selectedModuleId);

  const handleModuleClick = (m: TrainingModule) => {
    if (m.status === 'locked') {
      triggerToast('🔒 This module is locked. Complete prerequisites first.');
      return;
    }
    setSelectedModuleId(m.id);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScorePercent(null);
  };

  const handleQuizAnswer = (questionId: number, optionIdx: number) => {
    if (quizSubmitted) return;
    setQuizAnswers(prev => ({ ...prev, [questionId]: optionIdx }));
  };

  const handleQuizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedModule) return;
    
    // Check if all questions are answered
    if (Object.keys(quizAnswers).length < selectedModule.quiz.length) {
      triggerToast('Please answer all questions before submitting.');
      return;
    }

    let correctCount = 0;
    selectedModule.quiz.forEach(q => {
      if (quizAnswers[q.id] === q.correctIdx) {
        correctCount += 1;
      }
    });

    const percent = Math.round((correctCount / selectedModule.quiz.length) * 100);
    setQuizScorePercent(percent);
    setQuizSubmitted(true);

    if (percent >= 70) {
      triggerToast(`🎉 Quiz passed with ${percent}%! Module completed.`);
      
      // Update module progress & status
      setModules(prev => prev.map(m => {
        if (m.id === selectedModule.id) {
          const updatedModules = { ...m, progress: 100, status: 'completed' as const };
          return updatedModules;
        }
        return m;
      }));

      // Unlock next module
      const currentIndex = modules.findIndex(m => m.id === selectedModule.id);
      if (currentIndex !== -1 && currentIndex + 1 < modules.length) {
        const nextId = modules[currentIndex + 1].id;
        setModules(prev => prev.map(m => {
          if (m.id === nextId && m.status === 'locked') {
            return { ...m, status: 'not_started' as const };
          }
          return m;
        }));
      }

    } else {
      triggerToast(`❌ Quiz failed with ${percent}%. Review explanations and retry.`);
    }
  };

  const handleRetryQuiz = () => {
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScorePercent(null);
    triggerToast('Quiz reset. Good luck!');
  };

  const toggleChapterComplete = (moduleId: string, chapterId: string) => {
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
          progress: progress,
          status: progress === 100 ? 'completed' : 'in_progress'
        };
      }
      return m;
    }));
  };

  const handleAuditClick = (id: string) => {
    setAudits(prev => prev.map(a => a.id === id ? { ...a, unread: false } : a));
    triggerToast(`Viewing QC Feedback Audit ${id}`);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto w-full p-4 overflow-y-auto max-h-[calc(100vh-60px)] relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-1.5 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-[#27AE60]"></span>
          {toastMessage}
        </div>
      )}

      {/* Probation Warning Banner */}
      <section className="bg-[#FFF9E6] border border-[#F2C94C] p-3 rounded-xl text-xs text-[#D35400] flex justify-between items-center select-none shrink-0">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px]">info</span>
          <span className="font-bold">Probation — Month 1 of 3:</span>
          <span>Complete 3 modules + hit 80% of conversion target to progress toward confirmation.</span>
        </div>
        <button 
          onClick={() => triggerToast('HR policies summary link')}
          className="underline font-bold text-[#D35400] hover:text-[#a04000]"
        >
          View Details
        </button>
      </section>

      {/* Header and Tab switcher */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <p className="text-[#666666] text-xs font-semibold uppercase tracking-widest">Training Portal</p>
          <h2 className="text-2xl font-bold text-gray-800">Learning Center & QC Feedback</h2>
        </div>

        <div className="bg-gray-100 p-1 rounded-lg flex items-center gap-1 select-none">
          <button
            onClick={() => { setActiveTab('modules'); setSelectedModuleId(null); }}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition-all ${activeTab === 'modules' ? 'bg-white text-gray-800 shadow-sm font-bold' : 'text-gray-500 hover:text-gray-800'}`}
          >
            Training Modules
          </button>
          <button
            onClick={() => { setActiveTab('qc_feedback'); setSelectedModuleId(null); }}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition-all ${activeTab === 'qc_feedback' ? 'bg-white text-gray-800 shadow-sm font-bold' : 'text-gray-500 hover:text-gray-800'}`}
          >
            QC Feedback Inbox
          </button>
        </div>
      </section>

      {/* TABS CONTAINER */}
      {!selectedModule ? (
        activeTab === 'modules' ? (
          /* MODULE GRID */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in duration-300">
            {modules.map(m => {
              let badgeStyle = 'bg-gray-100 text-gray-500';
              if (m.status === 'in_progress') badgeStyle = 'bg-orange-50 text-orange-600 border border-orange-100';
              else if (m.status === 'completed') badgeStyle = 'bg-[#EAFAF1] text-[#27AE60] border border-[#27AE60]/20';
              else if (m.status === 'locked') badgeStyle = 'bg-gray-50 text-gray-400';

              return (
                <div 
                  key={m.id}
                  onClick={() => handleModuleClick(m)}
                  className={`bg-white border rounded-xl p-4 flex flex-col justify-between shadow-sm relative transition-all duration-200 ${
                    m.status === 'locked' 
                      ? 'border-gray-150 cursor-not-allowed opacity-65' 
                      : 'border-gray-200 cursor-pointer hover:border-[#27AE60] hover:shadow'
                  }`}
                >
                  {/* Remediation alert flag */}
                  {m.assignedByQC && (
                    <span className="absolute -top-2.5 left-4 bg-red-500 text-white text-[8px] font-bold px-2 py-0.5 rounded shadow-sm border border-red-400 animate-pulse">
                      Assigned by QC Analyst — required
                    </span>
                  )}

                  <div className="mb-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-sm font-bold text-gray-800">{m.title}</h3>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${badgeStyle}`}>
                        {m.status === 'locked' && '🔒 '}
                        {m.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{m.description}</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-gray-400 font-semibold">
                      <span>Progress</span>
                      <span>{m.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${m.status === 'completed' ? 'bg-[#27AE60]' : 'bg-orange-500'}`} 
                        style={{ width: `${m.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* QC FEEDBACK INBOX */
          <div className="space-y-4 animate-in fade-in duration-300 max-w-2xl mx-auto">
            {audits.map(audit => (
              <div 
                key={audit.id}
                onClick={() => handleAuditClick(audit.id)}
                className={`bg-white border rounded-xl p-4 cursor-pointer hover:border-red-400 transition-colors shadow-sm relative ${
                  audit.unread ? 'border-red-300 bg-red-50/10' : 'border-gray-200'
                }`}
              >
                {audit.unread && (
                  <span className="absolute right-3 top-3 w-2.5 h-2.5 bg-red-600 rounded-full" title="Unread Alert"></span>
                )}

                <div className="flex justify-between items-center border-b border-gray-100 pb-2 mb-3">
                  <div className="text-xs text-gray-500 font-bold">Audit Ref: {audit.id} · {audit.date}</div>
                  <div className={`text-sm font-extrabold px-2 py-0.5 rounded ${
                    audit.score >= 80 ? 'bg-[#EAFAF1] text-[#27AE60]' : 'bg-red-50 text-red-500'
                  }`}>
                    Score: {audit.score}/100
                  </div>
                </div>

                <p className="text-xs text-gray-600 font-medium leading-relaxed">{audit.summary}</p>

                {/* Expanded details */}
                {!audit.unread && (
                  <div className="mt-4 pt-3 border-t border-gray-100 space-y-3 animate-in fade-in duration-300">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">QC Assessment Rubric Breakdown</div>
                    
                    <div className="space-y-2 text-xs text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-150">
                      {audit.rubric.map((r, i) => (
                        <div key={i} className="flex justify-between py-1 border-b border-gray-200/50 last:border-0">
                          <div>
                            <span className="font-semibold block text-gray-800">{r.criterion}</span>
                            <span className="text-[10px] text-gray-400">{r.note}</span>
                          </div>
                          <span className="font-mono font-bold text-gray-700">{r.score} / {r.max}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      ) : (
        /* MODULE DETAIL & CURRICULUM DRAWER */
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md animate-in slide-in-from-bottom-4 duration-300">
          
          {/* Header Row */}
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <div>
              <span className="text-[10px] text-[#27AE60] font-bold uppercase tracking-wider">Active Module Study</span>
              <h3 className="text-base font-bold text-gray-800">{selectedModule.title}</h3>
            </div>
            <button 
              onClick={() => setSelectedModuleId(null)}
              className="px-3 py-1.5 border border-gray-200 text-gray-500 rounded hover:bg-gray-100 text-xs font-semibold"
            >
              ← Back to Modules
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
            
            {/* Chapters & Video Section */}
            <div className="md:col-span-2 p-5 space-y-4">
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Curriculum Chapters</h4>
              
              {/* Mock Video Canvas */}
              <div className="aspect-video bg-gray-900 rounded-xl relative flex flex-col items-center justify-center text-white overflow-hidden shadow-inner">
                <span className="material-symbols-outlined text-4xl text-white/80 animate-pulse cursor-pointer">play_circle</span>
                <span className="text-[11px] text-white/60 font-semibold mt-2">Study Video Clip — 3:45 Duration</span>
                
                <div className="absolute bottom-2 left-2 right-2 flex justify-between text-[10px] text-white/40">
                  <span>Product Knowledge 101.mp4</span>
                  <span>720p HD</span>
                </div>
              </div>

              {/* Checkboxes List */}
              <div className="space-y-2 text-xs">
                {selectedModule.chapters.map(c => (
                  <div 
                    key={c.id}
                    onClick={() => toggleChapterComplete(selectedModule.id, c.id)}
                    className="flex items-center justify-between p-2.5 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={c.completed} 
                        onChange={() => {}} // handled by click
                        className="rounded text-[#27AE60] focus:ring-[#27AE60] border-gray-300 w-3.5 h-3.5"
                      />
                      <span className={`font-semibold ${c.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                        {c.title}
                      </span>
                    </div>
                    <span className="font-mono text-gray-400 text-[10px]">{c.duration}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quiz Column */}
            <div className="p-5 bg-gray-50/50">
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-4">Module Quiz Evaluation</h4>
              
              {selectedModule.quiz.length > 0 ? (
                !quizSubmitted ? (
                  <form onSubmit={handleQuizSubmit} className="space-y-4">
                    {selectedModule.quiz.map((q, idx) => (
                      <div key={q.id} className="space-y-2 text-xs">
                        <div className="font-semibold text-gray-800">
                          {idx + 1}. {q.question}
                        </div>
                        <div className="space-y-1.5 pl-2">
                          {q.options.map((opt, optIdx) => (
                            <label 
                              key={optIdx} 
                              className={`flex items-center gap-2 p-2 bg-white rounded border cursor-pointer hover:bg-gray-50 transition-colors ${
                                quizAnswers[q.id] === optIdx ? 'border-[#27AE60] bg-[#EAFAF1]/20 font-semibold' : 'border-gray-200'
                              }`}
                            >
                              <input 
                                type="radio" 
                                name={`q_${q.id}`} 
                                checked={quizAnswers[q.id] === optIdx}
                                onChange={() => handleQuizAnswer(q.id, optIdx)}
                                className="text-[#27AE60] focus:ring-[#27AE60] w-3 h-3"
                              />
                              <span>{opt}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                    
                    <button
                      type="submit"
                      className="w-full bg-[#27AE60] hover:bg-[#219653] text-white py-2 rounded-lg font-bold text-xs uppercase shadow transition-all active:scale-[0.98] mt-2"
                    >
                      Submit Quiz
                    </button>
                  </form>
                ) : (
                  /* Quiz Result and Review */
                  <div className="space-y-4 animate-in fade-in duration-300 text-xs">
                    <div className={`p-4 rounded-xl text-center border font-bold ${
                      quizScorePercent !== null && quizScorePercent >= 70
                        ? 'bg-[#EAFAF1] border-[#27AE60] text-[#27AE60]'
                        : 'bg-red-50 border-red-200 text-red-600'
                    }`}>
                      <div className="text-xl">{quizScorePercent}% Score</div>
                      <div className="text-[10px] uppercase tracking-wider mt-1">
                        {quizScorePercent !== null && quizScorePercent >= 70 ? '✓ Prerequisite Passed' : '✗ Failed (Min 70% required)'}
                      </div>
                    </div>

                    {/* Explanations List */}
                    <div className="space-y-3">
                      {selectedModule.quiz.map((q, idx) => {
                        const isCorrect = quizAnswers[q.id] === q.correctIdx;
                        return (
                          <div key={q.id} className="p-3 bg-white border border-gray-150 rounded-lg">
                            <div className="font-semibold text-gray-800 mb-1">{idx + 1}. {q.question}</div>
                            <div className="text-gray-500 text-[10px]">
                              Your Ans: <span className={isCorrect ? 'text-[#27AE60] font-bold' : 'text-red-500 font-bold'}>
                                {q.options[quizAnswers[q.id]]}
                              </span>
                            </div>
                            <div className="text-[10px] text-gray-400 mt-1 italic">{q.explanation}</div>
                          </div>
                        );
                      })}
                    </div>

                    {quizScorePercent !== null && quizScorePercent < 70 ? (
                      <button
                        onClick={handleRetryQuiz}
                        className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-bold text-xs uppercase transition-colors"
                      >
                        Retry Quiz
                      </button>
                    ) : (
                      <button
                        onClick={() => setSelectedModuleId(null)}
                        className="w-full bg-gray-800 hover:bg-gray-900 text-white py-2 rounded-lg font-bold text-xs uppercase transition-colors"
                      >
                        Back to modules list
                      </button>
                    )}
                  </div>
                )
              ) : (
                <p className="text-xs text-gray-400 italic py-4">No quiz available for this reference module.</p>
              )}
            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default DwTrainingHub;
