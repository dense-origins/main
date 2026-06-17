import type { Faq } from '@/lib/types';
import FaqAccordion from './FaqAccordion';

export default function FaqSection({ faqs }: { faqs: Faq[] }) {
  if (faqs.length === 0) return null;

  const items = faqs
    .slice()
    .sort((a, b) => a.faq_order - b.faq_order)
    .map((f) => ({ question: f.question, answer: f.answer }));

  return (
    <section className="prod-section" aria-labelledby="faq-heading">
      <div className="prod-section-inner" style={{ maxWidth: 860, margin: '0 auto' }}>
        <div className="reveal" style={{ marginBottom: '3rem' }}>
          <p className="s-eye">Product FAQ</p>
          <h2 id="faq-heading" className="s-title">
            Common <em>Questions</em>
          </h2>
        </div>
        <FaqAccordion items={items} />
      </div>
    </section>
  );
}
