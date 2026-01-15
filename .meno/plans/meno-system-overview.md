# Meno System Overview & Key Learnings

## Project Structure
- **./pages/** - Page JSON files (index.json maps to /)
- **./components/** - Component definitions (Name.json + optional Name.js, Name.css)
- **./images/** - Static assets
- **colors.json** - CSS variable definitions
- **project.config.json** - Project settings (breakpoints, fonts, i18n)
- **./dist/** - Compiled static HTML output (vanilla JS, no React/frameworks)

## Component System

### File Format: Component.json + Component.js
Every component has a JSON structure file and optionally a vanilla JavaScript file.

**Critical JSON Structure:**
```json
{
  "component": {
    "structure": { /* DOM tree definition */ },
    "interface": { /* Props definition */ }
  }
}
```

### DOM Structure Types
- `{ "type": "node", "tag": "div", "style": {...}, "children": [...] }` - HTML elements
- `{ "type": "component", "component": "Name", "props": {...} }` - Nested components
- `{ "type": "slot" }` - Child slot (like React.children) - **ONLY ONE SLOT PER COMPONENT**
- `{ "type": "embed", "html": "<svg>...</svg>" }` - Raw HTML (SVGs only)
- `{ "type": "cms-list", "collection": "posts", "itemAs": "post", "children": [...] }` - CMS iteration

### Style System
**ALL styles MUST have three breakpoints:**
```json
"style": {
  "base": { "padding": "24px", "color": "var(--text)" },
  "tablet": { "padding": "16px" },
  "mobile": { "padding": "12px" }
}
```

### Interactive Styles (Pseudo-selectors)
Use `interactiveStyles` for :hover, :focus, :active, etc. - **No custom CSS files needed 99% of the time:**
```json
"interactiveStyles": [
  {
    "prefix": "",
    "postfix": ":hover",
    "style": { "base": { "backgroundColor": "var(--primary-dark)" }, "tablet": {}, "mobile": {} }
  }
]
```

### Prop Mapping (Conditional Styles)
Vary styles based on component props:
```json
"backgroundColor": {
  "_mapping": true,
  "prop": "variant",
  "values": { "primary": "#0070f3", "secondary": "#666" }
}
```

## JavaScript in Components

### CRITICAL: No Element Context in Scripts
Component JS files run in **global scope**, NOT component-scoped. The `element` variable is NOT available.

**WRONG:**
```javascript
const btn = element.querySelector('.button'); // ❌ element is undefined
```

**RIGHT:**
```javascript
document.addEventListener('DOMContentLoaded', function() {
  const btn = document.querySelector('.button'); // ✅ Use document
  if (btn) {
    btn.addEventListener('click', () => { /* ... */ });
  }
});
```

### Vanilla JavaScript Only
- No React, no hooks, no JSX
- Use standard DOM APIs: querySelector, addEventListener, classList
- All scripts must be vanilla ES6 JavaScript

### Component Communication
For cross-component interaction (e.g., Button → Modal):
1. Use `document.querySelector()` to find target element
2. Dispatch custom events using `CustomEvent`
3. Listen for events with `addEventListener()`

**Example:**
```javascript
// Component A (PromoPlay)
document.addEventListener('DOMContentLoaded', function() {
  const playBtn = document.querySelector('.c_promoplay_wrap');
  const modal = document.querySelector('[data-component="Modal"]');
  
  if (playBtn && modal) {
    playBtn.addEventListener('click', () => {
      modal.dispatchEvent(new CustomEvent('open-modal', {
        detail: { url: 'https://...' },
        bubbles: true
      }));
    });
  }
});

// Component B (Modal)
document.addEventListener('DOMContentLoaded', function() {
  const modal = document.querySelector('[data-component="Modal"]');
  if (modal) {
    modal.addEventListener('open-modal', (event) => {
      modal.classList.add('is-open');
    });
  }
});
```

## Build System

### Build Command
```bash
npm run build
```
Generates static HTML in ./dist/ with:
- Compiled component JS at bottom of page (not in <head>)
- Utility class CSS generation
- Image optimization (webp, avif)
- Multi-language support (i18n)

### Script Execution Order
All component scripts run at page bottom after DOM is loaded. Use `DOMContentLoaded` or `setTimeout()` to ensure DOM elements exist.

## CSS & Styling

### CSS Variables (colors.json)
Accessed as: `var(--primary)`, `var(--text)`, `var(--bg)`, etc.

### Utility Classes
Simple styles are converted to utility classes during build:
- `.p-24px` = padding: 24px
- `.bgc-bg` = background-color: var(--bg)
- Responsive: `.t-p-16px` (tablet), `.mob-p-12px` (mobile)

### Complex Styles
Remain as inline styles:
- rgba() functions
- calc() functions
- Complex selectors

## Props & Interface

### Supported Prop Types
```json
"interface": {
  "text": { "type": "string", "default": "Default text" },
  "isActive": { "type": "boolean", "default": false },
  "size": { "type": "select", "options": ["small", "medium", "large"] },
  "url": { "type": "link" },
  "img": { "type": "image" },
  "bio": { "type": "richtext" }
}
```

### Text Interpolation in Structure
Use double braces for dynamic content:
- `"text": "{{propName}}"` - String interpolation
- CMS item access: `"text": "{{post.title}}"` (in cms-list)

## Common Patterns

### Modal with Custom Event
✅ **Working Pattern:**
1. Modal listens for custom event in DOMContentLoaded
2. Other component dispatches event via document.querySelector
3. Modal adds/removes class for visibility

### Button Click Handlers
Always wrap in DOMContentLoaded:
```javascript
document.addEventListener('DOMContentLoaded', function() {
  const button = document.querySelector('.c_mycomponent_button');
  if (button) {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      // Handle click
    });
  }
});
```

## JSON Validation Critical
- Use standard quotes only (not smart quotes)
- No trailing commas in objects/arrays
- All strings must have matching quotes
- Common issue: copy-paste from Word/Docs introduces smart quotes

## Breakpoint Values (project.config.json)
- **Base:** 0px and up
- **Tablet:** 1024px and up
- **Mobile:** 540px and up

## File Naming Conventions
- Component names: PascalCase (Button.json, Modal.json)
- CSS classes auto-generated: `.c_{componentname}_{nodename}`
- Example: `.c_promoplay_wrap`, `.c_modal_modal`

## Debugging Tips
1. Check compiled /dist/index.html - look for script errors in browser console
2. Use `document.querySelector()` to verify elements exist before attaching listeners
3. Wrap all DOM access in `DOMContentLoaded` listener
4. Use `console.log()` to debug - output appears in browser console
5. Check CSS classes with browser DevTools Inspector

## Known Issues & Solutions

### Problem: "element is not defined"
**Cause:** Trying to use `element` variable in component JS
**Solution:** Use `document.querySelector()` instead, wrap in `DOMContentLoaded`

### Problem: Event listeners not firing
**Cause:** DOM not ready when script runs
**Solution:** Wrap initialization in `document.addEventListener('DOMContentLoaded', ...)`

### Problem: Modal not opening
**Cause:** Event dispatcher finding wrong element or listener not attached
**Solution:** Verify both elements exist with `console.log()`, check data attributes match

### Problem: Styles not applying
**Cause:** Missing breakpoint object (base/tablet/mobile)
**Solution:** Always include all three breakpoint levels in style objects

### Problem: Children not rendering
**Cause:** Defined `children` in interface AND passing child nodes
**Solution:** Use different prop name like `content` or `text` for props, keep slot for children
