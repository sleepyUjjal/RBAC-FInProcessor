const trendStyles = {
  up: "bg-emerald-100 text-emerald-700",
  down: "bg-rose-100 text-rose-700",
  neutral: "bg-slate-100 text-slate-700",
};

const StatsCard = ({ title, value, subtitle, trend, trendDirection = "neutral" }) => {
  const badgeClass = trendStyles[trendDirection] || trendStyles.neutral;

  return (
    <article className="rounded-lg border border-[var(--border)] bg-white p-4">
      <p className="text-xs uppercase tracking-[0.08em] text-[var(--text)]">{title}</p>
      <h3 className="mt-2 text-2xl font-semibold text-[var(--text-h)]">{value}</h3>
      {subtitle ? <p className="mt-2 text-sm text-[var(--text)]">{subtitle}</p> : null}

      {trend ? (
        <span className={`mt-3 inline-flex rounded-full px-2 py-1 text-xs font-medium ${badgeClass}`}>
          {trend}
        </span>
      ) : null}
    </article>
  );
};

export default StatsCard;

