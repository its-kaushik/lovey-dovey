# Implementation Plan

## Project: Lovey Dovey

**Based on:** BRD v1.3, Tech Spec v1.1 (post-review)
**Date:** 3 April 2026

---

## Dependencies (Exact Package List)

Install these and **only** these. Do not add additional packages unless explicitly noted in a sprint task.

```
next
react
react-dom
typescript
tailwindcss
postcss
autoprefixer
framer-motion
@tsparticles/react      ← Sprint 4 only, not before
@tsparticles/slim       ← Sprint 4 only, not before
@types/react
@types/react-dom
@types/node
```

---

## How to Read This Plan

This plan is organized into **7 sprints**, each with a clear goal, a dependency map showing what must be done before what, the exact files to create/edit, implementation notes that go beyond the tech spec, and a verification step at the end to confirm the sprint is done before moving on.

Sprints are sequential — each builds on the previous. Within a sprint, tasks are numbered and their dependencies are explicit so you know what can be parallelized and what must be serial.

---

## Sprint 1 — Project Scaffolding & Auth

**Goal:** A running Next.js app where the password gate protects `/love` via middleware. No content yet — just the skeleton and security layer.

**Why this is first:** Everything else depends on having a working project with auth. If auth is broken, no other feature can be meaningfully tested.

> **IMPLEMENTATION RULES FOR THIS SPRINT**
> - Do not implement features from later sprints
> - Only create files listed in this sprint
> - Do not add `framer-motion`, `@tsparticles/*`, or any extra dependencies — only the core Next.js/Tailwind stack
> - Do not build any content sections — only the auth layer and empty shells

### Dependency Graph

```
1.1 Init project
 ├──→ 1.2 Tailwind config
 ├──→ 1.3 Global styles
 ├──→ 1.4 Root layout (fonts + metadata)
 │         └──→ 1.7 Password gate page (app/page.tsx)
 ├──→ 1.5 Auth library (lib/auth.ts)
 │         ├──→ 1.6 Middleware
 │         └──→ 1.8 API route
 └──→ 1.9 Empty /love page
```

### Tasks

#### 1.1 — Initialize Next.js Project

```bash
npx create-next-app@latest lovey-dovey --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*"
```

**Then:**
- Delete boilerplate: remove default `page.tsx` content, `favicon.ico` placeholder, default CSS
- Create directory stubs: `components/`, `data/`, `lib/`, `hooks/`, `public/images/`, `public/music/`, `app/(protected)/love/`
- Create `.env.local` with `SITE_PASSWORD=devi`
- Add to `.gitignore` if not already present: `.env.local`

**Files created:** `package.json`, `tsconfig.json`, `next.config.mjs`, `.env.local`, empty directories

#### 1.2 — Tailwind Config

**File:** `tailwind.config.ts`

Configure the full custom theme from Tech Spec Section 9.1:
- Custom colors: `midnight`, `midnight-deep`, `spotlight`, `rose-gold`, `warm-gold`, `cream`, `lavender`, `blush`
- Custom font families: `playfair`, `inter`, `caveat` (mapped to CSS variables)
- Custom keyframes + animations: `pulse-glow`, `float`, `shake`

**Depends on:** 1.1

#### 1.3 — Global Styles

**File:** `styles/globals.css`

From Tech Spec Section 9.2:
- Tailwind directives (`@tailwind base/components/utilities`)
- Film grain `body::after` overlay (opacity 0.03, SVG noise pattern)
- `html { scroll-behavior: smooth }`
- Body base styles (midnight background, cream text, Inter font)
- Custom webkit scrollbar (rose-gold thumb)
- `prefers-reduced-motion` blanket override

**Depends on:** 1.1

#### 1.4 — Root Layout

**File:** `app/layout.tsx`

- Import and configure 3 Google Fonts via `next/font/google`: Playfair Display, Inter, Caveat
- Set CSS variables (`--font-playfair`, `--font-inter`, `--font-caveat`) on `<html>`
- Export `metadata` with `title: "For You, Devi"`, `robots: { index: false, follow: false }`
- Import `globals.css`
- Render `<body className={`${playfair.variable} ${inter.variable} ${caveat.variable} font-inter bg-midnight text-cream`}>`

**Depends on:** 1.2, 1.3

#### 1.5 — Auth Library

**File:** `lib/auth.ts`

```typescript
export const AUTH_COOKIE_NAME = "lovey-dovey-auth";
export const MAX_COOKIE_AGE = 60 * 60 * 24 * 30; // 30 days
```

Shared constants used by both middleware and API route. Keeps the cookie name in one place.

**Depends on:** 1.1

#### 1.6 — Middleware

**File:** `middleware.ts`

From Tech Spec Section 5.2:
- Import `AUTH_COOKIE_NAME` from `lib/auth`
- Check cookie on `/love` routes
- Redirect to `/` if missing or invalid
- `config.matcher: ["/love/:path*"]` — wildcard to future-proof against nested routes under `/love/`

**Verify manually:** Visit `localhost:3000/love` in browser → should redirect to `/`.

**Depends on:** 1.5

#### 1.7 — Password Gate Page

**File:** `app/page.tsx` (client component)
**File:** `components/PasswordGate.tsx` (client component)

**PasswordGate component:**
- Props: `onSuccess: () => void`
- State: `password`, `errorType: "incorrect" | "network" | null`, `attempts`, `loading`
- Themed UI: love-letter envelope metaphor. Dark background, centered card, romantic styling.
- Input: `type="password"`, placeholder "Enter the password..."
- Submit handler with `try/catch` (Tech Spec Section 7.1, post-review fix):
  - `POST /api/auth` with `{ password }`
  - On `res.ok` → `onSuccess()`
  - On non-ok → `setErrorType("incorrect")`, increment attempts
  - On catch → `setErrorType("network")`, show "Something went wrong. Try again?"
  - Network errors do NOT increment attempt counter
- On `errorType === "incorrect"`: shake animation on input (CSS `animate-shake`)
- On `attempts >= 3`: fade in hint — "What does he call you that means goddess?"
- Hint uses Framer Motion `AnimatePresence` for smooth fade-in

**Page (app/page.tsx):**
- State: `isAuthenticated`, `showInterstitial`
- Renders `<PasswordGate onSuccess={handleSuccess} />`
- On success: for now, just `router.push("/love")` (interstitial comes in Sprint 2)

**Depends on:** 1.4

#### 1.8 — API Route

**File:** `app/api/auth/route.ts`

From Tech Spec Section 5.3 (post-review fixes):
- No fallback password — if `process.env.SITE_PASSWORD` is undefined, return 500
- Case-insensitive comparison: `password.trim().toLowerCase() === sitePassword.toLowerCase()`
- On success: set `httpOnly`, `secure` (in production), `sameSite: "strict"` cookie
- Cookie max age: 30 days

**Depends on:** 1.5

#### 1.9 — Empty /love Page (Route Group)

**File:** `app/(protected)/love/page.tsx`

Uses a **route group** `(protected)` — the `(protected)` folder doesn't affect the URL (still serves at `/love`), but lets us later add `app/(protected)/layout.tsx` for shared elements like music player, particles, and easter eggs without cramming them into the page component.

Minimal placeholder — just enough to confirm auth works:

```tsx
export default function LovePage() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <h1 className="font-playfair text-4xl text-rose-gold">
        For you, Devi.
      </h1>
    </main>
  );
}
```

**Depends on:** 1.4

### Sprint 1 Verification

- [ ] `npm run dev` starts without errors
- [ ] `localhost:3000` shows the themed password gate
- [ ] Wrong password → shake + "Try again"
- [ ] 3 wrong passwords → hint fades in
- [ ] "devi" (any case) → redirects to `/love`, shows placeholder
- [ ] Directly visiting `/love` without auth → redirects to `/`
- [ ] Refresh `/love` → stays (cookie persists)
- [ ] Film grain overlay is barely visible on both pages
- [ ] Fonts are loading (Playfair on headings, Inter on body text)
- [ ] Page title in browser tab: "For You, Devi"

---

## Sprint 2 — Data Layer & Interstitial

**Goal:** All content data files created. Suspense interstitial wired up between auth and hero.

**Why this is second:** Data files are a dependency for every content section in Sprint 3. The interstitial is placed here because it modifies the auth flow from Sprint 1 — better to get the full auth→interstitial→redirect flow right before building all sections.

> **IMPLEMENTATION RULES FOR THIS SPRINT**
> - Do not implement features from later sprints
> - Only create files listed here
> - Do not add `framer-motion` yet — the interstitial can use CSS transitions or be the first `framer-motion` usage (install it now if needed for the interstitial, but don't build section animations)
> - Do not build any content section components

### Dependency Graph

```
2.1 Data files (all 5, parallel) ──→ Sprint 3 needs these
2.2 SuspenseInterstitial component
 └──→ 2.3 Wire interstitial into auth flow (modify app/page.tsx)
2.4 next.config.mjs (image optimization)
2.5 robots.txt
2.6 Shared utilities (lib/random.ts, hooks/useRelationshipTimer.ts, hooks/useMediaQuery.ts)
2.7 Motion variants (lib/motion.ts)
```

### Tasks

#### 2.1 — Data Files

All 5 files can be created in parallel. Use the TypeScript interfaces from Tech Spec Section 4.

**File:** `data/milestones.ts`
- Define `Milestone` interface (id, icon, date, title, description, image?, imageAlt?, isOpenEnded?)
- Export `milestones` array with all 7 entries from BRD Section 4.4
- Milestone #7: `date: "???"`, `isOpenEnded: true`
- Include the gajar ka halwa aside as a smaller inline entry between milestones 1 and 2 (id: 1.5 or separate `aside` field on milestone 1)

**File:** `data/reasons.ts`
- Define `Reason` interface (id, text)
- Export `reasons` array — start with the 10 from BRD Section 4.5, add 5-10 more to reach 15-20 minimum
- Kushik to write the additional reasons during this sprint

**File:** `data/promises.ts`
- Define `Promise` interface (id, text) — note: name the interface `PromiseItem` to avoid collision with native `Promise`
- Export `promises` array — all 7 from BRD Section 4.11

**File:** `data/missYouMessages.ts`
- Export `missYouMessages` string array — all 8 from BRD Section 4.10

**File:** `data/gallery.ts`
- Define `GalleryItem` interface (id, src, alt, caption?, rotation?)
- Export `galleryItems` array — initially empty or with placeholder paths
- Kushik to add actual photo paths when assets are ready

**Depends on:** Sprint 1 complete

#### 2.2 — SuspenseInterstitial Component

**File:** `components/SuspenseInterstitial.tsx`

From Tech Spec Section 7.2:
- Props: `onComplete: () => void`
- Full black screen (`fixed inset-0 z-50 bg-black`)
- Line 1 ("Before the world changed...") fades in at 0.5s
- Line 2 ("I met someone.") fades in at 2.0s
- At 3.0s, entire container fades out (0.5s duration)
- On fade-out complete → call `onComplete()`
- Text: Playfair Display, `text-2xl md:text-3xl`, cream color

**Implementation note:** Use Framer Motion's `onAnimationComplete` on the container's exit animation to trigger `onComplete`. The container itself uses `animate` to control the sequence — no need for manual timeouts.

**Depends on:** Sprint 1 complete

#### 2.3 — Wire Interstitial into Auth Flow

**File:** `app/page.tsx` (modify existing)

Update the password gate page to handle the interstitial flow:
- After `onSuccess`:
  1. Check `sessionStorage.getItem("interstitial-seen")`
  2. If not seen → render `<SuspenseInterstitial onComplete={handleInterstitialDone} />`
  3. `handleInterstitialDone`: set `sessionStorage.setItem("interstitial-seen", "true")`, then `router.push("/love")`
  4. If already seen → skip directly to `router.push("/love")`

**Conditional rendering:**
```tsx
{showInterstitial ? (
  <SuspenseInterstitial onComplete={handleInterstitialDone} />
) : (
  <PasswordGate onSuccess={handleSuccess} />
)}
```

**Depends on:** 2.2

#### 2.4 — Next.js Config

**File:** `next.config.mjs`

From Tech Spec Section 11.2:
```javascript
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [375, 640, 768, 1024, 1280],
  },
};
```

**Depends on:** Sprint 1 complete

#### 2.5 — robots.txt

**File:** `public/robots.txt`

```
User-agent: *
Disallow: /
```

**Depends on:** Sprint 1 complete

#### 2.6 — Shared Utilities

These utilities are used by multiple components in Sprint 3+. Creating them now avoids repeating logic later.

**File:** `lib/random.ts`

```typescript
/**
 * Returns a random index from 0 to length-1.
 * If `avoid` is provided, guarantees the returned index is different
 * (used to prevent repeating the same random pick twice in a row).
 */
export function randomIndex(length: number, avoid?: number): number {
  if (length <= 1) return 0;
  let index: number;
  do {
    index = Math.floor(Math.random() * length);
  } while (index === avoid && length > 1);
  return index;
}
```

Used by: ReasonsJar (random draw), PressIfYouMissMe (random message), Gallery easter egg reset.

**File:** `hooks/useRelationshipTimer.ts`

```typescript
export function useRelationshipTimer() {
  const START_DATE = new Date("2026-03-24T00:00:00+05:30");
  const [elapsed, setElapsed] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const tick = () => {
      const diff = Date.now() - START_DATE.getTime();
      setElapsed({
        seconds: Math.floor(diff / 1000) % 60,
        minutes: Math.floor(diff / (1000 * 60)) % 60,
        hours:   Math.floor(diff / (1000 * 60 * 60)) % 24,
        days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return elapsed;
}
```

Extracts timer logic from the component. `RelationshipTimer.tsx` becomes purely presentational:
```tsx
const { days, hours, minutes, seconds } = useRelationshipTimer();
```

**File:** `hooks/useMediaQuery.ts`

```typescript
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(query);
    setMatches(mq.matches);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [query]);

  return matches;
}
```

Used in Sprint 4 for timeline animation simplification on mobile — replaces the unsafe `window.innerWidth` check. Call as `useMediaQuery("(min-width: 1024px)")`.

**Depends on:** Sprint 1 complete

#### 2.7 — Motion Variants

**File:** `lib/motion.ts`

Centralized Framer Motion variant definitions. Prevents repeating the same animation objects across every component.

```typescript
import { Variants } from "framer-motion";

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
};

export const slideLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export const slideRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
};

export const blurToSharp: Variants = {
  hidden: { opacity: 0, filter: "blur(8px)" },
  visible: { opacity: 1, filter: "blur(0px)", transition: { duration: 0.6 } },
};

// Reduced motion: no animation, instant visibility
export const noMotion: Variants = {
  hidden: { opacity: 1 },
  visible: { opacity: 1 },
};
```

Components import what they need: `import { fadeUp, staggerContainer } from "@/lib/motion"`. When `reducedMotion` is true, swap in `noMotion`.

**Depends on:** Sprint 1 complete (installs framer-motion)

### Sprint 2 Verification

- [ ] All 5 data files exist and export typed arrays
- [ ] Data files import without TypeScript errors
- [ ] After entering correct password: black screen → "Before the world changed..." → "I met someone." → redirect to `/love`
- [ ] Interstitial takes ~3.5 seconds total
- [ ] Refresh the page (same session) → entering password skips interstitial, goes straight to `/love`
- [ ] New session (close tab, reopen) → interstitial plays again after auth
- [ ] `robots.txt` accessible at `localhost:3000/robots.txt`
- [ ] `lib/random.ts` exports `randomIndex` function
- [ ] `hooks/useRelationshipTimer.ts` exports the hook
- [ ] `hooks/useMediaQuery.ts` exports the hook
- [ ] `lib/motion.ts` exports variant objects

---

## Sprint 3 — Core Sections (Static Content)

**Goal:** All 10 content sections render on `/love` with real content, correct layout, and basic responsiveness. No animations yet — everything appears immediately on scroll.

**Why no animations yet:** Building animations on top of broken layout is painful. Get the content, structure, and responsiveness right first, then layer animations in Sprint 4.

> **IMPLEMENTATION RULES FOR THIS SPRINT**
> - Do not implement features from later sprints (no animations, no easter eggs, no particles)
> - Only create files listed here
> - Do not install `@tsparticles/*` yet
> - Components render static content only — no Framer Motion `whileInView`, no typewriter effects
> - Use `randomIndex` from `lib/random.ts` for all random selection (do not write inline `Math.random` logic)
> - Use `useRelationshipTimer` hook for the timer (do not put interval logic in the component)

### Dependency Graph

```
All tasks in this sprint depend on Sprint 2 (data files + shared utilities).
Within this sprint, sections are independent — build in any order.
The final task (3.11) wires them all together.

3.1  Hero
3.2  Timeline + TimelineCard          ← needs milestones data
3.3  ReasonsJar                       ← needs reasons data, lib/random.ts
3.4  LoveLetter
3.5  TheMomentIKnew
3.6  PhotoGallery                     ← needs gallery data
3.7  PressIfYouMissMe                 ← needs missYouMessages data, lib/random.ts
3.8  WhatIPromise                     ← needs promises data
3.9  RelationshipTimer                ← needs hooks/useRelationshipTimer.ts
3.10 Footer
  └──→ 3.11 Wire all sections into /love page + protected layout
3.12 MusicPlayer (parallel with everything — it's independent)
3.13 ScrollProgress bar (parallel)
```

### Tasks

#### 3.1 — Hero Section

**File:** `components/Hero.tsx` (client component)

- Full-viewport: `min-h-screen flex flex-col items-center justify-center`
- Headline: "For My Devi" — `font-playfair text-3xl md:text-5xl lg:text-6xl text-cream`
- Tagline: "The most chaotic, beautiful thing that ever happened to me" — `font-caveat text-xl md:text-2xl lg:text-3xl text-lavender`
- "Read Our Story" button — smooth-scrolls to `#timeline`
  - `border border-rose-gold rounded-full px-8 py-3 text-rose-gold font-playfair`
  - No pulse animation yet (Sprint 4)
  - `onClick: () => document.getElementById("timeline")?.scrollIntoView({ behavior: "smooth" })`
- No entrance animations yet — content just renders

**Copy note:** Kushik should replace the headline/tagline with his own words. These are placeholders.

#### 3.2 — Timeline + TimelineCard

**File:** `components/Timeline.tsx` (client component)
**File:** `components/TimelineCard.tsx` (client component)

**Timeline.tsx:**
- Props: `milestones: Milestone[]`
- Section with `id="timeline"`
- Section heading: "Our Story" — `font-playfair text-2xl md:text-3xl lg:text-4xl`
- Vertical center line — a simple CSS border for now (`border-l-2 border-rose-gold/30`), not the SVG self-drawing line yet
- Maps milestones to `<TimelineCard />` components
- Desktop (lg:): cards alternate left/right via `flex-row-reverse` on odd indices
- Mobile: single column, cards centered

**TimelineCard.tsx:**
- Props: `milestone: Milestone`, `index: number`
- Displays: icon badge (emoji in a circle at the timeline dot), date, title, description
- If `milestone.image`: render `next/image` with lazy loading and blur placeholder
- If `milestone.isOpenEnded`: slightly different styling — italic text, no date badge, more muted
- No micro-interaction animations yet — card just renders statically

**Layout consideration:** The card connects to the center line via a small horizontal connector. On desktop, left cards have the connector on their right edge; right cards on their left edge. On mobile, all connectors come from the left edge to a left-aligned line.

#### 3.3 — ReasonsJar

**File:** `components/ReasonsJar.tsx` (client component)

- Props: `reasons: Reason[]`
- State: `drawnIds: Set<number>`, `currentReason: Reason | null`, `allDrawn: boolean`
- Jar visual: for now, a styled container (rounded rectangle with subtle border, rose-gold accent). A proper SVG jar illustration can be added later or sourced from an SVG library.
- "Draw a Reason" button below the jar
- On click: filter to undrawn reasons, use `randomIndex(remaining.length)` from `lib/random.ts` to pick one, then add to `drawnIds` via functional state updater
- Displays the drawn reason in a card/note below the jar — styled as a paper note (cream background, slight shadow, Caveat font)
- No sparkle/fly-out/unfold animation yet — reason just appears
- When all drawn: show "That's not even all of them. I'll keep adding."

#### 3.4 — LoveLetter

**File:** `components/LoveLetter.tsx` (client component)

- Section heading: "The Love Letter"
- Her letter: `next/image` in a polaroid-style frame (white border, thicker at bottom, slight rotation via `rotate-[-2deg]`, drop shadow)
  - `src="/images/love-letter.jpg"` — Kushik to add the scan
  - If image not available yet, show a placeholder styled card with the letter text
- Typed transcript below in Caveat font — the quote from BRD Section 4.6
- Kushik's counter letter below in Inter font — placeholder text until Kushik writes it

#### 3.5 — TheMomentIKnew

**File:** `components/TheMomentIKnew.tsx` (client component)

- Full-viewport section: `min-h-screen flex items-center justify-center bg-spotlight`
- Heading: "The Moment I Knew" — `font-caveat text-2xl md:text-3xl`
- One paragraph — draft from BRD Section 4.7
- Large serif font: `font-playfair text-lg md:text-xl lg:text-2xl leading-relaxed`
- Centered, max-width constraint: `max-w-2xl mx-auto text-center`
- No word-by-word reveal yet — full text renders immediately

**Content note:** Kushik should rewrite this paragraph in his own voice. The BRD draft is a starting point.

#### 3.6 — PhotoGallery

**File:** `components/PhotoGallery.tsx` (client component)

- Props: `items: GalleryItem[]`
- State: `selectedItem: GalleryItem | null`
- Grid: `grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4`
- Each item: polaroid card (white border, slight rotation from data, drop shadow)
  - `next/image` with `sizes` attribute for responsive loading
  - Hover: subtle scale(1.02) via CSS transition
- **Lightbox modal:**
  - Triggered on card click → `setSelectedItem(item)`
  - Full-screen dark overlay (`fixed inset-0 bg-black/90 z-50`)
  - Centered image, large
  - Caption text below image (no typewriter yet — renders immediately)
  - Close: click backdrop, X button, or Escape key (add `keydown` listener)
- No 10-click easter egg yet (Sprint 5)

**If no photos yet:** Add 3-4 placeholder cards with generic text so layout can be validated.

#### 3.7 — PressIfYouMissMe

**File:** `components/PressIfYouMissMe.tsx` (client component)

- Props: `messages: string[]`
- State: `showOverlay: boolean`, `currentMessage: string`, `lastIndex: number`
- Button: "Press if you miss me" — `font-caveat`, rounded, rose-gold border
- On click:
  - Pick random message using `randomIndex(messages.length, lastIndex)` from `lib/random.ts` (avoids immediate repeat)
  - Set `showOverlay: true`
- Overlay: full-screen, dark backdrop, message centered in `font-playfair text-2xl`, cream
- Dismiss: click anywhere → `setShowOverlay(false)`
- No floating animation or heart burst yet

#### 3.8 — WhatIPromise

**File:** `components/WhatIPromise.tsx` (client component)

- Props: `promises: PromiseItem[]`
- Section heading: "What I Promise" — `font-playfair`
- "I promise to:" intro line — `font-inter text-lavender`
- Vertical list, each prefixed with `♡` in rose-gold
- Each promise in Inter font
- Closing line: "That's not everything. But it's a start." — `font-caveat text-lavender italic`
- No stagger animation yet — all items render immediately

#### 3.9 — RelationshipTimer

**File:** `components/RelationshipTimer.tsx` (client component)

- Uses `useRelationshipTimer()` hook from `hooks/useRelationshipTimer.ts` — component is purely presentational
- `const { days, hours, minutes, seconds } = useRelationshipTimer();`
- 4 styled boxes: `grid grid-cols-2 md:grid-cols-4 gap-4`
  - Each box: `bg-midnight-deep rounded-xl p-4`, number in `font-playfair text-3xl md:text-4xl lg:text-5xl text-warm-gold`, label in `font-inter text-sm text-lavender`
- Label above: "Together for" — `font-caveat text-xl text-cream`
- Label below: "...and counting forever" — `font-caveat text-lg text-lavender`
- No digit transition animation yet

#### 3.10 — Footer

**File:** `components/Footer.tsx` (client component)

- Closing message: "This is just the beginning, Devi." — `font-playfair text-xl text-cream`
- Embeds `<RelationshipTimer />`
- Credit: "Made with love by your shy calm guy" — `font-inter text-sm text-lavender/50`
- Bottom padding for breathing room

#### 3.11 — Wire Sections into /love Page + Protected Layout

**File:** `app/(protected)/love/page.tsx` (modify)

Replace placeholder with full section composition:

```tsx
import { milestones } from "@/data/milestones";
import { reasons } from "@/data/reasons";
import { promises } from "@/data/promises";
import { missYouMessages } from "@/data/missYouMessages";
import { galleryItems } from "@/data/gallery";

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

**File:** `app/(protected)/layout.tsx` (new)

The **protected layout** wraps all routes inside `(protected)`. This is where persistent cross-page elements live — music player now, floating elements and easter eggs later:

```tsx
export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MusicPlayer />
      {children}
    </>
  );
}
```

This keeps `MusicPlayer` (and later `FloatingElements`, `EasterEggs`, `ScrollProgress`) out of the page component, mounted at the layout level. If we ever add more protected routes, they automatically get these elements.

No `FloatingElements` or `EasterEggs` yet — those come in Sprints 4 and 5.

**Note:** `page.tsx` is a server component. Data imports happen server-side. Each section component is a client component receiving serializable props. The `layout.tsx` is also server but wraps client components.

**Depends on:** 3.1–3.10, 3.12

#### 3.12 — MusicPlayer

**File:** `components/MusicPlayer.tsx` (client component)

- Fixed position: `fixed bottom-6 right-6 z-40`
- `<audio ref={audioRef} src="/music/our-song.mp3" loop />`
- State: `isPlaying: boolean`
- Toggle button: play/pause icon + "Our Song" text
- Paused by default
- Styled as a pill: `bg-midnight-deep/80 backdrop-blur-sm rounded-full px-4 py-2 border border-rose-gold/30`

**If no song yet:** Component still works — button will be non-functional until an mp3 is in `/public/music/`. That's fine.

**Mounted in:** `app/(protected)/layout.tsx` (not the page — it's a persistent element).

#### 3.13 — ScrollProgress Bar

**File:** `components/ScrollProgress.tsx` (client component)

A thin rose-gold progress bar fixed at the top of the viewport. Shows how far she's scrolled through the story. Subtle but cinematic — reinforces the feeling of moving through a narrative.

- Fixed position: `fixed top-0 left-0 z-50 h-[2px] bg-rose-gold`
- Width driven by scroll position: `style={{ width: `${progress * 100}%` }}`
- Smooth transition on width: `transition-[width] duration-150 ease-out`

```typescript
const [progress, setProgress] = useState(0);

useEffect(() => {
  const handleScroll = () => {
    const scrolled = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    setProgress(total > 0 ? scrolled / total : 0);
  };
  window.addEventListener("scroll", handleScroll, { passive: true });
  return () => window.removeEventListener("scroll", handleScroll);
}, []);
```

**Mounted in:** `app/(protected)/layout.tsx` — add alongside `MusicPlayer`:

```tsx
export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ScrollProgress />
      <MusicPlayer />
      {children}
    </>
  );
}
```

### Sprint 3 Verification

- [ ] `/love` page renders all 10 sections in the correct order
- [ ] Scrolling through the page shows all content
- [ ] Timeline shows all 7 milestones with correct dates, titles, descriptions, icons
- [ ] Milestone #7 has "???" date and open-ended styling
- [ ] ReasonsJar draws random reasons without repeats
- [ ] "Draw a Reason" exhausts all reasons → shows completion message
- [ ] PressIfYouMissMe shows random messages, different on each press
- [ ] RelationshipTimer ticks every second with correct values
- [ ] Gallery lightbox opens/closes correctly (click card → modal → dismiss)
- [ ] Music player toggle works (if song file exists)
- [ ] Page is scrollable on mobile (375px) — no horizontal overflow
- [ ] Page is readable on desktop (1280px) — content doesn't stretch edge-to-edge
- [ ] Scroll progress bar at top tracks scroll position accurately
- [ ] No TypeScript errors, no console errors

---

## Sprint 4 — Animations & Motion

**Goal:** Every section has its entrance animation, micro-interactions, and ambient effects. The site goes from "functional" to "cinematic."

**Why this is a separate sprint:** Animations are layered on top of working layout. If a section's layout is wrong, fixing it after adding complex Framer Motion variants is much harder. Sprint 3's stable layout is the foundation.

> **IMPLEMENTATION RULES FOR THIS SPRINT**
> - Do not implement easter eggs (Sprint 5)
> - Install `@tsparticles/react` and `@tsparticles/slim` now (task 4.12 only)
> - Use variants from `lib/motion.ts` — do not define inline variant objects in components
> - Use `useMediaQuery("(min-width: 1024px)")` from `hooks/useMediaQuery.ts` for mobile detection — do NOT use `window.innerWidth` directly
> - Use `useReducedMotion()` in every component that has animation — swap to `noMotion` variant when true
> - Every `setInterval` and `setTimeout` must be cleared in the `useEffect` cleanup return

### Dependency Graph

```
4.1 useReducedMotion hook ──→ Used by all animation tasks below
4.2 Section entrance animations (all sections, parallel) ← uses lib/motion.ts variants
4.3 Hero CTA pulse
4.4 Timeline self-drawing line (useScroll)
4.5 Timeline 5-stage micro-interactions ← uses useMediaQuery for mobile detection
4.6 ReasonsJar draw animation (sparkle + fly-out + unfold)
4.7 TheMomentIKnew word-by-word reveal ← ensure interval cleanup
4.8 Gallery lightbox typewriter caption ← ensure interval cleanup
4.9 PressIfYouMissMe floating bob + heart burst
4.10 WhatIPromise stagger animation ← uses staggerContainer from lib/motion.ts
4.11 RelationshipTimer digit transition
4.12 FloatingElements (tsparticles) — dynamically imported
```

### Tasks

#### 4.1 — useReducedMotion Hook

**File:** `hooks/useReducedMotion.ts`

From Tech Spec Section 8.2. Returns `boolean`. Every animation task below should check this hook and fall back to simple fade-in (or no animation) when `true`.

#### 4.2 — Section Entrance Animations

**All section components** — import `fadeUp` and `noMotion` from `lib/motion.ts`:

```tsx
import { fadeUp, noMotion } from "@/lib/motion";

const reducedMotion = useReducedMotion();

<motion.section
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.2 }}
  variants={reducedMotion ? noMotion : fadeUp}
>
```

Apply to: Hero (on load, not scroll), Timeline, ReasonsJar, LoveLetter, TheMomentIKnew, PhotoGallery, PressIfYouMissMe, WhatIPromise, Footer.

Do NOT define inline variant objects — always import from `lib/motion.ts`.

#### 4.3 — Hero CTA Pulse

**File:** `components/Hero.tsx` (modify)

Add Framer Motion heartbeat animation to the "Read Our Story" button:
```tsx
animate={{ scale: [1, 1.05, 1] }}
transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
```

Plus Tailwind glow: `shadow-[0_0_20px_rgba(232,160,191,0.3)]`, `animate-pulse-glow` (from tailwind config).

When `reducedMotion`: no scale animation, keep the static glow.

#### 4.4 — Timeline Self-Drawing Line

**File:** `components/Timeline.tsx` (modify)

Replace the static CSS border with an SVG line driven by Framer Motion `useScroll` (post-review fix):

```tsx
const { scrollYProgress } = useScroll({
  target: sectionRef,
  offset: ["start end", "end start"],
});
const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);
```

Render `<motion.line>` with `style={{ pathLength }}`.

When `reducedMotion`: show the full line immediately (no draw animation).

#### 4.5 — Timeline 5-Stage Micro-Interactions

**File:** `components/TimelineCard.tsx` (modify)

From Tech Spec Section 7.5. Use `whileInView` + `staggerChildren`:

| Stage | What | Delay |
|-------|------|-------|
| 1 | Card slides in from left/right + fade | 0ms |
| 2 | Sparkle burst at timeline dot | +200ms |
| 3 | Heart icon pulses (scale 1→1.3→1) | +400ms |
| 4 | Image: blur(8px)→blur(0) + fade | +500ms |
| 5 | Description text: block fade in | +700ms |

**Mobile (below `lg:`):** Simplify to 3 stages — fade in (no slide), heart pulse, text appears. Detect via `useMediaQuery("(min-width: 1024px)")` from `hooks/useMediaQuery.ts`. Do NOT use `window.innerWidth` — it doesn't react to resize and breaks in React.

**Sparkle burst:** A small CSS animation of 4-6 dots that scale up and fade out around the timeline dot. Use absolute-positioned `<span>` elements with `@keyframes sparkle`. No tsparticles needed for this — CSS is simpler and lighter for a one-shot effect.

`viewport={{ once: true, amount: 0.3 }}` — triggers once, at 30% visibility.

#### 4.6 — ReasonsJar Draw Animation

**File:** `components/ReasonsJar.tsx` (modify)

On "Draw a Reason" click:
1. **Sparkle on jar:** CSS sparkle burst (same technique as timeline dot sparkle)
2. **Note flies out:** `motion.div` with `initial={{ y: 100, rotate: -10, opacity: 0 }}` → `animate={{ y: 0, rotate: 0, opacity: 1 }}`
3. **Note unfolds:** `initial={{ scale: 0.5 }}` → `animate={{ scale: 1 }}`
4. **Text appears:** Instant fade-in (NOT typewriter — per review feedback, typewriter reserved for gallery captions only)

Sequence using `transition.delay` or Framer Motion's `useAnimate` for imperative control.

#### 4.7 — TheMomentIKnew Word-by-Word Reveal

**File:** `components/TheMomentIKnew.tsx` (modify)

From Tech Spec Section 7.8:
- Split paragraph into words
- On scroll into view (Intersection Observer or `whileInView` callback), start an interval at 120ms per word
- Each word is a `<span>` with `transition-opacity duration-500`
- Word becomes visible when its index < `visibleWordCount`
- **Critical:** Clear the interval in the `useEffect` cleanup return. React strict mode double-invokes effects — without cleanup, two intervals will run simultaneously, doubling the reveal speed.

```typescript
useEffect(() => {
  if (!isInView) return;
  const interval = setInterval(() => {
    setVisibleWordCount((prev) => {
      if (prev >= words.length) { clearInterval(interval); return prev; }
      return prev + 1;
    });
  }, 120);
  return () => clearInterval(interval);  // ← must clean up
}, [isInView]);
```

When `reducedMotion`: all words visible immediately (set `visibleWordCount` to `words.length`).

#### 4.8 — Gallery Lightbox Typewriter Caption

**File:** `components/PhotoGallery.tsx` (modify)

When lightbox opens and `selectedItem?.caption` exists:
- State: `displayedCaption: string`
- On `selectedItem` change, reset and start typing at 40ms per character
- Display `displayedCaption` below the image

When `reducedMotion`: show full caption immediately.

#### 4.9 — PressIfYouMissMe Floating + Heart Burst

**File:** `components/PressIfYouMissMe.tsx` (modify)

- **Floating bob:** `animate={{ y: [-4, 4, -4] }}`, `transition={{ duration: 3, repeat: Infinity }}`
- **Heart burst on click:** 6-8 small heart emojis that fly outward from button center and fade. CSS `@keyframes` with random angles (use inline styles for angle variation). Hearts are positioned absolute relative to the button, animate `transform: translate() scale()` + opacity, then removed after animation.

#### 4.10 — WhatIPromise Stagger

**File:** `components/WhatIPromise.tsx` (modify)

Import `staggerContainer` and `staggerItem` from `lib/motion.ts`. Apply `staggerContainer` to `<motion.ul>` and `staggerItem` to each `<motion.li>`. No inline variant objects.

#### 4.11 — RelationshipTimer Digit Transition

**File:** `components/RelationshipTimer.tsx` (modify)

Use `AnimatePresence mode="wait"` on the seconds (and optionally minutes) digit:
- Exit: `opacity: 0, y: -10` (old number slides up and fades)
- Enter: `opacity: 1, y: 0` (new number slides in from below)
- Key the `AnimatePresence` child by the current value

#### 4.12 — FloatingElements (tsparticles)

**File:** `components/FloatingElements.tsx` (client component)

- Dynamically imported in protected layout: `const FloatingElements = dynamic(() => import("@/components/FloatingElements"), { ssr: false })`
- Uses `@tsparticles/react` + `@tsparticles/slim`
- Config from Tech Spec Section 7.14: 15 particles (8 on mobile), slow drift downward, rose-gold/warm-gold/blush colors, low opacity (0.1-0.4)
- Fixed position, z-index 1, `pointer-events: none`
- When `reducedMotion`: don't render the component at all

**Install dependency:**
```bash
npm install @tsparticles/react @tsparticles/slim
```

**Add to `app/(protected)/layout.tsx`** after component is built:

```tsx
const FloatingElements = dynamic(() => import("@/components/FloatingElements"), { ssr: false });

// Layout now becomes:
<>
  <ScrollProgress />
  <FloatingElements />
  <MusicPlayer />
  {children}
</>
```

### Sprint 4 Verification

- [ ] All sections animate in on scroll (fade-in up)
- [ ] Hero CTA has heartbeat pulse
- [ ] Timeline line draws as you scroll
- [ ] Timeline cards play 5-stage micro-interactions on desktop
- [ ] Timeline cards play 3-stage simplified animations on mobile
- [ ] Animations trigger once — scrolling back up and down doesn't replay them
- [ ] ReasonsJar has sparkle + fly-out + unfold on draw (no typewriter on reason text)
- [ ] TheMomentIKnew reveals words one by one
- [ ] Gallery lightbox captions type out character by character
- [ ] PressIfYouMissMe button floats gently, heart burst on click
- [ ] WhatIPromise items stagger in
- [ ] Timer seconds transition with subtle slide animation
- [ ] Floating particles drift slowly in background
- [ ] Set `prefers-reduced-motion: reduce` in OS → all animations disabled/simplified
- [ ] No jank — animations are smooth at 60fps (check with DevTools Performance tab)
- [ ] Page still loads under 3 seconds on throttled 4G (DevTools Network throttle)
- [ ] Scroll progress bar at top fills smoothly from 0% to 100% as you scroll

---

## Sprint 5 — Easter Eggs

**Goal:** All 5 hidden features implemented. These are independent of each other and can be built in any order.

> **IMPLEMENTATION RULES FOR THIS SPRINT**
> - Do not modify animation behavior from Sprint 4
> - Only create/modify files listed here
> - Do not add additional dependencies
> - Easter eggs should be invisible during a normal scroll-through — test this explicitly

### Dependency Graph

```
All tasks are independent — build in parallel or any order.

5.1 Photo 10-click easter egg       (modifies PhotoGallery)
5.2 Konami code listener            (new: EasterEggs.tsx)
5.3 Hidden heart                    (new: part of EasterEggs.tsx)
5.4 "Rehpatt" footer easter egg     (modifies Footer)
5.5 "Gay" joke easter egg           (part of EasterEggs.tsx)
  └──→ 5.6 Wire EasterEggs into /love page
```

### Tasks

#### 5.1 — Photo 10-Click Easter Egg

**File:** `components/PhotoGallery.tsx` (modify)

Add `clickCounts` state (`Record<number, number>`). Use functional updater (post-review fix):

```typescript
setClickCounts((prev) => {
  const newCount = (prev[item.id] || 0) + 1;
  if (newCount >= 10) {
    showEasterEggToast();
    return { ...prev, [item.id]: 0 };
  }
  setSelectedItem(item);
  return { ...prev, [item.id]: newCount };
});
```

Toast: a small notification that slides in from the bottom — "Okay okay, stop staring at her." — auto-dismisses after 3 seconds. Style as a dark pill with cream text.

#### 5.2 — Konami Code

**File:** `components/EasterEggs.tsx` (client component)

From Tech Spec Section 7.15. Listens for ↑↑↓↓←→←→BA sequence. On trigger:
- Full-screen overlay: "Secret level unlocked: hug mode" with a burst of heart emojis
- Hearts rain down (CSS animation, 20-30 hearts with random horizontal positions and animation delays)
- Dismiss: click anywhere
- Desktop only — Konami code requires a keyboard

#### 5.3 — Hidden Heart

**Part of:** `components/EasterEggs.tsx`

A small heart SVG placed at a specific absolute position on the page (e.g., near the Reasons section). Very low opacity (0.08), same hue as background — nearly invisible unless you're looking for it.

On click: a tooltip or small modal — "You found the hidden heart — just like I found you."

#### 5.4 — "Rehpatt" Footer Easter Egg

**File:** `components/Footer.tsx` (modify)

Add a tiny heart icon near the credit line, same color as surrounding text (barely visible). On click: show a tooltip or mini-modal with a playful "Rehpatt" reference.

#### 5.5 — "Gay" Joke Easter Egg

**Part of:** `components/EasterEggs.tsx`

Hidden trigger somewhere on the page (e.g., a tiny invisible link, or a specific element click). On trigger: shows "You call me gay, but the only thing I'm hopelessly attracted to... is you."

#### 5.6 — Wire EasterEggs into Protected Layout

**File:** `app/(protected)/layout.tsx` (modify)

Dynamically import and add to the protected layout (not the page — it's a persistent element):
```tsx
const EasterEggs = dynamic(() => import("@/components/EasterEggs"), { ssr: false });

// In the layout return:
<>
  <ScrollProgress />
  <MusicPlayer />
  <EasterEggs />
  {children}
</>
```

### Sprint 5 Verification

- [ ] Click same photo 10 times → "Okay okay, stop staring at her." toast appears
- [ ] Toast auto-dismisses after 3 seconds
- [ ] ↑↑↓↓←→←→BA on keyboard → "hug mode" overlay with heart rain
- [ ] Overlay dismisses on click
- [ ] Hidden heart is discoverable but not obvious — click it → message reveals
- [ ] Footer tiny heart → "Rehpatt" reference on click
- [ ] "Gay" joke easter egg triggers correctly
- [ ] None of the easter eggs are immediately visible on a normal scroll-through

---

## Sprint 6 — Responsive Polish & Performance

**Goal:** The site looks and feels perfect on iPhone 12+, iPad, and desktop. Performance meets all BRD benchmarks.

> **IMPLEMENTATION RULES FOR THIS SPRINT**
> - Do not add new features or new sections
> - Do not add additional dependencies
> - Only fix existing issues — responsive bugs, performance bottlenecks, cross-browser problems
> - If a fix requires changing animation behavior, keep it minimal and test that the animation still looks good

### Tasks

#### 6.1 — Mobile Responsive Pass

Test every section at 375px width (Chrome DevTools → iPhone 12/13/14):

| Section | What to check |
|---------|---------------|
| Password gate | Input and button are comfortably tappable (min 44px touch target) |
| Interstitial | Text is readable, not too large |
| Hero | Headline wraps gracefully, CTA is visible without scrolling |
| Timeline | Single column, cards full-width, icons visible |
| ReasonsJar | Jar and note stack vertically, button is tappable |
| LoveLetter | Image scales down, transcript is readable |
| TheMomentIKnew | Text wraps within padding, readable |
| Gallery | 2-column grid, lightbox is full-width |
| PressIfYouMissMe | Button centered, overlay text has padding |
| WhatIPromise | Text wraps, padding doesn't cause overflow |
| Timer | 2x2 grid, numbers are readable |
| Footer | All text visible, no overflow |
| MusicPlayer | Not overlapping content, still accessible |

Fix any issues found. Focus on: horizontal overflow, text too small, touch targets too small, content hidden behind the music player.

#### 6.2 — Tablet Responsive Pass

Test at 768px. Verify all `md:` breakpoints are applying correctly. Key checks:
- Timeline: still single column but wider cards
- Gallery: 3-column grid
- Timer: 4 inline boxes
- Typography: mid-size scale

#### 6.3 — Desktop Responsive Pass

Test at 1280px+. Key checks:
- Timeline: alternating left/right cards
- Gallery: 4-column grid
- Content: max-width constraints so text doesn't stretch full-width on ultrawide
- All sections have sensible `max-w-*` containers

#### 6.4 — Performance Audit

Run Lighthouse (Performance tab) on a production build (`npm run build && npm start`):

**Targets from BRD:**
| Metric | Target |
|--------|--------|
| FCP | < 1.5s on 4G |
| Total JS bundle | < 1MB (expect ~400KB gzipped) |
| LCP | < 2.5s |
| CLS | < 0.1 |

**If FCP is too slow:**
- Check if tsparticles is in the critical path (should be dynamically imported)
- Check if fonts are blocking render (should use `display: "swap"`)
- Verify images use `next/image` with lazy loading

**If bundle is too large:**
- Run `npm run build` and check the output sizes
- Check if Framer Motion is being fully imported instead of tree-shaken
- Verify `@tsparticles/slim` is used, not the full `tsparticles`

#### 6.5 — Animation Performance Check

Use Chrome DevTools → Performance tab → Record while scrolling:
- All animations should run at 60fps (no red frames)
- Check for layout thrashing (no `width`/`height`/`top`/`left` animations)
- Verify `will-change: transform` is applied during timeline card animations

#### 6.6 — Cross-Browser Check

Test on:
- Chrome (primary)
- Safari (she might use iPhone Safari)
- Firefox (optional, low priority)

Key Safari issues to watch for:
- `backdrop-filter` might need `-webkit-` prefix
- `scroll-behavior: smooth` may not work — CTA button click should still scroll (it uses JS `scrollIntoView`)
- Audio autoplay restrictions (should be fine — we default to paused)

### Sprint 6 Verification

- [ ] No horizontal overflow on any screen size
- [ ] All touch targets ≥ 44px on mobile
- [ ] Text is readable at all breakpoints
- [ ] Lighthouse FCP < 1.5s (throttled 4G)
- [ ] Lighthouse Performance score ≥ 90
- [ ] JS bundle < 1MB total
- [ ] Animations at 60fps (no jank)
- [ ] Works on Chrome + Safari

---

## Sprint 7 — Deploy & Ship

**Goal:** Live on Vercel, tested end-to-end on a real phone, link shared.

> **IMPLEMENTATION RULES FOR THIS SPRINT**
> - Do not make code changes unless a production bug is found during smoke testing
> - Focus is: deploy, verify, content, share
> - If a bug is found, fix it minimally — do not refactor or improve while fixing

### Tasks

#### 7.1 — Git Setup & Push

```bash
cd lovey-dovey
git init
git add .
git commit -m "Initial commit: Lovey Dovey"
git remote add origin <github-repo-url>
git push -u origin main
```

**Before committing:** Verify `.env.local` is in `.gitignore`. Verify no sensitive files are staged.

#### 7.2 — Vercel Deployment

1. Go to vercel.com → "New Project" → Import GitHub repo
2. Framework: Next.js (auto-detected)
3. Environment Variables: Set `SITE_PASSWORD` = `devi`
4. Deploy

#### 7.3 — Production Smoke Test

Test the full flow on the production URL:

- [ ] Visit the URL → password gate loads
- [ ] Enter "Devi" → interstitial plays → hero appears
- [ ] Scroll through all sections — everything works
- [ ] Music player works
- [ ] Easter eggs work
- [ ] Timer ticks correctly
- [ ] Revisit the URL → skips interstitial (cookie persists)
- [ ] Visit `/love` directly → allowed (cookie exists)
- [ ] Open in incognito → `/love` redirects to gate
- [ ] Check `robots.txt` at `/robots.txt`
- [ ] View page source → no protected content visible

#### 7.4 — Mobile Test on Real Device

**Critical:** Test on a real phone, not just DevTools. Priiyanshii will likely open this on her phone first.

- Open the production URL on your phone
- Test the full flow: gate → interstitial → all sections → easter eggs
- Check: animations smooth, text readable, no horizontal scroll, touch targets work, music plays
- Take screenshots to verify visual quality

#### 7.5 — Final Content Check

Before sharing:
- [ ] All timeline copy is in Kushik's voice (not placeholder)
- [ ] "The Moment I Knew" paragraph is Kushik's own words
- [ ] All 15-20 reasons are written
- [ ] Counter love letter is written
- [ ] Photo captions are personal
- [ ] All photos are high quality and properly sized
- [ ] Song file is the right song

#### 7.6 — Share

Send Priiyanshii the link via WhatsApp with a teasing message. Don't give away what it is. Let the password gate do the reveal.

---

## Content Checklist (Parallel Track)

These items require Kushik's personal input and should be worked on alongside the sprints. They don't block development (placeholder content works during coding) but must be done before Sprint 7.5.

| # | Content Item | Status | Needed By |
|---|-------------|--------|-----------|
| C1 | Hero headline + tagline (personal, not placeholder) | Pending | Sprint 7.5 |
| C2 | "The Moment I Knew" paragraph (rewrite in own voice) | Pending | Sprint 7.5 |
| C3 | 15-20 "Reasons I Love You" entries | 10 written | Sprint 2.1 |
| C4 | Counter love letter (response to her note) | Pending | Sprint 7.5 |
| C5 | Photo captions for gallery | Pending | Sprint 7.5 |
| C6 | 3-8 solo photos of Priiyanshii (min 1080px) | Pending | Sprint 3.6 |
| C7 | Photo of Hot Wheels gift + wooden case | Pending | Sprint 3.6 |
| C8 | Scan/photo of handwritten love letter | Pending | Sprint 3.4 |
| C9 | Romantic song file (MP3) | Pending | Sprint 3.12 |
| C10 | Footer closing message (personal) | Pending | Sprint 7.5 |

---

## Risk Watchlist

Things that could slow you down, and how to handle them:

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| tsparticles causes bundle bloat | Medium | Delays Sprint 6 | If bundle > 800KB, replace with custom Canvas implementation (10-15 particles, simple drift) — 50 lines of code vs a library |
| Photos not ready when Sprint 3 starts | High | Blocks gallery visual testing | Use placeholder images (colored rectangles) — layout doesn't depend on real photos |
| Song not chosen by Sprint 3 | Medium | Music player untestable | Use any MP3 placeholder — swap the file later |
| Safari animation issues | Medium | Breaks the experience on iPhone | Test Safari in Sprint 6, have CSS fallbacks ready |
| "The Moment I Knew" paragraph feels forced | Low | Emotional climax falls flat | Write it naturally, not all at once. Kushik should write it when he actually feels it — a good paragraph written at 2am hits different than one forced during a coding session |

---

*Sprint 1 through Sprint 7. Seven sprints from `git init` to "Devi, open this link." Let's build it.*
