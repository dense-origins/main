import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getAllProducts, splitPipeList } from '@/lib/cms';
import { resolveProductImage } from '@/lib/images';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import ScrollReveal from '@/components/ScrollReveal';

export const metadata: Metadata = {
  title: 'Product Catalogue',
  description:
    "Browse Dense Origins' full catalogue of premium B2B natural ingredients — Psyllium Husk, Fuller's Earth, Cashews, Almonds and Raisins. Lab-certified, export-ready from India.",
};

/**
 * Catalogue grid — loops over getAllProducts(). A new active SKU in
 * 01-products appears here automatically, in product_id order.
 */
export default async function ShopPage() {
  const products = await getAllProducts();

  return (
    <>
      <SiteHeader />
      <main id="main-content">
        <div className="page-hero">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Products</span>
          </nav>
          <h1>Our Product Catalogue</h1>
          <p>
            {products.length} premium natural ingredients sourced responsibly, verified by
            third-party labs, and exported globally. Each product backed by full documentation and
            flexible MOQs.
          </p>
        </div>

        <section>
          <div className="section-inner">
            <div className="shop-header">
              <p className="shop-count">{products.length} products</p>
            </div>

            <div className="products-listing">
              {products.map((product) => {
                const image = resolveProductImage(product.shop_card_image);
                const tags = splitPipeList(product.badges).slice(0, 4);

                return (
                  <Link
                    key={product.product_id}
                    href={`/products/${product.slug}`}
                    className="shop-card reveal"
                    aria-label={`${product.name} — view product`}
                  >
                    <div className="shop-card-img">
                      {image?.type === 'image' ? (
                        <Image src={image.value} alt={product.name} fill sizes="(max-width: 768px) 100vw, 50vw" />
                      ) : image?.type === 'emoji' ? (
                        <span className="shop-card-emoji" aria-hidden="true">
                          {image.value}
                        </span>
                      ) : null}
                      {product.shop_card_badge && (
                        <span className="shop-card-badge">{product.shop_card_badge}</span>
                      )}
                    </div>
                    <div className="shop-card-body">
                      {product.shop_card_category && (
                        <p className="shop-card-cat">{product.shop_card_category}</p>
                      )}
                      <h2 className="shop-card-name">{product.name}</h2>
                      {product.shop_card_desc && (
                        <p className="shop-card-desc">{product.shop_card_desc}</p>
                      )}
                      {tags.length > 0 && (
                        <div className="shop-card-tags">
                          {tags.map((tag) => (
                            <span className="tag" key={tag}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="shop-card-footer">
                        <span className="shop-card-cta">View Details</span>
                        <span className="shop-card-enquire">Enquire</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
      <ScrollReveal />
    </>
  );
}
