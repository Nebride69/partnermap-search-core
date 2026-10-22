# Turkish Entity Search

![Node.js](https://img.shields.io/badge/Node.js-%E2%89%A520-339933) ![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue) ![License](https://img.shields.io/badge/License-MIT-green)

Turkish-aware normalization, conservative typo ranking, and business-partner search intent parsing for **already-authorized** entity names. Pure TypeScript, zero runtime dependencies, framework-agnostic.

## The problem

General-purpose search commonly misses Turkish-language variations: `İ/i`, `I/ı`, punctuation, spacing (`paloalto` vs. `Palo Alto`), small typos, and specific phrasing such as `Fortinet Türkiye partnerleri`. This library offers bounded, predictable helpers for search suggestions and display ranking. It does **not** connect to a database or discover private records.

Originally extracted and generalized from the search utilities maintained for [PartnerMap](https://www.partnermap.net), a Turkish technology brand/partner directory. This library is maintained separately and can be used by other projects. The **live website's record counts do not represent this library's downloads or external adoption**.

## Features

| Function | Purpose |
|---|---|
| `compactSearchName(name)` | Locale-aware lowercase, Unicode normalization, punctuation folding |
| `findNameRescueEvidence(candidate, query)` | Exact/prefix/bounded typo matching with relative scores |
| `rankNames(query, permittedCandidates, getName, limit?)` | Score up to 500 records **provided by the caller** |
| `parsePartnerIntent(query)` | Extract vendor name from Turkish reseller/partner phrases |
| `slugifyTr(name)` | Normalize Turkish names into SEO-friendly URL segments |

## Quickstart (clone this repository)

Node.js 20 or later required. `npm install` installs the **development-only** TypeScript compiler; the built package has **no runtime dependencies**.

```bash
npm install
npm test
npm run example
```

```ts
import { compactSearchName, rankNames, parsePartnerIntent } from './dist/index.js';

const query = 'Palo Alto Türkiye partnerleri';
const { lookupQuery } = parsePartnerIntent(query);
const publishedAndAuthorized = [
  { name: 'Palo Alto Networks' },
  { name: 'Cisco' },
];
const candidates = rankNames(lookupQuery, publishedAndAuthorized, x => x.name);
console.log(compactSearchName('Palo Alto')); // 'paloalto'
console.log(candidates[0]?.item.name);        // 'Palo Alto Networks'
```

**Distribution status:** Source repository only for now; this library is **not yet published to npm**. Do not run `npm install @partnermap/turkish-entity-search` until an npm release is explicitly announced. After cloning and building, the library can be imported from `dist/`.

## Safe integration

1. Query the **host application's own database**, enforcing its authorization, row-level security, and publication filters.
2. Pass only those filtered candidates to this library.
3. Return multiple matches as suggestions. Do not silently redirect to an approximate match as though it were exact.
4. Apply request-level input limits, rate limiting, and authorization separately. This library is not a substitute.

The scores (1.24, 1.13, 1.06, 0.99) are **ranking hints, not probabilities**. False positives can occur on short/common prefixes. Names longer than 160 Unicode code points and queries longer than 128 are deliberately rejected; caller-supplied candidate limit is capped at 500. Short normalized queries (<4 characters) are not fuzzy-matched.

## Example inputs

| Input | Expected behavior |
|---|---|
| `paloalto` + `Palo Alto Networks` | Prefix match |
| `fortnet` + `Fortinet` | One-edit typo match |
| `Cisco bayileri?` | Partner intent; lookup query `Cisco` |
| `İş Çözümleri` | Normalizes to `iscozumleri` |
| `EDR` | No fuzzy typo rescue (too short) |

## Development and maintenance

```bash
npm install
npm run build
npm test
npm run example
npm run verify
```

GitHub Actions CI checks TypeScript build, tests and a simple file/credential hygiene gate on pull requests. **The hygiene gate is not a replacement for GitHub secret scanning or a full security review.** See [CONTRIBUTING.md](CONTRIBUTING.md), [SECURITY.md](SECURITY.md), [CHANGELOG.md](CHANGELOG.md), and [docs/ROADMAP.md](docs/ROADMAP.md).

We welcome reproducible Turkish-language edge cases, regression tests, accessibility improvements and realistic performance benchmarks with synthetic data.

## License / origin

MIT, see [LICENSE](LICENSE). Source implementation was adapted from the PartnerMap maintainers' own helper code and generalized for independent use. This repository does **not** include PartnerMap's application/backend, customer records, Supabase migrations, credentials, admin routes or proprietary enrichment datasets. PartnerMap remains a separate private application.
