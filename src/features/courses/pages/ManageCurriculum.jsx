import axios from "axios";
import { BookOpen, FileText, HelpCircle, Plus, Video,X } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useLocation,useNavigate } from "react-router-dom";

import axiosInstance from "../../../core/config/axiosInstance";
import { addAssignment, addLectureToSection, addQuiz, addSection, getCourseSubmissions, gradeUserAssignment } from "../redux/CourseSlice";

export default function ManageCurriculum() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [sections, setSections] = useState(state?.sections || []);

    const [showSectionModal, setShowSectionModal] = useState(false);
    const [sectionTitle, setSectionTitle] = useState("");

    const [showQuizModal, setShowQuizModal] = useState(false);
    const [activeSectionId, setActiveSectionId] = useState(null);
    
    // Quiz State
    const [quizTitle, setQuizTitle] = useState("");
    const [quizDueDate, setQuizDueDate] = useState("");
    const [questions, setQuestions] = useState([{ question: "", options: ["", "", "", ""], answer: 0 }]);

    // Assignment State
    const [showAssignmentModal, setShowAssignmentModal] = useState(false);
    const [assignmentTitle, setAssignmentTitle] = useState("");
    const [assignmentDescription, setAssignmentDescription] = useState("");
    const [assignmentDueDate, setAssignmentDueDate] = useState("");
    const [assignmentFile, setAssignmentFile] = useState(null);

    // Lecture State
    const [showLectureModal, setShowLectureModal] = useState(false);
    const [lectureTitle, setLectureTitle] = useState("");
    const [lectureDescription, setLectureDescription] = useState("");
    const [lectureFile, setLectureFile] = useState(null);

    // Submissions State
    const [showSubmissionsModal, setShowSubmissionsModal] = useState(false);
    const [submissionsData, setSubmissionsData] = useState([]);
    const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(false);
    const [assignmentScores, setAssignmentScores] = useState({});

    if (!state) {
        navigate("/courses");
        return null;
    }

    const handleAddSection = async () => {
        if (!sectionTitle) return toast.error("Title required");
        const res = await dispatch(addSection({ id: state._id, title: sectionTitle }));
        if (res?.payload?.success) {
            setSections(res.payload.course.sections);
            setShowSectionModal(false);
            setSectionTitle("");
        }
    };

    const handleAddQuiz = async () => {
        if (!quizTitle || questions.length === 0) return toast.error("Title and questions required");
        const quizData = { title: quizTitle, dueDate: quizDueDate, questions };
        const res = await dispatch(addQuiz({ id: state._id, sectionId: activeSectionId, quizData }));
        if (res?.payload?.success) {
            setSections(res.payload.course.sections);
            setShowQuizModal(false);
            setQuizTitle("");
            setQuestions([{ question: "", options: ["", "", "", ""], answer: 0 }]);
        }
    };

    const handleAddAssignment = async () => {
        if (!assignmentTitle) return toast.error("Title required");
        const res = await dispatch(addAssignment({ 
            id: state._id, 
            sectionId: activeSectionId, 
            title: assignmentTitle, 
            description: assignmentDescription, 
            dueDate: assignmentDueDate, 
            file: assignmentFile 
        }));
        if (res?.payload?.success) {
            setSections(res.payload.course.sections);
            setShowAssignmentModal(false);
            setAssignmentTitle("");
            setAssignmentDescription("");
            setAssignmentFile(null);
        }
    };

    const handleViewSubmissions = async () => {
        setIsLoadingSubmissions(true);
        setShowSubmissionsModal(true);
        const res = await dispatch(getCourseSubmissions(state._id));
        if (res?.payload) {
            setSubmissionsData(res.payload);
        }
        setIsLoadingSubmissions(false);
    };

    const handleAddLecture = async () => {
        if (!lectureTitle || !lectureDescription || !lectureFile) return toast.error("Title, description, and file required");
        
        const toastId = toast.loading("Uploading lecture... 0%");
        
        try {
            // 1. Get Signature from Backend
            const sigRes = await axiosInstance.get('/courses/cloudinary-signature');
            const { signature, timestamp, cloudName, apiKey } = sigRes.data;

            // 2. Direct Upload to Cloudinary
            const formData = new FormData();
            formData.append('file', lectureFile);
            formData.append('signature', signature);
            formData.append('timestamp', timestamp);
            formData.append('api_key', apiKey);
            formData.append('folder', 'lms_lectures');

            const uploadRes = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/video/upload`, formData, {
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    toast.loading(`Uploading lecture... ${percentCompleted}%`, { id: toastId });
                }
            });

            // 3. Send Cloudinary details to backend
            const { public_id, secure_url } = uploadRes.data;
            
            const res = await dispatch(addLectureToSection({
                id: state._id,
                sectionId: activeSectionId,
                title: lectureTitle,
                description: lectureDescription,
                public_id,
                secure_url
            }));
            
            if (res?.payload?.success) {
                toast.success("Lecture added successfully", { id: toastId });
                setSections(res.payload.course.sections);
                setShowLectureModal(false);
                setLectureTitle("");
                setLectureDescription("");
                setLectureFile(null);
            } else {
                toast.error("Failed to add lecture to course", { id: toastId });
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to upload lecture", { id: toastId });
        }
    };

    const handleGradeAssignment = async (userId, assignmentId) => {
        const score = assignmentScores[`${userId}-${assignmentId}`];
        if (score === undefined || score === "") return toast.error("Enter a valid score");

        const res = await dispatch(gradeUserAssignment({
            userId,
            courseId: state._id,
            assignmentId,
            score: Number(score)
        }));

        if (res?.payload) {
            const updatedSubmissions = await dispatch(getCourseSubmissions(state._id));
            if (updatedSubmissions?.payload) {
                setSubmissionsData(updatedSubmissions.payload);
            }
        }
    };

    return (
        <div className="font-inter text-gray-800 dark:text-gray-200">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-black font-outfit text-gray-900 dark:text-white">Manage Curriculum</h1>
                        <p className="text-sm text-gray-500">Course: {state.title}</p>
                    </div>
                    <div className="flex gap-4">
                        <button onClick={handleViewSubmissions} className="px-6 py-3 bg-blue-500 text-white rounded-xl font-bold hover:scale-105 transition-all">
                            View Submissions
                        </button>
                        <button onClick={() => setShowSectionModal(true)} className="px-6 py-3 bg-yellow-500 text-white rounded-xl font-bold hover:scale-105 transition-all">
                            + Add Section
                        </button>
                    </div>
                </div>

                <div className="space-y-6">
                    {sections.map((section, idx) => (
                        <div key={section._id || idx} className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-black uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                    Section {idx + 1}: {section.title}
                                </h2>
                                <div className="flex gap-2">
                                    <button onClick={() => { setActiveSectionId(section._id); setShowLectureModal(true); }} className="px-3 py-1 bg-green-500/10 text-green-500 text-xs font-bold rounded-lg hover:bg-green-500 hover:text-white transition-all">+ Lecture</button>
                                    <button onClick={() => { setActiveSectionId(section._id); setShowQuizModal(true); }} className="px-3 py-1 bg-purple-500/10 text-purple-500 text-xs font-bold rounded-lg hover:bg-purple-500 hover:text-white transition-all">+ Quiz</button>
                                    <button onClick={() => { setActiveSectionId(section._id); setShowAssignmentModal(true); }} className="px-3 py-1 bg-blue-500/10 text-blue-500 text-xs font-bold rounded-lg hover:bg-blue-500 hover:text-white transition-all">+ Assignment</button>
                                </div>
                            </div>
                            
                            <div className="space-y-3 pl-4 border-l-2 border-gray-100 dark:border-gray-800">
                                {section.lectures?.map((l, lIdx) => (
                                    <div key={`lec-${lIdx}`} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-950/50 rounded-xl">
                                        <div className="w-8 h-8 bg-green-500/10 text-green-500 rounded-lg flex items-center justify-center"><Video size={16} /></div>
                                        <p className="font-bold text-sm">{l.title}</p>
                                    </div>
                                ))}
                                {section.quizzes?.map((q, qIdx) => (
                                    <div key={qIdx} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-950/50 rounded-xl">
                                        <div className="w-8 h-8 bg-purple-500/10 text-purple-500 rounded-lg flex items-center justify-center"><HelpCircle size={16} /></div>
                                        <p className="font-bold text-sm">{q.title}</p>
                                    </div>
                                ))}
                                {section.assignments?.map((a, aIdx) => (
                                    <div key={aIdx} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-950/50 rounded-xl">
                                        <div className="w-8 h-8 bg-blue-500/10 text-blue-500 rounded-lg flex items-center justify-center"><FileText size={16} /></div>
                                        <p className="font-bold text-sm">{a.title}</p>
                                    </div>
                                ))}
                                {(!section.lectures?.length && !section.quizzes?.length && !section.assignments?.length) && (
                                    <p className="text-sm text-gray-400 italic">No tasks added to this section yet.</p>
                                )}
                            </div>
                        </div>
                    ))}
                    {sections.length === 0 && <div className="text-center py-20 text-gray-400 font-bold">No sections created. Add one to start building your curriculum!</div>}
                </div>
            </div>

            {/* Section Modal */}
            {showSectionModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md p-6 space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="font-black text-xl">New Section</h3>
                            <button onClick={() => setShowSectionModal(false)}><X className="text-gray-400" /></button>
                        </div>
                        <input value={sectionTitle} onChange={e => setSectionTitle(e.target.value)} placeholder="e.g. Introduction to React" className="w-full p-3 bg-gray-100 dark:bg-gray-800 rounded-xl outline-none" />
                        <button onClick={handleAddSection} className="w-full py-3 bg-yellow-500 text-white rounded-xl font-bold hover:bg-yellow-600 transition-all">Add Section</button>
                    </div>
                </div>
            )}

            {/* Lecture Modal */}
            {showLectureModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md p-6 space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="font-black text-xl">New Lecture</h3>
                            <button onClick={() => setShowLectureModal(false)}><X className="text-gray-400" /></button>
                        </div>
                        <input value={lectureTitle} onChange={e => setLectureTitle(e.target.value)} placeholder="Lecture Title" className="w-full p-3 bg-gray-100 dark:bg-gray-800 rounded-xl outline-none" />
                        <textarea value={lectureDescription} onChange={e => setLectureDescription(e.target.value)} placeholder="Description" className="w-full p-3 bg-gray-100 dark:bg-gray-800 rounded-xl outline-none min-h-[100px]" />
                        
                        <div className="space-y-1">
                            <p className="text-xs font-bold text-gray-500">Upload Video</p>
                            <input type="file" accept="video/*" onChange={e => setLectureFile(e.target.files[0])} className="w-full p-2 bg-gray-100 dark:bg-gray-800 rounded-xl outline-none text-sm" />
                        </div>

                        <button onClick={handleAddLecture} className="w-full py-3 bg-yellow-500 text-white rounded-xl font-bold hover:bg-yellow-600 transition-all mt-4">Save Lecture</button>
                    </div>
                </div>
            )}

            {/* Quiz Modal */}
            {showQuizModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center">
                            <h3 className="font-black text-xl">New Quiz</h3>
                            <button onClick={() => setShowQuizModal(false)}><X className="text-gray-400" /></button>
                        </div>
                        <input value={quizTitle} onChange={e => setQuizTitle(e.target.value)} placeholder="Quiz Title" className="w-full p-3 bg-gray-100 dark:bg-gray-800 rounded-xl outline-none" />
                        <input type="date" value={quizDueDate} onChange={e => setQuizDueDate(e.target.value)} className="w-full p-3 bg-gray-100 dark:bg-gray-800 rounded-xl outline-none" />
                        
                        <div className="space-y-4 mt-4">
                            <h4 className="font-bold">Questions</h4>
                            {questions.map((q, qIdx) => (
                                <div key={qIdx} className="p-4 border border-gray-200 dark:border-gray-800 rounded-xl space-y-3">
                                    <input value={q.question} onChange={e => {
                                        const newQ = [...questions];
                                        newQ[qIdx].question = e.target.value;
                                        setQuestions(newQ);
                                    }} placeholder="Question Text" className="w-full p-2 bg-gray-50 dark:bg-gray-800 rounded-lg outline-none text-sm" />
                                    
                                    <div className="grid grid-cols-2 gap-2">
                                        {q.options.map((opt, optIdx) => (
                                            <div key={optIdx} className="flex items-center gap-2">
                                                <input type="radio" name={`q-${qIdx}`} checked={q.answer === optIdx} onChange={() => {
                                                    const newQ = [...questions];
                                                    newQ[qIdx].answer = optIdx;
                                                    setQuestions(newQ);
                                                }} />
                                                <input value={opt} onChange={e => {
                                                    const newQ = [...questions];
                                                    newQ[qIdx].options[optIdx] = e.target.value;
                                                    setQuestions(newQ);
                                                }} placeholder={`Option ${optIdx + 1}`} className="flex-1 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg outline-none text-xs" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            <button onClick={() => setQuestions([...questions, { question: "", options: ["", "", "", ""], answer: 0 }])} className="text-sm font-bold text-yellow-500">+ Add Question</button>
                        </div>

                        <button onClick={handleAddQuiz} className="w-full py-3 bg-yellow-500 text-white rounded-xl font-bold hover:bg-yellow-600 transition-all mt-6">Save Quiz</button>
                    </div>
                </div>
            )}

            {/* Assignment Modal */}
            {showAssignmentModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md p-6 space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="font-black text-xl">New Assignment</h3>
                            <button onClick={() => setShowAssignmentModal(false)}><X className="text-gray-400" /></button>
                        </div>
                        <input value={assignmentTitle} onChange={e => setAssignmentTitle(e.target.value)} placeholder="Assignment Title" className="w-full p-3 bg-gray-100 dark:bg-gray-800 rounded-xl outline-none" />
                        <textarea value={assignmentDescription} onChange={e => setAssignmentDescription(e.target.value)} placeholder="Description (Optional)" className="w-full p-3 bg-gray-100 dark:bg-gray-800 rounded-xl outline-none min-h-[100px]" />
                        <input type="date" value={assignmentDueDate} onChange={e => setAssignmentDueDate(e.target.value)} className="w-full p-3 bg-gray-100 dark:bg-gray-800 rounded-xl outline-none" />
                        
                        <div className="space-y-1">
                            <p className="text-xs font-bold text-gray-500">Upload PDF (Optional)</p>
                            <input type="file" accept=".pdf" onChange={e => setAssignmentFile(e.target.files[0])} className="w-full p-2 bg-gray-100 dark:bg-gray-800 rounded-xl outline-none text-sm" />
                        </div>

                        <button onClick={handleAddAssignment} className="w-full py-3 bg-yellow-500 text-white rounded-xl font-bold hover:bg-yellow-600 transition-all mt-4">Save Assignment</button>
                    </div>
                </div>
            )}
            {/* Submissions Modal */}
            {showSubmissionsModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-4xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center">
                            <h3 className="font-black text-2xl text-gray-900 dark:text-white">Student Submissions</h3>
                            <button onClick={() => setShowSubmissionsModal(false)} className="text-gray-400 hover:text-rose-500 transition-all"><X size={28} /></button>
                        </div>
                        
                        {isLoadingSubmissions ? (
                            <div className="py-20 text-center font-bold text-gray-500">Loading submissions...</div>
                        ) : submissionsData.length === 0 ? (
                            <div className="py-20 text-center font-bold text-gray-500">No submissions yet for this course.</div>
                        ) : (
                            <div className="space-y-6">
                                {submissionsData.map((user, idx) => (
                                    <div key={idx} className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-4">
                                        <div className="flex items-center gap-4 border-b border-gray-200 dark:border-gray-700 pb-4">
                                            <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center font-black text-xl">
                                                {user.fullName.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-lg text-gray-900 dark:text-white">{user.fullName}</p>
                                                <p className="text-sm text-gray-500">{user.email}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <h4 className="font-bold text-sm text-gray-500 uppercase tracking-widest mb-3">Quizzes</h4>
                                                {user.completedQuizzes?.length > 0 ? (
                                                    <div className="space-y-2">
                                                        {user.completedQuizzes.map((q, qIdx) => (
                                                            <div key={qIdx} className="flex justify-between items-center bg-white dark:bg-gray-900 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                                                                <span className="font-bold text-sm">{q.topic || 'Quiz'}</span>
                                                                <span className="text-xs font-black bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded-lg">
                                                                    Score: {q.score} / {q.totalQuestions}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : <p className="text-sm text-gray-400 italic">No quizzes completed.</p>}
                                            </div>
                                            
                                            <div>
                                                <h4 className="font-bold text-sm text-gray-500 uppercase tracking-widest mb-3">Assignments</h4>
                                                {user.completedAssignments?.length > 0 ? (
                                                    <div className="space-y-2">
                                                        {user.completedAssignments.map((a, aIdx) => (
                                                            <div key={aIdx} className="flex flex-col gap-2 bg-white dark:bg-gray-900 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                                                                <div className="flex justify-between items-center">
                                                                    <span className="font-bold text-sm">Assignment ID: {a.assignmentId.slice(-4)}</span>
                                                                    {a.fileUrl ? (
                                                                        <a 
                                                                            href={a.fileUrl} 
                                                                            target="_blank" 
                                                                            rel="noopener noreferrer" 
                                                                            className="text-xs font-black bg-blue-500/10 text-blue-500 px-2 py-1 rounded-lg hover:bg-blue-500 hover:text-white transition-all flex items-center gap-1"
                                                                        >
                                                                            <FileText size={12} /> View File
                                                                        </a>
                                                                    ) : (
                                                                        <span className="text-xs font-black bg-gray-500/10 text-gray-500 px-2 py-1 rounded-lg">No File</span>
                                                                    )}
                                                                </div>
                                                                <div className="flex items-center gap-2 mt-2">
                                                                    <input 
                                                                        type="number" 
                                                                        placeholder="Score" 
                                                                        className="w-20 p-1 text-sm bg-gray-50 dark:bg-gray-800 rounded-lg outline-none border border-gray-200 dark:border-gray-700"
                                                                        value={assignmentScores[`${user.userId}-${a.assignmentId}`] || a.score || ""}
                                                                        onChange={(e) => setAssignmentScores(prev => ({...prev, [`${user.userId}-${a.assignmentId}`]: e.target.value}))}
                                                                    />
                                                                    <button 
                                                                        onClick={() => handleGradeAssignment(user.userId, a.assignmentId)}
                                                                        className="px-2 py-1 bg-yellow-500 text-white text-xs font-bold rounded-lg hover:bg-yellow-600 transition-all"
                                                                    >
                                                                        Save Score
                                                                    </button>
                                                                </div>
                                                                {a.score !== undefined && (
                                                                    <p className="text-xs text-green-500 font-bold mt-1">Graded: {a.score}</p>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : <p className="text-sm text-gray-400 italic">No assignments submitted.</p>}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
