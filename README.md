# Educans

A React-based web app for managing and viewing educational resources. Educans includes a modern UI and integrations for document viewing and text extraction (PDF viewer + OCR), plus optional backend services for auth and storage.

## Demo
Try the live demo: https://educans.vercel.app/

## Overview
Educans is a frontend-focused education resources app built with React. It provides:
- A responsive UI for browsing and accessing resources
- PDF viewing and handling (pdfjs)
- OCR/text extraction for images/docs (Tesseract.js)
- Integrations for backend services (Firebase / Supabase) for authentication and storage

(Implementation details depend on environment variables and service credentials which are not included in this repo.)

## Features
- React-based single-page app
- PDF rendering with pdfjs-dist
- OCR via tesseract.js
- Optional use of Firebase and/or Supabase for auth, storage, or database
- Lightweight icon set with Hugeicons
- Popup/modal interactions and user-friendly UI

## Technologies
Primary languages:
- JavaScript
- CSS
- HTML
- Small C files (if present)

Main libraries and tools (from package.json):
- React, react-dom, react-router-dom
- react-scripts (Create React App)
- pdfjs-dist
- tesseract.js
- @supabase/supabase-js
- firebase
- reactjs-popup
- hugeicons / @hugeicons


## Deployment
The demo is deployed on Vercel: https://educans.vercel.app/
To deploy yourself, connect the repo to Vercel or another static host and set the required environment variables via the host's settings.

## Project structure (example)
- public/             — static assets
- src/                — React source
  - components/       — UI components
  - pages/            — route pages
  - services/         — firebase/supabase wrappers
  - utils/            — helpers (OCR, PDF helpers)
- package.json

Adjust to match the actual repository layout.

## Acknowledgements
- pdf.js (pdfjs-dist)
- Tesseract.js
- Firebase, Supabase
- Hugeicons icon set
