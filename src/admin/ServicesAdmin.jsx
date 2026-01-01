import { useEffect, useState } from "react";
import adminHttp from "../api/adminHttp";

export default function ServicesAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // form
  const [name, setName] = useState("");
  const [category, setCategory] = useState("General");
  const [description, setDescription] = useState("");
  const [featured, setFeatured] = useState(false);
  const [active, setActive] = useState(true);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setErr("");
    setLoading(true);
    try {
      const { data } = await adminHttp.get("/api/admin/services");
      setItems(data || []);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const reset = () => {
    setName("");
    setCategory("General");
    setDescription("");
    setFeatured(false);
    setActive(true);
    setEditId(null);
  };

  const startEdit = (x) => {
    setEditId(x._id);
    setName(x.name || "");
    setCategory(x.category || "General");
    setDescription(x.description || "");
    setFeatured(!!x.featured);
    setActive(!!x.active);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    if (!name.trim()) return setErr("Service name is required.");

    setSaving(true);
    try {
      const payload = { name, category, description, featured, active };
      if (editId) await adminHttp.put(`/api/admin/services/${editId}`, payload);
      else await adminHttp.post("/api/admin/services", payload);

      await load();
      reset();
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const del = async (id) => {
    if (!confirm("Delete this service?")) return;
    try {
      await adminHttp.delete(`/api/admin/services/${id}`);
      setItems((p) => p.filter((x) => x._id !== id));
    } catch (e) {
      alert(e?.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold">Services</h1>
        <p className="text-slate-600 mt-1">Manage services shown on customer website.</p>
      </div>

      {err ? (
        <div className="border border-red-200 bg-red-50 text-red-700 rounded-2xl p-4">{err}</div>
      ) : null}

      <form onSubmit={submit} className="border rounded-3xl p-6 bg-white">
        <div className="flex items-center justify-between gap-3">
          <div className="font-extrabold text-lg">{editId ? "Edit service" : "Add service"}</div>
          {editId ? (
            <button type="button" onClick={reset} className="px-4 py-2 rounded-xl border font-semibold hover:bg-slate-50">
              Cancel Edit
            </button>
          ) : null}
        </div>

        <div className="mt-5 grid md:grid-cols-2 gap-4">
          <Field label="Name *">
            <input className="w-full border rounded-xl px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} />
          </Field>

          <Field label="Category">
            <input className="w-full border rounded-xl px-3 py-2" value={category} onChange={(e) => setCategory(e.target.value)} />
          </Field>

          <div className="md:col-span-2">
            <label className="text-sm font-semibold">Description</label>
            <textarea className="mt-2 w-full border rounded-2xl px-3 py-2 min-h-[90px]" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-4">
          <label className="inline-flex items-center gap-2 text-sm font-semibold">
            <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
            Featured
          </label>
          <label className="inline-flex items-center gap-2 text-sm font-semibold">
            <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
            Active
          </label>
        </div>

        <button disabled={saving} className="mt-6 px-5 py-3 rounded-xl bg-slate-900 text-white font-semibold hover:opacity-90 disabled:opacity-60">
          {saving ? "Saving…" : editId ? "Update" : "Create"}
        </button>
      </form>

      <div className="border rounded-3xl p-6 bg-white">
        <div className="font-extrabold text-lg">All services</div>
        {loading ? <p className="mt-4 text-slate-600">Loading…</p> : null}

        <div className="mt-5 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((x) => (
            <div key={x._id} className="border rounded-2xl p-4">
              <div className="font-extrabold">{x.name}</div>
              <div className="text-xs text-slate-600 mt-1">
                {x.category} {x.featured ? "• Featured" : ""} {!x.active ? "• Hidden" : ""}
              </div>
              {x.description ? <p className="mt-2 text-sm text-slate-700 line-clamp-3">{x.description}</p> : null}

              <div className="mt-4 flex gap-2">
                <button onClick={() => startEdit(x)} className="flex-1 px-3 py-2 rounded-xl border font-semibold hover:bg-slate-50">Edit</button>
                <button onClick={() => del(x._id)} className="flex-1 px-3 py-2 rounded-xl border font-semibold hover:bg-red-50 hover:border-red-200">Delete</button>
              </div>
            </div>
          ))}
        </div>

        {!loading && items.length === 0 ? <div className="mt-4 text-sm text-slate-600">No services yet.</div> : null}
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
