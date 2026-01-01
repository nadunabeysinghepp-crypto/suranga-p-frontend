import { useEffect, useState } from "react";
import adminHttp from "../api/adminHttp";

export default function SettingsAdmin() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  const [shopName, setShopName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [hours, setHours] = useState({
    monSat: "8:30 AM – 7:00 PM",
    sun: "9:00 AM – 1:00 PM",
  });

  const load = async () => {
    setErr("");
    setOk("");
    setLoading(true);
    try {
      const { data } = await adminHttp.get("/api/admin/settings");
      setShopName(data?.shopName || "Suranga Printers – Fast Print");
      setAddress(data?.address || "Kandy - Jaffna Hwy, Dambulla");
      setPhone(data?.phone || "0662285425");
      setWhatsapp(data?.whatsapp || "9477XXXXXXX");
      setHours(data?.hours || hours);
    } catch (e) {
      setErr(e?.response?.data?.message || "Settings endpoint not found (backend needed)");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const save = async (e) => {
    e.preventDefault();
    setErr("");
    setOk("");

    setSaving(true);
    try {
      await adminHttp.put("/api/admin/settings", {
        shopName,
        address,
        phone,
        whatsapp,
        hours,
      });
      setOk("✅ Settings saved");
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold">Settings</h1>
          <p className="text-slate-600 mt-1">Edit contact details without changing code.</p>
        </div>
        <button onClick={load} className="px-4 py-2 rounded-xl border font-semibold hover:bg-slate-50">
          Refresh
        </button>
      </div>

      {loading ? <p className="mt-6 text-slate-600">Loading…</p> : null}
      {err ? <div className="mt-6 border border-red-200 bg-red-50 text-red-700 rounded-2xl p-4">{err}</div> : null}
      {ok ? <div className="mt-6 border border-green-200 bg-green-50 text-green-700 rounded-2xl p-4">{ok}</div> : null}

      <form onSubmit={save} className="mt-6 border rounded-3xl p-6 bg-white max-w-2xl">
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Shop Name">
            <input className="w-full border rounded-xl px-3 py-2" value={shopName} onChange={(e) => setShopName(e.target.value)} />
          </Field>

          <Field label="Phone (digits only)">
            <input className="w-full border rounded-xl px-3 py-2" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </Field>

          <Field label="WhatsApp (94XXXXXXXXX)">
            <input className="w-full border rounded-xl px-3 py-2" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
          </Field>

          <div className="md:col-span-2">
            <label className="text-sm font-semibold">Address</label>
            <input className="mt-2 w-full border rounded-xl px-3 py-2" value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>

          <Field label="Hours (Mon–Sat)">
            <input className="w-full border rounded-xl px-3 py-2" value={hours.monSat} onChange={(e) => setHours((p) => ({ ...p, monSat: e.target.value }))} />
          </Field>

          <Field label="Hours (Sunday)">
            <input className="w-full border rounded-xl px-3 py-2" value={hours.sun} onChange={(e) => setHours((p) => ({ ...p, sun: e.target.value }))} />
          </Field>
        </div>

        <button disabled={saving} className="mt-6 px-5 py-3 rounded-xl bg-slate-900 text-white font-semibold hover:opacity-90 disabled:opacity-60">
          {saving ? "Saving…" : "Save Settings"}
        </button>

        <div className="mt-3 text-xs text-slate-500">
          If you see “endpoint not found”, your backend does not have settings routes yet — I’ll add them.
        </div>
      </form>
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
