
import "jspdf-autotable";

import { jsPDF } from "jspdf";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import authService from "../../../core/services/auth.service";
import discussionService from "../../../core/services/discussion.service";
import interactionService from "../../../core/services/interaction.service";
import HomeLayout from "../../../shared/layouts/HomeLayout";

import {
    getUserData,
    submitAssignment,
    submitQuiz,
    updateCourseProgress,
} from "../../auth/redux/AuthSlice";

import LectureHeader from "../components/lecture/LectureHeader";
import LectureTabsNav from "../components/lecture/LectureTabsNav";
import LectureVideoPlayer from "../components/lecture/LectureVideoPlayer";

import BookmarksTab from "../components/lecture/tabs/BookmarksTab";
import NotesTab from "../components/lecture/tabs/NotesTab";
import PlaylistTab from "../components/lecture/tabs/PlaylistTab";
import QaTab from "../components/lecture/tabs/QaTab";
import TasksTab from "../components/lecture/tabs/TasksTab";

import {
    deleteCourseLecture,
    getCourseLectures,
} from "../redux/LectureSlice";

function Displaylectures() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { state } = useLocation();

    const certificateRef = useRef(null);

    /* ================================================================
       REDUX STATE
    ================================================================= */

    const {
        lectures = [],
        isLoading,
    } = useSelector((state) => state.lecture || {});

    const {
        role,
        data: userData = {},
    } = useSelector((state) => state.auth || {});

    /* ================================================================
       VIDEO STATE
    ================================================================= */

    const [currentVideo, setCurrentVideo] = useState(0);
    const [activeTab, setActiveTab] = useState("playlist");

    const videoRef = useRef(null);
    const lastSavedTime = useRef(0);

    const [playbackRate, setPlaybackRate] = useState(1);
    const [showCaptions, setShowCaptions] = useState(false);

    /* ================================================================
       NOTES
    ================================================================= */

    const [noteInput, setNoteInput] = useState("");
    const [notes, setNotes] = useState([]);

    /* ================================================================
       BOOKMARKS
    ================================================================= */

    const [bookmarks, setBookmarks] = useState([]);

    /* ================================================================
       IN-VIDEO QUIZ
    ================================================================= */

    const [activeQuiz, setActiveQuiz] = useState(null);
    const [quizAnswers, setQuizAnswers] = useState({});

    /* ================================================================
       SECTION QUIZ / ASSIGNMENT
    ================================================================= */

    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [quizPageAnswers, setQuizPageAnswers] = useState({});
    const [assignmentFile, setAssignmentFile] = useState(null);

    /* ================================================================
       DISCUSSIONS
    ================================================================= */

    const [discussions, setDiscussions] = useState([]);
    const [questionInput, setQuestionInput] = useState("");
    const [replyInputs, setReplyInputs] = useState({});

    /* ================================================================
       FETCH NOTES
    ================================================================= */

    const fetchNotes = async () => {
        if (!state?._id) return;

        try {
            const res = await interactionService.getNotes(
                state._id
            );

            const fetchedNotes = res?.data?.notes;

            setNotes(
                Array.isArray(fetchedNotes)
                    ? fetchedNotes
                    : []
            );
        } catch (error) {
            console.error(
                "Failed to fetch notes:",
                error
            );

            setNotes([]);
        }
    };

    /* ================================================================
       FETCH BOOKMARKS
    ================================================================= */

    const fetchBookmarks = async () => {
        if (!state?._id) return;

        try {
            const res =
                await interactionService.getBookmarks(
                    state._id
                );

            const fetchedBookmarks =
                res?.data?.bookmarks;

            setBookmarks(
                Array.isArray(fetchedBookmarks)
                    ? fetchedBookmarks
                    : []
            );
        } catch (error) {
            console.error(
                "Failed to fetch bookmarks:",
                error
            );

            setBookmarks([]);
        }
    };

    /* ================================================================
       FETCH DISCUSSIONS
    ================================================================= */

    const fetchDiscussions = async () => {
        const courseId = state?._id;
        const lectureId =
            lectures?.[currentVideo]?._id;

        if (!courseId || !lectureId) {
            return;
        }

        try {
            const res =
                await discussionService.getDiscussions(
                    courseId,
                    lectureId
                );

            const fetchedDiscussions =
                res?.data?.discussions;

            setDiscussions(
                Array.isArray(fetchedDiscussions)
                    ? fetchedDiscussions
                    : []
            );
        } catch (error) {
            console.error(
                "Failed to fetch discussions:",
                error
            );

            setDiscussions([]);
        }
    };

    /* ================================================================
       DISCUSSION EFFECT
    ================================================================= */

    useEffect(() => {
        if (activeTab === "qa") {
            fetchDiscussions();
        }
    }, [
        activeTab,
        currentVideo,
        lectures,
        state?._id,
    ]);

    /* ================================================================
       POST QUESTION
    ================================================================= */

    const handlePostQuestion = async () => {
        if (!questionInput.trim()) return;

        const courseId = state?._id;
        const lectureId =
            lectures?.[currentVideo]?._id;

        if (!courseId || !lectureId) {
            toast.error("Lecture not available");
            return;
        }

        try {
            await discussionService.addQuestion({
                courseId,
                lectureId,
                question: questionInput,
                timestamp: videoRef.current
                    ? Math.floor(
                        videoRef.current.currentTime
                    )
                    : null,
            });

            setQuestionInput("");

            await fetchDiscussions();

            toast.success(
                "Doubt posted with timestamp!"
            );
        } catch (error) {
            console.error(
                "Failed to post question:",
                error
            );

            toast.error(
                "Failed to post question"
            );
        }
    };

    /* ================================================================
       POST REPLY
    ================================================================= */

    const handlePostReply = async (discussionId) => {
        const reply = replyInputs?.[discussionId];

        if (!reply?.trim()) return;

        try {
            await discussionService.addReply({
                discussionId,
                reply,
            });

            setReplyInputs((prev) => ({
                ...prev,
                [discussionId]: "",
            }));

            await fetchDiscussions();

            toast.success("Reply added!");
        } catch (error) {
            console.error(
                "Failed to post reply:",
                error
            );

            toast.error("Failed to post reply");
        }
    };

    /* ================================================================
       CERTIFICATE DOWNLOAD
    ================================================================= */

    const handleDownloadCertificate = async () => {
        const loadingToast = toast.loading(
            "Fetching your certificate..."
        );

        try {
            const res =
                await authService.getCertificate(
                    state?._id
                );

            const {
                url,
                filename,
            } =
                res?.data?.data ||
                res?.data ||
                {};

            if (!url) {
                throw new Error(
                    "Certificate URL not returned by server"
                );
            }

            const anchor =
                document.createElement("a");

            anchor.href = url;

            anchor.download =
                filename ||
                `${userData?.fullName?.replace(
                    /\s+/g,
                    "_"
                ) || "Student"
                }_Certificate.pdf`;

            document.body.appendChild(anchor);

            anchor.click();

            document.body.removeChild(anchor);

            toast.success(
                "Certificate downloaded! Congratulations! 🎓",
                {
                    id: loadingToast,
                }
            );
        } catch (error) {
            const status =
                error?.response?.status;

            if (status === 404) {
                toast.error(
                    "Certificate not yet generated. Complete the course first.",
                    {
                        id: loadingToast,
                    }
                );
            } else {
                toast.error(
                    "Failed to download certificate. Please try again.",
                    {
                        id: loadingToast,
                    }
                );
            }
        }
    };

    /* ================================================================
       EXPORT NOTES TO PDF
    ================================================================= */

    const handleExportNotes = () => {
        const safeNotes = Array.isArray(notes)
            ? notes
            : [];

        if (safeNotes.length === 0) {
            toast.error("No notes to export!");
            return;
        }

        const doc = new jsPDF();

        doc.setFontSize(20);
        doc.setTextColor(16, 185, 129);

        doc.text(
            "Study Notes - Learnify",
            14,
            22
        );

        doc.setFontSize(12);
        doc.setTextColor(100);

        doc.text(
            `Course: ${state?.title || "Course"}`,
            14,
            32
        );

        const tableData = safeNotes.map((note) => [
            formatTime(note?.timestamp || 0),
            note?.lectureTitle || "General",
            note?.text || "",
        ]);

        doc.autoTable({
            startY: 45,
            head: [
                [
                    "Time",
                    "Module",
                    "Note Content",
                ],
            ],
            body: tableData,
            headStyles: {
                fillColor: [16, 185, 129],
            },
        });

        doc.save(
            `${state?.title || "Course"}_Notes.pdf`
        );

        toast.success(
            "Notes exported as PDF!"
        );
    };

    /* ================================================================
       FORMAT TIME
    ================================================================= */

    const formatTime = (seconds) => {
        const safeSeconds = Number(seconds) || 0;

        const mins = Math.floor(
            safeSeconds / 60
        );

        const secs = Math.floor(
            safeSeconds % 60
        );

        return `${mins}:${secs
            .toString()
            .padStart(2, "0")}`;
    };

    /* ================================================================
       COURSE PROGRESS
    ================================================================= */

    const courseProgress =
        userData?.progress?.find(
            (p) =>
                p.courseId === state?._id
        );

    const completedLectures =
        courseProgress?.completedLectures || [];

    /* ================================================================
       CURRENT LECTURE PROGRESS
    ================================================================= */

    const currentLectureProgress =
        courseProgress?.lectures?.find(
            (lectureProgress) =>
                lectureProgress.lectureId ===
                lectures?.[currentVideo]?._id
        );

    const isCurrentLectureCompleted =
        currentLectureProgress?.completed ||
        (currentLectureProgress?.watchedPercent ||
            0) >= 90;

    /* ================================================================
       ADD BOOKMARK
    ================================================================= */

    const handleAddBookmark = async () => {
        if (!videoRef.current) return;

        const courseId = state?._id;
        const lectureId =
            lectures?.[currentVideo]?._id;

        if (!courseId || !lectureId) {
            toast.error(
                "Lecture not available"
            );
            return;
        }

        try {
            await interactionService.toggleBookmark({
                courseId,
                lectureId,
                timestamp: Math.floor(
                    videoRef.current.currentTime
                ),
                label: "Bookmark",
            });

            await fetchBookmarks();

            toast.success(
                "Moment bookmarked!",
                {
                    icon: "🔖",
                }
            );
        } catch (error) {
            console.error(
                "Failed to save bookmark:",
                error
            );

            toast.error(
                "Failed to save bookmark"
            );
        }
    };

    /* ================================================================
       ADD NOTE
    ================================================================= */

    const handleAddNote = async () => {
        if (
            !noteInput.trim() ||
            !videoRef.current
        ) {
            return;
        }

        const courseId = state?._id;
        const lecture =
            lectures?.[currentVideo];

        if (!courseId || !lecture?._id) {
            toast.error(
                "Lecture not available"
            );
            return;
        }

        try {
            await interactionService.addNote({
                courseId,
                lectureId: lecture._id,
                lectureTitle:
                    lecture.title ||
                    "Untitled Lecture",
                timestamp: Math.floor(
                    videoRef.current.currentTime
                ),
                text: noteInput.trim(),
            });

            setNoteInput("");

            await fetchNotes();

            toast.success(
                "Note saved with timestamp!"
            );
        } catch (error) {
            console.error(
                "Failed to save note:",
                error
            );

            toast.error(
                "Failed to save note"
            );
        }
    };

    /* ================================================================
       SPEED
    ================================================================= */

    const handleSpeedChange = (rate) => {
        setPlaybackRate(rate);

        if (videoRef.current) {
            videoRef.current.playbackRate =
                rate;
        }

        toast.success(
            `Speed: ${rate}x`,
            {
                duration: 1000,
            }
        );
    };

    /* ================================================================
       VIDEO TIME UPDATE
    ================================================================= */

    const handleTimeUpdate = async () => {
        if (!videoRef.current) return;

        const currentLecture =
            lectures?.[currentVideo];

        if (!currentLecture?._id) {
            return;
        }

        const currentTime = Math.floor(
            videoRef.current.currentTime
        );

        const duration =
            videoRef.current.duration || 0;

        /* ------------------------------------------------------------
           In-video quiz
        ------------------------------------------------------------- */

        if (
            Array.isArray(
                currentLecture.inVideoQuizzes
            )
        ) {
            const quiz =
                currentLecture.inVideoQuizzes.find(
                    (q) =>
                        Math.floor(q.timestamp) ===
                        currentTime
                );

            if (
                quiz &&
                activeQuiz?.timestamp !==
                quiz.timestamp
            ) {
                setActiveQuiz(quiz);

                videoRef.current.pause();

                toast(
                    "Quiz time! Check the video overlay.",
                    {
                        icon: "❓",
                    }
                );
            }
        }

        /* ------------------------------------------------------------
           Save progress every 10 seconds
        ------------------------------------------------------------- */

        if (
            currentTime % 10 === 0 &&
            currentTime !==
            lastSavedTime.current
        ) {
            lastSavedTime.current =
                currentTime;

            const watchedPercent =
                duration > 0
                    ? Math.min(
                        100,
                        Math.round(
                            (currentTime /
                                duration) *
                            100
                        )
                    )
                    : 0;

            try {
                await authService.updateVideoProgress(
                    {
                        courseId:
                            state?._id,
                        lectureId:
                            currentLecture._id,
                        timestamp:
                            currentTime,
                        lastPositionSeconds:
                            currentTime,
                        watchedPercent,
                    }
                );
            } catch (error) {
                console.error(
                    "Failed to update video progress:",
                    error
                );
            }
        }
    };

    /* ================================================================
       VIDEO METADATA
    ================================================================= */

    const handleLoadedMetadata = () => {
        const currentLectureId =
            lectures?.[currentVideo]?._id;

        if (!currentLectureId) return;

        const savedProgress =
            userData?.recentlyWatched?.find(
                (progress) =>
                    progress.courseId ===
                    state?._id &&
                    progress.lectureId ===
                    currentLectureId
            );

        if (
            savedProgress &&
            videoRef.current
        ) {
            videoRef.current.currentTime =
                savedProgress.timestamp || 0;

            toast.success(
                `Resumed from ${formatTime(
                    savedProgress.timestamp
                )}`,
                {
                    icon: "🕒",
                    duration: 2000,
                }
            );
        }

        if (videoRef.current) {
            videoRef.current.playbackRate =
                playbackRate;
        }
    };

    /* ================================================================
       SEEK
    ================================================================= */

    const seekToTime = (seconds) => {
        if (!videoRef.current) return;

        videoRef.current.currentTime =
            Number(seconds) || 0;

        videoRef.current.play();

        toast.success(
            `Jumped to ${formatTime(seconds)}`,
            {
                icon: "⏩",
                duration: 1500,
            }
        );
    };

    /* ================================================================
       IN-VIDEO QUIZ ANSWER
    ================================================================= */

    const handleQuizAnswer = (
        quizTimestamp,
        selectedIndex
    ) => {
        setQuizAnswers((prev) => ({
            ...prev,
            [quizTimestamp]: selectedIndex,
        }));
    };

    /* ================================================================
       IN-VIDEO QUIZ SUBMIT
    ================================================================= */

    const handleQuizSubmit = () => {
        if (!activeQuiz) return;

        const selected =
            quizAnswers?.[
            activeQuiz.timestamp
            ];

        if (selected === undefined) {
            toast.error(
                "Please select an answer!"
            );
            return;
        }

        if (
            selected === activeQuiz.answer
        ) {
            toast.success(
                "Correct! Great job! 🎉",
                {
                    duration: 3000,
                }
            );
        } else {
            toast.error(
                "Not quite right. Keep learning!",
                {
                    duration: 3000,
                }
            );
        }

        setActiveQuiz(null);

        if (videoRef.current) {
            videoRef.current.play();
        }
    };

    /* ================================================================
       DELETE NOTE
    ================================================================= */

    const handleDeleteNote = async (
        noteId
    ) => {
        if (!noteId) return;

        try {
            await interactionService.deleteNote(
                noteId
            );

            await fetchNotes();

            toast.success(
                "Note deleted"
            );
        } catch (error) {
            console.error(
                "Failed to delete note:",
                error
            );

            toast.error(
                "Failed to delete note"
            );
        }
    };

    /* ================================================================
       DELETE BOOKMARK
    ================================================================= */

    const handleDeleteBookmark = async (
        bookmarkId
    ) => {
        if (!bookmarkId) return;

        try {
            await interactionService.deleteBookmark(
                bookmarkId
            );

            setBookmarks((prev) =>
                Array.isArray(prev)
                    ? prev.filter(
                        (bookmark) =>
                            bookmark?._id !==
                            bookmarkId
                    )
                    : []
            );

            toast.success(
                "Bookmark removed"
            );
        } catch (error) {
            console.error(
                "Failed to remove bookmark:",
                error
            );

            toast.error(
                "Failed to remove bookmark"
            );
        }
    };

    /* ================================================================
       SECTION QUIZ
    ================================================================= */

    const handleSectionQuizSubmit =
        async () => {
            if (!selectedQuiz) return;

            let score = 0;

            const questions =
                Array.isArray(
                    selectedQuiz.questions
                )
                    ? selectedQuiz.questions
                    : [];

            questions.forEach(
                (question, index) => {
                    if (
                        quizPageAnswers?.[
                        index
                        ] === question.answer
                    ) {
                        score++;
                    }
                }
            );

            const res = await dispatch(
                submitQuiz({
                    courseId:
                        state?._id,
                    quizId:
                        selectedQuiz._id,
                    score,
                    totalQuestions:
                        questions.length,
                    topic:
                        selectedQuiz.title,
                })
            );

            if (res.payload?.success) {
                setSelectedQuiz(null);
                setQuizPageAnswers({});
            }
        };

    /* ================================================================
       ASSIGNMENT
    ================================================================= */

    const handleAssignmentSubmitAction =
        async () => {
            if (!selectedAssignment) {
                return;
            }

            const formData =
                new FormData();

            formData.append(
                "courseId",
                state?._id || ""
            );

            formData.append(
                "assignmentId",
                selectedAssignment._id
            );

            if (assignmentFile) {
                formData.append(
                    "assignmentFile",
                    assignmentFile
                );
            }

            const res = await dispatch(
                submitAssignment(formData)
            );

            if (res.payload?.success) {
                setSelectedAssignment(
                    null
                );

                setAssignmentFile(null);

                toast.success(
                    "Assignment submitted!"
                );
            }
        };

    /* ================================================================
       OVERALL PROGRESS
    ================================================================= */

    const overallProgress =
        lectures.length > 0
            ? Math.round(
                (completedLectures.length /
                    lectures.length) *
                100
            )
            : 0;

    /* ================================================================
       INITIAL DATA
    ================================================================= */

    useEffect(() => {
        if (!state?._id) {
            navigate("/courses");
            return;
        }

        dispatch(getUserData());

        dispatch(
            getCourseLectures(state._id)
        );

        fetchNotes();
        fetchBookmarks();
    }, [
        dispatch,
        navigate,
        state?._id,
    ]);

    /* ================================================================
       RENDER
    ================================================================= */

    return (
        <HomeLayout>
            <div className="min-h-screen pt-12 bg-[#050505] dark:bg-[#020202] text-gray-200 font-inter selection:bg-yellow-500/30 transition-colors duration-500">

                <div className="max-w-[1920px] mx-auto w-full flex flex-col xl:flex-row min-h-[calc(100vh-5rem)] relative">

                    {/* =================================================
                        LEFT: VIDEO + CONTENT
                    ================================================== */}

                    <div className="flex-1 flex flex-col p-4 lg:p-8 space-y-6">

                        <LectureHeader
                            navigate={navigate}
                            state={state}
                            currentVideo={
                                currentVideo
                            }
                            lecturesLength={
                                lectures.length
                            }
                            overallProgress={
                                overallProgress
                            }
                            handleDownloadCertificate={
                                handleDownloadCertificate
                            }
                        />

                        <LectureVideoPlayer
                            lectures={lectures}
                            currentVideo={
                                currentVideo
                            }
                            videoRef={videoRef}
                            state={state}
                            handleTimeUpdate={
                                handleTimeUpdate
                            }
                            handleLoadedMetadata={
                                handleLoadedMetadata
                            }
                            showCaptions={
                                showCaptions
                            }
                            setShowCaptions={
                                setShowCaptions
                            }
                            activeQuiz={
                                activeQuiz
                            }
                            setActiveQuiz={
                                setActiveQuiz
                            }
                            quizAnswers={
                                quizAnswers
                            }
                            handleQuizAnswer={
                                handleQuizAnswer
                            }
                            handleQuizSubmit={
                                handleQuizSubmit
                            }
                            formatTime={
                                formatTime
                            }
                            playbackRate={
                                playbackRate
                            }
                            handleSpeedChange={
                                handleSpeedChange
                            }
                            handleAddBookmark={
                                handleAddBookmark
                            }
                            isCompleted={
                                isCurrentLectureCompleted
                            }
                        />

                        <LectureTabsNav
                            activeTab={
                                activeTab
                            }
                            setActiveTab={
                                setActiveTab
                            }
                        />

                        <div className="flex-1 w-full bg-white/5 border border-white/10 rounded-[2rem] p-6 lg:p-8 backdrop-blur-xl min-h-[400px] flex flex-col">

                            {/* PLAYLIST */}
                            {activeTab ===
                                "playlist" && (
                                    <PlaylistTab
                                        lectures={
                                            lectures
                                        }
                                        currentVideo={
                                            currentVideo
                                        }
                                        setCurrentVideo={
                                            setCurrentVideo
                                        }
                                        courseProgress={
                                            courseProgress
                                        }
                                    />
                                )}

                            {/* TASKS */}
                            {activeTab ===
                                "tasks" && (
                                    <TasksTab
                                        state={state}
                                        selectedQuiz={
                                            selectedQuiz
                                        }
                                        setSelectedQuiz={
                                            setSelectedQuiz
                                        }
                                        selectedAssignment={
                                            selectedAssignment
                                        }
                                        setSelectedAssignment={
                                            setSelectedAssignment
                                        }
                                        quizPageAnswers={
                                            quizPageAnswers
                                        }
                                        setQuizPageAnswers={
                                            setQuizPageAnswers
                                        }
                                        handleSectionQuizSubmit={
                                            handleSectionQuizSubmit
                                        }
                                        assignmentFile={
                                            assignmentFile
                                        }
                                        setAssignmentFile={
                                            setAssignmentFile
                                        }
                                        handleAssignmentSubmitAction={
                                            handleAssignmentSubmitAction
                                        }
                                    />
                                )}

                            {/* NOTES */}
                            {activeTab ===
                                "notes" && (
                                    <NotesTab
                                        notes={notes}
                                        noteInput={
                                            noteInput
                                        }
                                        setNoteInput={
                                            setNoteInput
                                        }
                                        handleAddNote={
                                            handleAddNote
                                        }
                                        handleExportNotes={
                                            handleExportNotes
                                        }
                                        seekToTime={
                                            seekToTime
                                        }
                                        handleDeleteNote={
                                            handleDeleteNote
                                        }
                                        formatTime={
                                            formatTime
                                        }
                                    />
                                )}

                            {/* Q&A */}
                            {activeTab ===
                                "qa" && (
                                    <QaTab
                                        discussions={
                                            discussions
                                        }
                                        questionInput={
                                            questionInput
                                        }
                                        setQuestionInput={
                                            setQuestionInput
                                        }
                                        handlePostQuestion={
                                            handlePostQuestion
                                        }
                                        replyInputs={
                                            replyInputs
                                        }
                                        setReplyInputs={
                                            setReplyInputs
                                        }
                                        handlePostReply={
                                            handlePostReply
                                        }
                                        seekToTime={
                                            seekToTime
                                        }
                                        formatTime={
                                            formatTime
                                        }
                                        userData={
                                            userData
                                        }
                                        courseId={
                                            state?._id
                                        }
                                        lectureId={
                                            lectures?.[
                                                currentVideo
                                            ]?._id
                                        }
                                    />
                                )}

                            {/* BOOKMARKS */}
                            {activeTab ===
                                "bookmarks" && (
                                    <BookmarksTab
                                        bookmarks={
                                            bookmarks
                                        }
                                        seekToTime={
                                            seekToTime
                                        }
                                        formatTime={
                                            formatTime
                                        }
                                        onDeleteBookmark={
                                            handleDeleteBookmark
                                        }
                                    />
                                )}
                        </div>
                    </div>

                    {/* =================================================
                        RIGHT: COURSE CURRICULUM
                    ================================================== */}

                    <div className="hidden xl:flex w-[280px] flex-col border-l border-white/10 p-6 sticky top-0 h-[calc(100vh-3rem)] overflow-y-auto custom-scrollbar">

                        <div className="mb-6">
                            <h2 className="text-xl font-black font-outfit text-white">
                                Course Curriculum
                            </h2>

                            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mt-1">
                                Select a module
                            </p>
                        </div>

                        <div className="space-y-4">

                            {lectures.map(
                                (
                                    lecture,
                                    index
                                ) => {
                                    const lProgress =
                                        userData?.progress
                                            ?.find(
                                                (
                                                    progress
                                                ) =>
                                                    progress.courseId ===
                                                    state?._id
                                            )
                                            ?.lectures?.find(
                                                (
                                                    progress
                                                ) =>
                                                    progress.lectureId ===
                                                    lecture?._id
                                            );

                                    const pct =
                                        lProgress?.watchedPercent ||
                                        0;

                                    const isCompleted =
                                        lProgress?.completed ||
                                        pct >= 90;

                                    return (
                                        <div
                                            key={
                                                lecture?._id ||
                                                index
                                            }
                                            onClick={() =>
                                                setCurrentVideo(
                                                    index
                                                )
                                            }
                                            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${currentVideo ===
                                                index
                                                ? "bg-yellow-500/10 border-yellow-500/50 shadow-[0_0_20px_rgba(234,179,8,0.1)]"
                                                : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20"
                                                }`}
                                        >

                                            <div className="relative flex-shrink-0">

                                                <div
                                                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${currentVideo ===
                                                        index
                                                        ? "bg-yellow-500 text-black shadow-lg"
                                                        : isCompleted
                                                            ? "bg-emerald-500/20 text-emerald-400"
                                                            : "bg-black/50 text-gray-500"
                                                        }`}
                                                >

                                                    {isCompleted &&
                                                        currentVideo !==
                                                        index ? (
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="18"
                                                            height="18"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2.5"
                                                        >
                                                            <polyline points="20 6 9 17 4 12" />
                                                        </svg>
                                                    ) : (
                                                        <div
                                                            className={
                                                                currentVideo ===
                                                                    index
                                                                    ? "ml-1"
                                                                    : ""
                                                            }
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="20"
                                                                height="20"
                                                                viewBox="0 0 24 24"
                                                                fill={
                                                                    currentVideo ===
                                                                        index
                                                                        ? "currentColor"
                                                                        : "none"
                                                                }
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            >
                                                                <polygon points="5 3 19 12 5 21 5 3" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Progress Arc */}
                                                {pct >
                                                    0 &&
                                                    !isCompleted && (
                                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 flex items-center justify-center">

                                                            <svg
                                                                viewBox="0 0 16 16"
                                                                className="w-4 h-4 -rotate-90"
                                                            >
                                                                <circle
                                                                    cx="8"
                                                                    cy="8"
                                                                    r="6"
                                                                    fill="none"
                                                                    stroke="#374151"
                                                                    strokeWidth="2"
                                                                />

                                                                <circle
                                                                    cx="8"
                                                                    cy="8"
                                                                    r="6"
                                                                    fill="none"
                                                                    stroke="#eab308"
                                                                    strokeWidth="2"
                                                                    strokeDasharray={`${(pct / 100) * 37.7} 37.7`}
                                                                    strokeLinecap="round"
                                                                />
                                                            </svg>
                                                        </div>
                                                    )}
                                            </div>

                                            <div className="flex-1 min-w-0">

                                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1 truncate">
                                                    {lecture?.sectionTitle ||
                                                        `Module ${index +
                                                        1
                                                        }`}
                                                </p>

                                                <h3
                                                    className={`font-bold text-sm leading-snug line-clamp-2 ${currentVideo ===
                                                        index
                                                        ? "text-yellow-500"
                                                        : isCompleted
                                                            ? "text-emerald-400"
                                                            : "text-gray-300"
                                                        }`}
                                                >
                                                    {lecture?.title ||
                                                        "Untitled Lecture"}
                                                </h3>

                                                {pct >
                                                    0 &&
                                                    !isCompleted && (
                                                        <div className="mt-1.5 h-0.5 w-full bg-white/10 rounded-full overflow-hidden">

                                                            <div
                                                                className="h-full bg-yellow-500 rounded-full transition-all"
                                                                style={{
                                                                    width: `${pct}%`,
                                                                }}
                                                            />
                                                        </div>
                                                    )}
                                            </div>
                                        </div>
                                    );
                                }
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* =========================================================
                LEGACY HIDDEN CERTIFICATE ELEMENT
            ========================================================== */}

            <div
                style={{
                    position: "absolute",
                    top: "-9999px",
                    left: "-9999px",
                }}
            >
                <div
                    ref={certificateRef}
                    className="w-[1056px] h-[816px] bg-white relative"
                >
                    <div className="absolute inset-4 border-8 border-yellow-500 p-8 text-center flex flex-col justify-center">

                        <h1 className="text-6xl font-serif text-gray-900 mb-8">
                            Certificate of Completion
                        </h1>

                        <p className="text-2xl text-gray-600 mb-4">
                            This is to certify that
                        </p>

                        <h2 className="text-5xl font-bold text-yellow-600 mb-8">
                            {userData?.fullName}
                        </h2>

                        <p className="text-2xl text-gray-600 mb-4">
                            has successfully completed
                        </p>

                        <h3 className="text-4xl font-bold text-gray-900 mb-16">
                            {state?.title}
                        </h3>

                        <div className="flex justify-between mt-auto">

                            <div className="border-t-2 border-gray-400 pt-2 w-64">
                                <p className="text-gray-600">
                                    Date:{" "}
                                    {new Date().toLocaleDateString()}
                                </p>
                            </div>

                            <div className="border-t-2 border-gray-400 pt-2 w-64">
                                <p className="text-gray-600">
                                    Learnify Instructor
                                </p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </HomeLayout>
    );
}

export default Displaylectures;
