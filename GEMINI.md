# Gemini Project Guide: MyLink (마이링크)

This document provides foundational context and instructions for AI agents working on the MyLink project.

## 🌐 언어 사용 규칙 (Language Policy) — 최우선 적용

> **이 규칙은 아래 모든 지침보다 우선하며, 예외 없이 반드시 준수해야 합니다.**

AI 에이전트는 이 프로젝트와 관련된 **모든 커뮤니케이션과 산출물에 한국어를 사용**해야 합니다.

### 적용 범위

- **대화 응답**: 사용자에게 전달하는 모든 메시지와 설명은 한국어로 작성합니다.
- **계획 문서 (Implementation Plan / Task)**: AI가 생성하는 구현 계획, 태스크 목록, 단계별 작업 내용은 한국어로 작성합니다.
- **워크스루 문서 (Walkthrough)**: 작업 과정을 설명하는 워크스루 문서는 한국어로 작성합니다.
- **아티팩트 (Artifacts)**: 분석 보고서, 연구 노트, 실험 결과 등 AI가 생성하는 모든 마크다운 아티팩트는 한국어로 작성합니다.
- **코드 주석**: 코드 내 주석(comment)과 JSDoc은 한국어로 작성합니다.
- **커밋 메시지**: Git 커밋 메시지는 한국어로 작성합니다.

### 예외 사항

아래 항목은 영어를 그대로 사용합니다.

- 코드 자체 (변수명, 함수명, 타입명 등)
- 외부 라이브러리·API 이름 및 기술 용어 (예: `Next.js`, `TypeScript`, `shadcn/ui`)
- 공식 문서의 인용 문구

---

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
