import { useEffect, useState } from "react";
import adminHttp from "../api/adminHttp";

const STATUSES = ["Received", "Designing", "Printing", "Ready", "OutForDelivery", "Completed", "Cancelled"];

export default function QuotesAdmin() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("All");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const load = async () => {
    setErr("");
    setLoading(true);
    try {
      const url = status === "All" ? "/api/admin/quotes" : `/api/admin/quotes?status=${encodeURIComponent(status)}`;
      const { data } = await adminHttp.get(url);
      setItems(data || []);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load quotes/orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [status]);

  const update = async (id, patch) => {
    try {
      const { data } = await adminHttp.patch(`/api/admin/quotes/${id}`, patch);
      setItems((prev) => prev.map((x) => (x._id === id ? data : x)));
    } catch (e) {
      alert(e?.response?.data?.message || "Update failed");
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold">Quotes / Orders</h1>
          <p className="text-slate-600 mt-1">Update status, add admin note, check customer files.</p>
        </div>

        <div className="flex gap-2 items-center">
          <select
            className="px-3 py-2 rounded-xl border font-semibold"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="All">All</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <button onClick={load} className="px-4 py-2 rounded-xl border font-semibold hover:bg-slate-50">
            Refresh
          </button>
        </div>
      </div>

      {err ? <div className="mt-6 border border-red-200 bg-red-50 text-red-700 rounded-2xl p-4">{err}</div> : null}
      {loading ? <p className="mt-6 text-slate-600">Loading…</p> : null}

      <div className="mt-6 space-y-4">
        {items.map((q) => (
          <div key={q._id} className="border rounded-3xl p-5 bg-white">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div>
                <div className="font-extrabold text-lg">{q.customerName}</div>
                <div className="text-sm text-slate-700 mt-1">
                  <b>Phone:</b> {q.phone} • <b>Contact:</b> {q.contactMethod}
                </div>
                <div className="text-sm text-slate-700 mt-1">
                  <b>Service:</b> {q.serviceName} • <b>Qty:</b> {q.quantity}
                </div>
                <div className="text-sm text-slate-700 mt-1">
                  <b>Fulfillment:</b> {q.fulfillment}
                  {q.fulfillment === "Delivery" ? ` • ${q.deliveryArea} • Fee LKR ${q.deliveryFeeLkr}` : ""}
                </div>
                <div className="text-xs text-slate-500 mt-2">
                  Created: {new Date(q.createdAt).toLocaleString()}
                </div>
              </div>

              <div className="min-w-[260px] space-y-3">
                <div>
                  <label className="text-sm font-semibold">Status</label>
                  <select
                    className="mt-2 w-full border rounded-xl px-3 py-2"
                    value={q.status}
                    onChange={(e) => update(q._id, { status: e.target.value })}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold">Admin note</label>
                  <textarea
                    className="mt-2 w-full border rounded-2xl px-3 py-2 min-h-[80px]"
                    defaultValue={q.adminNote || ""}
                    placeholder="Price / paper / deadline / delivery notes..."
                    onBlur={(e) => update(q._id, { adminNote: e.target.value })}
                  />
                  <div className="text-xs text-slate-500 mt-1">Tip: note saves when you click outside.</div>
                </div>
              </div>
            </div>

            {/* Specs */}
            {(q.size || q.color || q.paper || q.finishing || q.notes) ? (
              <div className="mt-4 border-t pt-4 grid md:grid-cols-2 gap-3 text-sm text-slate-700">
                <div><b>Size:</b> {q.size || "-"}</div>
                <div><b>Color:</b> {q.color || "-"}</div>
                <div><b>Paper:</b> {q.paper || "-"}</div>
                <div><b>Finishing:</b> {q.finishing || "-"}</div>
                <div className="md:col-span-2"><b>Notes:</b> {q.notes || "-"}</div>
              </div>
            ) : null}

            {/* Files */}
            <div className="mt-4 border-t pt-4">
              <div className="font-semibold">Files</div>
              {q.files && q.files.length ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {q.files.map((f, idx) => (
                    <a
                      key={idx}
                      className="px-3 py-2 rounded-xl border text-sm font-semibold hover:bg-slate-50"
                      href={`http://localhost:5000${f.path}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {f.filename}
                    </a>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-slate-600 mt-1">No files uploaded.</div>
              )}
            </div>
          </div>
        ))}

        {!loading && items.length === 0 ? (
          <div className="border rounded-2xl p-5 bg-slate-50 text-slate-700">
            No quotes/orders found for this filter.
          </div>
        ) : null}
      </div>
    </div>
  );
}
