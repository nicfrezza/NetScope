import React from "react";

const links = [
	{ label: "Dashboard", href: "/", icon: "⌂" },
	{ label: "Devices", href: "/devices", icon: "▣" },
	{ label: "Network", href: "/network", icon: "◎" },
	{ label: "Alerts", href: "/alerts", icon: "♢" },
	{ label: "Reports", href: "/reports", icon: "▤" },
];

export default function SideBar({ activePath, onNavigate }) {
	return (
		<aside className="sidebar">
			<a className="sidebar__brand" href="/" aria-label="NetScope home">
				<span className="sidebar__brand-mark" aria-hidden="true">◈</span>
				<span>NetScope</span>
			</a>

			<nav aria-label="Main navigation">
				<ul className="sidebar__links">
					{links.map(({ label, href, icon }) => {
						const active = activePath ? activePath === href : href === "/";
						return (
							<li key={href}>
								<a
									className={`sidebar__link${active ? " sidebar__link--active" : ""}`}
									href={href}
									aria-current={active ? "page" : undefined}
									onClick={onNavigate ? (event) => onNavigate(href, event) : undefined}
								>
									<span className="sidebar__icon" aria-hidden="true">{icon}</span>
									<span>{label}</span>
								</a>
							</li>
						);
					})}
				</ul>
			</nav>

			<div className="sidebar__footer">Network monitoring</div>

			<style>{`
				.sidebar {
					box-sizing: border-box;
					display: flex;
					flex: 0 0 240px;
					flex-direction: column;
					min-height: 100vh;
					padding: 24px 16px 16px;
					color: #dbe5f2;
					background: #101827;
					border-right: 1px solid #263244;
					font-family: Inter, system-ui, sans-serif;
				}
				.sidebar__brand {
					display: flex;
					align-items: center;
					gap: 10px;
					margin: 0 8px 34px;
					color: #f8fafc;
					font-size: 20px;
					font-weight: 700;
					text-decoration: none;
				}
				.sidebar__brand-mark { color: #38bdf8; font-size: 24px; }
				.sidebar__links { display: grid; gap: 6px; margin: 0; padding: 0; list-style: none; }
				.sidebar__link {
					display: flex;
					align-items: center;
					gap: 12px;
					padding: 11px 12px;
					border-radius: 8px;
					color: #9aa9bd;
					font-size: 14px;
					text-decoration: none;
					transition: background-color 150ms ease, color 150ms ease;
				}
				.sidebar__link:hover, .sidebar__link--active { color: #f8fafc; background: #243247; }
				.sidebar__icon { width: 20px; color: #7dd3fc; font-size: 17px; text-align: center; }
				.sidebar__footer {
					margin-top: auto;
					padding: 16px 8px 0;
					border-top: 1px solid #263244;
					color: #718096;
					font-size: 12px;
				}
				@media (max-width: 640px) {
					.sidebar { flex-basis: 68px; width: 68px; padding: 20px 8px; }
					.sidebar__brand { justify-content: center; margin: 0 0 30px; }
					.sidebar__brand > span:last-child, .sidebar__link > span:last-child, .sidebar__footer { display: none; }
					.sidebar__link { justify-content: center; padding: 12px 8px; }
				}
			`}</style>
		</aside>
	);
}
