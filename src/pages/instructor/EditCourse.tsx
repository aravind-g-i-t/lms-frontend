import {
  Save,
  Plus,
  Trash2,
  X,
  Eye,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  Image as ImageIcon,
  Video as VideoIcon,
  GripVertical,
  Archive,
  Edit,
  Upload,
  ChevronUp,
  ChevronDown,
  FileText
} from 'lucide-react';

import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import type { AppDispatch } from '../../redux/store';
import { addChapter, addNewModule, addResource, deleteChapter, deleteModule, deleteResource, getCategoryOptions, getCourseDetails, updateChapterInfo, updateCourseInfo, updateCourseObjectives, updateCoursePrerequisites, updateCoursePreviewVideo, updateCourseTags, updateCourseThumbnail, updateModuleInfo, updateVideo } from '../../redux/services/instructorServices';
import { toast } from 'react-toastify';
import { getPresignedDownloadUrl, uploadImageToS3, uploadResourceToS3, uploadVideoToS3 } from '../../config/s3Config';


export type CourseLevel = "beginner" | "intermediate" | "advanced";
export type CourseStatus = "draft" | "published" | "archived";
export type VerificationStatus = "not_verified" | "under_review" | "verified" | "rejected";

interface Chapter {
  id: string;
  title: string;
  description: string;
  video: string;
  duration: number;
  resources: Resource[];
}



interface NewChapter {
  title: string;
  description: string;
  duration: number;
}

interface Resource {
  id: string;
  name: string;
  file: string;
  size: number;
}

interface Module {
  id: string;
  title: string;
  description: string;
  duration: number;
  chapters: Chapter[];
}

interface Category {
  id: string;
  name: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  prerequisites: string[];
  category: {
    id: string,
    name: string
  };
  enrollmentCount: number;
  instructor: {
    id: string,
    name: string,
    profilePic: string | null
  };
  modules: Module[];
  level: CourseLevel;
  duration: number;
  tags: string[];
  whatYouWillLearn: string[];
  totalRatings: number;
  status: CourseStatus;
  createdAt: Date;
  updatedAt: Date;
  thumbnail: string | null;
  previewVideo: string | null;
  price: number;
  rating: number | null;
  publishedAt: Date | null;
  verification: {
    status: VerificationStatus,
    reviewedAt: Date | null;
    submittedAt: Date | null;
    remarks: string | null
  }
}

const EditCoursePage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();

  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [previewVideoPreview, setPreviewVideoPreview] = useState<string | null>(null);
  const [chapterVideoFile, setChapterVideoFile] = useState<File | null>(null);
  const [chapterVideoPreview, setChapterVideoPreview] = useState<string | null>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [expandedVideos, setExpandedVideos] = useState(new Set());


  // Form state
  const [courseData, setCourseData] = useState<Course | null>(null);

  const [categories, setCategories] = useState<Category[]>([])


  // Temporary input states
  const [newTag, setNewTag] = useState('');
  const [newLearning, setNewLearning] = useState('');
  const [newPrerequisite, setNewPrerequisite] = useState('');
  const [newModule, setNewModule] = useState<{ title: string; description: string } | null>(null);
  const [newChapter, setNewChapter] = useState<NewChapter | null>(null);
  const [addChapterModuleId, setAddChapterModuleId] = useState<string | null>(null);


  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [previewVideoFile, setPreviewVideoFile] = useState<File | null>(null);




  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await dispatch(getCategoryOptions()).unwrap();
        setCategories(response.data.categories);
      } catch (err) {
        toast.error(err as string);
      }
    };
    const fetchCourseDetails = async () => {
      try {
        if (!courseId) {
          return
        }
        const response = await dispatch(getCourseDetails(courseId)).unwrap();
        console.log(response.data);
        setCourseData(response.data)

      } catch (err) {
        toast.error(err as string);
      }
    };

    fetchCategories();
    fetchCourseDetails();
  }, [dispatch, courseId]);


  const handleBasicInfoChange = (field: keyof Course, value: Course[keyof Course]) => {
    setCourseData(prev => prev ? ({ ...prev, [field]: value } as Course) : prev);
  };


  const handleSaveChapter = async (moduleId: string) => {
    if (!chapterVideoFile || !courseData || !newChapter) return;
    try {
      const objectKey = await uploadVideoToS3(chapterVideoFile);
      if (!objectKey) {
        toast.error("Course video upload failed");
        return;
      }


      const result = await dispatch(
        addChapter({
          courseId: courseData.id,
          moduleId,
          title: newChapter.title,
          description: newChapter.description,
          duration: newChapter.duration,
          video: objectKey
        })
      ).unwrap();

      setCourseData(prev =>
        prev
          ? ({
            ...prev, duration: prev.duration + newChapter.duration,
            modules: prev.modules.map((module) =>
              module.id === moduleId
                ? {
                  ...module, duration: module.duration + newChapter.duration,
                  chapters: [
                    ...module.chapters,
                    result.chapter,
                  ],
                }
                : module
            ),
          } as Course)
          : prev
      );
      setNewChapter(null);
      setChapterVideoFile(null);
      setChapterVideoPreview(null);
      setAddChapterModuleId(null)

      toast.success(result.message || "Chapter added successfully");
    } catch (error) {
      toast.error(error as string);
    }

  };

  const handleUploadThumbnail = async () => {
    if (!thumbnailFile || !courseData) return;

    try {
      const objectKey = await uploadImageToS3(thumbnailFile);
      if (!objectKey) {
        toast.error("Identity proof upload failed");
        return;
      }

      const thumbnailURL = await getPresignedDownloadUrl(objectKey);

      const result = await dispatch(
        updateCourseThumbnail({
          id: courseData.id,
          thumbnail: objectKey
        })
      ).unwrap();

      setCourseData(prev =>
        prev ? ({ ...prev, thumbnail: thumbnailURL } as Course) : prev
      );
      setThumbnailFile(null);
      setThumbnailPreview(null);

      toast.success(result.message || "Thumbnail updated successfully");
    } catch (error) {
      toast.error(error as string);
    }
  }

  const handleDeleteThumbnail = async () => {
    try {
      if (!courseData) return null
      await dispatch(
        updateCourseThumbnail({
          id: courseData.id,
          thumbnail: null
        })
      ).unwrap();

      setCourseData(prev =>
        prev ? ({ ...prev, thumbnail: null } as Course) : prev
      );
    } catch (error) {
      toast.error(error as string)
    }
  }

  const handleUploadPreviewVideo = async () => {
    if (!previewVideoFile || !courseData) return;

    try {
      const objectKey = await uploadVideoToS3(previewVideoFile);
      if (!objectKey) {
        toast.error("Preview video upload failed");
        return;
      }

      const videoURL = await getPresignedDownloadUrl(objectKey);

      const result = await dispatch(
        updateCoursePreviewVideo({
          id: courseData.id,
          previewVideo: objectKey,
        })
      ).unwrap();

      setCourseData(prev =>
        prev ? ({ ...prev, previewVideo: videoURL } as Course) : prev
      );

      setPreviewVideoFile(null);
      setPreviewVideoPreview(null);

      toast.success(result.message || "Preview video updated successfully");
    } catch (error) {
      toast.error(error as string);
    }
  };

  const handleDeletePreviewVideo = async () => {
    try {
      if (!courseData) return null;

      await dispatch(
        updateCoursePreviewVideo({
          id: courseData.id,
          previewVideo: null,
        })
      ).unwrap();

      setCourseData(prev =>
        prev ? ({ ...prev, previewVideo: null } as Course) : prev
      );
    } catch (error) {
      toast.error(error as string);
    }
  };


  function handleVideoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setChapterVideoFile(e.target.files[0]);
      setChapterVideoPreview(URL.createObjectURL(e.target.files[0]));
    }
  }

  function handleRemoveChapterVideo() {
    setChapterVideoFile(null);
    setChapterVideoPreview(null);
    setNewChapter((prev) =>
      prev
        ? { ...prev, duration: 0 }
        : { duration: 0, description: "", title: "" }
    );
    if (videoInputRef.current) {
      videoInputRef.current.value = "";
    }

  }



  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file)
      const url = URL.createObjectURL(file);
      setThumbnailPreview(url);
    }
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
    setThumbnailPreview(null);
    setThumbnailFile(null)
  };

  const handlePreviewVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewVideoFile(file)
      const url = URL.createObjectURL(file);
      setPreviewVideoPreview(url);
    }
  };

  const handleRemovePreviewVideo = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (previewVideoPreview) URL.revokeObjectURL(previewVideoPreview);
    setPreviewVideoPreview(null);
    setPreviewVideoFile(null)
  };




  const handleUpdateInfo = async () => {
    try {
      if (!courseData) {
        return
      }
      await dispatch(updateCourseInfo({
        id: courseData.id,
        title: courseData.title,
        description: courseData.description,
        categoryId: courseData.category.id,
        level: courseData.level,
        price: courseData.price
      })).unwrap()
    } catch (error) {
      toast.error(error as string)
    }
  }


  const handleUpdateModule = async (moduleId: string, title: string, description: string) => {
    try {
      if (!courseData) {
        return
      }
      await dispatch(updateModuleInfo({
        courseId: courseData.id,
        moduleId,
        title,
        description
      })).unwrap()
    } catch (error) {
      toast.error(error as string)
    }
  }

  const handleUpdateChapter = async (moduleId: string, chapterId: string, title: string, description: string) => {
    try {
      if (!courseData) {
        return
      }

      await dispatch(updateChapterInfo({
        courseId: courseData.id,
        moduleId,
        chapterId,
        title,
        description
      })).unwrap()
    } catch (error) {
      toast.error(error as string)
    }
  }

  const handleUpdateVideo = async (moduleId: string, chapterId: string, chapterDuration: number, videoFile: File) => {
    try {
      if (!courseData) {
        return
      }

      const objectKey = await uploadVideoToS3(videoFile);
      console.log("objectKey", objectKey);

      if (!objectKey) {
        toast.error("Video upload failed");
        return;
      }
      const videoDuration = await getVideoDuration(videoFile);
      console.log("videoDuration", videoDuration);

      const videoURL = await getPresignedDownloadUrl(objectKey);
      console.log("videoDuration", videoDuration);
      await dispatch(updateVideo({
        courseId: courseData.id,
        moduleId,
        chapterId,
        video: objectKey,
        duration: videoDuration
      })).unwrap();


      setCourseData(prev =>
        prev
          ? ({
            ...prev,
            duration: prev.duration - chapterDuration + videoDuration,
            modules: prev.modules.map((module) =>
              module.id === moduleId
                ? {
                  ...module,
                  duration: module.duration - chapterDuration + videoDuration,
                  chapters: module.chapters.map((chapter) =>
                    chapter.id === chapterId
                      ? {
                        ...chapter,
                        duration: chapter.duration - chapterDuration + videoDuration,
                        video: videoURL,
                      }
                      : chapter
                  ),
                }
                : module
            ),
          } as Course)
          : prev
      );

      console.log("courseData", courseData);


    } catch (error) {
      toast.error(error as string)
    }
  }

  const getVideoDuration = (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      video.preload = "metadata";

      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        resolve(video.duration); // duration in seconds
      };

      video.onerror = (e) => reject(e);
      video.src = URL.createObjectURL(file);
    });
  };


  const handleDeleteModule = async (moduleId: string, moduleDuration: number) => {
    try {
      if (!courseData) {
        return
      }
      await dispatch(deleteModule({
        courseId: courseData.id,
        moduleId,
      })).unwrap();

      setCourseData(prev =>
        prev
          ? ({ ...prev, duration: prev.duration - moduleDuration, modules: prev.modules.filter((module) => module.id !== moduleId) } as Course)
          : prev
      );
    } catch (error) {
      toast.error(error as string)
    }
  }

  const handleDeleteChapter = async (moduleId: string, chapterId: string, chapterDuration: number) => {
    try {
      if (!courseData) {
        return
      }

      await dispatch(deleteChapter({
        courseId: courseData.id,
        moduleId,
        chapterId
      })).unwrap();


      setCourseData(prev =>
        prev
          ? ({
            ...prev,
            duration: prev.duration - chapterDuration,
            modules: prev.modules.map((module) =>
              module.id === moduleId
                ? {
                  ...module,
                  duration: module.duration - chapterDuration,
                  chapters: module.chapters.filter((chapter) => chapter.id !== chapterId),
                }
                : module
            ),
          } as Course)
          : prev
      );
    } catch (error) {
      toast.error(error as string)
    }
  }


  const addTag = async () => {
    try {
      if (newTag.trim() && courseData && !courseData.tags.includes(newTag.trim())) {
        await dispatch(updateCourseTags({
          id: courseData.id,
          tags: [...courseData.tags, newTag.trim()]
        })).unwrap();
        setCourseData(prev =>
          prev ? ({ ...prev, tags: [...prev.tags, newTag.trim()] } as Course) : prev
        );
        setNewTag('');
      }
    } catch (error) {
      toast.error(error as string)
    }

  };


  const removeTag = async (index: number) => {
    try {
      if (!courseData) {
        return
      }
      const newTags = courseData.tags.filter((_, i) => i !== index);
      await dispatch(updateCourseTags({
        id: courseData.id,
        tags: newTags
      })).unwrap();
      setCourseData(prev =>
        prev ? ({ ...prev, tags: newTags } as Course) : prev
      );
    } catch (error) {
      toast.error(error as string)
    }
  };

  const addObjective = async () => {
    try {
      if (newLearning.trim() && courseData && !courseData.whatYouWillLearn.includes(newLearning.trim())) {
        await dispatch(updateCourseObjectives({
          id: courseData.id,
          whatYouWillLearn: [...courseData.whatYouWillLearn, newLearning.trim()]
        })).unwrap();
        setCourseData(prev =>
          prev ? ({ ...prev, whatYouWillLearn: [...prev.whatYouWillLearn, newLearning.trim()] } as Course) : prev
        );
        setNewLearning('');
      }
    } catch (error) {
      toast.error(error as string)
    }

  };


  const removeObjective = async (index: number) => {
    try {
      if (!courseData) {
        return
      }
      const newObjectives = courseData.whatYouWillLearn.filter((_, i) => i !== index);
      await dispatch(updateCourseObjectives({
        id: courseData.id,
        whatYouWillLearn: newObjectives
      })).unwrap();
      setCourseData(prev =>
        prev ? ({ ...prev, whatYouWillLearn: newObjectives } as Course) : prev
      );
    } catch (error) {
      toast.error(error as string)
    }
  };




  const addPrerequisite = async () => {
    try {
      if (newPrerequisite.trim() && courseData && !courseData.prerequisites.includes(newPrerequisite.trim())) {
        await dispatch(updateCoursePrerequisites({
          id: courseData.id,
          prerequisites: [...courseData.prerequisites, newPrerequisite.trim()]
        })).unwrap();
        setCourseData(prev =>
          prev ? ({ ...prev, prerequisites: [...prev.prerequisites, newPrerequisite.trim()] } as Course) : prev
        );
        setNewPrerequisite('');
      }
    } catch (error) {
      toast.error(error as string)
    }
  }; 


  const removePrerequisite = async (index: number) => {
    try {
      if (!courseData) {
        return
      }
      const newPrerequisites = courseData.prerequisites.filter((_, i) => i !== index);
      await dispatch(updateCoursePrerequisites({
        id: courseData.id,
        prerequisites: newPrerequisites
      })).unwrap();
      setCourseData(prev =>
        prev ? ({ ...prev, prerequisites: newPrerequisites } as Course) : prev
      );
    } catch (error) {
      toast.error(error as string)
    }
  };

  const addModule = () => {
    setNewModule({
      title: "",
      description: ""
    })
  }

  const handleSaveModule = async () => {
    try {
      if (!newModule || !courseData) return
      const result = await dispatch(addNewModule({
        id: courseData.id,
        title: newModule.title,
        description: newModule.description
      })).unwrap()
      setCourseData(prev =>
        prev
          ? ({
            ...prev,
            modules: [
              ...prev.modules,
              result.module,
            ],
          } as Course)
          : prev
      );

      setNewModule(null)
    } catch (error) {
      toast.error(error as string)
    }
  };


  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateModule = (index: number, field: keyof Module, value: any) => {
    setCourseData(prev =>
      prev
        ? ({
          ...prev,
          modules: prev.modules.map((module, i) =>
            i === index ? { ...module, [field]: value } : module
          ),
        } as Course)
        : prev
    );
  };





  const updateChapter = (
    moduleIndex: number,
    chapterIndex: number,
    field: keyof Chapter,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any
  ) => {
    setCourseData(prev =>
      prev
        ? ({
          ...prev,
          modules: prev.modules.map((module, i) =>
            i === moduleIndex
              ? {
                ...module,
                chapters: module.chapters.map((chapter, j) =>
                  j === chapterIndex ? { ...chapter, [field]: value } : chapter
                ),
              }
              : module
          ),
        } as Course)
        : prev
    );
  };



  const handleAddResource = async (moduleId: string, chapterId: string, resource: File) => {
    if (!courseData) {
      return
    }
    const name = resource.name;
    const size = resource.size;

    const objectKey = await uploadResourceToS3(resource);
    console.log("objectKey", objectKey);

    if (!objectKey) {
      toast.error("Failed to upload resource.");
      return;
    }

    const result = await dispatch(addResource({
      courseId: courseData.id,
      moduleId,
      chapterId,
      name,
      file: objectKey,
      size
    })).unwrap();

    setCourseData(prev =>
      prev
        ? ({
          ...prev,
          modules: prev.modules.map((module) =>
            module.id === moduleId
              ? {
                ...module,
                chapters: module.chapters.map((chapter) =>
                  chapter.id === chapterId
                    ? {
                      ...chapter,
                      resources: [
                        ...chapter.resources,
                        result.resource
                      ],
                    }
                    : chapter
                ),
              }
              : module
          ),
        } as Course)
        : prev
    );
  };

  const handleDeleteResource = async (moduleId: string, chapterId: string, resourceId: string) => {
    if (!courseData) {
      return
    }


    await dispatch(deleteResource({
      courseId: courseData.id,
      moduleId,
      chapterId,
      resourceId
    })).unwrap();

    setCourseData(prev =>
      prev
        ? ({
          ...prev,
          modules: prev.modules.map((module) =>
            module.id === moduleId
              ? {
                ...module,
                chapters: module.chapters.map((chapter) =>
                  chapter.id === chapterId
                    ? {
                      ...chapter,
                      resources: chapter.resources.filter(r => r.id !== resourceId),
                    }
                    : chapter
                ),
              }
              : module
          ),
        } as Course)
        : prev
    );
  };







  const toggleVideo = (chapterId: string) => {
    const newExpandedVideos = new Set(expandedVideos);
    if (newExpandedVideos.has(chapterId)) {
      newExpandedVideos.delete(chapterId);
    } else {
      newExpandedVideos.add(chapterId);
    }
    setExpandedVideos(newExpandedVideos)
  }






  const getStatusBadge = (status: CourseStatus) => {
    switch (status) {
      case 'draft':
        return {
          label: 'Draft',
          className: 'bg-gray-100 text-gray-800 border border-gray-400 shadow-xs',
          icon: <Edit className="w-5 h-5 text-gray-500 mr-1" />
        };

      case 'published':
        return {
          label: 'Published',
          className: 'bg-green-200 text-green-900 border border-green-400 shadow-xs',
          icon: <Eye className="w-5 h-5 text-green-600 mr-1" />
        };
      case 'archived':
        return {
          label: 'Archived',
          className: 'bg-red-200 text-red-900 border border-red-400 shadow-xs',
          icon: <Archive className="w-5 h-5 text-red-600 mr-1" />
        };
      default:
        return {
          label: status,
          className: 'bg-gray-100 text-gray-800 border border-gray-400 shadow-xs',
          icon: null
        };
    }
  };

  // const statusBadge = getStatusBadge((courseData as Course).status);
  if (!courseData) {
    return null
  }
  if (courseData.verification.status === "verified") {
    navigate("/instructor/courses")
  }
  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/instructor/courses"
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Edit Course</h1>
                {/* <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusBadge.className}`}>
                    {statusBadge.label}
                  </span>
                  <span className="text-sm text-gray-500">ID: {courseData.id}</span>
                </div> */}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to={`/instructor/courses/${courseId}/preview`}
                className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Link>

              {/* {courseData.status === 'draft' && (
                <button
                  onClick={handleSubmitForReview}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Submit for Review
                </button>
              )} */}

              {/* {courseData.verification.status === 'verified' && (
                <button
                  onClick={handlePublish}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Publish Course
                </button>
              )} */}

              {/* <button
                // onClick={handleSave}
                className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </button> */}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    value={courseData.title}
                    onChange={(e) => handleBasicInfoChange('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Enter course title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={courseData.description}
                    onChange={(e) => handleBasicInfoChange('description', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Describe your course"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      value={courseData.category.id}
                      onChange={(e) => {
                        const selectedId = e.target.value;
                        const selectedCategory = categories.find(cat => cat.id === selectedId);
                        if (selectedCategory) {
                          handleBasicInfoChange('category', selectedCategory);
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    >
                      {/* <option value="">Select category</option> */}
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Level */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Level *
                    </label>
                    <select
                      value={courseData.level}
                      onChange={(e) =>
                        handleBasicInfoChange('level', e.target.value as CourseLevel)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (₹) *
                    </label>
                    <input
                      type="number"
                      value={courseData.price}
                      onChange={(e) =>
                        handleBasicInfoChange('price', parseFloat(e.target.value))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                    />
                  </div>
                </div>

              </div>

              {/* Save Button for Basic Info */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={handleUpdateInfo}
                  className="w-full flex items-center justify-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Basic Information
                </button>
              </div>
            </div>

            {/* Course Thumbnail - Separate Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Course Thumbnail *</h2>

              <div className="space-y-4">
                {courseData.thumbnail ? (
                  <div className="relative">
                    <img
                      src={courseData.thumbnail}
                      alt="Course thumbnail"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      onClick={handleDeleteThumbnail}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-teal-500 transition-colors cursor-pointer relative"
                    onClick={() => document.getElementById("thumbnailInput")?.click()}
                  >
                    {/* Preview mode */}
                    {thumbnailPreview ? (
                      <div className="relative inline-block">
                        <img
                          src={thumbnailPreview}
                          alt="Course Thumbnail"
                          className="w-full h-48 object-cover rounded-md"
                        />
                        <button
                          onClick={handleRemoveImage}
                          className="absolute top-2 right-2 bg-white/80 hover:bg-white text-gray-700 rounded-full p-1 shadow"
                          title="Remove image"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      // Upload prompt
                      <>
                        <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-sm text-gray-600 mb-1">
                          Click to upload course thumbnail
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, or GIF (Recommended: 1200x600px, max 2MB)
                        </p>
                      </>
                    )}

                    {/* Hidden input */}
                    <input
                      id="thumbnailInput"
                      type="file"
                      accept="image/png, image/jpeg, image/gif"
                      className="hidden"
                      onChange={handleImageSelect}
                    />
                  </div>

                )}

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <AlertCircle className="w-4 h-4" />
                  <span>A compelling thumbnail can increase course enrollment by up to 40%</span>
                </div>
              </div>

              {/* Save Button for Thumbnail */}
              {thumbnailPreview && <div className="mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleUploadThumbnail()}
                  className="w-full flex items-center justify-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Thumbnail
                </button>
              </div>}
            </div>

            {/* Preview Video - Separate Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Preview Video *</h2>

              <div className="space-y-4">
                {courseData.previewVideo ? (
                  <div className="relative">
                    <video
                      src={courseData.previewVideo}
                      controls
                      className="w-full h-64 rounded-lg bg-gray-900"
                    />
                    <button
                      onClick={handleDeletePreviewVideo}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-teal-500 transition-colors cursor-pointer relative"
                    onClick={() => document.getElementById("previewVideoInput")?.click()}
                  >
                    {previewVideoPreview ? (
                      <div className="relative inline-block w-full">
                        <video
                          src={previewVideoPreview}
                          controls
                          className="w-full h-48 object-cover rounded-md bg-gray-900"
                        />
                        <button
                          onClick={handleRemovePreviewVideo}
                          className="absolute top-2 right-2 bg-white/80 hover:bg-white text-gray-700 rounded-full p-1 shadow"
                          title="Remove video"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <VideoIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-sm text-gray-600 mb-1">
                          Click to upload preview video
                        </p>
                        <p className="text-xs text-gray-500">
                          MP4 or MOV (Recommended: 1–2 minutes, max 50MB)
                        </p>
                      </>
                    )}

                    <input
                      id="previewVideoInput"
                      type="file"
                      accept="video/mp4, video/quicktime"
                      className="hidden"
                      onChange={handlePreviewVideoSelect}
                    />
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <AlertCircle className="w-4 h-4" />
                  <span>Preview videos help students understand what they'll learn in the course</span>
                </div>
              </div>

              {/* Save Button for Preview Video */}
              {previewVideoPreview && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleUploadPreviewVideo()}
                    className="w-full flex items-center justify-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Preview Video
                  </button>
                </div>
              )}
            </div>


            {/* What You'll Learn */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">What You'll Learn</h2>

              <div className="space-y-3">
                {courseData.whatYouWillLearn.map((item, index) => (
                  <div key={index} className="flex items-start gap-2 group">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="flex-1 text-gray-700">{item}</span>
                    <button
                      onClick={() => removeObjective(index)}
                      className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                <div className="flex gap-2 mt-4">
                  <input
                    type="text"
                    value={newLearning}
                    onChange={(e) => setNewLearning(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addObjective()}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Add learning outcome"
                  />
                  <button
                    onClick={addObjective}
                    className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Prerequisites */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Prerequisites</h2>

              <div className="space-y-3">
                {courseData.prerequisites.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 group">
                    <span className="flex-1 text-gray-700 px-3 py-2 bg-gray-50 rounded-lg">{item}</span>
                    <button
                      onClick={() => removePrerequisite(index)}
                      className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                <div className="flex gap-2 mt-4">
                  <input
                    type="text"
                    value={newPrerequisite}
                    onChange={(e) => setNewPrerequisite(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addPrerequisite()}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Add prerequisite"
                  />
                  <button
                    onClick={addPrerequisite}
                    className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Tags</h2>

              <div className="flex flex-wrap gap-2 mb-4">
                {courseData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm flex items-center gap-2"
                  >
                    #{tag}
                    <button
                      onClick={() => removeTag(index)}
                      className="hover:text-teal-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Add tag"
                />
                <button
                  onClick={addTag}
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Course Content - Modules & Chapters */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Course Content</h2>

              </div>

              <div className="space-y-4">
                {courseData.modules.map((module, moduleIndex) => (
                  <div key={moduleIndex} className="border border-gray-200 rounded-lg">
                    <div className="bg-gray-50 p-4">
                      <div className="flex items-start gap-3">
                        <GripVertical className="w-5 h-5 text-gray-400 mt-2 cursor-move" />

                        <div className="flex-1 space-y-3">
                          <input
                            type="text"
                            value={module.title}
                            onChange={(e) => updateModule(moduleIndex, 'title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg font-semibold"
                            placeholder="Module title"
                          />
                          <textarea
                            value={module.description}
                            onChange={(e) => updateModule(moduleIndex, 'description', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            placeholder="Module description"
                            rows={2}
                          />
                          <div className="flex justify-end">
                            <button
                              onClick={() => handleUpdateModule(module.id, module.title, module.description)}
                              className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 cursor-pointer flex items-center gap-2">
                              <Upload className="w-4 h-4" />
                              Update Info
                            </button>
                          </div>

                        </div>

                        <div className="flex gap-2">

                          <button
                            onClick={() => handleDeleteModule(module.id, module.duration)}
                            className="p-2 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>


                    <div className="p-4 space-y-3">
                      {module.chapters.map((chapter, chapterIndex) => (
                        <div key={chapterIndex} className="border border-gray-200 rounded-lg p-4 bg-white">
                          <div className="flex items-start gap-3 mb-3">
                            <div className="flex-1 space-y-3">
                              <input
                                type="text"
                                value={chapter.title}
                                onChange={(e) => updateChapter(moduleIndex, chapterIndex, "title", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg font-medium"
                                placeholder="Chapter title"
                              />
                              <textarea
                                value={chapter.description}
                                onChange={(e) => updateChapter(moduleIndex, chapterIndex, "description", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                placeholder="Chapter description"
                                rows={2}
                              />

                              <div className="flex justify-end">
                                <button
                                  onClick={() => handleUpdateChapter(module.id, chapter.id, chapter.title, chapter.description)}
                                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 cursor-pointer flex items-center gap-2">
                                  <Upload className="w-4 h-4" />
                                  Update Info
                                </button>
                              </div>

                              {/* Collapsible Video Section */}
                              <div className="border border-gray-300 rounded-lg">
                                <button
                                  onClick={() => toggleVideo(chapter.id)}
                                  className="w-full flex justify-between items-center px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-t-lg"
                                >
                                  <div className="flex items-center gap-2">
                                    <VideoIcon className="w-4 h-4 text-gray-600" />
                                    <span className="text-sm font-medium">Video</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    {Math.floor(chapter.duration / 60)}:
                                    {("0" + Math.floor(chapter.duration % 60)).slice(-2)}
                                    {expandedVideos.has(chapter.id) ? (
                                      <ChevronUp className="w-4 h-4" />
                                    ) : (
                                      <ChevronDown className="w-4 h-4" />
                                    )}
                                  </div>
                                </button>

                                {expandedVideos.has(chapter.id) && (
                                  <div className="p-3 border-t border-gray-200 bg-white rounded-b-lg space-y-3">
                                    {chapter.video ? (
                                      <video
                                        src={chapter.video}
                                        controls
                                        className="w-full rounded-lg border border-gray-200"
                                      />
                                    ) : (
                                      <div className="text-sm text-gray-500 italic">No video uploaded</div>
                                    )}

                                    {/* Update Video Button */}
                                    <div className="flex justify-end">
                                      <label className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 cursor-pointer flex items-center gap-2">
                                        <Upload className="w-4 h-4" />
                                        Update Video
                                        <input
                                          type="file"
                                          accept="video/*"
                                          className="hidden"
                                          onChange={(e) => {
                                            if (e.target.files && e.target.files[0]) {
                                              handleUpdateVideo(module.id, chapter.id, chapter.duration, e.target.files[0]);
                                            }
                                          }}
                                        />
                                      </label>
                                    </div>
                                  </div>
                                )}
                              </div>

                            </div>

                            <button
                              onClick={() => handleDeleteChapter(module.id, chapter.id, chapter.duration)}
                              className="p-2 text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>


                          <div className="mt-4 border-t pt-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-700">Resources</span>
                              <label
                                className="text-xs text-teal-600 hover:text-teal-700 flex items-center"
                              >
                                <Plus className="w-3 h-3 mr-1" />
                                Add Resource
                                <input
                                  type="file"
                                  accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.jpg,.jpeg,.png,.gif,.mp4,.mkv,.webm"
                                  className="hidden"
                                  onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                      handleAddResource(module.id, chapter.id, e.target.files[0]);
                                    }
                                  }}
                                />
                              </label>
                            </div>

                            {chapter.resources.map((resource, resourceIndex) => (
                              <div
                                key={resourceIndex}
                                className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 mb-2 shadow-sm hover:shadow transition"
                              >
                                {/* Left: icon + file info */}
                                <div className="flex items-center gap-3 overflow-hidden">
                                  {/* File Icon */}
                                  <div className="flex items-center justify-center w-8 h-8 bg-white border border-gray-300 rounded-md shadow-sm">
                                    <FileText className="w-4 h-4 text-gray-600" />
                                  </div>

                                  {/* File metadata */}
                                  <div className="flex flex-col overflow-hidden">
                                    <span className="text-sm font-medium text-gray-800 truncate max-w-[180px]">
                                      {resource.name}
                                    </span>

                                    <span className="text-xs text-gray-500">
                                      {(resource.size / 1024 / 1024).toFixed(2)} MB
                                    </span>
                                  </div>
                                </div>

                                {/* Right: delete button */}
                                <button
                                  onClick={() => handleDeleteResource(module.id, chapter.id, resource.id)}
                                  className="text-red-500 hover:text-red-700 p-1"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}

                          </div>
                        </div>
                      ))}

                      {newChapter && addChapterModuleId === module.id &&
                        <div className="border border-gray-200 rounded-lg p-6 bg-white space-y-4">
                          <div className="flex items-start gap-4">
                            <div className="flex-1 space-y-4">
                              {/* Chapter Title */}
                              <input
                                type="text"
                                value={newChapter.title}
                                onChange={e =>
                                  setNewChapter(prev =>
                                    prev
                                      ? { ...prev, title: e.target.value }
                                      : { title: e.target.value, description: "", duration: 0 }
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg font-medium text-gray-900 focus:ring-2 focus:ring-teal-500"
                                placeholder="Chapter title"
                              />

                              {/* Chapter Description */}
                              <textarea
                                value={newChapter.description}
                                onChange={e =>
                                  setNewChapter(prev =>
                                    prev
                                      ? { ...prev, description: e.target.value }
                                      : { description: e.target.value, title: "", duration: 0 }
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-teal-500"
                                placeholder="Chapter description"
                                rows={2}
                              />

                              {/* Chapter Duration */}
                              <div className="text-sm text-gray-700">
                                Duration: {Math.floor(newChapter.duration / 60)}:{("0" + Math.floor(newChapter.duration % 60)).slice(-2)} minutes
                              </div>

                              {/* Video Upload/Preview */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Video</label>
                                {chapterVideoPreview ? (
                                  <div className="relative w-full">
                                    <video
                                      src={chapterVideoPreview}
                                      controls
                                      className="w-full h-48 rounded bg-black"
                                      onLoadedMetadata={e => {
                                        const duration = (e.target as HTMLVideoElement).duration;
                                        setNewChapter(prev =>
                                          prev
                                            ? { ...prev, duration }
                                            : { duration, description: "", title: "" }
                                        );
                                      }}
                                    />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        handleRemoveChapterVideo();
                                        setNewChapter(prev =>
                                          prev
                                            ? { ...prev, duration: 0 }
                                            : { duration: 0, description: "", title: "" }
                                        );
                                      }}
                                      className="absolute top-2 right-2 bg-white/80 hover:bg-gray-100 text-gray-700 rounded-full p-1 shadow"
                                      title="Remove video"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                ) : (
                                  <div

                                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-teal-400 transition-colors cursor-pointer"
                                    onClick={() => videoInputRef.current?.click()}
                                  >
                                    <span className="block text-gray-400 mb-2">
                                      <svg viewBox="0 0 24 24" className="w-8 h-8 mx-auto"><path fill="currentColor" d="M19 17H21V3H3V17H5V19C5 19.55 5.45 20 6 20H18C18.55 20 19 19.55 19 19V17ZM5 15V5H19V15H5Z"></path></svg>
                                    </span>
                                    <p className="text-gray-600">Click to select or drop video (MP4/MOV)</p>
                                    <input
                                      type="file"
                                      ref={videoInputRef}
                                      className="hidden"
                                      accept="video/*"
                                      onChange={handleVideoSelect}
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                            {/* Remove Chapter Button */}
                            <button
                              onClick={() => {
                                setNewChapter(null);
                                setAddChapterModuleId(null);
                                handleRemoveChapterVideo()
                              }}
                              className="p-2 text-red-500 hover:text-red-700 self-start"
                              title="Remove chapter"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          {/* Save Button */}
                          <div className="flex justify-end mt-4">
                            <button
                              onClick={() => handleSaveChapter(module.id)}
                              className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 flex items-center gap-2 shadow"
                            >
                              <Save className="w-4 h-4 " />
                              Save Chapter
                            </button>
                          </div>
                        </div>

                      }

                      {addChapterModuleId === null && (<button
                        onClick={() => {
                          setNewChapter({
                            title: "",
                            description: "",
                            duration: 0
                          })

                          setAddChapterModuleId(module.id)
                        }}
                        className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-teal-500 hover:text-teal-600 flex items-center justify-center"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Chapter
                      </button>)}
                    </div>

                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between mt-4 mb-4">
                <div></div>
                <button
                  onClick={addModule}
                  className="flex items-center px-3 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm"
                  disabled={newModule !== null}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Module
                </button>
              </div>
              <div className="space-y-4">
                {newModule && (
                  <div className="border border-gray-200 rounded-lg">
                    <div className="bg-gray-50 p-4">
                      <div className="flex items-start gap-3">
                        <GripVertical className="w-5 h-5 text-gray-400 mt-2 cursor-move" />

                        <div className="flex-1 space-y-3">
                          <input
                            type="text"
                            value={newModule.title}
                            onChange={(e) =>
                              setNewModule((m) =>
                                m
                                  ? { ...m, title: e.target.value }
                                  : { title: e.target.value, description: "" }
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg font-semibold"
                            placeholder="Module title"
                          />

                          <textarea
                            value={newModule.description}
                            onChange={(e) =>
                              setNewModule((m) =>
                                m
                                  ? { ...m, description: e.target.value }
                                  : { title: "", description: e.target.value }
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            placeholder="Module description"
                            rows={2}
                          />

                          {/* ✅ Save button */}
                          <button
                            onClick={handleSaveModule}
                            className="bg-teal-600  hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                          >
                            Save Module
                          </button>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setNewModule(null);

                            }}
                            className="p-2 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Course Status */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Course Status</h3>
                {/* Display only, enhanced badge */}
                <div className="flex items-center">
                  <span className={`inline-flex items-center px-4 py-2 rounded-full text-base font-extrabold ${getStatusBadge(courseData.status).className}`}
                    style={{ transition: 'box-shadow .2s', boxShadow: '0 1px 6px rgba(0,0,0,0.08)' }}>
                    {getStatusBadge(courseData.status).icon}
                    {getStatusBadge(courseData.status).label}
                  </span>
                </div>
              </div>

              {/* Course Statistics */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Statistics</h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Enrollments</span>
                    <span className="font-semibold text-gray-900">{courseData.enrollmentCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rating</span>
                    <span className="font-semibold text-gray-900">{courseData.rating || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Ratings</span>
                    <span className="font-semibold text-gray-900">{courseData.totalRatings}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Modules</span>
                    <span className="font-semibold text-gray-900">{courseData.modules.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Chapters</span>
                    <span className="font-semibold text-gray-900">
                      {courseData.modules.reduce((sum, m) => sum + m.chapters.length, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-semibold text-gray-900">
                      {Math.floor(courseData.duration / 60)}:{("0" + Math.floor(courseData.duration % 60)).slice(-2)} minutes

                    </span>
                  </div>
                </div>
              </div>

              {/* Timestamps */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Timestamps</h3>

                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-600">Created</span>
                    <p className="text-gray-900 mt-1">
                      {courseData?.createdAt
                        ? new Date(courseData.createdAt).toLocaleDateString()
                        : '—'}
                    </p>
                  </div>

                  <div>
                    <span className="text-gray-600">Last Updated</span>
                    <p className="text-gray-900 mt-1">
                      {courseData?.updatedAt
                        ? new Date(courseData.updatedAt).toLocaleDateString()
                        : '—'}
                    </p>
                  </div>



                  {courseData?.publishedAt && (
                    <div>
                      <span className="text-gray-600">Published</span>
                      <p className="text-gray-900 mt-1">
                        {new Date(courseData.publishedAt).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>


              {/* Help */}
              <div className="bg-blue-50 rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-1">Need Help?</h4>
                    <p className="text-sm text-blue-700">
                      Check our instructor guidelines for tips on creating engaging course content.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCoursePage;
