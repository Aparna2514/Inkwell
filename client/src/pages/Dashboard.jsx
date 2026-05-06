import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
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

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/entries")
      .then((res) => setEntries(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getTodayDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const hasTodayEntry = entries.some((e) => {
    const entryDate = new Date(e.entry_date).toLocaleDateString("en-CA");
    return entryDate === getTodayDate();
  });

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <div style={styles.navbar}>
        <div style={styles.navBrand}>🖋️ Inkwell</div>
        <div style={styles.navRight}>
          <span style={styles.greeting}>Hello, {user?.name} ✨</span>
          <button style={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Your Diary</h1>
        <p style={styles.subtitle}>
          {entries.length === 0
            ? "Your story begins today"
            : `${entries.length} ${entries.length === 1 ? "entry" : "entries"} written`}
        </p>
        {!hasTodayEntry && (
          <button style={styles.newEntryBtn} onClick={() => navigate("/today")}>
            ✍️ Write Today's Entry
          </button>
        )}
        {hasTodayEntry && (
          <button style={styles.newEntryBtn} onClick={() => navigate("/today")}>
            📖 Continue Today's Entry
          </button>
        )}
      </div>

      {/* Books shelf */}
      {loading ? (
        <div style={styles.loading}>Opening your diary...</div>
      ) : entries.length === 0 ? (
        <div style={styles.empty}>
          <div style={styles.emptyIcon}>📔</div>
          <p style={styles.emptyText}>No entries yet. Write your first one!</p>
        </div>
      ) : (
        <div style={styles.shelf}>
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="book-card"
              style={{ backgroundColor: entry.cover_color || "#8b5e3c" }}
              onClick={() => {
                const date = new Date(entry.entry_date).toLocaleDateString("en-CA");
                navigate(`/read/${date}`);
              }}
            >
              <div className="book-spine" />
              <div className="book-date">{formatDate(entry.entry_date)}</div>
              <div className="book-title">
                {entry.title || "Untitled"}
              </div>
              {entry.mood && (
                <div style={styles.moodBadge}>
                  {MOOD_EMOJI[entry.mood] || "💭"}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "var(--cream)",
  },
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 40px",
    backgroundColor: "#8b5e3c",
    color: "white",
  },
  navBrand: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "22px",
    fontWeight: "700",
  },
  navRight: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  greeting: {
    fontFamily: "'Lora', serif",
    fontSize: "14px",
    opacity: 0.9,
  },
  logoutBtn: {
    backgroundColor: "transparent",
    border: "1px solid rgba(255,255,255,0.5)",
    color: "white",
    padding: "6px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontFamily: "'Lora', serif",
    fontSize: "13px",
  },
  header: {
    textAlign: "center",
    padding: "48px 40px 32px",
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "42px",
    color: "var(--ink)",
    marginBottom: "8px",
  },
  subtitle: {
    color: "var(--ink-light)",
    fontStyle: "italic",
    marginBottom: "24px",
  },
  newEntryBtn: {
    backgroundColor: "#8b5e3c",
    color: "white",
    border: "none",
    padding: "12px 28px",
    borderRadius: "8px",
    fontSize: "15px",
    fontFamily: "'Playfair Display', serif",
    cursor: "pointer",
  },
  shelf: {
    display: "flex",
    flexWrap: "wrap",
    gap: "24px",
    padding: "32px 60px",
    justifyContent: "flex-start",
    borderTop: "6px solid #8b5e3c",
    backgroundColor: "#f5e6cc",
    margin: "0 40px",
    borderRadius: "8px",
    boxShadow: "0 4px 12px var(--shadow)",
    minHeight: "250px",
    alignItems: "flex-end",
  },
  moodBadge: {
    fontSize: "16px",
    marginTop: "6px",
  },
  loading: {
    textAlign: "center",
    padding: "80px",
    fontStyle: "italic",
    color: "var(--ink-light)",
    fontFamily: "'Lora', serif",
  },
  empty: {
    textAlign: "center",
    padding: "80px",
  },
  emptyIcon: {
    fontSize: "64px",
    marginBottom: "16px",
  },
  emptyText: {
    color: "var(--ink-light)",
    fontStyle: "italic",
    fontFamily: "'Lora', serif",
  },
};

export default Dashboard;