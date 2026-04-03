# Business Requirements Document (BRD)

## Project: Lovey Dovey — A Dedicated Love Website for Priiyanshii

**Author:** Kushik
**Date:** 2 April 2026
**Version:** 1.3
**Status:** Draft

---

## 1. Executive Summary

Lovey Dovey is a password-protected, single-page romantic website dedicated to Priiyanshii — built as a heartfelt digital surprise that captures the story of a relationship through an interactive timeline, love notes, personal gallery, and immersive dreamy aesthetics. The site will be deployed on Vercel and built with Next.js.

---

## 2. Project Objectives

| # | Objective |
|---|-----------|
| O1 | Create a deeply personal, emotionally resonant digital experience that makes Priiyanshii feel special and loved |
| O2 | Chronicle the relationship story from first meeting to present through an interactive timeline |
| O3 | Provide a private, password-protected space that is exclusively for the couple |
| O4 | Build a maintainable codebase that can be extended over time with new milestones, photos, and messages |

---

## 3. Target Audience

**Primary (and only) user:** Priiyanshii
- She will receive the link and password as a surprise
- She should be able to navigate it intuitively on both mobile and desktop
- The experience should feel intimate, personal, and emotionally moving

---

## 4. Functional Requirements

### 4.1 Password Protection Gate

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-01 | The site must display a password entry screen before any content is visible | P0 |
| FR-02 | The password gate should be themed and on-brand (not a generic browser prompt) — styled as a love-letter envelope, a "knock knock" door, or similar romantic metaphor | P0 |
| FR-03 | On correct password entry, the user is transitioned into the **Suspense Interstitial** (Section 4.2), NOT directly to the hero | P0 |
| FR-04 | The session should persist (cookie/localStorage) so she doesn't have to re-enter the password on every visit within the same browser | P1 |
| FR-05 | Password hint is **hidden by default** — only revealed after 3 incorrect attempts. On wrong entry, show a gentle shake animation + "Try again" message. After 3 failures, fade in the hint: "What does he call you that means goddess?" — Answer: `Devi` | P0 |

> **Why delay the hint:** If she guesses wrong on the first try, showing the hint immediately could feel awkward or patronizing. Letting her try 3 times makes it feel like a game. When the hint appears, it feels like a reward, not a crutch.

### 4.2 Suspense Interstitial — "The Moment of Pause"

A 3-4 second cinematic beat between authentication and the main experience. Short enough to not feel like loading, long enough to build anticipation.

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-06 | After password success, the screen fades to black (soft transition, ~0.5s) | P0 |
| FR-07 | On the black screen, text appears line by line with gentle fade-in and delay between each line: | P0 |

**Interstitial Copy (typed/faded sequentially):**

```
Before the world changed...

I met someone.
```

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-08 | Line 1 fades in after 0.5s on black screen. Line 2 fades in 1.5s after line 1. Total interstitial duration: ~3-4 seconds. | P0 |
| FR-09 | After line 2, a pause (~1s), then both lines fade out and the Hero section dissolves in with a soft upward motion | P0 |
| FR-10 | Optional: subtle particle stars or a single floating heart during the interstitial | P2 |
| FR-11 | The interstitial should only play on first visit per session — subsequent visits (with cached auth) skip to hero | P1 |

> **Why "Before the world changed" over "Hi Devi":** The "Hi Devi" version is warm but expected. This version is cinematic — it sets a narrative hook. She doesn't know what's coming. By the time "I met someone." appears, she's already emotionally leaning in.

### 4.3 Hero / Landing Section

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-12 | Full-viewport hero section with a romantic headline addressing Priiyanshii | P0 |
| FR-13 | A tagline or sub-headline — personal, warm, not generic (e.g., "For my Devi — the most chaotic, beautiful thing that ever happened to me") | P0 |
| FR-14 | Soft entrance animations (fade-in, gentle float) as the hero loads | P1 |
| FR-15 | Instead of a passive "scroll down" cue, display a **"Read Our Story"** CTA button that smooth-scrolls to the timeline | P0 |
| FR-16 | The CTA button should be styled romantically — soft glow, heartbeat pulse animation, rose-gold border | P1 |
| FR-17 | Background ambient animation — floating rose petals, soft bokeh lights, or gentle particle stars | P2 |

> **Why a button instead of a scroll cue:** A deliberate "Read Our Story" button makes the transition intentional. She *chooses* to step into the story rather than passively drifting. It increases engagement and emotional buy-in.

### 4.4 Our Story — Interactive Relationship Timeline

This is the **emotional centerpiece** of the site.

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-18 | Vertical scrolling timeline with milestone cards | P0 |
| FR-19 | Each card should have: **icon**, date, title, description, and optional image/illustration | P0 |
| FR-20 | Cards should animate into view on scroll with **multi-stage micro-interactions** (see below) | P0 |
| FR-21 | A connecting line or thread between cards (visual metaphor of a journey) — the line should draw itself as user scrolls | P1 |

#### 4.4.1 Timeline Card Micro-Interactions

Each card entrance should feel alive, not just "appear." The animation sequence per card:

| Stage | What Happens | Timing |
|-------|-------------|--------|
| 1. Card enters | Card slides in from left/right (alternating) with a soft fade | 0ms |
| 2. Sparkle burst | A tiny sparkle/star particle burst plays at the timeline dot connecting the card to the line | +200ms |
| 3. Heart pulse | A small heart icon pulses once at the top of the card (like a heartbeat) | +400ms |
| 4. Photo reveal | If the card has an image, it fades in with a soft blur-to-sharp transition | +500ms |
| 5. Text type-in | The description text types in letter by letter (or word by word for performance) | +700ms |

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-22 | Implement the 5-stage micro-interaction sequence for each timeline card | P1 |
| FR-23 | On mobile, simplify to 3 stages (card fade + heart pulse + text appear) for performance | P1 |
| FR-24 | Each card's animation should only trigger once (first time scrolled into view) | P0 |
| FR-25 | Respect `prefers-reduced-motion` — fall back to simple fade-in if user has motion sensitivity | P1 |

**Timeline Content (7 milestones at launch):**

> **Tone guidance:** Keep the writing slightly messy and real — not polished poetry. She should read it and feel like *he* wrote it, not a copywriter. Raw emotion > perfect sentences.

| # | Icon | Date | Title | Description |
|---|------|------|-------|-------------|
| 1 | ✨ | 19 Feb 2026 | **The Day the Universe Conspired** | "My best friend's sister's wedding. I went there for the food and the dancing. I didn't know I was about to meet you. But there you were. And honestly? I was done for." |
| 2 | 🍸 | 3 Mar 2026 | **First Date — CyberHub, Gurgaon** | "A bracelet for you. Chili's for us. And then that rooftop. We were standing outside Diablo, leaning on the railing. City below. Music floating up. I looked at you and thought — yeah, I'm completely screwed." |
| 3 | 💋 | 19 Mar 2026 | **Your Kitchen, My Heart** | "You invited me over and cooked paneer and rice. Handmade. For me. It was the most delicious thing I've ever tasted — and not just because of the food. We had our first kiss that day. I replay it in my head more than I'll ever admit." |
| 4 | 🌹 | 24 Mar 2026 | **Officially Ours** | "Rose bouquet. Your flat. A question I already knew the answer to. You said yes. And just like that — 'something special' became 'officially us.' I don't think I stopped smiling for two days." |
| 5 | 🚗 | 28 Mar 2026 | **The Office Surprise** | "I called you and said, 'Come outside, I'm here.' The look on your face when you walked out. That right there? That's why I'll keep showing up." |
| 6 | 🎁 | 2 Apr 2026 | **Hot Wheels & a Love Letter** | "You gave me a Hot Wheels collection in a lighted wooden case. A handwritten note. A cartoon of us — the shy calm guy and the chaotic girl — with a lipstick kiss on the paper. I didn't fall fast. I just slowly realised I was completely, irreversibly gone." |
| 7 | ✍️ | ??? | **And this story is still being written...** | "This isn't where it ends. This is where it starts. The best parts haven't happened yet, Devi. And I want every single one of them to be with you." |

> **Icons** are displayed at the timeline dot (where the card connects to the line). They help with visual scanning — she can glance at the timeline and immediately identify each moment. Icons are stored in the `milestones.ts` data file alongside each entry.

> **Note:** The Gajar ka Halwa surprise (sent to her office during the talking phase) should be woven into the narrative between milestone 1 and 2 as a smaller inline mention or a fun aside tooltip — e.g., a tiny card that says "Somewhere between 'just talking' and 'falling hard,' I sent gajar ka halwa to her office. Because apparently that's how I flirt."

### 4.5 Reasons I Love You — "Pick a Reason" Jar

Flip cards feel mechanical. A jar mechanic creates **playful discovery** — she actively draws reasons one at a time, like pulling love notes from a jar. Each draw feels like a tiny gift.

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-26 | A dedicated section titled "Reasons I Love You" | P0 |
| FR-27 | Visual: an illustrated jar/bottle with folded paper notes visible inside | P1 |
| FR-28 | A **"Draw a Reason"** button below the jar | P0 |
| FR-29 | On click: sparkle animation on jar → a card/note flies out and unfolds → reason text is revealed with a typewriter or fade-in effect | P0 |
| FR-30 | Each draw pulls from the remaining undrawn pool (no repeats until all are seen) | P1 |
| FR-31 | After all reasons are drawn, show a final message: "That's not even all of them. I'll keep adding." | P1 |
| FR-32 | Minimum 15-20 reasons at launch, easily extensible via a data file | P0 |
| FR-33 | Reasons should be a mix of specific (tied to real moments) and sweet/general | P0 |

**Visual Concept:**
```
     Reasons I Love You

      ┌─────────────┐
      │  ┌─┐ ┌─┐    │
      │  │♡│ │♡│    │   ← illustrated jar with
      │  └─┘ └─┘    │     folded notes inside
      │    ┌─┐      │
      │    │♡│      │
      │    └─┘      │
      └─────────────┘

    [ ✨ Draw a Reason ]

  ┌─────────────────────────┐
  │ "The way you say         │  ← unfolded note card
  │  'Ek rehpatt maarungi    │    (appears after draw)
  │   na' — and I believe    │
  │   you every time"        │
  └─────────────────────────┘
```

**Sample Reasons (to be expanded during implementation):**

1. The way you say "Ek rehpatt maarungi na" — and I believe you every time
2. That you hand-cooked paneer and rice for me on our second date
3. Your handwriting on that love letter
4. The cartoon drawing of the shy calm guy and the chaotic girl — that's us
5. You call me gay and somehow it's the most endearing thing
6. The lipstick kiss mark on the letter
7. How excited you were when I showed up at your office
8. Your taste in gifts — who gives Hot Wheels in a lighted wooden case? You. That's who.
9. That you wrote "Because he showed me how it felt to be treated right, in a week; the way others couldn't do in years"
10. The way the city looked behind you that night at CyberHub

### 4.6 The Love Letter Section

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-31 | A section that showcases her handwritten letter as a scanned/photographed image | P0 |
| FR-32 | The letter image should be displayed in a styled frame — like a polaroid, a parchment scroll, or a pinned note aesthetic | P1 |
| FR-33 | Below or alongside the image, the typed-out text of the letter for readability | P1 |
| FR-34 | A personal response message from Kushik underneath — a counter love letter written digitally | P1 |

**Her Letter Content:**
> "Why did you fall for him so fast?"
>
> "Because he showed me how it felt to be treated right, in a week; The way others couldn't do in years."

### 4.7 "The Moment I Knew" — One Deeply Personal Paragraph

A single, focused, deeply personal section. No list, no cards, no interactive gimmick — just one paragraph in a large, beautiful serif font on a full-width section. This is the emotional climax before the lighter gallery section.

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-76 | A full-viewport section with centered text, minimal decoration | P0 |
| FR-77 | Heading: "The Moment I Knew" in handwritten font | P0 |
| FR-78 | One paragraph — raw, unpolished, deeply honest. Written by Kushik during implementation. | P0 |
| FR-79 | Text fades in on scroll, word by word (not typewriter — slower, more weight to each word) | P1 |
| FR-80 | Background: darker than surrounding sections, like a spotlight moment. Minimal ambient particles. | P2 |

**Draft (Kushik to refine — this should be in his actual voice):**

```
The Moment I Knew

I don't know the exact second it happened.

Maybe it was that night at CyberHub, when the city was
blurring behind you and you were the only thing in focus.

Maybe it was when you cooked for me and I realised no one
had ever done something that simple and that meaningful.

Or maybe it was the day you handed me that letter
and I read what you wrote about me —
and for the first time, I saw myself
the way someone who loves me sees me.

I don't know when it happened.
I just know that by the time I noticed,
it was already too late to go back.

And I didn't want to.
```

> **Implementation note:** This section works best if Kushik writes it himself, in his own words. The draft above is a starting point. Even a shorter, rougher version will hit harder than polished copy — because it's *his*.

### 4.8 Photo Gallery

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-35 | A gallery section displaying solo photos of Priiyanshii | P0 |
| FR-36 | Photos displayed in a masonry or scattered polaroid layout with slight rotation and shadow | P1 |
| FR-37 | Each photo can have an optional caption or a short sweet note | P1 |
| FR-38 | Lightbox/modal view on click for full-size viewing | P1 |
| FR-39 | **Typewriter caption in modal:** When a photo opens in the lightbox, the caption types out letter by letter below the image (typewriter effect, ~40ms per character). This makes each photo feel intimate — like he's whispering a comment about each one. | P1 |
| FR-40 | Photo of the Hot Wheels gift + letter included in gallery | P1 |

### 4.8 Music / Song Feature — Keep It Simple

No need for a full custom player. Use native **HTML5 `<audio>`** with minimal UI.

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-40 | A minimal floating music widget in the bottom-right corner | P1 |
| FR-41 | Music paused by default — a single play/pause toggle button (autoplay will be blocked anyway) | P0 |
| FR-42 | Show song name + artist in small text next to the button | P2 |
| FR-43 | Single song on loop — no playlist needed at launch | P2 |

**Minimal UI:**
```
┌─────────────────────────┐
│  ♫ Our Song             │
│  [ ▶ Play ]             │
└─────────────────────────┘
```

> **Why HTML5 Audio over Howler.js:** For a single song with play/pause, native `<audio>` is more than enough. Howler.js adds ~7KB gzipped for functionality we don't need. Keep it lean.

### 4.9 Pet Names & Easter Eggs

Easter eggs make the site 10x more memorable. They reward exploration and feel personal.

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-44 | Use "Devi" as a recurring term of endearment throughout the site copy | P1 |
| FR-45 | **Easter Egg #1 — "Rehpatt":** A hidden clickable spot somewhere on the site (e.g., a tiny heart icon in the footer). On click, shows a playful "Rehpatt" reference — tooltip or mini modal | P2 |
| FR-46 | **Easter Egg #2 — "Gay" joke:** A hidden section that says "You call me gay, but the only thing I'm hopelessly attracted to... is you" | P2 |
| FR-47 | **Easter Egg #3 — "Stop staring":** Clicking her photo in the gallery 10 times in a row triggers a toast/popup: "Okay okay, stop staring at her." | P1 |
| FR-48 | **Easter Egg #4 — Konami Code:** Entering ↑ ↑ ↓ ↓ ← → ← → B A on the keyboard triggers a special overlay: "Secret level unlocked: hug mode 🤗" with a burst of hearts | P2 |
| FR-49 | **Easter Egg #5 — Hidden Heart:** A tiny, barely visible heart hidden somewhere on the page (e.g., blended into the background pattern). Clicking it reveals: "You found the hidden heart ❤️ — just like I found you." | P2 |

> **Implementation note:** Easter eggs should be discoverable but not obvious. They should feel like a reward for curiosity, not something you see on the first scroll-through.

### 4.10 Playful Interaction — "Press If You Miss Me" Button

A single unexpected, delightful micro-interaction that makes the site memorable beyond just storytelling.

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-47 | A standalone playful button placed between major sections (ideally between Gallery and Footer) | P1 |
| FR-48 | Button styled softly — glowing border, handwritten font, subtle float animation. Label: **"Press if you miss me"** | P1 |
| FR-49 | On click, the button triggers a full-screen overlay with a short, sweet message and animation | P0 |
| FR-50 | The response should rotate randomly from a pool of messages on each click | P1 |

**Message Pool (randomly selected on each press):**

| # | Message |
|---|---------|
| 1 | "You already do. I know. ❤️" |
| 2 | "Here's a virtual hug. Hold your phone tight." |
| 3 | "You get one hug coupon. Redeemable anytime." |
| 4 | "Close your eyes. I'm thinking of you right now." |
| 5 | "Ek rehpatt maar dungi na? — Yes please. 🥺" |
| 6 | "You miss me? Good. Because I never stopped." |
| 7 | "Distance means nothing when someone means everything." |
| 8 | "I'm just one call away. You know that, Devi." |

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-51 | The overlay should dismiss on tap/click anywhere, with a gentle fade-out | P1 |
| FR-52 | A tiny heart burst animation plays around the button on click | P2 |
| FR-53 | Message pool stored in data file for easy extension | P1 |

### 4.11 "What I Promise" — The Emotional Closer

This section hits hardest because it's forward-looking. The timeline tells her where you've been; this tells her where you're going. Place it after "Press If You Miss Me" and before the Footer.

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-62 | A dedicated full-width section with the heading "What I Promise" or "My Promises to You" | P0 |
| FR-63 | Display promises as a vertical list with each item animating in on scroll (staggered, left-to-right) | P1 |
| FR-64 | Each promise prefixed with a subtle heart or checkmark icon | P2 |
| FR-65 | Tone: raw, real, slightly imperfect — not wedding vows, just honest | P0 |

**Promises Content (draft — refine during implementation):**

```
What I Promise

I promise to:

  • show up — even when it's inconvenient, even when it's raining,
    even when you say you're fine and you're clearly not

  • make you laugh — even on the days when nothing's funny

  • send you food at work when you forget to eat

  • never let CyberHub be our best memory —
    we're going to have so many better ones

  • listen to you rant about your day
    and remember the names of people I've never met

  • always be the shy calm guy
    to your beautiful chaos

  • choose you —
    not just once, but over and over,
    every single day
```

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-66 | Promises stored in a data file (`data/promises.ts`) for easy editing | P1 |
| FR-67 | The section should end with a soft closing line, e.g., "That's not everything. But it's a start." | P1 |

### 4.12 Footer / Closing Section

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-68 | A closing message — short, sweet, final (e.g., "This is just the beginning, Devi.") | P0 |
| FR-69 | **Live Relationship Timer** — a dynamic, real-time counter showing time together since 24 March 2026 | P0 |
| FR-70 | A small "Made with love by your shy calm guy" credit | P2 |

#### 4.12.1 Live Relationship Timer

Not just a static day count — a **ticking, real-time timer** that updates every second.

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-71 | Display format: large, prominent, styled as a centerpiece in the footer | P0 |
| FR-72 | Show: **X days, X hours, X minutes, X seconds** — with seconds ticking live | P0 |
| FR-73 | Each unit (days, hours, minutes, seconds) in its own styled box/card with the label below | P1 |
| FR-74 | Warm gold or rose-gold color treatment — this should feel like a glowing heartbeat, not a countdown clock | P1 |
| FR-75 | A label above: "Together for" and below: "...and counting forever" | P1 |

**Visual Reference:**
```
                    Together for

        ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐
        │  9   │  │  14  │  │  27  │  │  43  │
        │ days │  │hours │  │ mins │  │ secs │
        └──────┘  └──────┘  └──────┘  └──────┘

                 ...and counting forever
```

---

## 5. Non-Functional Requirements

### 5.1 Performance

| ID | Requirement | Priority |
|----|-------------|----------|
| NFR-01 | First Contentful Paint (FCP) under 1.5 seconds on 4G | P0 |
| NFR-02 | Smooth 60fps animations across all sections | P1 |
| NFR-03 | Images optimized via Next.js Image component with lazy loading | P0 |
| NFR-04 | Total JS bundle size under 1MB (excluding images). Framer Motion alone is ~30KB gzipped; with tsparticles the 500KB target was unrealistic. 1MB is still very good. | P1 |

### 5.2 Responsiveness

| ID | Requirement | Priority |
|----|-------------|----------|
| NFR-05 | Fully responsive — optimized for mobile-first (she will likely open this on her phone first) | P0 |
| NFR-06 | Tested breakpoints: 375px (mobile), 768px (tablet), 1280px+ (desktop) | P0 |
| NFR-07 | Timeline and gallery layouts must adapt gracefully to narrow screens | P0 |

### 5.3 Security & Privacy

| ID | Requirement | Priority |
|----|-------------|----------|
| NFR-08 | Password protection via **Next.js middleware** — protected page content must never be in the client JS bundle before auth (see Section 7.3) | P0 |
| NFR-09 | No SEO indexing — `noindex, nofollow` meta tags, `robots.txt` disallow all | P0 |
| NFR-10 | No analytics or third-party tracking scripts | P0 |

> **Dropped:** "Images not accessible via predictable URLs" — overengineering for this use case. `/public/images/*` is fine.

### 5.4 Accessibility

| ID | Requirement | Priority |
|----|-------------|----------|
| NFR-12 | All images must have descriptive alt text | P1 |
| NFR-13 | Sufficient color contrast for all text | P1 |
| NFR-14 | Keyboard navigable | P2 |

### 5.5 Maintainability

| ID | Requirement | Priority |
|----|-------------|----------|
| NFR-15 | All timeline milestones, reasons, and gallery items stored in structured data files (JSON/TS constants) — not hardcoded in JSX | P0 |
| NFR-16 | Adding a new milestone or reason should require editing only a data file, not a component | P0 |
| NFR-17 | Clear project structure with separation of concerns (components, data, assets, styles) | P1 |

---

## 6. Design & Aesthetic Direction

### 6.1 Visual Theme: "Romantic Dreamscape"

The site should feel like stepping into a beautiful, hazy, late-night dream — inspired by that rooftop moment at CyberHub with the city lights and distant music.

**Mood Keywords:** Dreamy, warm, intimate, soft, romantic, playful, starlit

### 6.2 Color Palette

| Role | Color | Hex | Rationale |
|------|-------|-----|-----------|
| Primary Background | Deep midnight blue / dark navy | `#0a0e27` | Night sky, the CyberHub rooftop moment |
| Secondary Background | Soft warm black with violet undertone | `#141028` | Depth and warmth |
| Primary Accent | Rose gold / soft pink | `#e8a0bf` | Romance, femininity, warmth |
| Secondary Accent | Warm gold | `#d4a574` | Bokeh lights, elegance, "Devi" (goddess) vibes |
| Text Primary | Soft cream white | `#f5f0eb` | Warm, readable, not harsh |
| Text Secondary | Muted lavender | `#b8a9c9` | Soft supporting text |
| Highlight | Blush pink | `#ff6b9d` | CTAs, interactive elements, hearts |

### 6.3 Typography

| Element | Font Suggestion | Style |
|---------|----------------|-------|
| Headlines / Hero | Playfair Display or Cormorant Garamond | Serif, elegant, romantic |
| Body text | Inter or Nunito | Clean, readable, warm |
| Special accents (quotes, letter) | Dancing Script or Caveat | Handwritten feel |

### 6.4 Animation & Motion Design

| Element | Animation | Trigger |
|---------|-----------|---------|
| Password success | Screen fades to black | On auth success |
| Suspense interstitial | "Before the world changed..." then "I met someone." — sequential fade-in | After password fade |
| Interstitial → Hero | Both lines fade out, soft upward dissolve to hero | After interstitial (~3-4s) |
| Hero text | Letter-by-letter or word-by-word fade in | On hero load |
| "Read Our Story" CTA | Soft glow pulse animation (heartbeat rhythm) | Ambient, continuous |
| Timeline line | Self-drawing SVG line that extends as user scrolls | On scroll |
| Timeline cards | 5-stage micro-interaction: slide → sparkle → heart pulse → photo reveal → text type-in | On scroll (intersection observer) |
| Floating elements | Rose petals / bokeh particles drifting slowly | Ambient, continuous |
| Reasons jar | Sparkle on jar → note flies out → unfolds → text reveals | On "Draw a Reason" click |
| "The Moment I Knew" | Word-by-word fade in (slower, weighted) | On scroll into view |
| Gallery photos | Gentle parallax tilt on hover | On hover |
| Gallery modal caption | Typewriter effect (~40ms/char) | On lightbox open |
| "Press if you miss me" | Subtle floating animation + heart burst on click | Ambient + on click |
| Relationship timer | Seconds digit ticking with soft fade transition | Every second, real-time |
| Section transitions | Smooth scroll with eased motion | On navigation / CTA click |

### 6.5 Background Texture

Add a **very subtle film grain / noise texture** as a CSS overlay on the background. This makes the site feel cinematic and tactile — like a memory or a dream captured on old film.

```css
/* Subtle grain via CSS — no image needed */
body::after {
  content: '';
  position: fixed;
  inset: 0;
  opacity: 0.03; /* barely visible */
  background-image: url("data:image/svg+xml,..."); /* tiny noise SVG */
  pointer-events: none;
  z-index: 9999;
}
```

> Keep opacity at 0.02-0.04 — it should be felt, not seen. Too high and it looks like a filter; just right and it adds warmth.

### 6.6 Illustrations & Visual Elements

Since couple photos are not available, the site should lean into:
- Soft gradient backgrounds with bokeh/particle effects + **subtle grain overlay**
- Minimalist line-art illustrations (couple silhouette, skyline, roses)
- The cartoon drawing motif from her letter (shy calm guy + chaotic girl) as a recurring visual element — could commission or create a simple SVG version
- Polaroid-style frames for her solo photos
- Decorative elements: roses, stars, subtle heart particles

---

## 7. Technical Architecture

### 7.1 Tech Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| Framework | Next.js 14+ (App Router) | SSR for password protection, modern React, great DX |
| Styling | Tailwind CSS + CSS Modules (for complex animations) | Rapid development, utility-first |
| Animation | Framer Motion | Declarative animations, scroll-triggered reveals, `whileInView` for timeline cards |
| Particles/Ambient | tsparticles or custom Canvas | Floating petals, bokeh lights |
| Music | Native HTML5 `<audio>` | Simple play/pause for a single song — no library needed |
| Fonts | Google Fonts (next/font) | Optimized loading |
| Deployment | Vercel | Free tier, instant deploys, edge functions |
| Images | next/image + Vercel Blob or local /public | Optimized delivery |

### 7.2 Project Structure

```
lovey-dovey/
├── app/
│   ├── layout.tsx              # Root layout, fonts, metadata
│   ├── page.tsx                # Password gate (client-side)
│   ├── love/
│   │   └── page.tsx            # Main love page (protected)
│   └── api/
│       └── auth/
│           └── route.ts        # Password verification endpoint
├── components/
│   ├── PasswordGate.tsx        # Themed password entry
│   ├── SuspenseInterstitial.tsx # "Before the world changed..." cinematic pause
│   ├── Hero.tsx                # Hero/landing section + "Read Our Story" CTA
│   ├── Timeline.tsx            # Relationship timeline
│   ├── TimelineCard.tsx        # Individual milestone card with micro-interactions
│   ├── ReasonsJar.tsx           # "Pick a Reason" jar interaction
│   ├── LoveLetter.tsx          # Her letter showcase
│   ├── TheMomentIKnew.tsx      # One deeply personal paragraph
│   ├── PhotoGallery.tsx        # Photo gallery with typewriter captions
│   ├── PressIfYouMissMe.tsx    # Playful "miss me" button + overlay
│   ├── WhatIPromise.tsx        # Forward-looking promises section
│   ├── RelationshipTimer.tsx   # Live ticking days/hours/mins/secs counter
│   ├── MusicPlayer.tsx         # Minimal floating music player (HTML5 audio)
│   ├── FloatingElements.tsx    # Ambient particles/petals
│   ├── EasterEggs.tsx          # Konami code listener, hidden heart, click counter
│   └── Footer.tsx              # Closing section
├── data/
│   ├── milestones.ts           # Timeline data
│   ├── reasons.ts              # Reasons I love you
│   ├── promises.ts             # "What I Promise" list
│   ├── missYouMessages.ts      # "Press if you miss me" message pool
│   └── gallery.ts              # Photo metadata + captions
├── public/
│   ├── images/                 # Her photos, letter scan, gift photos
│   └── music/                  # Audio files
├── middleware.ts                # Auth middleware — redirects unauthenticated users
├── styles/
│   └── globals.css             # Global styles + keyframe animations
├── lib/
│   └── auth.ts                 # Auth utilities (cookie validation)
└── tailwind.config.ts
```

### 7.3 Password Protection Strategy — Middleware Approach

The protected content must **never** exist in the client JS bundle before authentication. A client-side-only gate would leak all content in the page source/network tab. Instead, use **Next.js middleware + server-side rendering**.

```
Flow:
1. User visits any route → Next.js middleware runs first
2. Middleware checks for a valid auth cookie
3. If NO cookie → render the password gate page (only the gate component is in this bundle)
4. User enters password → POST to /api/auth → validates against env var SITE_PASSWORD
5. On success → API sets an httpOnly secure cookie + returns 200
6. Client redirects to /love → middleware sees valid cookie → allows through
7. /love page renders server-side, protected content is only sent AFTER auth
```

**Why middleware over client-side gating:** Client-side password gates ship all protected content in the JS bundle — anyone can view-source or inspect the network tab to see everything. Middleware ensures the /love route's content is never sent to the browser until the cookie is valid. The protected page literally doesn't exist in the client until she's authenticated.

```typescript
// middleware.ts (simplified)
export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get('authenticated')
  const isLovePage = request.nextUrl.pathname.startsWith('/love')

  if (isLovePage && authCookie?.value !== 'true') {
    return NextResponse.redirect(new URL('/', request.url))
  }
}
```

**Password:** `Devi` (case-insensitive)
**Hint:** "What does he call you that means goddess?"

### 7.4 Environment Variables

```env
SITE_PASSWORD=devi
```

> **Note on image protection:** Images in `/public` are technically accessible if someone guesses the URL. This is acceptable for this use case — no one will brute-force your girlfriend's photos. Overengineering image auth adds complexity for zero real-world benefit here.

---

## 8. Content Requirements

### 8.1 Assets Needed from Kushik

| # | Asset | Format | Status |
|---|-------|--------|--------|
| 1 | Solo photos of Priiyanshii (3-8 recommended) | JPG/PNG, min 1080px wide | Pending |
| 2 | Photo of the Hot Wheels gift + wooden case | JPG/PNG | Pending |
| 3 | Scan/photo of the handwritten love letter | JPG/PNG, high resolution | Pending |
| 4 | A romantic song file (MP3) or song choice for embed | MP3/link | Pending |
| 5 | (Optional) Additional photos — CyberHub, food, bracelet, roses | JPG/PNG | Optional |

### 8.2 Copy to be Written During Implementation

- Hero headline and tagline
- Suspense interstitial text (draft provided in Section 4.2)
- Full timeline descriptions (drafts provided in Section 4.4 — tone: raw and real)
- Gajar ka Halwa aside text
- 15-20 "Reasons I Love You" entries
- Kushik's counter love letter (response to her note)
- **"The Moment I Knew" paragraph** — draft provided in Section 4.7, but Kushik should rewrite in his own voice
- "What I Promise" list (draft provided in Section 4.11)
- Photo captions
- Footer closing message
- Password hint text
- Easter egg copy (5 easter eggs — see Section 4.9)
- "Press if you miss me" message pool (draft provided in Section 4.10)

---

## 9. User Journey

```
┌─────────────────────────────────────────────────────┐
│  Priiyanshii receives a link from Kushik            │
│  (via WhatsApp/text with a teasing message)         │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│  PASSWORD GATE                                       │
│  Beautiful themed screen — "This is for you, Devi"  │
│  Hint: "What does he call you that means goddess?"  │
│  She types: Devi → ✓                                │
└──────────────────────┬──────────────────────────────┘
                       │ (fade to black)
                       ▼
┌─────────────────────────────────────────────────────┐
│  ✨ SUSPENSE INTERSTITIAL                              │
│  Black screen. Text appears line by line:            │
│                                                      │
│     "Before the world changed..."                    │
│     "I met someone."                                 │
│                                                      │
│  ~3-4 seconds of cinematic anticipation              │
└──────────────────────┬──────────────────────────────┘
                       │ (soft upward dissolve)
                       ▼
┌─────────────────────────────────────────────────────┐
│  HERO SECTION                                        │
│  Full-screen, dreamy, emotional headline             │
│  Floating petals, soft music prompt                  │
│                                                      │
│         [ Read Our Story ]  ← CTA button (NEW)      │
│                                                      │
└──────────────────────┬──────────────────────────────┘
                       │ (intentional click)
                       ▼
┌─────────────────────────────────────────────────────┐
│  OUR STORY — TIMELINE                                │
│  7 milestones (6 + "still being written"), on scroll │
│  Each card: slide → sparkle → heart → photo → text  │
│  Multi-stage micro-interactions (NEW)                │
│  Self-drawing timeline line                          │
└──────────────────────┬──────────────────────────────┘
                       │ (scroll)
                       ▼
┌─────────────────────────────────────────────────────┐
│  REASONS I LOVE YOU — "PICK A REASON" JAR            │
│  Draw reasons one by one from an illustrated jar     │
│  Sparkle → unfold → typewriter reveal               │
│  15-20 personalized reasons                          │
└──────────────────────┬──────────────────────────────┘
                       │ (scroll)
                       ▼
┌─────────────────────────────────────────────────────┐
│  THE LOVE LETTER                                     │
│  Her handwritten note displayed beautifully          │
│  + Kushik's written response                         │
└──────────────────────┬──────────────────────────────┘
                       │ (scroll)
                       ▼
┌─────────────────────────────────────────────────────┐
│  💭 "THE MOMENT I KNEW"                              │
│  One deeply personal paragraph — emotional climax    │
│  Full-viewport, centered text, word-by-word fade     │
│  Dark spotlight background                           │
└──────────────────────┬──────────────────────────────┘
                       │ (scroll)
                       ▼
┌─────────────────────────────────────────────────────┐
│  GALLERY                                             │
│  Polaroid-style scattered photos of Priiyanshii      │
│  + gift photos, with typewriter captions in modal    │
└──────────────────────┬──────────────────────────────┘
                       │ (scroll)
                       ▼
┌─────────────────────────────────────────────────────┐
│  💗 "PRESS IF YOU MISS ME"                            │
│  Playful button → random sweet message overlay       │
│  Heart burst animation on click                      │
└──────────────────────┬──────────────────────────────┘
                       │ (scroll)
                       ▼
┌─────────────────────────────────────────────────────┐
│  🤝 "WHAT I PROMISE" (NEW)                           │
│  Forward-looking promises, animated in on scroll     │
│  Raw, real, slightly imperfect tone                  │
│  Ends with: "That's not everything. But it's a       │
│  start."                                             │
└──────────────────────┬──────────────────────────────┘
                       │ (scroll)
                       ▼
┌─────────────────────────────────────────────────────┐
│  FOOTER / CLOSING                                    │
│  "This is just the beginning, Devi."                │
│                                                      │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐               │
│  │  9   │ │  14  │ │  27  │ │  43  │  (NEW)        │
│  │ days │ │hours │ │ mins │ │ secs │  LIVE TIMER   │
│  └──────┘ └──────┘ └──────┘ └──────┘               │
│           ...and counting forever                    │
│                                                      │
│  "Made with love by your shy calm guy"              │
└─────────────────────────────────────────────────────┘

  ♪ MUSIC PLAYER — minimal floating widget, bottom-right
  ✿ AMBIENT PARTICLES — petals/bokeh throughout
  🥚 EASTER EGGS — hidden throughout (photo tap x10, konami code, hidden heart)
```

---

## 10. Acceptance Criteria

| # | Criteria |
|---|---------|
| AC-01 | Password gate blocks all content until correct password is entered |
| AC-02 | Site content is not visible in page source or network tab before authentication |
| AC-03 | **Suspense interstitial plays after password success** — "Before the world changed..." then "I met someone." appear sequentially (~3-4s total) |
| AC-04 | Interstitial skips on returning visits (same session) and goes straight to hero |
| AC-05 | **Hero displays "Read Our Story" CTA button** that smooth-scrolls to timeline on click |
| AC-06 | CTA button has a visible pulse/glow animation |
| AC-07 | All 7 timeline milestones render with correct dates, titles, and descriptions (including the "story still being written" closer) |
| AC-08 | **Timeline cards play multi-stage micro-interactions** — card entry → sparkle → heart pulse → photo reveal → text type-in |
| AC-09 | Timeline micro-interactions trigger only once per card (not on re-scroll) |
| AC-10 | Timeline self-drawing line extends as user scrolls |
| AC-11 | **"Reasons I Love You" jar mechanic** — clicking "Draw a Reason" pulls a unique reason each time with sparkle + unfold animation. No repeats until all are seen. |
| AC-12 | Love letter image displays clearly with readable typed text alongside |
| AC-13 | Photo gallery renders all provided images in an aesthetic layout |
| AC-14 | Music player is functional with play/pause controls |
| AC-15 | **"Press if you miss me" button triggers a random message overlay** from the message pool |
| AC-16 | Pressing the button multiple times shows different messages (not always the same one) |
| AC-17 | **Live relationship timer ticks in real-time** — seconds update every second, all units (days/hours/mins/secs) are accurate |
| AC-18 | Timer is styled in individual cards/boxes with warm color treatment |
| AC-19 | Site is fully responsive and looks good on iPhone 12+ screen sizes |
| AC-20 | Site loads under 3 seconds on a standard 4G connection |
| AC-21 | No indexing by search engines (verified via robots.txt and meta tags) |
| AC-22 | Deployed and accessible on Vercel |
| AC-23 | All animations are smooth (no jank) and respect `prefers-reduced-motion` |
| AC-24 | On mobile, timeline micro-interactions are simplified to 3 stages for performance |
| AC-25 | **"What I Promise" section** renders with staggered scroll animations and correct copy |
| AC-26 | **Timeline ends with "And this story is still being written..."** — milestone #7 has no specific date, uses "???" |
| AC-27 | **Easter egg: photo tap x10** triggers "Okay okay, stop staring at her." toast |
| AC-28 | **Easter egg: Konami code** triggers "Secret level unlocked: hug mode" overlay (desktop only) |
| AC-29 | **Easter egg: hidden heart** is discoverable but not obvious — click reveals message |
| AC-30 | Timeline copy tone is raw and authentic — reads like *him*, not a copywriter |
| AC-31 | **Middleware-based auth** — visiting `/love` directly without cookie redirects to password gate |
| AC-32 | **"The Moment I Knew"** section renders one paragraph with word-by-word fade-in on scroll |
| AC-33 | **Gallery lightbox captions** type out letter-by-letter when a photo modal opens |
| AC-34 | **Password hint delayed** — hint only appears after 3 incorrect password attempts, not immediately |
| AC-35 | **Timeline milestone icons** — each card displays its icon at the timeline dot |
| AC-36 | **Background grain texture** is visible but extremely subtle (opacity 0.02-0.04) |

---

## 11. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Browser autoplay blocks music | Music doesn't play | Default to paused; show prominent play button; HTML5 audio handles this natively |
| Heavy animations cause lag on her phone | Bad UX on primary device | Test on mid-range Android; use GPU-accelerated transforms; reduce particles on mobile |
| Password brute-force | Content exposed | Rate-limit the auth endpoint; password is personal enough to not be guessable by strangers |
| Image loading slow | Timeline feels broken | Use next/image blur placeholders; lazy load below-fold images |
| She opens it on a work computer with strict CSP | Site breaks | Keep dependencies minimal; avoid CDN-loaded scripts; self-host fonts |

---

## 12. Future Enhancements (Post-Launch)

| # | Enhancement | Description |
|---|-------------|-------------|
| E-01 | Add couple photos | As you take photos together, add them to the gallery |
| E-02 | New timeline milestones | Add new dates and memories as they happen |
| E-03 | Anniversary mode | Special animation/message on 24th of each month |
| E-04 | Voice notes | Embed recorded voice messages in timeline cards |
| E-05 | Wish wall | A private section where both can leave notes for each other |
| E-06 | Custom domain | Register something like `forpriiyanshii.com` or `ourdevi.com` |

---

## 13. Sign-Off

| Role | Name | Date | Status |
|------|------|------|--------|
| Creator / Developer | Kushik | 2 April 2026 | Pending |

---

*"Because he showed me how it felt to be treated right, in a week; the way others couldn't do in years."*

*Now it's your turn to show her what "right" looks like — in code.*
