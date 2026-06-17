import FaqAccordion from '@/components/FaqAccordion';

const FAQS = [
  {
    question: 'What products does Dense Origins export?',
    answer:
      "Dense Origins currently exports five premium natural ingredients: Psyllium Husk, Fuller's Earth, Premium Cashews, Premium Almonds, and Natural Raisins. Our catalogue is expanding — contact us for custom sourcing requests.",
  },
  {
    question: 'What is Psyllium Husk and where is it used?',
    answer:
      "Psyllium Husk is the outer seed coating of Plantago ovata, cultivated extensively in India's Gujarat and Rajasthan belts. It is one of the richest natural sources of soluble dietary fibre, used widely in functional foods, dietary supplements, pharmaceutical laxatives, and nutraceutical formulations. It is naturally gluten-free, and Dense Origins offers both standard and certified organic variants.",
  },
  {
    question: "What is Fuller's Earth and what is it used for?",
    answer:
      "Fuller's Earth is a naturally occurring clay mineral (primarily calcium montmorillonite) with exceptional absorbent and adsorption properties. It is used in cosmetics and skincare (face masks, dry shampoo), pharmaceuticals, agriculture (pesticide carrier), and industrial applications (oil refining, bleaching). Dense Origins supplies cosmetic-grade and industrial-grade variants with full lab certification.",
  },
  {
    question: 'What certifications and documents do you provide?',
    answer:
      'We provide a Certificate of Analysis (CoA) from accredited third-party laboratories, Material Safety Data Sheets (MSDS), phytosanitary certificates for botanical products, and can arrange Halal and Kosher certification on request. All documentation is export-ready for global markets.',
  },
  {
    question: 'Where does Dense Origins export to?',
    answer:
      'Dense Origins exports globally, with established supply to buyers in the European Union, Middle East, North America, and Southeast Asia. We manage all export documentation, logistics, and regulatory compliance to make cross-border procurement seamless.',
  },
  {
    question: 'What is the minimum order quantity (MOQ)?',
    answer:
      'Dense Origins offers flexible minimum order quantities. We work with startup formulators as well as large-scale manufacturers. Please contact us to discuss your volume, grade, and pack specification requirements.',
  },
];

export default function HomeFaqSection() {
  return (
    <section id="faq" aria-labelledby="faq-heading">
      <div className="faq-inner">
        <div className="faq-header reveal">
          <p className="s-eye">Common Questions</p>
          <h2 id="faq-heading" className="s-title">
            Frequently <em>asked</em>
          </h2>
        </div>
        <FaqAccordion items={FAQS} />
      </div>
    </section>
  );
}
