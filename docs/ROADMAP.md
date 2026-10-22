# Public roadmap

Priorities are exploratory until maintainers accept them as tracked issues. Changes must not depend on PartnerMap's private production database.

## Version 0.1 — release quality

- [x] Framework-independent extraction (no runtime deps)
- [x] Turkish casing and conservative typo-rescue tests
- [x] Input-length and candidate-count bounds
- [x] Security policy, MIT license, contributor guide, CI configuration
- [ ] Publish this repository with a clean new history and passing CI
- [ ] Tag first GitHub release after validating installation/usage from a clean clone

## Next improvements (dependent on real user feedback)

- [ ] Add benchmarks and a reproducible performance test corpus using synthetic terms
- [ ] Evaluate ambiguous abbreviations, transliterations and punctuation conventions
- [ ] Validate third-party use cases and document supported integrations
- [ ] Publish npm package only when versioning, provenance and name availability are verified
- [ ] Consider external contributions, review and triage transparently

## Project integrity

Public documentation must distinguish **this library's real adoption** from the size of the unrelated private application's dataset. Never fabricate usage statistics, stars, downloads, issues or pull requests.
