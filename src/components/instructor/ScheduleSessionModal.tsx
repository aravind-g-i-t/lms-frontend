import { X, Calendar, Clock } from "lucide-react";
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

    const dispatch = useDispatch<AppDispatch>()

    const [courseOptions, setCourseOptions] = useState<Course[]>([])
    const [description, setDescription] = useState("");
    const [date, setDate] = useState(""); // "2026-01-20"
    const [time, setTime] = useState(""); // "10:30"
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
            return;
        }
        setLoading(true);
        try {
            const scheduledAt = new Date(`${date}T${time}:00`);
            await dispatch(createLiveSession({
                courseId,
                scheduledAt,
                durationInMinutes,
                description
            }));

            setCourseId("");
            setDescription("");
            setDate("");
            setTime("");
            setDurationInMinutes(60);
            onClose();
        } catch (error) {
            toast.error(error as string)
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Schedule New Session
                    </h2>
                    <button onClick={onClose}>
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Form */}
                <div className="space-y-5">
                    {/* Title */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Course
                        </label>

                        <select
                            onChange={(e) => setCourseId(e.target.value)}
                            className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5"
                        >
                            <option value={""}>Select a course</option>
                            {courseOptions.map(course => (
                                <option
                                    key={course.id} value={course.id}>
                                    {course.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Description (optional)
                        </label>

                        <textarea
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="What will be covered in this session?"
                            className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 resize-none"
                        />
                    </div>



                    {/* Date & Time */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                <Calendar className="w-4 h-4" /> Date
                            </label>
                            <input type="date" onChange={(e) => setDate(e.target.value)} />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                <Clock className="w-4 h-4" /> Time
                            </label>
                            <input type="time" onChange={(e) => setTime(e.target.value)} />

                        </div>
                    </div>

                    {/* Duration */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Duration (minutes)
                        </label>

                        <input
                            type="number"
                            min={15}
                            step={5}
                            value={durationInMinutes}
                            onChange={(e) => setDurationInMinutes(Number(e.target.value))}
                            className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5"
                            placeholder="60"
                        />

                        <p className="text-xs text-gray-500 mt-1">
                            Minimum 15 minutes
                        </p>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-xl border text-gray-600"
                        >
                            Cancel
                        </button>
                        <button
                            disabled={loading}
                            onClick={handleScheduleSession}
                            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 text-white">
                            {loading ? "Scheduling..." : "Schedule Session"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScheduleSessionModal;
