import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../api/axios";

const MOOD_EMOJI = {
  happy: "😊",
  sad: "😢",
  excited: "🤩",
  calm: "😌",
  angry: "😠",
  anxious: "😰",
  grateful: "🙏",
};

const ReadPage = () => {
  const { date } = useParams();
  const navigate = useNavigate();
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    axios
      .get(`/entries/${date}`)
      .then((res) => setEntry(res.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [date]);

  const formatDisplayDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div style={styles.loading}>Opening this memory...</div>
    );
  }

  if (notFound) {
    return (
      <div style={styles.loading}>
        <div>📔 No entry found for this date.</div>
        <button style={styles.backBtn} onClick={() => navigate("/dashboard")}>
          ← Back to Shelf
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Top bar */}
      <div style={styles.topBar}>
        <button style={styles.backBtn} onClick={() => navigate("/dashboard")}>
          ← Back to Shelf
        </button>
        <span style={styles.dateLabel}>
          {formatDisplayDate(entry.entry_date)}
        </span>
        <div style={styles.moodDisplay}>
          {entry.mood && (
            <>
              <span style={styles.moodText}>{entry.mood}</span>
              <span style={styles.moodEmoji}>{MOOD_EMOJI[entry.mood]}</span>
            </>
          )}
        </div>
      </div>

      {/* Book wrapper */}
      <div style={styles.bookWrapper}>
        {/* Spine */}
        <div
          style={{
            ...styles.spine,
            backgroundColor: entry.cover_color || "#8b5e3c",
          }}
        />

        {/* Page */}
        <div style={styles.page} className="book-open">
          {/* Title */}
          <h1 style={styles.title}>{entry.title || "Untitled"}</h1>

          <div style={styles.divider} />

          {/* Content on lined paper */}
          <div className="lined-paper" style={styles.content}>
            {entry.content || (
              <span style={styles.emptyContent}>
                Nothing was written here...
              </span>
            )}
          </div>

          {/* Footer */}
          <div style={styles.footer}>
            <span style={styles.footerText}>
              Written on {formatDisplayDate(entry.entry_date)}
            </span>
            {entry.updated_at !== entry.created_at && (
              <span style={styles.footerText}>
                ✏️ Edited
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "var(--cream)",
    padding: "24px",
  },
  loading: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "24px",
    minHeight: "100vh",
    fontFamily: "'Lora', serif",
    fontStyle: "italic",
    color: "var(--ink-light)",
    fontSize: "18px",
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    maxWidth: "800px",
    margin: "0 auto 32px",
  },
  backBtn: {
    backgroundColor: "transparent",
    border: "none",
    color: "var(--brown)",
    fontFamily: "'Lora', serif",
    fontSize: "14px",
    cursor: "pointer",
    padding: "8px 0",
  },
  dateLabel: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "16px",
    color: "var(--ink-light)",
    fontStyle: "italic",
  },
  moodDisplay: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  moodText: {
    fontFamily: "'Lora', serif",
    fontSize: "13px",
    color: "var(--ink-light)",
    fontStyle: "italic",
    textTransform: "capitalize",
  },
  moodEmoji: {
    fontSize: "22px",
  },
  bookWrapper: {
    display: "flex",
    maxWidth: "800px",
    margin: "0 auto",
    boxShadow: "-8px 8px 30px var(--shadow-deep)",
    borderRadius: "4px 12px 12px 4px",
  },
  spine: {
    width: "28px",
    borderRadius: "4px 0 0 4px",
    flexShrink: 0,
  },
  page: {
    flex: 1,
    backgroundColor: "var(--paper)",
    borderRadius: "0 12px 12px 0",
    padding: "40px",
    minHeight: "600px",
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "32px",
    color: "var(--ink)",
    marginBottom: "16px",
    fontWeight: "600",
  },
  divider: {
    height: "1px",
    backgroundColor: "#c9bfa8",
    margin: "16px 0",
  },
  content: {
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    minHeight: "400px",
    border: "none",
    borderRadius: "0",
  },
  emptyContent: {
    color: "var(--ink-light)",
    fontStyle: "italic",
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "32px",
    paddingTop: "16px",
    borderTop: "1px solid #c9bfa8",
  },
  footerText: {
    fontFamily: "'Lora', serif",
    fontSize: "12px",
    color: "var(--ink-light)",
    fontStyle: "italic",
  },
};

export default ReadPage;