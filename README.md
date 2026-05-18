# 🔗 MyLink (마이링크)

> 흩어진 링크를 깔끔한 한 페이지로 — 나만의 프로필 링크를 30초 만에 완성하세요.

**MyLink**는 SNS, 블로그, 포트폴리오, 쇼핑몰 등 여러 플랫폼에 흩어진 링크를 하나의 프로필 페이지로 통합해주는 **Link-in-bio** 서비스입니다.

---

## ✨ 주요 기능

| 기능 | 설명 |
| --- | --- |
| 🔐 **Google 소셜 로그인** | Google 계정 하나로 간편하게 가입 및 로그인 |
| 🔗 **고유 프로필 URL** | `domain.com/닉네임` 형태의 깔끔한 개인 URL 제공 |
| ✏️ **인라인 편집** | 팝업 없이 클릭 한 번으로 링크 제목·URL 바로 수정 |
| 🌐 **자동 파비콘** | Google Favicon API로 등록한 URL의 아이콘 자동 표시 |
| 🎬 **미디어 임베드** | YouTube 영상, 이미지 등을 프로필 페이지에 직접 임베드 |
| 👤 **프로필 설정** | 사용자 이름, 슬러그(닉네임), 자기소개(Bio) 자유롭게 수정 |
| 📱 **모바일 최적화** | 세로형 반응형 UI로 모바일 환경에 최적화 |
| 🆓 **완전 무료** | 모든 기능을 제한 없이 무료로 사용 가능 |

---

## 🛠️ 기술 스택

| 분류 | 기술 |
| --- | --- |
| **프레임워크** | [Next.js](https://nextjs.org/) (App Router, Turbopack) |
| **언어** | [TypeScript](https://www.typescriptlang.org/) |
| **UI 컴포넌트** | [shadcn/ui](https://ui.shadcn.com/) (Radix UI 기반) |
| **스타일링** | [Tailwind CSS](https://tailwindcss.com/) v4 |
| **아이콘** | [Lucide React](https://lucide.dev/) |
| **인증 / DB** | [Firebase](https://firebase.google.com/) (Auth + Firestore) |
| **유틸리티** | `clsx`, `tailwind-merge` |

---

## 📁 프로젝트 구조

```
my-link/
├── app/
│   ├── [displayName]/     # 동적 프로필 페이지 (퍼블릭)
│   ├── globals.css         # 글로벌 스타일 (디자인 시스템)
│   ├── layout.tsx          # 루트 레이아웃
│   ├── page.tsx            # 랜딩 페이지 + 대시보드
│   ├── opengraph-image.tsx # OG 이미지 동적 생성
│   └── twitter-image.tsx   # Twitter 카드 이미지
├── components/
│   ├── ui/                 # shadcn/ui 컴포넌트 (Button, Card, Dialog 등)
│   ├── add-link-dialog.tsx # 링크 추가 다이얼로그
│   ├── link-item.tsx       # 링크 카드 컴포넌트
│   ├── profile-header.tsx  # 프로필 헤더 (인라인 편집)
│   └── theme-provider.tsx  # 테마 프로바이더
├── lib/
│   ├── firebase.ts         # Firebase 초기화
│   ├── firestore-links.ts  # 링크 CRUD 함수
│   ├── firestore-profile.ts # 프로필 CRUD 함수
│   ├── firestore-server.ts # 서버사이드 Firestore
│   └── utils.ts            # 유틸리티 (cn 함수 등)
├── data/
│   └── links.ts            # 링크 타입 정의
├── docs/
│   ├── prd.md              # 제품 요구사항 정의서
│   ├── user_scenario.md    # 사용자 시나리오
│   └── wireframe.md        # 와이어프레임
└── hooks/                  # 커스텀 훅
```

---

## 🚀 시작하기

### 사전 요구 사항

- **Node.js** 18 이상
- **npm** 9 이상
- **Firebase 프로젝트** (Authentication + Firestore 활성화)

### 설치

```bash
# 1. 저장소 클론
git clone https://github.com/geondrm/my-link.git
cd my-link

# 2. 의존성 설치
npm install

# 3. 환경 변수 설정
cp .env.local.example .env.local
```

### 환경 변수 설정

`.env.local` 파일에 Firebase 설정값을 입력합니다:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 개발 서버 실행

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 확인할 수 있습니다.

---

## 📜 사용 가능한 스크립트

| 명령어 | 설명 |
| --- | --- |
| `npm run dev` | 개발 서버 실행 (Turbopack) |
| `npm run build` | 프로덕션 빌드 |
| `npm run start` | 프로덕션 서버 실행 |
| `npm run lint` | ESLint 린트 검사 |
| `npm run format` | Prettier 코드 포맷팅 |
| `npm run typecheck` | TypeScript 타입 검사 |

---

## 📄 라이선스

이 프로젝트는 [MIT 라이선스](./LICENSE)로 배포됩니다.

---

<p align="center">
  <strong>🔗 MyLink</strong> — 모든 링크를 하나로 연결하세요.
</p>
