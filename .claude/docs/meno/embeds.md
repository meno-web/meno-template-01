## Embed Node

Inject raw HTML/SVG content (bypasses escaping). Wrapped in a div.

\`\`\`json
{
  "type": "embed",
  "html": "<svg>...</svg>",
  "style": { "base": { "width": "100%" } }
}
\`\`\`

**Properties**: \`html\` (required), \`style\`, \`attributes\`, \`label\`

Use for: SVG icons, third-party widgets, custom HTML snippets.