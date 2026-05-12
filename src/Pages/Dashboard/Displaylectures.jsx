import { useRef } from "react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, FileText, Trash2, Plus, ArrowLeft, Video, List, CheckCircle, Clock, MessageSquare, Send, User as UserIcon, Award, FastForward, Bookmark, Subtitles, HelpCircle, XCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import html2canvas from "html2canvas";


import HomeLayout from "../../Layouts/HomeLayout";
import Certificate from "../../Components/Certificate";
import { deleteCourseLecture, getCourseLectures } from "../../Redux/Slices/LectureSlice";
import { updateCourseProgress, submitQuiz, submitAssignment } from "../../Redux/Slices/AuthSlice";
import { LectureSkeleton } from "../../Components/Skeleton";
import axiosInstance from "../../Helpers/axiosInstance";

function Displaylectures() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { state } = useLocation();
    const certificateRef = useRef(null);

    const { lectures, isLoading } = useSelector((state) => state.lecture);
    const { role, data: userData } = useSelector((state) => state.auth);

    const [currentVideo, setCurrentVideo] = useState(0);
    const [activeTab, setActiveTab] = useState("playlist"); // playlist, tasks, notes, qa, bookmarks
    const videoRef = useRef(null);
    const lastSavedTime = useRef(0);
    const [noteInput, setNoteInput] = useState("");
    const [playbackRate, setPlaybackRate] = useState(1);
    const [showCaptions, setShowCaptions] = useState(false);
    const [bookmarks, setBookmarks] = useState([]);
    const [activeQuiz, setActiveQuiz] = useState(null);
    const [quizAnswers, setQuizAnswers] = useState({});
    
    // Task States
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [quizPageAnswers, setQuizPageAnswers] = useState({});
    
    const [notes, setNotes] = useState([]);
    
    // Q&A States
    const [discussions, setDiscussions] = useState([]);
    const [questionInput, setQuestionInput] = useState("");
    const [replyInputs, setReplyInputs] = useState({});

    // FETCH LOGIC
    const fetchNotes = async () => {
        try {
            const res = await axiosInstance.get(`/interaction/note/${state._id}`);
            setNotes(res.data.notes);
        } catch (error) {
            console.error("Failed to fetch notes");
        }
    };

    const fetchBookmarks = async () => {
        try {
            const res = await axiosInstance.get(`/interaction/bookmark/${state._id}`);
            setBookmarks(res.data.bookmarks);
        } catch (error) {
            console.error("Failed to fetch bookmarks");
        }
    };

    // Q&A Logic
    // LOGIC: Q&A - Community Discussions
    // This function talks to the server to get all questions and answers for the current video.
    const fetchDiscussions = async () => {
        if (!state?._id || !lectures[currentVideo]?._id) return;
        try {
            const res = await axiosInstance.get(`/discussions/${state._id}/${lectures[currentVideo]._id}`);
            setDiscussions(res.data.discussions); // Save the community chat to our screen
        } catch (error) {
            console.error("Failed to fetch discussions");
        }
    };

    // Every time you switch a video, we refresh the community chat.
    useEffect(() => {
        if (activeTab === "qa") fetchDiscussions();
    }, [activeTab, currentVideo, lectures]);

    // LOGIC: Posting a Question
    // When you type a question and hit send, this sends your text to our database.
    const handlePostQuestion = async () => {
        if (!questionInput.trim()) return;
        const timestamp = videoRef.current ? Math.floor(videoRef.current.currentTime) : null;
        try {
            await axiosInstance.post('/discussions/question', {
                courseId: state._id,
                lectureId: lectures[currentVideo]._id,
                question: questionInput,
                timestamp
            });
            setQuestionInput("");
            fetchDiscussions();
            toast.success("Doubt posted with timestamp!");
        } catch (error) {
            toast.error("Failed to post question");
        }
    };

    // LOGIC: Certificate Generation
    // This is like a 'digital camera'. It takes a high-quality picture of the hidden 
    // certificate template and turns it into a PDF file you can download.
    const handleDownloadCertificate = async () => {
        const loadingToast = toast.loading("Generating your verified certificate...");
        try {
            const element = certificateRef.current; // Target the hidden template
            const canvas = await html2canvas(element, {
                scale: 2, // High resolution (retina quality)
                useCORS: true,
                logging: false,
            });
            const imgData = canvas.toDataURL('image/png'); // Convert picture to data
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'px',
                format: [canvas.width, canvas.height]
            });
            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
            pdf.save(`${userData?.fullName.replace(/\s+/g, '_')}_Certificate.pdf`); // Download!
            toast.success("Certificate downloaded! Congratulations!", { id: loadingToast });
        } catch (error) {
            console.error(error);
            toast.error("Failed to generate certificate.", { id: loadingToast });
        }
    };

    // LOGIC: Exporting Notes to PDF
    // This takes all the little notes you wrote and puts them into a professional table in a PDF.
    const handleExportNotes = () => {
        if (notes.length === 0) {
            toast.error("No notes to export!");
            return;
        }

        const doc = new jsPDF();

        // Branded Header
        doc.setFontSize(20);
        doc.setTextColor(16, 185, 129); // Learnify Emerald Green
        doc.text("Study Notes - Learnify", 14, 22);

        doc.setFontSize(12);
        doc.setTextColor(100);
        doc.text(`Course: ${state?.title}`, 14, 32);

        // Turn the notes list into table rows
        const tableData = notes.map(n => [
            formatTime(n.timestamp),
            n.lectureTitle || "General",
            n.text
        ]);

        // Auto-generate the table
        doc.autoTable({
            startY: 45,
            head: [['Time', 'Module', 'Note Content']],
            body: tableData,
            headStyles: { fillColor: [16, 185, 129] },
        });

        doc.save(`${state?.title}_Notes.pdf`);
        toast.success("Notes exported as PDF!");
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Progress Logic
    const courseProgress = userData?.progress?.find(p => p.courseId === state?._id);
    const completedLectures = courseProgress?.completedLectures || [];

    const handleProgressToggle = async (lectureId) => {
        await dispatch(updateCourseProgress({ courseId: state._id, lectureId }));
    };

    // INTERACTIVE HANDLERS
    const handleAddBookmark = async () => {
        if (!videoRef.current) return;
        const timestamp = Math.floor(videoRef.current.currentTime);
        const label = `Bookmark at ${formatTime(timestamp)}`;
        try {
            await axiosInstance.post('/interaction/bookmark', {
                courseId: state._id,
                lectureId: lectures[currentVideo]._id,
                timestamp,
                label
            });
            fetchBookmarks();
            toast.success("Moment bookmarked!", { icon: '🔖' });
        } catch (error) {
            toast.error("Failed to save bookmark");
        }
    };

    const handleAddNote = async () => {
        if (!noteInput.trim() || !videoRef.current) return;
        const timestamp = Math.floor(videoRef.current.currentTime);
        try {
            await axiosInstance.post('/interaction/note', {
                courseId: state._id,
                lectureId: lectures[currentVideo]._id,
                lectureTitle: lectures[currentVideo].title,
                timestamp,
                text: noteInput
            });
            setNoteInput("");
            fetchNotes();
            toast.success("Note saved with timestamp!");
        } catch (error) {
            toast.error("Failed to save note");
        }
    };

    const handleSpeedChange = (rate) => {
        setPlaybackRate(rate);
        if (videoRef.current) videoRef.current.playbackRate = rate;
        toast.success(`Speed: ${rate}x`, { duration: 1000 });
    };

    const handleTimeUpdate = async () => {
        if (!videoRef.current) return;
        const currentTime = Math.floor(videoRef.current.currentTime);

        // LOGIC: In-Video Quizzes
        // We check if there's a quiz scheduled for this exact second.
        const currentLecture = lectures[currentVideo];
        if (currentLecture?.inVideoQuizzes) {
            const quiz = currentLecture.inVideoQuizzes.find(q => Math.floor(q.timestamp) === currentTime);
            if (quiz && activeQuiz?.timestamp !== quiz.timestamp) {
                setActiveQuiz(quiz);
                videoRef.current.pause();
                toast("Quiz time! Check the video overlay.", { icon: '❓' });
            }
        }

        // Save progress every 10 seconds
        if (currentTime % 10 === 0 && currentTime !== lastSavedTime.current) {
            lastSavedTime.current = currentTime;
            await axiosInstance.post("/user/video-progress", {
                courseId: state._id,
                lectureId: lectures[currentVideo]._id,
                timestamp: currentTime
            });
        }
    };

    // LOGIC: Auto-Resume
    const handleLoadedMetadata = () => {
        const savedProgress = userData?.recentlyWatched?.find(
            p => p.courseId === state?._id && p.lectureId === lectures[currentVideo]?._id
        );
        if (savedProgress && videoRef.current) {
            videoRef.current.currentTime = savedProgress.timestamp;
            toast.success(`Resumed from ${formatTime(savedProgress.timestamp)}`, { icon: '🕒', duration: 2000 });
        }
        // Apply playback rate on video load
        if (videoRef.current) videoRef.current.playbackRate = playbackRate;
    };

    // LOGIC: Seek to a specific timestamp (used by notes, bookmarks, Q&A)
    const seekToTime = (seconds) => {
        if (videoRef.current) {
            videoRef.current.currentTime = seconds;
            videoRef.current.play();
            toast.success(`Jumped to ${formatTime(seconds)}`, { icon: '⏩', duration: 1500 });
        }
    };

    // LOGIC: Handle quiz answer
    const handleQuizAnswer = (quizTimestamp, selectedIndex) => {
        setQuizAnswers(prev => ({ ...prev, [quizTimestamp]: selectedIndex }));
    };

    const handleQuizSubmit = () => {
        if (!activeQuiz) return;
        const selected = quizAnswers[activeQuiz.timestamp];
        if (selected === undefined) {
            toast.error("Please select an answer!");
            return;
        }
        if (selected === activeQuiz.answer) {
            toast.success("Correct! Great job! 🎉", { duration: 3000 });
        } else {
            toast.error("Not quite right. Keep learning!", { duration: 3000 });
        }
        setActiveQuiz(null);
        if (videoRef.current) videoRef.current.play();
    };

    // LOGIC: Delete a note from DB
    const handleDeleteNote = async (noteId) => {
        try {
            await axiosInstance.delete(`/interaction/note/${noteId}`);
            fetchNotes();
            toast.success("Note deleted");
        } catch (error) {
            toast.error("Failed to delete note");
        }
    };

    const handleSectionQuizSubmit = async () => {
        if (!selectedQuiz) return;
        let score = 0;
        selectedQuiz.questions.forEach((q, idx) => {
            if (quizPageAnswers[idx] === q.answer) score++;
        });

        const res = await dispatch(submitQuiz({
            courseId: state._id,
            quizId: selectedQuiz._id,
            score,
            totalQuestions: selectedQuiz.questions.length,
            topic: selectedQuiz.title
        }));

        if (res.payload?.success) {
            setSelectedQuiz(null);
            setQuizPageAnswers({});
        }
    };

    const handleAssignmentSubmitAction = async (assignmentId) => {
        const res = await dispatch(submitAssignment({
            courseId: state._id,
            assignmentId
        }));
        if (res.payload?.success) {
            setSelectedAssignment(null);
        }
    };

    const overallProgress = lectures?.length > 0
        ? Math.round((completedLectures.length / lectures.length) * 100)
        : 0;

    useEffect(() => {
        if (!state) {
            navigate("/courses");
            return;
        }
        dispatch(getCourseLectures(state._id));
        fetchNotes();
        fetchBookmarks();
    }, [dispatch, navigate, state]);

    const onLectureDelete = async (courseId, lectureId) => {
        if (window.confirm("Are you sure you want to delete this lecture?")) {
            await dispatch(deleteCourseLecture({ courseId, lectureId }));
            await dispatch(getCourseLectures(courseId));
        }
    };

    return (
        <HomeLayout>
            <div className="min-h-screen pt-24 pb-12 px-6 lg:px-20 bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10">

                    {/* Left: Video Player Area */}
                    <div className="flex-1 space-y-8">
                        <div className="flex items-center justify-between">
                            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-emerald-500 font-bold transition-colors">
                                <ArrowLeft size={20} /> Back to Course
                            </button>
                            <div className="flex items-center gap-4">
                                {overallProgress === 100 && (
                                    <button
                                        onClick={handleDownloadCertificate}
                                        className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-amber-500/20 hover:scale-105 transition-all"
                                    >
                                        <Award size={16} /> Claim Certificate
                                    </button>
                                )}
                                <div className="text-right hidden sm:block">
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Overall Progress</p>
                                    <p className="text-lg font-black text-emerald-500">{overallProgress}%</p>
                                </div>
                                <div className="w-32 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 transition-all duration-1000 ease-out" style={{ width: `${overallProgress}%` }}></div>
                                </div>
                            </div>
                        </div>

                        <div className="relative aspect-video bg-black rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white dark:border-slate-900 shadow-emerald-500/5">
                            <AnimatePresence mode="wait">
                                {lectures?.length > 0 ? (
                                    <motion.video
                                        key={lectures[currentVideo]?._id}
                                        ref={videoRef}
                                        onTimeUpdate={handleTimeUpdate}
                                        onLoadedMetadata={handleLoadedMetadata}
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                        src={lectures[currentVideo]?.lecture?.secure_url}
                                        className="w-full h-full object-contain"
                                        controls controlsList="nodownload" disablePictureInPicture
                                    ></motion.video>
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 gap-4">
                                        <Video size={64} className="animate-pulse" />
                                        <p className="text-xl font-bold italic">No lectures available yet</p>
                                    </div>
                                )}
                            </AnimatePresence>

                            {/* Captions Overlay */}
                            {showCaptions && lectures?.length > 0 && (
                                <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-black/80 text-white px-6 py-2 rounded-xl text-sm font-medium max-w-[80%] text-center pointer-events-none">
                                    <p className="italic">
                                        {videoRef.current?.currentTime > 10 ? "[ Speaker is explaining the core concept of this module ]" : "[ Introduction to the lecture topic ]"}
                                    </p>
                                </div>
                            )}

                            {/* In-Video Quiz Overlay */}
                            <AnimatePresence>
                                {activeQuiz && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 bg-black/90 flex items-center justify-center z-20 p-6"
                                    >
                                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-md w-full space-y-6 shadow-2xl border border-slate-200 dark:border-slate-800">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center">
                                                    <HelpCircle size={22} />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Knowledge Check</p>
                                                    <p className="text-[10px] font-bold text-emerald-500">at {formatTime(activeQuiz.timestamp)}</p>
                                                </div>
                                            </div>
                                            <p className="text-lg font-black text-slate-900 dark:text-white leading-tight">{activeQuiz.question}</p>
                                            <div className="space-y-3">
                                                {activeQuiz.options?.map((option, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => handleQuizAnswer(activeQuiz.timestamp, idx)}
                                                        className={`w-full text-left p-4 rounded-2xl border text-sm font-bold transition-all ${
                                                            quizAnswers[activeQuiz.timestamp] === idx
                                                                ? 'bg-emerald-500 text-white border-emerald-400 shadow-lg shadow-emerald-500/20'
                                                                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-500/50'
                                                        }`}
                                                    >
                                                        <span className="mr-3 text-[10px] font-black uppercase">{String.fromCharCode(65 + idx)}.</span>
                                                        {option}
                                                    </button>
                                                ))}
                                            </div>
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={handleQuizSubmit}
                                                    className="flex-1 py-3 bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all"
                                                >
                                                    Submit Answer
                                                </button>
                                                <button
                                                    onClick={() => { setActiveQuiz(null); if (videoRef.current) videoRef.current.play(); }}
                                                    className="py-3 px-4 bg-slate-200 dark:bg-slate-800 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all"
                                                >
                                                    Skip
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            
                            {/* Section Quiz Fullscreen Overlay */}
                            <AnimatePresence>
                                {selectedQuiz && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-white dark:bg-slate-950 z-30 p-10 flex flex-col items-center justify-center overflow-y-auto">
                                        <button onClick={() => setSelectedQuiz(null)} className="absolute top-6 right-6 text-slate-400 hover:text-rose-500 transition-all"><XCircle size={32} /></button>
                                        <div className="max-w-2xl w-full space-y-8">
                                            <div className="text-center space-y-2">
                                                <h2 className="text-3xl font-black font-outfit text-slate-900 dark:text-white">{selectedQuiz.title}</h2>
                                                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Section Assessment</p>
                                            </div>
                                            <div className="space-y-10">
                                                {selectedQuiz.questions.map((q, qIdx) => (
                                                    <div key={qIdx} className="space-y-4">
                                                        <h3 className="text-lg font-black text-slate-800 dark:text-slate-200">{qIdx + 1}. {q.question}</h3>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                            {q.options.map((opt, optIdx) => (
                                                                <button
                                                                    key={optIdx}
                                                                    onClick={() => setQuizPageAnswers({ ...quizPageAnswers, [qIdx]: optIdx })}
                                                                    className={`p-4 rounded-2xl border text-sm font-bold transition-all text-left ${quizPageAnswers[qIdx] === optIdx ? 'bg-emerald-500 text-white border-emerald-400 shadow-lg shadow-emerald-500/20' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-emerald-500'}`}
                                                                >
                                                                    {opt}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <button onClick={handleSectionQuizSubmit} className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:scale-[1.02] transition-all">Submit Final Assessment</button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Interactive Control Bar */}
                        {lectures?.length > 0 && (
                            <div className="flex items-center justify-between p-4 glass-card rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                                {/* Speed Control */}
                                <div className="flex items-center gap-2">
                                    <FastForward size={16} className="text-slate-400" />
                                    <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1 gap-0.5">
                                        {[0.5, 1, 1.25, 1.5, 2].map(rate => (
                                            <button
                                                key={rate}
                                                onClick={() => handleSpeedChange(rate)}
                                                className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${
                                                    playbackRate === rate
                                                        ? 'bg-emerald-500 text-white shadow-sm'
                                                        : 'text-slate-500 hover:text-emerald-500'
                                                }`}
                                            >
                                                {rate}x
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => { setActiveTab("qa"); toast.success("Doubt section opened!", { icon: '❓' }); }}
                                        className="flex items-center gap-1.5 px-3 py-2 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all"
                                    >
                                        <HelpCircle size={14} /> Ask Doubt
                                    </button>
                                    <button
                                        onClick={handleAddBookmark}
                                        className="flex items-center gap-1.5 px-3 py-2 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-500 hover:text-white transition-all"
                                    >
                                        <Bookmark size={14} /> Bookmark
                                    </button>
                                    <button
                                        onClick={() => setShowCaptions(!showCaptions)}
                                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                                            showCaptions
                                                ? 'bg-blue-500 text-white border-blue-400'
                                                : 'bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500 hover:text-white'
                                        }`}
                                    >
                                        <Subtitles size={14} /> CC
                                    </button>
                                </div>
                            </div>
                        )}

                        {lectures?.[currentVideo] && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 p-8 glass-card rounded-[2rem] bg-white dark:bg-slate-900/50">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3">
                                            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase rounded-full border border-emerald-500/20">Module {currentVideo + 1}</span>
                                            {completedLectures.includes(lectures[currentVideo]?._id) && (
                                                <span className="flex items-center gap-1 text-emerald-500 font-bold text-xs"><CheckCircle size={14} /> Completed</span>
                                            )}
                                        </div>
                                        <h1 className="text-3xl font-black font-outfit text-slate-900 dark:text-white leading-tight">{lectures[currentVideo]?.title}</h1>
                                    </div>
                                    <button
                                        onClick={() => handleProgressToggle(lectures[currentVideo]?._id)}
                                        className={`px-6 py-3 rounded-xl font-black text-sm uppercase tracking-widest transition-all ${completedLectures.includes(lectures[currentVideo]?._id) ? 'bg-slate-200 dark:bg-slate-800 text-slate-500' : 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40'}`}
                                    >
                                        {completedLectures.includes(lectures[currentVideo]?._id) ? "Mark Incomplete" : "Mark as Completed"}
                                    </button>
                                </div>
                                <div className="w-full h-px bg-slate-200 dark:bg-slate-800"></div>
                                <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed italic">{lectures[currentVideo]?.description}</p>
                            </motion.div>
                        )}
                    </div>

                    {/* Right: Sidebar with Tabs */}
                    <div className="w-full lg:w-[400px] flex flex-col gap-6">
                        <div className="p-2 bg-slate-200 dark:bg-slate-900 rounded-[1.8rem] flex gap-1">
                            {["playlist", "tasks", "notes", "qa", "bookmarks"].map((tab) => (
                                <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-3 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white dark:bg-slate-800 text-emerald-500 shadow-sm' : 'text-slate-500'}`}>
                                    {tab === "qa" ? "Q&A" : tab === "bookmarks" ? "★" : tab}
                                </button>
                            ))}
                        </div>

                        <div className="p-8 glass-card rounded-[2.5rem] flex-1 flex flex-col overflow-hidden h-[700px] bg-white dark:bg-slate-900/30">
                            {activeTab === "playlist" && (
                                <>
                                    <div className="flex items-center justify-between mb-8">
                                        <h2 className="text-xl font-black font-outfit text-slate-900 dark:text-white">Modules</h2>
                                    </div>
                                    <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                                        {isLoading ? [...Array(5)].map((_, i) => <LectureSkeleton key={i} />) :
                                            lectures?.map((lecture, index) => (
                                                <div key={lecture._id} onClick={() => setCurrentVideo(index)} className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer group flex items-center gap-4 ${currentVideo === index ? 'bg-emerald-500 border-emerald-400 shadow-lg shadow-emerald-500/20' : 'bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:border-emerald-500/30'}`}>
                                                    <div className="relative">
                                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${currentVideo === index ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-900 text-slate-400'}`}>
                                                            <Play size={18} fill={currentVideo === index ? "currentColor" : "none"} />
                                                        </div>
                                                        {completedLectures.includes(lecture._id) && <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full flex items-center justify-center text-white"><CheckCircle size={12} /></div>}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${currentVideo === index ? 'text-white/70' : 'text-slate-400'}`}>Module {index + 1}</p>
                                                        <h3 className={`font-bold text-sm truncate ${currentVideo === index ? 'text-white' : 'text-slate-700 dark:text-slate-300'}`}>{lecture.title}</h3>
                                                    </div>
                                                    {role === "ADMIN" && <button onClick={(e) => { e.stopPropagation(); onLectureDelete(state._id, lecture._id); }} className={`p-2 rounded-lg transition-all ${currentVideo === index ? 'hover:bg-white/20 text-white/50 hover:text-white' : 'text-slate-400 hover:text-rose-500 hover:bg-rose-500/10'}`}><Trash2 size={16} /></button>}
                                                </div>
                                            ))
                                        }
                                    </div>
                                    {role === "ADMIN" && <button onClick={() => navigate("/course/addlecture", { state: { ...state } })} className="mt-6 w-full py-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2"><Plus size={18} /> Add Module</button>}
                                </>
                            )}

                            {activeTab === "tasks" && (
                                <div className="flex flex-col h-full">
                                    <h2 className="text-xl font-black font-outfit text-slate-900 dark:text-white mb-8">Course Tasks</h2>
                                    <div className="flex-1 overflow-y-auto pr-2 space-y-6 custom-scrollbar">
                                        {state.sections?.map((section, sIdx) => (
                                            <div key={sIdx} className="space-y-4">
                                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">{section.title}</h3>
                                                
                                                {/* Quizzes */}
                                                {section.quizzes?.map((quiz, qIdx) => (
                                                    <div key={qIdx} className="p-4 bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-between group">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center"><HelpCircle size={18} /></div>
                                                            <div>
                                                                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">{quiz.title}</h4>
                                                                <p className="text-[10px] font-bold text-slate-400 uppercase">Assessment</p>
                                                            </div>
                                                        </div>
                                                        <button 
                                                            onClick={() => setSelectedQuiz(quiz)}
                                                            className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-emerald-500/10"
                                                        >
                                                            Start
                                                        </button>
                                                    </div>
                                                ))}

                                                {/* Assignments */}
                                                {section.assignments?.map((assignment, aIdx) => (
                                                    <div key={aIdx} className="p-4 bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-between group">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center"><FileText size={18} /></div>
                                                            <div>
                                                                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">{assignment.title}</h4>
                                                                <p className="text-[10px] font-bold text-slate-400 uppercase">Assignment</p>
                                                            </div>
                                                        </div>
                                                        <button 
                                                            onClick={() => handleAssignmentSubmitAction(assignment._id)}
                                                            className="px-4 py-2 bg-blue-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-blue-500/10"
                                                        >
                                                            Submit
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === "notes" && (
                                <div className="flex flex-col h-full">
                                    <div className="flex items-center justify-between mb-8">
                                        <h2 className="text-xl font-black font-outfit text-slate-900 dark:text-white">Timestamp Notes</h2>
                                        <div className="flex gap-4">
                                            {notes.length > 0 && (
                                                <button
                                                    onClick={handleExportNotes}
                                                    className="text-[10px] font-black text-emerald-500 uppercase tracking-widest hover:underline flex items-center gap-1"
                                                >
                                                    Export PDF
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <div className="mb-6 relative">
                                        <textarea value={noteInput} onChange={(e) => setNoteInput(e.target.value)} placeholder="Write a note at current timestamp..." className="w-full bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 h-24 font-medium text-slate-700 dark:text-slate-200" />
                                        <div className="absolute bottom-3 right-3 flex items-center gap-2">
                                            <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg">
                                                <Clock size={10} className="inline mr-1" />
                                                {videoRef.current ? formatTime(Math.floor(videoRef.current.currentTime || 0)) : "0:00"}
                                            </span>
                                            <button onClick={handleAddNote} className="p-2 bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all"><Plus size={20} /></button>
                                        </div>
                                    </div>
                                    <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                                        {notes.length > 0 ? notes.map((note) => (
                                            <div key={note._id} className="p-4 bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl space-y-2 group relative">
                                                <div className="flex items-center justify-between">
                                                    <button onClick={() => seekToTime(note.timestamp)} className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[10px] font-black rounded-lg hover:bg-emerald-500 hover:text-white transition-all cursor-pointer">
                                                        <Clock size={10} /> {formatTime(note.timestamp)}
                                                    </button>
                                                    <button onClick={() => handleDeleteNote(note._id)} className="text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={14} /></button>
                                                </div>
                                                <p className="text-slate-700 dark:text-slate-300 text-sm font-medium leading-relaxed">{note.text}</p>
                                                <p className="text-[10px] text-slate-400 font-bold italic truncate">@{note.lectureTitle}</p>
                                            </div>
                                        )) : <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4 opacity-50"><FileText size={48} /><p className="text-sm font-bold italic text-center">No notes yet. Add one at any timestamp!</p></div>}
                                    </div>
                                </div>
                            )}

                            {activeTab === "qa" && (
                                <div className="flex flex-col h-full">
                                    <h2 className="text-xl font-black font-outfit text-slate-900 dark:text-white mb-2">Ask Doubt</h2>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Your question will be tagged at the current timestamp</p>
                                    <div className="mb-6 relative">
                                        <input value={questionInput} onChange={(e) => setQuestionInput(e.target.value)} placeholder="Ask a doubt at this moment..." className="w-full bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 font-medium text-slate-700 dark:text-slate-200" />
                                        <button onClick={handlePostQuestion} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-emerald-500 hover:scale-110 transition-all"><Send size={20} /></button>
                                    </div>
                                    <div className="flex-1 overflow-y-auto pr-2 space-y-6 custom-scrollbar">
                                        {discussions.length > 0 ? discussions.map((d) => (
                                            <div key={d._id} className="space-y-4">
                                                <div className="flex gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 flex-shrink-0">
                                                        {d.userAvatar ? <img src={d.userAvatar} className="w-full h-full rounded-full object-cover" /> : <UserIcon size={14} />}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{d.userName} • {new Date(d.createdAt).toLocaleDateString()}</p>
                                                            {d.timestamp != null && (
                                                                <button onClick={() => seekToTime(d.timestamp)} className="flex items-center gap-1 px-2 py-0.5 bg-blue-500/10 text-blue-500 text-[10px] font-black rounded-lg hover:bg-blue-500 hover:text-white transition-all">
                                                                    <Clock size={10} /> {formatTime(d.timestamp)}
                                                                </button>
                                                            )}
                                                        </div>
                                                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-tight mb-3">{d.question}</p>

                                                        {/* Replies */}
                                                        <div className="pl-4 border-l-2 border-slate-100 dark:border-slate-800 space-y-3">
                                                            {d.replies?.map((r, i) => (
                                                                <div key={i} className="text-xs bg-slate-50 dark:bg-slate-950/50 p-3 rounded-xl">
                                                                    <p className="font-black text-[9px] text-emerald-500 uppercase tracking-widest mb-1">{r.userName}</p>
                                                                    <p className="text-slate-600 dark:text-slate-400">{r.reply}</p>
                                                                </div>
                                                            ))}
                                                            <div className="flex gap-2">
                                                                <input
                                                                    value={replyInputs[d._id] || ""}
                                                                    onChange={(e) => setReplyInputs({ ...replyInputs, [d._id]: e.target.value })}
                                                                    placeholder="Reply..."
                                                                    className="flex-1 bg-transparent border-b border-slate-200 dark:border-slate-800 text-xs py-1 focus:outline-none focus:border-emerald-500"
                                                                />
                                                                <button onClick={() => handlePostReply(d._id)} className="text-emerald-500 hover:scale-110 transition-all"><Send size={14} /></button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )) : <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4 opacity-50"><MessageSquare size={48} /><p className="text-sm font-bold italic text-center">No discussions yet. Be the first!</p></div>}
                                    </div>
                                </div>
                            )}

                            {activeTab === "bookmarks" && (
                                <div className="flex flex-col h-full">
                                    <div className="flex items-center justify-between mb-8">
                                        <h2 className="text-xl font-black font-outfit text-slate-900 dark:text-white">Bookmarks</h2>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{bookmarks.length} saved</span>
                                    </div>
                                    <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                                        {bookmarks.length > 0 ? bookmarks.map((bm) => (
                                            <div key={bm._id} className="p-4 bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center gap-4 group hover:border-amber-500/30 transition-all">
                                                <button
                                                    onClick={() => seekToTime(bm.timestamp)}
                                                    className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center hover:bg-amber-500 hover:text-white transition-all flex-shrink-0"
                                                >
                                                    <Bookmark size={18} />
                                                </button>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300 truncate">{bm.label}</p>
                                                    <button onClick={() => seekToTime(bm.timestamp)} className="text-[10px] font-black text-amber-500 uppercase tracking-widest hover:underline">
                                                        Jump to {formatTime(bm.timestamp)}
                                                    </button>
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4 opacity-50">
                                                <Bookmark size={48} />
                                                <p className="text-sm font-bold italic text-center">No bookmarks yet. Click "Bookmark" while watching!</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Hidden Certificate for Export */}
            <div style={{ position: 'absolute', left: '-9999px', top: '0' }}>
                <Certificate
                    ref={certificateRef}
                    studentName={userData?.fullName}
                    courseName={state?.title}
                    date={new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                />
            </div>
        </HomeLayout>
    );
}

export default Displaylectures;
