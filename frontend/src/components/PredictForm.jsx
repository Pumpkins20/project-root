import { useState } from "react";

import api from "../services/api";

const initialForm = {
  jumlah_penjualan: "",
  harga: "",
  diskon: "",
};

export default function PredictForm() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const payload = {
        jumlah_penjualan: Number(form.jumlah_penjualan),
        harga: Number(form.harga),
        diskon: Number(form.diskon),
      };

      const response = await api.post("/predict", payload);
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Prediksi gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="stack-form">
        <label>
          Jumlah Penjualan (unit)
          <input
            type="number"
            name="jumlah_penjualan"
            value={form.jumlah_penjualan}
            onChange={handleChange}
            placeholder="contoh: 150"
            required
            min="0"
          />
        </label>

        <label>
          Harga Satuan (Rp)
          <input
            type="number"
            name="harga"
            value={form.harga}
            onChange={handleChange}
            placeholder="contoh: 50000"
            required
            min="1"
          />
        </label>

        <label>
          Diskon (%)
          <input
            type="number"
            name="diskon"
            value={form.diskon}
            onChange={handleChange}
            placeholder="0 - 30"
            required
            min="0"
            max="100"
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Memprediksi..." : "Prediksi"}
        </button>
      </form>

      {error && <p className="error-text">{error}</p>}

      {result && (
        <div className={result.status === "Laris" ? "result-box success" : "result-box danger"}>
          <h3>Hasil: {result.status}</h3>
          <p>
            Confidence: <strong>{(result.confidence * 100).toFixed(1)}%</strong>
          </p>
        </div>
      )}
    </div>
  );
}
