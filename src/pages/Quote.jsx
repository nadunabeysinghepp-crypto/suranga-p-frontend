import { useEffect, useMemo, useState } from "react";
import http from "../api/adminHttp";

const PHONE = "0662285425";

// IMPORTANT: WhatsApp must be in international format without +, spaces
// If your WhatsApp is NOT this number, replace it later.
const WHATSAPP = "94772285425";

export default function Quote() {
  const [services, setServices] = useState([]);
  const [areas, setAreas] = useState([]);

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState("");
  const [okMsg, setOkMsg] = useState("");

  // form fields
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [contactMethod, setContactMethod] = useState("WhatsApp");

  const [serviceName, setServiceName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [paper, setPaper] = useState("");
  const [finishing, setFinishing] = useState("");
  const [notes, setNotes] = useState("");

  const [fulfillment, setFulfillment] = useState("Pickup"); // Pickup | Delivery
  const [deliveryArea, setDeliveryArea] = useState("");
  const [files, setFiles] = useState([]);

  useEffect(() => {
    (async () => {
      setErr("");
      setLoading(true);
      try {
        const [sRes, aRes] = await Promise.all([
          http.get("/api/services"),
          http.get("/api/delivery-areas"),
        ]);
        setServices(sRes.data || []);
        setAreas(aRes.data || []);

        // preselect first service if none selected
        if (!serviceName && (sRes.data || []).length > 0) {
          setServiceName(sRes.data[0].name);
        }
      } catch (e) {
        setErr(e?.response?.data?.message || "Failed to load quote form data");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedAreaObj = useMemo(() => {
    return areas.find((x) => x.area === deliveryArea) || null;
  }, [areas, deliveryArea]);

  const deliveryFeeLkr = useMemo(() => {
    if (fulfillment !== "Delivery") return 0;
    return selectedAreaObj?.feeLkr || 0;
  }, [fulfillment, selectedAreaObj]);

  const onFilesChange = (e) => {
    const list = Array.from(e.target.files || []);
    // allow max 5 (backend also enforces max 5)
    setFiles(list.slice(0, 5));
  };

  const validate = () => {
    if (!customerName.trim()) return "Please enter your name.";
    if (!phone.trim()) return "Please enter your phone number.";
    if (!serviceName.trim()) return "Please select a service.";
    if (Number(quantity) <= 0) return "Quantity must be at least 1.";
    if (fulfillment === "Delivery" && !deliveryArea) return "Please select a delivery area.";
    return "";
  };

  const submit = async (e) => {
    e.preventDefault();
    setOkMsg("");
    setErr("");

    const v = validate();
    if (v) {
      setErr(v);
      return;
    }

    setSending(true);
    try {
      const fd = new FormData();
      fd.append("customerName", customerName);
      fd.append("phone", phone);
      fd.append("contactMethod", contactMethod);

      fd.append("serviceName", serviceName);
      fd.append("quantity", String(quantity));
      fd.append("size", size);
      fd.append("color", color);
      fd.append("paper", paper);
      fd.append("finishing", finishing);
      fd.append("notes", notes);

      fd.append("fulfillment", fulfillment);
      fd.append("deliveryArea", fulfillment === "Delivery" ? deliveryArea : "");
      fd.append("deliveryFeeLkr", String(fulfillment === "Delivery" ? deliveryFeeLkr : 0));

      files.forEach((f) => fd.append("files", f));

      const { data } = await http.post("/api/quotes", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setOkMsg(`✅ Quote request sent successfully. Reference ID: ${data?.id || "N/A"}`);

      // reset some fields (keep name/phone for convenience)
      setSize("");
      setColor("");
      setPaper("");
      setFinishing("");
      setNotes("");
      setFiles([]);
      if (fulfillment === "Delivery") setDeliveryArea("");
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Failed to submit quote request");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="container-pad py-10">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Get a Quote</h1>
          <p className="text-slate-600 mt-1">
            Send your requirements. We’ll confirm price and delivery quickly via WhatsApp or call.
          </p>
        </div>

      </div>

      {loading ? <p className="mt-6 text-slate-600">Loading…</p> : null}

      {err ? (
        <div className="mt-6 border border-red-200 bg-red-50 text-red-700 rounded-2xl p-4">
          {err}
        </div>
      ) : null}

      {okMsg ? (
        <div className="mt-6 border border-emerald-200 bg-emerald-50 text-emerald-700 rounded-2xl p-4">
          {okMsg}
        </div>
      ) : null}

      <div className="mt-8 grid lg:grid-cols-3 gap-6">
        {/* FORM */}
        <form onSubmit={submit} className="lg:col-span-2 border border-red-100 rounded-3xl p-6 bg-white">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Your Name *">
              <input
                className="w-full border border-red-100 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-red-200"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter your name"
              />
            </Field>

            <Field label="Phone *">
              <input
                className="w-full border border-red-100 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-red-200"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="07XXXXXXXX"
              />
            </Field>

            <Field label="Preferred Contact">
              <select
                className="w-full border border-red-100 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-red-200"
                value={contactMethod}
                onChange={(e) => setContactMethod(e.target.value)}
              >
                <option>WhatsApp</option>
                <option>Call</option>
              </select>
            </Field>

            <Field label="Service *">
              <select
                className="w-full border border-red-100 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-red-200"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
              >
                {services.map((s) => (
                  <option key={s._id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Quantity">
              <input
                type="number"
                min="1"
                className="w-full border border-red-100 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-red-200"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </Field>

            <Field label="Size">
              <input
                className="w-full border border-red-100 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-red-200"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                placeholder="A4 / A3 / 3.5x2 inch / Custom"
              />
            </Field>

            <Field label="Color">
              <input
                className="w-full border border-red-100 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-red-200"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="Color / Black & White / Single side / Both sides"
              />
            </Field>

            <Field label="Paper / Material">
              <input
                className="w-full border border-red-100 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-red-200"
                value={paper}
                onChange={(e) => setPaper(e.target.value)}
                placeholder="Art paper / Glossy / Matte / Card / etc."
              />
            </Field>

            <Field label="Finishing">
              <input
                className="w-full border border-red-100 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-red-200"
                value={finishing}
                onChange={(e) => setFinishing(e.target.value)}
                placeholder="Lamination / Binding / Cutting / Folding"
              />
            </Field>

            <Field label="Pickup or Delivery">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setFulfillment("Pickup")}
                  className={
                    "flex-1 px-3 py-2 rounded-xl border font-semibold " +
                    (fulfillment === "Pickup"
                      ? "bg-slate-900 text-white border-slate-900"
                      : "border-red-200 hover:bg-red-50")
                  }
                >
                  Pickup
                </button>
                <button
                  type="button"
                  onClick={() => setFulfillment("Delivery")}
                  className={
                    "flex-1 px-3 py-2 rounded-xl border font-semibold " +
                    (fulfillment === "Delivery"
                      ? "bg-slate-900 text-white border-slate-900"
                      : "border-red-200 hover:bg-red-50")
                  }
                >
                  Delivery
                </button>
              </div>
            </Field>

            {fulfillment === "Delivery" ? (
              <Field label="Delivery Area (Matale District) *">
                <select
                  className="w-full border border-red-100 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-red-200"
                  value={deliveryArea}
                  onChange={(e) => setDeliveryArea(e.target.value)}
                >
                  <option value="">Select area…</option>
                  {areas.map((a) => (
                    <option key={a._id} value={a.area}>
                      {a.area} — LKR {a.feeLkr}
                    </option>
                  ))}
                </select>
              </Field>
            ) : null}
          </div>

          <div className="mt-4">
            <label className="text-sm font-semibold text-slate-900">Notes</label>
            <textarea
              className="mt-2 w-full border border-red-100 rounded-2xl px-3 py-2 min-h-[110px] outline-none focus:ring-2 focus:ring-red-200"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any details: design needed, urgent, sample link, etc."
            />
          </div>

          <div className="mt-4">
            <label className="text-sm font-semibold text-slate-900">
              Upload file (optional) — PDF/JPG/PNG/ZIP (max 5 files, 20MB each)
            </label>
            <input
              type="file"
              multiple
              onChange={onFilesChange}
              className="mt-2 block w-full text-sm"
              accept=".pdf,.jpg,.jpeg,.png,.webp,.zip"
            />
            {files.length ? (
              <div className="mt-2 text-sm text-slate-700">
                Selected: {files.map((f) => f.name).join(", ")}
              </div>
            ) : null}
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="text-sm text-slate-600">
              {fulfillment === "Delivery" ? (
                <span>
                  Estimated delivery fee: <b className="text-slate-900">LKR {deliveryFeeLkr}</b>
                </span>
              ) : (
                <span>Pickup from shop (Dambulla)</span>
              )}
            </div>

            <button
              disabled={sending}
              className="px-5 py-3 rounded-xl bg-red-600 text-white font-semibold hover:opacity-90 disabled:opacity-60"
              type="submit"
            >
              {sending ? "Sending…" : "Submit Quote Request"}
            </button>
          </div>
        </form>

        {/* SIDE INFO */}
        <aside className="border border-red-100 rounded-3xl p-6 bg-red-50">
          <div className="font-extrabold text-lg text-slate-900">File guidelines</div>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            <li>• Best: PDF (print-ready)</li>
            <li>• Images: high resolution</li>
            <li>• If you need design, mention it in notes</li>
            <li>• For delivery, select your Matale area</li>
          </ul>

          <div className="mt-6 border-t border-red-100 pt-5">
            <div className="font-semibold text-slate-900">Need fast help?</div>
            <div className="text-sm text-slate-700 mt-1">
              Message us on WhatsApp and send your file.
            </div>

            <div className="mt-3 flex gap-2">
              <a
                className="flex-1 text-center px-3 py-2 rounded-xl bg-red-600 text-white font-semibold hover:opacity-90"
                href={`https://wa.me/${WHATSAPP}`}
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp
              </a>
              <a
                className="flex-1 text-center px-3 py-2 rounded-xl border border-red-200 font-semibold hover:bg-white"
                href={`tel:${PHONE}`}
              >
                Call
              </a>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="text-sm font-semibold text-slate-900">{label}</label>
      <div className="mt-2">{children}</div>
    </div>
  );
}
