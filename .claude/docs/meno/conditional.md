## Conditional Rendering (if property)

All node types support \`if\` for conditional rendering. When false, the node and children are completely skipped (not added to DOM).

\`\`\`json
// Boolean
{ "type": "node", "tag": "div", "if": false, "children": "Hidden" }

// From component prop
{
  "type": "node",
  "if": { "_mapping": true, "prop": "showBanner", "values": { "true": true, "false": false } },
  "children": "Banner"
}

// From CMS/item context
{ "type": "node", "if": "{{showPromo}}", "children": "Promo" }
\`\`\`

**Behavior:**
- \`if\` absent → renders (default true)
- \`if: true\` → renders
- \`if: false\` → skipped entirely
- \`if\` with \`_mapping\` → resolved from component props
- \`if\` with template → resolved from context

**Works with:** node, component, link, embed, locale-list, cms-list