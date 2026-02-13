import {
  Users,
  Star,
  Clock,
  BookOpen,
  CheckCircle,
  PlayCircle,
  ChevronDown,
  ChevronUp,
  Calendar,
  Award,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import type { AppDispatch, RootState } from '../../redux/store';
import { toast } from 'react-toastify';
import LearnerNav from '../../components/learner/LearnerNav';
import { addToFavourites, cancelEnrollment, getCourseDetailsForLearner, getReviewsForLearner, removeFromFavourites, submitReview, updateReview } from '../../services/learnerServices';
import { formatDuration } from '../../utils/formats';
import CourseOverviewSkeleton from '../../components/learner/CourseOverviewSkeleton';

type CourseLevel = "beginner" | "intermediate" | "advanced";


interface Chapter {
  id: string;
  title: string;
  description: string;
  duration: number;
}

interface Module {
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

export interface Course {
  id: string;
  title: string;
  description: string;
  prerequisites: string[];
  category: {
    name: string;
    id: string;
  };
  enrollmentCount: number;
  instructor: Instructor;
  modules: Module[];
  level: CourseLevel;
  duration: number;
  tags: string[];
  whatYouWillLearn: string[];
  totalRatings: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  thumbnail: string | null;
  previewVideo: string | null;
  price: number;
  rating: number | null;
  publishedAt: Date | null;
  isEnrolled: boolean;
  enrolledAt: Date | null;
  isFavourite: boolean
}

interface Review {
  id: string;
  learner: {
    id: string;
    name: string;
    profilePic: string | null;
  };
  rating: number;
  reviewText: string | null;
  createdAt: Date;
  isEdited: boolean;
}

interface MyReview {
  id: string;
  rating: number;
  reviewText: string | null;
  createdAt: Date;
  isEdited: boolean;
}


const CourseOverviewPage = () => {
  const { id } = useSelector((state: RootState) => state.auth);
  const { courseId } = useParams<{ courseId: string }>();
  console.log(courseId);
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set([0]));
  const [showPreview, setShowPreview] = useState(false);



  const [course, setCourse] = useState<Course | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [myReview, setMyReview] = useState<MyReview | null>(null)
  const [myRating, setMyRating] = useState(0);
  const [myReviewText, setMyReviewText] = useState('');
  const [loading, setLoading] = useState(true);
  const [isEditingReview, setIsEditingReview] = useState(false);



  useEffect(() => {

    const fetchCourseDetails = async () => {

      try {
        setLoading(true)
        if (!courseId) {
          return
        }
        const response = await dispatch(getCourseDetailsForLearner({
          courseId,
          learnerId: id || null
        })).unwrap();

        console.log(response.data);
        setCourse(response.data)


      } catch (err) {
        toast.error(err as string);
      } finally {
        setLoading(false)
      }
    };

    fetchCourseDetails();

  }, [dispatch, courseId, id]);

  useEffect(() => {

    const fetchReviews = async () => {

      try {
        if (!courseId) {
          return
        }
        const response = await dispatch(getReviewsForLearner({
          courseId,
          skip: reviews.length,
          limit: 10
        })).unwrap();

        if (response.data.myReview) {
          setMyReview(response.data.myReview)
        }
        setReviews(response.data.reviews)

      } catch (err) {
        toast.error(err as string);
      }
    };

    fetchReviews();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, courseId]);


  const handleAddToFavourites = async () => {
    if (!course) return null;

    try {
      const courseId = course.id;
      const result = await dispatch(addToFavourites({
        courseId
      })).unwrap();
      setCourse({ ...course, isFavourite: true });
      toast.success(result.message)
    } catch (error) {
      toast.error(error as string)
    }
  }

  const handleRemoveFromFavourites = async () => {
    if (!course) return null;

    try {
      const courseId = course.id;
      const result = await dispatch(removeFromFavourites({
        courseId
      })).unwrap();
      setCourse({ ...course, isFavourite: false })
      toast.success(result.message)
    } catch (error) {
      toast.error(error as string)
    }
  }
  const startEditReview = () => {
    if (!myReview) return;

    setMyRating(myReview.rating);
    setMyReviewText(myReview.reviewText || '');
    setIsEditingReview(true);
  };

  const handleSubmitReview = async () => {
    if (!course || !myRating) return null;

    try {
      const courseId = course.id;
      const result = await dispatch(submitReview({
        courseId,
        reviewText: myReviewText.trim() || null,
        rating: myRating
      })).unwrap();
      setMyReview(result.data.review)
      toast.success(result.data.message)
    } catch (error) {
      toast.error(error as string)
    }
  }

  const handleUpdateReview = async () => {
    if (!course || !myRating || !myReview) return;

    try {
      const result = await dispatch(updateReview({
        courseId: course.id,
        reviewText: myReviewText.trim() || null,
        rating: myRating
      })).unwrap();

      setMyReview(result.data.review);
      setIsEditingReview(false);
      setMyRating(0);
      setMyReviewText('');
      toast.success(result.data.message);
    } catch (error) {
      toast.error(error as string);
    }
  };


  const handleCancelEnrollment= async()=>{
    if (!course) return null;

    try {
      const courseId = course.id;
      await dispatch(cancelEnrollment({
        courseId
      })).unwrap();
      setCourse({ ...course, isEnrolled: false, enrolledAt:null });
      toast.success("Enrollment cancelled successfully.")
    } catch (error) {
      toast.error(error as string)
    }
  }


  const toggleModule = (index: number) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedModules(newExpanded);
  };



  const getLevelColor = (level: CourseLevel) => {
    switch (level) {
      case 'beginner':
        return 'bg-blue-100 text-blue-800';
      case 'intermediate':
        return 'bg-purple-100 text-purple-800';
      case 'advanced':
        return 'bg-orange-100 text-orange-800';
    }
  };


  const formatDate = (date: Date | null) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getTotalChapters = () => {
    if (!course) return null;

    return course.modules.reduce((total, module) => total + module.chapters.length, 0);
  };

  const canCancelEnrollment = (enrolledAt: Date | null) => {
    if (!enrolledAt) return false;

    const now = new Date();
    const enrolledDate = new Date(enrolledAt);

    const diffMs = now.getTime() - enrolledDate.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    return diffDays <= 7; // within 7 days
  };


  if (loading) return <CourseOverviewSkeleton />
  if (!course) return null;


  return (


    <div className="min-h-screen bg-gray-50">
      <LearnerNav />
      {/* Hero Section with Thumbnail */}
      <div className="relative bg-gray-900 text-white">
        {/* {course.thumbnail && (
          <div className="absolute inset-0 opacity-30">
            <img 
              src={course.thumbnail} 
              alt={course.title}
              className="w-full h-full object-cover"
            />
          </div>
        )} */}

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Course Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(course.level)}`}>
                  {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                </span>

              </div>

              <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
              <Link to={`/instructor/${course.instructor.id}`} className="flex items-center gap-3 mb-6">
                <img
                  src={course.instructor.profilePic || "/images/default-profile.jpg"}
                  alt={course.instructor.name}
                  className="w-10 h-10 rounded-full border border-teal-300 object-cover"
                />
                <span className="font-semibold text-lg text-white">{course.instructor.name}</span>
              </Link>
              <p className="text-xl text-gray-300 mb-6">{course.description}</p>

              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 mr-1" />
                  <span className="font-semibold mr-1">{course.rating?.toFixed(1) || 'N/A'}</span>
                  <span className="text-gray-300">({course.totalRatings} ratings)</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Users className="w-5 h-5 mr-1" />
                  <span>{course.enrollmentCount.toLocaleString()} students enrolled</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Clock className="w-5 h-5 mr-1" />
                  <span>{formatDuration(course.duration)} </span>
                </div>
              </div>

              <div className="mt-6 flex items-center text-gray-300 text-sm">
                <Calendar className="w-4 h-4 mr-2" />
                {course.publishedAt && (
                  <>
                    <span className="mx-2">•</span>
                    <span>Published {formatDate(course.publishedAt)}</span>
                  </>
                )}
              </div>
            </div>

            {/* Right: Preview Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg overflow-hidden shadow-xl">
                {course.previewVideo && (
                  <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="relative aspect-video">
                      <video
                        controls={showPreview}
                        poster={course.thumbnail || undefined}
                        className="w-full h-full object-cover"
                      >
                        {showPreview && <source src={course.previewVideo} type="video/mp4" />}
                      </video>

                      {!showPreview && (
                        <div
                          onClick={() => setShowPreview(true)}
                          className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 cursor-pointer transition hover:bg-black/60"
                        >
                          <PlayCircle className="w-16 h-16 text-white mb-2" />
                          <span className="text-white font-medium">Preview Video</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="p-6">
                  {course.isEnrolled ? (
                    <>
                      {/* Already Enrolled UI */}
                      <div className="text-green-600 font-semibold mb-2">
                        ✔ Enrolled on {course.enrolledAt ? formatDate(course.enrolledAt) : "N/A"}
                      </div>

                      <button
                        onClick={() => navigate(`/learner/courses/${course.id}/learn`)}
                        className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors mb-3"
                      >
                        Continue Learning
                      </button>

                      {canCancelEnrollment(course.enrolledAt) && (
                        <button
                          onClick={handleCancelEnrollment}
                          className="w-full border-2 border-red-500 text-red-500 py-3 rounded-lg font-semibold hover:bg-red-50 transition-colors mb-3"
                        >
                          Cancel Enrollment
                        </button>
                      )}

                      <button
                        onClick={() => navigate('/learner/dashboard')}
                        className="w-full border-2 border-teal-600 text-teal-600 py-3 rounded-lg font-semibold hover:bg-teal-50 transition-colors"
                      >
                        Go to Dashboard
                      </button>
                    </>
                  ) : (
                    <>
                      {/* Not Enrolled UI */}
                      <div className="text-3xl font-bold text-gray-900 mb-4">
                        ₹{course.price}
                      </div>

                      <button
                        onClick={() => navigate(`/learner/checkout/${course.id}`)}
                        className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors mb-3"
                      >
                        Enroll Now
                      </button>
                      {course.isFavourite ? (
                        <button className="w-full border-2 border-gray-400 text-gray-400 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                          onClick={handleRemoveFromFavourites}
                        >
                          Remove from Favourites
                        </button>
                      ) : (

                        <button className="w-full border-2 border-teal-600 text-teal-600 py-3 rounded-lg font-semibold hover:bg-teal-50 transition-colors"
                          onClick={handleAddToFavourites}
                        >
                          Add to Favourites
                        </button>
                      )}
                    </>
                  )}


                  <div className="mt-6 space-y-3 text-sm text-gray-600">
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      <span>Lifetime access</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      <span>Certificate of completion</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      <span>24-hour money-back guarantee</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* What You'll Learn */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">What You'll Learn</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {course.whatYouWillLearn.map((item, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>



            {/* Prerequisites */}
            {course.prerequisites.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Prerequisites</h2>
                <ul className="space-y-2">
                  {course.prerequisites.map((prereq, index) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <Award className="w-5 h-5 text-teal-600 mr-2" />
                      {prereq}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Course Content */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Course Content</h2>
                <div className="text-sm text-gray-600">
                  {course.modules.length} modules • {getTotalChapters()} chapters • {formatDuration(course.duration)}
                </div>
              </div>

              <div className="space-y-3">
                {course.modules.map((module, moduleIndex) => (
                  <div key={moduleIndex} className="border border-gray-200 rounded-lg">
                    <button
                      onClick={() => toggleModule(moduleIndex)}
                      className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {expandedModules.has(moduleIndex) ? (
                          <ChevronUp className="w-5 h-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-500" />
                        )}
                        <div className="text-left">
                          <h3 className="font-semibold text-gray-900">
                            Module {moduleIndex + 1}: {module.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {formatDuration(module.duration)}
                      </div>
                    </button>

                    {expandedModules.has(moduleIndex) && (
                      <div className="border-t border-gray-200 bg-gray-50">
                        {module.chapters.map((chapter, chapterIndex) => (
                          <div key={chapterIndex} className="border-b border-gray-200 last:border-b-0">
                            <div className="p-4 pl-12">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <PlayCircle className="w-4 h-4 text-teal-600" />
                                    <h4 className="font-medium text-gray-900">
                                      {chapterIndex + 1}. {chapter.title}
                                    </h4>
                                  </div>
                                  <p className="text-sm text-gray-600 ml-6">{chapter.description}</p>


                                </div>
                                <div className="text-sm text-gray-600 ml-4">
                                  {formatDuration(chapter.duration)}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow">
              <h2 className="text-2xl font-bold mb-6">Reviews</h2>

              {/* Rating Distribution */}
              {[5, 4, 3, 2, 1].map((star) => {
                const count = course.ratingDistribution[star as 1 | 2 | 3 | 4 | 5];
                const percent =
                  course.totalRatings > 0
                    ? (count / course.totalRatings) * 100
                    : 0;

                return (
                  <div key={star} className="flex items-center mb-2">
                    <span className="w-10">{star} ★</span>
                    <div className="flex-1 bg-gray-200 h-2 rounded mx-2">
                      <div
                        className="bg-yellow-400 h-2 rounded"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className="w-10 text-right">{count}</span>
                  </div>
                );
              })}

              {/* Reviews List */}
              <div className="mt-6 space-y-6">
                {reviews.length === 0 && (
                  <p className="text-gray-500">No reviews yet.</p>
                )}

                {reviews.map((review) => (
                  <div key={review.id} className="border-b pb-4">
                    <div className="flex items-center gap-3 mb-1">
                      <img
                        src={review.learner.profilePic || '/images/default-profile.jpg'}
                        className="w-8 h-8 rounded-full"
                      />
                      <span className="font-semibold">
                        {review.learner.name}
                      </span>
                      {review.isEdited && (
                        <span className="text-xs text-gray-500">(edited)</span>
                      )}
                    </div>

                    <div className="flex mb-2">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-4 h-4 ${s <= review.rating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                            }`}
                        />
                      ))}
                    </div>

                    {review.reviewText && (
                      <p className="text-gray-700">{review.reviewText}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* ADD REVIEW */}
            {course.isEnrolled && (!myReview || isEditingReview) && (
              <div className="bg-white rounded-lg p-6 shadow">
                <h3 className="text-xl font-semibold mb-4">
                  {isEditingReview ? 'Edit your review' : 'Leave a review'}
                </h3>

                <div className="flex gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      onClick={() => setMyRating(s)}
                      className={`w-6 h-6 cursor-pointer ${s <= myRating
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                        }`}
                    />
                  ))}
                </div>

                <textarea
                  value={myReviewText}
                  onChange={(e) => setMyReviewText(e.target.value)}
                  className="w-full border rounded-lg p-3 mb-4"
                  rows={4}
                  placeholder="Share your experience (optional)"
                />

                <div className="flex gap-3">
                  <button
                    onClick={isEditingReview ? handleUpdateReview : handleSubmitReview}
                    disabled={myRating === 0}
                    className="bg-teal-600 text-white px-6 py-2 rounded hover:bg-teal-700 disabled:opacity-50"
                  >
                    {isEditingReview ? 'Update review' : 'Submit review'}
                  </button>

                  {isEditingReview && (
                    <button
                      onClick={() => setIsEditingReview(false)}
                      className="border px-6 py-2 rounded hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            )}


            {myReview && !isEditingReview && (
              <div className="bg-white rounded-lg p-6 shadow border border-teal-200">
                <h3 className="text-xl font-semibold mb-3">Your Review</h3>

                <div className="flex items-center gap-2 mb-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-5 h-5 ${s <= myReview.rating
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                        }`}
                    />
                  ))}
                  {myReview.isEdited && (
                    <span className="text-sm text-gray-500">(edited)</span>
                  )}
                </div>

                {myReview.reviewText && (
                  <p className="text-gray-700 mb-3">{myReview.reviewText}</p>
                )}

                <button
                  onClick={startEditReview}
                  className="text-teal-600 text-sm font-medium hover:underline"
                >
                  Edit review
                </button>
              </div>
            )}




            {/* Tags */}
            {course.tags.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {course.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* Quick Stats */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Course Statistics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      Enrolled
                    </span>
                    <span className="font-semibold text-gray-900">
                      {course.enrollmentCount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 flex items-center">
                      <Star className="w-4 h-4 mr-2" />
                      Ratings
                    </span>
                    <span className="font-semibold text-gray-900">
                      {course.totalRatings}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 flex items-center">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Modules
                    </span>
                    <span className="font-semibold text-gray-900">
                      {course.modules.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 flex items-center">
                      <PlayCircle className="w-4 h-4 mr-2" />
                      Chapters
                    </span>
                    <span className="font-semibold text-gray-900">
                      {getTotalChapters()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      Duration
                    </span>
                    <span className="font-semibold text-gray-900">
                      {formatDuration(course.duration)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Course Details */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Course Details</h3>
                <div className="space-y-3 text-sm">

                  <div>
                    <span className="text-gray-600">Category:</span>
                    <p className="text-gray-900 mt-1">{course.category.name}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Instructor:</span>
                    <p className="font-mono text-gray-900 mt-1">{course.instructor.name}</p>
                  </div>
                  {/* <div>
                    <span className="text-gray-600">Status:</span>
                    <p className="text-gray-900 mt-1 flex items-center">
                      {course.isActive ? (
                        <><CheckCircle className="w-4 h-4 text-green-500 mr-1" /> Active</>
                      ) : (
                        <><span className="w-4 h-4 mr-1">•</span> Inactive</>
                      )}
                    </p>
                  </div> */}

                </div>
              </div>

              {/* Action Buttons (for instructors) */}
              {/* <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Instructor Actions</h3>
                <div className="space-y-2">
                  <Link
                    to={`/instructor/courses/${course.id}/edit`}
                    className="flex items-center justify-center w-full px-4 py-2 bg-teal-50 text-teal-700 rounded-lg hover:bg-teal-100 transition-colors"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Course
                  </Link>
                  <Link
                    to={`/instructor/courses/${course.id}/analytics`}
                    className="flex items-center justify-center w-full px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Analytics
                  </Link>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseOverviewPage;
