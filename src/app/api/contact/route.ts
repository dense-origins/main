import { NextRequest, NextResponse } from 'next/server';
import { appendLeadRow } from '@/lib/sheets';

interface ContactPayload {
  first_name?: string;
  last_name?: string;
  company?: string;
  email?: string;
  phone?: string;
  country?: string;
  product?: string;
  enquiry_type?: string;
  message?: string;
  source?: string;
}

/**
 * Receives enquiries from EnquiryForm (homepage "compact" form and the
 * full /contact form).
 *
 * Current behaviour:
 *   1. Validates the minimum required fields.
 *   2. If LEADS_SHEET_ID is set, appends a row to that sheet (see
 *      appendLeadRow in lib/sheets.ts for the column order). The same
 *      service account used for reading the CMS sheets needs Editor
 *      access on this one — share it separately, don't reuse the
 *      read-only CMS folder share.
 *   3. Always logs the enquiry server-side, so nothing is lost even
 *      before the leads sheet is wired up.
 *   4. Returns { ok: true } on success.
 *
 * To wire up email notifications later (e.g. via Resend), add that call
 * alongside appendLeadRow below — both can run from this same handler.
 */
export async function POST(req: NextRequest) {
  let body: ContactPayload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON body' }, { status: 400 });
  }

  const { first_name, last_name, email, phone, product } = body;
  if (!first_name || !last_name || !email || !phone || !product) {
    return NextResponse.json(
      { ok: false, error: 'first_name, last_name, email, phone and product are required' },
      { status: 400 }
    );
  }

  const timestamp = new Date().toISOString();

  // Always log — visible in Vercel function logs even before the leads
  // sheet is configured.
  console.log('[contact] enquiry received', { timestamp, ...body });

  try {
    await appendLeadRow([
      timestamp,
      body.source ?? '',
      first_name,
      last_name,
      body.company ?? '',
      email,
      body.phone ?? '',
      body.country ?? '',
      product,
      body.enquiry_type ?? '',
      body.message ?? '',
    ]);
  } catch (err) {
    // Don't fail the request just because the leads sheet isn't set up
    // (or isn't shared with edit access) yet — the enquiry is still
    // logged above. Surface the problem in server logs for diagnosis.
    console.error('[contact] failed to append lead row', err);
  }

  return NextResponse.json({ ok: true });
}
