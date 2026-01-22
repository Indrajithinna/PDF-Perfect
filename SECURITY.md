# Security Policy

## Supported Versions

We release patches for security vulnerabilities in the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of PDF Perfect seriously. If you believe you have found a security vulnerability, please report it to us as described below.

### How to Report

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via email to: [security@pdfperfect.com](mailto:security@pdfperfect.com)

You should receive a response within 48 hours. If for some reason you do not, please follow up via email to ensure we received your original message.

Please include the following information in your report:

- Type of issue (e.g., buffer overflow, SQL injection, cross-site scripting, etc.)
- Full paths of source file(s) related to the manifestation of the issue
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit the issue

### What to Expect

- We will acknowledge your email within 48 hours
- We will provide a more detailed response within 7 days
- We will work on a fix and keep you informed of our progress
- We will notify you when the vulnerability is fixed
- We will credit you in our security advisory (unless you prefer to remain anonymous)

## Security Best Practices

When using PDF Perfect:

1. **Keep Dependencies Updated**: Regularly update the application and its dependencies
2. **Use HTTPS**: Always serve the application over HTTPS in production
3. **Validate Input**: The application validates file types, but always be cautious with user uploads
4. **Browser Security**: Keep your browser updated to the latest version
5. **Local Processing**: All PDF processing happens locally in your browser - no files are uploaded to servers

## Known Security Considerations

- **Client-Side Processing**: All operations are performed client-side, which means large files may consume significant browser memory
- **File Size Limits**: While we don't enforce strict limits, processing very large PDFs may cause browser performance issues
- **Browser Compatibility**: Some features may not work in older browsers; use modern, updated browsers for best security

## Security Features

- ✅ **No Server Upload**: Files never leave your device
- ✅ **No Data Collection**: We don't track or store any user data
- ✅ **Open Source**: Full transparency - review our code anytime
- ✅ **Content Security Policy**: Implemented CSP headers for production deployments
- ✅ **Dependency Scanning**: Automated dependency vulnerability scanning via GitHub Actions

## Updates and Patches

Security updates will be released as soon as possible after a vulnerability is confirmed. Users will be notified through:

- GitHub Security Advisories
- Release notes
- Project README updates

## Contact

For any security-related questions or concerns, please contact:
- Email: security@pdfperfect.com
- GitHub: Create a private security advisory

Thank you for helping keep PDF Perfect and our users safe!
