import test from 'node:test';
import assert from 'node:assert/strict';
import {
  compactSearchName, findNameRescueEvidence,
  parsePartnerIntent, slugifyTr, rankNames,
} from '../dist/index.js';

test('Turkish Unicode casing, symbols and diacritics', () => {
  assert.equal(compactSearchName('İŞ ÇÖZÜMLERİ A.Ş.'), 'iscozumlerias');
  assert.equal(compactSearchName('Palo Alto'), 'paloalto');
  assert.equal(compactSearchName('IĞDIR'), 'igdir');
  assert.equal(compactSearchName('i\u0307stanbul'), 'istanbul');
  assert.equal(compactSearchName('ACME-123 / ltd.'), 'acme123ltd');
});

test('exact, prefix, typo and threshold evidence', () => {
  assert.deepEqual(findNameRescueEvidence('Fortinet', 'fortinet'), { score: 1.24, exact: true });
  assert.deepEqual(findNameRescueEvidence('Palo Alto Networks', 'paloalto'), { score: 1.13, exact: false });
  assert.equal(findNameRescueEvidence('Fortinet', 'Fortinetx')?.score, 1.06);
  assert.equal(findNameRescueEvidence('Palo Alto Networks', 'Palo Alot')?.score, 1.06);
  assert.equal(findNameRescueEvidence('Fortinet', 'fortnet')?.score, 1.06);
  assert.equal(findNameRescueEvidence('Fortinet', 'for'), null);
  assert.equal(findNameRescueEvidence('Fortinet', 'Completely Different'), null);
});

test('short queries and empty values never fuzzy-match', () => {
  for (const input of ['', 'F', 'ED', 'EDR', '  ']) {
    assert.equal(findNameRescueEvidence('EDR Solutions', input), null);
  }
  assert.equal(findNameRescueEvidence('', 'Fortinet'), null);
});

test('long inputs are rejected before costly fuzzy matching', () => {
  assert.equal(findNameRescueEvidence('A'.repeat(161), 'longquery'), null);
  assert.equal(findNameRescueEvidence('Valid', 'A'.repeat(129)), null);
});

test('Turkish partner intent and ordinary query', () => {
  assert.deepEqual(parsePartnerIntent('Fortinet Türkiye partnerleri'), {
    rawQuery: 'Fortinet Türkiye partnerleri', lookupQuery: 'Fortinet', partnerIntent: true,
  });
  for (const q of ['Cisco çözüm ortakları', 'Cisco bayileri?', 'Cisco iş ortakları!', 'Cisco resellerları']) {
    assert.equal(parsePartnerIntent(q).lookupQuery, 'Cisco');
    assert.equal(parsePartnerIntent(q).partnerIntent, true);
  }
  assert.equal(parsePartnerIntent('EDR').partnerIntent, false);
});

test('Turkish SEO slugs', () => {
  assert.equal(slugifyTr('İş Çözümleri / Güvenlik'), 'is-cozumleri-guvenlik');
  assert.equal(slugifyTr('ĞÜŞİÖÇ 2026'), 'gusioc-2026');
  assert.equal(slugifyTr('   '), '');
});

test('ranks only supplied visible candidates without extra data access', () => {
  const allowed = [{ name: 'Fortinet' }, { name: 'Palo Alto Networks' }];
  const matches = rankNames('paloalto', allowed, x => x.name);
  assert.deepEqual(matches.map(x => x.item.name), ['Palo Alto Networks']);
  assert.deepEqual(rankNames('paloalto', allowed, x => x.name, 1), []);
});

test('candidate count is always bounded, including Infinity and NaN', () => {
  const list = Array.from({length: 600}, (_, i) => ({name: `fortinet${i}`}));
  assert.equal(rankNames('fortinet', list, x => x.name, Infinity).length, 0);
  assert.equal(rankNames('fortinet', list, x => x.name, NaN).length, 0);
  assert.equal(rankNames('fortinet', list, x => x.name, 10_000).length, 500);
});

test('stable ranking: exact before prefixes, alphabetical tie breaker', () => {
  const list = [{ name: 'Fortinet Test' }, { name: 'Fortinet' }, { name: 'Fortinet Alpha' }];
  const matches = rankNames('fortinet', list, x => x.name);
  assert.equal(matches[0].item.name, 'Fortinet');
  assert.deepEqual(matches.slice(1).map(x => x.item.name), ['Fortinet Alpha', 'Fortinet Test']);
});
