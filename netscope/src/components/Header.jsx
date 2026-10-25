import React from 'react';

const navigation = [
	{ label: 'Visão geral', href: '#overview' },
	{ label: 'Dispositivos', href: '#devices' },
	{ label: 'Alertas', href: '#alerts' },
	{ label: 'Relatórios', href: '#reports' },
];

export default function Header() {
	return (
		<header className="netscope-header">
			<a className="netscope-header__brand" href="#overview" aria-label="NetScope — início">
				<span className="netscope-header__mark" aria-hidden="true">N</span>
				<span>NetScope</span>
			</a>

			<nav className="netscope-header__nav" aria-label="Navegação principal">
				{navigation.map((item, index) => (
					<a
						key={item.href}
						href={item.href}
						className={`netscope-header__link${index === 0 ? ' is-active' : ''}`}
						aria-current={index === 0 ? 'page' : undefined}
					>
						{item.label}
					</a>
				))}
			</nav>

			<div className="netscope-header__status">
				<span className="netscope-header__status-dot" aria-hidden="true" />
				<span>Sistema operacional</span>
			</div>

			<style>{`
				.netscope-header {
					box-sizing: border-box;
					display: flex;
					align-items: center;
					justify-content: space-between;
					gap: 24px;
					width: 100%;
					min-height: 68px;
					padding: 12px 28px;
					background: #fff;
					border-bottom: 1px solid #e5e7eb;
					color: #111827;
					font-family: inherit;
				}
				.netscope-header__brand {
					display: inline-flex;
					align-items: center;
					gap: 10px;
					color: inherit;
					font-size: 18px;
					font-weight: 700;
					text-decoration: none;
					white-space: nowrap;
				}
				.netscope-header__mark {
					display: grid;
					width: 36px;
					height: 36px;
					place-items: center;
					border-radius: 9px;
					background: #2563eb;
					color: #fff;
				}
				.netscope-header__nav {
					display: flex;
					align-items: center;
					justify-content: center;
					gap: 6px;
				}
				.netscope-header__link {
					padding: 9px 12px;
					border-radius: 6px;
					color: #4b5563;
					font-size: 14px;
					font-weight: 500;
					text-decoration: none;
					white-space: nowrap;
				}
				.netscope-header__link:hover { background: #f3f4f6; }
				.netscope-header__link.is-active { background: #eff6ff; color: #1d4ed8; }
				.netscope-header__status {
					display: inline-flex;
					align-items: center;
					gap: 8px;
					color: #15803d;
					font-size: 13px;
					white-space: nowrap;
				}
				.netscope-header__status-dot {
					width: 8px;
					height: 8px;
					border-radius: 50%;
					background: #22c55e;
				}
				@media (max-width: 720px) {
					.netscope-header { flex-wrap: wrap; gap: 12px 20px; padding: 12px 16px; }
					.netscope-header__nav {
						order: 3;
						justify-content: flex-start;
						width: 100%;
						overflow-x: auto;
					}
					.netscope-header__link { padding: 8px; }
					.netscope-header__status { margin-left: auto; font-size: 12px; }
				}
			`}</style>
		</header>
	);
}
