import { AnimatePresence,motion } from 'framer-motion';
import { CheckCircle, FileText, HelpCircle, XCircle } from 'lucide-react';
import React from 'react';

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
    handleAssignmentSubmitAction
}) => {
    return (
        <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-6 flex-shrink-0">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white"><CheckCircle size={20} /></div>
                <div>
                    <h2 className="text-xl font-black font-outfit text-white">Course Tasks</h2>
                    <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Assessments & Practicals</p>
                </div>
            </div>
            
            <div className="space-y-12">
                {state.sections?.map((section, sIdx) => {
                    const hasTasks = section.quizzes?.length > 0 || section.assignments?.length > 0;
                    if (!hasTasks) return null;
                    return (
                        <div key={sIdx} className="space-y-6">
                            <h3 className="text-sm font-black text-yellow-500 uppercase tracking-widest flex items-center gap-4">
                                <span>{section.title}</span>
                                <div className="h-px bg-white/10 flex-1"></div>
                            </h3>

                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                                {section.quizzes?.map((quiz, qIdx) => (
                                    <div key={qIdx} className="p-5 bg-black/40 border border-white/5 hover:border-yellow-500/30 rounded-2xl flex items-center justify-between group transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-yellow-500/10 text-yellow-500 rounded-xl flex items-center justify-center flex-shrink-0"><HelpCircle size={18} /></div>
                                            <div className="min-w-0">
                                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1 truncate">Assessment</p>
                                                <h4 className="text-sm font-bold text-gray-200 group-hover:text-white transition-colors truncate">{quiz.title}</h4>
                                            </div>
                                        </div>
                                        <button onClick={() => setSelectedQuiz(quiz)} className="px-5 py-2 bg-white/5 hover:bg-yellow-500 text-white hover:text-black rounded-lg text-[10px] font-black uppercase tracking-widest transition-all">Start</button>
                                    </div>
                                ))}

                                {section.assignments?.map((assignment, aIdx) => (
                                    <div key={aIdx} className="p-5 bg-black/40 border border-white/5 hover:border-blue-500/30 rounded-2xl flex items-center justify-between group transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center flex-shrink-0"><FileText size={18} /></div>
                                            <div className="min-w-0">
                                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1 truncate">Practical</p>
                                                <h4 className="text-sm font-bold text-gray-200 group-hover:text-white transition-colors truncate">{assignment.title}</h4>
                                            </div>
                                        </div>
                                        <button onClick={() => setSelectedAssignment(assignment)} className="px-5 py-2 bg-white/5 hover:bg-blue-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all">View</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Section Quiz Modal overlay */}
            <AnimatePresence>
                {selectedQuiz && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-[#050505]/95 backdrop-blur-3xl z-50 overflow-y-auto custom-scrollbar">
                        <div className="min-h-full flex flex-col items-center justify-center p-4 md:p-10 relative">
                            <button onClick={() => setSelectedQuiz(null)} className="absolute top-4 right-4 md:top-8 md:right-8 w-12 h-12 bg-white/5 hover:bg-rose-500/20 text-gray-400 hover:text-rose-500 rounded-full flex items-center justify-center border border-white/10 transition-all z-10"><XCircle size={24} /></button>
                        
                            <div className="max-w-3xl w-full bg-black/40 border border-white/10 rounded-[2rem] flex flex-col shadow-2xl my-auto">
                                <div className="p-8 text-center border-b border-white/10 flex-shrink-0">
                                    <p className="text-yellow-500 font-black uppercase tracking-widest text-xs border border-yellow-500/30 px-4 py-1.5 rounded-full inline-block bg-yellow-500/10 mb-4">Section Assessment</p>
                                    <h2 className="text-3xl font-black font-outfit text-white">{selectedQuiz.title}</h2>
                                </div>
                                
                                <div className="p-8 space-y-10">
                                    {selectedQuiz.questions.map((q, qIdx) => (
                                        <div key={qIdx} className="space-y-6 bg-white/5 p-6 rounded-2xl border border-white/5">
                                            <h3 className="text-lg font-bold text-white"><span className="text-yellow-500 opacity-50 mr-2">{qIdx + 1}.</span> {q.question}</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {q.options.map((opt, optIdx) => (
                                                    <button key={optIdx} onClick={() => setQuizPageAnswers({ ...quizPageAnswers, [qIdx]: optIdx })} className={`p-4 rounded-xl border text-sm font-bold transition-all text-left break-words ${quizPageAnswers[qIdx] === optIdx ? 'bg-yellow-500 text-black border-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.2)]' : 'bg-black/50 border-white/10 text-gray-300 hover:border-yellow-500/50'}`}>
                                                        {opt}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="p-6 border-t border-white/10 bg-black/50 flex-shrink-0 mt-8 rounded-b-[2rem]">
                                    <button onClick={handleSectionQuizSubmit} className="w-full py-4 bg-gradient-to-r from-yellow-600 to-yellow-400 text-black rounded-xl font-black text-sm uppercase tracking-widest shadow-[0_0_30px_rgba(234,179,8,0.3)] hover:scale-[1.02] transition-all">Submit Final Assessment</button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Assignment Modal overlay */}
            <AnimatePresence>
                {selectedAssignment && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-[#050505]/95 backdrop-blur-3xl z-50 overflow-y-auto custom-scrollbar">
                        <div className="min-h-full flex flex-col items-center justify-center p-4 md:p-10 relative">
                            <button onClick={() => { setSelectedAssignment(null); setAssignmentFile(null); }} className="absolute top-4 right-4 md:top-8 md:right-8 w-12 h-12 bg-white/5 hover:bg-rose-500/20 text-gray-400 hover:text-rose-500 rounded-full flex items-center justify-center border border-white/10 transition-all z-10"><XCircle size={24} /></button>
                        
                            <div className="max-w-2xl w-full bg-black/40 border border-white/10 rounded-[2rem] flex flex-col shadow-2xl my-auto">
                                <div className="p-8 text-center border-b border-white/10 flex-shrink-0">
                                    <p className="text-blue-500 font-black uppercase tracking-widest text-xs border border-blue-500/30 px-4 py-1.5 rounded-full inline-block bg-blue-500/10 mb-4">Practical Task</p>
                                    <h2 className="text-3xl font-black font-outfit text-white">{selectedAssignment.title}</h2>
                                </div>
                                
                                <div className="p-8 space-y-8">
                                    <div className="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-6">
                                        <div>
                                            <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3">Briefing</h3>
                                            <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed break-words">{selectedAssignment.description}</p>
                                        </div>
                                        
                                        {selectedAssignment.file && selectedAssignment.file.secure_url && (
                                            <div className="pt-6 border-t border-white/10">
                                                <a 
                                                    href={selectedAssignment.file.secure_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer" 
                                                    className="inline-flex items-center gap-3 px-5 py-3 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl text-sm font-bold hover:bg-blue-500 hover:text-white transition-all"
                                                >
                                                    <FileText size={18} /> Download Resource Kit
                                                </a>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest px-2">Your Submission</h3>
                                        <div className="border-2 border-dashed border-white/20 bg-black/50 rounded-2xl p-8 flex flex-col items-center justify-center gap-4 hover:border-blue-500 hover:bg-blue-500/5 transition-all group">
                                            <input 
                                                type="file" 
                                                id="assignmentUpload" 
                                                className="hidden" 
                                                onChange={(e) => setAssignmentFile(e.target.files[0])}
                                            />
                                            <label htmlFor="assignmentUpload" className="cursor-pointer flex flex-col items-center gap-4 text-center">
                                                <div className="w-16 h-16 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center border border-blue-500/20 group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-white transition-all duration-500">
                                                    <FileText size={32} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-base text-white group-hover:text-blue-400 transition-colors break-all">
                                                        {assignmentFile ? assignmentFile.name : "Select your completed file"}
                                                    </p>
                                                    <p className="text-xs text-gray-500 font-medium mt-1">PDF, DOCX, or ZIP (Max 10MB)</p>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 border-t border-white/10 bg-black/50 flex-shrink-0 mt-8 rounded-b-[2rem]">
                                    <button 
                                        onClick={handleAssignmentSubmitAction} 
                                        disabled={!assignmentFile}
                                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-xl font-black text-sm uppercase tracking-widest shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:scale-[1.02] transition-all disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
                                    >
                                        Upload & Submit
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

