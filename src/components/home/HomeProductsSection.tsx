import Link from 'next/link';
import { getAllProducts, splitPipeList } from '@/lib/cms';

/**
 * "Current offerings" grid — loops over getAllProducts(), same as the
 * shop page and footer. A new active SKU appears here automatically
 * (numbered sequentially, "More coming soon" stays last).
 */
export default async function HomeProductsSection() {
  const products = await getAllProducts();

  return (
    <section id="products" aria-labelledby="products-heading">
      <div className="products-header reveal">
        <div>
          <p className="s-eye">Our SKUs</p>
          <h2 id="products-heading" className="s-title">
            Current <em>offerings</em>
          </h2>
        </div>
        <Link href="/contact" className="btn-text">
          Request Catalogue
        </Link>
      </div>

      <div className="products-grid reveal-grid">
        {products.map((product, i) => {
          const tags = splitPipeList(product.badges);

          return (
            <article key={product.product_id} className="p-card reveal">
              <p className="p-num" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </p>
              {product.shop_card_category && <p className="p-cat">{product.shop_card_category}</p>}
              <h3 className="p-name">
                {product.title_line1}
                <br />
                {product.title_emphasis}
              </h3>
              {product.shop_card_desc && <p className="p-desc">{product.shop_card_desc}</p>}
              {tags.length > 0 && (
                <ul className="p-tags" aria-label="Product attributes">
                  {tags.map((tag) => (
                    <li className="tag" key={tag}>
                      {tag}
                    </li>
                  ))}
                </ul>
              )}
              <div className="p-links">
                <Link href={`/products/${product.slug}`} className="p-link-primary">
                  View Product
                </Link>
                <Link href={`/contact?product=${product.slug}`} className="p-link-enquire">
                  Enquire
                </Link>
              </div>
            </article>
          );
        })}

        <div
          className="p-card reveal"
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            background: 'var(--bg-alt)',
          }}
        >
          <p className="p-num" aria-hidden="true">
            +
          </p>
          <p className="s-eye" style={{ justifyContent: 'center' }}>
            Growing Range
          </p>
          <h3 className="p-name">
            More
            <br />
            <em>coming soon</em>
          </h3>
          <p className="p-desc" style={{ textAlign: 'center' }}>
            Our catalogue is expanding. Contact us for custom sourcing requirements or to discuss
            ingredients not yet listed.
          </p>
          <Link href="/contact" className="btn-outline" style={{ marginTop: '1rem' }}>
            Discuss Your Needs
          </Link>
        </div>
      </div>
    </section>
  );
}
