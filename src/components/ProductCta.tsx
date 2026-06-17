import Link from 'next/link';
import type { Product } from '@/lib/types';

/**
 * Closing CTA band. The original static pages had bespoke per-product
 * copy here ("Ready to source Fuller's Earth?" + a tailored paragraph).
 * That copy isn't in the CMS yet, so this derives a perfectly serviceable
 * version from existing fields (name + shop_card_desc).
 *
 * If you want bespoke CTA copy per product, add `cta_title` / `cta_desc`
 * columns to 01-products and swap them in here — everything else about
 * this component stays the same.
 */
export default function ProductCta({ product }: { product: Product }) {
  return (
    <section className="prod-cta" aria-label={`Enquire about ${product.name}`}>
      <div className="prod-cta-inner reveal">
        <h2 className="prod-cta-title">
          Ready to source
          <br />
          <em>{product.name}?</em>
        </h2>
        {product.shop_card_desc && <p className="prod-cta-desc">{product.shop_card_desc}</p>}
        <div className="prod-cta-actions">
          <Link href={`/contact?product=${product.slug}&type=sample`} className="btn-primary">
            Request Free Sample
          </Link>
          <Link
            href={`/contact?product=${product.slug}&type=bulk-quote`}
            className="btn-outline"
            style={{ borderColor: 'rgba(200,169,110,.4)', color: 'rgba(200,169,110,.85)' }}
          >
            Get Bulk Quote
          </Link>
          <Link href="/shop" className="btn-text" style={{ color: 'rgba(200,169,110,.55)' }}>
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}
