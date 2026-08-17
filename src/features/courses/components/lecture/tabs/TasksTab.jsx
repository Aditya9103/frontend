/**
 * TasksTab.jsx — Phase 5 multi-type quiz engine + rubric grading
 *
 * Quiz types supported:
 *   - multiple-choice (default)
 *   - true-false
 *   - multi-select (check all that apply)
 *   - short-answer (text input)
 *
 * Features:
 *   - Countdown timer (timeLimit in minutes)
 *   - maxAttempts enforcement (disabled state)
 *   - Rubric criteria + max score display on assignments
 *   - gradeHistory for revised grades
 */
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  HelpCircle,
  List,
  Send,
  Star,
  ToggleLeft,
  Type,
  XCircle,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

// ── Quiz type badge config ─────────────────────────────────────────────────────
const TYPE_LABELS = {
  'multiple-choice': { label: 'MCQ',          icon: <List size={12} />,       color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' },
  'true-false':      { label: 'True / False',  icon: <ToggleLeft size={12} />, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  'multi-select':    { label: 'Multi-Select',  icon: <CheckCircle size={12} />,color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  'short-answer':    { label: 'Short Answer',  icon: <Type size={12} />,       color: 'text-violet-400 bg-violet-500/10 border-violet-500/20' },
};

// ── Countdown Timer hook ───────────────────────────────────────────────────────
function useTimer(limitMinutes, onExpire, active) {
  const [remaining, setRemaining] = useState(limitMinutes ? limitMinutes * 60 : null);
  const ref = useRef(null);

  useEffect(() => {
    if (!active || remaining === null) return;
    if (remaining <= 0) { onExpire(); return; }
    ref.current = setInterval(() => setRemaining((r) => {
      if (r <= 1) { clearInterval(ref.current); onExpire(); return 0; }
      return r - 1;
    }), 1000);
    return () => clearInterval(ref.current);
  }, [active, remaining === null]);

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  return { remaining, fmt };
}

// ── Question renderer ──────────────────────────────────────────────────────────
function QuestionBlock({ q, qIdx, answers, setAnswers }) {
  const type = q.type || 'multiple-choice';
  const val  = answers[qIdx];

  const toggle = (optIdx) => {
    if (type === 'multi-select') {
      const cur = Array.isArray(val) ? val : [];
      setAnswers({ ...answers, [qIdx]: cur.includes(optIdx) ? cur.filter((x) => x !== optIdx) : [...cur, optIdx] });
    } else {
      setAnswers({ ...answers, [qIdx]: optIdx });
    }
  };

  const cfg = TYPE_LABELS[type] ?? TYPE_LABELS['multiple-choice'];

  return (
    <div className="space-y-4 bg-white/5 p-6 rounded-2xl border border-white/5">
      {/* Type badge */}
      <div className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${cfg.color}`}>
        {cfg.icon} {cfg.label}
      </div>

      <h3 className="text-base font-bold text-white leading-snug">
        <span className="text-yellow-500/50 mr-2">{qIdx + 1}.</span>{q.question}
      </h3>

      {/* Render by type */}
      {type === 'short-answer' ? (
        <textarea
          rows={3}
          placeholder="Type your answer here…"
          value={val || ''}
          onChange={(e) => setAnswers({ ...answers, [qIdx]: e.target.value })}
          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 resize-none focus:border-yellow-500/50 focus:outline-none transition-colors"
        />
      ) : type === 'true-false' ? (
        <div className="flex gap-3">
          {['True', 'False'].map((opt, i) => (
            <button
              key={i}
              onClick={() => toggle(i)}
              className={`flex-1 py-3 rounded-xl border text-sm font-bold transition-all ${
                val === i
                  ? 'bg-emerald-500 text-white border-emerald-400 shadow-lg shadow-emerald-500/20'
                  : 'bg-black/40 border-white/10 text-gray-300 hover:border-emerald-500/40'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {q.options?.map((opt, optIdx) => {
            const isSelected = type === 'multi-select'
              ? (Array.isArray(val) && val.includes(optIdx))
              : val === optIdx;
            return (
              <button
                key={optIdx}
                onClick={() => toggle(optIdx)}
                className={`p-4 rounded-xl border text-sm font-bold text-left transition-all ${
                  isSelected
                    ? 'bg-yellow-500 text-black border-yellow-400 shadow-lg shadow-yellow-500/20'
                    : 'bg-black/50 border-white/10 text-gray-300 hover:border-yellow-500/50'
                }`}
              >
                {type === 'multi-select' && (
                  <span className={`inline-block w-4 h-4 rounded border mr-2 align-middle transition-all ${isSelected ? 'bg-black border-black' : 'border-gray-500'}`} />
                )}
                {opt}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
const TasksTab = ({
  state,
  selectedQuiz,
  setSelectedQuiz,
  selectedAssignment,
  setSelectedAssignment,
  quizPageAnswers,
  setQuizPageAnswers,
  handleSectionQuizSubmit,
  assignmentFile,
  setAssignmentFile,
  handleAssignmentSubmitAction,
}) => {
  const [timerExpired, setTimerExpired] = useState(false);
  const quizActive = !!selectedQuiz && !timerExpired;
  const { remaining, fmt } = useTimer(selectedQuiz?.timeLimit, () => {
    setTimerExpired(true);
    handleSectionQuizSubmit?.();
  }, quizActive);

  const handleOpenQuiz = (quiz) => {
    setTimerExpired(false);
    setQuizPageAnswers({});
    setSelectedQuiz(quiz);
  };

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-6">
        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white">
          <CheckCircle size={20} />
        </div>
        <div>
          <h2 className="text-xl font-black font-outfit text-white">Course Tasks</h2>
          <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Assessments & Practicals</p>
        </div>
      </div>

      {/* Task list */}
      <div className="space-y-10">
        {state.sections?.map((section, sIdx) => {
          const hasTasks = section.quizzes?.length > 0 || section.assignments?.length > 0;
          if (!hasTasks) return null;
          return (
            <div key={sIdx} className="space-y-4">
              <h3 className="text-sm font-black text-yellow-500 uppercase tracking-widest flex items-center gap-4">
                <span>{section.title}</span>
                <div className="h-px bg-white/10 flex-1" />
              </h3>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {section.quizzes?.map((quiz, qIdx) => {
                  const exhausted = quiz.maxAttempts > 0 && (quiz.attempts ?? 0) >= quiz.maxAttempts;
                  return (
                    <div
                      key={qIdx}
                      className={`p-5 rounded-2xl border flex items-center justify-between group transition-all
                        ${exhausted
                          ? 'bg-black/20 border-white/5 opacity-50'
                          : 'bg-black/40 border-white/5 hover:border-yellow-500/30'}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-yellow-500/10 text-yellow-500 rounded-xl flex items-center justify-center">
                          <HelpCircle size={18} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Assessment</p>
                          <h4 className="text-sm font-bold text-gray-200 group-hover:text-white truncate">{quiz.title}</h4>
                          <div className="flex items-center gap-3 mt-1">
                            {quiz.timeLimit && (
                              <span className="text-[10px] text-gray-500 flex items-center gap-1">
                                <Clock size={10} /> {quiz.timeLimit}m
                              </span>
                            )}
                            {quiz.maxAttempts > 0 && (
                              <span className="text-[10px] text-gray-500">
                                {quiz.attempts ?? 0}/{quiz.maxAttempts} attempts
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => !exhausted && handleOpenQuiz(quiz)}
                        disabled={exhausted}
                        className="px-5 py-2 bg-white/5 hover:bg-yellow-500 text-white hover:text-black rounded-lg text-[10px] font-black uppercase tracking-widest transition-all disabled:cursor-not-allowed"
                      >
                        {exhausted ? 'Done' : 'Start'}
                      </button>
                    </div>
                  );
                })}

                {section.assignments?.map((assignment, aIdx) => (
                  <div
                    key={aIdx}
                    className="p-5 bg-black/40 border border-white/5 hover:border-blue-500/30 rounded-2xl flex items-center justify-between group transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center">
                        <FileText size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Practical</p>
                        <h4 className="text-sm font-bold text-gray-200 group-hover:text-white truncate">{assignment.title}</h4>
                        {/* Grade badge if graded */}
                        {assignment.grade !== undefined && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-amber-400 font-bold mt-1">
                            <Star size={10} fill="currentColor" /> {assignment.grade}/{assignment.rubric?.reduce((s, r) => s + r.maxScore, 0) || '—'} pts
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedAssignment(assignment)}
                      className="px-5 py-2 bg-white/5 hover:bg-blue-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all"
                    >
                      View
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Quiz Modal ─────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedQuiz && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#050505]/95 backdrop-blur-3xl z-50 overflow-y-auto"
          >
            <div className="min-h-full flex flex-col items-center justify-center p-4 md:p-10 relative">
              <button
                onClick={() => setSelectedQuiz(null)}
                className="absolute top-4 right-4 md:top-8 md:right-8 w-12 h-12 bg-white/5 hover:bg-rose-500/20 text-gray-400 hover:text-rose-500 rounded-full flex items-center justify-center border border-white/10 transition-all z-10"
              >
                <XCircle size={24} />
              </button>

              <div className="max-w-3xl w-full bg-black/50 border border-white/10 rounded-[2rem] shadow-2xl my-auto">
                {/* Quiz header */}
                <div className="p-8 text-center border-b border-white/10">
                  <p className="text-yellow-500 font-black uppercase tracking-widest text-xs border border-yellow-500/30 px-4 py-1.5 rounded-full inline-block bg-yellow-500/10 mb-4">
                    Section Assessment
                  </p>
                  <h2 className="text-3xl font-black font-outfit text-white">{selectedQuiz.title}</h2>

                  {/* Timer */}
                  {selectedQuiz.timeLimit && remaining !== null && (
                    <div className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border ${
                      remaining < 60
                        ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 animate-pulse'
                        : 'bg-white/5 border-white/10 text-slate-300'
                    }`}>
                      <Clock size={15} />
                      {fmt(remaining)} remaining
                      {remaining < 60 && <AlertTriangle size={14} />}
                    </div>
                  )}
                </div>

                {/* Questions */}
                <div className="p-8 space-y-8">
                  {selectedQuiz.questions?.map((q, qIdx) => (
                    <QuestionBlock
                      key={qIdx}
                      q={q}
                      qIdx={qIdx}
                      answers={quizPageAnswers}
                      setAnswers={setQuizPageAnswers}
                    />
                  ))}
                </div>

                {/* Submit */}
                <div className="p-6 border-t border-white/10 bg-black/50 rounded-b-[2rem]">
                  <button
                    onClick={handleSectionQuizSubmit}
                    className="w-full py-4 bg-gradient-to-r from-yellow-600 to-yellow-400 text-black rounded-xl font-black text-sm uppercase tracking-widest shadow-[0_0_30px_rgba(234,179,8,0.3)] hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                  >
                    <Send size={16} /> Submit Assessment
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Assignment Modal ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedAssignment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#050505]/95 backdrop-blur-3xl z-50 overflow-y-auto"
          >
            <div className="min-h-full flex flex-col items-center justify-center p-4 md:p-10 relative">
              <button
                onClick={() => { setSelectedAssignment(null); setAssignmentFile(null); }}
                className="absolute top-4 right-4 md:top-8 md:right-8 w-12 h-12 bg-white/5 hover:bg-rose-500/20 text-gray-400 hover:text-rose-500 rounded-full flex items-center justify-center border border-white/10 transition-all z-10"
              >
                <XCircle size={24} />
              </button>

              <div className="max-w-2xl w-full bg-black/50 border border-white/10 rounded-[2rem] shadow-2xl my-auto">
                <div className="p-8 text-center border-b border-white/10">
                  <p className="text-blue-500 font-black uppercase tracking-widest text-xs border border-blue-500/30 px-4 py-1.5 rounded-full inline-block bg-blue-500/10 mb-4">
                    Practical Task
                  </p>
                  <h2 className="text-3xl font-black font-outfit text-white">{selectedAssignment.title}</h2>
                </div>

                <div className="p-8 space-y-8">
                  {/* Description */}
                  <div className="p-5 bg-white/5 rounded-2xl border border-white/5">
                    <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3">Briefing</h3>
                    <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">{selectedAssignment.description}</p>
                  </div>

                  {/* Rubric — Phase 5 */}
                  {selectedAssignment.rubric?.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">Grading Rubric</h3>
                      <div className="space-y-2">
                        {selectedAssignment.rubric.map((criterion, i) => (
                          <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                            <span className="text-sm text-gray-300">{criterion.criterion}</span>
                            <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                              {criterion.maxScore} pts
                            </span>
                          </div>
                        ))}
                        <div className="flex justify-between text-xs font-bold text-white pt-1">
                          <span>Total</span>
                          <span>{selectedAssignment.rubric.reduce((s, r) => s + r.maxScore, 0)} pts</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Current grade */}
                  {selectedAssignment.grade !== undefined && (
                    <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center gap-3">
                      <Star size={18} className="text-amber-400" fill="currentColor" />
                      <div>
                        <p className="text-xs font-black text-amber-400 uppercase tracking-widest">Your Grade</p>
                        <p className="text-white font-bold">
                          {selectedAssignment.grade} / {selectedAssignment.rubric?.reduce((s, r) => s + r.maxScore, 0) || '?'} pts
                          {selectedAssignment.feedback && <span className="text-gray-400 ml-2">· {selectedAssignment.feedback}</span>}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Grade history — Phase 5 */}
                  {selectedAssignment.gradeHistory?.length > 1 && (
                    <div className="space-y-2">
                      <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">Grade History</h3>
                      <div className="space-y-1">
                        {selectedAssignment.gradeHistory.map((h, i) => (
                          <div key={i} className="flex justify-between text-xs text-gray-500">
                            <span>{new Date(h.gradedAt).toLocaleDateString()}</span>
                            <span>{h.grade} pts — {h.feedback}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Resource download */}
                  {selectedAssignment.file?.secure_url && (
                    <a
                      href={selectedAssignment.file.secure_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 px-5 py-3 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl text-sm font-bold hover:bg-blue-500 hover:text-white transition-all"
                    >
                      <FileText size={18} /> Download Resource Kit
                    </a>
                  )}

                  {/* Upload */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">Your Submission</h3>
                    <div className="border-2 border-dashed border-white/20 bg-black/50 rounded-2xl p-8 flex flex-col items-center gap-4 hover:border-blue-500 hover:bg-blue-500/5 transition-all group">
                      <input
                        type="file"
                        id="assignmentUpload"
                        className="hidden"
                        onChange={(e) => setAssignmentFile(e.target.files[0])}
                      />
                      <label htmlFor="assignmentUpload" className="cursor-pointer flex flex-col items-center gap-3 text-center">
                        <div className="w-14 h-14 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center border border-blue-500/20 group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
                          <FileText size={28} />
                        </div>
                        <p className="font-bold text-sm text-white group-hover:text-blue-400 transition-colors">
                          {assignmentFile ? assignmentFile.name : 'Select your completed file'}
                        </p>
                        <p className="text-xs text-gray-500">PDF, DOCX, or ZIP · Max 10MB</p>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="p-6 border-t border-white/10 bg-black/50 rounded-b-[2rem]">
                  <button
                    onClick={handleAssignmentSubmitAction}
                    disabled={!assignmentFile}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-xl font-black text-sm uppercase tracking-widest shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Send size={16} /> Upload & Submit
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TasksTab;
