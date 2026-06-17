import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllProducts, getFullProduct } from '@/lib/cms';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import ScrollReveal from '@/components/ScrollReveal';
import ProductHero from '@/components/ProductHero';
import TwoColSection from '@/components/TwoColSection';
import CardGridSection from '@/components/CardGridSection';
import FaqSection from '@/components/FaqSection';
import ProductCta from '@/components/ProductCta';

interface ProductPageProps {
  params: { slug: string };
}

/**
 * Pre-renders one route per active product in 01-products. Adding a new
 * SKU (with status "active") makes a new page appear here automatically
 * — no code change needed. If a slug is requested that didn't exist at
 * build time, Next.js still renders it on demand (dynamicParams default).
 */
export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const data = await getFullProduct(params.slug);
  if (!data) return {};

  const { product } = data;
  return {
    title: product.meta_title || product.name,
    description: product.meta_description || product.subtitle,
    keywords: product.meta_keywords || undefined,
    alternates: product.canonical_url ? { canonical: product.canonical_url } : undefined,
    openGraph: {
      type: 'website',
      title: product.meta_title || product.name,
      description: product.meta_description || product.subtitle,
      url: product.canonical_url || undefined,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const data = await getFullProduct(params.slug);
  if (!data) notFound();

  const { product, blocks, faqs } = data;

  return (
    <>
      <SiteHeader />
      <main id="main-content">
        <ProductHero product={product} />

        {blocks.map((block) =>
          block.kind === 'text' ? (
            <TwoColSection key={block.section.section_id} section={block.section} />
          ) : (
            <CardGridSection key={block.section.section_id} section={block.section} />
          )
        )}

        <FaqSection faqs={faqs} />
        <ProductCta product={product} />
      </main>
      <SiteFooter />
      <ScrollReveal />
    </>
  );
}
