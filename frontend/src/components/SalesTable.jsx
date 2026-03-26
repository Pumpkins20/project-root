export default function SalesTable({ data }) {
  if (!data.length) {
    return <p>Tidak ada data.</p>;
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Product ID</th>
            <th>Nama Produk</th>
            <th>Jumlah Jual</th>
            <th>Harga</th>
            <th>Diskon</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.product_id}>
              <td>{row.product_id}</td>
              <td>{row.product_name}</td>
              <td>{row.jumlah_penjualan}</td>
              <td>Rp {Number(row.harga).toLocaleString("id-ID")}</td>
              <td>{row.diskon}%</td>
              <td>
                <span className={row.status === "Laris" ? "pill laris" : "pill tidak"}>{row.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="hint">Menampilkan {data.length} data</p>
    </div>
  );
}
