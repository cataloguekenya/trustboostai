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
    <main style={{ maxWidth: 700, margin: "auto", padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h1>TrustBoost AI Testimonial Transformer</h1>
      <textarea
        placeholder="Paste customer review here..."
        rows={6}
        style={{ width: "100%", padding: 10, fontSize: 16 }}
        value={review}
        onChange={(e) => setReview(e.target.value)}
      />
      <button
        onClick={generateTestimonials}
        disabled={!review.trim() || loading}
        style={{
          marginTop: 10,
          padding: "10px 20px",
          fontSize: 16,
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Generating..." : "Generate Testimonials"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {results && (
        <section style={{ marginTop: 30 }}>
          <h2>Results</h2>
          <div>
            <h3>1. Professional & Formal</h3>
            <p>{results.professional}</p>
          </div>
          <div>
            <h3>2. Emotional Storytelling</h3>
            <p>{results.emotional}</p>
          </div>
          <div>
            <h3>3. Short Punchy Social Media</h3>
            <p>{results.social}</p>
          </div>
        </section>
      )}
    </main>
  );
}
