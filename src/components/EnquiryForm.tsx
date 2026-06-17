'use client';

import { useState, type FormEvent } from 'react';

export interface EnquiryFormProduct {
  slug: string;
  name: string;
}

interface EnquiryFormProps {
  /** "compact" = homepage mini form, "full" = dedicated contact page form */
  variant: 'compact' | 'full';
  products: EnquiryFormProduct[];
  /** Pre-fill from ?product=<slug> */
  defaultProduct?: string;
  /** Pre-fill from ?type=<enquiry_type> (full variant only) */
  defaultType?: string;
}

const ENQUIRY_TYPES = [
  { value: 'sample', label: 'Free Sample Request' },
  { value: 'bulk-quote', label: 'Bulk Pricing / Quote' },
  { value: 'coa', label: 'Certificate of Analysis' },
  { value: 'custom-spec', label: 'Custom Specification' },
  { value: 'general', label: 'General Information' },
];

type SubmitState = 'idle' | 'sending' | 'success' | 'error';

export default function EnquiryForm({ variant, products, defaultProduct, defaultType }: EnquiryFormProps) {
  const [status, setStatus] = useState<SubmitState>('idle');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      first_name: formData.get('first_name'),
      last_name: formData.get('last_name'),
      company: formData.get('company'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      country: formData.get('country') ?? '',
      product: formData.get('product'),
      enquiry_type: formData.get('enquiry_type') ?? '',
      message: formData.get('message'),
      source: variant === 'full' ? 'contact-page' : 'homepage',
    };

    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Request failed');
      setStatus('success');
      form.reset();
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success' && variant === 'full') {
    return (
      <div className="success-msg shown" role="alert">
        ✓ Thank you for your enquiry! We&apos;ve received your message and will respond within 24
        hours. A copy has been recorded for our team.
      </div>
    );
  }

  const formClass = variant === 'full' ? 'contact-form' : 'contact-form reveal';

  return (
    <form className={formClass} onSubmit={handleSubmit} aria-label="Product enquiry form" noValidate>
      <div className="f-grid-2">
        <div className="f-group">
          <label className="f-label" htmlFor={`${variant}-fname`}>
            First Name {variant === 'full' && '*'}
          </label>
          <input
            id={`${variant}-fname`}
            name="first_name"
            type="text"
            className="f-input"
            placeholder="Your first name"
            required
            autoComplete="given-name"
          />
        </div>
        <div className="f-group">
          <label className="f-label" htmlFor={`${variant}-lname`}>
            Last Name {variant === 'full' && '*'}
          </label>
          <input
            id={`${variant}-lname`}
            name="last_name"
            type="text"
            className="f-input"
            placeholder="Your last name"
            required
            autoComplete="family-name"
          />
        </div>
      </div>

      <div className="f-group">
        <label className="f-label" htmlFor={`${variant}-company`}>
          Company / Organisation
        </label>
        <input
          id={`${variant}-company`}
          name="company"
          type="text"
          className="f-input"
          placeholder={variant === 'full' ? 'Acme Naturals Ltd.' : 'Your company'}
          autoComplete="organization"
        />
      </div>

      <div className="f-group">
        <label className="f-label" htmlFor={`${variant}-email`}>
          {variant === 'full' ? 'Business Email *' : 'Email Address *'}
        </label>
        <input
          id={`${variant}-email`}
          name="email"
          type="email"
          className="f-input"
          placeholder={variant === 'full' ? 'you@yourcompany.com' : 'you@company.com'}
          required
          autoComplete="email"
        />
      </div>

      <div className="f-group">
        <label className="f-label" htmlFor={`${variant}-phone`}>
          {variant === 'full' ? 'Phone / WhatsApp *' : 'Phone / WhatsApp *'}
        </label>
        <input
          id={`${variant}-phone`}
          name="phone"
          type="tel"
          className="f-input"
          placeholder="+1 555 000 0000"
          required
          autoComplete="tel"
        />
      </div>

      {variant === 'full' && (
        <div className="f-group">
          <label className="f-label" htmlFor="contact-country">
            Country
          </label>
          <input
            id="contact-country"
            name="country"
            type="text"
            className="f-input"
            placeholder="Your country"
            autoComplete="country-name"
          />
        </div>
      )}

      <div className="f-group">
        <label className="f-label" htmlFor={`${variant}-product`}>
          Product of Interest {variant === 'full' && '*'}
        </label>
        <select
          id={`${variant}-product`}
          name="product"
          className="f-select f-input"
          required={variant === 'full'}
          defaultValue={defaultProduct ?? ''}
        >
          <option value="" disabled>
            Select a product
          </option>
          {products.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.name}
            </option>
          ))}
          {variant === 'full' ? (
            <>
              <option value="multiple">Multiple Products</option>
              <option value="general">General Enquiry</option>
            </>
          ) : (
            <option value="both">Multiple / General Enquiry</option>
          )}
        </select>
      </div>

      {variant === 'full' && (
        <div className="f-group">
          <label className="f-label" htmlFor="contact-enquiry-type">
            Enquiry Type
          </label>
          <select
            id="contact-enquiry-type"
            name="enquiry_type"
            className="f-select f-input"
            defaultValue={defaultType ?? ''}
          >
            <option value="" disabled>
              What are you looking for?
            </option>
            {ENQUIRY_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="f-group">
        <label className="f-label" htmlFor={`${variant}-message`}>
          {variant === 'full' ? 'Message / Requirements' : 'Message'}
        </label>
        <textarea
          id={`${variant}-message`}
          name="message"
          className="f-textarea f-input"
          placeholder={
            variant === 'full'
              ? 'Please describe your requirements — quantity needed, grade specifications, intended use, target market, certifications required…'
              : 'Quantity, grade, intended use, target market…'
          }
        />
      </div>

      {variant === 'full' ? (
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            type="submit"
            className="btn-primary"
            style={{ padding: '.9rem 2.4rem' }}
            disabled={status === 'sending'}
          >
            {status === 'sending' ? 'Sending…' : 'Send Enquiry'}
          </button>
          <p style={{ fontSize: '.75rem', color: 'var(--text-muted)' }}>
            We reply within 24 business hours.
          </p>
        </div>
      ) : (
        <>
          <button type="submit" className="f-submit" disabled={status === 'sending'}>
            {status === 'sending'
              ? 'Sending…'
              : status === 'success'
                ? 'Enquiry Sent ✓'
                : 'Send Enquiry'}
          </button>
          {status === 'success' && (
            <p style={{ fontSize: '.8rem', marginTop: '.5rem', color: 'var(--gold)' }}>
              Thank you! We&apos;ll be in touch within 24 hours.
            </p>
          )}
        </>
      )}

      {status === 'error' && (
        <p style={{ fontSize: '.8rem', marginTop: '.5rem', color: '#e07a5f' }}>
          Something went wrong sending your enquiry. Please try again, or email us directly.
        </p>
      )}
    </form>
  );
}
