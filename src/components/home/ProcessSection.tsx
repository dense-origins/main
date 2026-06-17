const STEPS = [
  {
    num: '01',
    title: 'Responsible Sourcing',
    desc: 'Direct relationships with origin-site suppliers. Every raw material is evaluated for purity, consistency, and traceability before procurement.',
  },
  {
    num: '02',
    title: 'Quality Testing',
    desc: 'Third-party laboratory verification of every batch — adulterants, moisture content, mesh size, and full compliance with international food and cosmetic standards.',
  },
  {
    num: '03',
    title: 'Premium Packaging',
    desc: 'Packaging designed to protect product integrity, extend shelf life, and present a premium identity. Private label and custom specification available.',
  },
  {
    num: '04',
    title: 'Export & Delivery',
    desc: 'Full export documentation, phytosanitary certificates, and logistics management for seamless international delivery across multiple continents.',
  },
];

export default function ProcessSection() {
  return (
    <section id="process" aria-labelledby="process-heading">
      <div className="process-header reveal">
        <p className="s-eye">How We Work</p>
        <h2 id="process-heading" className="s-title">
          From source
          <br />
          <em>to shipment</em>
        </h2>
      </div>
      <ol className="process-grid reveal-grid" aria-label="Our export process steps">
        {STEPS.map((step) => (
          <li className="proc-step reveal" key={step.num}>
            <p className="proc-num">{step.num}</p>
            <h3 className="proc-title">{step.title}</h3>
            <p className="proc-desc">{step.desc}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
