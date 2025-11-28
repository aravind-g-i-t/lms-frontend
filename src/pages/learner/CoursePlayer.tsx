import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
    ChevronLeft, ChevronRight, CheckCircle, Circle,
    FileText, Download, Menu, X, List,
    ChevronDown, ChevronUp, PlayCircle, Clock,
    ImageIcon,
    VideoIcon,
    Archive
} from 'lucide-react';
import type { AppDispatch } from '../../redux/store';
import { toast } from 'react-toastify';
import { getFullCourseForLearner, markChapterAsCompleted } from '../../redux/services/learnerServices';
import { formatDuration } from '../../utils/formats';


export interface Resource {
    id: string;
    name: string;
    file: string;
    size: number;
}

export interface Chapter {
    id: string;
    title: string;
    description: string;
    video: string;
    duration: number;
    resources: Resource[];
}

export interface Module {
    id: string;
    title: string;
    description: string;
    duration: number;
    chapters: Chapter[];
}

interface Instructor {
    id: string;
    name: string;
    profilePic: string | null;
}

export interface Category {
    id: string;
    name: string;
}

type CourseLevel = "beginner" | "intermediate" | "advanced";

export interface Course {
    id: string;
    title: string;
    description: string;
    prerequisites: string[];
    category: Category;
    enrollmentCount: number;
    instructor: Instructor;
    modules: Module[];
    level: CourseLevel;
    duration: number;
    tags: string[];
    whatYouWillLearn: string[];
    totalRatings: number;
    thumbnail: string | null;
    previewVideo: string | null;
    price: number;
    rating: number | null;
    publishedAt: Date | null;
    progressPercentage: number;
    completedChapters: string[];
    totalChapters: number;
    currentChapterId: string | null;
}

const CoursePlayerPage = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);
    const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
    const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
    const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set([0]));
    const [showSidebar, setShowSidebar] = useState(true);
    const [showNotes, setShowNotes] = useState(false);
    const [showResources, setShowResources] = useState(false);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                if (!courseId) return;
                setLoading(true);
                const response = await dispatch(getFullCourseForLearner({ courseId })).unwrap();
                const courseData: Course = response.data
                setCourse(courseData);


                // Set initial chapter
                if (courseData.currentChapterId) {
                    let found = false;
                    courseData.modules.forEach((module, mIdx) => {
                        module.chapters.forEach((chapter, cIdx) => {
                            if (chapter.id === courseData.currentChapterId) {
                                setCurrentChapter(chapter);
                                setCurrentModuleIndex(mIdx);
                                setCurrentChapterIndex(cIdx);
                                setExpandedModules(new Set([mIdx]));
                                found = true;
                            }
                        });
                    });
                    if (!found) {
                        setCurrentChapter(courseData.modules[0].chapters[0]);
                    }
                } else {
                    setCurrentChapter(courseData.modules[0].chapters[0]);
                }
            } catch (err) {
                toast.error(err as string);
                navigate('/learner/dashboard');
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [courseId, dispatch, navigate]);

    const toggleModule = (index: number) => {
        const newExpanded = new Set(expandedModules);
        if (newExpanded.has(index)) {
            newExpanded.delete(index);
        } else {
            newExpanded.add(index);
        }
        setExpandedModules(newExpanded);
    };

    const selectChapter = (moduleIdx: number, chapterIdx: number) => {
        if (!course) return;
        const chapter = course.modules[moduleIdx].chapters[chapterIdx];
        setCurrentChapter(chapter);
        setCurrentModuleIndex(moduleIdx);
        setCurrentChapterIndex(chapterIdx);
        setShowSidebar(false); // Auto-hide on mobile
    };

    const goToNextChapter = () => {
        if (!course) return;
        const currentModule = course.modules[currentModuleIndex];

        if (currentChapterIndex < currentModule.chapters.length - 1) {
            selectChapter(currentModuleIndex, currentChapterIndex + 1);
        } else if (currentModuleIndex < course.modules.length - 1) {
            selectChapter(currentModuleIndex + 1, 0);
            setExpandedModules(new Set(expandedModules).add(currentModuleIndex + 1));
        }
    };

    const goToPreviousChapter = () => {
        if (!course) return;

        if (currentChapterIndex > 0) {
            selectChapter(currentModuleIndex, currentChapterIndex - 1);
        } else if (currentModuleIndex > 0) {
            const prevModule = course.modules[currentModuleIndex - 1];
            selectChapter(currentModuleIndex - 1, prevModule.chapters.length - 1);
            setExpandedModules(new Set(expandedModules).add(currentModuleIndex - 1));
        }
    };

    const markAsComplete = async () => {
        if (!currentChapter || !course) return;

        try {
            await dispatch(markChapterAsCompleted({ courseId: course.id, chapterId: currentChapter.id })).unwrap();
            toast.success('Chapter marked as complete!');

            setCourse({
                ...course,
                completedChapters: [...course.completedChapters, currentChapter.id],
                progressPercentage: Math.round(((course.completedChapters.length + 1) / course.totalChapters) * 100)
            });

            goToNextChapter();
        } catch (err) {
            toast.error(err as string);
        }
    };

    const isChapterCompleted = (chapterId: string) => {
        return course?.completedChapters.includes(chapterId) || false;
    };

    const hasNextChapter = () => {
        if (!course) return false;
        const currentModule = course.modules[currentModuleIndex];
        return currentChapterIndex < currentModule.chapters.length - 1 || currentModuleIndex < course.modules.length - 1;
    };

    const hasPreviousChapter = () => {
        return currentChapterIndex > 0 || currentModuleIndex > 0;
    };

    // const getResourceIcon = (type: ResourceType) => {
    //     switch (type) {
    //         case 'pdf': return <FileText className="w-4 h-4 text-red-500" />;
    //         case 'docs': return <FileText className="w-4 h-4 text-blue-500" />;
    //         case 'zip': return <Download className="w-4 h-4 text-yellow-500" />;
    //         default: return <FileText className="w-4 h-4 text-gray-500" />;
    //     }
    // };

    // const formatFileSize = (bytes: number) => {
    //     return `${Math.round(bytes / 1024)} KB`;
    // };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <div className="text-white text-lg">Loading course...</div>
            </div>
        );
    }

    if (!course || !currentChapter) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <div className="text-white">Course not found</div>
            </div>
        );
    }

    return (
        <>
            {/* <LearnerNav /> */}
            <div className="min-h-screen bg-gray-900 flex flex-col">
                {/* Top Navigation Bar */}
                <header className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between sticky top-0 z-20">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/learner/dashboard')}
                            className="text-gray-300 hover:text-white transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setShowSidebar(!showSidebar)}
                            className="lg:hidden text-gray-300 hover:text-white transition-colors"
                        >
                            {showSidebar ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                        <div className="hidden sm:block">
                            <h1 className="text-white font-semibold text-sm line-clamp-1">{course.title}</h1>
                            <p className="text-gray-400 text-xs">by {course.instructor.name}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Progress */}
                        <div className="hidden md:flex items-center gap-2">
                            <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-teal-500 transition-all"
                                    style={{ width: `${course.progressPercentage}%` }}
                                />
                            </div>
                            <span className="text-gray-300 text-sm">{course.progressPercentage}%</span>
                        </div>

                        {/* <button className="text-gray-300 hover:text-white text-sm flex items-center gap-1">
                            <Award className="w-4 h-4" />
                            <span className="hidden sm:inline">Certificate</span>
                        </button> */}
                    </div>
                </header>

                <div className="flex-1 flex overflow-hidden">

                    {/* Main Content Area */}
                    <main className="flex-1 flex flex-col overflow-hidden">
                        {/* Video Player */}
                        <div className="bg-black w-full flex justify-center items-center">
                            <video
                                key={currentChapter.id}
                                controls
                                autoPlay
                                className="max-h-[80vh] w-auto max-w-full object-contain"
                                src={currentChapter.video}
                            >
                                Your browser does not support video playback.
                            </video>
                        </div>


                        {/* Chapter Navigation */}
                        <div className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between">
                            <button
                                onClick={goToPreviousChapter}
                                disabled={!hasPreviousChapter()}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Previous
                            </button>

                            {!isChapterCompleted(currentChapter.id) && (
                                <button
                                    onClick={markAsComplete}
                                    className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium"
                                >
                                    <CheckCircle className="w-4 h-4" />
                                    Mark as Complete
                                </button>
                            )}

                            <button
                                onClick={goToNextChapter}
                                disabled={!hasNextChapter()}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                            >
                                Next
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Chapter Info & Tabs */}
                        <div className="flex-1 overflow-y-auto bg-gray-850">
                            <div className="max-w-4xl mx-auto p-6">
                                {/* Chapter Title & Description */}
                                <div className="mb-6">
                                    <h2 className="text-2xl font-bold text-white mb-2">{currentChapter.title}</h2>
                                    <p className="text-gray-400">{currentChapter.description}</p>
                                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            {formatDuration(currentChapter.duration)}
                                        </span>
                                        <span>
                                            Module {currentModuleIndex + 1}, Chapter {currentChapterIndex + 1}
                                        </span>
                                    </div>
                                </div>

                                {/* Tabs */}
                                <div className="border-b border-gray-700 mb-6">
                                    <div className="flex gap-6">
                                        <button
                                            onClick={() => { setShowResources(false); setShowNotes(false); }}
                                            className={`pb-3 px-1 border-b-2 transition-colors ${!showResources && !showNotes
                                                ? 'border-teal-500 text-teal-400'
                                                : 'border-transparent text-gray-400 hover:text-gray-300'
                                                }`}
                                        >
                                            Overview
                                        </button>
                                        <button
                                            onClick={() => { setShowResources(true); setShowNotes(false); }}
                                            className={`pb-3 px-1 border-b-2 transition-colors flex items-center gap-2 ${showResources
                                                ? 'border-teal-500 text-teal-400'
                                                : 'border-transparent text-gray-400 hover:text-gray-300'
                                                }`}
                                        >
                                            <FileText className="w-4 h-4" />
                                            Resources ({currentChapter.resources.length})
                                        </button>
                                        {/* <button
                                            onClick={() => { setShowNotes(true); setShowResources(false); }}
                                            className={`pb-3 px-1 border-b-2 transition-colors ${showNotes
                                                ? 'border-teal-500 text-teal-400'
                                                : 'border-transparent text-gray-400 hover:text-gray-300'
                                                }`}
                                        >
                                            Notes
                                        </button> */}
                                    </div>
                                </div>

                                {/* Tab Content */}
                                {!showResources && !showNotes && (
                                    <div className="text-gray-300 space-y-4">
                                        <p>In this chapter, you'll learn about {currentChapter.title.toLowerCase()}.</p>
                                        <p>{currentChapter.description}</p>
                                    </div>
                                )}

                                {showResources && (
                                    <div className="space-y-3">

                                        {currentChapter.resources.length === 0 ? (
                                            <div className="text-center py-12 text-gray-500">
                                                <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                                <p>No resources available for this chapter</p>
                                            </div>
                                        ) : (
                                            currentChapter.resources.map((resource) => {
                                                // Extract extension
                                                const ext = resource.name.split(".").pop()?.toLowerCase() || "";

                                                // Select icon for file
                                                const Icon = (() => {
                                                    if (["png", "jpg", "jpeg", "gif", "webp"].includes(ext)) return ImageIcon;
                                                    if (["mp4", "mov", "webm", "mkv"].includes(ext)) return VideoIcon;
                                                    if (["zip", "rar", "7z"].includes(ext)) return Archive;
                                                    if (["pdf"].includes(ext)) return FileText;
                                                    return FileText; // default icon
                                                })();

                                                return (
                                                    <div
                                                        key={resource.id}
                                                        className="bg-gray-800 rounded-lg p-4 flex items-center justify-between hover:bg-gray-750 transition-colors"
                                                    >
                                                        {/* Left side block */}
                                                        <div className="flex items-center gap-3">
                                                            <Icon className="w-5 h-5 text-gray-300" />

                                                            <div>
                                                                {/* Title (file name) */}
                                                                <h4 className="text-white font-medium text-sm truncate max-w-[200px]">
                                                                    {resource.name}
                                                                </h4>

                                                                {/* File size + extension */}
                                                                <p className="text-gray-500 text-xs">
                                                                    {(resource.size / 1024 / 1024).toFixed(2)} MB • {ext.toUpperCase()}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {/* Download button */}
                                                        <a
                                                            href={resource.file}
                                                            download
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm"
                                                        >
                                                            <Download className="w-4 h-4" />
                                                            Download
                                                        </a>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>
                                )}


                                {/* {showNotes && (
                                    <div className="bg-gray-800 rounded-lg p-6">
                                        <p className="text-gray-400 mb-4">Take notes while learning...</p>
                                        <textarea
                                            placeholder="Start typing your notes here..."
                                            className="w-full h-64 bg-gray-900 border border-gray-700 rounded-lg p-4 text-white placeholder-gray-500 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                        />
                                        <button className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm">
                                            Save Notes
                                        </button>
                                    </div>
                                )} */}
                            </div>
                        </div>
                    </main>
                    {/* Sidebar - Course Content */}
                    <aside className={`
          ${showSidebar ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-10
          w-80 bg-gray-800 border-r border-gray-700 overflow-y-auto transition-transform
          flex flex-col
        `}>
                        <div className="p-4 border-b border-gray-700">
                            <h2 className="text-white font-semibold flex items-center gap-2">
                                <List className="w-5 h-5" />
                                Course Content
                            </h2>
                            <p className="text-gray-400 text-xs mt-1">
                                {course.completedChapters.length} of {course.totalChapters} complete
                            </p>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            {course.modules.map((module, moduleIdx) => (
                                <div key={module.id} className="border-b border-gray-700">
                                    <button
                                        onClick={() => toggleModule(moduleIdx)}
                                        className="w-full p-4 flex items-center justify-between hover:bg-gray-750 transition-colors text-left"
                                    >
                                        <div className="flex-1">
                                            <h3 className="text-white font-medium text-sm">
                                                Module {moduleIdx + 1}: {module.title}
                                            </h3>
                                            <p className="text-gray-400 text-xs mt-1">
                                                {module.chapters.length} chapters • {formatDuration(module.duration)}
                                            </p>
                                        </div>
                                        {expandedModules.has(moduleIdx) ? (
                                            <ChevronUp className="w-4 h-4 text-gray-400" />
                                        ) : (
                                            <ChevronDown className="w-4 h-4 text-gray-400" />
                                        )}
                                    </button>

                                    {expandedModules.has(moduleIdx) && (
                                        <div className="bg-gray-850">
                                            {module.chapters.map((chapter, chapterIdx) => {
                                                const isActive = moduleIdx === currentModuleIndex && chapterIdx === currentChapterIndex;
                                                const isCompleted = isChapterCompleted(chapter.id);

                                                return (
                                                    <button
                                                        key={chapter.id}
                                                        onClick={() => selectChapter(moduleIdx, chapterIdx)}
                                                        className={`
                            w-full p-3 pl-8 flex items-start gap-3 text-left transition-colors
                            ${isActive ? 'bg-teal-900/30 border-l-2 border-teal-500' : 'hover:bg-gray-750'}
                          `}
                                                    >
                                                        <div className="flex-shrink-0 mt-0.5">
                                                            {isCompleted ? (
                                                                <CheckCircle className="w-4 h-4 text-green-500" />
                                                            ) : isActive ? (
                                                                <PlayCircle className="w-4 h-4 text-teal-500" />
                                                            ) : (
                                                                <Circle className="w-4 h-4 text-gray-500" />
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className={`text-sm font-medium ${isActive ? 'text-teal-400' : 'text-gray-300'}`}>
                                                                {chapterIdx + 1}. {chapter.title}
                                                            </h4>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <span className="text-xs text-gray-500">{formatDuration(chapter.duration)}</span>
                                                                {chapter.resources.length > 0 && (
                                                                    <span className="text-xs text-gray-500">• {chapter.resources.length} resources</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </aside>


                </div>

                {/* Mobile Sidebar Overlay */}
                {showSidebar && (
                    <div
                        onClick={() => setShowSidebar(false)}
                        className="lg:hidden fixed inset-0 bg-black/50 z-0"
                    />
                )}
            </div>
        </>
    );
};

export default CoursePlayerPage;