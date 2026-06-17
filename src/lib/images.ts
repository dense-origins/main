/**
 * Hero/icon/shop-card image fields in the CMS were authored for the old
 * static site, so they're either:
 *   - a relative path like "../multanimittit.png" or "multanimittit.png"
 *     (image lives in /public/images), or
 *   - a literal emoji used as a placeholder icon (e.g. "🍇" for Raisins).
 *
 * resolveProductImage() tells you which, so components can render an
 * <Image> or a plain emoji span accordingly.
 */

const IMAGE_EXT = /\.(png|jpe?g|webp|svg|gif)$/i;

export interface ResolvedImage {
  type: 'image' | 'emoji';
  value: string; // image: "/images/foo.png" path; emoji: the literal character(s)
}

export function resolveProductImage(raw: string): ResolvedImage | null {
  const value = (raw ?? '').trim();
  if (!value) return null;

  if (IMAGE_EXT.test(value)) {
    const filename = value.split('/').pop() as string;
    return { type: 'image', value: `/images/${filename}` };
  }

  return { type: 'emoji', value };
}
