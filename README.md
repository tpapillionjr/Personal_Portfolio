# Personal Portfolio

Most of the code for this portfolio lives in `index.html`.

This repo contains my personal portfolio site, where I highlight my projects, technical skills, resume, and contact information in one place.

## Overview

- Built to represent me, my work, and my design style
- Single-page portfolio created with HTML, CSS, and JavaScript
- Includes featured project sections, resume links, and social links
- Deployed on Vercel
- Includes a serverless contact form endpoint through `api/contact.js`

## Tech Stack

- HTML
- CSS
- JavaScript
- Vercel
- Resend

## Project Structure

```text
Personal_Portfolio/
├── api/
│   └── contact.js
├── assets/
│   ├── css/
│   │   └── styles.css
│   └── js/
│       └── main.js
├── public/
│   ├── ProfessionalHeadshot.png
│   ├── Theron Papillion Resume-2.pdf
│   ├── Theron Papillion Resume-3.pdf
│   ├── favicon.png
│   ├── image.png
│   ├── lumi-pos-system/
│   ├── UH-marketplace-ecomm/
│   └── pup-central/
├── index.html
├── package.json
└── vercel.json
```

## Running Locally

Because this is a mostly static site, I can preview it with a simple local server from the project folder:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Deployment

This project is configured for Vercel with [vercel.json](/Users/tjp/Documents/CompSci%20VSCode/Personal_Portfolio/vercel.json:1).

- `outputDirectory` is set to `.`
- clean URLs are enabled
- trailing slashes are disabled

## Contact Form

The repo includes `api/contact.js` for handling contact form submissions from the portfolio.

Expected environment variables:

```env
RESEND_API_KEY=
RESEND_FROM_EMAIL=
CONTACT_TO_EMAIL=
```

## Customization

Main places to update:

- [index.html](/Users/tjp/Documents/CompSci%20VSCode/Personal_Portfolio/index.html:1) for most of the page structure and content
- `assets/css/styles.css` for styling
- `assets/js/main.js` for gallery and interaction behavior
- `public/` for screenshots, logos, resumes, the favicon, and project media

## Featured Projects

The current portfolio highlights:

- Lumi POS System
- UH Marketplace
- Pup Central

Additional project cards and gallery content can be expanded directly in `index.html` and the supporting assets.
