import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/login", form);
      localStorage.setItem("token", response.data.access_token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Login gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <section className="auth-card">
        <p className="eyebrow">Mini AI Sales Prediction</p>
        <h1>Selamat datang kembali</h1>
        <p className="muted">Masuk untuk melihat data sales dan melakukan prediksi produk.</p>

        {error && <p className="error-text">{error}</p>}

        <form onSubmit={handleSubmit} className="stack-form">
          <label>
            Username
            <input
              value={form.username}
              onChange={(event) => setForm({ ...form, username: event.target.value })}
              placeholder="admin"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              placeholder="admin123"
              required
            />
          </label>

          <button type="submit" disabled={loading}>
            {loading ? "Memproses..." : "Login"}
          </button>
        </form>

        <p className="hint">Demo credential: admin / admin123</p>
      </section>
    </main>
  );
}
