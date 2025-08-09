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
    fontFami
