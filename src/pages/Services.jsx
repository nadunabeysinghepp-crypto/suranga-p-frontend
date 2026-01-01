import { useEffect, useState } from "react";
import http from "../api/adminHttp";
import ServiceCard from "../components/ServiceCard";
import { Link } from "react-router-dom";

const PHONE = "0662285425";
const WHATSAPP = "94772285425"; // change if needed

export default function Services() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await http.get("/api/services");
        setItems(data);
      } catch (e) {
        setErr(e?.response?.data?.message || "Failed to load services");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div>
      {/* HERO (only UI) */}
      <section className="bg-gradient-to-b from-red-50 to-white border-b border-red-100">
        <div className="container-pad py-12 md:py-14">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-semibold border border-red-200">
                Suranga Printers • Services • Matale District Delivery
              </div>

              <h1 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
                Explore Our <span className="text-red-600">Printing Services</span>
              </h1>

              <p className="mt-4 text-slate-700 text-lg leading-relaxed">
                Business cards, brochures, posters, book printing, binding, photo printing, dye sublimation and more.
                Send your details and get a quick quote.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/quote"
                  className="px-5 py-3 rounded-xl bg-slate-900 text-white font-semibold hover:opacity-90"
                >
                  Get a Quote
                </Link>

                <a
                  href={`https://wa.me/${WHATSAPP}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-3 rounded-xl bg-red-600 text-white font-semibold hover:opacity-90"
                >
                  WhatsApp Now
                </a>

                <a
                  href={`tel:${PHONE}`}
                  className="px-5 py-3 rounded-xl border border-red-200 font-semibold hover:bg-red-50"
                >
                  Call
                </a>
              </div>

              {/* Optional status badges (same backend logic, just nicer UI) */}
              <div className="mt-6 flex flex-wrap gap-2">
                {loading ? (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-red-50 text-slate-700 border border-red-100">
                    Loading services…
                  </span>
                ) : null}

                {err ? (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200">
                    {err}
                  </span>
                ) : null}

                {!loading && !err ? (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white text-slate-700 border border-red-100">
                    {items.length} services available
                  </span>
                ) : null}
              </div>
            </div>

            {/* Right side card (no backend, just UI) */}
            <div className="relative">
              <div className="absolute -inset-3 bg-gradient-to-r from-red-200/50 via-pink-200/40 to-amber-200/40 blur-2xl rounded-[2.5rem]" />
              <div className="relative rounded-[2.5rem] border border-red-200 bg-white shadow-lg p-6 md:p-8">
                <div className="font-extrabold text-slate-900 text-xl">
                  Fast Response
                </div>
                <p className="text-slate-600 mt-2">
                  Share size, quantity, paper type and finishing. We reply with price + timeline.
                </p>

                <div className="mt-5 grid sm:grid-cols-3 gap-3">
                  <MiniStat title="Quality" desc="Premium finishing" />
                  <MiniStat title="Speed" desc="Same/next day" />
                  <MiniStat title="Delivery" desc="Matale District" />
                </div>

                <Link
                  to="/quote"
                  className="mt-6 inline-flex px-5 py-3 rounded-xl bg-slate-900 text-white font-semibold hover:opacity-90"
                >
                  Request Quote →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES LIST (your original page content, backend unchanged) */}
      <section className="container-pad py-10">
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((it) => (
            <ServiceCard key={it._id} item={it} />
          ))}
        </div>
      </section>
    </div>
  );
}

function MiniStat({ title, desc }) {
  return (
    <div className="border border-red-100 rounded-2xl p-3 bg-white">
      <div className="font-extrabold text-slate-900 text-sm">{title}</div>
      <div className="text-xs text-slate-600 mt-1">{desc}</div>
    </div>
  );
}
