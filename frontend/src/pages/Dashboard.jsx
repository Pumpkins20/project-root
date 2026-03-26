import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import PredictForm from "../components/PredictForm";
import SalesTable from "../components/SalesTable";
import api from "../services/api";

const PAGE_SIZE = 25;

export default function Dashboard() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchSales = async () => {
      setLoading(true);
      setError("");
      try {
        const skip = page * PAGE_SIZE;
        const response = await api.get(`/sales?skip=${skip}&limit=${PAGE_SIZE}`);
        setSales(response.data);
        setHasNextPage(response.data.length === PAGE_SIZE);
      } catch (err) {
        setError(err.response?.data?.detail || "Gagal memuat data penjualan");
        setHasNextPage(false);
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, [navigate, page]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handlePrevPage = () => {
    setPage((prev) => Math.max(prev - 1, 0));
  };

  const handleNextPage = () => {
    if (hasNextPage) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h1>Sales Intelligence</h1>
        </div>
        <button className="ghost-btn" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <section className="card">
        <h2>Data Penjualan</h2>
        <div className="pagination-controls">
          <p className="pagination-meta">Halaman {page + 1} • {PAGE_SIZE} data per halaman</p>
          <div className="pagination-buttons">
            <button type="button" className="ghost-btn" onClick={handlePrevPage} disabled={loading || page === 0}>
              Prev
            </button>
            <button type="button" className="ghost-btn" onClick={handleNextPage} disabled={loading || !hasNextPage}>
              Next
            </button>
          </div>
        </div>
        {loading && <p>Loading data...</p>}
        {!loading && error && <p className="error-text">{error}</p>}
        {!loading && !error && <SalesTable data={sales} />}
      </section>

      <section className="card">
        <h2>Prediksi Status Produk</h2>
        <PredictForm />
      </section>
    </main>
  );
}
