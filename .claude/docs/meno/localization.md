## Locale List (Language Switcher)

Displays links to switch between locales. Renders based on project's configured locales.

\`\`\`json
{
  "type": "locale-list",
  "displayType": "nativeName",
  "showFlag": true,
  "showCurrent": false,
  "style": { "base": { "display": "flex", "gap": "8px" } }
}
\`\`\`

**Properties**:
- \`displayType\`: \`"code"\` | \`"name"\` | \`"nativeName"\` (default: \`"code"\`)
- \`showFlag\`: Show flag emoji (default: true)
- \`showCurrent\`: Include current locale (default: true)
- \`showSeparator\`: Show separators (default: true)
- \`style\`, \`itemStyle\`, \`activeItemStyle\`, \`separatorStyle\`, \`flagStyle\`