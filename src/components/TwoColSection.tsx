import type { ProductSectionWithSpecs } from '@/lib/types';
import { splitParagraphs } from '@/lib/cms';
import SpecTable from './SpecTable';

/**
 * Renders one "two-column" content section (Overview, History & Heritage,
 * Technical/Nutritional Profile, Origins, ...).
 *
 * Layout convention (chosen for consistency across all 5 products — the
 * original static pages varied this slightly section-to-section):
 *   Left column:  eyebrow, heading, full body_text paragraphs.
 *   Right column: callout(s), then the spec table + table note, then an
 *                  optional image. Whatever is non-empty renders; if the
 *                  right column ends up empty the section falls back to a
 *                  single centred column.
 */
export default function TwoColSection({ section }: { section: ProductSectionWithSpecs }) {
  const paragraphs = splitParagraphs(section.body_text);
  const hasCallout1 = Boolean(section.callout1_label || section.callout1_text);
  const hasCallout2 = Boolean(section.callout2_label || section.callout2_text);
  const hasSpecs = section.specs.length > 0;
  const hasImage = Boolean(section.image_url);

  const rightHasContent = hasCallout1 || hasCallout2 || hasSpecs || hasImage;

  const sectionClass = `prod-section${section.background === 'alt' ? ' bg-alt' : ''}`;
  const headingId = `${section.section_id}-heading`;

  const left = (
    <div className="reveal">
      {section.eyebrow && <p className="s-eye">{section.eyebrow}</p>}
      <h2 id={headingId} className="s-title">
        {section.heading_emphasis ? (
          <>
            {section.heading_line1}
            <br />
            <em>{section.heading_emphasis}</em>
          </>
        ) : (
          section.heading_line1
        )}
      </h2>
      {paragraphs.length > 0 && (
        <div className="prod-body">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      )}
    </div>
  );

  const right = rightHasContent ? (
    <div className="reveal">
      {hasCallout1 && (
        <div className="info-callout">
          {section.callout1_label && <p className="info-callout-label">{section.callout1_label}</p>}
          {section.callout1_text && <p className="info-callout-text">{section.callout1_text}</p>}
        </div>
      )}
      {hasCallout2 && (
        <div className="info-callout" style={{ marginTop: hasCallout1 ? '1.5rem' : undefined }}>
          {section.callout2_label && <p className="info-callout-label">{section.callout2_label}</p>}
          {section.callout2_text && <p className="info-callout-text">{section.callout2_text}</p>}
        </div>
      )}
      {hasSpecs && (
        <div style={{ marginTop: hasCallout1 || hasCallout2 ? '1.5rem' : undefined }}>
          <SpecTable rows={section.specs} ariaLabel={`${section.heading_line1} specifications`} />
          {section.table_note && (
            <p style={{ fontSize: '.72rem', color: 'var(--text-muted)', marginTop: '.75rem' }}>
              {section.table_note}
            </p>
          )}
        </div>
      )}
    </div>
  ) : null;

  return (
    <section className={sectionClass} aria-labelledby={headingId}>
      <div className={`prod-section-inner${rightHasContent ? ' two-col' : ''}`}>
        {left}
        {right}
      </div>
    </section>
  );
}
