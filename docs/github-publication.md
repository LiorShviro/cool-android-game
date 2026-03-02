# GitHub Publication Checklist

## Repository Settings
- Set default branch to `public` for public visitors.
- Protect `main`:
  - Require PRs
  - Require status checks (lint/tests)
  - Block force-push
- Protect `public`:
  - Allow updates only from maintainers

## Security
- Enable Secret Scanning
- Enable Dependabot Alerts
- (Optional) Enable CodeQL

## Actions
- Keep build workflow enabled on `main` and `public` if you want artifacts.
- Ensure workflows use least-privilege permissions.
