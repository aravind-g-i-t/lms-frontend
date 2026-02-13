import { X, Calendar, Clock, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { createLiveSession, getCourseOptions } from "../../services/instructorServices";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../redux/store";
import { toast } from "react-toastify";

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

interface Course {
    id: string;
    title: string;
}

const ScheduleSessionModal = ({ isOpen, onClose }: Props) => {
    const dispatch = useDispatch<AppDispatch>();

    const [courseOptions, setCourseOptions] = useState<Course[]>([]);
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [courseId, setCourseId] = useState("");
    const [durationInMinutes, setDurationInMinutes] = useState(60);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isOpen) return;

        const fetchCourses = async () => {
            const res = await dispatch(getCourseOptions()).unwrap();
            setCourseOptions(res.data.courses);
        };

        fetchCourses();
    }, [isOpen, dispatch]);

    const handleScheduleSession = async () => {
        if (!courseId || !time || !date) {
            toast.error("Please fill in all required fields");
            return;
        }
        setLoading(true);
        try {
            const scheduledAt = new Date(`${date}T${time}:00`);
            await dispatch(
                createLiveSession({
                    courseId,
                    scheduledAt,
                    durationInMinutes,
                    description,
                })
            );

            setCourseId("");
            setDescription("");
            setDate("");
            setTime("");
            setDurationInMinutes(60);
            onClose();
        } catch (error) {
            toast.error(error as string);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-8 m-4 animate-in zoom-in-95 duration-300 relative overflow-hidden">
                {/* Decorative gradient background */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-teal-100/40 to-blue-100/40 rounded-full blur-3xl -z-10 -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-purple-100/40 to-pink-100/40 rounded-full blur-3xl -z-10 -ml-32 -mb-32" />

                {/* Header */}
                <div className="flex items-start justify-between mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-lg shadow-teal-500/30">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                Schedule Live Session
                            </h2>
                        </div>
                        <p className="text-sm text-gray-500 ml-12">
                            Create an engaging live session for your students
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-xl p-2 hover:bg-gray-100 transition-colors duration-200"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Form */}
                <div className="space-y-6">
                    {/* Course Selection */}
                    <div className="group">
                        <label className="text-sm font-semibold text-gray-700 mb-2 block">
                            Select Course <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <select
                                value={courseId}
                                onChange={(e) => setCourseId(e.target.value)}
                                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 appearance-none cursor-pointer transition-all duration-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none bg-white hover:border-gray-300"
                            >
                                <option value="">Choose a course...</option>
                                {courseOptions.map((course) => (
                                    <option key={course.id} value={course.id}>
                                        {course.title}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="group">
                        <label className="text-sm font-semibold text-gray-700 mb-2 block">
                            Session Description
                        </label>
                        <textarea
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="What topics will you cover? Any prerequisites?"
                            className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 resize-none transition-all duration-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none placeholder:text-gray-400 hover:border-gray-300"
                        />
                    </div>

                    {/* Date & Time */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="group">
                            <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
                                    <Calendar className="w-4 h-4 text-teal-600" />
                                </div>
                                Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-all duration-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none hover:border-gray-300"
                            />
                        </div>

                        <div className="group">
                            <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                                    <Clock className="w-4 h-4 text-purple-600" />
                                </div>
                                Time <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-all duration-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none hover:border-gray-300"
                            />
                        </div>
                    </div>

                    {/* Duration */}
                    <div className="group">
                        <label className="text-sm font-semibold text-gray-700 mb-2 block">
                            Duration (minutes) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            min={15}
                            step={5}
                            value={durationInMinutes}
                            onChange={(e) => setDurationInMinutes(Number(e.target.value))}
                            className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-all duration-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none hover:border-gray-300"
                            placeholder="60"
                        />
                        <div className="flex items-center gap-2 mt-2">
                            <div className="w-1 h-1 rounded-full bg-teal-500" />
                            <p className="text-xs text-gray-500">Minimum duration is 15 minutes</p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                        <button
                            onClick={onClose}
                            className="px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 active:scale-95"
                        >
                            Cancel
                        </button>
                        <button
                            disabled={loading || !courseId || !date || !time}
                            onClick={handleScheduleSession}
                            className="px-8 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold shadow-lg shadow-teal-500/30 hover:shadow-xl hover:shadow-teal-500/40 hover:from-teal-600 hover:to-teal-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none active:scale-95 flex items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Scheduling...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5" />
                                    Schedule Session
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScheduleSessionModal;