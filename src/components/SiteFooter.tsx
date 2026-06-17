import Link from 'next/link';
import Image from 'next/image';
import { getAllProducts } from '@/lib/cms';

/**
 * Site footer — the "Products" column is generated from
 * getAllProducts(), so a new SKU added to the 01-products sheet appears
 * here automatically.
 */
export default async function SiteFooter() {
  const products = await getAllProducts();

  return (
    <footer className="site-footer" role="contentinfo">
      <div className="footer-inner">
        <div>
          <Image
            src="/images/dense_origins_logo.png"
            alt="Dense Origins"
            width={140}
            height={50}
            className="footer-logo"
          />
          <p className="footer-tagline">Premium B2B exporter of natural raw ingredients from India.</p>
          <p className="footer-copy">© {new Date().getFullYear()} Dense Origins. All rights reserved.</p>
        </div>

        <div className="footer-col">
          <h4>Products</h4>
          <ul>
            {products.map((p) => (
              <li key={p.product_id}>
                <Link href={`/products/${p.slug}`}>{p.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-col">
          <h4>Company</h4>
          <ul>
            <li>
              <Link href="/#about">About Us</Link>
            </li>
            <li>
              <Link href="/#process">Our Process</Link>
            </li>
            <li>
              <Link href="/#why">Why Us</Link>
            </li>
            <li>
              <Link href="/#faq">FAQ</Link>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Contact</h4>
          <ul>
            <li>
              <Link href="/contact">Enquire Now</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">Dense Origins · Natural Raw Ingredient Exporter, India</div>
    </footer>
  );
}
