import { unstable_cache } from 'next/cache';
import { getSheetRows, SHEET_IDS } from './sheets';
import type {
  Product,
  ProductSection,
  SpecRow,
  CardSection,
  ProductCard,
  Faq,
  FullProduct,
  ProductPageBlock,
  ProductSectionWithSpecs,
  CardSectionWithCards,
} from './types';

/**
 * Tag used for ALL CMS reads. The manual "refresh content" trigger
 * (POST /api/revalidate) calls revalidateTag('cms-content'), which
 * invalidates every cached function below at once. Until that happens,
 * Next.js keeps serving the cached result indefinitely (no time-based
 * expiry) — content only changes when someone deliberately publishes it.
 */
const CMS_TAG = 'cms-content';

const cacheOpts = { tags: [CMS_TAG] };

// ---------------------------------------------------------------------------
// Raw, cached sheet readers — one per tab
// ---------------------------------------------------------------------------

const getProductsRaw = unstable_cache(
  () => getSheetRows(SHEET_IDS.products),
  ['cms-products'],
  cacheOpts
);

const getSectionsRaw = unstable_cache(
  () => getSheetRows(SHEET_IDS.sections),
  ['cms-sections'],
  cacheOpts
);

const getSpecsRaw = unstable_cache(
  () => getSheetRows(SHEET_IDS.specs),
  ['cms-specs'],
  cacheOpts
);

const getCardSectionsRaw = unstable_cache(
  () => getSheetRows(SHEET_IDS.cardSections),
  ['cms-card-sections'],
  cacheOpts
);

const getCardsRaw = unstable_cache(
  () => getSheetRows(SHEET_IDS.cards),
  ['cms-cards'],
  cacheOpts
);

const getFaqsRaw = unstable_cache(
  () => getSheetRows(SHEET_IDS.faqs),
  ['cms-faqs'],
  cacheOpts
);

// ---------------------------------------------------------------------------
// Typed mappers — sheet rows are all strings; convert numeric columns
// ---------------------------------------------------------------------------

function toInt(value: string, fallback = 0): number {
  const n = parseInt(value, 10);
  return Number.isNaN(n) ? fallback : n;
}

function mapProduct(row: Record<string, string>): Product {
  return row as unknown as Product;
}

function mapSection(row: Record<string, string>): ProductSection {
  return {
    ...row,
    section_order: toInt(row.section_order),
  } as unknown as ProductSection;
}

function mapSpec(row: Record<string, string>): SpecRow {
  return {
    ...row,
    row_order: toInt(row.row_order),
  } as unknown as SpecRow;
}

function mapCardSection(row: Record<string, string>): CardSection {
  return {
    ...row,
    section_order: toInt(row.section_order),
  } as unknown as CardSection;
}

function mapCard(row: Record<string, string>): ProductCard {
  return {
    ...row,
    card_order: toInt(row.card_order),
  } as unknown as ProductCard;
}

function mapFaq(row: Record<string, string>): Faq {
  return {
    ...row,
    faq_order: toInt(row.faq_order),
  } as unknown as Faq;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * All products with status === "active", in product_id order.
 *
 * This is the function the shop/listing page and generateStaticParams()
 * loop over — add a new row to 01-products (with status "active") and it
 * appears here automatically, no code changes needed.
 */
export async function getAllProducts(): Promise<Product[]> {
  const rows = await getProductsRaw();
  return rows
    .map(mapProduct)
    .filter((p) => p.status?.toLowerCase() === 'active')
    .sort((a, b) => a.product_id.localeCompare(b.product_id));
}

/**
 * Look up a single product by its URL slug (e.g. "fullers-earth").
 * Returns undefined if no active product matches.
 */
export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const products = await getAllProducts();
  return products.find((p) => p.slug === slug);
}

/**
 * Fetches and assembles everything needed to render one product page:
 * the product record, every content section (text + card grids) in
 * display order with their specs/cards joined in, and the FAQ list.
 *
 * Returns null if the slug doesn't match an active product.
 */
export async function getFullProduct(slug: string): Promise<FullProduct | null> {
  const product = await getProductBySlug(slug);
  if (!product) return null;

  const [sectionRows, specRows, cardSectionRows, cardRows, faqRows] = await Promise.all([
    getSectionsRaw(),
    getSpecsRaw(),
    getCardSectionsRaw(),
    getCardsRaw(),
    getFaqsRaw(),
  ]);

  const sections = sectionRows.map(mapSection).filter((s) => s.product_id === product.product_id);
  const specs = specRows.map(mapSpec).filter((s) => s.product_id === product.product_id);
  const cardSections = cardSectionRows
    .map(mapCardSection)
    .filter((s) => s.product_id === product.product_id);
  const cards = cardRows.map(mapCard).filter((c) => c.product_id === product.product_id);
  const faqs = faqRows
    .map(mapFaq)
    .filter((f) => f.product_id === product.product_id)
    .sort((a, b) => a.faq_order - b.faq_order);

  const textBlocks: ProductPageBlock[] = sections.map((section) => {
    const sectionSpecs = specs
      .filter((s) => s.section_id === section.section_id)
      .sort((a, b) => a.row_order - b.row_order);
    const withSpecs: ProductSectionWithSpecs = { ...section, specs: sectionSpecs };
    return { kind: 'text', section: withSpecs };
  });

  const cardBlocks: ProductPageBlock[] = cardSections.map((section) => {
    const sectionCards = cards
      .filter((c) => c.section_id === section.section_id)
      .sort((a, b) => a.card_order - b.card_order);
    const withCards: CardSectionWithCards = { ...section, cards: sectionCards };
    return { kind: 'cards', section: withCards };
  });

  // Merge both block types and sort by section_id's numeric suffix
  // (e.g. "001-S03" -> 3). section_order is a per-type counter (text
  // sections and card-grid sections are numbered separately), so it
  // doesn't reflect the true page sequence on its own — but the S0n
  // suffix was assigned in original page order across both types, so
  // sorting on it reproduces overview -> grades -> uses -> technical ->
  // history -> myths etc. correctly.
  const sectionNum = (sectionId: string) => parseInt(sectionId.split('-S')[1] ?? '0', 10);

  const blocks = [...textBlocks, ...cardBlocks].sort((a, b) => {
    return sectionNum(a.section.section_id) - sectionNum(b.section.section_id);
  });


  return { product, blocks, faqs };
}

// ---------------------------------------------------------------------------
// Small parsing helpers shared by components
// ---------------------------------------------------------------------------

/** Splits body_text into paragraphs on blank lines. */
export function splitParagraphs(bodyText: string): string[] {
  return bodyText
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/** Splits a "A | B | C" field into a clean array. */
export function splitPipeList(value: string): string[] {
  return value
    .split('|')
    .map((s) => s.trim())
    .filter(Boolean);
}
