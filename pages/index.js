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
      <h1 style={styles.title}>TrustBoost AI Testimonial Transformer</h1>
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
          backgroundColor: loading ? "#999" : "#0070f3",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Generating..." : "Generate Testimonials"}
      </button>

      {error && <p style={styles.error}>{error}</p>}

      {results && (
        <section style={styles.results}>
          <h2 style={styles.resultsTitle}>Results</h2>
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
    maxWidth: 700,
    margin: "40px auto",
    padding: 20,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: "#222",
  },
  title: {
    textAlign: "center",
    marginBottom: 20,
    fontSize: "2rem",
    fontWeight: "700",
    color: "#0070f3",
  },
  textarea: {
    width: "100%",
    padding: 15,
    fontSize: 16,
    borderRadius: 8,
    border: "1.5px solid #ccc",
    resize: "vertical",
    boxSizing: "border-box",
  },
  button: {
    marginTop: 15,
    padding: "12px 25px",
    fontSize: 18,
    color: "white",
    border: "none",
    borderRadius: 8,
    transition: "background-color 0.3s ease",
  },
  error: {
    marginTop: 15,
    color: "red",
    fontWeight: "600",
  },
  results: {
    marginTop: 40,
    backgroundColor: "#f7f9fc",
    borderRadius: 10,
    padding: 20,
    boxShadow: "0 4px 12px rgb(0 0 0 / 0.1)",
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
