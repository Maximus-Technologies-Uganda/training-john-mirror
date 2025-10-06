## Quote CLI

A simple, testable Node.js CLI that prints quotes. It separates pure core logic from a thin CLI wrapper.

### Features
- Get a random quote
- Filter quotes by author with `--by <author>` (case-insensitive)
- Pure core library functions for easy testing

### Setup

```bash
cd quote
npm install
```

### Usage
$ node src/quote-cli.js --by "Mark Twain"
Found 1 quote by Mark Twain
"The secret of getting ahead is getting started." — Mark Twain
Get a random quote:

```bash
node src/quote-cli.js
```

Search by author (case-insensitive):

```bash
node src/quote-cli.js --by "Maya Angelou"
```

Example outputs:

```bash
# Random quote
node src/quote-cli.js
"Be yourself; everyone else is already taken." — Oscar Wilde

# Filter by author
node src/quote-cli.js --by "Maya Angelou"
"You will face many defeats in life, but never let yourself be defeated." — Maya Angelou
"If you don't like something, change it. If you can't change it, change your attitude." — Maya Angelou

# Author not found (returns exit code 1)
node src/quote-cli.js --by "Unknown Author"
No quotes found for author: Unknown Author
```

### Testing

```bash
npm test
```

This runs a small Vitest suite covering:
- Random quote selection
- Filtering by author when present/absent
- Case-insensitive matching
- Handling empty or invalid sources


