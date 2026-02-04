---
description: Create a new Meno page from description
allowed-tools: Read, Write, Glob
---

# Build Page

Create a new page prioritizing existing components.

## Usage

```
/build-page [description]
```

## Instructions

1. **Understand the request**: Parse $ARGUMENTS for the page description

2. **Discover available components** (REQUIRED FIRST STEP):
   - Read `components.config.json` to see components and their categories
   - Categories: **sections** (full page sections), **ui** (layout primitives), **forms**, **shared**

3. **Gather context**:
   - Read `pages/index.json` for page structure reference

4. **Build page using priority order**:

   **Priority 1 - Existing Sections**: If a section component matches the need, use it:
   ```json
   { "type": "component", "component": "HeroSection", "props": { "title": "..." } }
   ```

   **Priority 2 - UI Components**: Compose with UI primitives (Grid, Stack, Card, Button):
   ```json
   {
     "type": "component",
     "component": "Grid",
     "props": { "columns": "3" },
     "children": [...]
   }
   ```

   **Priority 3 - Raw Nodes**: Only when no suitable component exists:
   ```json
   { "type": "node", "tag": "div", "style": {...}, "children": [...] }
   ```

5. **Create the page**: Write to `pages/[name].json`

## Key Rules

### Component Usage
Always check components.config.json first. Use component instances:
```json
{
  "type": "component",
  "component": "ComponentName",
  "props": { "propName": "value" },
  "children": [...]  // if component has a slot
}
```

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
  "root": {
    "type": "component",
    "component": "Layout",
    "children": [
      // sections/components go here
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

For detailed node types and patterns `.claude/docs/meno/components.md`

## Example

User: `/build-page landing page with hero section and features grid`

Actions:
1. Read `components.config.json` - find HeroSection, FeaturesGrid in sections
2. Read component files to understand their props
3. Read `colors.json` for color palette
4. Create `pages/landing.json` using existing section components:
   ```json
   {
     "meta": { "title": "Landing", "description": "..." },
     "root": {
       "type": "node",
       "tag": "main",
       "children": [
         { "type": "component", "component": "HeroSection", "props": { "title": "..." } },
         { "type": "component", "component": "FeaturesGrid", "props": { "columns": "3" } }
       ]
     }
   }
   ```
