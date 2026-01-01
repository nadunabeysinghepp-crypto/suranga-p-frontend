import { useEffect, useMemo, useState } from "react";
import adminHttp from "../api/adminHttp";

export default function PortfolioAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // form
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Marketing");
  const [tag, setTag] = useState("Popular");
  const [description, setDescription] = useState("");
  const [featured, setFeatured] = useState(false);
  const [active, setActive] = useState(true);
  const [image, setImage] = useState(null);

  // edit state
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setErr("");
    setLoading(true);
    try {
      const { data } = await adminHttp.get("/api/admin/portfolio");
      setItems(data || []);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load portfolio");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const categories = useMemo(() => {
    const base = ["Business", "Marketing", "Books", "Documents", "Photo", "Sublimation", "General"];
    // keep base, but also include any existing categories
    const set = new Set([...base, ...items.map((x) => x.category).filter(Boolean)]);
    return Array.from(set);
  }, [items]);

  const resetForm = () => {
    setTitle("");
    setCategory("Marketing");
    setTag("Popular");
    setDescription("");
    setFeatured(false);
    setActive(true);
    setImage(null);
    setEditId(null);
  };

  const startEdit = (x) => {
    setEditId(x._id);
    setTitle(x.title || "");
    setCategory(x.category || "General");
    setTag(x.tag || "");
    setDescription(x.description || "");
    setFeatured(!!x.featured);
    setActive(!!x.active);
    setImage(null); // optional replace
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const del = async (id) => {
    if (!confirm("Delete this portfolio item?")) return;
    try {
      await adminHttp.delete(`/api/admin/portfolio/${id}`);
      setItems((prev) => prev.filter((p) => p._id !== id));
    } catch (e) {
      alert(e?.response?.data?.message || "Delete failed");
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr("");

    if (!title.trim()) return setErr("Title is required.");
    if (!editId && !image) return setErr("Image is required for a new item.");

    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("title", title);
      fd.append("category", category);
      fd.append("tag", tag);
      fd.append("description", description);
      fd.append("featured", String(featured));
      fd.append("active", String(active));
      if (image) fd.append("image", image);

      if (editId) {
        await adminHttp.put(`/api/admin/portfolio/${editId}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await adminHttp.post(`/api/admin/portfolio`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      await load();
      resetForm();
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold">Portfolio Manager</h1>
        <p className="text-slate-600 mt-1">
          Upload real print photos (business cards, posters, books, sublimation, etc.).
        </p>
      </div>

      {err ? (
        <div className="border border-red-200 bg-red-50 text-red-700 rounded-2xl p-4">
          {err}
        </div>
      ) : null}

      {/* Upload / Edit Form */}
      <form onSubmit={submit} className="border rounded-3xl p-6 bg-white">
        <div className="flex items-center justify-between gap-3">
          <div className="font-extrabold text-lg">
            {editId ? "Edit Portfolio Item" : "Add New Portfolio Item"}
          </div>
          {editId ? (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 rounded-xl border font-semibold hover:bg-slate-50"
            >
              Cancel Edit
            </button>
          ) : null}
        </div>

        <div className="mt-5 grid md:grid-cols-2 gap-4">
          <Field label="Title *">
            <input
              className="w-full border rounded-xl px-3 py-2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Business Cards (Matte Lamination)"
            />
          </Field>

          <Field label="Category">
            <select
              className="w-full border rounded-xl px-3 py-2"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </Field>

          <Field label="Tag (optional)">
            <input
              className="w-full border rounded-xl px-3 py-2"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              placeholder="Popular / Fast / Premium / Custom"
            />
          </Field>

          <Field label={editId ? "Replace Image (optional)" : "Image *"}>
            <input
              type="file"
              accept="image/*"
              className="w-full text-sm"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
            />
            <div className="text-xs text-slate-600 mt-1">
              Tip: upload clear photo (good lighting) for premium look.
            </div>
          </Field>
        </div>

        <div className="mt-4">
          <label className="text-sm font-semibold">Description (optional)</label>
          <textarea
            className="mt-2 w-full border rounded-2xl px-3 py-2 min-h-[90px]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short note about paper/finish/size…"
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-4">
          <label className="inline-flex items-center gap-2 text-sm font-semibold">
            <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
            Featured
          </label>
          <label className="inline-flex items-center gap-2 text-sm font-semibold">
            <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
            Active (visible to customers)
          </label>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            disabled={saving}
            className="px-5 py-3 rounded-xl bg-slate-900 text-white font-semibold hover:opacity-90 disabled:opacity-60"
          >
            {saving ? "Saving…" : editId ? "Update Item" : "Upload Item"}
          </button>
        </div>
      </form>

      {/* List */}
      <div className="border rounded-3xl p-6 bg-white">
        <div className="font-extrabold text-lg">All Portfolio Items</div>

        {loading ? <p className="mt-4 text-slate-600">Loading…</p> : null}

        <div className="mt-5 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((x) => (
            <div key={x._id} className="border rounded-2xl overflow-hidden">
              <div className="h-36 bg-slate-100 overflow-hidden">
                <img
                  src={`http://localhost:5000${x.imageUrl}`}
                  alt={x.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-4">
                <div className="font-extrabold">{x.title}</div>
                <div className="text-xs text-slate-600 mt-1">
                  {x.category} {x.tag ? `• ${x.tag}` : ""} {x.featured ? "• Featured" : ""}{" "}
                  {!x.active ? "• Hidden" : ""}
                </div>

                {x.description ? (
                  <p className="text-sm text-slate-700 mt-2 line-clamp-3">{x.description}</p>
                ) : null}

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => startEdit(x)}
                    className="flex-1 px-3 py-2 rounded-xl border font-semibold hover:bg-slate-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => del(x._id)}
                    className="flex-1 px-3 py-2 rounded-xl border font-semibold hover:bg-red-50 hover:border-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {!loading && items.length === 0 ? (
          <div className="mt-4 text-sm text-slate-600">No items yet. Upload your first photo above.</div>
        ) : null}
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
