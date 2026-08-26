import "jspdf-autotable";

import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import authService from "../../../core/services/auth.service";
import discussionService from "../../../core/services/discussion.service";
import interactionService from "../../../core/services/interaction.service";
import HomeLayout from "../../../shared/layouts/HomeLayout";
import { submitAssignment,submitQuiz, updateCourseProgress } from "../../auth/redux/AuthSlice";
import LectureHeader from "../components/lecture/LectureHeader";
import LectureTabsNav from "../components/lecture/LectureTabsNav";
import LectureVideoPlayer from "../components/lecture/LectureVideoPlayer";
import BookmarksTab from "../components/lecture/tabs/BookmarksTab";
import NotesTab from "../components/lecture/tabs/NotesTab";
import PlaylistTab from "../components/lecture/tabs/PlaylistTab";
import QaTab from "../components/lecture/tabs/QaTab";
import TasksTab from "../components/lecture/tabs/TasksTab";
import { deleteCourseLecture, getCourseLectures } from "../redux/LectureSlice";

function Displaylectures() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { state } = useLocation();
    const certificateRef = useRef(null);

    const { lectures, isLoading } = useSelector((state) => state.lecture);
    const { role, data: userData } = useSelector((state) => state.auth);

    const [currentVideo, setCurrentVideo] = useState(0);
    const [activeTab, setActiveTab] = useState("playlist");
    const videoRef = useRef(null);
    const lastSavedTime = useRef(0);
    const [noteInput, setNoteInput] = useState("");
    const [playbackRate, setPlaybackRate] = useState(1);
    const [showCaptions, setShowCaptions] = useState(false);
    const [bookmarks, setBookmarks] = useState([]);
    const [activeQuiz, setActiveQuiz] = useState(null);
    const [quizAnswers, setQuizAnswers] = useState({});

    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [quizPageAnswers, setQuizPageAnswers] = useState({});
    const [assignmentFile, setAssignmentFile] = useState(null);

    const [notes, setNotes] = useState([]);

    const [discussions, setDiscussions] = useState([]);
    const [questionInput, setQuestionInput] = useState("");
    const [replyInputs, setReplyInputs] = useState({});

    const fetchNotes = async () => {
        try {
            const res = await interactionService.getNotes(state._id);
            setNotes(res.data.notes);
        } catch (error) {
            console.error("Failed to fetch notes");
        }
    };

    const fetchBookmarks = async () => {
        try {
            const res = await interactionService.getBookmarks(state._id);
            setBookmarks(res.data.bookmarks);
        } catch (error) {
            console.error("Failed to fetch bookmarks");
        }
    };

    const fetchDiscussions = async () => {
        if (!state?._id || !lectures[currentVideo]?._id) return;
        try {
            const res = await discussionService.getDiscussions(state._id, lectures[currentVideo]._id);
            setDiscussions(res.data.discussions);
        } catch (error) {
            console.error("Failed to fetch discussions");
        }
    };

    useEffect(() => {
        if (activeTab === "qa") fetchDiscussions();
    }, [activeTab, currentVideo, lectures]);

    const handlePostQuestion = async () => {
        if (!questionInput.trim()) return;
        try {
            await discussionService.addQuestion({
                courseId: state._id,
                lectureId: lectures[currentVideo]._id,
                question: questionInput,
                timestamp: videoRef.current ? Math.floor(videoRef.current.currentTime) : null
            });
            setQuestionInput("");
            fetchDiscussions();
            toast.success("Doubt posted with timestamp!");
        } catch (error) {
            toast.error("Failed to post question");
        }
    };

    const handlePostReply = async (discussionId) => {
        const reply = replyInputs[discussionId];
        if (!reply?.trim()) return;
        try {
            await discussionService.addReply({
                discussionId,
                reply
            });
            setReplyInputs({ ...replyInputs, [discussionId]: "" });
            fetchDiscussions();
            toast.success("Reply added!");
        } catch (error) {
            toast.error("Failed to post reply");
        }
    };

    const handleDownloadCertificate = async () => {
        const loadingToast = toast.loading("Generating your verified certificate...");
        try {
            const element = certificateRef.current;
            if (!element) throw new Error("Certificate template not found.");
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                logging: false,
            });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'px',
                format: [canvas.width, canvas.height]
            });
            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
            pdf.save(`${userData?.fullName?.replace(/\s+/g, '_') || 'Student'}_Certificate.pdf`);
            toast.success("Certificate downloaded! Congratulations!", { id: loadingToast });
        } catch (error) {
            console.error(error);
            toast.error("Failed to generate certificate.", { id: loadingToast });
        }
    };

    const handleExportNotes = () => {
        if (notes.length === 0) {
            toast.error("No notes to export!");
            return;
        }

        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.setTextColor(16, 185, 129);
        doc.text("Study Notes - Learnify", 14, 22);

        doc.setFontSize(12);
        doc.setTextColor(100);
        doc.text(`Course: ${state?.title}`, 14, 32);

        const tableData = notes.map(n => [
            formatTime(n.timestamp),
            n.lectureTitle || "General",
            n.text
        ]);

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

    const courseProgress = userData?.progress?.find(p => p.courseId === state?._id);
    const completedLectures = courseProgress?.completedLectures || [];

    const handleAddBookmark = async () => {
        if (!videoRef.current) return;
        try {
            await interactionService.toggleBookmark({
                courseId: state._id,
                lectureId: lectures[currentVideo]._id,
                timestamp: Math.floor(videoRef.current.currentTime),
                label: 'Bookmark'
            });
            fetchBookmarks();
            toast.success("Moment bookmarked!", { icon: '🔖' });
        } catch (error) {
            toast.error("Failed to save bookmark");
        }
    };

    const handleAddNote = async () => {
        if (!noteInput.trim() || !videoRef.current) return;
        try {
            await interactionService.addNote({
                courseId: state._id,
                lectureId: lectures[currentVideo]._id,
                lectureTitle: lectures[currentVideo].title,
                timestamp: Math.floor(videoRef.current.currentTime),
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
        const currentLecture = lectures[currentVideo];
        if (currentLecture?.inVideoQuizzes) {
            const quiz = currentLecture.inVideoQuizzes.find(q => Math.floor(q.timestamp) === currentTime);
            if (quiz && activeQuiz?.timestamp !== quiz.timestamp) {
                setActiveQuiz(quiz);
                videoRef.current.pause();
                toast("Quiz time! Check the video overlay.", { icon: '❓' });
            }
        }
        if (currentTime % 10 === 0 && currentTime !== lastSavedTime.current) {
            lastSavedTime.current = currentTime;
            await authService.updateVideoProgress({
                courseId: state._id,
                lectureId: lectures[currentVideo]._id,
                timestamp: currentTime
            });
        }
    };

    const handleLoadedMetadata = () => {
        const savedProgress = userData?.recentlyWatched?.find(
            p => p.courseId === state?._id && p.lectureId === lectures[currentVideo]?._id
        );
        if (savedProgress && videoRef.current) {
            videoRef.current.currentTime = savedProgress.timestamp;
            toast.success(`Resumed from ${formatTime(savedProgress.timestamp)}`, { icon: '🕒', duration: 2000 });
        }
        if (videoRef.current) videoRef.current.playbackRate = playbackRate;
    };

    const seekToTime = (seconds) => {
        if (videoRef.current) {
            videoRef.current.currentTime = seconds;
            videoRef.current.play();
            toast.success(`Jumped to ${formatTime(seconds)}`, { icon: '⏩', duration: 1500 });
        }
    };

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

    const handleDeleteNote = async (noteId) => {
        try {
            await interactionService.deleteNote(noteId);
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

    const handleAssignmentSubmitAction = async () => {
        if (!selectedAssignment) return;

        const formData = new FormData();
        formData.append("courseId", state._id);
        formData.append("assignmentId", selectedAssignment._id);
        if (assignmentFile) {
            formData.append("assignmentFile", assignmentFile);
        }

        const res = await dispatch(submitAssignment(formData));
        if (res.payload?.success) {
            setSelectedAssignment(null);
            setAssignmentFile(null);
            toast.success("Assignment submitted!");
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

    return (
        <HomeLayout>
            <div className="min-h-screen pt-12 bg-[#050505] dark:bg-[#020202] text-gray-200 font-inter selection:bg-yellow-500/30 transition-colors duration-500">
                <div className="max-w-[1920px] mx-auto w-full flex flex-col xl:flex-row min-h-[calc(100vh-5rem)] relative">

                    {/* LEFT: Cinematic Video Area & Command Center */}
                    <div className="flex-1 flex flex-col p-4 lg:p-8 space-y-6">

                        <LectureHeader
                            navigate={navigate}
                            state={state}
                            currentVideo={currentVideo}
                            lecturesLength={lectures?.length}
                            overallProgress={overallProgress}
                            handleDownloadCertificate={handleDownloadCertificate}
                        />

                        <LectureVideoPlayer
                            lectures={lectures}
                            currentVideo={currentVideo}
                            videoRef={videoRef}
                            state={state}
                            handleTimeUpdate={handleTimeUpdate}
                            handleLoadedMetadata={handleLoadedMetadata}
                            showCaptions={showCaptions}
                            setShowCaptions={setShowCaptions}
                            activeQuiz={activeQuiz}
                            setActiveQuiz={setActiveQuiz}
                            quizAnswers={quizAnswers}
                            handleQuizAnswer={handleQuizAnswer}
                            handleQuizSubmit={handleQuizSubmit}
                            formatTime={formatTime}
                            playbackRate={playbackRate}
                            handleSpeedChange={handleSpeedChange}
                            handleAddBookmark={handleAddBookmark}
                        />

                        <LectureTabsNav activeTab={activeTab} setActiveTab={setActiveTab} />

                        <div className="flex-1 w-full bg-white/5 border border-white/10 rounded-[2rem] p-6 lg:p-8 backdrop-blur-xl min-h-[400px] flex flex-col">
                            {activeTab === "playlist" && (
                                <PlaylistTab
                                    lectures={lectures}
                                    currentVideo={currentVideo}
                                    setCurrentVideo={setCurrentVideo}
                                />
                            )}

                            {activeTab === "tasks" && (
                                <TasksTab
                                    state={state}
                                    selectedQuiz={selectedQuiz}
                                    setSelectedQuiz={setSelectedQuiz}
                                    selectedAssignment={selectedAssignment}
                                    setSelectedAssignment={setSelectedAssignment}
                                    quizPageAnswers={quizPageAnswers}
                                    setQuizPageAnswers={setQuizPageAnswers}
                                    handleSectionQuizSubmit={handleSectionQuizSubmit}
                                    assignmentFile={assignmentFile}
                                    setAssignmentFile={setAssignmentFile}
                                    handleAssignmentSubmitAction={handleAssignmentSubmitAction}
                                />
                            )}

                            {activeTab === "notes" && (
                                <NotesTab
                                    notes={notes}
                                    noteInput={noteInput}
                                    setNoteInput={setNoteInput}
                                    handleAddNote={handleAddNote}
                                    handleExportNotes={handleExportNotes}
                                    seekToTime={seekToTime}
                                    handleDeleteNote={handleDeleteNote}
                                    formatTime={formatTime}
                                />
                            )}

                            {activeTab === "qa" && (
                                <QaTab
                                    discussions={discussions}
                                    questionInput={questionInput}
                                    setQuestionInput={setQuestionInput}
                                    handlePostQuestion={handlePostQuestion}
                                    replyInputs={replyInputs}
                                    setReplyInputs={setReplyInputs}
                                    handlePostReply={handlePostReply}
                                    seekToTime={seekToTime}
                                    formatTime={formatTime}
                                    userData={userData}
                                    courseId={state?._id}
                                    lectureId={lectures[currentVideo]?._id}
                                />
                            )}

                            {activeTab === "bookmarks" && (
                                <BookmarksTab
                                    bookmarks={bookmarks}
                                    seekToTime={seekToTime}
                                    formatTime={formatTime}
                                />
                            )}
                        </div>
                    </div>

                    {/* RIGHT: Desktop Playlist Sidebar */}
                    <div className="hidden xl:flex w-[280px] flex-col border-l border-white/10 p-6 sticky top-0 h-[calc(100vh-3rem)] overflow-y-auto custom-scrollbar">
                        <div className="mb-6">
                            <h2 className="text-xl font-black font-outfit text-white">Course Curriculum</h2>
                            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mt-1">Select a module</p>
                        </div>
                        <div className="space-y-4">
                            {lectures?.map((lecture, index) => (
                                <div
                                    key={lecture._id}
                                    onClick={() => setCurrentVideo(index)}
                                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${currentVideo === index ? 'bg-yellow-500/10 border-yellow-500/50 shadow-[0_0_20px_rgba(234,179,8,0.1)]' : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20'}`}
                                >
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${currentVideo === index ? 'bg-yellow-500 text-black shadow-lg' : 'bg-black/50 text-gray-500 group-hover:text-white'}`}>
                                        <div className={currentVideo === index ? 'ml-1' : ''}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={currentVideo === index ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1 truncate">{lecture.sectionTitle || `Module ${index + 1}`}</p>
                                        <h3 className={`font-bold text-sm leading-snug line-clamp-2 ${currentVideo === index ? 'text-yellow-500' : 'text-gray-300'}`}>{lecture.title}</h3>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Hidden Certificate element for jsPDF/html2canvas */}
            <div style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}>
                <div ref={certificateRef} className="w-[1056px] h-[816px] bg-white relative">
                    {/* Simplified certificate for generation */}
                    <div className="absolute inset-4 border-8 border-yellow-500 p-8 text-center flex flex-col justify-center">
                        <h1 className="text-6xl font-serif text-gray-900 mb-8">Certificate of Completion</h1>
                        <p className="text-2xl text-gray-600 mb-4">This is to certify that</p>
                        <h2 className="text-5xl font-bold text-yellow-600 mb-8">{userData?.fullName}</h2>
                        <p className="text-2xl text-gray-600 mb-4">has successfully completed</p>
                        <h3 className="text-4xl font-bold text-gray-900 mb-16">{state?.title}</h3>
                        <div className="flex justify-between mt-auto">
                            <div className="border-t-2 border-gray-400 pt-2 w-64">
                                <p className="text-gray-600">Date: {new Date().toLocaleDateString()}</p>
                            </div>
                            <div className="border-t-2 border-gray-400 pt-2 w-64">
                                <p className="text-gray-600">Learnify Instructor</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </HomeLayout>
    );
}

export default Displaylectures;
