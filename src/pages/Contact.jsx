import { useState } from "react";

const SHOP_NAME = "Suranga Printers – Fast Print";
const PHONE_DISPLAY = "0662 285 425";
const PHONE_TEL = "0662285425";

// WhatsApp must be international format without + or spaces
const WHATSAPP = "94711017979";

const ADDRESS = "Kandy - Jaffna Hwy, Dambulla";

export default function Contact() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    const text = encodeURIComponent(
      `Hello ${SHOP_NAME},\n\nName: ${name || "-"}\nPhone: ${phone || "-"}\n\nMessage:\n${msg || "-"}`
    );
    window.open(`https://wa.me/${WHATSAPP}?text=${text}`, "_blank");
    setSent(true);
  };

  return (
    <div>
      {/* ================= HERO SECTION ================= */}
      <section className="bg-gradient-to-b from-red-50 to-white border-b border-red-100">
        <div className="container-pad py-12 md:py-14">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-semibold border border-red-200">
                Contact • Fast Response • Matale District
              </div>

              <h1 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
                Get in <span className="text-red-600">Touch</span>
              </h1>

              <p className="mt-4 text-slate-700 text-lg leading-relaxed">
                Fast support via WhatsApp or call. Pickup or Matale District delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= MAIN CONTENT ================= */}
      <div className="container-pad py-10">
        <div className="mt-8 grid lg:grid-cols-3 gap-6">
          {/* LEFT INFO */}
          <div className="space-y-4">
            <InfoCard title={SHOP_NAME}>
              <div className="text-sm text-slate-700">
                <div className="font-semibold text-slate-900">Address</div>
                <div className="mt-1">{ADDRESS}</div>

                <div className="mt-4 font-semibold text-slate-900">Phone</div>
                <a className="mt-1 inline-block underline" href={`tel:${PHONE_TEL}`}>
                  {PHONE_DISPLAY}
                </a>

                <div className="mt-4 font-semibold text-slate-900">WhatsApp</div>
                <a
                  className="mt-1 inline-block underline"
                  href={`https://wa.me/${WHATSAPP}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Chat on WhatsApp
                </a>
              </div>
            </InfoCard>

            <InfoCard title="Business Hours">
              <div className="text-sm text-slate-700 space-y-2">
                <Row k="Mon – Sat" v="8:30 AM – 7:00 PM" />
                <Row k="Sunday" v="9:00 AM – 1:00 PM" />
              </div>
            </InfoCard>

            <InfoCard title="Quick Notes">
              <ul className="text-sm text-slate-700 space-y-2">
                <li>• Best file: PDF (print-ready)</li>
                <li>• Share Matale area + landmark for delivery</li>
                <li>• Mention “URGENT” for fast jobs</li>
              </ul>
            </InfoCard>
          </div>

          {/* MAP + FORM */}
          <div className="lg:col-span-2 border border-red-100 rounded-3xl overflow-hidden bg-white">
            {/* MAP */}
            <div className="p-5 border-b border-red-100">
              <div className="font-extrabold text-lg text-slate-900">
                Find us on the map
              </div>
              <div className="text-sm text-slate-600 mt-1">{ADDRESS}</div>
            </div>

            <div className="h-[360px] bg-slate-100">
              <iframe
                title="Suranga Printers Map"
                className="w-full h-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                  "Suranga Printers Fast Print, " + ADDRESS
                )}&output=embed`}
              />
            </div>

            {/* INQUIRY FORM */}
            <div className="p-6">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <div className="font-extrabold text-lg text-slate-900">
                    Send an inquiry
                  </div>
                  <div className="text-sm text-slate-600 mt-1">
                    This will open WhatsApp with your message.
                  </div>
                </div>
                {sent && (
                  <span className="text-xs font-semibold px-2 py-1 rounded-full bg-red-100 text-red-800 border border-red-200">
                    Ready to send
                  </span>
                )}
              </div>

              <form onSubmit={submit} className="mt-4 grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold">Your name</label>
                  <input
                    className="mt-2 w-full border border-red-100 rounded-xl px-3 py-2 focus:ring-2 focus:ring-red-200 outline-none"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold">Phone</label>
                  <input
                    className="mt-2 w-full border border-red-100 rounded-xl px-3 py-2 focus:ring-2 focus:ring-red-200 outline-none"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="07XXXXXXXX"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-semibold">Message</label>
                  <textarea
                    className="mt-2 w-full border border-red-100 rounded-2xl px-3 py-2 min-h-[120px] focus:ring-2 focus:ring-red-200 outline-none"
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    placeholder="Service, quantity, size, delivery area..."
                  />
                </div>

                <div className="md:col-span-2 flex gap-2">
                  <button className="px-5 py-3 rounded-xl bg-red-600 text-white font-semibold hover:opacity-90">
                    Send via WhatsApp
                  </button>
                  <a
                    className="px-5 py-3 rounded-xl border border-red-200 font-semibold hover:bg-red-50"
                    href={`tel:${PHONE_TEL}`}
                  >
                    Call Instead
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* BOTTOM CTA */}
        <div className="mt-10 border border-red-200 rounded-3xl p-6 bg-red-50 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="text-xl font-extrabold text-slate-900">
              Need a price quickly?
            </div>
            <div className="text-slate-600 mt-1">
              Use the Quote form and upload your file.
            </div>
          </div>
          <a
            href="/quote"
            className="px-5 py-3 rounded-xl bg-slate-900 text-white font-semibold hover:opacity-90 text-center"
          >
            Get a Quote
          </a>
        </div>
      </div>
    </div>
  );
}

/* ---------- Helpers ---------- */

function InfoCard({ title, children }) {
  return (
    <div className="border border-red-100 rounded-3xl p-6 bg-white">
      <div className="font-extrabold text-lg text-slate-900">{title}</div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function Row({ k, v }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="text-slate-600">{k}</div>
      <div className="font-semibold text-slate-900">{v}</div>
    </div>
  );
}
