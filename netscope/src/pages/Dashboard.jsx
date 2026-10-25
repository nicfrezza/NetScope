import React, { useEffect, useState } from "react";

const traffic = [34, 48, 39, 62, 54, 73, 58, 82, 67, 91, 72, 86];

const styles = `
	* { box-sizing: border-box; }
	.dashboard { min-height: 100vh; background: #f6f8fc; color: #182230; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
	.dash-shell { display: grid; grid-template-columns: 244px minmax(0, 1fr); min-height: 100vh; }
	.dash-sidebar { padding: 28px 18px; background: #101828; color: #c6d0df; display: flex; flex-direction: column; }
	.dash-brand { display: flex; align-items: center; gap: 11px; color: white; font-size: 19px; font-weight: 750; letter-spacing: -.5px; padding: 0 12px 36px; }
	.dash-brand-mark { width: 32px; height: 32px; border-radius: 10px; display: grid; place-items: center; background: #635bff; color: white; font-size: 18px; }
	.dash-label { padding: 0 12px; margin: 10px 0 10px; color: #8491a5; font-size: 10px; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase; }
	.dash-nav { display: grid; gap: 5px; }
	.dash-nav a { display: flex; align-items: center; gap: 13px; padding: 11px 12px; border-radius: 8px; color: inherit; font-size: 13px; text-decoration: none; }
	.dash-nav a.active { color: #fff; background: #28344a; }
	.dash-nav a:hover { background: #202c40; }
	.dash-nav-icon { width: 18px; text-align: center; font-size: 16px; }
	.dash-sidebar-bottom { margin-top: auto; padding: 15px 12px 0; border-top: 1px solid #293548; }
	.dash-user { display: flex; align-items: center; gap: 10px; font-size: 12px; }
	.dash-avatar { width: 34px; height: 34px; border-radius: 50%; display: grid; place-items: center; background: #e8e7ff; color: #5148db; font-weight: 700; }
	.dash-main { min-width: 0; padding: 0 36px 36px; }
	.dash-topbar { height: 78px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #e7ebf2; margin-bottom: 30px; }
	.dash-breadcrumb { color: #8b95a5; font-size: 13px; }
	.dash-top-actions { display: flex; align-items: center; gap: 18px; }
	.dash-search { width: 220px; padding: 10px 12px; border: 1px solid #e3e8f0; border-radius: 8px; background: white; color: #667085; font-size: 12px; }
	.dash-icon-button { border: 0; background: transparent; color: #667085; font-size: 18px; cursor: pointer; }
	.dash-heading { display: flex; align-items: flex-end; justify-content: space-between; gap: 20px; margin-bottom: 24px; }
	.dash-heading h1 { margin: 0 0 6px; font-size: 25px; letter-spacing: -.7px; }
	.dash-heading p { margin: 0; color: #7b8798; font-size: 13px; }
	.dash-button { padding: 10px 14px; border: 0; border-radius: 8px; background: #635bff; color: white; font-size: 12px; font-weight: 650; cursor: pointer; }
	.dash-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; }
	.dash-card { border: 1px solid #e9edf3; border-radius: 11px; background: white; box-shadow: 0 2px 6px rgba(16,24,40,.025); }
	.dash-stat { padding: 18px 19px; }
	.dash-stat-head { display: flex; align-items: center; justify-content: space-between; color: #758195; font-size: 12px; }
	.dash-stat-icon { width: 31px; height: 31px; display: grid; place-items: center; border-radius: 8px; background: #f0efff; color: #635bff; font-size: 15px; }
	.dash-stat-value { margin: 15px 0 8px; font-size: 25px; font-weight: 700; letter-spacing: -.6px; }
	.dash-stat-foot { color: #8993a3; font-size: 11px; }
	.dash-up { color: #12a875; font-weight: 650; }
	.dash-content-grid { display: grid; grid-template-columns: minmax(0, 1.7fr) minmax(270px, 1fr); gap: 16px; margin-top: 18px; }
	.dash-panel { padding: 20px; }
	.dash-panel-title { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 24px; }
	.dash-panel-title h2 { margin: 0 0 5px; font-size: 15px; }
	.dash-panel-title p { margin: 0; color: #8993a3; font-size: 11px; }
	.dash-select { padding: 7px 9px; border: 1px solid #e6eaf0; border-radius: 7px; background: white; color: #667085; font-size: 11px; }
	.dash-chart { height: 218px; display: flex; align-items: flex-end; gap: 12px; padding: 10px 2px 25px; border-bottom: 1px solid #edf0f5; background: repeating-linear-gradient(to bottom, transparent 0, transparent 53px, #f0f2f6 54px); }
	.dash-bar-wrap { height: 100%; flex: 1; display: flex; align-items: flex-end; position: relative; }
	.dash-bar { width: 100%; min-width: 7px; border-radius: 5px 5px 0 0; background: linear-gradient(180deg, #8d87ff, #635bff); }
	.dash-bar-wrap:nth-child(3n) .dash-bar { background: #dcd9ff; }
	.dash-months { display: flex; justify-content: space-between; padding-top: 9px; color: #9aa3b2; font-size: 10px; }
	.dash-legend { display: flex; gap: 16px; margin-top: 15px; color: #8993a3; font-size: 10px; }
	.dash-dot { display: inline-block; width: 7px; height: 7px; margin-right: 6px; border-radius: 50%; background: #635bff; }
	.dash-source-list { display: grid; gap: 18px; }
	.dash-source-row { display: grid; grid-template-columns: 1fr auto; gap: 8px; color: #536072; font-size: 11px; }
	.dash-source-row strong { color: #273244; font-size: 11px; }
	.dash-progress { grid-column: 1 / -1; height: 6px; overflow: hidden; border-radius: 8px; background: #f0f1f5; }
	.dash-progress span { display: block; height: 100%; border-radius: inherit; background: #716aff; }
	.dash-lower { margin-top: 18px; }
	.dash-table { width: 100%; border-collapse: collapse; text-align: left; }
	.dash-table th { padding: 0 10px 12px; color: #929bab; font-size: 10px; font-weight: 600; }
	.dash-table td { padding: 12px 10px; border-top: 1px solid #f0f2f6; color: #536072; font-size: 11px; }
	.dash-table td:first-child { color: #273244; font-weight: 600; }
	.dash-status { display: inline-block; padding: 5px 8px; border-radius: 20px; background: #eaf8f1; color: #169768; font-size: 10px; }
	.dash-support { margin-top: 18px; }
	.dash-support-message { padding: 12px 10px; color: #8993a3; font-size: 12px; }
	.dash-support-status { display: inline-block; padding: 5px 8px; border-radius: 20px; background: #f1f3f7; color: #536072; font-size: 10px; text-transform: capitalize; }
	.dash-support-status[data-status="open"], .dash-support-status[data-status="new"] { background: #fff4e5; color: #b76e00; }
	.dash-support-status[data-status="resolved"], .dash-support-status[data-status="closed"] { background: #eaf8f1; color: #169768; }
	@media (max-width: 1000px) { .dash-shell { grid-template-columns: 205px minmax(0,1fr); } .dash-main { padding: 0 22px 28px; } .dash-grid { grid-template-columns: repeat(2,minmax(0,1fr)); } }
	@media (max-width: 700px) { .dash-shell { display: block; } .dash-sidebar { display: none; } .dash-main { padding: 0 16px 24px; } .dash-topbar { height: 64px; margin-bottom: 22px; } .dash-search { display: none; } .dash-heading { align-items: flex-start; } .dash-content-grid { grid-template-columns: 1fr; } .dash-grid { gap: 10px; } .dash-stat { padding: 14px; } .dash-stat-value { font-size: 21px; } .dash-panel { padding: 15px; } .dash-chart { gap: 7px; } }
`;

export default function Dashboard({ supabaseClient }) {
	const [supportTickets, setSupportTickets] = useState([]);
	const [supportLoading, setSupportLoading] = useState(true);
	const [supportError, setSupportError] = useState("");

	useEffect(() => {
		let isCurrent = true;
		if (!supabaseClient) {
			setSupportLoading(false);
			return () => { isCurrent = false; };
		}

		supabaseClient.from("support_tickets").select("*").order("created_at", { ascending: false }).limit(5)
			.then(({ data, error }) => {
				if (!isCurrent) return;
				if (error) setSupportError("Unable to load support tickets.");
				else setSupportTickets(data || []);
				setSupportLoading(false);
			})
			.catch(() => {
				if (!isCurrent) return;
				setSupportError("Unable to load support tickets.");
				setSupportLoading(false);
			});

		return () => { isCurrent = false; };
	}, [supabaseClient]);

	const stats = [
		{ label: "Total visitors", value: "24,892", change: "+12.8%", icon: "◉" },
		{ label: "Page views", value: "58,314", change: "+8.2%", icon: "▤" },
		{ label: "Bounce rate", value: "32.4%", change: "−2.4%", icon: "↘" },
		{ label: "Avg. session", value: "2m 48s", change: "+5.6%", icon: "◷" },
	];

	return (
		<div className="dashboard">
			<style>{styles}</style>
			<div className="dash-shell">
				<aside className="dash-sidebar">
					<div className="dash-brand"><span className="dash-brand-mark">N</span> NetScope</div>
					<div className="dash-label">Workspace</div>
					<nav className="dash-nav" aria-label="Main navigation">
						<a className="active" href="#overview"><span className="dash-nav-icon">▦</span>Overview</a>
						<a href="#analytics"><span className="dash-nav-icon">▥</span>Analytics</a>
						<a href="#audience"><span className="dash-nav-icon">♙</span>Audience</a>
						<a href="#reports"><span className="dash-nav-icon">▤</span>Reports</a>
						<a href="#settings"><span className="dash-nav-icon">⚙</span>Settings</a>
					</nav>
					<div className="dash-sidebar-bottom">
						<div className="dash-user"><span className="dash-avatar">JD</span><span><strong style={{ color: "#fff", display: "block", marginBottom: 3 }}>Jordan Davis</strong><span style={{ color: "#94a0b2" }}>Workspace admin</span></span></div>
					</div>
				</aside>

				<main className="dash-main">
					<header className="dash-topbar">
						<div className="dash-breadcrumb">Workspace&nbsp; / &nbsp;<strong style={{ color: "#344054" }}>Overview</strong></div>
						<div className="dash-top-actions"><input className="dash-search" aria-label="Search" placeholder="⌕  Search anything..." /><button className="dash-icon-button" aria-label="Notifications">♧</button><span className="dash-avatar" style={{ width: 31, height: 31 }}>JD</span></div>
					</header>

					<section className="dash-heading">
						<div><h1>Good morning, Jordan 👋</h1><p>Here’s what’s happening with your website today.</p></div>
						<button className="dash-button" onClick={() => window.print()}>↓ &nbsp;Export report</button>
					</section>

					<section className="dash-grid" aria-label="Key metrics">
						{stats.map((stat) => <article className="dash-card dash-stat" key={stat.label}>
							<div className="dash-stat-head"><span>{stat.label}</span><span className="dash-stat-icon">{stat.icon}</span></div>
							<div className="dash-stat-value">{stat.value}</div>
							<div className="dash-stat-foot"><span className="dash-up">{stat.change}</span> <span>vs. last month</span></div>
						</article>)}
					</section>

					<section className="dash-content-grid">
						<article className="dash-card dash-panel">
							<div className="dash-panel-title"><div><h2>Traffic overview</h2><p>Unique visitors over the last 12 months</p></div><select className="dash-select" aria-label="Traffic date range" defaultValue="12 months"><option>12 months</option><option>30 days</option><option>7 days</option></select></div>
							<div className="dash-chart" role="img" aria-label="Bar chart showing monthly visitor traffic">
								{traffic.map((height, index) => <div className="dash-bar-wrap" key={index}><div className="dash-bar" style={{ height: `${height}%` }} /></div>)}
							</div>
							<div className="dash-months"><span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span></div>
							<div className="dash-legend"><span><i className="dash-dot" />Visitors</span><span><i className="dash-dot" style={{ background: "#dcd9ff" }} />Previous period</span></div>
						</article>

						<article className="dash-card dash-panel">
							<div className="dash-panel-title"><div><h2>Traffic sources</h2><p>Where your visitors come from</p></div><button className="dash-icon-button" aria-label="More options">···</button></div>
							<div className="dash-source-list">
								{[ ["Direct", "42%", 42], ["Organic search", "28%", 28], ["Social media", "18%", 18], ["Referral", "12%", 12] ].map(([label, value, width]) => <div className="dash-source-row" key={label}><span>{label}</span><strong>{value}</strong><div className="dash-progress"><span style={{ width: `${width}%` }} /></div></div>)}
							</div>
						</article>
					</section>

					<section className="dash-card dash-panel dash-lower">
						<div className="dash-panel-title"><div><h2>Top pages</h2><p>Your most visited pages this month</p></div><a href="#all-pages" style={{ color: "#635bff", fontSize: 11, textDecoration: "none" }}>View all →</a></div>
						<div style={{ overflowX: "auto" }}><table className="dash-table"><thead><tr><th>PAGE</th><th>VISITORS</th><th>VIEWS</th><th>BOUNCE RATE</th><th>STATUS</th></tr></thead><tbody>
							<tr><td>/home</td><td>8,492</td><td>12,840</td><td>24.8%</td><td><span className="dash-status">Trending</span></td></tr>
							<tr><td>/products</td><td>5,231</td><td>9,106</td><td>31.2%</td><td><span className="dash-status">On track</span></td></tr>
							<tr><td>/pricing</td><td>3,870</td><td>6,412</td><td>19.6%</td><td><span className="dash-status">Trending</span></td></tr>
						</tbody></table></div>
					</section>

					<section className="dash-card dash-panel dash-support" aria-labelledby="support-heading">
						<div className="dash-panel-title"><div><h2 id="support-heading">Support tickets</h2><p>Latest tickets from your support team</p></div><a href="#support" style={{ color: "#635bff", fontSize: 11, textDecoration: "none" }}>View all →</a></div>
						{supportLoading ? <div className="dash-support-message" role="status">Loading support tickets…</div> : supportError ? <div className="dash-support-message" role="alert">{supportError}</div> : !supabaseClient ? <div className="dash-support-message">Pass a Supabase client as the supabaseClient prop to load support_tickets.</div> : supportTickets.length === 0 ? <div className="dash-support-message">No support tickets found.</div> : <div style={{ overflowX: "auto" }}><table className="dash-table"><thead><tr><th>SUBJECT</th><th>REQUESTER</th><th>PRIORITY</th><th>STATUS</th><th>CREATED</th></tr></thead><tbody>
							{supportTickets.map((ticket, index) => {
								const status = String(ticket.status || "open").toLowerCase();
								const createdAt = ticket.created_at ? new Date(ticket.created_at).toLocaleDateString() : "—";
								return <tr key={ticket.id || index}><td>{ticket.subject || ticket.title || "Untitled ticket"}</td><td>{ticket.requester_name || ticket.customer_name || ticket.email || "—"}</td><td>{ticket.priority || "—"}</td><td><span className="dash-support-status" data-status={status}>{status}</span></td><td>{createdAt}</td></tr>;
							})}
						</tbody></table></div>}
					</section>
				</main>
			</div>
		</div>
	);
}
