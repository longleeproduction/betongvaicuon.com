# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static HTML/CSS/JavaScript website for a Vietnamese concrete product company (Bê Tông Vải Cuộn - Geotextile Concrete Canvas). This is a marketing/lead generation site with no build tools or frameworks.

## Development

**No build process required** - edit `index.html` directly and open in browser to test.

To preview locally:
```bash
# Using Python
python3 -m http.server 8000

# Using Node.js (if available)
npx serve
```

## Architecture

**Monolithic single-file structure**: All HTML, CSS, and JavaScript are embedded in `index.html` (36KB).

```
index.html     # Complete website (HTML + embedded CSS + embedded JS)
images/        # Static assets
└── logo.jpg   # Company logo
```

### CSS Architecture
- CSS custom properties for theming defined at `:root`
- Mobile-first responsive design with breakpoints at 768px (tablet) and 414px (mobile)
- Uses CSS Grid and Flexbox for layouts
- CSS animations for visual effects (slideInLeft, rotate, float)

### JavaScript
- Vanilla JS with no dependencies
- Handles smooth scroll navigation, form submission, and scroll-triggered fade-in animations
- Initialized on DOMContentLoaded

### Design System

Primary colors:
- `--primary-color: #1e40af` (Blue)
- `--secondary-color: #059669` (Green)
- `--accent-color: #f59e0b` (Amber)

Consistent border-radius values: 8px, 10px, 20px

## Key Conventions

- Semantic HTML5 sections with id-based anchor navigation
- BEM-like CSS class naming (e.g., `hero-content`, `feature-card`, `contact-form`)
- Responsive images and SVG graphics embedded inline
- Vietnamese language content throughout
