# Opticore — Landing Page (Frontend + Backend)

A responsive, premium landing page for a fictional digital product consultancy,
with a React + Tailwind frontend and a Node.js/Express REST API.

## Design Constraints

This build intentionally follows a strict design system:

- **No pill buttons.** Every interactive control uses sharp or subtly rounded
  corners (max `4px`). Decorative fluid elements (glow, orbiting ring,
  specular highlight) are circular by nature but are not buttons.
- **Controlled palette.** A solid deep-charcoal background (`#0A0A0D`) with a
  single, tight accent family (violet `#7C3AED` → fuchsia `#C724E8`). No
  messy, overlapping gradient mixtures.
- **Modern typography.** Inter for UI copy, JetBrains Mono for small
  uppercase labels. Hierarchy is driven by weight and size, not clutter.
- **Subtle motion.** Scroll reveals are a short fade + rise; hover states are
  restrained. No exaggerated or bouncy animations.

## Tech Stack

| Layer     | Tech                                             |
| --------- | ------------------------------------------------ |
| Frontend  | React 18, Vite 5, Tailwind CSS 3                 |
| Backend   | Node.js 18+, Express 4, CORS, dotenv             |

## Project Structure

```
.
├── backend/
│   ├── server.js                    # Entry: boots the HTTP server
│   ├── .env.example                 # Env template (copy to .env)
│   └── src/
│       ├── app.js                   # Express app: CORS, JSON, routes
│       ├── config/env.js            # Env var loading + defaults
│       ├── controllers/
│       │   └── contact.controller.js# /api/contact logic + validation
│       ├── middleware/
│       │   └── errorHandler.js      # 404 + central error handler
│       └── routes/
│           └── index.js             # /api route mounting
└── frontend/
    ├── index.html
    ├── vite.config.js               # Dev server + /api proxy
    ├── tailwind.config.js           # Design tokens (colors, fonts)
    └── src/
        ├── main.jsx
        ├── App.jsx                  # Page composition
        ├── index.css                # Base styles, grid, reveal, motion
        ├── lib/api.js               # API client
        └── components/
            ├── Navbar.jsx
            ├── Hero.jsx
            ├── FluidShape.jsx       # CSS-built 3D fluid focal element
            ├── About.jsx            # Wireframe grid + ABOUT watermark
            ├── Contact.jsx          # Form wired to /api/contact
            ├── Footer.jsx
            └── Reveal.jsx           # Scroll-reveal helper
```

## Getting Started

### 1. Backend

```bash
cd backend
cp .env.example .env     # adjust if needed
npm install
npm run dev              # starts on http://localhost:4000
```

### 2. Frontend

```bash
cd frontend
cp .env.example .env     # VITE_API_URL=/api (proxied in dev)
npm install
npm run dev              # starts on http://localhost:5173
```

In development the Vite server proxies `/api` to `http://localhost:4000`
(see `frontend/vite.config.js`), so no CORS configuration is needed for local
work. For production, set `VITE_API_URL` to the deployed API origin and set
`CORS_ORIGIN` on the backend to your frontend domain.

## API

### `GET /api/health`

Liveness check.

```json
{ "status": "ok", "service": "opticore-api", "uptime": 241 }
```

### `POST /api/contact`

Submit a project inquiry from the landing page form.

Request:

```json
{
  "name": "Jordan Blake",
  "email": "jordan@northwind.io",
  "company": "Northwind Labs",
  "message": "We are replatforming our analytics dashboard..."
}
```

`name`, `email`, and `message` are required; `company` is optional.

Success — `201`:

```json
{
  "ok": true,
  "id": "inq_mvat02sz2lamz6",
  "message": "Thanks. Your inquiry has been received and our team will reply within two business days."
}
```

Validation failure — `422`:

```json
{
  "ok": false,
  "errors": {
    "name": "Name is required.",
    "email": "Enter a valid email address.",
    "message": "Message is required."
  }
}
```

## Environment Variables

**Backend** (`backend/.env`):

| Key            | Default                  | Purpose                             |
| -------------- | ------------------------ | ----------------------------------- |
| `PORT`         | `4000`                   | HTTP port                           |
| `NODE_ENV`     | `development`            | Runtime mode                        |
| `CORS_ORIGIN`  | `http://localhost:5173`  | Allowed origin(s), comma-separated  |
| `DATABASE_URL` | _(empty)_                | Reserved for future DB integration  |

**Frontend** (`frontend/.env`):

| Key            | Default | Purpose                                   |
| -------------- | ------- | ----------------------------------------- |
| `VITE_API_URL` | `/api`  | Base URL for the API client               |

## Notes for Future Work

- The contact controller stores submissions in memory and marks where to wire a
  real database (`DATABASE_URL`) and a notification email. See the `TODO` in
  `backend/src/controllers/contact.controller.js`.
- Add rate limiting and persistence before deploying to production.
