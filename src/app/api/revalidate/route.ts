import { revalidateTag, revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Manual "refresh content" trigger for the Sheets-backed CMS.
 *
 * Hitting this clears the cached reads of all 6 CMS sheets
 * (tag: "cms-content") and re-renders the shop listing + footer (which
 * lists products on every page). Individual product pages are tagged
 * with the same "cms-content" tag, so revalidateTag also marks them
 * stale — the next visit to /products/<slug> regenerates from fresh
 * sheet data.
 *
 * Usage:
 *   POST /api/revalidate
 *   Header: x-revalidate-secret: <REVALIDATE_SECRET>
 *
 * or, for a simple bookmarkable link (e.g. a button on admin.html):
 *   GET /api/revalidate?secret=<REVALIDATE_SECRET>
 *
 * Set REVALIDATE_SECRET in your environment — pick any long random string.
 */
function isAuthorized(req: NextRequest): boolean {
  const expected = process.env.REVALIDATE_SECRET;
  if (!expected) return false;

  const headerSecret = req.headers.get('x-revalidate-secret');
  const querySecret = req.nextUrl.searchParams.get('secret');

  return headerSecret === expected || querySecret === expected;
}

function doRevalidate() {
  revalidateTag('cms-content');
  revalidatePath('/shop');
  revalidatePath('/', 'layout'); // re-render shared layout (footer product list)
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ revalidated: false, message: 'Invalid or missing secret' }, { status: 401 });
  }

  doRevalidate();
  return NextResponse.json({ revalidated: true, now: Date.now() });
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ revalidated: false, message: 'Invalid or missing secret' }, { status: 401 });
  }

  doRevalidate();
  return NextResponse.json({ revalidated: true, now: Date.now() });
}
