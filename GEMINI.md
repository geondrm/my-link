# Gemini Project Guide: MyLink (마이링크)

This document provides foundational context and instructions for AI agents working on the MyLink project.

## Project Overview

MyLink is a "Link-in-bio" style service that allows users to consolidate multiple social media, blog, and portfolio links into a single, shareable profile page.

- **Primary Goal:** Provide a simple, mobile-optimized profile page with a custom URL slug.
- **Target Audience:** Influencers, creators, freelancers, and small businesses.
- **Business Model:** Fully free single plan (at launch).

### Core Technologies
- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/) (Radix UI)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) (v4)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Utilities:** `clsx`, `tailwind-merge`

## Architecture & Conventions

### Directory Structure
- `app/`: Next.js App Router pages and layouts.
- `components/`: React components.
  - `ui/`: Standard UI components (shadcn/ui).
- `docs/`: Project documentation (PRD, User Scenarios, Wireframes).
- `lib/`: Utility functions and shared logic.
- `hooks/`: Custom React hooks.
- `public/`: Static assets.

### Key Features
1. **Dynamic Routing:** Profile pages use the `displayname` as a slug (e.g., `/my-nickname`).
2. **Inline Editing:** Dashboard features direct text editing for link titles and URLs without popups.
3. **Favicon Integration:** Uses Google Favicon API to automatically fetch icons for added links.
4. **Media Embedding:** Supports embedding YouTube videos and images directly on the profile.
5. **NoSQL Persistence:** Designed for a NoSQL structure (e.g., Firebase Firestore), focusing on sub-collections for link lists.

### Coding Standards
- **Component Pattern:** Use functional components with TypeScript.
- **Styling:** Prefer Tailwind CSS utility classes. Use `cn()` from `lib/utils.ts` for conditional classes.
- **UI Consistency:** Use existing shadcn/ui components. To add new ones, use `npx shadcn@latest add <component>`.
- **Accessibility:** Ensure all interactive elements have proper ARIA labels and keyboard support (built into Radix UI).

## Development Workflow

### Commands
- **Development:** `npm run dev` (uses Turbopack)
- **Build:** `npm run build`
- **Linting:** `npm run lint`
- **Formatting:** `npm run format` (Prettier)
- **Type Checking:** `npm run typecheck`

### Git & Collaboration
- **Branching:** (Assumed) Use feature branches.
- **Commits:** Clear, concise messages focusing on "why" and "what".
- **Documentation:** Keep `docs/` updated as features evolve.

## Important Constraints
- **Slug Constraints:** Reserved keywords like `login`, `admin`, `api`, `dashboard` cannot be used as `displayname`.
- **No Image Upload:** The initial version does not support profile image uploads.
- **No Theme Selection:** Users cannot change themes in the initial version.
- **No Drag-and-Drop:** Link reordering via drag-and-drop is not supported in the initial version.

---

*This file is managed by Gemini CLI and should be updated whenever significant architectural changes or new project conventions are established.*
