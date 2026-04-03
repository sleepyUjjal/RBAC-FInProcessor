const trendStyles = {
  up: "bg-emerald-100 text-emerald-800",
  down: "bg-[rgba(125,47,47,0.14)] text-[rgba(95,35,35,1)]",
  neutral: "bg-[var(--surface-muted)] text-[var(--text-h)]",
};

const StatsCard = ({ title, value, subtitle, trend, trendDirection = "neutral" }) => {
  const badgeClass = trendStyles[trendDirection] || trendStyles.neutral;

  return (
    <article className="panel-elevated relative overflow-hidden p-5">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[var(--gold)] via-[var(--gold-soft)] to-[var(--gold-deep)]" />
      <p className="text-xs uppercase tracking-[0.12em] text-[var(--text)]">{title}</p>
      <h3 className="mt-2 text-3xl font-semibold text-[var(--text-h)]">{value}</h3>
      {subtitle ? <p className="mt-2 text-sm text-[var(--text)]">{subtitle}</p> : null}

      {trend ? (
        <span className={`mt-4 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${badgeClass}`}>
          {trend}
        </span>
      ) : null}
    </article>
  );
};

export default StatsCard;
