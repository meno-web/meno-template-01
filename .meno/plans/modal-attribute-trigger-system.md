# Modal Attribute Trigger System Implementation

## Summary
Update the Modal component system to allow opening modals via HTML attributes instead of requiring custom JavaScript in trigger components. Any element on the page can trigger a modal by adding `open-modal="modalId"` attribute. The Modal.js will handle all event listener setup, eliminating the need for JS in components like PromoPlay.

## Current State
- **Modal.js**: Listens for custom events `open-modal` and `open-modal-{modalId}` (event-driven)
- **PromoPlay.js**: Dispatches `open-modal-video-modal` custom event when clicked
- **Limitations**: Each trigger component needs custom JS to dispatch events

## Desired State
- Any element can have `open-modal="modalId"` attribute
- Modal.js automatically finds and listens to all elements with this attribute
- Trigger components (PromoPlay, Button, etc.) need NO JS for modal triggering
- Multiple buttons can trigger the same modal
- Modal.js is the ONLY component with modal-related JS logic

## Implementation Plan

### 1. Update Modal.js
**File**: `./components/Modal.js`

**Changes**:
- Keep existing custom event listeners (for backward compatibility)
- Add new global listener logic:
  - Select all elements with `open-modal` attribute on page load
  - For each trigger element, add click listener
  - When clicked, dispatch appropriate custom event to the target modal
  - Handle multiple modals with different IDs
  
**Key Implementation Details**:
```javascript
// Keep existing event listeners on the modal itself
// Add: Find all [open-modal="modalId"] elements and attach click handlers
// When clicked: dispatch the ID-specific event to this modal
// Benefits: Works with multiple buttons targeting same modal
//          Automatically updates if DOM is modified
//          No race conditions (listens for open-modal attribute matching our ID)
```

**Algorithm**:
1. Get the modalId from `props.modalId`
2. Find all elements matching `[open-modal="{modalId}"]`
3. For each trigger:
   - Add click listener that dispatches `open-modal-{modalId}` on the modal
   - Event should have `bubbles: true`
4. Keep existing close button and backdrop click handlers

### 2. Update PromoPlay.js
**File**: `./components/PromoPlay.js`

**Changes**:
- Remove all custom event dispatching logic
- Keep component structure and styling
- Add `open-modal="video-modal"` attribute to the clickable wrapper
- No more CustomEvent creation or modal finding logic

**New Code**:
```javascript
// PromoPlay.js - Simplified with defineVars: true
// Modal triggering is now handled by data-modal-trigger attribute and Modal.js
// Just add a style/animation handler if needed, but JS is minimal
```

### 3. Update PromoPlay.json (Component Structure)
**File**: `./components/PromoPlay.json`

**Changes**:
- Add `open-modal="video-modal"` attribute to the main wrapper div
- Ensure the wrapper has proper cursor and interactivity styles

**Change**:
```json
{
  "type": "node",
  "tag": "div",
  "attributes": {
    "open-modal": "video-modal"
  },
  "style": { ... }
}
```

### 4. Update pages/index.json (Button Usage Example)
**File**: `./pages/index.json`

**Changes**:
- The "Watch Demo" button should also be able to trigger the modal
- Can add `open-modal="video-modal"` attribute directly to Button component if component supports arbitrary attributes
- Otherwise, wrap in a node with the attribute

**Implementation Option A** (if Button supports arbitrary attributes):
```json
{
  "type": "component",
  "component": "Button",
  "props": {
    "text": "Watch Demo",
    "variant": "secondary",
    "attributes": { "open-modal": "video-modal" }
  }
}
```

**Implementation Option B** (if Button doesn't support arbitrary attributes):
```json
{
  "type": "node",
  "tag": "div",
  "attributes": { "open-modal": "video-modal" },
  "style": { "base": { "cursor": "pointer" } },
  "children": [
    {
      "type": "component",
      "component": "Button",
      "props": { "text": "Watch Demo", "variant": "secondary" }
    }
  ]
}
```

## Files to Modify
1. **Modal.js** - Add attribute-based trigger listening (main logic)
2. **Modal.json** - (No changes needed, structure stays same)
3. **PromoPlay.js** - Remove all event dispatching logic, keep styling
4. **PromoPlay.json** - Add `open-modal="video-modal"` attribute to wrapper
5. **pages/index.json** - Add `open-modal="video-modal"` to "Watch Demo" button (optional example)

## Benefits
✅ **Zero JS in trigger components** - PromoPlay has no modal logic
✅ **Declarative** - Attributes clearly show modal triggers in JSON
✅ **Scalable** - Add multiple triggers with same attribute, all work automatically
✅ **Maintainable** - All modal JS logic in one place (Modal.js)
✅ **Backward compatible** - Existing custom event system still works if used elsewhere
✅ **No race conditions** - Modal listens for attribute-matched triggers

## Potential Risks & Considerations
1. **Event timing**: Modal.js needs to run after DOM is ready. The `defineVars: true` pattern handles this ✅
2. **Multiple modals**: Each modal finds only triggers with its matching ID via attribute selector ✅
3. **Event bubbling**: Use `bubbles: true` to ensure events propagate correctly ✅
4. **Dynamic content**: If triggers are added after page load, they won't have listeners. **Mitigation**: Use event delegation pattern (listen on document level) or note as limitation
5. **Button component attributes**: Check if Button.json supports arbitrary attributes like `attributes` in props

## Event Flow (After Implementation)
```
User clicks element with [open-modal="video-modal"]
  ↓
Modal.js click handler fires (attached in Modal component setup)
  ↓
Dispatches CustomEvent 'open-modal-video-modal' to Modal element
  ↓
Modal's event listener catches it
  ↓
Adds 'is-open' class to modal
  ↓
CSS transition shows modal (visibility: visible, opacity: 1)
```

## Testing Checklist
- [ ] Single button triggers modal
- [ ] Multiple buttons trigger same modal
- [ ] Multiple modals on same page work independently
- [ ] Close button still works
- [ ] Backdrop click still closes modal
- [ ] Works in both editor (port 3000) and static build (port 8080)
- [ ] No console errors from defineVars pattern

## Step-by-Step Implementation
1. Update Modal.js with attribute-based trigger listeners
2. Simplify PromoPlay.js to remove event logic
3. Add `open-modal` attribute to PromoPlay.json
4. Test on index page
5. Update pages/index.json to add attribute to "Watch Demo" button example
6. Run full page tests to verify both buttons open video modal

---

## Questions/Clarifications Needed
- Does Button component support arbitrary HTML attributes? (Needed for step 4 of pages/index.json)
- Should we support dynamic content (triggers added after page load)? Current plan is page-load-time binding only.