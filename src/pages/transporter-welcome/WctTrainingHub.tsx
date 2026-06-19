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

export const WctTrainingHub: React.FC = () => {
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

  // Transporter Welcome specific modules
  const [modules, setModules] = useState<TrainingModule[]>([
    {
      id: 'm1',
      title: 'Understanding Fleet Profiles',
      description: 'Master the nuances of different fleet sizes, from single truck owner-operators to enterprise asset-heavy fleets.',
      progress: 100,
      status: 'completed',
      assignedByQC: false,
      chapters: [
        { id: 'c1_1', title: 'Fleet Sizing Overview (Owner vs Fleet)', duration: '2:40', completed: true },
        { id: 'c1_2', title: 'Route Segments & Cargo Matching', duration: '3:15', completed: true }
      ],
      quiz: [
        { id: 1, question: 'For a transporter with 8 trucks, which plan is recommended?', options: ['Free Plan', 'Premium (₹1,999)', 'Super Premium (₹2,999)'], correctIdx: 1, explanation: 'The Premium Plan is standard and recommended for fleet sizes between 3-10 trucks.' },
        { id: 2, question: 'Which segment is typical for long-haul national routes?', options: ['Chola / Tata Ace', '32ft Containers / Multi-Axle Trucks', 'E-Rickshaw Cargo'], correctIdx: 1, explanation: 'Containers and Multi-Axle vehicles operate on national logistics routes.' }
      ]
    },
    {
      id: 'm2',
      title: 'Consultative Selling',
      description: 'Learn how to pitch TruckMitr as an ROI business solution rather than just another driver directory.',
      progress: 45,
      status: 'in_progress',
      assignedByQC: true, // QC Remediation assigned
      chapters: [
        { id: 'c2_1', title: 'Consultative Pitching vs Transactional', duration: '3:10', completed: true },
        { id: 'c2_2', title: 'Comparing Agency Costs vs Platform Fees', duration: '2:50', completed: false },
        { id: 'c2_3', title: 'ROI Stand-still Cost Analysis', duration: '4:15', completed: false }
      ],
      quiz: [
        { id: 1, question: 'What is the primary value pitch when competing with traditional driver agencies?', options: ['TruckMitr is 80% cheaper and offers unlimited contacts for 3 months', 'We guarantee drivers will never take a holiday', 'Agencies are always better'], correctIdx: 0, explanation: 'Traditional agencies charge ₹5k-10k per driver, while TruckMitr Premium costs flat ₹1,999 for 3 months of unlimited contacts.' },
        { id: 2, question: 'What is the recommended average call duration for WCT calling?', options: ['2–5 minutes', '5–15 minutes', '20–40 minutes'], correctIdx: 1, explanation: 'The WCT call duration guideline is 5 to 15 minutes to allow for consultative fact-finding.' },
        { id: 3, question: 'If a transporter complains that ₹1,999 is too high, how should you pivot?', options: ['Downgrade them to the Free Plan immediately', 'Explain the ROI comparison with agency fees of ₹5k-10k per driver', 'Agree and end the call'], correctIdx: 1, explanation: 'Directly address the price objection by comparing it with traditional agency recruitment fees.' },
        { id: 4, question: 'What is the estimated cost of a truck standing still without a driver for 1 day?', options: ['₹500', '₹1,000', '₹3,000'], correctIdx: 2, explanation: 'A standing truck costs transporters roughly ₹3,000 per day in lost business and standing costs.' },
        { id: 5, question: 'Who performs initial screening and verification under the Premium Plan?', options: ['Transporter themselves', 'Dedicated Relationship Manager (RM)', 'System automation only'], correctIdx: 1, explanation: 'The Premium Plan provides a dedicated Relationship Manager who filters and coordinates driver hires.' }
      ]
    },
    {
      id: 'm3',
      title: 'SLA Management',
      description: 'Understanding the 4-hour registration-to-call SLA window, callback deadlines, and compliance logs.',
      progress: 0,
      status: 'not_started',
      assignedByQC: false,
      chapters: [
        { id: 'c3_1', title: 'The 4-hour SLA Window Explained', duration: '2:15', completed: false },
        { id: 'c3_2', title: 'Overdue Callback Consequences', duration: '3:05', completed: false }
      ],
      quiz: [
        { id: 1, question: 'What is the registration-to-call SLA target for fresh transporters?', options: ['Within 4 hours', 'Within 24 hours', 'Within 48 hours'], correctIdx: 0, explanation: 'WCT policy dictates that fresh transporter leads must be called within 4 hours of registration.' }
      ]
    },
    {
      id: 'm4',
      title: 'Objection Handling',
      description: 'Advanced dialogue trees for resolving trust issues, competitor comparisons, and fraud allegations.',
      progress: 0,
      status: 'locked',
      assignedByQC: false,
      chapters: [
        { id: 'c4_1', title: 'Resolving Fraud Allegations', duration: '3:30', completed: false },
        { id: 'c4_2', title: 'Handling Competitor Price Comparison', duration: '2:45', completed: false }
      ],
      quiz: [
        { id: 1, question: 'How should you handle a transporter accusing the platform of fraud?', options: ['Provide government recognition stats and 50k+ driver network size', 'Agree and apologize', 'Hang up the call immediately'], correctIdx: 0, explanation: 'De-escalate by stating government recognition,Authorized partner status, and the 50,000+ driver verification database.' }
      ]
    }
  ]);

  // QC Audits list (WCT themed)
  const [audits, setAudits] = useState<QCAudit[]>([
    {
      id: 'A_1120',
      score: 74,
      date: '18 Jun 2026',
      summary: 'Failed to address the "trust" objection regarding payment protection. Quoted incorrect price for Super Premium. Action: complete Consultative Selling module.',
      unread: true,
      rubric: [
        { criterion: 'Greeting Protocol', score: 10, max: 10, note: 'Polite and professional' },
        { criterion: 'Consultative Pitch Accuracy', score: 12, max: 20, note: 'Quoted wrong pricing for Super Premium' },
        { criterion: 'Objection Resolution', score: 14, max: 20, note: 'Needs stronger ROI and agency cost comparisons' },
        { criterion: 'SLA Response Compliance', score: 18, max: 20, note: 'Called within 4.5 hours (slight delay)' },
        { criterion: 'Dispositions Logging', score: 20, max: 30, note: 'Tagged correctly as callback' }
      ]
    },
    {
      id: 'A_1084',
      score: 92,
      date: '14 Jun 2026',
      summary: 'Excellent WCT greeting, consultative discovery of fleet size (8 trucks), and clear transition to the Premium ₹1,999 pitch. Keep it up!',
      unread: false,
      rubric: [
        { criterion: 'Greeting Protocol', score: 10, max: 10, note: 'Perfect tone' },
        { criterion: 'Consultative Pitch Accuracy', score: 19, max: 20, note: 'Understood fleet profile correctly' },
        { criterion: 'Objection Resolution', score: 18, max: 20, note: 'Excellent ROI comparison' },
        { criterion: 'SLA Response Compliance', score: 20, max: 20, note: 'Called within 2 hours of registration' },
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
          return { ...m, progress: 100, status: 'completed' as const };
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
          <span className="w-2 h-2 rounded-full bg-[#FB641B]"></span>
          {toastMessage}
        </div>
      )}

      {/* Probation Warning Banner (Orange) */}
      <section className="bg-[#FFF2EB] border border-[#FFD9C6] p-3 rounded-xl text-xs text-[#FB641B] flex justify-between items-center select-none shrink-0">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px] text-[#FB641B]">info</span>
          <span className="font-bold">Probation Period: 4 Days Remaining.</span>
          <span>Maintain an 85% QC score and complete mandatory modules to graduate.</span>
        </div>
        <button 
          onClick={() => triggerToast('HR policies summary link')}
          className="underline font-bold text-[#FB641B] hover:text-orange-800"
        >
          View Policy
        </button>
      </section>

      {/* Header and Tab switcher */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <p className="text-[#666666] text-xs font-semibold uppercase tracking-widest">WCT Training Portal</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-300">
            {modules.map(m => {
              let badgeStyle = 'bg-gray-100 text-gray-500';
              if (m.status === 'in_progress') badgeStyle = 'bg-[#FFF2EB] text-[#FB641B] border border-orange-100';
              else if (m.status === 'completed') badgeStyle = 'bg-[#EAFAF1] text-[#27AE60] border border-[#27AE60]/20';
              else if (m.status === 'locked') badgeStyle = 'bg-gray-50 text-gray-400';

              return (
                <div 
                  key={m.id}
                  onClick={() => handleModuleClick(m)}
                  className={`bg-white border rounded-xl p-5 flex flex-col justify-between shadow-sm relative transition-all duration-200 ${
                    m.status === 'locked' 
                      ? 'border-gray-150 cursor-not-allowed opacity-65' 
                      : 'border-gray-200 cursor-pointer hover:border-[#FB641B] hover:shadow'
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
                    <p className="text-xs text-gray-500 leading-relaxed">{m.description}</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-gray-400 font-semibold">
                      <span>Progress</span>
                      <span>{m.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${m.status === 'completed' ? 'bg-[#27AE60]' : 'bg-[#FB641B]'}`} 
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
                  <span className="absolute right-3 top-3 w-2.5 h-2.5 bg-red-600 rounded-full animate-pulse" title="Unread Alert"></span>
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
              <span className="text-[10px] text-[#FB641B] font-bold uppercase tracking-wider">Active Module Study</span>
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
                  <span>WCT_{selectedModule.id === 'm2' ? 'Consultative_Selling' : 'Fleet_Profiles'}.mp4</span>
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
                        className="rounded text-[#FB641B] focus:ring-[#FB641B] border-gray-300 w-3.5 h-3.5"
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
                                quizAnswers[q.id] === optIdx ? 'border-[#FB641B] bg-orange-50/20 font-semibold' : 'border-gray-200'
                              }`}
                            >
                              <input 
                                type="radio" 
                                name={`q_${q.id}`} 
                                checked={quizAnswers[q.id] === optIdx}
                                onChange={() => handleQuizAnswer(q.id, optIdx)}
                                className="text-[#FB641B] focus:ring-[#FB641B] w-3 h-3"
                              />
                              <span>{opt}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                    
                    <button
                      type="submit"
                      className="w-full bg-[#FB641B] hover:bg-[#e05615] text-white py-2 rounded-lg font-bold text-xs uppercase shadow transition-all active:scale-[0.98] mt-2"
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

      {/* Secondary Metrics Column - Right Hand Sidebar in Bottom */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Quality Audits & Norms</h4>
            <span className="bg-orange-50 text-[#FB641B] text-[9px] px-1.5 py-0.5 rounded font-bold">WCT STANDARDS</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between border-b border-gray-100 pb-1.5">
              <span className="text-gray-500">QC Call Duration Norm:</span>
              <span className="font-bold text-gray-800">5 – 15 Minutes</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-1.5">
              <span className="text-gray-500">Average WCT Handle Time:</span>
              <span className="font-bold text-gray-800">8m 20s (Target 8m+)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Target Passing Score:</span>
              <span className="font-bold text-gray-800">85% minimum</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">SLA Target Compliance</h4>
            <span className="bg-red-50 text-red-600 text-[9px] px-1.5 py-0.5 rounded font-bold">CRITICAL</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between border-b border-gray-100 pb-1.5">
              <span className="text-gray-500">First-Call SLA Window:</span>
              <span className="font-bold text-gray-800">4 Hours</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-1.5">
              <span className="text-gray-500">Monthly SLA Compliance Rate:</span>
              <span className="font-bold text-gray-800">91.3% (Target 100%)</span>
            </div>
            <div className="flex justify-between text-red-600 font-semibold">
              <span>Failed SLA Alerts this Month:</span>
              <span>12 Cases</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default WctTrainingHub;
