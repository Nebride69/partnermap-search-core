# Contributing to Turkish Entity Search

Thanks for considering a contribution. This is a small, focused library; new features should protect predictability and Turkish-language matching quality.

## Workflow

1. Look for an existing issue before proposing a new feature.
2. Open an issue with a **synthetic** minimum example, expected behavior and observed behavior.
3. Fork the repository and make a branch for the change.
4. Add a regression test to `test/search.test.mjs`. Run `npm install && npm test` (Node.js 20+).
5. Open a pull request describing user impact, risks of false positives and changes to public API.
6. Wait for a maintainer review; maintainers may request tests or documentation.

## Quality standards

- Prefer deterministic and bounded algorithms over broad heuristic auto-corrections.
- Treat matching scores as **ordering hints**, not statistical confidence.
- Do not depend on a cloud account or a running database for tests.
- Never submit real customer data, private search logs, email lists, cookies, tokens or partner ownership evidence.
- Changes to matching semantics require a CHANGELOG entry and tests for `İ/i`, `I/ı`, combining characters, punctuation, short inputs and long inputs.
- Do not use private PartnerMap code or data that is not explicitly approved for publication.

## Security

For sensitive reports use the private reporting path in [SECURITY.md](SECURITY.md), not a public GitHub issue.

## Maintainer commitments

We aim to respond to clearly reproducible issues, review meaningful PRs, maintain release notes and publish compatibility changes. We do not promise response times or an automatic merge.
