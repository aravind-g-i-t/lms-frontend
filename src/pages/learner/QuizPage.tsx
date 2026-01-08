import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ChevronLeft, ChevronRight, Clock, CheckCircle2 } from "lucide-react";
import { toast } from "react-toastify";
import type { AppDispatch } from "../../redux/store";
import { getQuizForLearner, submitQuizAttempt } from "../../services/learnerServices";
import { QuizSkeleton } from "../../components/learner/QuizSkeleton";


interface QuizQuestion {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number; 
    points: number;
    explanation: string|null; 
    order: number;
}

interface Quiz {
    id: string;
    courseId: string; 
    passingScore: number|null;
    timeLimitMinutes: number | null;
    questions: QuizQuestion[];
    totalPoints: number;
    totalQuestions: number;
    createdAt: Date;
    updatedAt: Date;
}

export type QuizAttemptStatus="in_progress"|"passed"| "failed"|"abandoned"


export interface QuizAttempt {
    id: string;
    quizId: string;
    learnerId: string;
    courseId: string;
    status: QuizAttemptStatus;
    startedAt: Date;
    submittedAt: Date | null;
    score: number | null; 
    maxScore: number; 
    percentage: number | null;
    timeTakenSeconds: number | null;
    correctAnswers: number | null; 
    totalQuestions: number;
    answers: QuizAnswer[];
    createdAt: Date;
}

export interface QuizAnswer {
    questionId: string;
    selectedOption: number | null;
    isCorrect: boolean | null;
    pointsEarned: number;
}

const QuizPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // answers map: questionId -> selectedOption index | null
  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const [submitted, setSubmitted] = useState<boolean>(false);
  const [result, setResult] = useState<QuizAttempt | null>(null);
  const [submitting, setSubmitting] = useState(false);


//   const [startTimeMs, setStartTimeMs] = useState<number>(0);

  useEffect(() => {
    const load = async () => {
      try {
        if (!courseId) throw new Error("Missing courseId");
        setLoading(true);

        const res = await dispatch(getQuizForLearner({ courseId })).unwrap();
        const q: Quiz = res.quiz;

        const init: Record<string, number | null> = {};
        q.questions.forEach((qq: QuizQuestion) => {
          init[qq.id] = null;
        });

        setQuiz(q);
        setAnswers(init);
        // setStartTimeMs(Date.now());
      } catch  {
        toast.error("Failed to load quiz");
        navigate(`/learner/courses/${courseId}/learn`);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [courseId, dispatch, navigate]);

  const current = quiz?.questions[currentIndex] ?? null;

  const chooseOption = (idx: number) => {
    if (!current) return;
    setAnswers((prev) => ({ ...prev, [current.id]: idx }));
  };

  const next = () => {
    if (!quiz) return;
    if (currentIndex < quiz.questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    }
  };

  const prev = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };

  const submit = async () => {
    if (!quiz || !courseId) return;

    // const timeTakenSeconds = Math.floor((Date.now() - startTimeMs) / 1000);

    
    const answersPayload: Array<{ questionId: string; selectedOption: number | null }> =
      Object.entries(answers).map(([questionId, selectedOption]) => ({
        questionId,
        selectedOption,
      }));

    const payload = {
      quizId: quiz.id,
      courseId,
      answers: answersPayload,
    };

    try {
      if (submitting) return;
  setSubmitting(true);
      const res = await dispatch(submitQuizAttempt(payload)).unwrap();
      
      console.log("result:",res);
      
      const attempt: QuizAttempt = res.quizAttempt;
      setResult(attempt);
     
      setSubmitted(true);
    } catch (err) {
      toast.error(err as string);
    }finally{
      setSubmitting(false)
    }
  };

  if (loading) return <QuizSkeleton/>

  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        Quiz not found
      </div>
    );
  }

  // RESULT view (uses fields from QuizAttempt)
  if (submitted && result) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-4">
        <div className="bg-gray-800 max-w-lg w-full p-8 rounded-xl shadow-lg text-center border border-gray-700">
          {result.status==="passed" ? (
            <CheckCircle2 className="w-14 h-14 text-teal-500 mx-auto mb-3" />
          ) : (
            <CheckCircle2 className="w-14 h-14 text-red-500 mx-auto mb-3 rotate-180" />
          )}

          <h1 className="text-2xl font-semibold text-white mb-2">
            {result.status==="passed" ? "Congratulations!" : "Quiz Completed"}
          </h1>

          <p className="text-gray-400 mb-3">
            Score: <span className="text-teal-400">{result.score ?? 0}</span> /{" "}
            {result.maxScore}
          </p>

          <p className="text-gray-400 mb-3">
            Correct: {result.correctAnswers ?? 0} / {result.totalQuestions}
          </p>

          <p className="text-gray-400 mb-3">Percentage: {result.percentage ?? 0}%</p>

          <p className="text-gray-400 mb-6">
            Time Taken: {result.timeTakenSeconds ?? 0}s
          </p>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => navigate(`/learner/courses/${courseId}/learn`)}
              className="px-6 py-3 bg-teal-600 hover:bg-teal-700 rounded-lg text-white font-medium transition-colors"
            >
              Back to Course
            </button>
            {/* optional: view detailed review if your API returns per-question feedback */}
          </div>
        </div>
      </div>
    );
  }

  // QUIZ view
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between sticky top-0 z-20">
        <button
          onClick={() => navigate(`/learner/course/${courseId}`)}
          className="text-gray-300 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <h1 className="text-lg font-semibold">Final Quiz</h1>

        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <Clock className="w-4 h-4" />
          {quiz.timeLimitMinutes ? `${quiz.timeLimitMinutes} mins` : "No time limit"}
        </div>
      </header>

      {/* Progress bar */}
      <div className="w-full bg-gray-800 border-b border-gray-700">
        <div className="w-full h-2 bg-gray-700">
          <div
            className="h-full bg-teal-500 transition-all"
            style={{
              width: `${((currentIndex + 1) / quiz.totalQuestions) * 100}%`,
            }}
          />
        </div>
        <p className="text-gray-400 text-xs px-4 py-1">
          Question {currentIndex + 1} of {quiz.totalQuestions}
        </p>
      </div>

      {/* Question */}
      <main className="flex-1 overflow-y-auto p-6 max-w-3xl mx-auto w-full">
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">{current?.question}</h2>

          <div className="space-y-3">
            {current?.options.map((opt: string, idx: number) => {
              const selected = answers[current.id] === idx;

              return (
                <button
                  key={idx}
                  onClick={() => chooseOption(idx)}
                  className={`w-full text-left px-4 py-3 rounded-lg border transition-colors 
                    ${selected
                      ? "bg-teal-600 border-teal-500 text-white"
                      : "bg-gray-750 border-gray-600 hover:bg-gray-700"
                    }
                  `}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      </main>

      {/* Navigation */}
      <footer className="bg-gray-800 border-t border-gray-700 px-4 py-3 flex items-center justify-between">
        <button
          onClick={prev}
          disabled={currentIndex === 0}
          className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-40"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>

        {currentIndex < quiz.totalQuestions - 1 ? (
          <button
            onClick={next}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={submit}
            disabled={submitting}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-semibold"
          >
            Submit Quiz <CheckCircle2 className="w-4 h-4" />
          </button>
        )}
      </footer>
    </div>
  );
};

export default QuizPage;
