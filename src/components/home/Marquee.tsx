const ITEMS = [
  "Psyllium Husk",
  "Fuller's Earth",
  'Premium Cashews',
  'Natural Almonds',
  'Sun-Dried Raisins',
  'Lab Certified',
  'B2B Export Ready',
  'India Origin',
];

export default function Marquee() {
  // Render the list twice back-to-back so the CSS animation
  // (translateX(-50%)) loops seamlessly.
  const doubled = [...ITEMS, ...ITEMS];

  return (
    <div className="marquee-strip" aria-hidden="true" role="presentation">
      <div className="marquee-track">
        {doubled.map((item, i) => (
          <div className="marquee-item" key={i}>
            {item} <span className="mdot" />
          </div>
        ))}
      </div>
    </div>
  );
}
