import { Link, NavLink } from "react-router-dom";

const PHONE = "0662285425";
const WHATSAPP = "94772285425"; // if you want exact whatsapp number format, change here

const navClass = ({ isActive }) =>
  "px-3 py-2 rounded-lg text-sm font-medium " +
  (isActive ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100");

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
      <div className="container-pad flex items-center justify-between py-3">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white grid place-items-center font-bold">
            SP
          </div>
          <div>
            <div className="font-extrabold leading-4">Suranga Printers</div>
            <div className="text-xs text-slate-600">Fast Print • Dambulla</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <NavLink className={navClass} to="/">Home</NavLink>
          <NavLink className={navClass} to="/services">Services</NavLink>
          <NavLink className={navClass} to="/quote">Get Quote</NavLink>
          <NavLink className={navClass} to="/portfolio">Portfolio</NavLink>
          <NavLink className={navClass} to="/reviews">Reviews</NavLink>
          <NavLink className={navClass} to="/contact">Contact</NavLink>
        </nav>

        <div className="flex items-center gap-2">
          <a
            className="hidden sm:inline-flex px-3 py-2 rounded-lg border text-sm font-semibold hover:bg-slate-50"
            href={`tel:${PHONE}`}
          >
            Call
          </a>
          <a
            className="inline-flex px-3 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold hover:opacity-90"
            href={`https://wa.me/${WHATSAPP}`}
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </header>
  );
}
