# Contributing to Watchly API

First off, thanks for taking the time to contribute! 🎉

The following is a set of guidelines for contributing to Watchly. These are mostly guidelines, not rules — use your best judgment, and feel free to propose changes.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Branch Naming Convention](#branch-naming-convention)
- [Commit Message Convention](#commit-message-convention)
- [Pull Request Process](#pull-request-process)
- [Code Style](#code-style)

---

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

---

## How Can I Contribute?

### Reporting Bugs

Before creating a bug report, please check the [issue tracker](../../issues) to see if the problem has already been reported.

When filing a bug, include:
- **Clear title and description**
- **Steps to reproduce**
- **Expected vs. actual behavior**
- **Node.js and npm versions** (`node -v`, `npm -v`)
- **Any relevant error logs**

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When submitting:
- Use a **clear, descriptive title**
- Provide a **step-by-step description** of the enhancement
- Explain **why** this enhancement would be useful

### Pull Requests

1. Fork the repository
2. Create a feature branch from `main`
3. Make your changes
4. Ensure all tests pass (once test suite is added)
5. Submit a pull request

---

## Development Setup

```bash
# 1. Fork and clone the repository
git clone https://github.com/YOUR_USERNAME/watchly-api.git
cd watchly-api

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env
# Fill in your values in .env

# 4. Start the development server
npm run dev
```

---

## Branch Naming Convention

Use the following prefixes:

| Prefix | Purpose | Example |
|--------|---------|---------|
| `feat/` | New feature | `feat/add-video-search` |
| `fix/` | Bug fix | `fix/video-validator-isImage` |
| `docs/` | Documentation only | `docs/update-readme` |
| `refactor/` | Code refactor (no feature/fix) | `refactor/playlist-controller` |
| `test/` | Adding or updating tests | `test/user-controller` |
| `chore/` | Maintenance tasks | `chore/update-dependencies` |

---

## Commit Message Convention

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <short summary>

[optional body]

[optional footer]
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

**Examples:**
```
feat(auth): add refresh token rotation
fix(video): correct isImage validator always returning true
docs(readme): add architecture diagram
```

---

## Pull Request Process

1. **Update documentation** — if you change an endpoint or add a feature, update the README
2. **Keep it focused** — one PR per feature or fix
3. **Add tests** — new features should include tests
4. **Link issues** — reference any related issues with `Closes #123`
5. **Request review** — tag a maintainer after opening the PR

PRs will be merged once they receive at least one maintainer approval.

---

## Code Style

This project uses **Prettier** for formatting. Run before committing:

```bash
npx prettier --write .
```

Key style rules:
- 2-space indentation
- Double quotes for strings
- Semicolons required
- Trailing commas (ES5)
- Max line width: 100 characters

---

Thank you for contributing! 🚀
