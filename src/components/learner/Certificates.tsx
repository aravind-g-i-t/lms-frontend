import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Award, Download, Eye, Calendar, ExternalLink } from 'lucide-react';
import { toast } from 'react-toastify';
import type { AppDispatch } from '../../redux/store';
import { getLearnerCertificates } from '../../services/learnerServices';

interface Certificate {
  id: string;
  learnerId: string;
  courseId: string;
  enrollmentId: string;
  quizAttemptId: string;
  certificateNumber: string;
  issuedAt: Date;
  certificateUrl: string;
  grade: number | null;
  courseTitle: string;
  learnerName: string;
  instructorName: string;
}

const Certificates = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const limit = 2;

  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        setLoading(true);

        const response = await dispatch(getLearnerCertificates({ page, limit })).unwrap();
        console.log(response);
        
        setCertificates(response.certificates);
        setTotalPages(response.totalPages);
      } catch (err) {
        toast.error(err as string);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, [dispatch, page]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="text-center py-12 text-gray-500">
        Loading certificates...
      </div>
    );
  }

  if (certificates.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
        <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Certificates Yet</h3>
        <p className="text-gray-500">
          Complete courses to earn certificates and showcase your achievements!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-4">
          <Award className="w-12 h-12" />
          <div>
            <h2 className="text-2xl font-bold">
              {certificates.length} Certificate{certificates.length !== 1 ? 's' : ''} Earned
            </h2>
            <p className="text-teal-100">Showcase your achievements to employers</p>
          </div>
        </div>
      </div>

      {/* Certificates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {certificates.map((cert) => (
          <div
            key={cert.id}
            className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 border-b border-amber-200">
              <div className="flex items-center justify-center">
                <Award className="w-16 h-16 text-amber-500" />
              </div>
            </div>

            <div className="p-6">
              <h3 className="font-semibold text-gray-900 mb-1">{cert.courseTitle}</h3>
              <p className="text-sm text-gray-500 mb-3">by {cert.instructorName}</p>

              <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                <Calendar className="w-3 h-3" />
                <span>Issued: {formatDate(cert.issuedAt)}</span>
              </div>

              <div className="text-xs text-gray-400 mb-4 font-mono">
                Certificate ID: {cert.certificateNumber}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <a
                  href={cert.certificateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 text-sm"
                >
                  <Eye className="w-4 h-4" /> View
                </a>

                <a
                  href={cert.certificateUrl}
                  download
                  className="flex-1 flex items-center justify-center gap-2 border border-teal-600 text-teal-600 py-2 rounded-lg hover:bg-teal-50 text-sm"
                >
                  <Download className="w-4 h-4" /> Download
                </a>

                <button
                  className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                  title="Share"
                >
                  <ExternalLink className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages  && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 rounded ${
                page === i + 1 ? "bg-teal-600 text-white" : "bg-gray-200 text-gray-700"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Certificates;
