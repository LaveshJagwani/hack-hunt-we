import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import HackCard from "../components/HackCard";
import MarqueeStrip from "../components/MarqueeStrip";
import PageLayout from "../components/PageLayout";
import {
  discoveryBlurbs,
  featuredHackathons,
  heroScratchNotes,
  landingStats
} from "../data/siteData";

export default function LandingPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  function openSearch(nextQuery) {
    const value = nextQuery.trim();
    navigate(value ? `/explore?q=${encodeURIComponent(value)}` : "/explore");
  }

  function handleSubmit(event) {
    event.preventDefault();
    openSearch(query);
  }

  return (
    <PageLayout>
      <section className="container-weird pt-[34px] sm:pt-[48px]">
        <div className="grid items-start gap-10 xl:grid-cols-[1.08fr_0.92fr]">
          <div>
            <div className="mini-note rotate-[-2.4deg] bg-butter">
              for people with too many tabs and not enough memory
            </div>
            <h1 className="mt-7 max-w-[10ch] text-[clamp(3.6rem,12vw,8.3rem)] font-bold leading-[0.86] tracking-[-0.09em]">
              Stop missing hackathons because they were buried somewhere online.
            </h1>
            <p className="mt-5 max-w-[38rem] text-[1.05rem] leading-8 text-ink/78">
              HackHunt is a scrappy discovery board for deadlines, niche bounties, and events that
              still feel human when every other platform starts sounding like a sales deck.
            </p>

            <form
              className="rough-panel mt-[29px] max-w-[46rem] rotate-[-1.2deg] bg-white p-[16px] sm:p-[18px]"
              onSubmit={handleSubmit}
            >
              <label className="section-kicker" htmlFor="search-hackathons">
                Search like a person, not a database query
              </label>
              <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_auto]">
                <input
                  className="min-h-[68px] border-4 border-ink bg-[#fff8ee] px-[17px] text-[1.02rem] outline-none placeholder:text-ink/42"
                  id="search-hackathons"
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder='Try "AI", "remote", "last date soon", or "weekend-sized"'
                  type="text"
                  value={query}
                />
                <button className="rough-button-dark min-h-[68px]" type="submit">
                  hunt hackathons
                </button>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                {["easy win", "AI", "remote", "frontend"].map((chip, index) => (
                  <button
                    className={`border-2 border-ink bg-paper px-[10px] py-[8px] font-mono text-[11px] font-bold uppercase tracking-[0.14em] transition hover:-translate-y-[2px] ${
                      index % 2 === 0 ? "rotate-[-0.8deg]" : "rotate-[0.8deg]"
                    }`}
                    key={chip}
                    onClick={() => openSearch(chip)}
                    type="button"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </form>

            <p className="mt-5 max-w-[38rem] font-mono text-[11px] uppercase tracking-[0.18em] text-ink/60">
              Tiny promise: if a listing hides the real deadline until the last second, we call it
              out instead of pretending that’s charming.
            </p>
          </div>

          <div className="relative min-h-[520px]">
            <div className="rough-panel absolute left-[3%] top-[9%] w-[68%] rotate-[-4deg] bg-sky p-[18px] sm:w-[57%]">
              <p className="section-kicker">Pinned this week</p>
              <h2 className="mt-3 max-w-[8ch] text-[2.6rem] font-bold leading-[0.92] tracking-[-0.07em]">
                31 deadlines are breathing down someone’s neck.
              </h2>
              <p className="mt-3 text-[0.96rem] leading-7 text-ink/78">
                Most saved right now: devtools, AI mini-grants, and one oddly beloved city quest.
              </p>
            </div>

            <div className="rough-panel absolute right-0 top-0 w-[60%] rotate-[5deg] bg-[#fff8ee] p-[16px] sm:w-[52%]">
              <div className="section-kicker">Tonight&apos;s sticky note</div>
              <p className="mt-3 font-mono text-[12px] leading-6 text-ink/75">
                “If you can demo it in under 90 seconds and explain it without saying synergy,
                someone will probably fund it.”
              </p>
            </div>

            <div className="rough-panel absolute bottom-[4%] left-[12%] w-[79%] rotate-[1.8deg] bg-cherry px-[18px] py-[20px] text-paper">
              <div className="section-kicker text-paper/70">Search scraps</div>
              <div className="mt-4 space-y-3">
                {heroScratchNotes.map((note, index) => (
                  <p
                    className={`border-2 border-paper px-[11px] py-[9px] font-mono text-[11px] uppercase tracking-[0.12em] ${
                      index === 1 ? "ml-6 rotate-[1.7deg]" : "rotate-[-1.1deg]"
                    }`}
                    key={note}
                  >
                    {note}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <MarqueeStrip
        items={[
          "remote-friendly",
          "actual deadlines",
          "frontend-friendly hunts",
          "mentor-heavy picks",
          "events your group chat forgot to mention"
        ]}
      />

      <section className="container-weird mt-[58px] grid gap-8 xl:grid-cols-[0.68fr_1.32fr]">
        <div className="space-y-4 xl:pt-6">
          <p className="section-kicker">Worth opening next</p>
          <h2 className="max-w-[9ch] text-[clamp(2.3rem,6vw,4.6rem)] font-bold leading-[0.9] tracking-[-0.08em]">
            The board is curated for humans with limited patience.
          </h2>
          <p className="max-w-[29rem] text-[1rem] leading-8 text-ink/77">
            No fake urgency banners. No endless duplicate listings. Just the ones that feel
            promising enough to send to a teammate with “wait, this might actually be good.”
          </p>

          <div className="mt-7 space-y-4">
            {discoveryBlurbs.map((item, index) => (
              <article
                className={`rough-panel max-w-[26rem] p-[16px] ${
                  index === 1
                    ? "ml-7 rotate-[1.6deg] bg-butter"
                    : index === 2
                      ? "ml-3 -rotate-[1deg] bg-sky"
                      : "rotate-[-1.5deg] bg-white"
                }`}
                key={item.title}
              >
                <p className="section-kicker">{item.title}</p>
                <p className="mt-3 text-[0.95rem] leading-7 text-ink/78">{item.copy}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="columns-1 gap-6 md:columns-2">
          {featuredHackathons.map((item, index) => (
            <HackCard
              ctaLabel={index % 2 === 0 ? "see details" : "save maybe"}
              className={index === 1 ? "md:mt-[67px]" : index === 3 ? "md:mt-[22px]" : ""}
              item={item}
              key={item.title}
            />
          ))}
        </div>
      </section>

      <section className="container-weird mt-[62px]">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-[1.1fr_0.9fr_0.8fr_1fr]">
          {landingStats.map((item, index) => (
            <article
              className={`rough-panel p-[18px] ${
                item.tone === "sky"
                  ? "bg-sky"
                  : item.tone === "cherry"
                    ? "bg-cherry text-paper"
                    : item.tone === "mint"
                      ? "bg-mint"
                      : "bg-butter"
              } ${index % 2 === 0 ? "rotate-[-1deg]" : "rotate-[1deg]"}`}
              key={item.label}
            >
              <p
                className={`font-mono text-[11px] uppercase tracking-[0.18em] ${
                  item.tone === "cherry" ? "text-paper/70" : "text-ink/62"
                }`}
              >
                {item.label}
              </p>
              <div className="mt-4 text-[3.2rem] font-bold leading-none tracking-[-0.08em]">
                {item.value}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-7 flex flex-wrap items-center gap-4">
          <Link className="rough-button" to="/explore">
            browse full board
          </Link>
          <Link className="rough-button-dark" to="/calendar">
            stalk the deadlines
          </Link>
          <span className="mini-note rotate-[1.6deg] bg-white">yes, “deadline wall” is a real page</span>
        </div>
      </section>
    </PageLayout>
  );
}
