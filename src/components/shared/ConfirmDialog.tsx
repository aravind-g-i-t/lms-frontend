import { X, AlertTriangle, CheckCircle } from "lucide-react";
import type { ReactNode } from "react";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  icon?: ReactNode;
};

export const ConfirmDialog = ({
  open,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  destructive = false,
  loading = false,
  onConfirm,
  onCancel,
  icon,
}: ConfirmDialogProps) => {
  if (!open) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@400;500;600&display=swap');

        @keyframes backdropIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes dialogIn {
          from {
            opacity: 0;
            transform: translateY(16px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .confirm-dialog-backdrop {
          animation: backdropIn 0.2s ease forwards;
        }

        .confirm-dialog-card {
          animation: dialogIn 0.25s cubic-bezier(0.34, 1.2, 0.64, 1) forwards;
          font-family: 'DM Sans', sans-serif;
        }

        .confirm-dialog-title {
          font-family: 'Instrument Serif', serif;
        }

        .confirm-btn-shimmer::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.18) 50%, transparent 60%);
          animation: shimmer 1.8s ease infinite;
        }

        .confirm-cancel-btn:hover {
          background: rgba(0,0,0,0.04);
        }

        .confirm-spinner {
          display: inline-block;
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          vertical-align: middle;
          margin-right: 8px;
        }

        .confirm-icon-badge {
          transition: transform 0.2s ease;
        }

        .confirm-dialog-card:hover .confirm-icon-badge {
          transform: scale(1.08) rotate(-4deg);
        }
      `}</style>

      {/* Backdrop */}
      <div
        className="confirm-dialog-backdrop"
        onClick={onCancel}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
          background: "rgba(10, 8, 20, 0.55)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
        }}
      >
        {/* Card */}
        <div
          className="confirm-dialog-card"
          onClick={(e) => e.stopPropagation()}
          style={{
            width: "100%",
            maxWidth: "420px",
            background: "#fafaf8",
            borderRadius: "20px",
            boxShadow:
              "0 0 0 1px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.10), 0 32px 56px rgba(0,0,0,0.12)",
            overflow: "hidden",
          }}
        >
          {/* Top accent line */}
          <div
            style={{
              height: "3px",
              background: destructive
                ? "linear-gradient(90deg, #ef4444, #f97316)"
                : "linear-gradient(90deg, #0d9488, #06b6d4)",
            }}
          />

          {/* Header */}
          <div
            style={{
              padding: "24px 24px 16px",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: "16px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              {/* Icon badge */}
              <div
                className="confirm-icon-badge"
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  background: destructive
                    ? "linear-gradient(135deg, #fef2f2, #fee2e2)"
                    : "linear-gradient(135deg, #f0fdfa, #ccfbf1)",
                  boxShadow: destructive
                    ? "0 2px 8px rgba(239,68,68,0.15)"
                    : "0 2px 8px rgba(13,148,136,0.15)",
                }}
              >
                {icon ?? (
                  destructive
                    ? <AlertTriangle size={20} color="#ef4444" strokeWidth={2} />
                    : <CheckCircle size={20} color="#0d9488" strokeWidth={2} />
                )}
              </div>

              <h2
                className="confirm-dialog-title"
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 400,
                  letterSpacing: "-0.01em",
                  color: "#111",
                  lineHeight: 1.3,
                  margin: 0,
                }}
              >
                {title}
              </h2>
            </div>

            {/* Close */}
            <button
              onClick={onCancel}
              style={{
                flexShrink: 0,
                width: "30px",
                height: "30px",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                color: "#999",
                transition: "background 0.15s, color 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(0,0,0,0.06)";
                (e.currentTarget as HTMLButtonElement).style.color = "#444";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                (e.currentTarget as HTMLButtonElement).style.color = "#999";
              }}
            >
              <X size={16} strokeWidth={2.5} />
            </button>
          </div>

          {/* Description */}
          {description && (
            <div style={{ padding: "0 24px 20px", paddingLeft: "80px" }}>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.875rem",
                  color: "#666",
                  lineHeight: 1.6,
                }}
              >
                {description}
              </p>
            </div>
          )}

          {/* Divider */}
          {/* <div style={{ height: "1px", background: "rgba(0,0,0,0.07)", margin: "0 24px" }} /> */}

          {/* Actions */}
          <div
            style={{
              padding: "16px 24px 24px",
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
            }}
          >
            {/* Cancel */}
            <button
              className="confirm-cancel-btn"
              onClick={onCancel}
              disabled={loading}
              style={{
                padding: "9px 20px",
                borderRadius: "10px",
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "#555",
                background: "transparent",
                border: "1.5px solid rgba(0,0,0,0.12)",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.5 : 1,
                transition: "background 0.15s, border-color 0.15s",
                fontFamily: "'DM Sans', sans-serif",
              }}
              onMouseEnter={(e) => {
                if (!loading) (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(0,0,0,0.25)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(0,0,0,0.12)";
              }}
            >
              {cancelText}
            </button>

            {/* Confirm */}
            <button
              className="confirm-btn-shimmer"
              onClick={onConfirm}
              disabled={loading}
              style={{
                padding: "9px 20px",
                borderRadius: "10px",
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "white",
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.85 : 1,
                position: "relative",
                overflow: "hidden",
                transition: "transform 0.15s, box-shadow 0.15s",
                fontFamily: "'DM Sans', sans-serif",
                background: destructive
                  ? "linear-gradient(135deg, #ef4444, #dc2626)"
                  : "linear-gradient(135deg, #0d9488, #0891b2)",
                boxShadow: destructive
                  ? "0 4px 14px rgba(239,68,68,0.35)"
                  : "0 4px 14px rgba(13,148,136,0.35)",
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = destructive
                    ? "0 6px 20px rgba(239,68,68,0.45)"
                    : "0 6px 20px rgba(13,148,136,0.45)";
                }
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = destructive
                  ? "0 4px 14px rgba(239,68,68,0.35)"
                  : "0 4px 14px rgba(13,148,136,0.35)";
              }}
            >
              {loading && <span className="confirm-spinner" />}
              {loading ? "Please wait…" : confirmText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};