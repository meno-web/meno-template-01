## Creating New Components (CRITICAL - Follow Exactly)

When creating component JSON files, you MUST use the Meno component structure. NEVER use raw HTML/CSS format.

### CORRECT FORMAT (Always use this):
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

### Component Structure Rules:
1. Root must be \`{ "component": { ... } }\`
2. \`structure\` defines the DOM tree using nodes, NOT raw HTML
3. \`interface\` defines props with type and default value
4. Only ONE slot per component is allowed - multiple slots are NOT supported. Workaround: use nested components (e.g., Tabs -> TabNav + TabContent, each with their own slot)
5. Component JS files (Name.js) must use vanilla JavaScript, NOT React - no JSX, no hooks, no React imports

### Component Prop Names
Most prop names work fine, including: type, style, tag, component, props, attributes, src, alt, title, name, variant.

**Reserved name in interface - \`children\`**: NEVER define \`children\` in the component \`interface\`. It's reserved for child nodes passed to the component. Use a different name (like \`content\` or \`text\`) for text props.

### Node Types in Structure

#### 1. HTML Element (\`type: "node"\`)
Standard HTML element with styling and children.
\`\`\`json
{
  "type": "node",
  "tag": "div",
  "style": { "base": { "padding": "16px" } },
  "attributes": { "data-id": "hero" },
  "children": [...]
}
\`\`\`
**Properties**: \`tag\` (required), \`style\`, \`attributes\`, \`children\`, \`label\`, \`interactiveStyles\`

#### 2. Component Instance (\`type: "component"\`)
Instance of a defined component with props.
\`\`\`json
{
  "type": "component",
  "component": "Button",
  "props": { "text": "Click me", "variant": "primary" },
  "children": [...]
}
\`\`\`
**Properties**: \`component\` (required), \`props\`, \`children\`, \`attributes\`

**Styling component instances**: Don't add \`style\` directly to component instances. Instead, use props that the component maps to styles internally via \`_mapping\`.

#### 3. Slot (\`type: "slot"\`)
Placeholder where component children are injected. Only ONE slot per component.
\`\`\`json
{ "type": "slot" }
\`\`\`
**Properties**: None. Used only in component \`structure\`.

#### 4. Link (\`type: "link"\`)
Clickable link rendered as \`<a>\` tag in SSR, \`<div>\` in editor.
\`\`\`json
{
  "type": "link",
  "href": "/about",
  "style": { "base": { "color": "var(--primary)" } },
  "children": ["Learn more"]
}
\`\`\`
**Properties**: \`href\` (required - string or link object), \`children\`, \`style\`, \`attributes\`
**href formats**: \`"/path"\` or \`{ "href": "/path", "target": "_blank" }\`

**Dynamic href in components** - use template interpolation with link-type prop:
\`\`\`json
// In component structure:
"href": "{{link}}"

// In interface:
"link": { "type": "link" }
\`\`\`

### Interface Prop Types (IMPORTANT - Only these are valid):
| Type | Description | Example |
|------|-------------|---------|
| \`string\` | Text input | \`{ "type": "string", "default": "Hello" }\` |
| \`number\` | Numeric input | \`{ "type": "number", "default": 0 }\` |
| \`boolean\` | Toggle | \`{ "type": "boolean", "default": false }\` |
| \`select\` | Dropdown | \`{ "type": "select", "options": ["a", "b"], "default": "a" }\` |
| \`link\` | URL with target | \`{ "type": "link", "default": { "href": "/", "target": "_blank" } }\` |
| \`file\` | File upload | \`{ "type": "file", "accept": "image/*", "default": "" }\` |
| \`rich-text\` | HTML content | \`{ "type": "rich-text", "default": "" }\` |

**CRITICAL: There is NO \`"image"\` type!** For images, use \`file\` with accept pattern:
\`\`\`json
// CORRECT
"avatar": { "type": "file", "accept": "image/*", "default": "" }

// WRONG - "image" is not a valid type
"avatar": { "type": "image", "default": "" }
\`\`\`

### Template Variables ({{...}})
- \`{{propName}}\` - Component props from interface (used in component structure)
- \`{{item.field}}\` - CMS list context (default), or custom name via \`itemAs\`
- \`{{itemIndex}}\`, \`{{itemFirst}}\`, \`{{itemLast}}\` - CMS list loop helpers
- \`{{cms.field}}\` - CMS template pages only (pages in pages/templates/)

### Using Props in Structure:
- Text interpolation: \`"children": "{{propName}}"\`
- Conditional styles with _mapping:
\`\`\`json
"fontSize": {
  "_mapping": true,
  "prop": "size",
  "values": { "small": "14px", "medium": "16px", "large": "20px" }
}
\`\`\`

### Style Mappings (Prop-Based)
Use \`_mapping\` to vary styles based on component props:
\`\`\`json
"backgroundColor": {
  "_mapping": true,
  "prop": "variant",
  "values": { "primary": "var(--primary)", "secondary": "var(--secondary)" }
}
\`\`\`

### Text Content: HTML Nodes vs Component Props

**HTML nodes** - Use \`children\` for text (there is NO \`text\` property on nodes):
\`\`\`json
{ "type": "node", "tag": "span", "children": "Hello World" }
\`\`\`

**Components WITH a slot** - Can receive \`children\`:
\`\`\`json
// Component has { "type": "slot" } in structure, so children work:
{ "type": "component", "component": "Card", "children": [...] }
\`\`\`

**Components WITHOUT a slot** - Use their defined props:
\`\`\`json
// Button has "text" prop but NO slot, so use props:
{ "type": "component", "component": "Button", "props": { "text": "Click me" } }
\`\`\`

**Rule**: Check if a component has a \`slot\` in its structure. If yes, use \`children\`. If no, use the props from its interface.

### Finding Available Components

**IMPORTANT**: Components vary by project. Never assume a component exists.

Before using any component:
1. Use \`get_available_sections\` tool to list all available components
2. Use \`get_component_info(componentName)\` to see its props and structure

If a component doesn't exist, offer to create it or suggest an alternative.