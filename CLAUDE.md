<!-- MENO_DOCS_VERSION: 1.1 -->
# Meno Core Documentation

## Creating Components

Components use the Meno JSON structure. NEVER use raw HTML/CSS format.

### Component Structure
\`\`\`json
{
  "component": {
    "structure": {
      "type": "node",
      "tag": "li",
      "style": {
        "base": { "padding": "8px 0", "color": "var(--text)" }
      },
      "children": [{ "type": "slot" }]
    },
    "interface": {
      "text": { "type": "string", "default": "List item" }
    }
  }
}
\`\`\`

### Rules
1. Root must be \`{ "component": { ... } }\`
2. \`structure\` defines the DOM tree using nodes, NOT raw HTML
3. \`interface\` defines props with type and default value
4. Only ONE slot per component - use nested components for multiple slots
5. Component JS files use vanilla JavaScript, NOT React

### Reserved Names
- \`children\`: NEVER define in interface - reserved for child nodes

---

## Node Types

### 1. HTML Element (\`type: "node"\`)
\`\`\`json
{
  "type": "node",
  "tag": "div",
  "style": { "base": { "padding": "16px" } },
  "attributes": { "data-id": "hero" },
  "children": [...]
}
\`\`\`
Properties: \`tag\` (required), \`style\`, \`attributes\`, \`children\`, \`label\`, \`interactiveStyles\`

**Text content**: Use \`children\` for text (there is NO \`text\` property):
\`\`\`json
{ "type": "node", "tag": "span", "children": "Hello World" }
\`\`\`

### 2. Component Instance (\`type: "component"\`)
\`\`\`json
{
  "type": "component",
  "component": "Button",
  "props": { "text": "Click me", "variant": "primary" },
  "children": [...]
}
\`\`\`
Properties: \`component\` (required), \`props\`, \`children\`, \`attributes\`

**Styling**: Don't add \`style\` directly. Use props mapped to styles via \`_mapping\`.

**Passing props through**: Use \`{{propName}}\` templates to forward a parent prop to a child component prop. Only use \`_mapping\` when you need to transform values (e.g., prop \`"primary"\` → style \`"var(--primary)"\`).
\`\`\`json
"props": { "icon": "{{icon}}" }
\`\`\`

### 3. Slot (\`type: "slot"\`)
Placeholder where component children are injected. Only ONE per component.
\`\`\`json
{ "type": "slot" }
\`\`\`

### 4. Link (\`type: "link"\`)
\`\`\`json
{
  "type": "link",
  "href": "/about",
  "style": { "base": { "color": "var(--primary)" } },
  "children": ["Learn more"]
}
\`\`\`
Properties: \`href\` (required), \`children\`, \`style\`, \`attributes\`

**Dynamic href** - use template with link-type prop:
\`\`\`json
// Structure: "href": "{{link}}"
// Interface: "link": { "type": "link" }
\`\`\`

### 5. Embed (\`type: "embed"\`)
Inject raw HTML/SVG content (bypasses escaping).
\`\`\`json
{
  "type": "embed",
  "html": "<svg>...</svg>",
  "style": { "base": { "width": "100%" } }
}
\`\`\`
Properties: \`html\` (required), \`style\`, \`attributes\`, \`label\`

### 6. List (\`type: "list"\`)
Iterate over prop arrays or CMS collections:

**Prop-based:**
\`\`\`json
{
  "type": "list",
  "sourceType": "prop",
  "source": "items",
  "itemAs": "item",
  "children": [
    { "type": "node", "tag": "div", "children": "{{item.title}}" }
  ]
}
\`\`\`

**CMS collection:**
\`\`\`json
{
  "type": "list",
  "sourceType": "collection",
  "source": "posts",
  "itemAs": "post",
  "limit": 10,
  "sort": { "field": "createdAt", "order": "desc" },
  "children": [
    { "type": "node", "tag": "article", "children": "{{post.title}}" }
  ]
}
\`\`\`

**Properties:**
- \`sourceType\` - "prop" (default) or "collection"
- \`source\` (required) - Prop name or collection name
- \`itemAs\` - Variable name for templates (default: "item")
- \`limit\`, \`offset\` - Pagination
- Collection-only: \`filter\`, \`sort\`, \`items\`, \`excludeCurrentItem\`

**Template variables:** \`{{item.field}}\`, \`{{itemIndex}}\`, \`{{itemFirst}}\`, \`{{itemLast}}\`

### 7. Locale List (\`type: "locale-list"\`)
Language switcher based on project locales:
\`\`\`json
{
  "type": "locale-list",
  "displayType": "nativeName",
  "showFlag": true,
  "showCurrent": false,
  "style": { "base": { "display": "flex", "gap": "8px" } }
}
\`\`\`
Properties: \`displayType\` ("code"|"name"|"nativeName"), \`showFlag\`, \`showCurrent\`, \`showSeparator\`

---

## Interface Prop Types

| Type | Description | Example |
|------|-------------|---------|
| \`string\` | Text input | \`{ "type": "string", "default": "Hello" }\` |
| \`number\` | Numeric input | \`{ "type": "number", "default": 0 }\` |
| \`boolean\` | Toggle | \`{ "type": "boolean", "default": false }\` |
| \`select\` | Dropdown | \`{ "type": "select", "options": ["a", "b"], "default": "a" }\` |
| \`link\` | URL with target | \`{ "type": "link", "default": { "href": "/" } }\` |
| \`file\` | File upload | \`{ "type": "file", "accept": "image/*", "default": "" }\` |
| \`rich-text\` | HTML content | \`{ "type": "rich-text", "default": "" }\` |

**CRITICAL: There is NO \`"image"\` type!** Use \`file\` with \`accept: "image/*"\`

---

## Template Variables

- \`{{propName}}\` - Component props from interface
- \`{{item.field}}\` - List item context (or custom name via \`itemAs\`)
- \`{{itemIndex}}\`, \`{{itemFirst}}\`, \`{{itemLast}}\` - List loop helpers
- \`{{cms.field}}\` - CMS template pages only (pages/templates/)

---

## Style Mappings

Use \`_mapping\` to vary styles based on props:
\`\`\`json
"backgroundColor": {
  "_mapping": true,
  "prop": "variant",
  "values": { "primary": "var(--primary)", "secondary": "var(--secondary)" }
}
\`\`\`

---

## Interactive Styles

CSS pseudo-selectors and JS-triggered states via \`interactiveStyles\`:

\`\`\`json
{
  "type": "node",
  "tag": "button",
  "interactiveStyles": [
    {
      "prefix": "",
      "postfix": ":hover",
      "style": { "base": { "backgroundColor": "var(--primary-dark)" } }
    }
  ]
}
\`\`\`

### How prefix/postfix Work
CSS generated: \`{prefix}.element-class{postfix}\`

| Use Case | prefix | postfix | Result |
|----------|--------|---------|--------|
| Hover | "" | ":hover" | \`.el:hover\` |
| Focus | "" | ":focus" | \`.el:focus\` |
| Self has class | "" | ".is-open" | \`.el.is-open\` |
| Target child | "" | ".is-open [data-el='menu']" | \`.el.is-open [data-el='menu']\` |
| Ancestor context | ".dark " | "" | \`.dark .el\` |

### Placement Rule
**Always place \`interactiveStyles\` on the target node itself.** Use \`prefix\` with the parent's \`data-el\` to reference the trigger (e.g., \`"prefix": "[data-el='dropdown']:hover "\`), instead of putting styles on the parent with a child-targeting postfix.

### JS + Interactive Styles Pattern
1. Add \`data-el\` attributes to elements you need to target
2. JS toggles a state class (e.g., \`.is-open\`) on the component root
3. \`interactiveStyles\` picks up the state and applies styles

---

## Responsive Breakpoints

Styles support three breakpoints:
\`\`\`json
"style": {
  "base": { "fontSize": "18px", "padding": "24px" },
  "tablet": { "fontSize": "16px", "padding": "16px" },
  "mobile": { "fontSize": "14px", "padding": "12px" }
}
\`\`\`

---

## Conditional Rendering

All nodes support \`if\` for conditional rendering:
\`\`\`json
// Boolean
{ "type": "node", "tag": "div", "if": false, "children": "Hidden" }

// From component prop
{
  "type": "node",
  "if": { "_mapping": true, "prop": "showBanner", "values": { "true": true, "false": false } },
  "children": "Banner"
}

// From context
{ "type": "node", "if": "{{showPromo}}", "children": "Promo" }
\`\`\`

---

## Colors

Use CSS variables from colors.json:
- \`var(--primary)\`, \`var(--secondary)\`
- \`var(--text)\`, \`var(--background)\`, \`var(--muted)\`

Read colors.json to see all available colors.

---

## Enums

Project-level reusable option sets stored in \`enums.json\`:
\`\`\`json
{
  "size": ["sm", "md", "lg", "xl"],
  "theme": ["light", "dark"]
}
\`\`\`
Component select props reference enums via \`enumName\` instead of inline \`options\`:
\`\`\`json
"size": { "type": "select", "enumName": "size", "default": "md" }
\`\`\`
- **File**: \`enums.json\` in project root
- **API**: GET \`/api/enums\`, POST \`/api/save-enums\`

---

## Variables

CSS design tokens stored in \`variables.json\`:
\`\`\`json
{
  "variables": [
    {
      "name": "Heading",
      "prop_name": "Size 1",
      "cssVar": "--h1-fs",
      "value": "48px",
      "type": "fontSize",
      "group": "font-size"
    }
  ]
}
\`\`\`
Each variable has:
- \`name\` — display label (e.g., \`"Heading"\`)
- \`prop_name\` (optional) — secondary label for specificity (e.g., \`"Size 1"\`)
- \`cssVar\` — CSS custom property name (e.g., \`--h1-fs\`)
- \`value\` — base value (e.g., \`48px\`)
- \`type\` — responsive scaling category: \`fontSize\`, \`padding\`, \`margin\`, \`gap\`, or \`none\`
- \`group\` (optional) — UI filter group: \`font-family\`, \`font-size\`, \`font-weight\`, \`line-height\`, \`letter-spacing\`, \`margin\`, \`padding\`, \`gap\`, \`size\`, \`border-radius\`, \`border-width\`, \`opacity\`, \`z-index\`, \`text-align\`, \`other\`
- \`scales\` (optional) — per-variable breakpoint scale overrides, e.g., \`{ "tablet": 0.88, "mobile": 0.75 }\`

Variables with \`type\` other than \`none\` auto-scale at smaller breakpoints using \`responsiveScales\` from \`project.config.json\`.

Use in styles via \`var()\`: \`{ "fontSize": "var(--h1-fs)" }\`

- **File**: \`variables.json\` in project root
- **API**: GET \`/api/variables-status\`, GET \`/api/variables-css\`, POST \`/api/save-variables\`

---

## Project Structure

- \`pages/*.json\` - Page definitions
- \`components/\` - Component definitions organized by folder (see \`components.config.json\` for folder descriptions)
- \`colors.json\` - CSS color variables
- \`project.config.json\` - Project configuration