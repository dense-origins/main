/**
 * Types mirror the columns of the Dense Origins Product CMS sheets exactly.
 * Sheet -> Type:
 *   01-products            -> Product
 *   02-product_sections    -> ProductSection
 *   03-product_specs       -> SpecRow
 *   04-product_card_sections -> CardSection
 *   05-product_cards       -> ProductCard
 *   06-product_faqs        -> Faq
 *
 * All values arrive from the Sheets API as strings (row -> object mapping
 * by header). Numeric-looking fields (section_order, row_order, card_order,
 * faq_order) are parsed to numbers in lib/cms.ts.
 */

export interface Product {
  product_id: string;
  slug: string;
  status: string; // "active" | "draft" | ...
  name: string;
  title_line1: string;
  title_emphasis: string;
  category_tagline: string;
  subtitle: string;
  badges: string; // pipe-separated: "Tag One | Tag Two"
  hero_image: string;
  hero_bg_gradient: string;
  hero_accent_color: string;
  botanical_name: string;
  origin_text: string;
  stat1_value: string;
  stat1_label: string;
  stat2_value: string;
  stat2_label: string;
  stat3_value: string;
  stat3_label: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  canonical_url: string;
  shop_card_badge: string;
  shop_card_category: string;
  shop_card_desc: string;
  shop_card_image: string;
}

export interface ProductSection {
  product_id: string;
  section_order: number;
  section_id: string; // e.g. "001-S01"
  section_key: string; // "overview" | "history" | "technical" | "nutrition" | "origins" | ...
  background: string; // "default" | "alt"
  eyebrow: string;
  heading_line1: string;
  heading_emphasis: string;
  body_text: string; // paragraphs separated by a blank line ("\n\n")
  callout1_label: string;
  callout1_text: string;
  callout2_label: string;
  callout2_text: string;
  table_note: string;
  image_url: string;
}

export interface SpecRow {
  product_id: string;
  section_id: string;
  row_order: number;
  label: string;
  value: string;
}

export interface CardSection {
  product_id: string;
  section_order: number;
  section_id: string;
  section_key: string; // "grades" | "uses" | "myths" | "varieties"
  background: string;
  eyebrow: string;
  heading_line1: string;
  heading_emphasis: string;
  intro_text: string;
}

export interface ProductCard {
  product_id: string;
  section_id: string;
  card_order: number;
  card_type: string; // "grade" | "use" | "myth"
  icon: string;
  badge: string;
  purity_label: string;
  title: string;
  description: string;
  list_items: string; // pipe-separated
}

export interface Faq {
  product_id: string;
  faq_order: number;
  question: string;
  answer: string;
}

/**
 * A ProductSection with its spec rows attached (joined on section_id).
 */
export interface ProductSectionWithSpecs extends ProductSection {
  specs: SpecRow[];
}

/**
 * A CardSection with its cards attached (joined on section_id).
 */
export interface CardSectionWithCards extends CardSection {
  cards: ProductCard[];
}

/**
 * Discriminated union of everything that can appear in the body of a
 * product page, in display order (by section_order). Render code can
 * switch on `kind`.
 */
export type ProductPageBlock =
  | { kind: 'text'; section: ProductSectionWithSpecs }
  | { kind: 'cards'; section: CardSectionWithCards };

/**
 * Fully assembled data for one product page.
 */
export interface FullProduct {
  product: Product;
  blocks: ProductPageBlock[];
  faqs: Faq[];
}
