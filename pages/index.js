import { useState } from "react";

export default function Home() {
  const [review, setReview] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function generateTestimonials() {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ review }),
      });

      if (!res.ok) {
        throw new Error(`Error: ${res.statusText}`);
      }

      const data = await res.json();
      setResults(data);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  }

  return (
    <main style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>✨ TrustBoost AI ✨</h1>
        <p style={styles.subtitle}>
          Transform customer feedback into persuasive, high-converting testimonials.
        </p>
      </header>

      <section style={styles.inputSection}>
        <textarea
          placeholder="Paste customer review here..."
          rows={6}
          style={styles.textarea}
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />
        <button
          onClick={generateTestimonials}
          disabled={!review.trim() || loading}
          style={{
            ...styles.button,
            background: loading
              ? "linear-gradient(135deg, #9e9e9e, #bdbdbd)"
              : "linear-gradient(135deg, #0070f3, #00c6ff)",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Generating..." : "🚀 Generate Testimonials"}
        </button>
        {error && <p style={styles.error}>{error}</p>}
      </section>

      {results && (
        <section style={styles.results}>
          <h2 style={styles.resultsTitle}>Your Testimonials</h2>

          <div style={styles.testimonialBlock}>
            <h3 style={styles.subheading}>1. Professional & Formal</h3>
            <p style={styles.testimonialText}>{results.professional}</p>
          </div>

          <div style={styles.testimonialBlock}>
            <h3 style={styles.subheading}>2. Emotional Storytelling</h3>
            <p style={styles.testimonialText}>{results.emotional}</p>
          </div>

          <div style={styles.testimonialBlock}>
            <h3 style={styles.subheading}>3. Short Punchy Social Media</h3>
            <p style={styles.testimonialText}>{results.social}</p>
          </div>
        </section>
      )}
    </main>
  );
}

const styles = {
  container: {
    maxWidth: 800,
    margin: "40px auto",
    padding: 20,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: "#222",
  },
  header: {
    textAlign: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "800",
    background: "linear-gradient(135deg, #0070f3, #00c6ff)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    margin: 0,
  },
  subtitle: {
    fontSize: "1.1rem",
    color: "#555",
    marginTop: 10,
  },
  inputSection: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 12,
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
  },
  textarea: {
    width: "100%",
    padding: 15,
    fontSize: 16,
    borderRadius: 8,
    border: "1.5px solid #ccc",
    resize: "vertical",
    boxSizing: "border-box",
    marginBottom: 15,
    transition: "border-color 0.2s ease",
  },
  button: {
    padding: "12px 25px",
    fontSize: 18,
    color: "white",
    border: "none",
    borderRadius: 8,
    transition: "transform 0.2s ease, background 0.3s ease",
  },
  error: {
    marginTop: 15,
    color: "red",
    fontWeight: "600",
  },
  results: {
    marginTop: 40,
    backgroundColor: "#f7f9fc",
    borderRadius: 12,
    padding: 25,
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  },
  resultsTitle: {
    marginBottom: 20,
    fontSize: "1.8rem",
    color: "#222",
    borderBottom: "2px solid #0070f3",
    paddingBottom: 6,
  },
  testimonialBlock: {
    marginBottom: 25,
    padding: 15,
    borderRadius: 8,
    backgroundColor: "#fff",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
  },
  subheading: {
    fontSize: "1.3rem",
    marginBottom: 8,
    color: "#0051a3",
  },
  testimonialText: {
    fontSize: 16,
    lineHeight: 1.5,
    whiteSpace: "pre-wrap",
  },
};
