# Security Policy

## Supported versions

The latest tagged release is the target for security fixes. As of the initial repository preparation, no public release tag has been created.

## Reporting a vulnerability

**Please do not open a public issue for vulnerabilities or secret exposure.** After publication, use the repository's GitHub **Security → Advisories → Report a vulnerability** private reporting feature if enabled. Otherwise, contact the maintainer through the contact method on their public GitHub profile. Do not share access keys or real-user contact data.

There is no fixed response-time guarantee at this stage. Maintainers will assess credible reports and coordinate a patch and disclosure where appropriate.

## Security boundary

This package acts only on *candidate names supplied by its caller*. It does not perform authentication, database access, authorization, row-level security, credential handling or public-directory publication decisions. Consumers must filter their candidates before invoking the library and rate-limit their own endpoints.
