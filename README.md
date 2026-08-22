# BiblioCard

A PWA built with React and Vite that keeps everything on your device — no
backend, no account, no data leaving your phone.

BiblioCard reads a public library card's barcode with your phone's camera,
stores the card number alongside a password you type in, and can display
either one later as a barcode for the library's scanner to read. It supports
multiple family members, each with their own set of library cards.

Read more on the design rationale in [`design.md`](./design.md).

## Screens

- **Members** — every family member, with add/delete.
- **Member** — that person's library cards, listed by library name, with
  add/delete.
- **Card** — the card number as a Code 128 barcode; swipe to reveal the
  password as a second barcode.

## Features

- 📷 Scan a card's barcode with the camera, or type the number in by hand
- 🔒 Attach a manually-entered alphanumeric password to each card
- 👨‍👩‍👧‍👦 Store cards for multiple family members
- 📶 Works fully offline — installable as a PWA, data lives in `localStorage`
- 📱 Designed mobile-first for phones

## Tech stack

Vite + React + TypeScript, `react-router-dom` (hash routing),
[`@zxing/browser`](https://github.com/zxing-js/browser) for camera barcode
scanning, [`jsbarcode`](https://github.com/lindell/JsBarcode) for Code 128
rendering, and `vite-plugin-pwa` for installability/offline support.

## Develop

```bash
npm install
npm run dev
```

Open the printed URL on your phone (same network) or in a browser with a
mobile viewport. Camera scanning requires `localhost` or HTTPS.

## Build

```bash
npm run build
npm run preview
```

## Deploy

Pushing to `main` builds the app and deploys it to GitHub Pages via
[`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml). Live at
<https://olivier2.github.io/bibliocard/>.
