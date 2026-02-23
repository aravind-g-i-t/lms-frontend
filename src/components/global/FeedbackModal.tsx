import { useCallback, useEffect, useState } from "react";
import type { ModalState } from "../../context/FeedbackContext";

interface Props {
    modal: ModalState | null;
    onClose: () => void;
}

const icons = {
    success: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 26, height: 26 }}>
            <circle cx="12" cy="12" r="10" />
            <polyline points="9 12 11 14 15 10" />
        </svg>
    ),
    error: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 26, height: 26 }}>
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
    ),
    info: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 26, height: 26 }}>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
    ),
};

const palette = {
    success: {
        accent: "#00897B",
        iconBg: "rgba(34,197,94,0.12)",
        ring: "rgba(34,197,94,0.18)",
        glow: "rgba(34,197,94,0.07)",
    },
    error: {
        accent: "#ef4444",
        iconBg: "rgba(239,68,68,0.12)",
        ring: "rgba(239,68,68,0.18)",
        glow: "rgba(239,68,68,0.07)",
    },
    info: {
        accent: "#3b82f6",
        iconBg: "rgba(59,130,246,0.12)",
        ring: "rgba(59,130,246,0.18)",
        glow: "rgba(59,130,246,0.07)",
    },
};

const cssStyles = `
    @keyframes fm-icon-pulse {
        0%, 100% { box-shadow: 0 0 0 0 var(--fm-ring); }
        50%       { box-shadow: 0 0 0 8px transparent; }
    }
    @keyframes fm-card-in {
        from { opacity: 0; transform: translateY(24px) scale(0.96); }
        to   { opacity: 1; transform: translateY(0)   scale(1);    }
    }
    .fm-card-enter {
        animation: fm-card-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    }
    .fm-close-btn:hover { background: rgba(255,255,255,0.12) !important; color: #fff !important; }
    .fm-ok-btn:hover    { opacity: 0.85; transform: translateY(-1px); }
    .fm-ok-btn:active   { transform: translateY(0); }
`;

export default function FeedbackModal({ modal, onClose }: Props) {
    const [visible, setVisible] = useState(false);
    const [progress, setProgress] = useState(100);

    const handleClose = useCallback(() => {
        setVisible(false);
        setTimeout(onClose, 250);
    }, [onClose]);

    useEffect(() => {
        if (!modal) return;

        setProgress(100);
        requestAnimationFrame(() => setVisible(true));

        if (modal.duration && modal.duration > 0) {
            const start = Date.now();
            const tick = () => {
                const elapsed = Date.now() - start;
                const remaining = Math.max(0, 100 - (elapsed / modal.duration!) * 100);
                setProgress(remaining);
                if (remaining > 0) requestAnimationFrame(tick);
                else handleClose();
            };
            requestAnimationFrame(tick);
        }
    }, [modal, handleClose]);

    if (!modal) return null;

    const { accent, iconBg, ring, glow } = palette[modal.type];

    return (
        <>
            <style>{cssStyles}</style>

            {/* Overlay */}
            <div
                onClick={(e) => e.target === e.currentTarget && handleClose()}
                style={{
                    position: "fixed",
                    inset: 0,
                    background: "rgba(0,0,0,0.55)",
                    backdropFilter: "blur(6px)",
                    WebkitBackdropFilter: "blur(6px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 9999,
                    opacity: visible ? 1 : 0,
                    transition: "opacity 0.25s ease",
                }}
            >
                {/* Card */}
                <div
                    className={visible ? "fm-card-enter" : undefined}
                    style={{
                        ["--fm-ring" as string]: ring,
                        position: "relative",
                        overflow: "hidden",
                        width: 400,
                        background: "#0a0a0a",
                        borderRadius: 20,
                        border: "1px solid rgba(255,255,255,0.08)",
                        padding: "32px 28px 28px",
                        boxShadow: `0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04), inset 0 0 60px 0 ${glow}`,
                    }}
                >
                    {/* Top accent stripe */}
                    <div style={{
                        position: "absolute",
                        top: 0, left: 0, right: 0,
                        height: 3,
                        background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
                        borderRadius: "20px 20px 0 0",
                    }} />

                    {/* Close button */}
                    <button
                        className="fm-close-btn"
                        onClick={handleClose}
                        style={{
                            position: "absolute",
                            top: 14, right: 14,
                            width: 28, height: 28,
                            borderRadius: "50%",
                            border: "none",
                            background: "rgba(255,255,255,0.07)",
                            color: "rgba(255,255,255,0.4)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            fontSize: 14,
                            lineHeight: 1,
                            transition: "background 0.15s, color 0.15s",
                        }}
                    >
                        ✕
                    </button>

                    {/* Icon */}
                    <div style={{
                        width: 52, height: 52,
                        borderRadius: "50%",
                        background: iconBg,
                        border: `1px solid ${accent}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: accent,
                        marginBottom: 18,
                        animation: "fm-icon-pulse 2s ease-in-out infinite",
                    }}>
                        {icons[modal.type]}
                    </div>

                    {/* Title */}
                    <h3 style={{
                        margin: "0 0 8px",
                        fontSize: 20,
                        fontWeight: 700,
                        color: "#f5f5f5",
                        letterSpacing: "-0.3px",
                        lineHeight: 1.3,
                    }}>
                        {modal.title}
                    </h3>

                    {/* Message */}
                    {modal.message && (
                        <p style={{
                            margin: "0 0 24px",
                            fontSize: 14,
                            lineHeight: 1.65,
                            color: "rgba(255,255,255,0.5)",
                        }}>
                            {modal.message}
                        </p>
                    )}

                    {/* OK Button */}
                    <button
                        className="fm-ok-btn"
                        onClick={handleClose}
                        style={{
                            marginTop: modal.message ? 0 : 24,
                            padding: "10px 24px",
                            borderRadius: 10,
                            border: "none",
                            background: accent,
                            color: "#000",
                            fontWeight: 600,
                            fontSize: 14,
                            letterSpacing: "0.3px",
                            cursor: "pointer",
                            transition: "opacity 0.15s, transform 0.15s",
                        }}
                    >
                        Got it
                    </button>

                    {/* Progress bar */}
                    {modal.duration && modal.duration > 0 && (
                        <div style={{
                            position: "absolute",
                            left: 0, bottom: 0,
                            height: 3,
                            width: `${progress}%`,
                            background: accent,
                            opacity: 0.5,
                            borderRadius: "0 0 0 20px",
                            transition: "width 0.1s linear",
                        }} />
                    )}
                </div>
            </div>
        </>
    );
}