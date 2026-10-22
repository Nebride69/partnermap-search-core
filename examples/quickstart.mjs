import { rankNames, parsePartnerIntent } from '../dist/index.js';
const publishedAndAuthorizedBrands = [
  { name: 'Fortinet' },
  { name: 'Palo Alto Networks' },
  { name: 'Cisco' },
];
const input = 'PaloAlto Türkiye partnerleri';
const intent = parsePartnerIntent(input);
console.log({ intent, results: rankNames(intent.lookupQuery, publishedAndAuthorizedBrands, x => x.name) });
