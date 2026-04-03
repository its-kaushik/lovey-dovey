# Technical Specification Document

## Project: Lovey Dovey

**Based on:** BRD v1.3
**Author:** Kushik
**Date:** 3 April 2026
**Status:** Draft

---

## Table of Contents

1. [Overview](#1-overview)
2. [Tech Stack & Dependencies](#2-tech-stack--dependencies)
3. [Project Structure](#3-project-structure)
4. [TypeScript Data Models](#4-typescript-data-models)
5. [Authentication System](#5-authentication-system)
6. [Page Architecture](#6-page-architecture)
7. [Component Specifications](#7-component-specifications)
8. [Animation System](#8-animation-system)
9. [Styling & Tailwind Configuration](#9-styling--tailwind-configuration)
10. [Responsive Design](#10-responsive-design)
11. [Performance Strategy](#11-performance-strategy)
12. [SEO & Privacy](#12-seo--privacy)
13. [Deployment & Environment](#13-deployment--environment)
14. [Implementation Phases](#14-implementation-phases)
15. [Testing Checklist](#15-testing-checklist)

---

## 1. Overview

A password-protected, single-page romantic website built with Next.js 14+ (App Router). The site uses middleware-based authentication to ensure protected content never reaches the client before auth. All dynamic content is data-driven via TypeScript data files.

**Two-route architecture:**
- `/` — Password gate (public)
- `/love` — Protected main experience (all sections rendered as one scrollable page)

---

## 2. Tech Stack & Dependencies

### 2.1 Core Dependencies

```json
{
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "framer-motion": "^11.0.0",
    "@tsparticles/react": "^3.0.0",
    "@tsparticles/slim": "^3.0.0"
  },
  "devDependencies": {
    "typescript": "^5.4.0",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "@types/node": "^20.0.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0"
  }
}
```

### 2.2 Dependency Justification

| Package | Size (gzipped) | Purpose | Why not alternatives |
|---------|---------------|---------|---------------------|
| `framer-motion` | ~30KB | Declarative animations, `whileInView`, stagger, layout animations | CSS keyframes can't handle scroll-triggered orchestration; GSAP is heavier |
| `@tsparticles/slim` | ~25KB | Floating petals, bokeh, sparkle bursts | Slim bundle excludes unused particle shapes; custom Canvas would need more code |
| `next/font` | 0KB (built-in) | Google Fonts with zero layout shift | Built into Next.js, no external dependency |
| `next/image` | 0KB (built-in) | Image optimization, lazy loading, blur placeholders | Built into Next.js |
| Native `<audio>` | 0KB | Single song play/pause | Howler.js adds ~7KB for features we don't use |

### 2.3 Bundle Budget

| Category | Budget | Notes |
|----------|--------|-------|
| First-load JS (shared) | < 100KB | Next.js runtime + React |
| Page JS (`/love`) | < 150KB | All components for the main page |
| Framer Motion | ~30KB | Tree-shaken — only import used functions |
| tsparticles (slim) | ~25KB | Dynamically imported, not in critical path |
| Total JS | < 400KB gzipped | Well under the 1MB BRD ceiling |
| Images | Lazy loaded | Not counted in JS budget; served via `next/image` |

---

## 3. Project Structure

```
lovey-dovey/
├── app/
│   ├── layout.tsx                  # Root layout — fonts, metadata, grain overlay
│   ├── page.tsx                    # Public route: password gate + interstitial
│   ├── (protected)/                # Route group — doesn't affect URL
│   │   ├── layout.tsx              # Protected layout — MusicPlayer, FloatingElements, EasterEggs, ScrollProgress
│   │   └── love/
│   │       └── page.tsx            # Protected route: main love page (all sections)
│   └── api/
│       └── auth/
│           └── route.ts            # POST endpoint: password verification
├── components/
│   ├── PasswordGate.tsx            # Themed password entry UI
│   ├── SuspenseInterstitial.tsx    # Cinematic "Before the world changed..." pause
│   ├── ScrollProgress.tsx          # Thin rose-gold scroll progress bar at top
│   ├── Hero.tsx                    # Hero section + "Read Our Story" CTA
│   ├── Timeline.tsx                # Timeline container + self-drawing SVG line
│   ├── TimelineCard.tsx            # Individual milestone card (micro-interactions)
│   ├── ReasonsJar.tsx              # "Draw a Reason" jar mechanic
│   ├── LoveLetter.tsx              # Her letter + Kushik's response
│   ├── TheMomentIKnew.tsx          # One paragraph, word-by-word reveal
│   ├── PhotoGallery.tsx            # Masonry/polaroid grid + lightbox modal
│   ├── PressIfYouMissMe.tsx        # Playful button + random message overlay
│   ├── WhatIPromise.tsx            # Forward-looking promises
│   ├── RelationshipTimer.tsx       # Live ticking counter (presentational only)
│   ├── MusicPlayer.tsx             # Floating HTML5 audio widget
│   ├── FloatingElements.tsx        # Ambient particles (petals/bokeh)
│   ├── EasterEggs.tsx              # Konami code, hidden heart, click counter
│   └── Footer.tsx                  # Closing message + credits
├── data/
│   ├── milestones.ts               # Timeline milestone entries
│   ├── reasons.ts                  # "Reasons I Love You" array
│   ├── promises.ts                 # "What I Promise" list
│   ├── missYouMessages.ts          # Random message pool
│   └── gallery.ts                  # Photo metadata + captions
├── lib/
│   ├── auth.ts                     # Auth utilities (cookie name, validation helpers)
│   ├── random.ts                   # randomIndex() helper — used by jar, miss-me, easter eggs
│   └── motion.ts                   # Shared Framer Motion variants (fadeUp, slideLeft, stagger, etc.)
├── hooks/
│   ├── useReducedMotion.ts         # Wraps prefers-reduced-motion media query
│   ├── useMediaQuery.ts            # Reactive media query hook (replaces window.innerWidth checks)
│   ├── useRelationshipTimer.ts     # Timer logic extracted from component
│   └── useIntersectionOnce.ts      # Intersection Observer — fires callback once per element
├── public/
│   ├── images/                     # Photos (Priiyanshii, gift, letter scan)
│   └── music/                      # Audio file(s)
├── styles/
│   └── globals.css                 # Global styles, grain overlay, custom keyframes
├── middleware.ts                    # Auth guard — redirects unauthenticated /love requests
├── tailwind.config.ts              # Custom theme (colors, fonts, animations)
├── tsconfig.json
├── next.config.mjs
└── .env.local                      # SITE_PASSWORD=devi
```

---

## 4. TypeScript Data Models

### 4.1 Milestone (Timeline)

```typescript
// data/milestones.ts

export interface Milestone {
  id: number;
  icon: string;                    // Emoji displayed at timeline dot
  date: string;                    // Display string — e.g., "19 Feb 2026" or "???"
  title: string;
  description: string;             // Raw, personal tone — written by Kushik
  image?: string;                  // Optional path relative to /public/images/
  imageAlt?: string;               // Alt text for the image
  isOpenEnded?: boolean;           // true for the "still being written" entry
}

export const milestones: Milestone[] = [
  {
    id: 1,
    icon: "✨",
    date: "19 Feb 2026",
    title: "The Day the Universe Conspired",
    description: "My best friend's sister's wedding...",
    // ... (full content from BRD Section 4.4)
  },
  // ... milestones 2-6
  {
    id: 7,
    icon: "✍️",
    date: "???",
    title: "And this story is still being written...",
    description: "This isn't where it ends...",
    isOpenEnded: true,
  },
];
```

### 4.2 Reason

```typescript
// data/reasons.ts

export interface Reason {
  id: number;
  text: string;
}

export const reasons: Reason[] = [
  { id: 1, text: 'The way you say "Ek rehpatt maarungi na" — and I believe you every time' },
  // ... 15-20 entries minimum
];
```

### 4.3 Promise

```typescript
// data/promises.ts

export interface Promise {
  id: number;
  text: string;
}

export const promises: Promise[] = [
  { id: 1, text: "show up — even when it's inconvenient, even when it's raining, even when you say you're fine and you're clearly not" },
  // ... (all promises from BRD Section 4.11)
];
```

### 4.4 Miss You Message

```typescript
// data/missYouMessages.ts

export const missYouMessages: string[] = [
  "You already do. I know. ❤️",
  "Here's a virtual hug. Hold your phone tight.",
  "You get one hug coupon. Redeemable anytime.",
  "Close your eyes. I'm thinking of you right now.",
  "Ek rehpatt maar dungi na? — Yes please. 🥺",
  "You miss me? Good. Because I never stopped.",
  "Distance means nothing when someone means everything.",
  "I'm just one call away. You know that, Devi.",
];
```

### 4.5 Gallery Item

```typescript
// data/gallery.ts

export interface GalleryItem {
  id: number;
  src: string;              // Path relative to /public/images/
  alt: string;              // Descriptive alt text
  caption?: string;         // Optional — shown with typewriter effect in lightbox
  rotation?: number;        // Slight rotation in degrees for polaroid scatter (-5 to 5)
}

export const galleryItems: GalleryItem[] = [
  // Populated by Kushik with actual photos
];
```

---

## 5. Authentication System

### 5.1 Architecture

```
┌─────────────┐     GET /love     ┌──────────────┐
│   Browser    │ ──────────────→  │  middleware.ts │
└─────────────┘                   └──────┬───────┘
                                         │
                              ┌──────────┴──────────┐
                              │  Has valid cookie?   │
                              └──────────┬──────────┘
                                    │          │
                                   YES         NO
                                    │          │
                                    ▼          ▼
                            ┌───────────┐  ┌──────────────┐
                            │ /love page│  │ Redirect to /│
                            │ (renders) │  │ (gate shown) │
                            └───────────┘  └──────────────┘
```

### 5.2 Middleware — `middleware.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";

const AUTH_COOKIE_NAME = "lovey-dovey-auth";

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get(AUTH_COOKIE_NAME);

  if (authCookie?.value !== "true") {
    const url = new URL("/", request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/love/:path*"],
};
```

**Key details:**
- `matcher: ["/love/:path*"]` — wildcard to future-proof against nested routes under `/love/`
- Cookie name: `lovey-dovey-auth`

### 5.3 API Route — `app/api/auth/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";

const AUTH_COOKIE_NAME = "lovey-dovey-auth";
const MAX_COOKIE_AGE = 60 * 60 * 24 * 30; // 30 days

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { password } = body;

  if (typeof password !== "string") {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const sitePassword = process.env.SITE_PASSWORD;

  if (!sitePassword) {
    console.error("SITE_PASSWORD environment variable is not configured");
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  const isCorrect = password.trim().toLowerCase() === sitePassword.toLowerCase();

  if (!isCorrect) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });

  response.cookies.set(AUTH_COOKIE_NAME, "true", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: MAX_COOKIE_AGE,
    path: "/",
  });

  return response;
}
```

**Key details:**
- No fallback password — if `SITE_PASSWORD` is missing, the API returns 500 instead of silently using a default (prevents leaked defaults in production)
- Case-insensitive password comparison
- `httpOnly` cookie — not accessible via JavaScript (prevents XSS token theft)
- `sameSite: "strict"` — no cross-site navigation needed, prevents CSRF attempts entirely
- `secure: true` in production (Vercel uses HTTPS)
- 30-day session persistence — she won't need to re-enter
- No rate limiting in v1 (acceptable risk per BRD Section 11)

### 5.4 Auth Library — `lib/auth.ts`

```typescript
export const AUTH_COOKIE_NAME = "lovey-dovey-auth";

// Shared constant used by middleware and API route
// Can be extended with utility functions if needed
```

---

## 6. Page Architecture

### 6.1 Root Layout — `app/layout.tsx`

**Responsibilities:**
- Load fonts via `next/font/google` (Playfair Display, Inter, Caveat)
- Set global metadata (`noindex`, `nofollow`, title, description)
- Apply the film grain CSS overlay
- Render `<html>` and `<body>` with dark theme class

```typescript
import { Playfair_Display, Inter, Caveat } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "For You, Devi",
  description: "A love letter in code.",
  robots: { index: false, follow: false },
};
```

**Font CSS variables:**
| Variable | Font | Usage |
|----------|------|-------|
| `--font-playfair` | Playfair Display | Headlines, hero text, section titles |
| `--font-inter` | Inter | Body text, descriptions, UI elements |
| `--font-caveat` | Caveat | Handwritten accents, letter text, special quotes |

### 6.2 Password Gate Page — `app/page.tsx`

**Type:** Client component (`"use client"`)

**Behavior:**
1. Renders `<PasswordGate />` component
2. On successful auth, checks if this is the first visit in the session:
   - **First visit:** Shows `<SuspenseInterstitial />`, then redirects to `/love`
   - **Return visit:** Redirects directly to `/love`
3. Uses `sessionStorage` to track "has seen interstitial this session"

**State:**
```typescript
const [isAuthenticated, setIsAuthenticated] = useState(false);
const [showInterstitial, setShowInterstitial] = useState(false);
```

**Flow:**
```
Page mounts
  → Check: does auth cookie already exist? (try GET /love, if no redirect → already authed)
  → If already authed: router.push("/love")
  → If not authed: show PasswordGate
    → On success:
      → Check sessionStorage for "interstitial-seen"
      → If not seen: setShowInterstitial(true) → play interstitial → set sessionStorage → router.push("/love")
      → If seen: router.push("/love")
```

### 6.3 Protected Layout — `app/(protected)/layout.tsx`

The `(protected)` route group doesn't affect the URL — `/love` still works. The layout wraps all protected routes and holds persistent cross-page elements.

```tsx
import dynamic from "next/dynamic";

const FloatingElements = dynamic(() => import("@/components/FloatingElements"), { ssr: false });
const EasterEggs = dynamic(() => import("@/components/EasterEggs"), { ssr: false });

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ScrollProgress />
      <FloatingElements />
      <MusicPlayer />
      <EasterEggs />
      {children}
    </>
  );
}
```

**Why a route group layout:** Keeps persistent elements (music, particles, easter eggs, scroll progress) at the layout level instead of cramming them into the page. If future protected routes are added, they inherit these elements automatically.

### 6.4 Protected Love Page — `app/(protected)/love/page.tsx`

**Type:** Server component (default) wrapping client sections

**Behavior:**
- Only reachable if middleware allows (valid cookie)
- Renders all content sections in order as one scrollable page
- Imports data files and passes as props to client components

**Section render order:**
```tsx
export default function LovePage() {
  return (
    <main>
      <Hero />
      <Timeline milestones={milestones} />
      <ReasonsJar reasons={reasons} />
      <LoveLetter />
      <TheMomentIKnew />
      <PhotoGallery items={galleryItems} />
      <PressIfYouMissMe messages={missYouMessages} />
      <WhatIPromise promises={promises} />
      <Footer />
    </main>
  );
}
```

**Notes:**
- Persistent elements (`FloatingElements`, `MusicPlayer`, `EasterEggs`, `ScrollProgress`) live in the protected layout, NOT the page
- Each section component is `"use client"` (they all need Framer Motion or interactivity)
- Data imports happen at the server level and are passed down as serializable props

---

## 7. Component Specifications

### 7.1 PasswordGate

| Property | Detail |
|----------|--------|
| **File** | `components/PasswordGate.tsx` |
| **Type** | Client component |
| **Props** | `onSuccess: () => void` |
| **State** | `password: string`, `errorType: "incorrect" | "network" | null`, `attempts: number`, `loading: boolean` |

**Behavior:**
- Themed as a love-letter envelope or romantic door metaphor
- Single text input (type `password`) + submit button
- On submit: `POST /api/auth` with `{ password }`, wrapped in try/catch
- On 401: set `errorType: "incorrect"`, increment `attempts`, shake animation on the input
- On 500 or network error (catch block): set `errorType: "network"`, show "Something went wrong. Try again?" — no shake, no attempt increment
- On `attempts >= 3`: fade in the hint text — "What does he call you that means goddess?"
- On 200: call `onSuccess()`

**Error handling:**
```typescript
const handleSubmit = async () => {
  setLoading(true);
  setErrorType(null);
  try {
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      onSuccess();
    } else {
      setErrorType("incorrect");
      setAttempts((prev) => prev + 1);
    }
  } catch {
    setErrorType("network");
  } finally {
    setLoading(false);
  }
};
```

**Shake animation (CSS keyframe):**
```css
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-8px); }
  40% { transform: translateX(8px); }
  60% { transform: translateX(-4px); }
  80% { transform: translateX(4px); }
}
```

### 7.2 SuspenseInterstitial

| Property | Detail |
|----------|--------|
| **File** | `components/SuspenseInterstitial.tsx` |
| **Type** | Client component |
| **Props** | `onComplete: () => void` |
| **State** | `phase: "line1" | "line2" | "fadeout"` |

**Animation sequence (total ~3.5s):**
| Time | Action |
|------|--------|
| 0ms | Component mounts — full black screen |
| 500ms | Line 1 fades in: "Before the world changed..." |
| 2000ms | Line 2 fades in: "I met someone." |
| 3000ms | Both lines begin fade-out |
| 3500ms | Call `onComplete()` |

**Framer Motion implementation:**
```tsx
<motion.div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center">
  <motion.p
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.5, duration: 0.8 }}
    className="font-playfair text-2xl text-cream"
  >
    Before the world changed...
  </motion.p>
  <motion.p
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 2.0, duration: 0.8 }}
    className="font-playfair text-2xl text-cream mt-4"
  >
    I met someone.
  </motion.p>
</motion.div>
```

After both lines display, the entire container fades out via `animate={{ opacity: 0 }}` with `transition={{ delay: 3.0, duration: 0.5 }}`, then `onAnimationComplete` triggers `onComplete()`.

### 7.3 Hero

| Property | Detail |
|----------|--------|
| **File** | `components/Hero.tsx` |
| **Type** | Client component |
| **Props** | None (copy hardcoded — it's a single-use section) |
| **State** | None |

**Elements:**
1. Full-viewport container (`min-h-screen`)
2. Headline — e.g., "For My Devi" (Playfair Display, large)
3. Tagline — e.g., "The most chaotic, beautiful thing that ever happened to me" (Caveat)
4. "Read Our Story" CTA button

**CTA Button:**
- Smooth-scrolls to `#timeline` section
- Styled: rose-gold border, soft glow, heartbeat pulse animation
- Pulse animation: scales 1.0 → 1.05 → 1.0 on a 2s loop

```tsx
<motion.button
  onClick={() => document.getElementById("timeline")?.scrollIntoView({ behavior: "smooth" })}
  animate={{ scale: [1, 1.05, 1] }}
  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
  className="border border-rose-gold px-8 py-3 rounded-full font-playfair
             text-rose-gold shadow-[0_0_20px_rgba(232,160,191,0.3)]
             hover:shadow-[0_0_30px_rgba(232,160,191,0.5)] transition-shadow"
>
  Read Our Story
</motion.button>
```

**Entrance animation:**
- Headline: `initial={{ opacity: 0, y: 30 }}`, `animate={{ opacity: 1, y: 0 }}`, 0.8s duration
- Tagline: same but with 0.3s delay
- CTA: same but with 0.6s delay

### 7.4 Timeline

| Property | Detail |
|----------|--------|
| **File** | `components/Timeline.tsx` |
| **Type** | Client component |
| **Props** | `milestones: Milestone[]` |
| **State** | `scrollProgress: number` (0-1, drives the self-drawing line) |

**Layout:**
- Section with `id="timeline"` (scroll target from Hero CTA)
- Vertical center line (SVG `<line>` or CSS border) that draws itself based on scroll progress
- Cards alternate left/right on desktop; stack centered on mobile
- Each milestone rendered via `<TimelineCard />`

**Self-drawing line:**

Uses Framer Motion's `useScroll` instead of manual scroll math — handles edge cases like sections smaller than viewport and mobile dynamic toolbars automatically:

```tsx
import { useScroll, useTransform, motion } from "framer-motion";

const sectionRef = useRef<HTMLElement>(null);

const { scrollYProgress } = useScroll({
  target: sectionRef,
  offset: ["start end", "end start"],
});

// Map scroll progress to SVG stroke-dashoffset
const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);
```

The SVG line uses Framer Motion's `motion.line` with `pathLength` as a motion value:

```tsx
<svg className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2">
  <motion.line
    x1="0" y1="0" x2="0" y2="100%"
    stroke="#e8a0bf"
    strokeWidth="2"
    style={{ pathLength }}
  />
</svg>
```

**Card positioning:**
- Desktop: even-indexed cards on the left, odd on the right (alternating via flex-row-reverse)
- Mobile: all cards centered, full-width

### 7.5 TimelineCard

| Property | Detail |
|----------|--------|
| **File** | `components/TimelineCard.tsx` |
| **Type** | Client component |
| **Props** | `milestone: Milestone`, `index: number`, `side: "left" | "right"` |
| **State** | `hasAnimated: boolean` |

**5-stage micro-interaction (desktop):**

Uses Framer Motion's `whileInView` with staggered children:

```tsx
const cardVariants = {
  hidden: {
    opacity: 0,
    x: side === "left" ? -60 : 60,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      staggerChildren: 0.2,
    },
  },
};

const childVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
};
```

| Stage | Element | Delay | Animation |
|-------|---------|-------|-----------|
| 1 | Card container | 0ms | Slide in from left/right + fade |
| 2 | Sparkle burst at timeline dot | +200ms | Scale 0→1→0 particle burst (CSS or tsparticles one-shot) |
| 3 | Heart icon pulse | +400ms | Scale 1→1.3→1 with pink glow |
| 4 | Image | +500ms | Opacity 0→1 + blur(8px)→blur(0) |
| 5 | Description text | +700ms | Fade in as a block (opacity 0→1) |

**3-stage mobile simplification:**
Only stages 1 (fade-in, no slide), 3 (heart pulse), and 5 (text appears instantly) play. Detected via a `useReducedMotion` hook or viewport width check.

**Intersection Observer:**
- `whileInView` with `once: true` ensures animations play only on first scroll into view
- `viewport={{ amount: 0.3 }}` — triggers when 30% of card is visible

**Icon at timeline dot:**
The milestone's `icon` emoji is rendered in a circular badge centered on the vertical timeline line, between cards.

### 7.6 ReasonsJar

| Property | Detail |
|----------|--------|
| **File** | `components/ReasonsJar.tsx` |
| **Type** | Client component |
| **Props** | `reasons: Reason[]` |
| **State** | `drawnIds: Set<number>`, `currentReason: Reason | null`, `isDrawing: boolean`, `allDrawn: boolean` |

**Behavior:**
1. Display an illustrated jar (SVG or image) with folded paper notes visible inside
2. "Draw a Reason" button below the jar
3. On click:
   - Set `isDrawing: true`
   - Sparkle animation plays on the jar (tsparticles one-shot or CSS)
   - A note card flies upward from the jar (Framer Motion: `y: 100 → 0`, `rotate: -10 → 0`)
   - The note "unfolds" (scale `0.5 → 1` + opacity)
   - Reason text fades in instantly (no typewriter — typewriter is reserved for gallery captions and "The Moment I Knew" to avoid the effect feeling repetitive across sections)
4. Next click draws from the remaining pool: `reasons.filter(r => !drawnIds.has(r.id))`
5. When `drawnIds.size === reasons.length`: show "That's not even all of them. I'll keep adding."

**Pool management:**
```typescript
const drawReason = () => {
  const remaining = reasons.filter((r) => !drawnIds.has(r.id));
  if (remaining.length === 0) {
    setAllDrawn(true);
    return;
  }
  const randomIndex = Math.floor(Math.random() * remaining.length);
  const selected = remaining[randomIndex];
  setCurrentReason(selected);
  setDrawnIds((prev) => new Set(prev).add(selected.id));
};
```

### 7.7 LoveLetter

| Property | Detail |
|----------|--------|
| **File** | `components/LoveLetter.tsx` |
| **Type** | Client component |
| **Props** | None (content is specific to this section) |
| **State** | None |

**Elements:**
1. Section heading — "The Love Letter"
2. Scanned letter image in a polaroid/parchment frame — rendered with `next/image`, styled with a slight rotation, drop shadow, and a tape/pin decoration
3. Typed transcript below the image in Caveat font (handwritten feel), for readability
4. Kushik's counter love letter below — in Inter font, regular style

**Entrance animation:**
- Image: fades in + slight scale (0.95 → 1.0) on scroll into view
- Transcript: fades in with 0.3s delay
- Counter letter: fades in with 0.6s delay

### 7.8 TheMomentIKnew

| Property | Detail |
|----------|--------|
| **File** | `components/TheMomentIKnew.tsx` |
| **Type** | Client component |
| **Props** | None (content hardcoded — single-use emotional climax section) |
| **State** | `visibleWordCount: number` |

**Layout:**
- Full-viewport section (`min-h-screen`, flex-centered)
- Dark background — darker than surrounding sections (e.g., `#080c1e`)
- Minimal ambient particles (reduced density)
- Heading: "The Moment I Knew" in Caveat (handwritten font)

**Word-by-word reveal:**
```typescript
// Split paragraph into words
const words = paragraphText.split(" ");

// On intersection, increment visibleWordCount on an interval
useEffect(() => {
  if (!isInView) return;
  const interval = setInterval(() => {
    setVisibleWordCount((prev) => {
      if (prev >= words.length) {
        clearInterval(interval);
        return prev;
      }
      return prev + 1;
    });
  }, 120); // 120ms per word — slower, weighted feel
  return () => clearInterval(interval);
}, [isInView]);
```

Each word is a `<span>` with opacity controlled by whether its index is below `visibleWordCount`. Transition: `transition-opacity duration-500`.

### 7.9 PhotoGallery

| Property | Detail |
|----------|--------|
| **File** | `components/PhotoGallery.tsx` |
| **Type** | Client component |
| **Props** | `items: GalleryItem[]` |
| **State** | `selectedItem: GalleryItem | null` (for lightbox), `clickCounts: Record<number, number>` (for easter egg) |

**Grid layout:**
- Polaroid-style cards: white border (thicker at bottom for "caption strip" look), slight random rotation per card (`rotation` from data, or random -3° to +3°), drop shadow
- CSS grid: 2 columns on mobile, 3 on tablet, 4 on desktop
- Each card: `next/image` with blur placeholder, gentle hover parallax tilt via `onMouseMove` transform

**Lightbox modal:**
- Opens on card click — `AnimatePresence` for enter/exit
- Full-screen overlay (dark backdrop, `bg-black/90`)
- Centered large image
- **Typewriter caption:** on modal open, caption types out character-by-character at ~40ms per char
- Dismiss: click backdrop, click X button, or press Escape

**Easter egg — 10-click counter:**
```typescript
const handlePhotoClick = (item: GalleryItem) => {
  setClickCounts((prev) => {
    const newCount = (prev[item.id] || 0) + 1;
    if (newCount >= 10) {
      // Show toast: "Okay okay, stop staring at her."
      showEasterEggToast();
      return { ...prev, [item.id]: 0 }; // reset
    }
    setSelectedItem(item); // open lightbox normally
    return { ...prev, [item.id]: newCount };
  });
};
```

### 7.10 PressIfYouMissMe

| Property | Detail |
|----------|--------|
| **File** | `components/PressIfYouMissMe.tsx` |
| **Type** | Client component |
| **Props** | `messages: string[]` |
| **State** | `showOverlay: boolean`, `currentMessage: string` |

**Button:**
- Styled: rounded, glowing border (animated box-shadow), Caveat font
- Subtle floating animation: `y: [-4, 4, -4]` on a 3s infinite loop
- Label: "Press if you miss me"

**On click:**
1. Select random message from `messages` (tracking last shown to avoid immediate repeat)
2. Heart burst animation around the button (tsparticles one-shot or CSS `@keyframes`)
3. Full-screen overlay fades in (`AnimatePresence`) with the message centered
4. Dismiss: click/tap anywhere → overlay fades out

### 7.11 WhatIPromise

| Property | Detail |
|----------|--------|
| **File** | `components/WhatIPromise.tsx` |
| **Type** | Client component |
| **Props** | `promises: Promise[]` |
| **State** | None (animation-only) |

**Layout:**
- Section heading: "What I Promise" (Playfair Display)
- "I promise to:" intro line
- Vertical list of promises, each prefixed with a heart icon (`♡`)
- Closing line: "That's not everything. But it's a start."

**Staggered scroll animation:**
```tsx
<motion.ul
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.2 }}
  variants={{
    visible: { transition: { staggerChildren: 0.15 } },
  }}
>
  {promises.map((promise) => (
    <motion.li
      key={promise.id}
      variants={{
        hidden: { opacity: 0, x: -30 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
      }}
    >
      <span className="text-rose-gold mr-3">♡</span>
      {promise.text}
    </motion.li>
  ))}
</motion.ul>
```

### 7.12 RelationshipTimer

| Property | Detail |
|----------|--------|
| **File** | `components/RelationshipTimer.tsx` |
| **Type** | Client component |
| **Props** | None (start date hardcoded: `2026-03-24T00:00:00+05:30` IST) |
| **State** | `elapsed: { days: number, hours: number, minutes: number, seconds: number }` |

**Implementation:**
```typescript
// Pinned to IST (UTC+5:30) so the timer is consistent regardless of her timezone
const START_DATE = new Date("2026-03-24T00:00:00+05:30");

useEffect(() => {
  const tick = () => {
    const now = new Date();
    const diff = now.getTime() - START_DATE.getTime();

    const seconds = Math.floor(diff / 1000) % 60;
    const minutes = Math.floor(diff / (1000 * 60)) % 60;
    const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    setElapsed({ days, hours, minutes, seconds });
  };

  tick(); // immediate first tick
  const interval = setInterval(tick, 1000);
  return () => clearInterval(interval);
}, []);
```

**Display:**
- 4 styled boxes in a row, each containing the number + label
- Rose-gold/warm-gold color treatment
- Seconds digit transitions with a soft fade (`AnimatePresence` with `mode="wait"` on the number)
- Label above: "Together for"
- Label below: "...and counting forever"

### 7.13 MusicPlayer

| Property | Detail |
|----------|--------|
| **File** | `components/MusicPlayer.tsx` |
| **Type** | Client component |
| **Props** | None (audio source hardcoded in component or data config) |
| **State** | `isPlaying: boolean` |

**Implementation:**
```tsx
const audioRef = useRef<HTMLAudioElement>(null);

const togglePlay = () => {
  if (!audioRef.current) return;
  if (isPlaying) {
    audioRef.current.pause();
  } else {
    audioRef.current.play();
  }
  setIsPlaying(!isPlaying);
};

return (
  <div className="fixed bottom-6 right-6 z-40">
    <audio ref={audioRef} src="/music/our-song.mp3" loop />
    <button onClick={togglePlay} className="...">
      {isPlaying ? "⏸" : "▶"} Our Song
    </button>
  </div>
);
```

**Key details:**
- Fixed position, bottom-right, z-index 40
- Paused by default (browsers block autoplay)
- Single song on loop
- Minimal UI — just a pill-shaped button with play/pause icon + song name
- Song name + artist shown in small text

### 7.14 FloatingElements

| Property | Detail |
|----------|--------|
| **File** | `components/FloatingElements.tsx` |
| **Type** | Client component (dynamically imported) |
| **Props** | None |
| **State** | None |

**Implementation:**
- Uses `@tsparticles/react` with `@tsparticles/slim` engine
- Fixed position, full viewport, z-index 1 (behind all content), `pointer-events: none`
- **Dynamically imported** to keep it out of the critical rendering path:

```tsx
// In app/love/page.tsx
const FloatingElements = dynamic(() => import("@/components/FloatingElements"), {
  ssr: false,
});
```

**Particle configuration:**
```typescript
const particleOptions = {
  particles: {
    number: { value: 15 },       // sparse — ambient, not distracting
    color: { value: ["#e8a0bf", "#d4a574", "#ff6b9d"] },
    opacity: {
      value: { min: 0.1, max: 0.4 },
      animation: { enable: true, speed: 0.3 },
    },
    size: {
      value: { min: 2, max: 6 },
    },
    move: {
      enable: true,
      speed: 0.5,                // very slow drift
      direction: "bottom" as const,
      outModes: { default: "out" as const },
    },
    shape: { type: "circle" },   // bokeh-style dots
  },
  detectRetina: true,
};
```

- On mobile: reduce `number.value` to 8 for performance
- Respects `prefers-reduced-motion`: if enabled, disable particle movement entirely

### 7.15 EasterEggs

| Property | Detail |
|----------|--------|
| **File** | `components/EasterEggs.tsx` |
| **Type** | Client component |
| **Props** | None |
| **State** | `konamiTriggered: boolean`, `hiddenHeartFound: boolean` |

**Easter Egg #1 — "Rehpatt" (Footer hidden heart icon):**
- A tiny heart icon in the footer, same color as surrounding text (barely visible)
- On click: tooltip/mini-modal with "Rehpatt" reference

**Easter Egg #2 — "Gay" joke:**
- Hidden somewhere in the page (e.g., a secret link in the letter section)
- On trigger: shows "You call me gay, but the only thing I'm hopelessly attracted to... is you"

**Easter Egg #3 — Photo tap x10:**
- Handled in `PhotoGallery.tsx` (see Section 7.9)

**Easter Egg #4 — Konami Code:**
```typescript
const KONAMI = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
const [sequence, setSequence] = useState<string[]>([]);

useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    setSequence((prev) => {
      const next = [...prev, e.key].slice(-KONAMI.length);
      if (next.join(",") === KONAMI.join(",")) {
        triggerKonamiOverlay();
      }
      return next;
    });
  };
  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, []);
```

- On trigger: full-screen overlay — "Secret level unlocked: hug mode" + burst of hearts
- Desktop only (keyboard required)

**Easter Egg #5 — Hidden Heart:**
- A small heart SVG blended into the background (very low opacity, e.g., 0.08)
- Placed somewhere mid-page (e.g., near the Reasons section)
- On click: reveals "You found the hidden heart ❤️ — just like I found you."

### 7.16 Footer

| Property | Detail |
|----------|--------|
| **File** | `components/Footer.tsx` |
| **Type** | Client component |
| **Props** | None |
| **State** | None (timer is a separate component) |

**Elements:**
1. Closing message: "This is just the beginning, Devi."
2. `<RelationshipTimer />` component
3. Credit line: "Made with love by your shy calm guy"
4. Hidden "Rehpatt" easter egg heart icon (part of EasterEggs system)

---

## 8. Animation System

### 8.1 Framer Motion Conventions

All scroll-triggered animations use `whileInView` with `once: true` (play once, don't re-trigger):

```tsx
<motion.div
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.3 }}
  variants={...}
>
```

### 8.2 Reduced Motion Support

A custom hook wraps the media query:

```typescript
// hooks/useReducedMotion.ts
import { useEffect, useState } from "react";

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return reduced;
}
```

**When `reduced` is `true`:**
- Timeline cards: simple fade-in only (no slide, sparkle, or stagger)
- Floating particles: disabled
- Gallery typewriter caption: text appears instantly
- "The Moment I Knew" word-by-word reveal: all words visible immediately
- CTA pulse: disabled
- All `transition.duration` values capped at 0.1s

### 8.3 Animation Catalog

| Animation | Framer Motion Config | Used In |
|-----------|---------------------|---------|
| Fade in up | `initial: { opacity: 0, y: 30 }`, `animate: { opacity: 1, y: 0 }` | Hero, section headings |
| Slide in left | `initial: { opacity: 0, x: -60 }`, `animate: { opacity: 1, x: 0 }` | Timeline cards (even) |
| Slide in right | `initial: { opacity: 0, x: 60 }`, `animate: { opacity: 1, x: 0 }` | Timeline cards (odd) |
| Heart pulse | `animate: { scale: [1, 1.3, 1] }`, `transition: { duration: 0.4 }` | Timeline dot |
| CTA heartbeat | `animate: { scale: [1, 1.05, 1] }`, `transition: { duration: 2, repeat: Infinity }` | Hero CTA |
| Note fly out | `initial: { y: 100, rotate: -10, opacity: 0 }`, `animate: { y: 0, rotate: 0, opacity: 1 }` | ReasonsJar draw |
| Stagger children | `variants.visible: { transition: { staggerChildren: 0.15 } }` | WhatIPromise list |
| Blur to sharp | `initial: { filter: "blur(8px)", opacity: 0 }`, `animate: { filter: "blur(0px)", opacity: 1 }` | Timeline card images |
| Floating bob | `animate: { y: [-4, 4, -4] }`, `transition: { duration: 3, repeat: Infinity }` | PressIfYouMissMe button |
| Timer digit swap | `AnimatePresence mode="wait"`, `exit: { opacity: 0, y: -10 }`, `enter: { opacity: 1, y: 0 }` | RelationshipTimer seconds |

### 8.4 Typewriter Effect

Used by: PhotoGallery (lightbox captions) only. The "Moment I Knew" section uses a word-by-word reveal (different mechanic — see Section 7.8). ReasonsJar text appears instantly (fade-in, no typewriter) to avoid overusing the effect.

```typescript
// Inline in PhotoGallery — single use, no shared utility needed
const [displayedText, setDisplayedText] = useState("");

useEffect(() => {
  if (!text) return;
  setDisplayedText("");
  let index = 0;
  const interval = setInterval(() => {
    setDisplayedText(text.slice(0, index + 1));
    index++;
    if (index >= text.length) clearInterval(interval);
  }, 40); // 40ms per character for gallery captions
  return () => clearInterval(interval);
}, [text]);
```

---

## 9. Styling & Tailwind Configuration

### 9.1 Tailwind Config

```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "midnight":     "#0a0e27",
        "midnight-deep":"#141028",
        "spotlight":    "#080c1e",
        "rose-gold":    "#e8a0bf",
        "warm-gold":    "#d4a574",
        "cream":        "#f5f0eb",
        "lavender":     "#b8a9c9",
        "blush":        "#ff6b9d",
      },
      fontFamily: {
        playfair: ["var(--font-playfair)", "serif"],
        inter:    ["var(--font-inter)", "sans-serif"],
        caveat:   ["var(--font-caveat)", "cursive"],
      },
      animation: {
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "float":      "float 3s ease-in-out infinite",
        "shake":      "shake 0.5s ease-in-out",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(232, 160, 191, 0.3)" },
          "50%":      { boxShadow: "0 0 40px rgba(232, 160, 191, 0.6)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(-4px)" },
          "50%":      { transform: "translateY(4px)" },
        },
        "shake": {
          "0%, 100%": { transform: "translateX(0)" },
          "20%":      { transform: "translateX(-8px)" },
          "40%":      { transform: "translateX(8px)" },
          "60%":      { transform: "translateX(-4px)" },
          "80%":      { transform: "translateX(4px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

### 9.2 Global Styles — `styles/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Film grain overlay */
body::after {
  content: '';
  position: fixed;
  inset: 0;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 256px 256px;
  pointer-events: none;
  z-index: 9999;
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Base body styles */
body {
  background-color: #0a0e27;
  color: #f5f0eb;
  font-family: var(--font-inter), sans-serif;
}

/* Custom scrollbar (webkit) */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: #0a0e27;
}
::-webkit-scrollbar-thumb {
  background: #e8a0bf;
  border-radius: 3px;
}

/* Reduced motion override */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 10. Responsive Design

### 10.1 Breakpoint Strategy

| Breakpoint | Width | Device Target | Tailwind Prefix |
|------------|-------|---------------|-----------------|
| Base | 0-374px | Small phones (rare edge case) | (none) |
| Mobile | 375px+ | iPhone 12/13/14, most Android | `sm:` not used — base styles ARE mobile |
| Tablet | 768px+ | iPad, landscape phones | `md:` |
| Desktop | 1280px+ | Laptops, monitors | `lg:` |

**Approach:** Mobile-first. Base CSS = mobile layout. `md:` and `lg:` add complexity.

### 10.2 Per-Component Responsive Behavior

| Component | Mobile (base) | Tablet (md:) | Desktop (lg:) |
|-----------|---------------|--------------|---------------|
| Hero | Text: `text-3xl`, padding: `px-6` | Text: `text-5xl` | Text: `text-6xl`, `max-w-4xl` centered |
| Timeline | Single column, centered cards | Single column, wider cards | Two columns, alternating left/right |
| Timeline micro-interactions | 3 stages (fade, pulse, text) | 5 stages | 5 stages |
| Photo Gallery | 2-column grid | 3-column grid | 4-column grid |
| Lightbox | Full-width image, caption below | 80% width | 60% width, max 900px |
| ReasonsJar | Jar smaller, full-width note | Wider layout | Jar + note side by side |
| RelationshipTimer | 2×2 grid of time boxes | 4 inline boxes | 4 inline boxes, larger |
| MusicPlayer | Bottom-right, smaller | Same | Same, wider pill |
| Floating particles | 8 particles | 12 particles | 15 particles |

### 10.3 Typography Scale

| Element | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Hero headline | `text-3xl` (30px) | `text-5xl` (48px) | `text-6xl` (60px) |
| Section heading | `text-2xl` (24px) | `text-3xl` (30px) | `text-4xl` (36px) |
| Body text | `text-base` (16px) | `text-base` (16px) | `text-lg` (18px) |
| Timeline description | `text-sm` (14px) | `text-base` (16px) | `text-base` (16px) |
| Timer numbers | `text-3xl` (30px) | `text-4xl` (36px) | `text-5xl` (48px) |
| Handwritten accents | `text-xl` (20px) | `text-2xl` (24px) | `text-3xl` (30px) |

---

## 11. Performance Strategy

### 11.1 Critical Rendering Path

```
1. Initial request → middleware check → serve page shell
2. Fonts loaded via next/font (no FOUT — swap strategy)
3. Password gate renders (minimal JS — just a form)
4. After auth → /love page:
   a. Hero section renders immediately (above the fold)
   b. FloatingElements: dynamically imported (non-blocking)
   c. Below-fold sections: lazy via Intersection Observer (React.lazy not needed — whileInView handles visibility)
   d. Images: next/image with blur placeholder + lazy loading
```

### 11.2 Image Optimization

```typescript
// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [375, 640, 768, 1024, 1280],
  },
};

export default nextConfig;
```

**Per-image config:**
| Context | Sizes | Priority |
|---------|-------|----------|
| Gallery thumbnails | `(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw` | `loading="lazy"` |
| Lightbox | `90vw` | `priority={false}`, loaded on demand |
| Love letter scan | `(max-width: 768px) 90vw, 500px` | `loading="lazy"` |
| Timeline images | `(max-width: 768px) 80vw, 400px` | `loading="lazy"` |

**Blur placeholders:** Generate `blurDataURL` during build or use `placeholder="blur"` with local imports.

### 11.3 Code Splitting

| Chunk | Strategy | Reason |
|-------|----------|--------|
| Password gate (`/`) | Default page chunk | Minimal — only the form component |
| Love page (`/love`) | Default page chunk | All section components |
| `FloatingElements` | `next/dynamic` with `ssr: false` | tsparticles is heavy and not critical |
| `EasterEggs` | `next/dynamic` with `ssr: false` | No SSR needed, keyboard listeners only |

### 11.4 Animation Performance

- All animations use `transform` and `opacity` only (GPU-composited, no layout thrashing)
- No `width`, `height`, `top`, `left` animations
- Framer Motion's `layoutId` not used (not needed, avoids layout recalcs)
- Particles render on a `<canvas>` (offloaded from DOM)
- `will-change: transform` applied to timeline cards during animation (removed after)
- Scroll listeners use `{ passive: true }`

---

## 12. SEO & Privacy

### 12.1 robots.txt

```
# public/robots.txt
User-agent: *
Disallow: /
```

### 12.2 Metadata

Set in `app/layout.tsx`:

```typescript
export const metadata: Metadata = {
  title: "For You, Devi",
  description: "A love letter in code.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};
```

### 12.3 Privacy

- No analytics scripts (no Google Analytics, no Vercel Analytics)
- No third-party tracking
- No external API calls from the client (everything is self-contained)
- `httpOnly` auth cookie — not readable by JavaScript
- Images in `/public/images/` are technically accessible by URL, but this is acceptable per BRD

---

## 13. Deployment & Environment

### 13.1 Vercel Configuration

- **Framework preset:** Next.js (auto-detected)
- **Build command:** `next build` (default)
- **Output directory:** `.next` (default)
- **Node.js version:** 20.x
- **Region:** Auto (closest to user — likely `bom1` for India)

### 13.2 Environment Variables

| Variable | Value | Set In |
|----------|-------|--------|
| `SITE_PASSWORD` | `devi` | Vercel dashboard → Environment Variables |
| `NODE_ENV` | `production` | Auto-set by Vercel |

**Local development:** Create `.env.local`:
```env
SITE_PASSWORD=devi
```

Add `.env.local` to `.gitignore` (already in Next.js default gitignore).

### 13.3 Domain

- Initially: Vercel auto-generated URL (e.g., `lovey-dovey-xxx.vercel.app`)
- Future: custom domain like `forpriiyanshii.com` (BRD E-06)

---

## 14. Implementation Phases

### Phase 1 — Foundation (Skeleton)

**Goal:** Running app with auth, routing, and empty page shells.

| # | Task | Files |
|---|------|-------|
| 1 | Initialize Next.js 14 project with TypeScript + Tailwind | `package.json`, `tsconfig.json`, `tailwind.config.ts` |
| 2 | Configure fonts (Playfair, Inter, Caveat) | `app/layout.tsx` |
| 3 | Set up global styles + grain overlay | `styles/globals.css` |
| 4 | Implement middleware auth guard | `middleware.ts`, `lib/auth.ts` |
| 5 | Build API route for password verification | `app/api/auth/route.ts` |
| 6 | Build PasswordGate component (themed, shake, delayed hint) | `components/PasswordGate.tsx`, `app/page.tsx` |
| 7 | Create empty `/love` page with section placeholder divs | `app/love/page.tsx` |

**Milestone:** Password gate works end-to-end. Correct password → cookie set → `/love` accessible. Wrong password → shake + hint after 3 attempts.

### Phase 2 — Core Sections (Static Content)

**Goal:** All sections render with correct content, no animations yet.

| # | Task | Files |
|---|------|-------|
| 8 | Create all data files with BRD content | `data/*.ts` |
| 9 | Build SuspenseInterstitial (basic fade version) | `components/SuspenseInterstitial.tsx` |
| 10 | Build Hero section with CTA (no pulse yet) | `components/Hero.tsx` |
| 11 | Build Timeline + TimelineCard (static, no micro-interactions) | `components/Timeline.tsx`, `components/TimelineCard.tsx` |
| 12 | Build ReasonsJar (basic draw, no animation) | `components/ReasonsJar.tsx` |
| 13 | Build LoveLetter section | `components/LoveLetter.tsx` |
| 14 | Build TheMomentIKnew (static text) | `components/TheMomentIKnew.tsx` |
| 15 | Build PhotoGallery with lightbox (no typewriter yet) | `components/PhotoGallery.tsx` |
| 16 | Build PressIfYouMissMe (basic overlay) | `components/PressIfYouMissMe.tsx` |
| 17 | Build WhatIPromise (static list) | `components/WhatIPromise.tsx` |
| 18 | Build Footer + RelationshipTimer | `components/Footer.tsx`, `components/RelationshipTimer.tsx` |
| 19 | Build MusicPlayer (HTML5 audio) | `components/MusicPlayer.tsx` |

**Milestone:** Full page scrolls through all sections with real content. No animations, no particles, but functionally complete.

### Phase 3 — Animation & Polish

**Goal:** All animations, micro-interactions, and ambient effects.

| # | Task | Files |
|---|------|-------|
| 20 | Add Framer Motion entrance animations to all sections | All components |
| 21 | Implement timeline 5-stage micro-interactions | `components/TimelineCard.tsx` |
| 22 | Implement self-drawing timeline SVG line | `components/Timeline.tsx` |
| 23 | Add jar draw animation (sparkle, fly-out, unfold, typewriter) | `components/ReasonsJar.tsx` |
| 24 | Add word-by-word reveal to TheMomentIKnew | `components/TheMomentIKnew.tsx` |
| 25 | Add typewriter captions to gallery lightbox | `components/PhotoGallery.tsx` |
| 26 | Add CTA heartbeat pulse | `components/Hero.tsx` |
| 27 | Add floating bob to PressIfYouMissMe button | `components/PressIfYouMissMe.tsx` |
| 28 | Add timer digit transition animation | `components/RelationshipTimer.tsx` |
| 29 | Implement FloatingElements (tsparticles) | `components/FloatingElements.tsx` |
| 30 | Implement `prefers-reduced-motion` fallbacks | `hooks/useReducedMotion.ts`, all components |

**Milestone:** Full experience with all animations. Feels cinematic and alive.

### Phase 4 — Easter Eggs & Edge Cases

**Goal:** Hidden features, responsive polish, testing.

| # | Task | Files |
|---|------|-------|
| 31 | Implement Konami code listener | `components/EasterEggs.tsx` |
| 32 | Implement hidden heart easter egg | `components/EasterEggs.tsx` |
| 33 | Implement photo 10-click easter egg | `components/PhotoGallery.tsx` |
| 34 | Implement "Rehpatt" footer easter egg | `components/Footer.tsx` |
| 35 | Implement "Gay" joke easter egg | `components/EasterEggs.tsx` |
| 36 | Responsive QA — test all 3 breakpoints | — |
| 37 | Mobile animation simplification (3-stage timeline) | `components/TimelineCard.tsx` |
| 38 | Performance audit (Lighthouse, bundle analysis) | — |
| 39 | Add `robots.txt` and verify no-index | `public/robots.txt` |
| 40 | Final content pass — Kushik writes personal copy | `data/*.ts`, components with hardcoded copy |

**Milestone:** Ship-ready.

### Phase 5 — Deploy

| # | Task |
|---|------|
| 41 | Push to GitHub |
| 42 | Connect repo to Vercel |
| 43 | Set `SITE_PASSWORD` env var in Vercel dashboard |
| 44 | Verify production build — test full flow on mobile |
| 45 | Share link with Priiyanshii |

---

## 15. Testing Checklist

This is not automated testing — it's a manual QA checklist mapped to BRD acceptance criteria.

### Authentication (AC-01, AC-02, AC-31, AC-34)
- [ ] Visiting `/love` without auth → redirects to `/`
- [ ] Viewing page source of `/` shows no protected content
- [ ] Wrong password → shake animation + "Try again"
- [ ] 3 wrong attempts → hint fades in
- [ ] Correct password ("Devi", case-insensitive) → auth succeeds
- [ ] After auth, `/love` is accessible without re-entering password
- [ ] Cookie persists across browser restart (30-day expiry)

### Interstitial (AC-03, AC-04)
- [ ] After first-time auth → black screen → "Before the world changed..." → "I met someone." → hero
- [ ] Total interstitial duration: 3-4 seconds
- [ ] Returning visit (same session) → skips interstitial, goes to hero

### Hero (AC-05, AC-06)
- [ ] "Read Our Story" CTA is visible with pulse/glow
- [ ] Clicking CTA smooth-scrolls to timeline

### Timeline (AC-07, AC-08, AC-09, AC-10, AC-24, AC-26, AC-30, AC-35)
- [ ] All 7 milestones render with correct dates, titles, descriptions
- [ ] Milestone #7 shows "???" date and "still being written" closing
- [ ] Each card has its icon at the timeline dot
- [ ] Desktop: 5-stage micro-interactions play on first scroll into view
- [ ] Animations don't replay on re-scroll
- [ ] Mobile: simplified to 3 stages
- [ ] Self-drawing line extends as user scrolls
- [ ] Copy tone reads as raw/authentic

### Reasons Jar (AC-11)
- [ ] "Draw a Reason" pulls a unique reason each time
- [ ] No repeats until all reasons are drawn
- [ ] Sparkle + unfold + typewriter animation plays on each draw
- [ ] After all drawn: "That's not even all of them" message

### Love Letter (AC-12)
- [ ] Letter image displays clearly
- [ ] Typed transcript is readable alongside

### The Moment I Knew (AC-32)
- [ ] Full-viewport section with centered text
- [ ] Words fade in one by one on scroll

### Photo Gallery (AC-13, AC-33)
- [ ] All photos render in aesthetic layout
- [ ] Lightbox opens on click
- [ ] Caption types out letter-by-letter in lightbox

### Music (AC-14)
- [ ] Play/pause toggle works
- [ ] Song loops
- [ ] Paused by default

### Press If You Miss Me (AC-15, AC-16)
- [ ] Button triggers full-screen overlay with sweet message
- [ ] Multiple presses show different messages

### What I Promise (AC-25)
- [ ] Promises animate in with stagger on scroll
- [ ] Content matches BRD

### Relationship Timer (AC-17, AC-18)
- [ ] Shows days, hours, minutes, seconds
- [ ] Seconds tick in real-time
- [ ] Styled in warm gold/rose-gold boxes

### Easter Eggs (AC-27, AC-28, AC-29)
- [ ] Photo tapped 10 times → "stop staring at her" toast
- [ ] Konami code → "hug mode" overlay (desktop)
- [ ] Hidden heart → click reveals message

### Cross-Cutting (AC-19, AC-20, AC-22, AC-23, AC-36)
- [ ] Responsive on iPhone 12+ sizes
- [ ] Loads under 3 seconds on 4G
- [ ] Deployed on Vercel
- [ ] Animations smooth, no jank
- [ ] `prefers-reduced-motion` respected
- [ ] Background grain texture visible but subtle

---

*"Now it's your turn to show her what 'right' looks like — in code."*
