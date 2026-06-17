const VALUES = [
  {
    title: 'Origin Traceability',
    desc: 'Every batch traceable to its source region and supplier.',
  },
  {
    title: 'Zero Adulteration',
    desc: 'No fillers, binders, or synthetic additives. Ever.',
  },
  {
    title: 'Premium Presentation',
    desc: 'Packaging engineered for shelf life and first impression.',
  },
  {
    title: 'Export Compliant',
    desc: 'Documentation and certifications ready for global markets.',
  },
];

export default function AboutSection() {
  return (
    <section id="about" aria-labelledby="about-heading">
      <div className="about-grid">
        <div className="reveal">
          <p className="s-eye">Our Story</p>
          <h2 id="about-heading" className="s-title">
            Where <em>density</em>
            <br />
            meets purity
          </h2>
          <div className="about-body">
            <p>
              Dense Origins was founded on a singular conviction — that the world deserves access
              to raw, natural ingredients in their most unadulterated form, presented without
              compromise.
            </p>
            <p>
              Based in India, we source directly from the origin, verify every batch with rigour,
              and deliver with premium packaging that signals trust before a seal is ever broken.
              Our customers span the EU, Middle East, North America, and Southeast Asia.
            </p>
            <p>
              From the clay-rich soils of Gujarat to the cashew orchards of the Konkan coast —
              every ingredient carries the story of its land.
            </p>
          </div>
          <div className="values-grid">
            {VALUES.map((v) => (
              <div className="val" key={v.title}>
                <h3 className="val-title">{v.title}</h3>
                <p className="val-desc">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="reveal">
          <div className="quote-card">
            <p className="quote-label">Our Philosophy</p>
            <blockquote className="quote-text">
              &ldquo;The finest ingredients need no introduction — only honest handling and
              respectful presentation.&rdquo;
            </blockquote>
            <p className="quote-attr">— Dense Origins</p>
          </div>
        </div>
      </div>
    </section>
  );
}
