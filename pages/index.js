import { useState } from "react";
import Head from "next/head";

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
    <>
      <Head>
        <title>TrustBoost AI | Testimonial Transformer</title>
        <meta name="description" content="Transform plain customer reviews into persuasive, high-converting testimonials with AI." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div style={styles.page}>
        <div style={styles.card}>
          <h1 style={styles.title}>🚀 TrustBoost AI</h1>
          <p style={styles.subtitle}>
            Turn any customer review into <strong>3 powerful, marketing-ready testimonials</strong> instantly.
          </p>

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
              backgroundColor: loading ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.2)",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Generating..." : "✨ Generate Testimonials"}
          </button>

          {error && <p style={styles.error}>{error}</p>}

          {results && (
            <section style={styles.results}>
              <h2 style={styles.resultsTitle}>Results</h2>
              <div style={styles.testimonialBlock}>
                <h3 style={styles.subheading}>1️⃣ Professional & Formal</h3>
                <p style={styles.testimonialText}>{results.professional}</p>
              </div>
              <div style={styles.testimonialBlock}>
                <h3 style={styles.subheading}>2️⃣ Emotional Storytelling</h3>
                <p style={styles.testimonialText}>{results.emotional}</p>
              </div>
              <div style={styles.testimonialBlock}>
                <h3 style={styles.subheading}>3️⃣ Short Punchy Social Media</h3>
                <p style={styles.testimonialText}>{results.social}</p>
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    background: "linear-gradient(135deg, #6e8efb, #a777e3)",
  },
  card: {
    width: "100%",
    maxWidth: 750,
    background: "rgba(255,255,255,0.15)",
    borderRadius: 20,
    padding: "40px 30px",
    backdropFilter: "blur(15px)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
    color: "#fff",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: "1.1rem",
    textAlign: "center",
    marginBottom: 30,
    color: "#f1f1f1",
  },
  textarea: {
    width: "100%",
    padding: 15,
    fontSize: 16,
    borderRadius: 10,
    border: "none",
    resize: "vertical",
    boxSizing: "border-box",
    marginBottom: 15,
    background: "rgba(255,255,255,0.2)",
    color: "#fff",
    outline: "none",
  },
  button: {
    width: "100%",
    padding: "12px 25px",
    fontSize: 18,
    color: "#fff",
    border: "none",
    borderRadius: 8,
    transition: "all 0.3s ease",
    backdropFilter: "blur(5px)",
  },
  error: {
    marginTop: 15,
    color: "#ff6b6b",
    fontWeight: "600",
  },
  results: {
    marginTop: 30,
    background: "rgba(255,255,255,0.1)",
    borderRadius: 10,
    padding: 20,
  },
  resultsTitle: {
    marginBottom: 20,
    fontSize: "1.6rem",
    borderBottom: "1px solid rgba(255,255,255,0.3)",
    paddingBottom: 6,
  },
  testimonialBlock: {
    marginBottom: 20,
  },
  subheading: {
    fontSize: "1.2rem",
    marginBottom: 8,
    color: "#ffdd59",
  },
  testimonialText: {
    fontSize: 16,
    lineHeight: 1.5,
    whiteSpace: "pre-wrap",
  },
};
