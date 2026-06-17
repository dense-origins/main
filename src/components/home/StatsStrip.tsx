const STATS = [
  { num: '5', label: 'Premium SKUs' },
  { num: '100%', label: 'Natural Sourcing' },
  { num: '4+', label: 'Export Regions' },
  { num: 'CoA', label: 'Every Batch' },
];

export default function StatsStrip() {
  return (
    <div className="stats-strip" aria-label="Dense Origins key numbers">
      <div className="stats-inner">
        {STATS.map((stat) => (
          <div className="stat-box reveal" key={stat.label}>
            <div className="stat-num">{stat.num}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
