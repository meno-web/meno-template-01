---
description: Create a new Meno page from description
allowed-tools: Read, Write, Glob
---

# Build Page

Create a new page based on the user's description.

## Usage

```
/build-page [description]
```

## Instructions

1. **Understand the request**: Parse $ARGUMENTS for the page description
2. **Gather context**:
   - Read `colors.json` for available color variables
   - Optionally read existing pages in `pages/` for style patterns
3. **Create the page**: Write a JSON file following Meno structure

## Key Rules

### Text Content
Use `children` for text, **NOT** `text` prop:
```json
// CORRECT
{ "type": "node", "tag": "span", "children": "Hello" }

// WRONG
{ "type": "node", "tag": "span", "text": "Hello" }
```

### Colors
Always use CSS variables from colors.json:
```json
"style": { "base": { "color": "var(--textPrimary)" } }
```

### Responsive Styles
Use breakpoint object structure:
```json
"style": {
  "base": { "fontSize": "48px", "padding": "80px" },
  "tablet": { "fontSize": "36px", "padding": "60px" },
  "mobile": { "fontSize": "24px", "padding": "40px" }
}
```

### Page Structure
```json
{
  "meta": {
    "title": "Page Title",
    "description": "Page description for SEO"
  },
  "body": {
    "type": "node",
    "tag": "main",
    "children": [
      // sections go here
    ]
  }
}
```

### Images
Use standard HTML attributes:
```json
{
  "tag": "img",
  "attributes": {
    "src": "/image.jpg",
    "alt": "Description",
    "loading": "lazy"
  }
}
```

## Reference

For detailed node types and patterns, see `.claude/docs/meno/core.md`

## Example

User: `/build-page landing page with hero section and features grid`

Actions:
1. Read `colors.json` for color palette
2. Create `pages/landing.json` with:
   - Hero section with heading and CTA
   - Features grid with responsive layout
