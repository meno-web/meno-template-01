## Interactive Styles

Elements can have \`interactiveStyles\` for CSS pseudo-selectors and JS-triggered states. This replaces the need for custom CSS files in 99% of cases.

### Structure
\`\`\`json
{
  "type": "node",
  "tag": "button",
  "interactiveStyles": [
    {
      "prefix": "",
      "postfix": ":hover",
      "style": {
        "base": { "backgroundColor": "var(--primary-dark)" }
      }
    }
  ]
}
\`\`\`

### How prefix/postfix Work

CSS generated: \`{prefix}.element-class{postfix}\`

- \`postfix\`: Goes AFTER element class - for self-states, pseudo-selectors, and child selectors
- \`prefix\`: Goes BEFORE element class - for ancestor context (e.g., dark mode)
- \`style\`: CSS properties (supports breakpoints: base/tablet/mobile)

### Common Patterns

| Use Case | prefix | postfix | Generated CSS |
|----------|--------|---------|---------------|
| Hover | "" | ":hover" | \`.el:hover\` |
| Focus | "" | ":focus" | \`.el:focus\` |
| Active | "" | ":active" | \`.el:active\` |
| Self has .is-open | "" | ".is-open" | \`.el.is-open\` |
| Target child when open | "" | ".is-open [data-el='menu']" | \`.el.is-open [data-el='menu']\` |
| Ancestor has .dark | ".dark " | "" | \`.dark .el\` |

### Targeting Child Elements

Add \`data-el\` attributes to children, then use postfix with attribute selector:

\`\`\`json
{
  "type": "node",
  "tag": "div",
  "interactiveStyles": [
    {
      "postfix": ".is-open [data-el='menu']",
      "style": {
        "base": { "opacity": "1", "visibility": "visible" },
        "tablet": {},
        "mobile": {}
      }
    }
  ],
  "children": [
    {
      "type": "node",
      "tag": "ul",
      "attributes": { "data-el": "menu" },
      "style": { "base": { "opacity": "0", "visibility": "hidden" } }
    }
  ]
}
\`\`\`

JS toggles \`.is-open\` on parent -> child menu becomes visible.

### JS + Interactive Styles Pattern

1. Define \`data-el\` attributes on elements you need to target
2. JS toggles a state class (e.g., \`.is-open\`) on the component root
3. \`interactiveStyles\` picks up the state and applies styles

\`\`\`javascript
// JS toggles state class
el.classList.add('is-open');
el.classList.remove('is-open');
\`\`\`

### Complete Example: Dropdown Component

\`\`\`json
{
  "component": {
    "interface": {
      "label": { "type": "string", "default": "Menu" }
    },
    "structure": {
      "type": "node",
      "tag": "div",
      "children": [
        {
          "type": "node",
          "tag": "button",
          "attributes": { "data-el": "trigger" },
          "children": ["{{label}}"]
        },
        {
          "type": "node",
          "tag": "ul",
          "attributes": { "data-el": "menu" },
          "style": { "base": { "display": "none" } },
          "children": [{ "type": "slot" }]
        }
      ],
      "interactiveStyles": [
        {
          "postfix": ".is-open [data-el='menu']",
          "style": { "base": { "display": "block" } }
        }
      ]
    }
  }
}
\`\`\`

\`\`\`javascript
// Dropdown.js
const trigger = el.querySelector('[data-el="trigger"]');

trigger?.addEventListener('click', () => {
  el.classList.toggle('is-open');
});

// Close when clicking outside
document.addEventListener('click', (e) => {
  if (!el.contains(e.target)) {
    el.classList.remove('is-open');
  }
});
\`\`\`

### Responsive Breakpoints

Styles support three breakpoints:
- \`base\`: Desktop and up (default)
- \`tablet\`: Tablet width and below
- \`mobile\`: Mobile width only

\`\`\`json
"style": {
  "base": { "fontSize": "18px", "padding": "24px" },
  "tablet": { "fontSize": "16px", "padding": "16px" },
  "mobile": { "fontSize": "14px", "padding": "12px" }
}
\`\`\`

### Colors

Always use CSS variables from colors.json:
- \`var(--primary)\` - Primary brand color
- \`var(--secondary)\` - Secondary color
- \`var(--text)\` - Text color
- \`var(--background)\` - Background color
- \`var(--muted)\` - Muted text

Read colors.json to see all available colors in the project.