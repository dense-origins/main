import type { CardSectionWithCards, ProductCard } from '@/lib/types';
import { splitPipeList } from '@/lib/cms';

const GRID_CLASS: Record<string, string> = {
  grades: 'grades-grid',
  varieties: 'grades-grid',
  uses: 'uses-grid',
  myths: 'myths-grid',
};

export default function CardGridSection({ section }: { section: CardSectionWithCards }) {
  if (section.cards.length === 0) return null;

  const sectionClass = `prod-section${section.background === 'alt' ? ' bg-alt' : ''}`;
  const gridClass = GRID_CLASS[section.section_key] ?? 'grades-grid';
  const headingId = `${section.section_id}-heading`;

  return (
    <section className={sectionClass} aria-labelledby={headingId}>
      <div className="prod-section-inner">
        <div className="reveal" style={{ marginBottom: '3rem', maxWidth: 680, margin: '0 auto 3rem' }}>
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
          {section.intro_text && <p className="s-subtitle">{section.intro_text}</p>}
        </div>

        <div className={`${gridClass} reveal-grid`}>
          {section.cards.map((card) => (
            <ProductCardItem key={`${card.section_id}-${card.card_order}`} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCardItem({ card }: { card: ProductCard }) {
  if (card.card_type === 'use') {
    return (
      <div className="use-card reveal">
        {card.icon && (
          <div className="use-icon" aria-hidden="true">
            {card.icon}
          </div>
        )}
        <h3 className="use-title">{card.title}</h3>
        <p className="use-desc">{card.description}</p>
      </div>
    );
  }

  if (card.card_type === 'myth') {
    return (
      <div className="myth-card reveal">
        <div className="myth-label">Myth</div>
        <p className="myth-text">{card.title}</p>
        <div className="fact-label">Fact</div>
        <p className="fact-text">{card.description}</p>
      </div>
    );
  }

  // "grade" (and "variety") cards
  const listItems = splitPipeList(card.list_items);
  const featured = Boolean(card.badge);

  return (
    <div className={`grade-card reveal${featured ? ' grade-card--featured' : ''}`}>
      {card.badge && <div className="grade-badge">{card.badge}</div>}
      {card.purity_label && <div className="grade-purity">{card.purity_label}</div>}
      <h3 className="grade-name">{card.title}</h3>
      {card.description && <p className="grade-desc">{card.description}</p>}
      {listItems.length > 0 && (
        <ul className="grade-uses">
          {listItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
