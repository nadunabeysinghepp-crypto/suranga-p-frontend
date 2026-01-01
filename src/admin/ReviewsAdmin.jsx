import { useEffect, useState } from "react";
import adminHttp from "../api/adminHttp";

export default function ReviewsAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const load = async () => {
    setErr("");
    setLoading(true);
    try {
      const { data } = await adminHttp.get("/api/admin/reviews");
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

  const patch = async (id, changes) => {
    try {
      await adminHttp.patch(`/api/admin/reviews/${id}`, changes);
      setItems((prev) =>
        prev.map((x) => (x._id === id ? { ...x, ...changes } : x))
      );
    } catch (e) {
      alert(e?.response?.data?.message || "Update failed");
    }
  };

  const del = async (id) => {
    if (!confirm("Delete this review?")) return;
    try {
      await adminHttp.delete(`/api/admin/reviews/${id}`);
      setItems((prev) => prev.filter((x) => x._id !== id));
    } catch (e) {
      alert(e?.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold">Reviews</h1>
          <p className="text-slate-600 mt-1">
            Approve, feature, hide, or delete customer reviews.
          </p>
        </div>
        <button
          onClick={load}
          className="px-4 py-2 rounded-xl border font-semibold hover:bg-slate-50"
        >
          Refresh
        </button>
      </div>

      {err ? (
        <div className="mt-6 border border-red-200 bg-red-50 text-red-700 rounded-2xl p-4">
          {err}
        </div>
      ) : null}

      {loading ? <p className="mt-6 text-slate-600">Loading…</p> : null}

      <div className="mt-6 grid lg:grid-cols-2 gap-4">
        {items.map((r) => (
          <div key={r._id} className="border rounded-2xl p-5 bg-white">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-extrabold text-slate-900">{r.name}</div>
                <div className="text-xs text-slate-600 mt-1">
                  {new Date(r.createdAt).toLocaleString()} • Rating: {r.rating}/5
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge ok={r.approved} text={r.approved ? "Approved" : "Pending"} />
                {r.featured ? <Badge ok text="Featured" /> : null}
              </div>
            </div>

            <p className="mt-3 text-sm text-slate-700 whitespace-pre-line">{r.message}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => patch(r._id, { approved: !r.approved })}
                className="px-3 py-2 rounded-xl border font-semibold hover:bg-slate-50"
              >
                {r.approved ? "Unapprove" : "Approve"}
              </button>

              <button
                onClick={() => patch(r._id, { featured: !r.featured })}
                className="px-3 py-2 rounded-xl border font-semibold hover:bg-slate-50"
              >
                {r.featured ? "Unfeature" : "Feature"}
              </button>

              <button
                onClick={() => del(r._id)}
                className="px-3 py-2 rounded-xl border font-semibold hover:bg-red-50 hover:border-red-200"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {!loading && items.length === 0 ? (
        <div className="mt-6 border rounded-2xl p-5 bg-slate-50 text-slate-700">
          No reviews yet.
        </div>
      ) : null}
    </div>
  );
}

function Badge({ ok, text }) {
  return (
    <span
      className={
        "text-xs font-semibold px-2 py-1 rounded-full " +
        (ok ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800")
      }
    >
      {text}
    </span>
  );
}
