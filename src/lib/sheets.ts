import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const WRITE_SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

/**
 * Each "tab" of the CMS is currently its own Google Sheet (Drive's
 * create_file tool can't add tabs to an existing spreadsheet). All seven
 * files live in one Drive folder — share that folder with the service
 * account email below and every ID here will be readable.
 *
 * Folder: https://drive.google.com/drive/folders/1sGXsklmWQXFDPQOqL9Depo6ilVqwUlRi
 *
 * IDs are seeded with the sheets created for Dense Origins. Override via
 * env vars if you move/recreate any of them.
 */
export const SHEET_IDS = {
  products: process.env.SHEET_ID_PRODUCTS ?? '1t3kvnfz39hCOBcu4t7R_Y7GE4MCiFTW8ZejHYfji634',
  sections: process.env.SHEET_ID_SECTIONS ?? '1LXH53UwO0-nnTS_yhh-DMfgKCIrznKTwf17Ac3p5EWM',
  specs: process.env.SHEET_ID_SPECS ?? '1c7cEzVDF7Aqg1yNpYZURaSwy5DqmyV5RzAtNDjuDhMI',
  cardSections: process.env.SHEET_ID_CARD_SECTIONS ?? '1fyLFI7Ap9yQf5sSM8iGk_eqCNcQbUUj90u3CJLAAgFo',
  cards: process.env.SHEET_ID_CARDS ?? '1zR19vbSamxoiyNCfsIy9_Jz4adjJ-iSfMRj5Ukw_OYU',
  faqs: process.env.SHEET_ID_FAQS ?? '1T81s0cf8BAU6FQXF9t-OOwlJP4rTXWfGlOtok9X1-rw',
} as const;

let _sheetsClient: ReturnType<typeof google.sheets> | null = null;
let _sheetsWriteClient: ReturnType<typeof google.sheets> | null = null;

function buildAuth(scopes: string[]) {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GOOGLE_PRIVATE_KEY;

  if (!email || !rawKey) {
    throw new Error(
      'Missing GOOGLE_SERVICE_ACCOUNT_EMAIL / GOOGLE_PRIVATE_KEY env vars. ' +
        'See README_SETUP.md for how to create and share a service account.'
    );
  }

  // Vercel env vars store the key with literal "\n" sequences — convert
  // them back to real newlines for the PEM to parse correctly.
  const privateKey = rawKey.replace(/\\n/g, '\n');

  return new google.auth.JWT({ email, key: privateKey, scopes });
}

function getSheetsClient() {
  if (_sheetsClient) return _sheetsClient;
  _sheetsClient = google.sheets({ version: 'v4', auth: buildAuth(SCOPES) });
  return _sheetsClient;
}

/**
 * A read+write client, used only by the lead-capture endpoint
 * (/api/contact) to append rows. Same service account as the read client
 * — what it can actually write to depends on what's been shared with it
 * as Editor (see README_SETUP.md).
 */
function getSheetsWriteClient() {
  if (_sheetsWriteClient) return _sheetsWriteClient;
  _sheetsWriteClient = google.sheets({ version: 'v4', auth: buildAuth(WRITE_SCOPES) });
  return _sheetsWriteClient;
}


/**
 * Reads a sheet's first tab as rows of objects, using row 1 as headers.
 * Empty trailing cells in a row are filled with '' so every object has
 * every header key.
 */
export async function getSheetRows(spreadsheetId: string): Promise<Record<string, string>[]> {
  const sheets = getSheetsClient();

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    // A1:ZZ covers any reasonable column count for this CMS without
    // needing to know the exact sheet name (Drive-converted CSVs are
    // named "Sheet1" by default, but range without a sheet name applies
    // to the first/active sheet).
    range: 'A1:ZZ10000',
  });

  const rows = res.data.values ?? [];
  if (rows.length === 0) return [];

  const [header, ...data] = rows as string[][];

  return data
    .filter((row) => row.some((cell) => cell !== undefined && cell !== ''))
    .map((row) => {
      const obj: Record<string, string> = {};
      header.forEach((key, i) => {
        obj[key] = row[i] ?? '';
      });
      return obj;
    });
}

/**
 * Appends one row to the leads sheet, if LEADS_SHEET_ID is configured.
 * Returns false (without throwing) if it isn't — callers should treat a
 * missing leads sheet as "not configured yet" rather than an error, so
 * the contact form still works (e.g. logs only) before that's set up.
 *
 * The sheet's first row should be the header — values are appended in the
 * order given here:
 *   timestamp, source, first_name, last_name, company, email, phone,
 *   country, product, enquiry_type, message
 */
export async function appendLeadRow(values: string[]): Promise<boolean> {
  const spreadsheetId = process.env.LEADS_SHEET_ID;
  if (!spreadsheetId) return false;

  const sheets = getSheetsWriteClient();
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: 'A1',
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    requestBody: { values: [values] },
  });
  return true;
}
