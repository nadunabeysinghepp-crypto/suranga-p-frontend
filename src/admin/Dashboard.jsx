import { useEffect, useMemo, useState } from "react";
import adminHttp from "../api/adminHttp";

export default function Dashboard() {
  const [quotes, setQuotes] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setErr("");
    setLoading(true);
    try {
      const [q, r] = await Promise.all([
        adminHttp.get("/api/admin/quotes"),
        adminHttp.get("/api/admin/reviews"),
      ]);
      setQuotes(q.data || []);
      setReviews(r.data || []);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const stats = useMemo(() => {
    const pendingReviews = reviews.filter((x) => !x.approved).length;
    const received = quotes.filter((x) => x.status === "Received").length;
    const printing = quotes.filter((x) => x.status === "Printing").length;
    const outForDelivery = quotes.filter((x) => x.status === "OutForDelivery").length;
    return { pendingReviews, received, printing, outForDelivery };
  }, [quotes, reviews]);

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold">Dashboard</h1>
          <p className="text-slate-600 mt-1">Quick overview of quotes/orders and reviews.</p>
        </div>
        <button onClick={load} className="px-4 py-2 rounded-xl border font-semibold hover:bg-slate-50">
          Refresh
        </button>
      </div>

      {err ? (
        <div className="mt-6 border border-red-200 bg-red-50 text-red-700 rounded-2xl p-4">{err}</div>
      ) : null}

      {loading ? <p className="mt-6 text-slate-600">Loading…</p> : null}

      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card title="New (Received)" value={stats.received} />
        <Card title="Printing" value={stats.printing} />
        <Card title="Out for delivery" value={stats.outForDelivery} />
        <Card title="Pending reviews" value={stats.pendingReviews} />
      </div>

      <div className="mt-8 grid lg:grid-cols-2 gap-6">
        <Panel title="Latest quotes/orders">
          <div className="space-y-3">
            {quotes.slice(0, 6).map((q) => (
              <div key={q._id} className="border rounded-xl p-3 bg-white flex items-start justify-between gap-3">
                <div>
                  <div className="font-bold">{q.customerName} • {q.phone}</div>
                  <div className="text-xs text-slate-600 mt-1">{q.serviceName} • {q.fulfillment} • {q.status}</div>
                </div>
                <div className="text-xs text-slate-500">{new Date(q.createdAt).toLocaleString()}</div>
              </div>
            ))}
            {quotes.length === 0 ? <div className="text-sm text-slate-600">No quotes yet.</div> : null}
          </div>
        </Panel>

        <Panel title="Pending reviews">
          <div className="space-y-3">
            {reviews.filter((r) => !r.approved).slice(0, 6).map((r) => (
              <div key={r._id} className="border rounded-xl p-3 bg-white">
                <div className="font-bold">{r.name} • {r.rating}/5</div>
                <div className="text-xs text-slate-600 mt-1 line-clamp-2">{r.message}</div>
              </div>
            ))}
            {reviews.filter((r) => !r.approved).length === 0 ? (
              <div className="text-sm text-slate-600">No pending reviews.</div>
            ) : null}
          </div>
        </Panel>
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="border rounded-2xl p-5 bg-white">
      <div className="text-sm text-slate-600">{title}</div>
      <div className="mt-2 text-3xl font-extrabold">{value}</div>
    </div>
  );
}

function Panel({ title, children }) {
  return (
    <div className="border rounded-3xl p-6 bg-slate-50">
      <div className="font-extrabold text-lg">{title}</div>
      <div className="mt-4">{children}</div>
    </div>
  );
}
