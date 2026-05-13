# Axiom — Knowledge Centered Network

Axiom is a social platform built for researchers, academics, and knowledge enthusiasts. It lets users curate a personalized feed from trusted authors, journals, and media sources, configure their own discovery algorithm, and engage with high-quality discussions and research.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Authentication](#authentication)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Curated Feed** — Follow authors, journals, and media you trust; no forced algorithmic content
- **Configurable Algorithm** — Tune your feed by topic, author, or post type
- **Content Filtering** — Filter for quality discussions, research papers, and expert insights
- **Post Types** — Supports news posts, academic paper posts, and user posts
- **Echo Meter** — Radar-chart analytics to visualize engagement and topic balance
- **Profiles** — User profiles, avatars, followers, and following
- **Bookmarks** — Save posts for later reading
- **Notifications** — Real-time notification dropdown
- **Authentication** — Email/OTP, Google, and ORCID login
- **Dark / Light Theme** — Full theme support via `next-themes`
- **Responsive Design** — Mobile-first layout with a collapsible sidebar

---

## Tech Stack

| Category             | Library / Tool                                                          |
|----------------------|-------------------------------------------------------------------------|
| Framework            | [Next.js 15](https://nextjs.org) (App Router, Turbopack)                |
| UI Library           | [React 19](https://react.dev)                                           |
| Styling              | [Tailwind CSS 4](https://tailwindcss.com)                               |
| Component Primitives | [Radix UI](https://www.radix-ui.com)                                    |
| State Management     | [Zustand](https://zustand-demo.pmnd.rs)                                 |
| Data Fetching        | [SWR](https://swr.vercel.app) + [Axios](https://axios-http.com)         |
| Forms & Validation   | [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev) |
| Animations           | [GSAP](https://gsap.com) + [Motion](https://motion.dev)                 |
| Charts               | [Nivo](https://nivo.rocks) (Radar chart)                                |
| File Uploads         | [FilePond](https://pqina.nl/filepond/)                                  |
| Toasts               | [Sonner](https://sonner.emilkowal.ski)                                  |
| OTP Input            | [input-otp](https://github.com/guilhermerodz/input-otp)                |
| Date Utilities       | [date-fns](https://date-fns.org)                                        |
| Monitoring           | [Vercel Analytics](https://vercel.com/analytics) + Speed Insights       |

---

## Project Structure

```
axiom-frontend/
├── app/
│   ├── (connected)/        # Authenticated app routes
│   │   ├── dashboard/      # User dashboard
│   │   ├── echo-meter/     # Engagement analytics
│   │   ├── feed/           # Main content feed
│   │   ├── followers/      # Followers list
│   │   ├── following/      # Following list
│   │   ├── my-posts/       # Posts by current user
│   │   ├── posts/          # All posts
│   │   ├── profile/        # User profile page
│   │   └── saved-posts/    # Bookmarked posts
│   ├── (landing)/          # Public routes
│   │   ├── (about)/        # About page
│   │   ├── (login)/        # Sign-in / sign-up pages
│   │   └── auth/           # OAuth callback handlers
│   └── schemas/            # App-level Zod schemas
├── components/
│   ├── auth/               # Protected route wrapper
│   ├── dashboard/          # Dashboard card and category components
│   ├── echo-meter/         # Radar chart component
│   ├── feed/               # Feed, post types, publish form
│   ├── file-handling/      # Image upload/drop components
│   ├── hero-elements/      # Landing page hero elements
│   ├── login/              # Login, signup, OTP forms
│   ├── nav-menu/           # Sidebar and navigation
│   ├── notifications/      # Notification dropdown
│   ├── profile/            # Avatar list and profile UI
│   ├── skeletons/          # Loading skeleton components
│   ├── tailwind/           # Tailwind UI primitive components
│   ├── ui/                 # shadcn/ui components (Radix-based)
│   └── user/               # User-specific components
├── context/
│   ├── UserProfileContext.js   # Global user profile context
│   └── post-type-provider.js   # Post type selection context
├── data/
│   └── menu-categories/        # Static menu/category data
├── hooks/
│   ├── use-mobile.js           # Mobile breakpoint hook
│   └── useRequireAuth.js       # Auth guard hook
├── lib/
│   ├── actions/                # Server actions (actions.js, client-actions.js)
│   ├── schemas/                # Shared Zod validation schemas
│   ├── state/                  # Zustand stores (bookmarks, comments, notifications, reactions)
│   ├── utils/                  # Helper utilities
│   └── utils.js                # cn() and class utilities
└── public/                     # Static assets (images, icons, favicons)
```

---

## Getting Started

### Prerequisites

- **Node.js** v18 or later
- **npm**, **yarn**, **pnpm**, or **bun**

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/hallsarturo/axiom.git
   cd axiom/front/axiom-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your values
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

Create a `.env.local` file in the project root. Required variables:

```env
# API
NEXT_PUBLIC_API_URL=https://api.axiomlab.space

# OAuth — Google
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# OAuth — ORCID
ORCID_CLIENT_ID=
ORCID_CLIENT_SECRET=

# Session
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=
```

> **Never** commit `.env.local` to version control.

---

## Available Scripts

| Script          | Description                        |
|-----------------|------------------------------------|
| `npm run dev`   | Start dev server with Turbopack    |
| `npm run build` | Build the app for production       |
| `npm run start` | Start the production server        |
| `npm run lint`  | Run ESLint across the project      |

---

## Authentication

Axiom supports three authentication methods:

- **Email + OTP** — Users enter their email and receive a one-time password
- **Google OAuth** — Sign in with a Google account
- **ORCID OAuth** — Sign in with an ORCID researcher account

Protected routes under `app/(connected)/` are guarded by the `useRequireAuth` hook and the `ProtectedRoute` component.

---

## Deployment

The recommended deployment platform is [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import the repository into Vercel
3. Set all required environment variables in the Vercel dashboard
4. Deploy

Vercel Analytics and Speed Insights are already integrated and activate automatically on Vercel deployments.

For other platforms:

```bash
npm run build
npm run start
```

Refer to the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for details.

---

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a pull request

Please follow the existing code style — ESLint and Prettier are configured in the project.

---

## License

This project is private and proprietary. All rights reserved.
