# Security Policy

## Supported Versions

| Version | Supported |
| ------- | --------- |
| 1.x     | ✅ Yes    |

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

If you discover a security vulnerability, please report it responsibly:

1. **Open a private GitHub Security Advisory** via the [Security tab](../../security/advisories/new) of this repository, OR
2. **Email the maintainer directly** — include "SECURITY" in the subject line.

Please include as much detail as possible:

- Type of vulnerability (e.g., SQL injection, XSS, authentication bypass)
- File paths and line numbers of the source code related to the issue
- Step-by-step instructions to reproduce the vulnerability
- Proof-of-concept or exploit code (if possible)
- Potential impact of the vulnerability

## Response Timeline

| Action                   | Timeline                                          |
| ------------------------ | ------------------------------------------------- |
| Initial acknowledgment   | Within 48 hours                                   |
| Vulnerability assessment | Within 5 business days                            |
| Fix & patch release      | Within 14 days (critical), 30 days (non-critical) |
| Public disclosure        | After patch is released                           |

## Security Best Practices for Deployments

When deploying this API, please follow these guidelines:

- **Never commit `.env` files** — use `.env.example` as a template
- **Use strong, unique secrets** for `ACCESS_TOKEN_SECRET` and `REFRESH_TOKEN_SECRET` (minimum 32 characters, randomly generated)
- **Set `CORS_ORIGIN`** to your specific frontend domain in production — never use `*` in production
- **Set `NODE_ENV=production`** to suppress stack traces in error responses
- **Use HTTPS** — always deploy behind TLS/SSL in production
- **Rotate JWT secrets** periodically and invalidate all active sessions when doing so
- **Limit Cloudinary API key permissions** to only what the app needs (upload + delete)
- **Set MongoDB network access** to only allow connections from your server's IP
