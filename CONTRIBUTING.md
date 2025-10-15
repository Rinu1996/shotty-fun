# Contributing to Shotty

First off, thank you for considering contributing to Shotty! It's people like you that make Shotty such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* **Use a clear and descriptive title** for the issue to identify the problem.
* **Describe the exact steps which reproduce the problem** in as many details as possible.
* **Provide specific examples to demonstrate the steps**.
* **Describe the behavior you observed after following the steps** and point out what exactly is the problem with that behavior.
* **Explain which behavior you expected to see instead and why.**
* **Include screenshots and animated GIFs** if possible.

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* **Use a clear and descriptive title** for the issue to identify the suggestion.
* **Provide a step-by-step description of the suggested enhancement** in as many details as possible.
* **Provide specific examples to demonstrate the steps**.
* **Describe the current behavior** and **explain which behavior you expected to see instead** and why.
* **Explain why this enhancement would be useful** to most Shotty users.

### Pull Requests

Please follow these steps to have your contribution considered by the maintainers:

1. Follow all instructions in the pull request template
2. Follow the [styleguides](#styleguides)
3. After you submit your pull request, verify that all status checks are passing

#### What if the status checks are failing?

If a status check is failing, and you believe that the failure is unrelated to your change, please leave a comment on the pull request explaining why you believe the failure is unrelated.

## Development Setup

### Prerequisites

* Node.js 21 or higher
* pnpm 8 or higher
* Docker and Docker Compose
* Git

### Setting Up Your Development Environment

1. Fork and clone the repository
   ```bash
   git clone https://github.com/your-username/shotty.git
   cd shotty
   ```

2. Install dependencies
   ```bash
   pnpm install
   ```

3. Copy `.env.example` to `.env` and fill in your API keys
   ```bash
   cp .env.example .env
   ```

4. Start the development environment
   ```bash
   # Start all services with Docker Compose
   docker compose up
   
   # Or run in development mode
   pnpm dev
   ```

### Project Structure

```
shotty/
├── apps/
│   ├── api/          # Fastify backend API
│   ├── ui/           # React frontend
├── remotion/         # Video rendering with Remotion
├── docker-compose.yml
└── Dockerfile
```

### Running Tests

```bash
# Run all tests
pnpm test

# Run API tests
pnpm --filter api test

# Run UI tests
pnpm --filter ui test
```

### Building

```bash
# Build all packages
pnpm build

# Build specific package
pnpm --filter api build
pnpm --filter ui build
```

## Styleguides

### Git Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line
* Consider starting the commit message with an applicable emoji:
    * 🎨 `:art:` when improving the format/structure of the code
    * 🐎 `:racehorse:` when improving performance
    * 🚱 `:non-potable_water:` when plugging memory leaks
    * 📝 `:memo:` when writing docs
    * 🐛 `:bug:` when fixing a bug
    * 🔥 `:fire:` when removing code or files
    * ✅ `:white_check_mark:` when adding tests
    * 🔒 `:lock:` when dealing with security
    * ⬆️ `:arrow_up:` when upgrading dependencies
    * ⬇️ `:arrow_down:` when downgrading dependencies

### TypeScript Styleguide

* Use TypeScript for all new code
* Follow the existing code style (ESLint configuration)
* Use meaningful variable names
* Add JSDoc comments for functions and complex logic
* Prefer const over let
* Use async/await over promises

### Documentation Styleguide

* Use Markdown for documentation
* Reference functions, classes, and methods in backticks: \`functionName()\`
* Use code blocks with appropriate language tags

## Additional Notes

### Issue and Pull Request Labels

This section lists the labels we use to help us track and manage issues and pull requests.

* `bug` - Issues that are bugs
* `enhancement` - Issues that are feature requests
* `documentation` - Issues related to documentation
* `good first issue` - Good for newcomers
* `help wanted` - Extra attention is needed
* `question` - Further information is requested

## Recognition

Contributors will be recognized in the project README.md file.

Thank you for contributing! ❤️
