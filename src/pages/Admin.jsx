import React, { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { supabase } from "../lib/supabase";

function isVideoOrder(order) {
  const pkg = (order?.package || "").toLowerCase();
  return pkg.includes("lyric video") || pkg.includes("video");
}

function formatDate(ts) {
  if (!ts) return "";
  try {
    return new Date(ts).toLocaleString();
  } catch {
    return ts;
  }
}

export default function Admin() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Simple filters
  const [typeFilter, setTypeFilter] = useState("all"); // all | song | video
  const [statusFilter, setStatusFilter] = useState("all"); // all | paid | pending | etc.
  const [q, setQ] = useState("");

  async function fetchOrders() {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message || "Failed to load orders");
      setRows([]);
      setLoading(false);
      return;
    }

    setRows(data || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  const filtered = useMemo(() => {
    const text = q.trim().toLowerCase();

    return (rows || []).filter((r) => {
      const type = isVideoOrder(r) ? "video" : "song";
      if (typeFilter !== "all" && type !== typeFilter) return false;

      const st = (r.status || "").toLowerCase();
      if (statusFilter !== "all" && st !== statusFilter) return false;

      if (!text) return true;

      const hay = [
        r.customer_name,
        r.payer_email,
        r.customer_phone,
        r.recipient_name,
        r.occasion,
        r.relationship,
        r.package,
        r.music_style,
        r.mood,
        r.languages,
        r.whatsapp,
        r.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return hay.includes(text);
    });
  }, [rows, typeFilter, statusFilter, q]);

  function downloadExcel() {
    const exportRows = filtered.map((r) => ({
      order_id: r.order_id,
      created_at: r.created_at,
      order_type: isVideoOrder(r) ? "video" : "song",
      package: r.package,
      price_usd: r.price_usd,
      payer_email: r.payer_email,
      customer_name: r.customer_name,
      customer_phone: r.customer_phone,
      status: r.status,
      occasion: r.occasion,
      recipient_name: r.recipient_name,
      relationship: r.relationship,
      dedication: r.dedication,
      music_style: r.music_style,
      mood: r.mood,
      languages: r.languages,
      whatsapp: r.whatsapp,
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportRows);
    XLSX.utils.book_append_sheet(wb, ws, "Orders");

    const filename = `melodymagic-orders-${new Date()
      .toISOString()
      .slice(0, 10)}.xlsx`;

    XLSX.writeFile(wb, filename);
  }

  return (
    <div className="page">
      <section className="hero">
        <h1>Admin</h1>
        <p>View orders and export to Excel.</p>
      </section>

      <div className="stack">
        <div className="card">
          <div className="adminbar">
            <div className="adminbar__left">
              <button className="btn" onClick={fetchOrders} disabled={loading}>
                {loading ? "Refreshing..." : "Refresh"}
              </button>

              <button className="btn btn--ghost" onClick={downloadExcel} disabled={!filtered.length}>
                Export Excel ({filtered.length})
              </button>
            </div>

            <div className="adminbar__right">
              <select
                className="input input--sm"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="song">Songs</option>
                <option value="video">Lyric Videos</option>
              </select>

              <select
                className="input input--sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="paid">paid</option>
                <option value="pending">pending</option>
              </select>

              <input
                className="input input--sm"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search..."
              />
            </div>
          </div>

          {error && <div className="card card--error">{error}</div>}

          {loading ? (
            <p className="muted">Loading orders...</p>
          ) : filtered.length === 0 ? (
            <p className="muted">No orders found.</p>
          ) : (
            <div className="tablewrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Date</th>
                    <th>Customer</th>
                    <th>Occasion</th>
                    <th>Package</th>
                    <th>Status</th>
                    <th>$</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => (
                    <tr key={r.order_id}>
                      <td>
                        {isVideoOrder(r) ? (
                          <span className="pill pill--video">🎬 Video</span>
                        ) : (
                          <span className="pill pill--song">🎵 Song</span>
                        )}
                      </td>
                      <td>{formatDate(r.created_at)}</td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{r.customer_name || "-"}</div>
                        <div className="muted" style={{ fontSize: 12 }}>
                          {r.payer_email || ""}
                        </div>
                      </td>
                      <td>{r.occasion || "-"}</td>
                      <td>{r.package || "-"}</td>
                      <td>
                        <span className={`pill ${String(r.status).toLowerCase() === "paid" ? "pill--paid" : "pill--pending"}`}>
                          {r.status || "pending"}
                        </span>
                      </td>
                      <td>{r.price_usd != null ? Number(r.price_usd).toFixed(2) : "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="card">
          <h3 style={{ marginTop: 0 }}>Quick Notes</h3>
          <ul className="muted" style={{ marginTop: 8 }}>
            <li>
              <strong>🎬 Video</strong> orders are detected when the <code>package</code> text includes “Lyric Video”.
            </li>
            <li>
              Export downloads an <strong>.xlsx</strong> file directly to your computer when you click <strong>Export Excel</strong>.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
