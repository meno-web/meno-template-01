## CMS Schema Definition

Meno has a built-in CMS for managing dynamic content. Collection names are user-defined based on content type.

### CMS File Structure
\`\`\`
project/
├── pages/templates/         # CMS template pages (one per collection)
│   └── {collection}.json    # e.g., posts.json, products.json, team.json
└── cms/                     # CMS item data
    └── {collection}/        # Folder matches collection ID
        └── {item}.json      # One JSON file per item
\`\`\`

### Defining a CMS Collection
Create a template page at \`pages/templates/{collection}.json\`. Add \`source: "cms"\` and a \`cms\` schema INSIDE \`meta\`:

**CRITICAL: The \`cms\` object MUST be inside \`meta\`, not at root level!**

\`\`\`json
{
  "root": {
    "type": "node",
    "tag": "article",
    "children": [
      {
        "type": "component",
        "component": "Heading",
        "props": { "text": "{{cms.title}}" }
      },
      {
        "type": "node",
        "tag": "div",
        "children": "{{cms.content}}"
      }
    ]
  },
  "meta": {
    "title": "{{cms.title}}",
    "source": "cms",
    "cms": {
      "id": "posts",
      "name": "Blog Posts",
      "slugField": "slug",
      "urlPattern": "/posts/{{slug}}",
      "fields": {
        "title": { "type": "string", "label": "Title", "required": true },
        "slug": { "type": "string", "label": "URL Slug", "required": true },
        "excerpt": { "type": "text", "label": "Excerpt" },
        "content": { "type": "rich-text", "label": "Content" },
        "author": { "type": "reference", "label": "Author", "collection": "team" },
        "featured": { "type": "boolean", "label": "Featured", "default": false }
      }
    }
  }
}
\`\`\`

**Schema properties:**
- \`id\` - Collection identifier (folder name, API routes)
- \`name\` - Display name in editor
- \`slugField\` - Field used for URL slugs
- \`urlPattern\` - URL template, e.g., \`/posts/{{slug}}\` -> \`/posts/my-article\`
- \`fields\` - Field definitions with type, label, required, default, options

### CMS Field Types

| Type | Description | Options |
|------|-------------|---------|
| \`string\` | Single line text | - |
| \`text\` | Multi-line textarea | - |
| \`rich-text\` | HTML rich text editor | - |
| \`number\` | Numeric value | - |
| \`boolean\` | True/false toggle | \`default\` |
| \`image\` | Image file path | - |
| \`file\` | Any file upload | \`accept: "application/pdf"\` |
| \`date\` | Date/datetime picker | - |
| \`select\` | Dropdown selection | \`options: ["a", "b"]\`, \`multiple: true\` |
| \`reference\` | Link to another collection | \`collection: "team"\` |
| \`i18n\` | Internationalized string | - |
| \`i18n-text\` | Internationalized text | - |

### CMS Item Auto-Generated Fields
Each CMS item automatically gets:
- \`_id\` - Unique identifier
- \`_filename\` - Stable file identifier (never changes)
- \`_createdAt\` - Creation timestamp
- \`_updatedAt\` - Last update timestamp

### Reference Fields
Link collections using \`type: "reference"\` with a \`collection\` option:

\`\`\`json
"author": { "type": "reference", "label": "Author", "collection": "team" }
\`\`\`

Access referenced item fields with dot notation:
- In CMS List: \`{{post.author.name}}\`
- In Template Page: \`{{cms.author.name}}\`

### Common Collection Examples
- Blog: \`/posts/{{slug}}\` -> \`/posts/my-first-article\`
- Products: \`/products/{{slug}}\` -> \`/products/premium-widget\`
- Team: \`/team/{{slug}}\` -> \`/team/jane-smith\`
- Case Studies: \`/work/{{slug}}\` -> \`/work/client-redesign\`