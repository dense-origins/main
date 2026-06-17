import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { splitPipeList } from '@/lib/cms';
import { resolveProductImage } from '@/lib/images';

export default function ProductHero({ product }: { product: Product }) {
  const badges = splitPipeList(product.badges);
  const icon = resolveProductImage(product.hero_image);

  const heroStyle = product.hero_bg_gradient
    ? ({ '--hero-bg': product.hero_bg_gradient } as React.CSSProperties)
    : undefined;

  const stats = [
    { value: product.stat1_value, label: product.stat1_label },
    { value: product.stat2_value, label: product.stat2_label },
    { value: product.stat3_value, label: product.stat3_label },
  ].filter((s) => s.value || s.label);

  return (
    <section className="prod-hero" style={heroStyle} aria-labelledby="prod-title">
      <div className="prod-hero-inner">
        <div className="prod-hero-left">
          <nav className="breadcrumb" aria-label="Breadcrumb" style={{ marginBottom: '1.5rem' }}>
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/shop">Products</Link>
            <span>/</span>
            <span aria-current="page">{product.name}</span>
          </nav>

          {product.category_tagline && <p className="prod-cat">{product.category_tagline}</p>}

          <h1 id="prod-title" className="prod-title">
            {product.title_line1}
            <br />
            <em>{product.title_emphasis}</em>
          </h1>

          {product.subtitle && <p className="prod-subtitle">{product.subtitle}</p>}

          {badges.length > 0 && (
            <div className="prod-badges">
              {badges.map((badge) => (
                <span className="tag" key={badge}>
                  {badge}
                </span>
              ))}
            </div>
          )}

          <div className="prod-actions">
            <Link href={`/contact?product=${product.slug}&type=sample`} className="btn-primary">
              Request a Sample
            </Link>
            <Link href={`/contact?product=${product.slug}&type=bulk-quote`} className="btn-text">
              Get Bulk Quote
            </Link>
          </div>
        </div>

        <div className="prod-hero-right">
          <div className="prod-icon-card">
            {icon?.type === 'image' ? (
              <Image
                className="prod-emoji"
                src={icon.value}
                alt={product.name}
                width={180}
                height={180}
              />
            ) : icon?.type === 'emoji' ? (
              <span className="prod-emoji" aria-hidden="true">
                {icon.value}
              </span>
            ) : null}

            {product.botanical_name && (
              <p className="prod-botanical">
                <em>{product.botanical_name}</em>
              </p>
            )}
            {product.origin_text && <p className="prod-origin">{product.origin_text}</p>}

            {stats.length > 0 && (
              <div className="prod-stats">
                {stats.map((stat) => (
                  <div className="prod-stat" key={stat.label}>
                    <div className="prod-stat-num">{stat.value}</div>
                    <div className="prod-stat-label">{stat.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
