# Examples and recipes

These examples use **synthetic or public example names**. They do not use private PartnerMap datasets. First run `npm install` and `npm run build` in the repository. Source-only distribution: no npm package is published yet.

## 1. Turkish normalization

```js
import { compactSearchName } from '../dist/index.js';

console.log(compactSearchName('İŞ ÇÖZÜMLERİ')); // 'iscozumleri'
console.log(compactSearchName('Palo Alto'));    // 'paloalto'
console.log(compactSearchName('IĞDIR'));        // 'igdir'
```

This returns a comparison key, **not a unique identifier**.

## 2. Bounded typo suggestions

```js
import { findNameRescueEvidence } from '../dist/index.js';

console.log(findNameRescueEvidence('Fortinet', 'fortnet'));
// { score: 1.06, exact: false }

console.log(findNameRescueEvidence('Fortinet', 'for'));
// null — query is too short for typo rescue
```

Scores are deterministic ranking hints. They are not confidence percentages.

## 3. Partner-language intent

```js
import { parsePartnerIntent } from '../dist/index.js';

const intent = parsePartnerIntent('Cisco bayileri?');
console.log(intent.lookupQuery);    // 'Cisco'
console.log(intent.partnerIntent);  // true
```

Intent extraction does not retrieve vendor partners. Your application must obtain **authorized** data first.

## 4. Rank only authorized candidate names

```js
import { rankNames } from '../dist/index.js';

// Your own application decides what may be searched or displayed.
const permitted = [
  { name: 'Fortinet', public: true },
  { name: 'Fortinet Alpha', public: true },
];

const hits = rankNames('fortinet', permitted, item => item.name);
console.log(hits.map(hit => hit.item.name));
// ['Fortinet', 'Fortinet Alpha']
```

Apply permissions, publication checks, pagination and rate limits **before** calling these utilities. For ambiguous or typo-corrected queries, show suggestions rather than silently assuming user intent.

## Production demonstration

The PartnerMap application uses a **pinned source copy** of the public `v0.1.0` library. You can inspect live read-only requests:

- [`paloalto` vendor search](https://www.partnermap.net/api/search?q=paloalto&type=vendor&page=1)
- [`fortniet` vendor search](https://www.partnermap.net/api/search?q=fortniet&type=vendor&page=1)

These are examples of first-party use, **not external package downloads or independent user adoption**.

[← Return to README](../README.md) · [Türkçe](../README.tr.md) · [Contributing](../CONTRIBUTING.md)
