# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static HTML/CSS/JavaScript website for a Vietnamese concrete product company (Bê Tông Vải Cuộn - Geotextile Concrete Canvas). This is a marketing/lead generation site with no build tools or frameworks.

## Development

**No build process required** - edit the HTML/CSS/JS files directly and reload in the browser to test.

To preview locally:
```bash
# Using Python
python3 -m http.server 8000

# Using Node.js (if available)
npx serve
```

## Architecture

**Single page, split assets**: one `index.html` (markup only) plus one CSS file and one JS file per section/feature. No bundler - files are linked directly and load in source order.

```
index.html              # Markup only (head, sections, footer, lightbox)
css/                    # One file per section, linked in cascade order
├── base.css            # Reset, :root variables, container
├── header.css          # Header, nav, hamburger, mobile menu
├── hero.css            # Hero slider, main CTA button
├── features.css
├── applications.css    # "Lĩnh Vực Ứng Dụng" tabs
├── catalogue.css       # Product cards, filters
├── gallery.css
├── lightbox.css        # Image/video viewer
├── clients.css
├── pricing.css
├── contact-footer.css
├── responsive.css      # Shared 768px / 414px overrides
└── floating-buttons.css
js/                     # Loaded in order at end of <body>
├── analytics.js        # Defines trackEvent() - must load first
├── contact-form.js
├── scroll-animations.js
├── header.js
├── hero-slider.js
├── catalogue.js        # Defines toggleDetails() used by inline onclick
├── lightbox.js         # Media viewer, exposes window.mediaViewer.open()
├── gallery-albums.js   # Album covers/counts, opens viewer; empty albums auto-hide
└── tabs.js
images/, resources/     # Logo, photos, videos
```

**Load order matters.** CSS files override each other in link order (`responsive.css` and `floating-buttons.css` come last on purpose). JS files are plain scripts sharing one global scope: `analytics.js` must stay first because later files call `trackEvent()`, and top-level `const`/`let` names must stay unique across files.

### CSS Architecture
- CSS custom properties for theming defined at `:root` in `css/base.css`
- Mobile-first responsive design with breakpoints at 768px (tablet) and 414px (mobile)
- Section-specific media queries live in that section's file; shared ones in `responsive.css`
- Uses CSS Grid and Flexbox for layouts
- CSS animations for visual effects (slideInLeft, rotate, float, fadeInUp)

### JavaScript
- Vanilla JS with no dependencies, no modules
- Handles smooth scroll navigation, form submission, sliders, tabs, the media lightbox, and scroll-triggered fade-in animations

### Design System

White theme with neutral (near-black) text; color is reserved for accents.

Primary colors:
- `--primary-color: #111827` (Near-black - headings, dark gradients)
- `--secondary-color: #059669` (Green - prices, checkmarks)
- `--accent-color: #f59e0b` (Amber - CTAs, premium tier)

Consistent border-radius values: 8px, 10px, 20px

## Key Conventions

- Semantic HTML5 sections with id-based anchor navigation
- BEM-like CSS class naming (e.g., `hero-content`, `feature-card`, `contact-form`)
- Responsive images and SVG graphics embedded inline
- Vietnamese language content throughout
