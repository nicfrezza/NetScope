import React, { useEffect, useState } from 'react';

const styles = {
  page: {
    minHeight: '100vh',
    padding: '32px',
    background: 'linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)',
    color: '#0f172a',
    fontFamily: 'Inter, Arial, sans-serif',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '28px',
    gap: '20px',
    flexWrap: 'wrap',
  },
  eyebrow: {
    margin: 0,
    fontSize: '12px',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: '#4f46e5',
    fontWeight: 700,
  },
  title: {
    margin: '8px 0 0',
    fontSize: 'clamp(2rem, 3vw, 2.75rem)',
    fontWeight: 800,
    lineHeight: 1.1,
  },
  primaryButton: {
    border: 'none',
    background: '#111827',
    color: '#fff',
    borderRadius: '12px',
    padding: '12px 18px',
    fontWeight: 700,
    fontSize: '0.95rem',
    cursor: 'pointer',
    boxShadow: '0 10px 20px rgba(17, 24, 39, 0.15)',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px',
    marginBottom: '20px',
  },
  statCard: {
    background: 'rgba(255,255,255,0.8)',
    border: '1px solid rgba(148,163,184,0.2)',
    borderRadius: '18px',
    padding: '20px',
    boxShadow: '0 10px 30px rgba(15, 23, 42, 0.04)',
    backdropFilter: 'blur(10px)',
  },
  statLabel: {
    margin: 0,
    color: '#64748b',
    fontSize: '0.82rem',
    fontWeight: 600,
  },
  statRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '18px',
    gap: '12px',
  },
  statValue: {
    margin: 0,
    fontSize: '1.8rem',
    fontWeight: 800,
  },
  change: {
    padding: '6px 10px',
    borderRadius: '999px',
    fontSize: '0.75rem',
    fontWeight: 700,
  },
  positive: {
    background: '#dcfce7',
    color: '#166534',
  },
  negative: {
    background: '#fee2e2',
    color: '#b91c1c',
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '20px',
    marginBottom: '20px',
  },
  card: {
    background: 'rgba(255,255,255,0.86)',
    border: '1px solid rgba(148,163,184,0.2)',
    borderRadius: '18px',
    padding: '22px',
    boxShadow: '0 10px 30px rgba(15, 23, 42, 0.04)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '18px',
    gap: '12px',
  },
  sectionTitle: {
    margin: 0,
    fontSize: '1.1rem',
    fontWeight: 750,
  },
  mutedText: {
    color: '#64748b',
    fontSize: '0.82rem',
    fontWeight: 600,
  },
  chartWrap: {
    display: 'flex',
    alignItems: 'end',
    gap: '12px',
    height: '180px',
    paddingTop: '10px',
  },
  bar: {
    flex: 1,
    borderRadius: '10px 10px 0 0',
    background: 'linear-gradient(180deg, #a5b4fc 0%, #6366f1 100%)',
    minHeight: '24px',
    position: 'relative',
  },
  budgetList: {
    display: 'grid',
    gap: '15px',
  },
  budgetRow: {
    display: 'grid',
    gap: '8px',
  },
  budgetMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.85rem',
    fontWeight: 700,
  },
  progressTrack: {
    position: 'relative',
    width: '100%',
    height: '10px',
    borderRadius: '999px',
    background: '#e2e8f0',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: '999px',
  },
  bottomGrid: {
    display: 'grid',
    gridTemplateColumns: '1.4fr 1fr',
    gap: '20px',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'grid',
    gap: '12px',
  },
  item: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '14px',
    background: '#f8fafc',
    borderRadius: '12px',
    padding: '12px 14px',
  },
  itemMeta: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  itemTitle: {
    margin: 0,
    fontSize: '0.94rem',
    fontWeight: 700,
  },
  itemDate: {
    margin: 0,
    fontSize: '0.75rem',
    color: '#64748b',
  },
  amount: {
    fontWeight: 800,
    fontSize: '0.9rem',
  },
  pill: {
    fontSize: '0.7rem',
    fontWeight: 700,
    padding: '5px 8px',
    borderRadius: '999px',
    display: 'inline-block',
  },
  incomePill: {
    background: '#dcfce7',
    color: '#166534',
  },
  expensePill: {
    background: '#fef3c7',
    color: '#92400e',
  },
  goalList: {
    display: 'grid',
    gap: '14px',
  },
  goalRow: {
    display: 'grid',
    gap: '8px',
  },
  goalMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.8rem',
    fontWeight: 700,
  },
  goalAmount: {
    color: '#475569',
  },
  '@media (max-width: 900px)': {
    mainGrid: {
      gridTemplateColumns: '1fr',
    },
    bottomGrid: {
      gridTemplateColumns: '1fr',
    },
  },
};

export default function Finance() {
  const [finance, setFinance] = useState({ stats: [], chartData: [], budgets: [], transactions: [], goals: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function loadFinance() {
      try {
        const response = await fetch('/api/invoices', {
          signal: controller.signal,
          cache: 'no-store',
        });
        if (!response.ok) throw new Error('Unable to load finance data.');
        const data = await response.json();
        const invoices = Array.isArray(data) ? data : Array.isArray(data.invoices) ? data.invoices : [];
        const amountOf = (invoice) => Number(invoice.total ?? invoice.total_amount ?? invoice.amount ?? invoice.invoice_total) || 0;
        const invoiceDate = (invoice) => invoice.issue_date ?? invoice.invoice_date ?? invoice.created_at ?? invoice.date;
        const totalRevenue = invoices.reduce((total, invoice) => total + amountOf(invoice), 0);
        const paidRevenue = invoices.reduce((total, invoice) => {
          const status = String(invoice.status ?? '').toLowerCase();
          return total + (status === 'paid' ? amountOf(invoice) : 0);
        }, 0);
        const monthlyRevenue = Array.from({ length: 9 }, (_, index) => {
          const month = new Date();
          month.setMonth(month.getMonth() - (8 - index), 1);
          return invoices.reduce((total, invoice) => {
            const date = new Date(invoiceDate(invoice));
            return date.getFullYear() === month.getFullYear() && date.getMonth() === month.getMonth()
              ? total + amountOf(invoice)
              : total;
          }, 0);
        });
        const maxRevenue = Math.max(...monthlyRevenue, 1);
        setFinance({
          stats: [
            { label: 'Total invoiced', value: `$${totalRevenue.toLocaleString()}`, change: `${invoices.length} invoices`, tone: 'positive' },
            { label: 'Paid revenue', value: `$${paidRevenue.toLocaleString()}`, change: `${invoices.filter((invoice) => String(invoice.status ?? '').toLowerCase() === 'paid').length} paid`, tone: 'positive' },
            { label: 'Outstanding', value: `$${(totalRevenue - paidRevenue).toLocaleString()}`, change: 'Unpaid invoices', tone: 'negative' },
          ],
          chartData: monthlyRevenue.map((amount) => Math.max(5, (amount / maxRevenue) * 100)),
          budgets: [],
          transactions: invoices.slice().sort((a, b) => new Date(invoiceDate(b)) - new Date(invoiceDate(a))).slice(0, 8).map((invoice, index) => ({
            name: invoice.customer_name ?? invoice.client_name ?? invoice.invoice_number ?? `Invoice ${index + 1}`,
            date: invoiceDate(invoice) ? new Date(invoiceDate(invoice)).toLocaleDateString() : 'Date unavailable',
            type: 'Income',
            amount: `$${amountOf(invoice).toLocaleString()}`,
          })),
          goals: [],
        });
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message || 'Unable to load finance data.');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadFinance();
    return () => controller.abort();
  }, []);

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div>
          <p style={styles.eyebrow}>Finance</p>
          <h1 style={styles.title}>Portfolio & cash flow</h1>
        </div>
        <button style={styles.primaryButton}>+ Add income</button>
      </header>

      <section style={styles.statsGrid}>
        {finance.stats.map((stat) => (
          <article key={stat.label} style={styles.statCard}>
            <p style={styles.statLabel}>{stat.label}</p>
            <div style={styles.statRow}>
              <p style={styles.statValue}>{stat.value}</p>
              <span
                style={{
                  ...styles.change,
                  ...(stat.tone === 'positive' ? styles.positive : styles.negative),
                }}
              >
                {stat.change}
              </span>
            </div>
          </article>
        ))}
      </section>

      {loading && <p role="status">Loading finance data…</p>}
      {error && <p role="alert">{error}</p>}

      <section style={styles.mainGrid}>
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.sectionTitle}>Revenue trend</h2>
            <span style={styles.mutedText}>Last 9 months</span>
          </div>
          <div style={styles.chartWrap}>
            {finance.chartData.map((value, index) => (
              <div
                key={index}
                style={{
                  ...styles.bar,
                  height: `${Math.max(30, value)}%`,
                  opacity: 0.85 - index * 0.05,
                }}
              />
            ))}
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.sectionTitle}>Budget health</h2>
            <span style={styles.mutedText}>This quarter</span>
          </div>

          <div style={styles.budgetList}>
            {finance.budgets.map((item) => (
              <div key={item.name} style={styles.budgetRow}>
                <div style={styles.budgetMeta}>
                  <span>{item.name}</span>
                  <span>{item.used}%</span>
                </div>
                <div style={styles.progressTrack}>
                  <div
                    style={{
                      ...styles.progressFill,
                      width: `${item.used}%`,
                      background: item.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={styles.bottomGrid}>
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.sectionTitle}>Recent transactions</h2>
            <span style={styles.mutedText}>Today</span>
          </div>

          <ul style={styles.list}>
            {finance.transactions.map((transaction) => (
              <li key={transaction.name} style={styles.item}>
                <div style={styles.itemMeta}>
                  <p style={styles.itemTitle}>{transaction.name}</p>
                  <p style={styles.itemDate}>{transaction.date}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span
                    style={{
                      ...styles.pill,
                      ...(transaction.type === 'Income' ? styles.incomePill : styles.expensePill),
                    }}
                  >
                    {transaction.type}
                  </span>
                  <span
                    style={{
                      ...styles.amount,
                      color: transaction.type === 'Income' ? '#166534' : '#0f172a',
                    }}
                  >
                    {transaction.amount}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.sectionTitle}>Savings goals</h2>
            <span style={styles.mutedText}>6 months</span>
          </div>

          <div style={styles.goalList}>
            {finance.goals.map((goal) => {
              const percentage = (goal.current / goal.target) * 100;
              return (
                <div key={goal.name} style={styles.goalRow}>
                  <div style={styles.goalMeta}>
                    <span>{goal.name}</span>
                    <span style={styles.goalAmount}>${goal.current.toLocaleString()} / ${goal.target.toLocaleString()}</span>
                  </div>
                  <div style={styles.progressTrack}>
                    <div
                      style={{
                        ...styles.progressFill,
                        width: `${Math.min(percentage, 100)}%`,
                        background: goal.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
