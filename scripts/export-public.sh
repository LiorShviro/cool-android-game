#!/usr/bin/env bash
set -euo pipefail

SOURCE_BRANCH="main"
PUBLIC_BRANCH="public"
PUSH=false

for arg in "$@"; do
  case "$arg" in
    --source=*) SOURCE_BRANCH="${arg#*=}" ;;
    --public=*) PUBLIC_BRANCH="${arg#*=}" ;;
    --push) PUSH=true ;;
    *)
      echo "Unknown argument: $arg" >&2
      echo "Usage: $0 [--source=main] [--public=public] [--push]" >&2
      exit 1
      ;;
  esac
done

if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "Working tree is dirty. Commit or stash changes first." >&2
  exit 1
fi

CURRENT_BRANCH="$(git rev-parse --abbrev-ref HEAD)"
TIMESTAMP="$(date +%Y%m%d%H%M%S)"
TMP_BRANCH="public-export-${TIMESTAMP}"

# Start from source branch
if ! git show-ref --verify --quiet "refs/heads/${SOURCE_BRANCH}"; then
  echo "Source branch '${SOURCE_BRANCH}' does not exist locally." >&2
  exit 1
fi

git switch "${SOURCE_BRANCH}" >/dev/null

git switch -c "${TMP_BRANCH}" >/dev/null

# Remove internal-only files
rm -rf conductor
rm -f CLAUDE.md WIP.md android/app/debug.keystore
rm -rf .claude

# Replace README with public version
if [[ -f README.public.md ]]; then
  mv README.public.md README.md
else
  echo "README.public.md not found. Create it before exporting." >&2
  exit 1
fi

# Ensure community files exist
if [[ ! -f LICENSE || ! -f SECURITY.md || ! -f CONTRIBUTING.md ]]; then
  echo "Missing LICENSE/SECURITY.md/CONTRIBUTING.md. Add them before exporting." >&2
  exit 1
fi

# Keep docs folder if present; public docs live under docs/

# Commit public export
if ! git diff --quiet; then
  git add -A
  git commit -m "chore: export public branch" >/dev/null
else
  echo "No changes to commit. Public export would be identical." >&2
fi

# Update public branch ref
if git show-ref --verify --quiet "refs/heads/${PUBLIC_BRANCH}"; then
  git branch -f "${PUBLIC_BRANCH}" "${TMP_BRANCH}" >/dev/null
else
  git branch "${PUBLIC_BRANCH}" "${TMP_BRANCH}" >/dev/null
fi

# Restore original branch and clean up temp branch

git switch "${CURRENT_BRANCH}" >/dev/null

git branch -D "${TMP_BRANCH}" >/dev/null

if [[ "${PUSH}" == true ]]; then
  git push origin "${PUBLIC_BRANCH}" --force-with-lease
  echo "Public branch pushed to origin/${PUBLIC_BRANCH}."
else
  echo "Public branch updated locally. Use --push to publish." 
fi
