const REASONS = [
  {
    icon: '🔬',
    title: 'Batch-Level Transparency',
    desc: "Every shipment arrives with a Certificate of Analysis from an accredited third-party lab. No guesswork — just verifiable data on what's inside every bag.",
  },
  {
    icon: '📦',
    title: 'Packaging That Sells',
    desc: "In premium markets, the vessel communicates the value of what's inside. Our packaging is engineered for both protection and shelf presence.",
  },
  {
    icon: '🌍',
    title: 'Export-Ready Documentation',
    desc: 'MSDS, CoA, phytosanitary certificates, Halal/Kosher on request. We handle the paperwork so you can focus on your market.',
  },
  {
    icon: '🤝',
    title: 'Flexible MOQ & Custom Specs',
    desc: "Whether you're a startup formulator or a large-scale manufacturer, we work to your exact mesh, grade, or pack size requirements.",
  },
  {
    icon: '⚡',
    title: 'Direct & Responsive',
    desc: 'No layers of distribution. You deal directly with the source. Faster decisions, better pricing, and cleaner communication every time.',
  },
];

export default function WhyUsSection() {
  return (
    <section id="why" aria-labelledby="why-heading">
      <div className="why-sticky reveal">
        <p className="s-eye">Differentiation</p>
        <h2 id="why-heading" className="s-title">
          Why <em>Dense
          <br />
          Origins?</em>
        </h2>
        <p className="s-subtitle" style={{ marginTop: '1.5rem' }}>
          Five reasons buyers across four continents return to us.
        </p>
      </div>
      <ul className="why-list reveal-grid" role="list" aria-label="Key differentiators">
        {REASONS.map((reason) => (
          <li className="why-item reveal" key={reason.title}>
            <div className="why-icon" aria-hidden="true">
              {reason.icon}
            </div>
            <div>
              <h3 className="why-t">{reason.title}</h3>
              <p className="why-d">{reason.desc}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
