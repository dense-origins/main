import Link from 'next/link';
import { getAllProducts } from '@/lib/cms';
import EnquiryForm from '@/components/EnquiryForm';

export default async function HomeContactSection({ defaultProduct }: { defaultProduct?: string }) {
  const products = await getAllProducts();

  return (
    <section id="contact" aria-labelledby="contact-heading">
      <div className="contact-grid">
        <div className="reveal">
          <p className="s-eye">Get in Touch</p>
          <h2 id="contact-heading" className="s-title">
            Let&apos;s talk
            <br />
            <em>ingredients</em>
          </h2>
          <p className="contact-intro">
            Whether you&apos;re looking for a sample, a bulk quote, or simply want to learn more
            about our products — we&apos;d love to hear from you.
          </p>
          <address className="contact-meta" style={{ fontStyle: 'normal' }}>
            <div className="cm-item">
              <span className="cm-label">Based In</span>
              <span className="cm-val">India</span>
            </div>
            <div className="cm-item">
              <span className="cm-label">Exports To</span>
              <span className="cm-val">EU · Middle East · North America · Southeast Asia</span>
            </div>
            <div className="cm-item">
              <span className="cm-label">Products</span>
              <span className="cm-val">{products.map((p) => p.name).join(' · ')}</span>
            </div>
          </address>
          <div style={{ marginTop: '2rem' }}>
            <Link
              href="/contact"
              className="btn-outline"
              style={{ borderColor: 'rgba(200,169,110,.4)', color: 'rgba(200,169,110,.75)' }}
            >
              Full Contact Page →
            </Link>
          </div>
        </div>

        <EnquiryForm variant="compact" products={products} defaultProduct={defaultProduct} />
      </div>
    </section>
  );
}
