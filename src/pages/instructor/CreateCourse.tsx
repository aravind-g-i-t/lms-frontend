import { useEffect, useState } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';
import { createCourse, getCategoryOptions } from '../../services/instructorServices';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../redux/store';
import { useNavigate } from 'react-router-dom';
import * as yup from "yup";

type CourseData = {
  title: string;
  description: string;
  prerequisites: string[];
  categoryId: string;
  price: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  whatYouWillLearn: string[];
};

type Category = {
  id: string;
  name: string;
};

// Yup validation schema
const courseSchema = yup.object().shape({
  title: yup.string().trim().min(5, "Course title must be at least 5 characters")
    .max(100, "Course title must be at most 100 characters").required("Title is required"),
  description: yup.string().trim().min(15, "Description must be at least 15 characters")
    .max(1000, "Description must be at most 1000 characters").required("Description is required"),
  prerequisites: yup.array().of(yup.string().trim().min(3)),
  categoryId: yup.string().required("Please select a category"),
  price: yup.number().min(0, "Price cannot be negative").max(99999, "Price is too high").required(),
  level: yup.mixed<'beginner' | 'intermediate' | 'advanced'>().oneOf(["beginner", "intermediate", "advanced"]).required(),
  tags: yup.array().of(yup.string().trim().min(2, "Tag too short")),
  whatYouWillLearn: yup.array().of(yup.string().trim().min(4, "Learning point is too short")),
});

const CreateCourse = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await dispatch(getCategoryOptions()).unwrap();
        setCategories(response.data.categories);
      } catch (err) {
        toast.error(err as string);
      }
    };
    fetchCategories();
  }, [dispatch]);

  const [courseData, setCourseData] = useState<CourseData>({
    title: '',
    description: '',
    prerequisites: [''],
    categoryId: '',
    price: 0,
    level: 'beginner',
    tags: [''],
    whatYouWillLearn: ['']
  });

  // Handlers for array fields (as before)
  const addField = (field: keyof CourseData) =>
    setCourseData(prev => ({ ...prev, [field]: [...(prev[field] as string[]), ''] }));

  const removeField = (field: keyof CourseData, index: number) =>
    setCourseData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index)
    }));

  const updateField = (field: keyof CourseData, index: number, val: string) =>
    setCourseData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).map((item, i) => (i === index ? val : item))
    }));

  const handleLevelChange = (val: string) => {
    if (val === 'beginner' || val === 'intermediate' || val === 'advanced') {
      setCourseData(prev => ({ ...prev, level: val }));
    }
  };

  // Validation and submit
  const handleSubmit = async () => {
  try {
    setLoading(true);

    // Clone and sanitize before validation
    const sanitized = {
      ...courseData,
      tags: (courseData.tags ?? []).filter(
        (tag): tag is string => !!tag && tag.trim() !== ""
      ),
      prerequisites: (courseData.prerequisites ?? []).filter(
        (p): p is string => !!p && p.trim() !== ""
      ),
      whatYouWillLearn: (courseData.whatYouWillLearn ?? []).filter(
        (w): w is string => !!w && w.trim() !== ""
      ),
    };

    // Validate after cleanup
    const cleaned = (await courseSchema.validate(sanitized, { abortEarly: false })) as CourseData;


    const response = await dispatch(createCourse(cleaned)).unwrap();
    navigate(`/instructor/courses/${response.data.courseId}/edit`);
    toast.success("Course created successfully");

  } catch (error: unknown) {
    if (error instanceof yup.ValidationError) {
      error.errors.forEach((message: string) => toast.error(message));
    } else if (typeof error === "string") {
      toast.error(error);
    } else if (error && typeof error === "object" && "message" in error) {
      toast.error((error as { message: string }).message);
    } else {
      toast.error("An error occurred");
    }
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Course</h1>
          <p className="text-gray-600">Fill in the details to create your course</p>
        </div>

        <form
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6"
          onSubmit={e => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Course Title *</label>
              <input
                type="text"
                value={courseData.title}
                onChange={e => setCourseData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
                placeholder="Enter course title"
              />
            </div>
            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Course Description *</label>
              <textarea
                value={courseData.description}
                onChange={e => setCourseData(prev => ({ ...prev, description: e.target.value }))}
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
                placeholder="Describe what students will learn in this course"
              />
            </div>
            {/* What You Will Learn */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">What You'll Learn *</label>
              {courseData.whatYouWillLearn.map((item, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={item}
                    onChange={e => updateField('whatYouWillLearn', index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="e.g., Build modern React applications"
                  />
                  {courseData.whatYouWillLearn.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeField('whatYouWillLearn', index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addField('whatYouWillLearn')}
                className="mt-2 flex items-center text-teal-600 hover:text-teal-700 text-sm"
              >
                <Plus className="w-4 h-4 mr-1" /> Add Learning Point
              </button>
            </div>
            {/* Prerequisites */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Prerequisites</label>
              {courseData.prerequisites.map((item, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={item}
                    onChange={e => updateField('prerequisites', index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="e.g., Basic HTML knowledge"
                  />
                  {courseData.prerequisites.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeField('prerequisites', index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addField('prerequisites')}
                className="mt-2 flex items-center text-teal-600 hover:text-teal-700 text-sm"
              >
                <Plus className="w-4 h-4 mr-1" /> Add Prerequisite
              </button>
            </div>
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
              <select
                value={courseData.categoryId}
                onChange={e => setCourseData(prev => ({ ...prev, categoryId: e.target.value }))}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            {/* Price & Level */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price (INR) *</label>
                <input
                  type="number"
                  value={courseData.price}
                  onChange={e => setCourseData(prev => ({ ...prev, price: Number(e.target.value) }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Course Level *</label>
                <select
                  value={courseData.level}
                  onChange={e => handleLevelChange(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>
            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
              {courseData.tags.map((tag, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tag}
                    onChange={e => updateField('tags', index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="e.g., javascript, react"
                  />
                  {courseData.tags.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeField('tags', index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addField('tags')}
                className="mt-2 flex items-center text-teal-600 hover:text-teal-700 text-sm"
              >
                <Plus className="w-4 h-4 mr-1" /> Add Tag
              </button>
            </div>
          </div>
          {/* Save Button */}
          <div className="mt-8">
            <button
              type="submit"
              className="flex items-center justify-center px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium w-full transition-colors"
              disabled={loading}
            >
              <Save className="w-5 h-5 mr-2" /> {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCourse;
