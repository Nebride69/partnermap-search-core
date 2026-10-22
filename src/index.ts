/**
 * Turkish-aware, framework-neutral entity-search utilities.
 *
 * Extracted and generalized from PartnerMap's original search helpers.
 * Operates only on candidate names supplied by the caller: this package
 * does not query databases, grant access, or expose unpublished records.
 */

export type NameRescueEvidence = Readonly<{ score: number; exact: boolean }>;

/** Hard bounds protect server applications from unexpectedly expensive inputs. */
const MAX_NAME_CHARS = 160;
const MAX_QUERY_CHARS = 128;
const MAX_CANDIDATES = 500;

/**
 * Reduce names to stable, Turkish-friendly Unicode search keys.
 * Examples: "Palo Alto" -> "paloalto", "İŞ ÇÖZÜMLERİ" -> "iscozumleri".
 * This is for tolerant comparison, NOT for unique identity or security checks.
 */
export function compactSearchName(value: string): string {
  return value
    .toLocaleLowerCase('tr-TR')
    .replace(/ı/g, 'i')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, '');
}

/**
 * Bounded Levenshtein distance, with a maximum allowed edit threshold.
 * Returns maxEdits+1 for strings that cannot match within the threshold.
 * Uses Unicode code points and stops early on rows that cannot succeed.
 */
function distanceAtMost(a: string, b: string, maxEdits: number): number {
  const left = Array.from(a);
  const right = Array.from(b);
  if (Math.abs(left.length - right.length) > maxEdits) return maxEdits + 1;
  if (!left.length) return right.length;
  if (!right.length) return left.length;

  let previous = Array.from({ length: right.length + 1 }, (_, i) => i);
  for (let i = 1; i <= left.length; i += 1) {
    const current = new Array<number>(right.length + 1);
    current[0] = i;
    let rowMin = i;
    for (let j = 1; j <= right.length; j += 1) {
      current[j] = Math.min(
        previous[j] + 1,
        current[j - 1] + 1,
        previous[j - 1] + (left[i - 1] === right[j - 1] ? 0 : 1),
      );
      rowMin = Math.min(rowMin, current[j]);
    }
    if (rowMin > maxEdits) return maxEdits + 1;
    previous = current;
  }
  return previous[right.length];
}

/**
 * Score a query against a known, already-authorized candidate name.
 * Scores are relative ranking hints, not calibrated probabilities.
 * Avoids corrections for very short queries and rejects expensive inputs.
 */
export function findNameRescueEvidence(
  candidateName: string,
  rawQuery: string,
): NameRescueEvidence | null {
  if (Array.from(candidateName).length > MAX_NAME_CHARS ||
      Array.from(rawQuery).length > MAX_QUERY_CHARS) return null;

  const name = compactSearchName(candidateName);
  const query = compactSearchName(rawQuery);
  if (Array.from(query).length < 4 || !name) return null;

  if (name === query) return { score: 1.24, exact: true };
  if (query.length >= 5 && name.startsWith(query)) {
    return { score: 1.13, exact: false };
  }

  const maxEdits = query.length >= 8 ? 2 : 1;
  const minLength = Math.max(1, query.length - maxEdits);
  const maxLength = Math.min(name.length, query.length + maxEdits);
  let best = maxEdits + 1;
  for (let size = minLength; size <= maxLength; size += 1) {
    const distance = distanceAtMost(query, name.slice(0, size), maxEdits);
    best = Math.min(best, distance);
    if (best === 0) break;
  }
  if (best === 0) return { score: 1.13, exact: false };
  if (best > maxEdits) return null;
  return { score: best === 1 ? 1.06 : 0.99, exact: false };
}

const PARTNER_INTENT =
  /\s+(?:türkiye\s+)?(?:partnerleri|partnerları|bayileri|çözüm ortakları|iş ortakları|satıcıları|reseller(?:ları)?)\s*[?!.,]*\s*$/iu;

/** Parses queries such as "Fortinet Türkiye partnerleri" or "Cisco bayileri?". */
export function parsePartnerIntent(input: string): Readonly<{
  rawQuery: string;
  lookupQuery: string;
  partnerIntent: boolean;
}> {
  const rawQuery = input.trim().replace(/\s+/g, ' ');
  const partnerIntent = PARTNER_INTENT.test(rawQuery);
  const lookupQuery = partnerIntent ? rawQuery.replace(PARTNER_INTENT, '').trim() : rawQuery;
  return { rawQuery, lookupQuery: lookupQuery || rawQuery, partnerIntent };
}

/** Turkish-friendly SEO URL segment, NOT a security identifier. */
export function slugifyTr(value: string): string {
  return value
    .trim()
    .toLocaleLowerCase('tr-TR')
    .replaceAll('ı', 'i')
    .replaceAll('ğ', 'g')
    .replaceAll('ü', 'u')
    .replaceAll('ş', 's')
    .replaceAll('ö', 'o')
    .replaceAll('ç', 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Sort only the candidates passed by your application after its own access checks.
 * Match limits are enforced independently of maxCandidates.
 * The caller must decide how ambiguous matches should be displayed.
 */
export function rankNames<T>(
  query: string,
  candidates: readonly T[],
  getName: (item: T) => string,
  maxCandidates = 100,
): Array<{ item: T; evidence: NameRescueEvidence }> {
  const take = Number.isFinite(maxCandidates)
    ? Math.max(0, Math.min(MAX_CANDIDATES, Math.trunc(maxCandidates))) : 0;
  const results: Array<{ item: T; evidence: NameRescueEvidence }> = [];
  for (const item of candidates.slice(0, take)) {
    const evidence = findNameRescueEvidence(getName(item), query);
    if (evidence) results.push({ item, evidence });
  }
  return results.sort((a, b) =>
    b.evidence.score - a.evidence.score ||
    getName(a.item).localeCompare(getName(b.item), 'tr-TR'));
}
