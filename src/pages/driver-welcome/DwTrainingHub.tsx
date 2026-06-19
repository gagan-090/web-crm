import React, { useState } from 'react';

interface Question {
  text: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export const DwTrainingHub: React.FC = () => {
  // Quiz states
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [quizChecked, setQuizChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const quizQuestions: Question[] = [
    {
      text: "What is the maximum permissible weight on a single axle for interstate transit in India?",
      options: ["12,000 lbs (5.4 tonnes)", "20,000 lbs (9 tonnes)", "34,000 lbs (15.4 tonnes)", "80,000 lbs (36 tonnes)"],
      correctAnswer: "20,000 lbs (9 tonnes)",
      explanation: "Standard weight bridges limit single axles to 20,000 lbs (9 tonnes) to preserve highway infrastructure."
    },
    {
      text: "Which class represents Flammable Liquids in Hazardous materials transport coding?",
      options: ["Class 1", "Class 3", "Class 5", "Class 8"],
      correctAnswer: "Class 3",
      explanation: "Class 3 covers flammable liquids like gasoline and diesel fuels in logistical safety standards."
    }
  ];

  const handleSelectOption = (opt: string) => {
    if (quizChecked) return;
    setSelectedAnswer(opt);
  };

  const handleCheckAnswer = () => {
    if (!selectedAnswer) {
      showToast('Please select an option first!');
      return;
    }
    setQuizChecked(true);
    if (selectedAnswer === quizQuestions[currentQuestionIndex].correctAnswer) {
      setScore(prev => prev + 1);
      showToast('Correct answer! Well done.');
    } else {
      showToast('Incorrect answer. Review the explanation.');
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setQuizChecked(false);
    if (currentQuestionIndex + 1 < quizQuestions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setQuizChecked(false);
    setScore(0);
    setQuizFinished(false);
    showToast('Quiz restarted!');
  };

  const activeQuestion = quizQuestions[currentQuestionIndex];

  return (
    <main className="flex flex-col w-full h-full max-w-6xl mx-auto bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-md left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface px-lg py-sm rounded shadow-lg z-50 text-xs font-semibold flex items-center gap-xs border border-outline animate-in fade-in slide-in-from-top-2">
          <span className="material-symbols-outlined text-[16px] text-accent-success">check_circle</span>
          {toastMessage}
        </div>
      )}

      {/* Top Probation Warning Bar */}
      <div className="bg-primary-container/10 px-lg py-2.5 flex items-center justify-between border-b border-primary/20 shrink-0 text-xs">
        <div className="flex items-center gap-sm font-semibold text-primary">
          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
          <span className="uppercase tracking-wider">Active Training Probation</span>
        </div>
        <div className="text-on-surface-variant">
          Complete <strong>'Hazardous Materials Handling'</strong> module by EOD to unlock premium closing payouts.
        </div>
        <button 
          onClick={() => showToast('Course Requirements document downloaded')}
          className="text-primary underline font-bold"
        >
          View Requirements
        </button>
      </div>

      {/* Main Canvas Scroll Area */}
      <div className="flex-grow overflow-y-auto p-lg space-y-lg bg-background custom-scrollbar">
        
        {/* Title Section */}
        <div className="flex justify-between items-end">
          <div>
            <p className="text-primary font-bold text-xs uppercase tracking-widest mb-1">Driver Development Portal</p>
            <h2 className="text-headline-md font-bold text-on-surface">Training Hub DW-09</h2>
          </div>
          <button 
            onClick={() => showToast('Badge certificate verification initiated...')}
            className="flex items-center gap-xs bg-accent-success hover:bg-[#20ba59] text-white px-md py-2 rounded-lg text-xs font-bold transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-sm">workspace_premium</span> Claim Certificates
          </button>
        </div>

        {/* Modules Progress Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-md text-xs">
          
          <div className="bg-white border border-outline-variant p-lg rounded-xl flex flex-col hover:border-primary transition-colors cursor-pointer group">
            <div className="flex justify-between items-start mb-md">
              <div className="p-sm bg-primary/10 rounded-lg text-primary">
                <span className="material-symbols-outlined text-sm">local_shipping</span>
              </div>
              <span className="px-2 py-0.5 bg-accent-success/10 text-accent-success text-[10px] font-bold rounded border border-accent-success/20">In Progress</span>
            </div>
            <h3 className="font-bold text-sm text-on-surface group-hover:text-primary transition-colors mb-1">Route Optimization II</h3>
            <p className="text-on-surface-variant leading-normal flex-1 mb-md">Advanced logistical modeling for urban delivery corridors and multi-stop dispatch efficiencies.</p>
            <div className="space-y-xs border-t border-outline-variant/30 pt-sm">
              <div className="flex justify-between text-[10px] font-semibold text-on-surface-variant">
                <span>Progress</span>
                <span>65%</span>
              </div>
              <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
                <div className="bg-primary h-full" style={{ width: '65%' }}></div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-primary/40 bg-primary/5 p-lg rounded-xl flex flex-col hover:border-primary transition-colors cursor-pointer group">
            <div className="flex justify-between items-start mb-md">
              <div className="p-sm bg-error/15 rounded-lg text-error">
                <span className="material-symbols-outlined text-sm">warning</span>
              </div>
              <span className="px-2 py-0.5 bg-error-container text-on-error-container text-[10px] font-bold rounded border border-outline-variant/30">Probation Link</span>
            </div>
            <h3 className="font-bold text-sm text-on-surface group-hover:text-primary transition-colors mb-1">Hazardous Materials</h3>
            <p className="text-on-surface-variant leading-normal flex-1 mb-md">Mandatory security and chemical safety guidelines for hazardous payload logistics.</p>
            <div className="space-y-xs border-t border-outline-variant/30 pt-sm">
              <div className="flex justify-between text-[10px] font-semibold text-on-surface-variant">
                <span>Progress</span>
                <span>12%</span>
              </div>
              <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
                <div className="bg-error h-full" style={{ width: '12%' }}></div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-outline-variant p-lg rounded-xl flex flex-col opacity-80 hover:opacity-100 transition-opacity cursor-pointer group">
            <div className="flex justify-between items-start mb-md">
              <div className="p-sm bg-surface-container-high rounded-lg text-on-surface-variant">
                <span className="material-symbols-outlined text-sm">analytics</span>
              </div>
              <span className="px-2 py-0.5 bg-surface-container-high text-on-surface-variant text-[10px] font-bold rounded border border-outline-variant/30">Not Started</span>
            </div>
            <h3 className="font-bold text-sm text-on-surface group-hover:text-primary transition-colors mb-1">Forecasting &amp; Demand</h3>
            <p className="text-on-surface-variant leading-normal flex-1 mb-md">Using regional load datasets to predict seasonal fleet deployment volumes.</p>
            <div className="space-y-xs border-t border-outline-variant/30 pt-sm">
              <div className="flex justify-between text-[10px] font-semibold text-on-surface-variant">
                <span>Progress</span>
                <span>0%</span>
              </div>
              <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
                <div className="bg-outline h-full w-0"></div>
              </div>
            </div>
          </div>

        </div>

        {/* Video Player & Curriculum Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg text-xs">
          
          <div className="lg:col-span-2 space-y-md">
            <div className="aspect-video bg-inverse-surface rounded-xl flex flex-col items-center justify-center relative overflow-hidden group border border-outline-variant">
              <div className="absolute inset-0 z-0">
                <img 
                  className="w-full h-full object-cover opacity-60" 
                  alt="Educational Video preview"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHrwPbdMexdzFeN-B6jch1IzqJtrtIXIYESkMJWrJj4qIRPTDEqylc7-eZpa0pCcVg0xDPU_J0AA7xROHOC7vWsQ02Q3F-pP2Bz3v_atY9plYyeB7Ux90jc3SKod50_m3dFHnDJ3LYyfSH99vZLg6Hv7AjJ7KwXFgQb5tGVpBMPCOx2YKIOOOlneLUJZaj7Q502NGj4Jn1X-YVOT7gGino1UHnjCKTuUbSdAVyHVv4NndgdX_jR1FA5rhV4B9pOKXS4Meo-quh3Xw"
                />
              </div>
              <div className="z-10 flex flex-col items-center">
                <button 
                  onClick={() => showToast('Playing: Loading Safety Protocols - weight bridges...')}
                  className="w-16 h-16 bg-primary/95 text-on-primary rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl"
                >
                  <span className="material-symbols-outlined text-[36px]" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                </button>
                <span className="mt-md text-white font-bold text-[10px] uppercase tracking-wider bg-black/55 px-lg py-1 rounded-full">Module 04: Axle Load Balancing</span>
              </div>
              <div className="absolute bottom-0 inset-x-0 h-1.5 bg-white/20">
                <div className="h-full bg-primary w-1/3"></div>
              </div>
            </div>
            
            <div className="bg-white border border-outline-variant p-lg rounded-xl shadow-sm space-y-sm">
              <div className="flex gap-md border-b border-outline-variant/40 pb-sm font-semibold">
                <button className="pb-sm border-b-2 border-primary text-primary font-bold">Current Lesson Material</button>
                <button onClick={() => showToast('Course reference manuals PDF opened')} className="pb-sm text-on-surface-variant hover:text-on-surface">Reference resources</button>
                <button onClick={() => showToast('Notes module loaded')} className="pb-sm text-on-surface-variant hover:text-on-surface">Personal Notes (4)</button>
              </div>
              <h4 className="font-bold text-sm text-on-surface mt-sm">CH 4.2: Weight Bridge Distribution Principles</h4>
              <p className="text-on-surface-variant leading-relaxed font-normal">This chapter details the math and physical center of gravity checks for heavy-duty trailers on state highways. Compliance with the axle weight formula prevents carrier safety breaches and heavy regulatory fines.</p>
            </div>
          </div>
          
          {/* Interactive Quiz Widget */}
          <div className="space-y-md">
            <div className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm flex flex-col">
              <div className="p-md bg-surface-container-low border-b border-outline-variant font-bold">
                Lesson Curriculum
              </div>
              <div className="max-h-[160px] overflow-y-auto custom-scrollbar">
                <div className="p-sm flex items-center justify-between border-b border-outline-variant bg-accent-success/5">
                  <div className="flex items-center gap-md">
                    <span className="material-symbols-outlined text-accent-success text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    <div>
                      <p className="font-bold text-on-surface text-[11px]">1. Introduction to Weight</p>
                      <p className="text-[10px] text-on-surface-variant">05:20 min</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-outline text-sm">description</span>
                </div>
                <div className="p-sm flex items-center justify-between border-b border-outline-variant bg-primary/5">
                  <div className="flex items-center gap-md">
                    <span className="material-symbols-outlined text-primary text-sm">play_circle</span>
                    <div>
                      <p className="font-bold text-primary text-[11px]">2. Axle load calculations</p>
                      <p className="text-[10px] text-on-surface-variant">12:45 min</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-outline text-sm">more_vert</span>
                </div>
                <div className="p-sm flex items-center justify-between opacity-60">
                  <div className="flex items-center gap-md">
                    <span className="material-symbols-outlined text-outline text-sm">lock</span>
                    <div>
                      <p className="font-bold text-on-surface text-[11px]">3. Fastening protocols</p>
                      <p className="text-[10px] text-on-surface-variant">08:15 min</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Interactive Quiz Box */}
            <div className="bg-white border border-outline-variant rounded-xl p-lg shadow-sm">
              {!quizFinished ? (
                <div className="space-y-sm">
                  <div className="flex justify-between items-center text-[10px] font-bold text-primary uppercase tracking-wider">
                    <span>Quiz: Ch 4.2 Axle Rules</span>
                    <span className="text-on-surface-variant">Q: {currentQuestionIndex + 1} of {quizQuestions.length}</span>
                  </div>
                  
                  <p className="font-bold text-on-surface text-xs leading-normal mt-2">
                    {activeQuestion.text}
                  </p>
                  
                  <div className="space-y-xs mt-md">
                    {activeQuestion.options.map((opt) => {
                      const isSelected = selectedAnswer === opt;
                      const isCorrect = opt === activeQuestion.correctAnswer;
                      let optionStyle = "border-outline-variant hover:bg-surface-container-low";
                      
                      if (isSelected) {
                        optionStyle = "border-primary bg-primary/5 font-semibold text-primary";
                      }
                      if (quizChecked) {
                        if (isCorrect) {
                          optionStyle = "border-accent-success bg-accent-success/5 font-bold text-accent-success";
                        } else if (isSelected) {
                          optionStyle = "border-error bg-error/5 font-bold text-error";
                        } else {
                          optionStyle = "border-outline-variant opacity-60";
                        }
                      }
                      
                      return (
                        <div 
                          key={opt}
                          onClick={() => handleSelectOption(opt)}
                          className={`flex items-center gap-md p-md border rounded-lg cursor-pointer transition-all ${optionStyle}`}
                        >
                          <input 
                            type="radio" 
                            name="quiz"
                            checked={isSelected}
                            disabled={quizChecked}
                            onChange={() => handleSelectOption(opt)}
                            className="text-primary w-3.5 h-3.5 cursor-pointer"
                          />
                          <span className="text-[11px] leading-tight">{opt}</span>
                        </div>
                      );
                    })}
                  </div>

                  {quizChecked && (
                    <div className="p-md bg-surface-container rounded-lg border border-outline-variant/40 mt-md">
                      <p className="font-bold text-[10px] text-on-surface uppercase">EXPLANATION</p>
                      <p className="text-[11px] text-on-surface-variant mt-1 leading-normal">{activeQuestion.explanation}</p>
                    </div>
                  )}

                  <div className="mt-md pt-sm">
                    {!quizChecked ? (
                      <button 
                        onClick={handleCheckAnswer}
                        className="w-full bg-primary text-on-primary py-2.5 rounded-lg font-bold text-xs uppercase shadow-sm hover:opacity-95"
                      >
                        Check Answer
                      </button>
                    ) : (
                      <button 
                        onClick={handleNextQuestion}
                        className="w-full bg-accent-success text-white py-2.5 rounded-lg font-bold text-xs uppercase shadow-sm hover:opacity-95"
                      >
                        {currentQuestionIndex + 1 === quizQuestions.length ? 'Finish Quiz' : 'Next Question'}
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-md space-y-md">
                  <span className="material-symbols-outlined text-display-lg text-accent-success animate-bounce">workspace_premium</span>
                  <h3 className="font-bold text-sm text-on-surface">Quiz Completed!</h3>
                  <p className="text-xs text-on-surface-variant">You scored <strong>{score} out of {quizQuestions.length}</strong> correct answers.</p>
                  <div className="flex gap-sm pt-sm">
                    <button 
                      onClick={handleRestartQuiz}
                      className="flex-1 border border-outline-variant hover:bg-surface-container text-on-surface py-2 rounded-lg font-bold text-xs"
                    >
                      Retry Quiz
                    </button>
                    <button 
                      onClick={() => { showToast('Certificate generated in vault!'); handleRestartQuiz(); }}
                      className="flex-1 bg-accent-success text-white py-2 rounded-lg font-bold text-xs"
                    >
                      Save Result
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Quality Audit Feedback Inbox */}
        <section className="space-y-md">
          <h3 className="font-bold text-sm text-on-surface">QC Quality Audit Feedback Inbox</h3>
          <div className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container border-b border-outline-variant font-semibold text-on-surface-variant">
                  <th className="p-md">AUDIT DATE</th>
                  <th className="p-md">AUDIT TYPE</th>
                  <th className="p-md">ACCURACY SCORE</th>
                  <th className="p-md">AUDIT REMARKS & FEEDBACK</th>
                  <th className="p-md text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                <tr className="hover:bg-surface-container-low transition-colors">
                  <td className="p-md text-mono-data text-on-surface-variant">Oct 24, 2026</td>
                  <td className="p-md font-bold">Standard Route Audit</td>
                  <td className="p-md text-accent-success font-bold text-sm">98%</td>
                  <td className="p-md text-on-surface-variant leading-relaxed">Exceptional call posture, polite greeting structure. Recommended for senior closing trainer slot.</td>
                  <td className="p-md text-right"><button onClick={() => showToast('Opening audit details...')} className="text-primary font-bold hover:underline">Details</button></td>
                </tr>
                <tr className="hover:bg-surface-container-low transition-colors">
                  <td className="p-md text-mono-data text-on-surface-variant">Oct 21, 2026</td>
                  <td className="p-md font-bold">Shift Handover Audit</td>
                  <td className="p-md text-primary font-bold text-sm">82%</td>
                  <td className="p-md text-on-surface-variant leading-relaxed">Slight lag in logging disposition codes. Standard reminder on prompt dashboard submissions.</td>
                  <td className="p-md text-right"><button onClick={() => showToast('Opening audit details...')} className="text-primary font-bold hover:underline">Details</button></td>
                </tr>
                <tr className="hover:bg-surface-container-low transition-colors bg-error-container/5">
                  <td className="p-md text-mono-data text-on-surface-variant">Oct 18, 2026</td>
                  <td className="p-md font-bold text-error">Safety Checklist Audit</td>
                  <td className="p-md text-error font-bold text-sm">64%</td>
                  <td className="p-md text-error font-bold leading-relaxed">Missed hazardous transport compliance guidelines check. Mandatory safety probation active.</td>
                  <td className="p-md text-right"><button onClick={() => showToast('Safety course retake scheduled.')} className="text-error font-bold hover:underline">Retake Course</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </main>
  );
};

export default DwTrainingHub;
