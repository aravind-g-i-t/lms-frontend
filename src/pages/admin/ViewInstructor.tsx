import {
  Users,
  Star,
  BookOpen,
  Calendar,
  Globe,
  FileText,
  Mail,
  Briefcase,
  GraduationCap,
  Clock,
  ArrowLeft,
  TrendingUp,
  Award,
  Shield,
  BarChart2,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
  XCircle,
  AlertCircle,
  HelpCircle,
  ToggleLeft,
  ToggleRight,
  MessageSquare,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import type { AppDispatch } from '../../redux/store';
import { formatDuration } from '../../utils/formats';
import { useFeedback } from '../../hooks/useFeedback';
import { getInstructorDetailsForAdmin } from '../../services/adminServices';

type CourseLevel = 'beginner' | 'intermediate' | 'advanced';
type VerificationStatus = 'Not Submitted' | 'Under Review' | 'Verified' | 'Rejected';

export interface Instructor {
  id: string;
  name: string;
  email: string;
  joiningDate: Date;
  expertise: string[];
  designation: string | null;
  profilePic: string | null;
  resume: string | null;
  website: string | null;
  bio: string | null;
  totalStudents: number;
  totalCourses: number;
  averageRating: number | null;
  identityProof: string | null;
  verification: {
    status: VerificationStatus;
    remarks: string | null;
  };
  isActive: boolean;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  enrollmentCount: number;
  instructorId: string;
  level: CourseLevel;
  duration: number;
  totalChapters: number;
  totalModules: number;
  tags: string[];
  thumbnail: string | null;
  price: number;
  rating: number | null;
  publishedAt: Date | null;
}

const LEVEL_META: Record<CourseLevel, { label: string; bg: string; text: string; dot: string }> = {
  beginner:     { label: 'Beginner',     bg: '#e0f2fe', text: '#0369a1', dot: '#38bdf8' },
  intermediate: { label: 'Intermediate', bg: '#f3e8ff', text: '#7c3aed', dot: '#a78bfa' },
  advanced:     { label: 'Advanced',     bg: '#fff7ed', text: '#c2410c', dot: '#fb923c' },
};

const VERIFICATION_META: Record<VerificationStatus, {
  icon: React.ReactNode;
  bigIcon: React.ReactNode;
  bg: string;
  border: string;
  text: string;
  panelBg: string;
  panelBorder: string;
  shadow: string;
}> = {
  'Verified': {
    icon:    <CheckCircle2 className="w-4 h-4" />,
    bigIcon: <CheckCircle2 className="w-6 h-6" />,
    bg: '#d1fae5', border: '#6ee7b7', text: '#065f46',
    panelBg: '#f0fdf4', panelBorder: '#bbf7d0', shadow: '0 4px 24px rgba(16,185,129,0.10)',
  },
  'Under Review': {
    icon:    <AlertCircle className="w-4 h-4" />,
    bigIcon: <AlertCircle className="w-6 h-6" />,
    bg: '#fef3c7', border: '#fcd34d', text: '#92400e',
    panelBg: '#fffbeb', panelBorder: '#fde68a', shadow: '0 4px 24px rgba(245,158,11,0.10)',
  },
  'Rejected': {
    icon:    <XCircle className="w-4 h-4" />,
    bigIcon: <XCircle className="w-6 h-6" />,
    bg: '#fee2e2', border: '#fca5a5', text: '#991b1b',
    panelBg: '#fff1f2', panelBorder: '#fecdd3', shadow: '0 4px 24px rgba(239,68,68,0.10)',
  },
  'Not Submitted': {
    icon:    <HelpCircle className="w-4 h-4" />,
    bigIcon: <HelpCircle className="w-6 h-6" />,
    bg: '#f1f5f9', border: '#cbd5e1', text: '#64748b',
    panelBg: '#f8fafc', panelBorder: '#e2e8f0', shadow: 'none',
  },
};

const AdminViewInstructorPage = () => {
  const { instructorId } = useParams<{ instructorId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const feedback = useFeedback();
  const navigate = useNavigate();

  const [instructor, setInstructor] = useState<Instructor | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState<'all' | CourseLevel>('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (!instructorId) return;
        const response = await dispatch(
          getInstructorDetailsForAdmin({ instructorId })
        ).unwrap();
        setInstructor(response.data.instructor);
        setCourses(response.data.courses);
      } catch (err) {
        feedback.error('Error', err as string);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dispatch, instructorId, feedback]);

  const formatDate = (date: Date | null) =>
    date ? new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

  const filteredCourses = selectedLevel === 'all' ? courses : courses.filter((c) => c.level === selectedLevel);
  const totalRevenue = courses.reduce((sum, c) => sum + c.price * c.enrollmentCount, 0);

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #f0fdfa 0%, #f8fafc 50%, #f0f9ff 100%)' }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;900&family=DM+Mono:wght@400;500&display=swap'); @keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-full border-2 border-transparent"
            style={{ borderTopColor: '#0d9488', animation: 'spin 0.8s linear infinite' }} />
          <p style={{ fontFamily: "'DM Sans', sans-serif", color: '#64748b', fontSize: 13 }}>
            Loading instructor data…
          </p>
        </div>
      </div>
    );
  }

  /* ── Not found ── */
  if (!instructor) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #f0fdfa 0%, #f8fafc 50%, #f0f9ff 100%)' }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;900&family=DM+Mono:wght@400;500&display=swap');`}</style>
        <div className="text-center">
          <p style={{ fontFamily: "'DM Sans', sans-serif", color: '#0f172a', fontSize: 22, fontWeight: 700 }}>
            Instructor not found
          </p>
          <button onClick={() => navigate(-1)} className="mt-4 text-sm"
            style={{ color: '#0d9488', fontFamily: "'DM Sans', sans-serif" }}>
            ← Go back
          </button>
        </div>
      </div>
    );
  }

  const vm = VERIFICATION_META[instructor.verification.status];

  return (
    <div
      className="min-h-screen p-6 md:p-10"
      style={{
        background: 'linear-gradient(135deg, #f0fdfa 0%, #f8fafc 50%, #f0f9ff 100%)',
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        color: '#0f172a',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;900&family=DM+Mono:wght@400;500&display=swap');

        .page-enter { animation: pageEnter 0.5s ease forwards; }
        @keyframes pageEnter { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }

        .stat-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .stat-card:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(13,148,136,0.12); }

        .course-card { transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease; }
        .course-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(13,148,136,0.12); border-color: #0d9488 !important; }

        .filter-btn { transition: background 0.15s ease, color 0.15s ease; }

        .tag-chip { transition: background 0.15s ease, color 0.15s ease; }
        .tag-chip:hover { background: #ccfbf1; color: #0f766e; }

        .back-btn { transition: color 0.15s ease; }
        .back-btn:hover { color: #0d9488; }

        .proof-link { transition: box-shadow 0.15s ease, border-color 0.15s ease; }
        .proof-link:hover { border-color: #0d9488 !important; box-shadow: 0 4px 16px rgba(13,148,136,0.10); }

        .contact-row { transition: background 0.15s ease; }
        .contact-row:hover { background: #f0fdfa; }

        .expertise-tag { transition: background 0.15s ease; }
        .expertise-tag:hover { background: #99f6e4; }
      `}</style>

      <div className="max-w-7xl mx-auto page-enter">

        {/* ── Header ── */}
        <div className="mb-8 flex items-end justify-between flex-wrap gap-4">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="back-btn flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest mb-2"
              style={{ color: '#64748b' }}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Instructors
            </button>
            <div className="flex items-center gap-3 flex-wrap">
              <h1
                className="text-4xl md:text-5xl font-black"
                style={{ color: '#0f172a', letterSpacing: '-1.5px' }}
              >
                {instructor.name}
              </h1>
              {/* Active / Inactive */}
              <span
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
                style={{
                  background: instructor.isActive ? '#d1fae5' : '#f1f5f9',
                  color: instructor.isActive ? '#065f46' : '#64748b',
                  border: `1px solid ${instructor.isActive ? '#6ee7b7' : '#cbd5e1'}`,
                }}
              >
                {instructor.isActive
                  ? <ToggleRight className="w-3.5 h-3.5" />
                  : <ToggleLeft  className="w-3.5 h-3.5" />}
                {instructor.isActive ? 'Active' : 'Blocked'}
              </span>
            </div>
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-xs font-semibold text-teal-500 uppercase tracking-widest">Admin</span>
              <ChevronRight className="w-3 h-3 text-slate-400" />
              <span className="text-xs font-semibold text-teal-500 uppercase tracking-widest">Instructors</span>
              <ChevronRight className="w-3 h-3 text-slate-400" />
              <span className="text-xs text-slate-400">{instructor.name}</span>
            </div>
          </div>
          <span
            className="text-sm font-medium px-3 py-1.5 rounded-full"
            style={{ background: '#ccfbf1', color: '#0f766e' }}
          >
            {formatDate(instructor.joiningDate)} · Joined
          </span>
        </div>

        {/* ══════════════════════════════════════════
            HERO CARD
        ══════════════════════════════════════════ */}
        <div
          className="rounded-2xl p-8 mb-8"
          style={{ background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 4px 24px rgba(0,0,0,0.05)' }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Left: Profile */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <div className="flex items-start gap-6">
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div
                    className="w-28 h-28 rounded-2xl overflow-hidden"
                    style={{ border: '3px solid #ccfbf1', boxShadow: '0 0 0 4px #f0fdfa' }}
                  >
                    <img
                      src={instructor.profilePic || '/images/default-profile.jpg'}
                      alt={instructor.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div
                    className="absolute -bottom-2 -right-2 w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: '#0d9488' }}
                  >
                    <GraduationCap className="w-4 h-4 text-white" />
                  </div>
                </div>

                {/* Name + meta */}
                <div className="flex-1 min-w-0">
                  {instructor.designation && (
                    <div className="flex items-center gap-2 mb-2">
                      <Briefcase className="w-4 h-4 text-teal-500" />
                      <span className="text-base font-medium" style={{ color: '#475569' }}>
                        {instructor.designation}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-4 flex-wrap text-sm" style={{ color: '#64748b' }}>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      Joined {formatDate(instructor.joiningDate)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users className="w-4 h-4" />
                      {instructor.totalStudents.toLocaleString('en-IN')} students
                    </span>
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4" />
                      {instructor.totalCourses} courses
                    </span>
                    {instructor.averageRating && (
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span className="font-semibold text-slate-700">
                          {instructor.averageRating.toFixed(1)}
                        </span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Bio */}
              {instructor.bio && (
                <div
                  className="rounded-xl p-4"
                  style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}
                >
                  <p className="text-sm leading-relaxed" style={{ color: '#475569' }}>{instructor.bio}</p>
                </div>
              )}

              {/* Expertise */}
              {instructor.expertise.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest mb-3 text-slate-400">
                    Expertise
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {instructor.expertise.map((skill, i) => (
                      <span
                        key={i}
                        className="expertise-tag text-xs font-semibold px-3 py-1.5 rounded-full"
                        style={{
                          background: '#ccfbf1',
                          color: '#0f766e',
                          fontFamily: "'DM Mono', monospace",
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Contact */}
            <div className="lg:col-span-1 flex flex-col gap-4">
              <div
                className="rounded-xl p-5"
                style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}
              >
                <p className="text-xs font-semibold uppercase tracking-widest mb-4 text-slate-400">
                  Contact & Links
                </p>
                <div className="space-y-2">
                  <a href={`mailto:${instructor.email}`}
                    className="contact-row flex items-center gap-3 p-2 rounded-lg -mx-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: '#ccfbf1' }}>
                      <Mail className="w-4 h-4 text-teal-600" />
                    </div>
                    <span className="text-sm truncate" style={{ color: '#475569' }}>{instructor.email}</span>
                  </a>

                  {instructor.website && (
                    <a href={instructor.website} target="_blank" rel="noopener noreferrer"
                      className="contact-row flex items-center gap-3 p-2 rounded-lg -mx-2">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: '#ccfbf1' }}>
                        <Globe className="w-4 h-4 text-teal-600" />
                      </div>
                      <span className="text-sm flex items-center gap-1 text-teal-600 font-medium">
                        Website <ExternalLink className="w-3 h-3" />
                      </span>
                    </a>
                  )}

                  {instructor.resume && (
                    <a href={instructor.resume} target="_blank" rel="noopener noreferrer"
                      className="contact-row flex items-center gap-3 p-2 rounded-lg -mx-2">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: '#ccfbf1' }}>
                        <FileText className="w-4 h-4 text-teal-600" />
                      </div>
                      <span className="text-sm flex items-center gap-1 text-teal-600 font-medium">
                        Resume / CV <ExternalLink className="w-3 h-3" />
                      </span>
                    </a>
                  )}
                </div>
              </div>

              {/* KPI mini strip */}
              <div
                className="rounded-xl p-5"
                style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}
              >
                <p className="text-xs font-semibold uppercase tracking-widest mb-4 text-slate-400">
                  At a Glance
                </p>
                <div className="space-y-3">
                  {[
                    { label: 'Total Courses',   value: instructor.totalCourses,                        color: '#0d9488' },
                    { label: 'Total Students',  value: instructor.totalStudents.toLocaleString('en-IN'), color: '#0369a1' },
                    { label: 'Avg. Rating',
                      value: instructor.averageRating
                        ? `★ ${instructor.averageRating.toFixed(2)}`
                        : '—',
                      color: '#d97706'
                    },
                    { label: 'Est. Revenue',
                      value: totalRevenue >= 1_00_000
                        ? `₹${(totalRevenue / 1_00_000).toFixed(1)}L`
                        : `₹${(totalRevenue / 1000).toFixed(0)}K`,
                      color: '#7c3aed'
                    },
                  ].map((row, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">{row.label}</span>
                      <span
                        className="text-sm font-bold"
                        style={{ color: row.color, fontFamily: "'DM Mono', monospace" }}
                      >
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════
            VERIFICATION PANEL
        ══════════════════════════════════════════ */}
        <div
          className="rounded-2xl p-6 mb-8"
          style={{
            background: vm.panelBg,
            border: `1px solid ${vm.panelBorder}`,
            boxShadow: vm.shadow,
          }}
        >
          <div className="flex flex-wrap items-start justify-between gap-6">
            {/* Status */}
            <div className="flex items-start gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: vm.bg, color: vm.text, border: `1px solid ${vm.border}` }}
              >
                {vm.bigIcon}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Shield className="w-4 h-4 text-slate-400" />
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                    KYC Verification
                  </p>
                </div>
                <p
                  className="text-lg font-black mb-1"
                  style={{ color: vm.text, letterSpacing: '-0.3px' }}
                >
                  {instructor.verification.status}
                </p>
                {instructor.verification.remarks && (
                  <div className="flex items-start gap-2 mt-1 max-w-lg">
                    <MessageSquare className="w-3.5 h-3.5 mt-0.5 shrink-0 text-slate-400" />
                    <p className="text-sm" style={{ color: '#475569' }}>
                      <span className="font-semibold text-slate-600">Remarks: </span>
                      {instructor.verification.remarks}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Identity Proof */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3 text-slate-400">
                Identity Proof
              </p>
              {instructor.identityProof ? (
                <a
                  href={instructor.identityProof}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="proof-link flex items-center gap-3 px-4 py-3 rounded-xl"
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    textDecoration: 'none',
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: '#ccfbf1' }}
                  >
                    <FileText className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold" style={{ color: '#0f172a' }}>View Document</p>
                    <p className="text-xs text-slate-400">Identity verification file</p>
                  </div>
                  <ExternalLink className="w-4 h-4 ml-2 shrink-0 text-teal-500" />
                </a>
              ) : (
                <div
                  className="flex items-center gap-3 px-4 py-3 rounded-xl"
                  style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}
                >
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: '#f1f5f9' }}>
                    <FileText className="w-5 h-5 text-slate-300" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-400">No document uploaded</p>
                    <p className="text-xs text-slate-300">Instructor hasn't submitted proof</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════
            KPI STRIP
        ══════════════════════════════════════════ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
          {[
            { icon: <BookOpen className="h-6 w-6" />, label: 'Total Courses',    value: String(instructor.totalCourses),                          color: '#0d9488' },
            { icon: <Users    className="h-6 w-6" />, label: 'Total Students',   value: instructor.totalStudents.toLocaleString('en-IN'),          color: '#0369a1' },
            { icon: <Star     className="h-6 w-6" />, label: 'Avg. Rating',      value: instructor.averageRating?.toFixed(2) ?? '—',              color: '#d97706' },
            {
              icon: <TrendingUp className="h-6 w-6" />,
              label: 'Est. Revenue',
              value: totalRevenue >= 1_00_000
                ? `₹${(totalRevenue / 1_00_000).toFixed(1)}L`
                : `₹${(totalRevenue / 1000).toFixed(0)}K`,
              color: '#7c3aed',
            },
          ].map((kpi, i) => (
            <div
              key={i}
              className="stat-card rounded-2xl p-6"
              style={{ background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
            >
              <div className="flex items-center justify-between mb-3">
                <span style={{ color: kpi.color }}>{kpi.icon}</span>
                <div className="w-2 h-2 rounded-full"
                  style={{ background: kpi.color, boxShadow: `0 0 8px ${kpi.color}66` }} />
              </div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                {kpi.label}
              </p>
              <p
                className="text-3xl font-black"
                style={{ color: kpi.color, letterSpacing: '-1.5px', fontFamily: "'DM Mono', monospace" }}
              >
                {kpi.value}
              </p>
            </div>
          ))}
        </div>

        {/* ══════════════════════════════════════════
            COURSES SECTION
        ══════════════════════════════════════════ */}
        <section
          className="rounded-2xl p-8 mb-8"
          style={{ background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 4px 24px rgba(0,0,0,0.05)' }}
        >
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <BarChart2 className="w-5 h-5 text-teal-500" />
                <h2 className="text-xl font-bold" style={{ color: '#0f172a', letterSpacing: '-0.5px' }}>
                  Course Catalogue
                </h2>
              </div>
              <p className="text-sm text-slate-400">
                {filteredCourses.length} of {courses.length} courses shown
              </p>
            </div>

            {/* Level filter */}
            <div className="flex gap-1 p-1 rounded-xl"
              style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              {(['all', 'beginner', 'intermediate', 'advanced'] as const).map((level) => {
                const active = selectedLevel === level;
                return (
                  <button
                    key={level}
                    onClick={() => setSelectedLevel(level)}
                    className="filter-btn text-xs font-semibold px-4 py-1.5 rounded-lg capitalize"
                    style={{
                      background: active ? '#0d9488' : 'transparent',
                      color: active ? '#ffffff' : '#94a3b8',
                    }}
                  >
                    {level}
                  </button>
                );
              })}
            </div>
          </div>

          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredCourses.map((course) => {
                const lm = LEVEL_META[course.level];
                return (
                  <div
                    key={course.id}
                    onClick={() => navigate(`/admin/courses/${course.id}`)}
                    className="course-card rounded-xl overflow-hidden cursor-pointer"
                    style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-video bg-slate-100">
                      {course.thumbnail ? (
                        <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex items-center justify-center h-full"
                          style={{ background: 'linear-gradient(135deg, #f0fdfa, #e0f2fe)' }}>
                          <BookOpen className="w-12 h-12 text-teal-200" />
                        </div>
                      )}
                      <span className="absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5"
                        style={{ background: lm.bg, color: lm.text }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: lm.dot }} />
                        {lm.label}
                      </span>
                      <span className="absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-lg"
                        style={{
                          background: 'rgba(255,255,255,0.92)',
                          color: '#0f172a',
                          fontFamily: "'DM Mono', monospace",
                          backdropFilter: 'blur(4px)',
                          border: '1px solid #e2e8f0',
                        }}>
                        ₹{course.price.toLocaleString()}
                      </span>
                    </div>

                    {/* Body */}
                    <div className="p-5">
                      <h3 className="font-bold text-base mb-1 line-clamp-2"
                        style={{ color: '#0f172a', letterSpacing: '-0.3px' }}>
                        {course.title}
                      </h3>
                      <p className="text-xs mb-4 line-clamp-2 leading-relaxed text-slate-500">
                        {course.description}
                      </p>

                      {/* Mini stats */}
                      <div className="grid grid-cols-3 gap-2 mb-4 py-3 rounded-lg"
                        style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                        {[
                          { icon: <Users className="w-3.5 h-3.5" />, val: course.enrollmentCount.toLocaleString('en-IN') },
                          { icon: <Clock className="w-3.5 h-3.5" />, val: formatDuration(course.duration) },
                          { icon: <Award className="w-3.5 h-3.5" />, val: course.rating?.toFixed(1) ?? '—' },
                        ].map((s, i) => (
                          <div key={i} className="flex flex-col items-center gap-1">
                            <span className="text-slate-400">{s.icon}</span>
                            <span className="text-xs font-bold text-slate-600"
                              style={{ fontFamily: "'DM Mono', monospace" }}>
                              {s.val}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>{course.totalModules} modules · {course.totalChapters} chapters</span>
                        {course.publishedAt && (
                          <span style={{ fontFamily: "'DM Mono', monospace" }}>
                            {formatDate(course.publishedAt)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-16 text-center">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-slate-200" />
              <p className="font-semibold text-slate-400">
                {selectedLevel === 'all' ? 'No courses published yet.' : `No ${selectedLevel} courses.`}
              </p>
            </div>
          )}
        </section>

        {/* ══════════════════════════════════════════
            TOPIC CLOUD
        ══════════════════════════════════════════ */}
        {courses.length > 0 && (
          <section
            className="rounded-2xl p-6"
            style={{ background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 4px 24px rgba(0,0,0,0.05)' }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest mb-4 text-slate-400">
              All Topics Covered
            </p>
            <div className="flex flex-wrap gap-2">
              {Array.from(new Set(courses.flatMap((c) => c.tags))).map((tag, i) => (
                <span
                  key={i}
                  className="tag-chip text-xs font-semibold px-3 py-1.5 rounded-full cursor-pointer"
                  style={{
                    background: '#f1f5f9',
                    color: '#64748b',
                    fontFamily: "'DM Mono', monospace",
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
};

export default AdminViewInstructorPage;