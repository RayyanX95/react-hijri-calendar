# PLAN.md

## Next Steps for Making the Calendar Component Pluggable and NPM-Ready

1. **Component API Review & Improvements** -> DONE
   - Ensure all props are well-typed and documented.
   - Allow customization via props (e.g., custom renderers, styles, locale, etc.).
   - Expose useful subcomponents/types if needed.
   - Make locales without using any packages, just list of labels of `en` and `ar` that render depending on `lang` prop

2. **Styling & Theming** --> DONE
   - Support style overrides via props or context.
   - Document how to customize appearance.

3. **Internationalization (i18n)**
   - Make sure i18n is optional and document how to provide translations.
   - Allow consumers to pass their own translation function or strings.

4. **Build & Packaging**
   - Set up a build process (e.g., using Rollup or Vite) to output CommonJS, ESM, and type declarations.
   - Ensure only necessary files are published (add `files` field in `package.json`).
   - Add `peerDependencies` for React and any other required libraries.

5. **Documentation**
   - Write a comprehensive README with usage, props, examples, and customization instructions.
   - Add code examples for common use cases.

6. **Testing**
   - Add unit and integration tests for the component.
   - Ensure the component works in both English and Arabic (RTL/LTR).

7. **Demo & Storybook**
   - Optionally, set up Storybook or a demo app for live documentation and testing.

8. **NPM Publishing**
   - Prepare for npm publish: check `package.json` fields, add keywords, author, license, etc.
   - Test the package locally using `npm link` or similar.
   - Publish to npm.

9. **Continuous Integration (Optional)**
   - Set up CI for linting, testing, and publishing.

10. **Accessibility (a11y)**

- Ensure the calendar is accessible:
  - Add appropriate ARIA roles and attributes.
  - Support full keyboard navigation (tab, arrow keys, enter, escape, etc.).
  - Test with screen readers.
  - Document accessibility features and usage in the README.

---

_This plan will help you turn your calendar into a reusable, pluggable npm package._
