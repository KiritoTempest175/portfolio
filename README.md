# Muhammad Huzaifa Zaman — React Portfolio

Complete React + Vite source for the latest name-first, dark-only portfolio.

## Run locally

Install Node.js 22.12+ (Node 24 LTS is also suitable). Open a terminal inside this folder:

```bash
npm ci
npm run dev
```

Open the local URL printed by Vite. First install needs internet. No API key or backend is required.

## Build / preview

```bash
npm run build
npm run preview
```

The production site is generated in `dist/`. Upload that folder to any static website host. `base: './'` supports subfolder hosting. This is a single-page site with hash navigation, so no SPA route rewrites are required. Do not double-click `index.html`; use the development or preview server.

## Edit the portfolio

- `src/components/Hero.jsx`: name, professional title, tagline, intro, availability.
- `src/components/About.jsx`: biography, project counts, education summary.
- `src/data/projects.js`: all seven projects, technologies, links and guide descriptions.
- `src/components/Skills.jsx`: skills and services.
- `src/components/Journey.jsx`: education and project journey.
- `src/components/Contact.jsx` and `Footer.jsx`: contact and social links.
- `src/components/Header.jsx`: branding and navigation.
- `src/components/GuideOverlay.jsx`: initial guide greeting and accessible labels.
- `src/three/createPortfolioExperience.js`: 3D guide, pose variants, project concept previews, speech, scroll choreography and interactions.
- `src/styles.css`: complete responsive styling; colors and font tokens are at the top, with later revision overrides preserved to match the released design.
- `index.html`: page title, metadata, favicon and font links.

## Behavior

React renders all page sections and project cards. Three.js runs in a React effect, with event-listener, animation-frame, geometry, material, texture and renderer cleanup for unmounts and development Strict Mode. Character poses and section movement follow scroll progress; idle floating and blinking use time. The guide introduces itself without a name.

Desktop project cards scroll horizontally. Mobile and reduced-motion layouts use a vertical stack. Reduced-motion mode keeps the guide still. Project previews are labeled illustrative interface concepts, not screenshots of running applications. Contact opens the visitor's email client; GitHub, LinkedIn and Fiverr links open their respective sites. There is no live chatbot or form-submission server.

Google Fonts are loaded over the internet, with sans-serif fallbacks. WebGL is required for 3D; a simple guide fallback appears when WebGL initialization fails. All 3D geometry and preview textures are generated locally in code, with no external model files.

## Included

Editable React components, project data, Three.js scene code, CSS, Vite configuration, dependency lockfile, setup instructions and production build. `node_modules`, credentials, hosting-specific configuration and Git history are excluded.

Validation: production build and React server-render smoke checks. Browser-based visual QA was not available in the authoring environment.
