import React, { useEffect, useState } from "react";

const Suport = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTickets = async () => {
      const { VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY } = import.meta.env;

      if (!VITE_SUPABASE_URL || !VITE_SUPABASE_ANON_KEY) {
        setError("Support tickets are unavailable: database configuration is missing.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${VITE_SUPABASE_URL}/rest/v1/support_tickets?select=*&order=created_at.desc`,
          {
            headers: {
              apikey: VITE_SUPABASE_ANON_KEY,
              Authorization: `Bearer ${VITE_SUPABASE_ANON_KEY}`,
            },
          }
        );

        if (!response.ok) throw new Error("Unable to load support tickets.");
        setTickets(await response.json());
      } catch (fetchError) {
        setError(fetchError.message || "Unable to load support tickets.");
      } finally {
        setLoading(false);
      }
    };

    loadTickets();
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.hero}>
        <div>
          <p style={styles.eyebrow}>NetScope support</p>
          <h1 style={styles.heading}>Support tickets</h1>
          <p style={styles.subtitle}>
            View the latest support requests from your team.
          </p>
        </div>
      </div>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Your tickets</h2>
        {loading ? (
          <p style={styles.message}>Loading support tickets…</p>
        ) : error ? (
          <p role="alert" style={styles.message}>{error}</p>
        ) : tickets.length === 0 ? (
          <p style={styles.message}>There are no support tickets yet.</p>
        ) : (
          <div style={styles.ticketList}>
            {tickets.map((ticket, index) => (
              <article key={ticket.id ?? index} style={styles.card}>
                <div style={styles.ticketHeader}>
                  <h3 style={styles.cardTitle}>{ticket.subject || ticket.title || "Support request"}</h3>
                  {ticket.status && <span style={styles.status}>{ticket.status}</span>}
                </div>
                {(ticket.description || ticket.message) && (
                  <p style={styles.cardText}>{ticket.description || ticket.message}</p>
                )}
                {ticket.created_at && (
                  <p style={styles.ticketDate}>
                    Created {new Date(ticket.created_at).toLocaleString()}
                  </p>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

const styles = {
  page: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "40px 20px 80px",
    fontFamily: "Arial, sans-serif",
    color: "#102a43",
    background: "#f8fbff",
  },
  hero: {
    background: "linear-gradient(135deg, #0f172a 0%, #1d4ed8 100%)",
    borderRadius: "24px",
    padding: "48px 32px",
    color: "#ffffff",
    boxShadow: "0 20px 40px rgba(15, 23, 42, 0.18)",
  },
  eyebrow: {
    margin: 0,
    fontSize: "12px",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    opacity: 0.8,
  },
  heading: {
    margin: "16px 0 12px",
    fontSize: "clamp(2rem, 5vw, 3.5rem)",
    lineHeight: 1.1,
  },
  subtitle: {
    maxWidth: "680px",
    margin: 0,
    fontSize: "1.05rem",
    lineHeight: 1.7,
    color: "rgba(255,255,255,0.85)",
  },
  section: {
    marginTop: "48px",
  },
  sectionTitle: {
    marginBottom: "20px",
    fontSize: "1.8rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
  },
  card: {
    background: "#ffffff",
    border: "1px solid #dfeaf5",
    borderRadius: "18px",
    padding: "24px 20px",
    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.05)",
  },
  icon: {
    fontSize: "2rem",
    marginBottom: "12px",
  },
  cardTitle: {
    margin: 0,
    fontSize: "1.2rem",
  },
  cardText: {
    margin: 0,
    lineHeight: 1.6,
    color: "#486581",
  },
  ticketList: {
    display: "grid",
    gap: "16px",
  },
  ticketHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    marginBottom: "12px",
  },
  status: {
    borderRadius: "999px",
    background: "#eaf2ff",
    color: "#1d4ed8",
    padding: "5px 10px",
    fontSize: "0.85rem",
    fontWeight: 700,
  },
  ticketDate: {
    margin: "12px 0 0",
    color: "#627d98",
    fontSize: "0.85rem",
  },
  message: {
    color: "#486581",
  },
};

export default Suport;
