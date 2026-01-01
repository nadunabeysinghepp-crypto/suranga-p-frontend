import { useEffect, useState } from "react";
import http from "../api/adminHttp";
import ReviewCard from "../components/ReviewCard";

export default function Reviews() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [okMsg, setOkMsg] = useState("");

  // form
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const load = async () => {
    setErr("");
    setLoading(true);
    try {
      const { data } = await http.get("/api/reviews");
      setItems(data || []);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setOkMsg("");

    if (!name.trim()) return setErr("Please enter your name.");
    if (!message.trim()) return setErr("Please write your review message.");

    setSending(true);
    try {
      const { data } = await http.post("/api/reviews", {
        name,
        rating: Number(rating),
        message,
      });

      setOkMsg(
        `✅ Thanks! Your review was submitted for approval. Reference: ${data?.id || "N/A"}`
      );
      setMessage("");
      setRating(5);
      // keep name for convenience
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Failed to submit review");
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      {/* ================= HERO SECTION ================= */}
      <section className="bg-gradient-to-b from-red-50 to-white border-b border-red-100">
        <div className="container-pad py-12 md:py-14">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-semibold border border-red-200">
                Reviews • Verified • Dambulla
              </div>

              <h1 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
                Customer <span className="text-red-600">Reviews</span>
              </h1>

              <p className="mt-4 text-slate-700 text-lg leading-relaxed">
                Real feedback for Suranga Printers – Fast Print (Dambulla).
              </p>
            </div>

            <button
              onClick={load}
              className="px-5 py-3 rounded-xl border border-red-200 font-semibold hover:bg-red-50"
            >
              Refresh Reviews
            </button>
          </div>
        </div>
      </section>

      {/* ================= MAIN CONTENT ================= */}
      <div className="container-pad py-10">
        <div className="mt-8 grid lg:grid-cols-3 gap-6">
          {/* Submit */}
          <form
            onSubmit={submit}
            className="border border-red-100 rounded-3xl p-6 bg-white"
          >
            <div className="font-extrabold text-lg text-slate-900">Leave a review</div>
            <p className="text-sm text-slate-600 mt-1">
              Reviews are shown after approval to prevent spam.
            </p>

            {err ? (
              <div className="mt-4 border border-red-200 bg-red-50 text-red-700 rounded-2xl p-3">
                {err}
              </div>
            ) : null}

            {okMsg ? (
              <div className="mt-4 border border-emerald-200 bg-emerald-50 text-emerald-700 rounded-2xl p-3">
                {okMsg}
              </div>
            ) : null}

            <div className="mt-5 space-y-4">
              <div>
                <label className="text-sm font-semibold">Your name *</label>
                <input
                  className="mt-2 w-full border border-red-100 rounded-xl px-3 py-2 focus:ring-2 focus:ring-red-200 outline-none"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="text-sm font-semibold">Rating</label>
                <select
                  className="mt-2 w-full border border-red-100 rounded-xl px-3 py-2 focus:ring-2 focus:ring-red-200 outline-none"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                >
                  <option value={5}>★★★★★ (5)</option>
                  <option value={4}>★★★★☆ (4)</option>
                  <option value={3}>★★★☆☆ (3)</option>
                  <option value={2}>★★☆☆☆ (2)</option>
                  <option value={1}>★☆☆☆☆ (1)</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold">Message *</label>
                <textarea
                  className="mt-2 w-full border border-red-100 rounded-2xl px-3 py-2 min-h-[120px] focus:ring-2 focus:ring-red-200 outline-none"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell others about the quality, speed, price, service…"
                />
              </div>

              <button
                disabled={sending}
                className="w-full px-4 py-3 rounded-xl bg-red-600 text-white font-semibold hover:opacity-90 disabled:opacity-60"
              >
                {sending ? "Submitting…" : "Submit Review"}
              </button>
            </div>
          </form>

          {/* List */}
          <div className="lg:col-span-2">
            <div className="flex items-end justify-between gap-4">
              <div className="font-extrabold text-lg text-slate-900">Approved reviews</div>
              <button
                onClick={load}
                className="px-4 py-2 rounded-xl border border-red-200 font-semibold hover:bg-red-50"
              >
                Refresh
              </button>
            </div>

            {loading ? <p className="mt-4 text-slate-600">Loading…</p> : null}

            <div className="mt-4 grid md:grid-cols-2 gap-4">
              {items.map((r) => (
                <ReviewCard key={r._id} r={r} />
              ))}
            </div>

            {!loading && items.length === 0 ? (
              <div className="mt-6 border border-red-100 rounded-2xl p-5 bg-red-50 text-slate-700">
                No reviews yet. Be the first to leave a review.
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
