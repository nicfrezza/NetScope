import React from "react";

export default function StatCard({ title, value, icon, change, trend, className = "" }) {
	const trendClass =
		trend === "up" || trend === "positive"
			? "text-emerald-600"
			: trend === "down" || trend === "negative"
				? "text-rose-600"
				: "text-gray-500";

	return (
		<article
			className={`rounded-xl border border-gray-200 bg-white p-5 shadow-sm ${className}`}
		>
			<div className="flex items-start justify-between gap-4">
				<div>
					<h2 className="text-sm font-medium text-gray-500">{title}</h2>
					<p className="mt-2 text-2xl font-semibold tracking-tight text-gray-900">
						{value}
					</p>
				</div>
				{icon && (
					<div className="rounded-lg bg-gray-100 p-2.5 text-gray-600" aria-hidden="true">
						{icon}
					</div>
				)}
			</div>
			{change != null && (
				<p className={`mt-4 text-sm font-medium ${trendClass}`}>{change}</p>
			)}
		</article>
	);
}
