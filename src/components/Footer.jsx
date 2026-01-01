export default function Footer() {
  return (
    <footer className="border-t">
      <div className="container-pad py-8 text-sm text-slate-600 flex flex-col md:flex-row gap-2 justify-between">
        <div>
          <div className="font-semibold text-slate-900">Suranga Printers – Fast Print</div>
          <div>Kandy – Jaffna Hwy, Dambulla • Matale District Delivery</div>
        </div>
        <div>© {new Date().getFullYear()} Suranga Printers. All rights reserved.</div>
      </div>
    </footer>
  );
}
