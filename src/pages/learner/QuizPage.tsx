import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ChevronLeft, ChevronRight, Clock, CheckCircle2, XCircle } from "lucide-react";
import type { AppDispatch } from "../../redux/store";
import { getQuizForLearner, submitQuizAttempt } from "../../services/learnerServices";
import { QuizSkeleton } from "../../components/learner/QuizSkeleton";
import { useFeedback } from "../../hooks/useFeedback";


interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer?: number;
  points: number;
  explanation?: string | null;
  order: number;
}

interface Quiz {
  id: string;
  courseId: string;
  passingScore: number | null;
  timeLimitMinutes: number | null;
  questions: QuizQuestion[];
  totalPoints: number;
  totalQuestions: number;
  createdAt: Date;
  updatedAt: Date;
}

export type QuizAttemptStatus = "in_progress" | "passed" | "failed" | "abandoned";

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
  const feedback = useFeedback();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // answers map: questionId -> selectedOption index | null
  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const [submitted, setSubmitted] = useState<boolean>(false);
  const [result, setResult] = useState<QuizAttempt | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Track which review question is expanded
  const [reviewIndex, setReviewIndex] = useState<number>(0);

  useEffect(() => {
    const load = async () => {
      try {
        if (!courseId) throw new Error("Missing courseId");
        setLoading(true);

        const res = await dispatch(getQuizForLearner({ courseId })).unwrap();
        const q: Quiz = res.data.quiz;

        const init: Record<string, number | null> = {};
        q.questions.forEach((qq: QuizQuestion) => {
          init[qq.id] = null;
        });

        setQuiz(q);
        setAnswers(init);
      } catch (err) {
        feedback.error("Failed to load quiz", err as string);
        navigate(`/learner/courses/${courseId}/learn`);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [courseId, dispatch, navigate, feedback]);

  const current = quiz?.questions[currentIndex] ?? null;

  // Progress: count of questions that have been answered (not null)
  const answeredCount = Object.values(answers).filter((v) => v !== null).length;

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

      const attempt: QuizAttempt = res.data.quizAttempt;
      // questions now include correctAnswer and explanation
      const questions: QuizQuestion[] = res.data.questions;

      setResult(attempt);
      setQuiz((prev) => (prev ? { ...prev, questions } : prev));
      setSubmitted(true);
      setReviewIndex(0);
    } catch (err) {
      feedback.error("Failed to submit quiz", err as string);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <QuizSkeleton />;

  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        Quiz not found
      </div>
    );
  }

  // ── RESULT SUMMARY ───────────────────────────────────────────────────────────
  if (submitted && result) {
    const passed = result.status === "passed";
    const reviewQuestion = quiz.questions[reviewIndex];

    // Build a map of questionId -> QuizAnswer for fast lookup
    const answerMap: Record<string, QuizAnswer> = {};
    result.answers.forEach((a) => {
      answerMap[a.questionId] = a;
    });

    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col">
        {/* Summary card */}
        <div className="bg-gray-800 border-b border-gray-700 px-4 py-6 flex flex-col items-center gap-2">
          {passed ? (
            <CheckCircle2 className="w-12 h-12 text-teal-500" />
          ) : (
            <XCircle className="w-12 h-12 text-red-500" />
          )}
          <h1 className="text-xl font-semibold">
            {passed ? "Congratulations!" : "Quiz Completed"}
          </h1>
          <div className="flex gap-6 mt-1 text-sm text-gray-400">
            <span>
              Score:{" "}
              <span className={passed ? "text-teal-400" : "text-red-400"}>
                {result.score ?? 0}
              </span>{" "}
              / {result.maxScore}
            </span>
            <span>
              Correct: {result.correctAnswers ?? 0} / {result.totalQuestions}
            </span>
            <span>{result.percentage ?? 0}%</span>
          </div>
        </div>

        {/* Per-question review */}
        <div className="flex flex-1 overflow-hidden">
          {/* Question list sidebar */}
          <aside className="hidden sm:flex flex-col w-56 bg-gray-800 border-r border-gray-700 overflow-y-auto shrink-0">
            {quiz.questions.map((q, i) => {
              const ans = answerMap[q.id];
              const isCorrect = ans?.isCorrect;
              return (
                <button
                  key={q.id}
                  onClick={() => setReviewIndex(i)}
                  className={`flex items-center gap-3 px-4 py-3 text-sm text-left border-b border-gray-700 transition-colors
                    ${reviewIndex === i ? "bg-gray-700" : "hover:bg-gray-750"}`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold shrink-0
                      ${isCorrect === true
                        ? "bg-teal-600 text-white"
                        : isCorrect === false
                        ? "bg-red-600 text-white"
                        : "bg-gray-600 text-gray-300"
                      }`}
                  >
                    {i + 1}
                  </span>
                  <span className="truncate text-gray-300">Q{i + 1}</span>
                </button>
              );
            })}
          </aside>

          {/* Review detail */}
          <main className="flex-1 overflow-y-auto p-6 max-w-3xl mx-auto w-full">
            {/* Mobile question tabs */}
            <div className="flex sm:hidden gap-1 overflow-x-auto pb-2 mb-4">
              {quiz.questions.map((q, i) => {
                const ans = answerMap[q.id];
                return (
                  <button
                    key={q.id}
                    onClick={() => setReviewIndex(i)}
                    className={`px-3 py-1 rounded text-xs font-medium shrink-0 transition-colors
                      ${reviewIndex === i ? "bg-gray-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}
                      ${ans?.isCorrect === true ? "ring-1 ring-teal-500" : ans?.isCorrect === false ? "ring-1 ring-red-500" : ""}`}
                  >
                    Q{i + 1}
                  </button>
                );
              })}
            </div>

            {reviewQuestion && (() => {
              const ans = answerMap[reviewQuestion.id];
              const selectedOption = answers[reviewQuestion.id] ?? ans?.selectedOption ?? null;
              const correctAnswer = reviewQuestion.correctAnswer;

              return (
                <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="text-lg font-semibold">{reviewQuestion.question}</h2>
                    {ans?.isCorrect === true ? (
                      <CheckCircle2 className="w-6 h-6 text-teal-500 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
                    )}
                  </div>

                  <div className="space-y-2">
                    {reviewQuestion.options.map((opt, idx) => {
                      const isSelected = selectedOption === idx;
                      const isCorrect = correctAnswer === idx;

                      let className =
                        "w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors ";

                      if (isCorrect) {
                        className += "bg-teal-900/40 border-teal-500 text-teal-200";
                      } else if (isSelected && !isCorrect) {
                        className += "bg-red-900/40 border-red-500 text-red-200";
                      } else {
                        className += "bg-gray-750 border-gray-600 text-gray-400";
                      }

                      return (
                        <div key={idx} className={className}>
                          <span className="flex items-center gap-2">
                            {isCorrect && (
                              <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                            )}
                            {isSelected && !isCorrect && (
                              <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                            )}
                            {!isCorrect && !isSelected && (
                              <span className="w-4 h-4 shrink-0" />
                            )}
                            {opt}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {reviewQuestion.explanation && (
                    <div className="bg-gray-700/50 rounded-lg px-4 py-3 text-sm text-gray-300 border border-gray-600">
                      <span className="text-gray-400 font-medium">Explanation: </span>
                      {reviewQuestion.explanation}
                    </div>
                  )}

                  {selectedOption === null && (
                    <p className="text-xs text-gray-500 italic">This question was not answered.</p>
                  )}
                </div>
              );
            })()}

            {/* Review navigation */}
            <div className="flex items-center justify-between mt-4">
              <button
                onClick={() => setReviewIndex((i) => Math.max(0, i - 1))}
                disabled={reviewIndex === 0}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-40 text-sm"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              <span className="text-gray-500 text-xs">
                {reviewIndex + 1} / {quiz.totalQuestions}
              </span>

              {reviewIndex < quiz.totalQuestions - 1 ? (
                <button
                  onClick={() => setReviewIndex((i) => Math.min(quiz.totalQuestions - 1, i + 1))}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 text-sm"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => navigate(`/learner/courses/${courseId}/learn`)}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium"
                >
                  Back to Course
                </button>
              )}
            </div>
          </main>
        </div>
      </div>
    );
  }

  // ── QUIZ VIEW ────────────────────────────────────────────────────────────────
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

      {/* Progress bar — based on answered count, not current index */}
      <div className="w-full bg-gray-800 border-b border-gray-700">
        <div className="w-full h-2 bg-gray-700">
          <div
            className="h-full bg-teal-500 transition-all"
            style={{
              width: `${(answeredCount / quiz.totalQuestions) * 100}%`,
            }}
          />
        </div>
        <p className="text-gray-400 text-xs px-4 py-1">
          {answeredCount} of {quiz.totalQuestions} answered
        </p>
      </div>

      {/* Question */}
      <main className="flex-1 overflow-y-auto p-6 max-w-3xl mx-auto w-full">
        {/* Mini dot navigator */}
        <div className="flex gap-1.5 mb-5 flex-wrap">
          {quiz.questions.map((q, i) => (
            <button
              key={q.id}
              onClick={() => setCurrentIndex(i)}
              className={`w-7 h-7 rounded text-xs font-medium transition-colors
                ${i === currentIndex
                  ? "bg-teal-600 text-white"
                  : answers[q.id] !== null
                  ? "bg-teal-900/60 text-teal-300 border border-teal-700"
                  : "bg-gray-700 text-gray-400 hover:bg-gray-600"
                }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
          <p className="text-xs text-gray-500 mb-1">Question {currentIndex + 1}</p>
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
                    }`}
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
            {submitting ? "Submitting..." : "Submit Quiz"}{" "}
            <CheckCircle2 className="w-4 h-4" />
          </button>
        )}
      </footer>
    </div>
  );
};

export default QuizPage;