import { useEffect, useState } from "react";
import adminHttp from "../api/adminHttp";

export default function DeliveryAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [area, setArea] = useState("");
  const [feeLkr, setFeeLkr] = useState(300);
  const [active, setActive] = useState(true);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setErr("");
    setLoading(true);
    try {
      const { data } = await adminHttp.get("/api/admin/delivery-areas");
      setItems(data || []);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load delivery areas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const reset = () => {
    setArea("");
    setFeeLkr(300);
    setActive(true);
    setEditId(null);
  };

  const startEdit = (x) => {
    setEditId(x._id);
    setArea(x.area || "");
    setFeeLkr(x.feeLkr || 0);
    setActive(!!x.active);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    if (!area.trim()) return setErr("Area name is required.");
    if (Number(feeLkr) < 0) return setErr("Fee must be 0 or more.");

    setSaving(true);
    try {
      const payload = { area, feeLkr: Number(feeLkr), active };
      if (editId) await adminHttp.put(`/api/admin/delivery-areas/${editId}`, payload);
      else await adminHttp.post("/api/admin/delivery-areas", payload);

      await load();
      reset();
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const del = async (id) => {
    if (!confirm("Delete this delivery area?")) return;
    try {
      await adminHttp.delete(`/api/admin/delivery-areas/${id}`);
      setItems((p) => p.filter((x) => x._id !== id));
    } catch (e) {
      alert(e?.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold">Delivery Areas & Fees</h1>
        <p className="text-slate-600 mt-1">Matale District coverage (used in Quote form).</p>
      </div>

      {err ? <div className="border border-red-200 bg-red-50 text-red-700 rounded-2xl p-4">{err}</div> : null}

      <form onSubmit={submit} className="border rounded-3xl p-6 bg-white">
        <div className="flex items-center justify-between gap-3">
          <div className="font-extrabold text-lg">{editId ? "Edit delivery area" : "Add delivery area"}</div>
          {editId ? (
            <button type="button" onClick={reset} className="px-4 py-2 rounded-xl border font-semibold hover:bg-slate-50">
              Cancel Edit
            </button>
          ) : null}
        </div>

        <div className="mt-5 grid md:grid-cols-3 gap-4">
          <Field label="Area (town/village) *">
            <input className="w-full border rounded-xl px-3 py-2" value={area} onChange={(e) => setArea(e.target.value)} placeholder="e.g., Dambulla / Matale / Sigiriya" />
          </Field>

          <Field label="Fee (LKR) *">
            <input type="number" min="0" className="w-full border rounded-xl px-3 py-2" value={feeLkr} onChange={(e) => setFeeLkr(e.target.value)} />
          </Field>

          <Field label="Active">
            <label className="inline-flex items-center gap-2 mt-2 text-sm font-semibold">
              <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
              Visible for customers
            </label>
          </Field>
        </div>

        <button disabled={saving} className="mt-6 px-5 py-3 rounded-xl bg-slate-900 text-white font-semibold hover:opacity-90 disabled:opacity-60">
          {saving ? "Saving…" : editId ? "Update" : "Create"}
        </button>
      </form>

      <div className="border rounded-3xl p-6 bg-white">
        <div className="font-extrabold text-lg">All areas</div>
        {loading ? <p className="mt-4 text-slate-600">Loading…</p> : null}

        <div className="mt-5 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((x) => (
            <div key={x._id} className="border rounded-2xl p-4">
              <div className="font-extrabold">{x.area}</div>
              <div className="text-xs text-slate-600 mt-1">
                LKR {x.feeLkr} {!x.active ? "• Hidden" : ""}
              </div>

              <div className="mt-4 flex gap-2">
                <button onClick={() => startEdit(x)} className="flex-1 px-3 py-2 rounded-xl border font-semibold hover:bg-slate-50">Edit</button>
                <button onClick={() => del(x._id)} className="flex-1 px-3 py-2 rounded-xl border font-semibold hover:bg-red-50 hover:border-red-200">Delete</button>
              </div>
            </div>
          ))}
        </div>

        {!loading && items.length === 0 ? <div className="mt-4 text-sm text-slate-600">No areas yet.</div> : null}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="text-sm font-semibold">{label}</label>
      <div className="mt-2">{children}</div>
    </div>
  );
}
