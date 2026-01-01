import { useEffect, useMemo, useState } from "react";
import http from "../api/adminHttp";
import { Link } from "react-router-dom";

export default function Portfolio() {
  const [items, setItems] = useState([]);
  const [cat, setCat] = useState("All");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      setErr("");
      setLoading(true);
      try {
        const { data } = await http.get("/api/portfolio");
        setItems(data || []);
      } catch (e) {
        setErr(e?.response?.data?.message || "Failed to load portfolio");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const categories = useMemo(() => {
    const set = new Set(items.map((x) => x.category).filter(Boolean));
    return ["All", ...Array.from(set).sort()];
  }, [items]);

  const filtered = useMemo(() => {
    if (cat === "All") return items;
    return items.filter((x) => x.category === cat);
  }, [items, cat]);

  return (
    <div className="container-pad py-10">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Portfolio</h1>
          <p className="text-slate-600 mt-1">
            Real print work from Suranga Printers – Fast Print (Dambulla).
          </p>
        </div>

        <Link
          to="/quote"
          className="inline-flex px-4 py-2 rounded-xl bg-red-600 text-white font-semibold hover:opacity-90"
        >
          Get a Quote
        </Link>
      </div>

      {/* FILTER */}
      <div className="mt-6 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={
              "px-3 py-2 rounded-xl border text-sm font-semibold " +
              (cat === c
                ? "bg-red-600 text-white border-red-600"
                : "border-red-200 hover:bg-red-50")
            }
          >
            {c}
          </button>
        ))}
      </div>

      {loading ? <p className="mt-6 text-slate-600">Loading…</p> : null}
      {err ? <p className="mt-6 text-red-600">{err}</p> : null}

      {/* GRID */}
      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((x) => (
          <div
            key={x._id}
            className="group border border-red-100 rounded-3xl overflow-hidden bg-white"
          >
            <div className="h-44 bg-red-50 overflow-hidden">
              <img
                src={`http://localhost:5000${x.imageUrl}`}
                alt={x.title}
                className="w-full h-full object-cover group-hover:scale-[1.03] transition"
                loading="lazy"
              />
            </div>

            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-extrabold text-slate-900 leading-snug">
                    {x.title}
                  </div>
                  <div className="text-xs text-slate-600 mt-1">
                    {x.category}
                  </div>
                </div>

                {x.tag ? (
                  <span className="text-xs font-semibold px-2 py-1 rounded-full bg-red-100 text-red-800">
                    {x.tag}
                  </span>
                ) : null}
              </div>

              {x.description ? (
                <p className="mt-3 text-sm text-slate-700">
                  {x.description}
                </p>
              ) : null}

              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-slate-600">
                  Fast Print • Dambulla
                </div>
                <Link
                  to="/quote"
                  className="text-sm font-semibold underline decoration-red-300 hover:decoration-red-600"
                >
                  Request →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* EMPTY STATE */}
      {!loading && !err && filtered.length === 0 ? (
        <div className="mt-10 border border-red-100 rounded-3xl p-6 bg-red-50">
          <div className="font-semibold text-slate-900">
            No portfolio items yet.
          </div>
          <div className="text-sm text-slate-600 mt-1">
            Add items from the Admin Panel (Portfolio → Upload).
          </div>
        </div>
      ) : null}
    </div>
  );
}
