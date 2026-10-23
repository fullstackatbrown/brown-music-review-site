"use client"

import Link from "next/link"
import Image from "next/image"
import { useMemo } from "react"
import { motion } from "framer-motion"

import type { HomepageArticle } from "@/lib/types"
import EmailSignup from "./components/EmailSignup"
import turntableArm from "./assets/69083a19ea0c16a5b974b718a75cd1d08b245ce6.png"


const MOCK_TITLES = [
  "The Sound of Silence Revisited",
  "When Jazz Met Hip-Hop",
  "Vinyl Dreams in a Digital Age",
  "The Art of the B-Side",
  "Echoes From the Underground",
  "Rhythm & Rebellion",
  "Notes on a Genre in Flux",
  "Frequency and Feeling",
  "The Lost Tapes",
  "Beyond the Bassline",
  "Melody as Memory",
  "Sonic Landscapes",
  "The Groove Manifesto",
  "Chords of Change",
  "Rewind, Replay, Reimagine",
  "Static and Soul",
  "The Backbeat Diaries",
  "Amplified Emotions",
  "Turntable Philosophy",
  "Waveforms and Wanderlust",
]

const MOCK_BLURBS = [
  "A deep exploration of how silence and space define the most powerful moments in music history.",
  "Tracing the unexpected connections between two genres that changed everything.",
  "Why the warmth of analog still matters in an era of infinite streaming.",
  "The forgotten tracks that shaped careers and redefined artistic direction.",
  "How underground scenes continue to push the boundaries of popular music.",
  "An examination of music as protest, from folk to punk to hip-hop.",
]

const MOCK_AUTHORS = [
  "Bryan Chung",
  "Jennifer Park",
  "Thomas Lu",
  "Sarah Kim",
  "Alex Rivera",
]

function makeMockArticle(index: number): HomepageArticle {
  return {
    id: `mock-${index}`,
    slug: "",
    href: "#",
    title: MOCK_TITLES[index % MOCK_TITLES.length],
    artist: MOCK_AUTHORS[index % MOCK_AUTHORS.length],
    reviewer: MOCK_AUTHORS[index % MOCK_AUTHORS.length],
    year: "2026",
    genre: "",
    summary: MOCK_BLURBS[index % MOCK_BLURBS.length],
    typeLabel: "Article",
    coverImage: null,
    ratingLabel: null,
    accentColor: "#D20000",
    labelColor: "#D20000",
    vinylLabel: "BMR",
  }
}

function fillSlots(
  articles: HomepageArticle[],
  count: number
): HomepageArticle[] {
  const result = articles.slice(0, count)
  for (let i = result.length; i < count; i++) {
    result.push(makeMockArticle(i))
  }
  return result
}

// Groove arcs: two opposite wedge-shaped combs, one upper-left and one
// lower-right, giving the disc 180deg point symmetry. Each arc covers 16% of
// its circumference (about 58deg); stepping the dash offset out by ring swings
// each successive arc further round, which shears the comb into its swept
// shape. Radii are in viewBox units, where the disc is 100 across.
const GROOVE_RADII = Array.from({ length: 13 }, (_, i) => 17.5 + i * 2.417)
const GROOVE_ROTATIONS = [0, 180]

/* ------------------------------------------------------------------ */
/*  Spinning Vinyl Record                                              */
/* ------------------------------------------------------------------ */
function SpinningVinyl({ size = 620 }: { size?: number }) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Everything spins together as one unit */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
        className="absolute inset-0"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true">
          {/* Disc */}
          <circle cx="50" cy="50" r="50" fill="#0a0a0a" />

          {/* Grooves. `pathLength={100}` normalises every circle's
              circumference to 100 units, so one dash pattern cuts the same
              sweep of arc at any radius. Offsets stay clear of the path's
              start point, which would otherwise show a hairline join where a
              dash wrapped it. */}
          {GROOVE_ROTATIONS.map((rotation) => (
            <g key={rotation} transform={`rotate(${rotation} 50 50)`}>
              {GROOVE_RADII.map((r, i) => (
                <circle
                  key={r}
                  cx="50"
                  cy="50"
                  r={r}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="1.15"
                  strokeLinecap="round"
                  pathLength={100}
                  strokeDasharray="16 84"
                  strokeDashoffset={-(50 + i * 0.9)}
                />
              ))}
            </g>
          ))}

          {/* Label and spindle hole */}
          <circle cx="50" cy="50" r="14" fill="#ffffff" />
          <circle cx="50" cy="50" r="1.7" fill="#0a0a0a" />
        </svg>
      </motion.div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Article Card (grid)                                                */
/* ------------------------------------------------------------------ */
function ArticleCard({ article }: { article: HomepageArticle }) {
  const inner = (
    <motion.div
      whileHover={{ y: -6 }}
      className="flex flex-col group bg-white cursor-pointer border border-neutral-100 rounded-[14px] overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
    >
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-neutral-200">
        {article.coverImage ? (
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-neutral-200 to-neutral-300" />
        )}
      </div>
      <div className="p-5">
        <h3 className="text-base font-bold leading-snug mb-2 group-hover:text-[#D20000] transition-colors line-clamp-2">
          {article.title}
        </h3>
        <p className="text-xs text-neutral-500 mb-3 line-clamp-3 leading-relaxed">
          {article.summary}
        </p>
        <p className="text-xs italic text-neutral-400">
          by {article.reviewer}
        </p>
      </div>
    </motion.div>
  )

  if (article.slug) {
    return <Link href={article.href}>{inner}</Link>
  }
  return inner
}

/* ------------------------------------------------------------------ */
/*  Auto-scrolling carousel for hero section                           */
/* ------------------------------------------------------------------ */
function AutoScrollCarousel({ articles }: { articles: HomepageArticle[] }) {
  // Duplicate the items so the scroll can loop seamlessly. Because the two
  // copies are identical, when the animation wraps back to its start position
  // the visible layout is pixel-identical — the viewer sees a continuous reel.
  const items = [...articles, ...articles]

  // Each card is CARD_WIDTH wide with a CARD_GAP gutter, so one full "stride"
  // from the start of one card to the start of the next is their sum. Animating
  // by `articles.length * STRIDE` lands the second copy of the list precisely
  // where the first copy started, making the loop seamless. The gap is applied
  // inline rather than via a Tailwind class so the two stay exactly in sync.
  const CARD_WIDTH = 170
  const CARD_GAP = 18
  const STRIDE = CARD_WIDTH + CARD_GAP
  const loopDistance = articles.length * STRIDE

  return (
    <div
      className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]"
    >
      <motion.div
        className="flex"
        style={{ gap: CARD_GAP }}
        // Scroll left-to-right: start with the list shifted one full copy to
        // the left, then ease back to 0. Items visually enter from the left
        // edge and exit on the right.
        animate={{ x: [-loopDistance, 0] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: articles.length * 6,
            ease: "linear",
          },
        }}
      >
        {items.map((article, i) => {
          const card = (
            <div className={`flex-shrink-0 ${article.slug ? "cursor-pointer" : ""}`} style={{ width: CARD_WIDTH }}>
              {/* Cover image */}
              <div className="rounded-[14px] overflow-hidden bg-neutral-200 relative mb-3" style={{ width: CARD_WIDTH, height: CARD_WIDTH }}>
                {article.coverImage ? (
                  <Image
                    src={article.coverImage}
                    alt={article.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-neutral-200 to-neutral-300" />
                )}
              </div>
              {/* Title + author */}
              <div className="text-center">
                <p className="text-sm font-bold leading-tight mb-1">{article.title}</p>
                <p className="text-xs italic text-neutral-500">{article.reviewer}</p>
              </div>
            </div>
          )

          return article.slug ? (
            <Link key={`${article.id}-${i}`} href={article.href}>
              {card}
            </Link>
          ) : (
            <div key={`${article.id}-${i}`}>{card}</div>
          )
        })}
      </motion.div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Dark Section Text Block                                            */
/* ------------------------------------------------------------------ */
function DarkSectionArticle({ article }: { article: HomepageArticle }) {
  const inner = (
    <div className="text-center max-w-[280px]">
      <h4 className="text-white text-lg md:text-xl font-bold mb-2 uppercase">
        {article.title}
      </h4>
      <p className="text-white/70 text-sm leading-relaxed">
        {article.summary}
      </p>
    </div>
  )

  if (article.slug) {
    return (
      <Link href={article.href} className="hover:opacity-80 transition-opacity">
        {inner}
      </Link>
    )
  }
  return inner
}

/* ------------------------------------------------------------------ */
/*  Featured Center Article (dark section)                             */
/* ------------------------------------------------------------------ */
function FeaturedCenterArticle({ article }: { article: HomepageArticle }) {
  const inner = (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-[260px] aspect-square rounded-[20px] overflow-hidden mb-6 bg-neutral-700 shadow-xl relative">
        {article.coverImage ? (
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-neutral-700" />
        )}
      </div>
      <div className="h-[34px] px-7 bg-[#D20000] rounded-[20px] flex items-center justify-center mb-4">
        <span className="text-white text-sm font-normal">Featured</span>
      </div>
      <h2 className="text-white text-xl md:text-2xl font-bold mb-2 text-center">
        {article.title}
      </h2>
      <p className="text-white/70 text-sm text-center leading-relaxed max-w-xs">
        {article.summary}
      </p>
    </div>
  )

  if (article.slug) {
    return (
      <Link href={article.href} className="hover:opacity-90 transition-opacity">
        {inner}
      </Link>
    )
  }
  return inner
}

/* ------------------------------------------------------------------ */
/*  Main Homepage                                                      */
/* ------------------------------------------------------------------ */
export default function HomeClient({ articles }: { articles: HomepageArticle[] }) {

  // "More From BMR" shows at most this many cards; the rest live on /reviews.
  const GRID_LIMIT = 9

  const {
    heroArticles,
    featuredCenter,
    featuredSides,
    gridArticles,
  } = useMemo(() => {
    const total = articles.length

    if (total === 0) {
      // No articles at all — fill everything with mocks
      return {
        heroArticles: fillSlots([], 6),
        featuredCenter: makeMockArticle(6),
        featuredSides: fillSlots([], 6),
        gridArticles: fillSlots([], 6),
      }
    }

    // Hero carousel: first 6 articles
    const hero = fillSlots(articles.slice(0, 6), 6)

    // Dark featured section: next batch after hero
    const center = fillSlots(articles.slice(6, 7), 1)
    const sides = fillSlots(articles.slice(7, 13), 6)

    return {
      heroArticles: hero,
      featuredCenter: center[0],
      featuredSides: sides,
      gridArticles: articles.slice(0, GRID_LIMIT),
    }
  }, [articles])

  return (
    <div className="w-full bg-white relative overflow-x-hidden min-h-screen">
      {/* ============================================================ */}
      {/* HERO: Record player left, Latest From + scrolling cards right  */}
      {/* ============================================================ */}
      <section className="relative w-full flex py-12" style={{ minHeight: 420 }}>
        {/* Left: Record player. Every figure here is the previous one x0.8 —
            the disc, the arm, and the column width all shrink together so the
            arm still meets the disc and the heading stays just clear of the
            record's right edge. Fixed pixel width rather than a percentage: on
            wide viewports a percentage left hundreds of pixels of dead space
            beside the vinyl, pushing the carousel toward the right edge. */}
        <div className="relative flex-shrink-0" style={{ width: 248 }}>
          {/* Drops the whole turntable so the disc's top edge meets the top of
              the carousel, which begins below the heading block. The offset
              restates that block's own spacing — heading line box (leading-none,
              so its font size), mb-2, the 3px rule, mb-6 — less the disc's own
              18px inset, so the two stay aligned as the fluid heading resizes.
              Disc and arm move together and keep their relative positions. */}
          <div
            className="absolute inset-x-0"
            style={{
              top: "calc(clamp(24px, 2.8vw, 42px) + 0.5rem + 3px + 1.5rem - 18px)",
            }}
          >
            <div className="absolute" style={{ left: 11, top: 18 }}>
              <SpinningVinyl size={226} />
            </div>
            <div
              className="absolute z-10"
              style={{
                left: 181,
                top: 0,
                width: 56,
                height: 158,
                transform: "rotate(30deg)",
                transformOrigin: "50% 5%",
              }}
            >
              <Image
                src={turntableArm}
                alt=""
                width={56}
                height={158}
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>

        {/* Right: Latest heading + auto-scrolling article carousel. The
            section's own py-12 supplies the space above the heading and below
            the carousel, so this column adds no vertical padding of its own. */}
        <div className="flex-1 flex flex-col pr-0 overflow-hidden">
          {/* Latest From heading */}
          <div className="pr-8 mb-6">
            <h2 className="font-serif text-[clamp(24px,2.8vw,42px)] font-medium italic text-[#D20000] leading-none mb-2 text-left">
              Latest
            </h2>
            <div className="border-t-[3px] border-black w-full" />
          </div>

          {/* Auto-scrolling carousel. The disc's top edge meets this box's top,
              so the 28px drop — half the disc (226 / 2) less half a cover
              (170 / 2) — puts each cover's center level with the disc's. */}
          <div className="relative flex-1 overflow-hidden" style={{ paddingTop: 28 }}>
            <AutoScrollCarousel articles={heroArticles} />
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION C: Dark Featured Section                              */}
      {/* ============================================================ */}
      <section className="w-full bg-black py-12 px-6 md:px-12">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          <div className="flex flex-col gap-8 items-center">
            {featuredSides.slice(0, 3).map((a) => (
              <DarkSectionArticle key={a.id} article={a} />
            ))}
          </div>
          <FeaturedCenterArticle article={featuredCenter} />
          <div className="flex flex-col gap-8 items-center">
            {featuredSides.slice(3, 6).map((a) => (
              <DarkSectionArticle key={a.id} article={a} />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION D: Article Card Grid                                  */}
      {/* ============================================================ */}
      <section className="w-full px-6 md:px-12 py-12">
        <div className="max-w-[1100px] mx-auto">
          <h2 className="text-2xl font-bold mb-6">More From BMR</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {gridArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION E: See All                                            */}
      {/* ============================================================ */}
      <section className="w-full text-center pb-12">
        <Link
          href="/reviews"
          className="text-2xl font-bold hover:text-[#D20000] transition-colors"
        >
          see all
        </Link>
      </section>

      {/* ============================================================ */}
      {/* SECTION G: Email Signup                                       */}
      {/* ============================================================ */}
      <EmailSignup />
    </div>
  )
}
