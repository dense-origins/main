import Link from 'next/link';
import Image from 'next/image';

export default function HeroSection() {
  return (
    <section className="hero" aria-label="Dense Origins — Premium Natural Ingredient Exporter from India">
      <div className="hero-bg" aria-hidden="true">
        <Image src="/images/hero.png" alt="" fill priority style={{ objectFit: 'cover' }} />
      </div>
      <div className="hero-content">
        <p className="hero-eyebrow">Premium Natural Ingredients · B2B Export · India</p>
        <h1 className="hero-title">
          From India&apos;s earth,
          <br />
          <em>pure and unchanged.</em>
        </h1>
        <p className="hero-desc">
          Dense Origins sources, certifies, and exports five premium natural ingredients —
          Psyllium Husk, Fuller&apos;s Earth, Cashews, Almonds and Raisins — delivered to
          manufacturers worldwide with uncompromising quality.
        </p>
        <div className="hero-actions">
          <Link href="/shop" className="btn-primary">
            Explore Products
          </Link>
          <Link href="/contact" className="btn-outline">
            Request a Sample
          </Link>
        </div>
      </div>
      <div className="hero-scroll" aria-hidden="true">
        <div className="hero-scroll-line" />
        <span>Scroll</span>
      </div>
    </section>
  );
}
