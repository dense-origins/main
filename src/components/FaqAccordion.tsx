export interface FaqItem {
  question: string;
  answer: string;
}

/**
 * Plain <details>/<summary> accordion list — just the items, no heading.
 * Used by both the product-page FAQ section and the homepage FAQ section,
 * which each supply their own eyebrow/heading.
 */
export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  if (items.length === 0) return null;

  return (
    <div className="reveal">
      {items.map((item, i) => (
        <details className="faq-item" key={i}>
          <summary className="faq-q">{item.question}</summary>
          <p className="faq-a">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
