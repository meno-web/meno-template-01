## List Node

Use list nodes to iterate over data from component props OR CMS collections:

### Prop-based List (default)
Renders children for each item in a component prop array:
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

### CMS Collection List
Query items from a CMS collection:
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

### List Properties
- \`sourceType\` - "prop" (default) or "collection"
- \`source\` (required) - Prop name or collection name
- \`itemAs\` (optional) - Variable name for templates (default: "item" for prop, singularized collection name for collection)
- \`tag\` (optional) - Container element (default: "div")
- \`limit\` (optional) - Maximum items to show
- \`offset\` (optional) - Skip first N items

### Collection-only Options
- \`items\` - Specific item IDs or template like "{{post.relatedIds}}"
- \`filter\` - Filter criteria { field, operator, value }
- \`sort\` - Sort order { field, order: "asc"|"desc" }
- \`excludeCurrentItem\` - Exclude current CMS item (for "related items" sections)
- \`emitTemplate\` - Emit template for client-side dynamic rendering

### Template Variables
- \`{{item.field}}\` - Access item fields (or custom name via \`itemAs\`)
- \`{{itemIndex}}\` - Current item index (0-based)
- \`{{itemFirst}}\` - Boolean, true for first item
- \`{{itemLast}}\` - Boolean, true for last item

### Adding Data Attributes for Filtering

Add \`data-{field}\` attributes to list items for client-side filtering with MenoFilter:

\`\`\`json
{
  "type": "list",
  "sourceType": "collection",
  "source": "posts",
  "children": [
    {
      "type": "node",
      "tag": "div",
      "attributes": {
        "data-category": "{{item.category}}",
        "data-featured": "{{item.featured}}"
      },
      "children": [
        { "type": "node", "tag": "h3", "children": "{{item.title}}" }
      ]
    }
  ]
}
\`\`\`

### List vs CMS Template Pages
- **List node**: Loops through items inline (blog listing showing all posts)
- **CMS Template Pages** (\`pages/templates/\`): Generates one page per CMS item (individual blog post pages)