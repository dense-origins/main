import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllProducts } from '@/lib/cms';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import ScrollReveal from '@/components/ScrollReveal';
import EnquiryForm from '@/components/EnquiryForm';

export const metadata: Metadata = {
  title: 'Contact & Enquiry',
  description:
    "Contact Dense Origins for bulk pricing, samples, or product enquiries. We export Psyllium Husk, Fuller's Earth, Cashews, Almonds and Raisins from India globally.",
};

// Small presentational touch for the "Our Products" quick-links list.
// Falls back to a generic box icon for any SKU not listed here, so a new
// product added to the sheet still renders correctly.
const PRODUCT_EMOJI: Record<string, string> = {
  'psyllium-husk': '🌾',
  'fullers-earth': '🪨',
  cashews: '🥜',
  almonds: '🫘',
  raisins: '🍇',
};

interface ContactPageProps {
  searchParams: { product?: string; type?: string };
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const products = await getAllProducts();

  return (
    <>
      <SiteHeader dark />
      <main id="main-content" className="contact-page">
        <div className="contact-page-inner">
          {/* Left: Info */}
          <div className="contact-left reveal">
            <nav className="breadcrumb" aria-label="Breadcrumb" style={{ marginBottom: '2rem' }}>
              <Link href="/" style={{ color: 'rgba(200,169,110,.45)' }}>
                Home
              </Link>
              <span style={{ color: 'rgba(200,169,110,.2)' }}>/</span>
              <span style={{ color: 'rgba(200,169,110,.55)' }}>Contact</span>
            </nav>

            <p className="s-eye">Get in Touch</p>
            <h1 className="s-title">
              Let&apos;s talk
              <br />
              <em>ingredients</em>
            </h1>
            <p className="contact-lead">
              Whether you need a sample, a bulk quote, a Certificate of Analysis, or simply want
              to discuss your sourcing requirements — we respond within 24 hours.
            </p>

            <div className="contact-info-block">
              <h3>Company Details</h3>
              <div className="info-row">
                <span className="info-icon" aria-hidden="true">
                  📍
                </span>
                <div>
                  <p className="info-label">Based In</p>
                  <p className="info-val">India</p>
                </div>
              </div>
              <div className="info-row">
                <span className="info-icon" aria-hidden="true">
                  🌍
                </span>
                <div>
                  <p className="info-label">Exports To</p>
                  <p className="info-val">EU · Middle East · North America · Southeast Asia · Worldwide</p>
                </div>
              </div>
              <div className="info-row">
                <span className="info-icon" aria-hidden="true">
                  ⏱️
                </span>
                <div>
                  <p className="info-label">Response Time</p>
                  <p className="info-val">Within 24 hours on business days</p>
                </div>
              </div>
            </div>

            <div className="contact-info-block">
              <h3>Our Products</h3>
              <div className="products-quick">
                {products.map((product) => (
                  <Link key={product.product_id} href={`/products/${product.slug}`} className="pq-item">
                    <span className="pq-emoji" aria-hidden="true">
                      {PRODUCT_EMOJI[product.slug] ?? '📦'}
                    </span>
                    <div>
                      <p className="pq-name">{product.name}</p>
                      {product.shop_card_category && <p className="pq-cat">{product.shop_card_category}</p>}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="contact-form-card reveal">
            <h2>Send an Enquiry</h2>
            <p>
              Fill in your requirements below and we&apos;ll get back to you with pricing,
              availability, and documentation details.
            </p>

            <EnquiryForm
              variant="full"
              products={products}
              defaultProduct={searchParams.product}
              defaultType={searchParams.type}
            />
          </div>
        </div>
      </main>
      <SiteFooter />
      <ScrollReveal />
    </>
  );
}
