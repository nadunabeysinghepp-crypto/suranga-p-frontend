import { Link } from "react-router-dom";

import heroImg from "../assets/images/hero-print.jpg";
import imgCards from "../assets/images/cards.jpg";
import imgBrochure from "../assets/images/brochure.jpg";
import imgPoster from "../assets/images/poster.jpg";

const PHONE = "0662285425";
const WHATSAPP = "94772285425"; // change if needed

export default function Home() {
  return (
    <div>
      {/* HERO */}
      <section className="bg-gradient-to-b from-red-50 to-white">
        <div className="container-pad py-12 md:py-16 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-semibold border border-red-200">
              Fast Print • Dambulla • Matale District Delivery
            </div>

            <h1 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
              Premium <span className="text-red-600">Color Printing</span> for Business & Events
            </h1>

            <p className="mt-4 text-slate-700 text-lg leading-relaxed">
              Business cards, brochures, posters, book printing, binding, photo printing, dye sublimation and more.
              Quick response via WhatsApp or phone call.
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

            <div className="mt-8 grid sm:grid-cols-3 gap-3">
              <Stat title="Fast Turnaround" desc="Same/next day for many jobs" />
              <Stat title="Quality Finish" desc="Lamination, binding, cutting" />
              <Stat title="Delivery" desc="Matale District areas + fees" />
            </div>
          </div>

          {/* Hero image with colorful look + red glow */}
          <div className="relative">
            <div className="absolute -inset-3 bg-gradient-to-r from-red-200/50 via-pink-200/40 to-amber-200/40 blur-2xl rounded-[2.5rem]" />
            <div className="relative overflow-hidden rounded-[2.5rem] border border-red-200 bg-white shadow-lg">
              <img
                src={heroImg}
                alt="Suranga Printers - colorful printing"
                className="w-full h-[360px] md:h-[440px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge>Business Cards</Badge>
                  <Badge>Brochures</Badge>
                  <Badge>Posters</Badge>
                  <Badge>Books + Binding</Badge>
                  <Badge>Sublimation</Badge>
                </div>
                <div className="mt-3 text-white">
                  <div className="font-extrabold text-lg">Suranga Printers – Fast Print</div>
                  <div className="text-sm text-white/85">Kandy–Jaffna Hwy, Dambulla</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* POPULAR SERVICES WITH IMAGES */}
      <section className="container-pad py-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">Popular Services</h2>
            <p className="text-slate-600 mt-1">High-demand printing with premium finishing.</p>
          </div>
          <Link
            to="/services"
            className="text-sm font-semibold underline decoration-red-200 hover:decoration-red-600"
          >
            View all services →
          </Link>
        </div>

        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <FeatureCard
            img={imgCards}
            title="Business Cards"
            desc="Matte/Gloss, Lamination, Premium paper options."
            tag="Best Seller"
          />
          <FeatureCard
            img={imgBrochure}
            title="Flyers & Brochures"
            desc="Full color, single/both sides, folding options."
            tag="Marketing"
          />
          <FeatureCard
            img={imgPoster}
            title="Posters & Banners"
            desc="A3/A2 sizes, event posters, shop promotions."
            tag="Color Print"
          />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-red-50/60 border-y border-red-100">
        <div className="container-pad py-12">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">How it works</h2>
              <p className="text-slate-600 mt-1">Simple process — fast response.</p>
            </div>
            <Link
              to="/quote"
              className="text-sm font-semibold underline decoration-red-200 hover:decoration-red-600"
            >
              Request quote →
            </Link>
          </div>

          <div className="mt-6 grid md:grid-cols-3 gap-4">
            <Step n="01" title="Choose service" desc="Select what you need: cards, brochures, posters, books, etc." />
            <Step n="02" title="Send file (optional)" desc="Upload PDF/JPG/PNG/ZIP and mention finishing details." />
            <Step n="03" title="Confirm price + delivery" desc="We reply via WhatsApp/call with cost & timeline." />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-pad py-12">
        <div className="rounded-[2rem] border border-red-200 bg-gradient-to-r from-red-50 via-white to-amber-50 p-6 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="text-2xl font-extrabold text-slate-900">
              Need printing today?
            </div>
            <div className="text-slate-700 mt-2">
              Click WhatsApp and send your file — we’ll guide paper, size, and finishing.
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/quote"
              className="px-5 py-3 rounded-xl bg-slate-900 text-white font-semibold hover:opacity-90"
            >
              Get Quote
            </Link>
            <a
              href={`https://wa.me/${WHATSAPP}`}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-3 rounded-xl bg-red-600 text-white font-semibold hover:opacity-90"
            >
              WhatsApp
            </a>
            <a
              href={`tel:${PHONE}`}
              className="px-5 py-3 rounded-xl border border-red-200 font-semibold hover:bg-red-50"
            >
              Call
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

function Badge({ children }) {
  return (
    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/15 text-white border border-white/25 backdrop-blur">
      {children}
    </span>
  );
}

function Stat({ title, desc }) {
  return (
    <div className="border border-red-100 rounded-2xl p-4 bg-white">
      <div className="font-extrabold text-slate-900">{title}</div>
      <div className="text-sm text-slate-600 mt-1">{desc}</div>
    </div>
  );
}

function FeatureCard({ img, title, desc, tag }) {
  return (
    <div className="group border border-red-100 rounded-3xl overflow-hidden bg-white hover:shadow-sm transition">
      <div className="relative h-48 overflow-hidden">
        <img src={img} alt={title} className="w-full h-full object-cover group-hover:scale-[1.03] transition" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
        <div className="absolute top-4 left-4">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-red-600 text-white">
            {tag}
          </span>
        </div>
      </div>
      <div className="p-5">
        <div className="font-extrabold text-slate-900">{title}</div>
        <div className="text-sm text-slate-600 mt-2">{desc}</div>
        <Link
          to="/quote"
          className="mt-4 inline-flex text-sm font-semibold underline decoration-red-200 hover:decoration-red-600"
        >
          Request quote →
        </Link>
      </div>
    </div>
  );
}

function Step({ n, title, desc }) {
  return (
    <div className="border border-red-100 rounded-3xl p-5 bg-white">
      <div className="text-xs font-extrabold text-red-700 bg-red-100 inline-flex px-2 py-1 rounded-full">
        {n}
      </div>
      <div className="mt-3 font-extrabold text-slate-900">{title}</div>
      <div className="mt-2 text-sm text-slate-600">{desc}</div>
    </div>
  );
}
