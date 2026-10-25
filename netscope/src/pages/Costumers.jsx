import React, { useEffect, useMemo, useState } from 'react';

export default function Costumers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function fetchCustomers() {
      try {
        const response = await fetch('/api/customers', { signal: controller.signal });
        if (!response.ok) throw new Error('Could not load customers.');

        const result = await response.json();
        const rows = Array.isArray(result) ? result : result.customers;
        if (!Array.isArray(rows)) throw new Error('Unexpected customer response.');
        setCustomers(rows);
      } catch (fetchError) {
        if (fetchError.name !== 'AbortError') setError(fetchError.message);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    fetchCustomers();
    return () => controller.abort();
  }, []);

  const stats = useMemo(
    () => [
      { label: 'Total Customers', value: '1,284', change: '+12.4%' },
      { label: 'Active Accounts', value: '986', change: '+8.1%' },
      { label: 'Revenue', value: '$482K', change: '+15.7%' },
      { label: 'Churn Risk', value: '4.2%', change: '-1.3%' },
    ],
    []
  );

  return (
    <div style={{ padding: '32px', background: '#f5f7fb', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <p style={{ margin: 0, color: '#637381', fontSize: 13, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Customers
          </p>
          <h1 style={{ margin: '8px 0 0', fontSize: '2rem', color: '#101828' }}>Customer directory</h1>
        </div>

        <button
          type="button"
          style={{
            background: '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            padding: '12px 18px',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 8px 20px rgba(37, 99, 235, 0.2)',
          }}
        >
          + New customer
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '18px',
          marginBottom: '28px',
        }}
      >
        {stats.map((stat) => (
          <div
            key={stat.label}
            style={{
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: 16,
              padding: '20px',
              boxShadow: '0 8px 18px rgba(15, 23, 42, 0.04)',
            }}
          >
            <div style={{ color: '#667085', fontSize: 13 }}>{stat.label}</div>
            <div style={{ marginTop: 12, fontSize: 28, fontWeight: 700, color: '#111827' }}>{stat.value}</div>
            <div
              style={{
                marginTop: 8,
                color: stat.change.startsWith('-') ? '#dc2626' : '#16a34a',
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {stat.change} vs last month
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: 18,
          overflow: 'hidden',
          boxShadow: '0 8px 18px rgba(15, 23, 42, 0.04)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '20px 24px',
            borderBottom: '1px solid #edf2f7',
          }}
        >
          <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#101828' }}>Recent customers</h2>
          <input
            type="text"
            placeholder="Search customers"
            style={{
              width: '260px',
              padding: '10px 12px',
              border: '1px solid #d0d5dd',
              borderRadius: 10,
              outline: 'none',
              fontSize: 14,
            }}
          />
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#f9fafb' }}>
              <tr>
                {['Customer', 'Company', 'Contact', 'Status', 'Value', 'Last order'].map((header) => (
                  <th
                    key={header}
                    style={{
                      textAlign: 'left',
                      padding: '14px 24px',
                      color: '#667085',
                      fontSize: 12,
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan="6" style={{ padding: '24px', textAlign: 'center', color: '#667085' }}>
                    Loading customers...
                  </td>
                </tr>
              )}
              {!loading && error && (
                <tr>
                  <td colSpan="6" style={{ padding: '24px', textAlign: 'center', color: '#dc2626' }}>
                    {error}
                  </td>
                </tr>
              )}
              {!loading && !error && customers.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ padding: '24px', textAlign: 'center', color: '#667085' }}>
                    No customers found.
                  </td>
                </tr>
              )}
              {customers.map((customer) => (
                <tr key={customer.id} style={{ borderTop: '1px solid #edf2f7' }}>
                  <td style={{ padding: '18px 24px', color: '#111827', fontWeight: 600 }}>{customer.name}</td>
                  <td style={{ padding: '18px 24px', color: '#475467' }}>{customer.company}</td>
                  <td style={{ padding: '18px 24px', color: '#475467' }}>
                    <div>{customer.email}</div>
                    <div style={{ marginTop: 4, color: '#667085' }}>{customer.phone}</div>
                  </td>
                  <td style={{ padding: '18px 24px' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '6px 10px',
                        borderRadius: 999,
                        background:
                          customer.status === 'Active'
                            ? '#dcfce7'
                            : customer.status === 'Pending'
                              ? '#fef3c7'
                              : '#e5e7eb',
                        color:
                          customer.status === 'Active'
                            ? '#166534'
                            : customer.status === 'Pending'
                              ? '#92400e'
                              : '#374151',
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      {customer.status}
                    </span>
                  </td>
                  <td style={{ padding: '18px 24px', color: '#111827', fontWeight: 700 }}>{customer.value}</td>
                  <td style={{ padding: '18px 24px', color: '#475467' }}>{customer.lastOrder}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
