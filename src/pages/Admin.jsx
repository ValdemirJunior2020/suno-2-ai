import React, { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { supabase } from "../lib/supabase.js";

export default function Admin() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const { data, error: supaErr } = await supabase
        .from("orders")
        .select(
          "order_id,created_at,package,price_usd,payer_email,customer_name,customer_phone,status,occasion,recipient_name,relationship,dedication,music_style,mood,languages,whatsapp"
        )
        .order("created_at", { ascending: false });

      if (supaErr) throw supaErr;
      setOrders(data || []);
    } catch (e) {
      setError(e?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const countPaid = useMemo(() => {
    return orders.filter((o) => String(o.status || "").toLowerCase() === "paid").length;
  }, [orders]);

  const exportExcel = () => {
    const rows = orders.map((o) => ({
      order_id: o.order_id,
      created_at: o.created_at,
      package: o.package,
      price_usd: o.price_usd,
      payer_email: o.payer_email,
      customer_name: o.customer_name,
      customer_phone: o.customer_phone,
      status: o.status,
      occasion: o.occasion,
      recipient_name: o.recipient_name,
      relationship: o.relationship,
      dedication: o.dedication,
      music_style: o.music_style,
      mood: o.mood,
      languages: o.languages,
      whatsapp: o.whatsapp,
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "orders");

    const stamp = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(wb, `melodymagic-orders-${stamp}.xlsx`);
  };

  return (
    <div className="page">
      <section className="hero">
        <h1>Admin Orders</h1>
        <p className="muted">
          Total: <strong>{orders.length}</strong> — Paid: <strong>{countPaid}</strong>
        </p>

        <div className="adminActions">
          <button className="btn" onClick={fetchOrders} disabled={loading}>
            {loading ? "Loading..." : "Refresh"}
          </button>

          <button
            className="btn btn--ghost"
            onClick={exportExcel}
            disabled={!orders.length}
            type="button"
          >
            Export Excel
          </button>
        </div>
      </section>

      {error && (
        <div className="card card--error">
          <strong>⚠️ {error}</strong>
        </div>
      )}

      <div className="card">
        <div className="tableWrap">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Order</th>
                <th>Status</th>
                <th>Customer</th>
                <th>Occasion</th>
                <th>Recipient</th>
                <th>Style</th>
                <th>Mood</th>
                <th>Lang</th>
                <th>Price</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((o) => (
                <tr key={o.order_id}>
                  <td className="nowrap">
                    {String(o.created_at || "").replace("T", " ").slice(0, 16)}
                  </td>

                  <td className="mono">{String(o.order_id || "").slice(0, 8)}…</td>

                  <td>
                    <span
                      className={
                        String(o.status || "").toLowerCase() === "paid"
                          ? "badge badge--ok"
                          : "badge"
                      }
                    >
                      {o.status}
                    </span>
                  </td>

                  <td className="nowrap">
                    {o.customer_name}
                    <div className="muted tiny">{o.customer_phone}</div>
                  </td>

                  <td>{o.occasion}</td>
                  <td>{o.recipient_name}</td>
                  <td>{o.music_style}</td>
                  <td>{o.mood}</td>
                  <td>{o.languages}</td>
                  <td className="nowrap">${Number(o.price_usd || 0).toFixed(2)}</td>
                </tr>
              ))}

              {!orders.length && !loading && (
                <tr>
                  <td colSpan="10" className="muted">
                    No orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="muted tiny" style={{ marginTop: 12 }}>
          Export includes all fields (dedication, payer email, WhatsApp, etc.)
        </p>
      </div>
    </div>
  );
}
