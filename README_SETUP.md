# Dense Origins — Website Setup

This is the Next.js app that reads product content from the
**"Dense Origins - Product CMS"** Google Drive folder (the 7 sheets we built:
00-README, 01-products … 06-product_faqs) and renders `/shop` and
`/products/[slug]` from them.

## 0. One-time cleanup in the CMS folder

While building this, two data gaps were found and fixed (raisins was missing
20 spec rows and 3 table captions; psyllium's nutrition section was missing
its intro sentence). The corrected sheets were uploaded as new files, so the
[CMS folder](https://drive.google.com/drive/folders/1sGXsklmWQXFDPQOqL9Depo6ilVqwUlRi)
currently has **two** files each named `02-product_sections` and
`03-product_specs`. Delete the older ones (created first) — the IDs this app
points at by default are:

- `02-product_sections` → `1LXH53UwO0-nnTS_yhh-DMfgKCIrznKTwf17Ac3p5EWM`
- `03-product_specs` → `1c7cEzVDF7Aqg1yNpYZURaSwy5DqmyV5RzAtNDjuDhMI`

Keep those two, delete the other two files with the same names.

## 1. Create a Google Service Account (read-only access to the sheets)

The app reads the sheets via the Google Sheets API using a **service
account** — a robot identity that you share the Drive folder with, the same
way you'd share it with a person's email address.

1. Go to [console.cloud.google.com](https://console.cloud.google.com) and
   create a new project (or use an existing one) — e.g. "Dense Origins Web".
2. **Enable the API**: APIs & Services → Library → search "Google Sheets API"
   → Enable.
3. **Create the service account**: APIs & Services → Credentials → Create
   Credentials → Service Account. Give it any name (e.g.
   `dense-origins-cms-reader`). No special roles needed.
4. Open the new service account → **Keys** tab → Add Key → Create new key →
   **JSON**. This downloads a `.json` file — keep it safe, don't commit it
   anywhere.
5. Open the JSON file. You need two values from it:
   - `client_email` → this is your `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `private_key` → this is your `GOOGLE_PRIVATE_KEY` (keep the `\n`
     sequences exactly as they appear)

## 2. Share the CMS folder with the service account

1. Open the
   [Dense Origins - Product CMS folder](https://drive.google.com/drive/folders/1sGXsklmWQXFDPQOqL9Depo6ilVqwUlRi)
   in Drive.
2. Click **Share**, paste in the `client_email` from step 1 (it looks like
   `dense-origins-cms-reader@your-project.iam.gserviceaccount.com`), set
   permission to **Viewer**, and share.

Sharing the *folder* covers all 7 sheets inside it — including any new
sheets you add later (e.g. a future `media` tab).

## 3. Configure environment variables

Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

Fill in:

- `GOOGLE_SERVICE_ACCOUNT_EMAIL` — from step 1
- `GOOGLE_PRIVATE_KEY` — from step 1 (keep the quotes and `\n`s)
- `REVALIDATE_SECRET` — make up any long random string (e.g. run
  `openssl rand -hex 32`)

The `SHEET_ID_*` values are already pre-filled to match the sheets created
for this project — no changes needed unless you recreate one of them.

## 4. Run locally

```bash
npm install
npm run dev
```

Visit `http://localhost:3000/shop` and `http://localhost:3000/products/fullers-earth`.

If you see an error about missing credentials, double-check `.env.local` —
especially that `GOOGLE_PRIVATE_KEY` is wrapped in quotes with `\n` left as
literal two-character sequences (not real line breaks).

## 5. Deploy to Vercel

1. Push this repo to GitHub and import it into Vercel.
2. In the Vercel project → Settings → Environment Variables, add the same
   variables from `.env.local` (Production + Preview).
3. Deploy.

Pages are statically generated at build time for every product that's
`status = active` in `01-products`. New products you add later will still
render on first visit (and then be cached) without a redeploy, thanks to
Next's `dynamicParams`.

## 6. Manually refreshing content after editing the sheets

Because the CMS data is cached (so the site is fast and doesn't hit the
Sheets API on every request), edits to the sheets **won't appear on the live
site until you trigger a refresh**.

Trigger it by visiting (or hitting with a POST):

```
https://your-site.com/api/revalidate?secret=YOUR_REVALIDATE_SECRET
```

This clears the cache for all 6 content sheets and re-renders the shop
listing, footer, and every product page on next visit.

### Adding a button to admin.html

If you want a one-click "Publish changes" button in your admin page, add
something like:

```html
<button id="publish-btn">Publish content changes</button>
<script>
  document.getElementById('publish-btn').addEventListener('click', async () => {
    const btn = document.getElementById('publish-btn');
    btn.disabled = true;
    btn.textContent = 'Publishing…';
    try {
      const res = await fetch('https://your-site.com/api/revalidate', {
        method: 'POST',
        headers: { 'x-revalidate-secret': 'YOUR_REVALIDATE_SECRET' },
      });
      btn.textContent = res.ok ? 'Published ✓' : 'Failed — try again';
    } catch {
      btn.textContent = 'Failed — try again';
    } finally {
      setTimeout(() => { btn.disabled = false; btn.textContent = 'Publish content changes'; }, 2000);
    }
  });
</script>
```

Since `admin.html` is a static page served separately, the secret is visible
in its source — that's an acceptable tradeoff for an internal tool used by
one or two people, but don't link to this page publicly. If that's a
concern later, swap this for a tiny serverless function that holds the
secret server-side and admin.html just calls that.

## 7. Contact form lead capture (optional)

The homepage mini-form and the full `/contact` form both POST to
`/api/contact`. Right now this:

- validates required fields (first/last name, email, product),
- logs every enquiry to the server console (visible in Vercel function
  logs), and
- if `LEADS_SHEET_ID` is set, appends a row to that sheet.

To enable the sheet-based capture:

1. Create a new Google Sheet (e.g. "Dense Origins - Leads") with a header
   row: `timestamp, source, first_name, last_name, company, email, phone,
   country, product, enquiry_type, message`.
2. Share it with your service account email (the same `client_email` from
   step 1) as **Editor** — this is a *different* share than the read-only
   CMS folder, since this sheet needs write access.
3. Copy its spreadsheet ID (from the URL) into `LEADS_SHEET_ID`.

Without this, the form still works for visitors (they see a success
message) and you can read enquiries from the server logs — just not from a
sheet yet.

## How content maps to code (quick reference)

| Sheet | Used by |
|---|---|
| `01-products` | `getAllProducts()`, `getProductBySlug()` — drives `/shop` grid, footer product list, and `generateStaticParams()` for `/products/[slug]` |
| `02-product_sections` | Two-column text sections (Overview, History, Technical/Nutritional Profile, Origins) on each product page |
| `03-product_specs` | Spec tables inside the sections above (joined via `section_id`) |
| `04-product_card_sections` | Grid section headers (Available Grades, Where It's Used, Myths Debunked, Varieties) |
| `05-product_cards` | Individual cards inside those grids (joined via `section_id`) |
| `06-product_faqs` | The FAQ accordion at the bottom of each product page |

**Adding a 6th SKU**: add a row to `01-products` with the next `product_id`
(e.g. `006`) and `status = active`, plus matching rows in 02–06 using
`product_id = 006` and section IDs `006-S01`, `006-S02`, etc. Hit
`/api/revalidate`, and the new product appears in the shop grid, footer,
and gets its own `/products/<slug>` page — no code changes.
