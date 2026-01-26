# KI Norge Project Guidelines

## CRITICAL: Designsystemet (DS) Usage

**This is a Norwegian public sector website. Accessibility is mandatory, not optional.**

### Non-Negotiable Rules

1. **ALWAYS use Designsystemet React components** from `@digdir/designsystemet-react`
   - Do NOT use raw HTML elements for interactive components
   - Do NOT create custom components when DS equivalents exist
   - The accessibility magic happens in the React components, not just the CSS

2. **Before implementing ANY interactive element:**
   - Check if Designsystemet has a component for it
   - Reference context7 (Designsystemet documentation) for latest API and components
   - Use the DS component API exactly as documented

3. **Typography must use DS components:**
   - Use `<Heading>` not `<h1>`, `<h2>`, etc.
   - Use `<Paragraph>` not `<p>`
   - Use `<Label>` for form labels
   - Use `<Link>` for links with proper semantics

4. **Interactive elements must use DS components:**
   - `<Button>` for buttons (with proper variants: primary, secondary, tertiary)
   - `<TextField>` and `<Textarea>` for inputs
   - `<Accordion>` for expandable sections (e.g., FAQ)
   - `<Select>`, `<Combobox>`, `<Checkbox>`, `<Radio>` for form controls
   - `<Tabs>` for tabbed interfaces
   - `<Modal>`, `<Alert>`, `<Tooltip>` for overlays

### Why This Matters

Designsystemet includes:
- ✅ WCAG 2.1 AA compliance
- ✅ Proper ARIA attributes
- ✅ Keyboard navigation
- ✅ Screen reader support
- ✅ Focus management
- ✅ Color contrast
- ✅ Responsive behavior
- ✅ Norwegian language support

Using raw HTML loses ALL of these benefits.

### Reference Documentation

Always check context7 for:
- Component availability
- Props and API
- Accessibility features
- Usage examples
- Best practices

### Component Mapping

| Need | Use DS Component | NOT |
|------|------------------|-----|
| Button | `<Button>` | `<button>`, `<a>` styled as button |
| Heading | `<Heading level={1-6}>` | `<h1>`, `<h2>`, etc. |
| Text | `<Paragraph>` | `<p>` |
| Link | `<Link>` | `<a>` |
| Input | `<TextField>` | `<input>` |
| Textarea | `<Textarea>` | `<textarea>` |
| Select | `<Select>` | `<select>` |
| Checkbox | `<Checkbox>` | `<input type="checkbox">` |
| Radio | `<Radio>` | `<input type="radio">` |
| Accordion/FAQ | `<Accordion>` | `<details>` |
| Tabs | `<Tabs>` | Custom tab implementation |
| Modal | `<Modal>` | Custom modal |
| Alert | `<Alert>` | Custom alert |

### Exception Cases

Only use raw HTML when:
- DS genuinely doesn't have a component for it
- It's purely presentational (e.g., `<div>`, `<span>`)
- You've verified in context7 that no DS component exists

Even then, ensure proper accessibility with:
- Semantic HTML
- ARIA attributes
- Keyboard support
- Focus management

---

## General Guidelines

- Keep components in their own files
- Use TypeScript strict mode
- Follow Astro best practices for SSG
- Optimize for performance (lazy loading, code splitting)
- Mobile-first responsive design

## Strapi Integration

- All content should be manageable through Strapi CMS
- Use the Strapi API client in `src/lib/strapi.ts`
- Dynamic routes should use `getStaticPaths()` with Strapi data
- Placeholder data in `src/lib/data.ts` is temporary until Strapi is connected

## Code Style

- Use functional components
- Prefer Astro components over React when possible (better performance)
- Use React components (DS) only for interactive elements
- Keep styling in component files using `<style>` blocks
- Use DS design tokens (`--ds-color-*`, `--ds-size-*`, etc.)

---

**Remember: This is a public sector site. Accessibility is not optional. Always use Designsystemet.**
