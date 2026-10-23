"use client";
import Image from "next/image";
import Link from "next/link";
import EmailSignup from "../components/EmailSignup";
import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import type { HomepageArticle } from "@/lib/types";

function OpinionCard({ article, index }: { article: HomepageArticle; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [hovered, setHovered] = useState(false);
  const isLarge = index === 0;

  const card = (
    <motion.div ref={ref} initial={{ opacity: 0, y: 32 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: index * 0.06 }} onHoverStart={() => setHovered(true)} onHoverEnd={() => setHovered(false)} className={`group cursor-pointer ${isLarge ? "md:col-span-2 md:row-span-2" : ""}`}>
      <div className={`flex flex-col h-full rounded-none border-l-4 bg-white transition-all ${hovered ? "shadow-lg" : "shadow-sm"}`} style={{ borderLeftColor: hovered ? article.accentColor : "#e5e5e5" }}>
        {isLarge && (
          <div className="relative w-full aspect-[16/9] overflow-hidden bg-neutral-200">
            {article.coverImage ? <Image src={article.coverImage} alt={article.title} fill className="object-cover" priority /> : <div className="w-full h-full bg-gradient-to-br from-neutral-200 to-neutral-300" />}
          </div>
        )}
        <div className="p-4 flex flex-col gap-2 flex-1">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: article.accentColor }} />
            <span className="text-[0.65rem] tracking-widest uppercase text-neutral-400">{article.typeLabel} &middot; {article.year}</span>
          </div>
          <h3 className={`font-bold leading-snug transition-colors ${isLarge ? "text-xl" : "text-base"}`} style={{ color: hovered ? article.accentColor : "#0a0a0a" }}>{article.title}</h3>
          <p className={`text-neutral-500 leading-relaxed ${isLarge ? "text-sm line-clamp-4" : "text-xs line-clamp-3"}`}>{article.summary}</p>
          <div className="mt-auto pt-2"><span className="text-xs font-medium text-neutral-600">{article.reviewer}</span></div>
        </div>
      </div>
    </motion.div>
  );

  if (article.slug) return <Link href={article.href}>{card}</Link>;
  return card;
}

function FeaturedOpinion({ article }: { article: HomepageArticle }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const inner = (
    <motion.div ref={ref} initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.6 }} className="w-full bg-black text-white" style={{ padding: "52px 32px" }}>
      <div className="max-w-[800px] mx-auto flex flex-col items-center text-center gap-5">
        <span className="text-xs tracking-widest uppercase text-[#D20000]">Featured</span>
        <h2 className="font-serif text-3xl md:text-4xl font-bold italic leading-tight max-w-2xl">&ldquo;{article.title}&rdquo;</h2>
        <div className="w-12 h-[2px] bg-[#D20000]" />
        <p className="text-sm leading-relaxed text-neutral-300 max-w-xl">{article.summary}</p>
        <p className="text-xs tracking-wide uppercase text-neutral-500">{article.reviewer} &middot; {article.year}</p>
        <motion.span whileHover={{ scale: 1.05 }} className="px-6 py-2 bg-[#D20000] text-white text-xs tracking-widest uppercase inline-block">Read the Full Take &rarr;</motion.span>
      </div>
    </motion.div>
  );

  if (article.slug) return <Link href={article.href}>{inner}</Link>;
  return inner;
}

export default function OpinionsClient({ articles }: { articles: HomepageArticle[] }) {
  const [displayedCount, setDisplayedCount] = useState(7);
  const featured = articles[0] ?? null;
  const rest = articles.slice(1);

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="px-8 pt-10 pb-7 border-b border-neutral-200">
        <span className="text-xs tracking-widest uppercase text-[#D20000] block mb-2">Brown Music Review</span>
        <h1 className="font-serif text-4xl font-bold italic text-[#D20000] mb-3">Opinions</h1>
        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.3, duration: 0.5 }} className="h-[2px] w-14 bg-black origin-left mb-4" />
        <p className="text-sm text-neutral-500 max-w-md leading-relaxed">Bold takes about music.</p>
      </motion.div>

      {featured && <FeaturedOpinion article={featured} />}

      <div className="px-8 py-10">
        <div className="flex items-center gap-3 mb-8 max-w-[1000px] mx-auto">
          <h2 className="font-serif text-xl font-bold italic">All Opinions</h2>
          <div className="h-[2px] w-8 bg-[#D20000]" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-[1000px] mx-auto">
          {rest.slice(0, displayedCount).map((article, idx) => (
            <OpinionCard key={article.id} article={article} index={idx} />
          ))}
        </div>
        {displayedCount < rest.length && (
          <div className="flex justify-center mt-8">
            <motion.button whileHover={{ scale: 1.05 }} onClick={() => setDisplayedCount((prev) => Math.min(prev + 3, rest.length))} className="px-6 py-2 text-xs tracking-widest uppercase bg-[#D20000] text-white cursor-pointer">Load More</motion.button>
          </div>
        )}
      </div>
      <EmailSignup />
    </>
  );
}
