import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

const MOODS = [
  { key: "happy", emoji: "😊", label: "Happy" },
  { key: "sad", emoji: "😢", label: "Sad" },
  { key: "excited", emoji: "🤩", label: "Excited" },
  { key: "calm", emoji: "😌", label: "Calm" },
  { key: "angry", emoji: "😠", label: "Angry" },
  { key: "anxious", emoji: "😰", label: "Anxious" },
  { key: "grateful", emoji: "🙏", label: "Grateful" },
];

const COVER_COLORS = [
  "#f4a261", "#7fa98b", "#9b89b4",
  "#6b9ab8", "#e76f51", "#8b5e3c",
];

const TodayPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    content: "",
    mood: "",
    cover_color: "#f4a261",
  });
  const [existingEntry, setExistingEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const getTodayDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };
  

  const formatDisplayDate = () => {
    return new Date().toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  useEffect(() => {
    const today = getTodayDate();
    axios
      .get(`/entries/${today}`)
      .then((res) => {
        setExistingEntry(res.data);
        setForm({
          title: res.data.title || "",
          content: res.data.content || "",
          mood: res.data.mood || "",
          cover_color: res.data.cover_color || "#f4a261",
        });
      })
      .catch(() => {
        // No entry for today yet — that's fine
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const today = getTodayDate();
    try {
      if (existingEntry) {
        await axios.put(`/entries/${today}`, {
          title: form.title,
          content: form.content,
          mood: form.mood,
        });
      } else {
        const res = await axios.post("/entries", {
          entry_date: today,
          title: form.title,
          content: form.content,
          mood: form.mood,
          cover_color: form.cover_color,
        });
        setExistingEntry(res.data);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.loading}>Opening today's page...</div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Top bar */}
      <div style={styles.topBar}>
        <button style={styles.backBtn} onClick={() => navigate("/dashboard")}>
          ← Back to Shelf
        </button>
        <span style={styles.dateLabel}>{formatDisplayDate()}</span>
        <button
          style={saved ? { ...styles.saveBtn, backgroundColor: "#7fa98b" } : styles.saveBtn}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving..." : saved ? "Saved ✓" : "Save Entry"}
        </button>
      </div>

      {/* Book wrapper */}
      <div style={styles.bookWrapper}>
        {/* Book cover spine */}
        <div style={{ ...styles.spine, backgroundColor: form.cover_color }} />

        {/* Page */}
        <div style={styles.page} className="book-open">
          {/* Title input */}
          <input
            style={styles.titleInput}
            type="text"
            placeholder="Title your day..."
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <div style={styles.divider} />

          {/* Mood picker */}
          <div style={styles.moodRow}>
            <span style={styles.moodLabel}>How are you feeling?</span>
            <div style={styles.moodOptions}>
              {MOODS.map((m) => (
                <button
                  key={m.key}
                  style={{
                    ...styles.moodBtn,
                    ...(form.mood === m.key ? styles.moodBtnActive : {}),
                  }}
                  onClick={() => setForm({ ...form, mood: m.key })}
                  title={m.label}
                >
                  {m.emoji}
                </button>
              ))}
            </div>
          </div>

          <div style={styles.divider} />

          {/* Lined paper textarea */}
          <textarea
            className="lined-paper"
            style={styles.textarea}
            placeholder="Dear Diary..."
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
          />

          {/* Cover color picker */}
          {!existingEntry && (
            <div style={styles.colorRow}>
              <span style={styles.moodLabel}>Pick your book cover:</span>
              <div style={styles.colorOptions}>
                {COVER_COLORS.map((color) => (
                  <div
                    key={color}
                    style={{
                      ...styles.colorDot,
                      backgroundColor: color,
                      border: form.cover_color === color
                        ? "3px solid var(--ink)"
                        : "3px solid transparent",
                    }}
                    onClick={() => setForm({ ...form, cover_color: color })}
                  />
                ))}
              </div>
            </div>
          )}
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
    alignItems: "center",
    justifyContent: "center",
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
    marginBottom: "32px",
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
  saveBtn: {
    backgroundColor: "#8b5e3c",
    color: "white",
    border: "none",
    padding: "10px 24px",
    borderRadius: "8px",
    fontFamily: "'Lora', serif",
    fontSize: "14px",
    cursor: "pointer",
    transition: "background-color 0.3s",
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
  titleInput: {
    width: "100%",
    border: "none",
    backgroundColor: "transparent",
    fontFamily: "'Playfair Display', serif",
    fontSize: "28px",
    color: "var(--ink)",
    outline: "none",
    marginBottom: "16px",
  },
  divider: {
    height: "1px",
    backgroundColor: "#c9bfa8",
    margin: "16px 0",
  },
  moodRow: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    flexWrap: "wrap",
  },
  moodLabel: {
    fontFamily: "'Lora', serif",
    fontSize: "13px",
    color: "var(--ink-light)",
    fontStyle: "italic",
  },
  moodOptions: {
    display: "flex",
    gap: "8px",
  },
  moodBtn: {
    fontSize: "22px",
    backgroundColor: "transparent",
    border: "2px solid transparent",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    cursor: "pointer",
    transition: "transform 0.2s",
  },
  moodBtnActive: {
    border: "2px solid var(--brown)",
    backgroundColor: "#f5e6cc",
    transform: "scale(1.2)",
  },
  textarea: {
    width: "100%",
    border: "none",
    outline: "none",
    resize: "none",
    minHeight: "380px",
    fontSize: "16px",
    backgroundColor: "transparent",
    fontFamily: "'Lora', serif",
  },
  colorRow: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginTop: "24px",
    flexWrap: "wrap",
  },
  colorOptions: {
    display: "flex",
    gap: "10px",
  },
  colorDot: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    cursor: "pointer",
    transition: "transform 0.2s",
  },
};

export default TodayPage;