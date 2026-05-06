import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "../api/axios";

const Home = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const payload = isLogin
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password };

      const res = await axios.post(endpoint, payload);
      login(res.data.token, res.data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Left side — branding */}
      <div style={styles.left}>
        <div style={styles.inkIcon}>🖋️</div>
        <h1 style={styles.brand}>Inkwell</h1>
        <p style={styles.tagline}>
          Your thoughts, bound in beautiful pages.
          <br />
          Write every day, cherish forever.
        </p>
        <div style={styles.booksDecor}>
          {["#f4a261", "#7fa98b", "#9b89b4", "#6b9ab8", "#e76f51"].map(
            (color, i) => (
              <div
                key={i}
                style={{
                  ...styles.decorBook,
                  backgroundColor: color,
                  height: `${110 + i * 15}px`,
                }}
              />
            )
          )}
        </div>
      </div>

      {/* Right side — auth form */}
      <div style={styles.right}>
        <div style={styles.formCard}>
          <h2 style={styles.formTitle}>
            {isLogin ? "Welcome back" : "Start your journey"}
          </h2>
          <p style={styles.formSubtitle}>
            {isLogin ? "Open your diary" : "Create your diary"}
          </p>

          {error && <div style={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div style={styles.inputGroup}>
                <label style={styles.label}>Your Name</label>
                <input
                  style={styles.input}
                  type="text"
                  name="name"
                  placeholder="Aparna"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
            )}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email</label>
              <input
                style={styles.input}
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <input
                style={styles.input}
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              style={loading ? { ...styles.btn, opacity: 0.7 } : styles.btn}
              disabled={loading}
            >
              {loading ? "Please wait..." : isLogin ? "Open Diary 🖋️" : "Create Diary ✨"}
            </button>
          </form>

          <p style={styles.toggle}>
            {isLogin ? "New to Inkwell? " : "Already have a diary? "}
            <span
              style={styles.toggleLink}
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
            >
              {isLogin ? "Create one" : "Sign in"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
  },
  left: {
    flex: 1,
    backgroundColor: "#8b5e3c",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px",
    color: "white",
  },
  inkIcon: {
    fontSize: "48px",
    marginBottom: "16px",
  },
  brand: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "48px",
    fontWeight: "700",
    marginBottom: "16px",
  },
  tagline: {
    fontFamily: "'Lora', serif",
    fontSize: "16px",
    textAlign: "center",
    lineHeight: "1.8",
    opacity: 0.9,
    marginBottom: "48px",
  },
  booksDecor: {
    display: "flex",
    alignItems: "flex-end",
    gap: "8px",
  },
  decorBook: {
    width: "36px",
    borderRadius: "3px 6px 6px 3px",
    boxShadow: "-3px 3px 8px rgba(0,0,0,0.3)",
  },
  right: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px",
    backgroundColor: "var(--cream)",
  },
  formCard: {
    width: "100%",
    maxWidth: "400px",
  },
  formTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "32px",
    color: "var(--ink)",
    marginBottom: "8px",
  },
  formSubtitle: {
    color: "var(--ink-light)",
    marginBottom: "32px",
    fontStyle: "italic",
  },
  error: {
    backgroundColor: "#fde8e8",
    color: "#c0392b",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "16px",
    fontSize: "14px",
  },
  inputGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    marginBottom: "6px",
    fontSize: "14px",
    color: "var(--ink-light)",
    fontFamily: "'Lora', serif",
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    border: "2px solid #e8dcc8",
    borderRadius: "8px",
    fontSize: "15px",
    fontFamily: "'Lora', serif",
    backgroundColor: "var(--paper)",
    color: "var(--ink)",
    outline: "none",
    transition: "border-color 0.2s",
  },
  btn: {
    width: "100%",
    padding: "14px",
    backgroundColor: "#8b5e3c",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontFamily: "'Playfair Display', serif",
    cursor: "pointer",
    marginTop: "8px",
    transition: "background-color 0.2s",
  },
  toggle: {
    textAlign: "center",
    marginTop: "24px",
    color: "var(--ink-light)",
    fontSize: "14px",
  },
  toggleLink: {
    color: "#8b5e3c",
    cursor: "pointer",
    fontWeight: "600",
    textDecoration: "underline",
  },
};

export default Home;