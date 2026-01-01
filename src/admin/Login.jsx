import { useState } from "react";
import { useNavigate } from "react-router-dom";
import adminHttp from "../api/adminHttp";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("admin@surangaprinters.lk");
  const [password, setPassword] = useState("Admin@12345");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const { data } = await adminHttp.post("/api/admin/auth/login", { email, password });
      localStorage.setItem("sp_admin_token", data.token);
      nav("/admin/portfolio");
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto border rounded-3xl p-6 bg-white">
      <h1 className="text-2xl font-extrabold">Admin Login</h1>
      <p className="text-slate-600 mt-1 text-sm">Login to manage Portfolio uploads.</p>

      {err ? (
        <div className="mt-4 border border-red-200 bg-red-50 text-red-700 rounded-2xl p-3">
          {err}
        </div>
      ) : null}

      <form onSubmit={submit} className="mt-5 space-y-4">
        <div>
          <label className="text-sm font-semibold">Email</label>
          <input
            className="mt-2 w-full border rounded-xl px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-semibold">Password</label>
          <input
            type="password"
            className="mt-2 w-full border rounded-xl px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          disabled={loading}
          className="w-full px-4 py-3 rounded-xl bg-slate-900 text-white font-semibold hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Logging in…" : "Login"}
        </button>
      </form>
    </div>
  );
}
