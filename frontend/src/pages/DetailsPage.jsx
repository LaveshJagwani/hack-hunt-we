import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import HackCard from "../components/HackCard";
import PageLayout from "../components/PageLayout";
import { recommendedHackathons, spotlightHackathon } from "../data/siteData";
import {
  fetchHackathonBySlug,
  fetchTrendingHackathons,
  mapApiHackathonToCard
} from "../services/hackathonsApi";

export default function DetailsPage() {
  const { slug } = useParams();
  const [spotlight, setSpotlight] = useState(spotlightHackathon);
  const [recommended, setRecommended] = useState(recommendedHackathons);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadDetails() {
      setLoading(true);
      setError("");

      try {
        if (slug) {
          const [detailsResponse, trendingResponse] = await Promise.all([
            fetchHackathonBySlug(slug),
            fetchTrendingHackathons(6)
          ]);

          if (!active) return;

          const detailItem = detailsResponse?.data;
          const trendingItems = trendingResponse?.data ?? [];

          if (detailItem) {
            setSpotlight(buildSpotlight(detailItem));
          }

          const nextRecommended = trendingItems
            .filter((item) => item.slug !== detailItem?.slug)
            .slice(0, 2)
            .map((item, index) => mapApiHackathonToCard(item, index));

          if (nextRecommended.length) {
            setRecommended(nextRecommended);
          }
        } else {
          const trendingResponse = await fetchTrendingHackathons(5);
          if (!active) return;

          const trendingItems = trendingResponse?.data ?? [];
          if (trendingItems.length) {
            setSpotlight(buildSpotlight(trendingItems[0]));
            setRecommended(
              trendingItems.slice(1, 3).map((item, index) => mapApiHackathonToCard(item, index))
            );
          }
        }
      } catch {
        if (!active) return;
        setError("Couldn’t load the latest spotlight details.");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadDetails();

    return () => {
      active = false;
    };
  }, [slug]);

  const displaySpotlight = useMemo(() => spotlight, [spotlight]);

  return (
    <PageLayout>
      <section className="container-weird pt-[34px] sm:pt-[48px]">
        <div className="grid items-start gap-8 xl:grid-cols-[1.15fr_0.85fr]">
          <section className="rough-panel relative rotate-[-1.1deg] bg-white p-[18px] sm:p-[28px]">
            <span className="tape left-[88px] top-0 hidden md:block" />
            <p className="section-kicker">Spotlight dossier / no startup fog</p>
            <h1 className="mt-4 max-w-[10ch] text-[clamp(3rem,8vw,6rem)] font-bold leading-[0.88] tracking-[-0.08em]">
              {displaySpotlight.title}
            </h1>
            <p className="mt-4 max-w-[41rem] text-[1.05rem] leading-8 text-ink/78">
              {displaySpotlight.subtitle}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {displaySpotlight.tags.map((tag, index) => (
                <span
                  className={`border-2 border-ink px-[10px] py-[8px] font-mono text-[11px] font-bold uppercase tracking-[0.14em] ${
                    index % 2 === 0 ? "rotate-[-0.8deg] bg-butter" : "rotate-[0.8deg] bg-paper"
                  }`}
                  key={tag}
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {[
                ["Host", displaySpotlight.host],
                ["Location", displaySpotlight.location],
                ["Format", displaySpotlight.format],
                ["Deadline", displaySpotlight.deadline],
                ["Build window", displaySpotlight.buildWindow],
                ["Team size", displaySpotlight.team]
              ].map(([label, value], index) => (
                <div
                  className={`border-4 border-ink p-[15px] ${
                    index % 3 === 0 ? "bg-sky" : index % 3 === 1 ? "bg-[#fff8ee]" : "bg-mint"
                  }`}
                  key={label}
                >
                  <p className="section-kicker">{label}</p>
                  <p className="mt-3 text-[1.02rem] leading-7">{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="rough-button-dark" to="/auth">
                save this one
              </Link>
              <Link className="rough-button" to="/explore">
                back to the board
              </Link>
              <span className="mini-note rotate-[1.4deg] bg-paper">
                team that can demo fast &gt; giant team
              </span>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rough-panel rotate-[2deg] bg-butter p-[18px]">
              <p className="section-kicker">Why this one is hot</p>
              <p className="mt-4 text-[1.02rem] leading-8 text-ink/82">{displaySpotlight.whyItHits}</p>
            </div>

            <div className="rough-panel rotate-[-1.5deg] bg-cherry p-[18px] text-paper">
              <p className="section-kicker text-paper/70">Prize check</p>
              <div className="mt-4 text-[3.7rem] font-bold leading-none tracking-[-0.09em]">
                {displaySpotlight.prize}
              </div>
              <p className="mt-3 text-[0.98rem] leading-7 text-paper/80">
                Not the biggest on the internet. Plenty big enough to care.
              </p>
            </div>
          </aside>
        </div>
      </section>

      {loading ? (
        <section className="container-weird mt-[28px]">
          <article className="rough-panel rotate-[0.6deg] bg-[#fff8ee] p-[18px] sm:p-[24px]">
            <p className="section-kicker">Loading</p>
            <p className="mt-4 max-w-[48rem] text-[1rem] leading-8 text-ink/80">
              Pulling full details for this listing.
            </p>
          </article>
        </section>
      ) : (
        <section className="container-weird mt-[28px] grid gap-8 xl:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            <article className="rough-panel rotate-[0.6deg] bg-[#fff8ee] p-[18px] sm:p-[24px]">
              <p className="section-kicker">The actual brief</p>
              <p className="mt-4 max-w-[48rem] text-[1rem] leading-8 text-ink/80">
                {displaySpotlight.description}
              </p>
            </article>

            <article className="rough-panel rotate-[-0.8deg] bg-white p-[18px] sm:p-[24px]">
              <p className="section-kicker">Tracks people are circling</p>
              <div className="mt-5 flex flex-wrap gap-3">
                {displaySpotlight.tracks.map((track, index) => (
                  <span
                    className={`border-4 border-ink px-[13px] py-[12px] font-mono text-[11px] font-bold uppercase tracking-[0.14em] ${
                      index === 1
                        ? "rotate-[1.4deg] bg-sky"
                        : index === 2
                          ? "-rotate-[1deg] bg-butter"
                          : "rotate-[-1deg] bg-mint"
                    }`}
                    key={track}
                  >
                    {track}
                  </span>
                ))}
              </div>
            </article>

            <article className="rough-panel rotate-[1deg] bg-mint p-[18px] sm:p-[24px]">
              <p className="section-kicker">Timeline that respects your attention span</p>
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                {displaySpotlight.timeline.map((item, index) => (
                  <div
                    className={`border-4 border-ink p-[14px] ${
                      index === 1 ? "rotate-[1.1deg] bg-white" : "rotate-[-0.8deg] bg-[#fff8ee]"
                    }`}
                    key={item.label}
                  >
                    <p className="section-kicker">{item.label}</p>
                    <p className="mt-3 text-[0.98rem] leading-7">{item.value}</p>
                  </div>
                ))}
              </div>
            </article>
          </div>

          <aside className="space-y-6">
            <article className="rough-panel rotate-[-1deg] bg-sky p-[18px]">
              <p className="section-kicker">Perks, not fluff</p>
              <div className="mt-4 space-y-3">
                {displaySpotlight.perks.map((perk, index) => (
                  <p
                    className={`border-2 border-ink bg-white px-[11px] py-[10px] font-mono text-[11px] uppercase leading-6 tracking-[0.12em] ${
                      index === 1 ? "ml-4 rotate-[1.1deg]" : "rotate-[-0.9deg]"
                    }`}
                    key={perk}
                  >
                    {perk}
                  </p>
                ))}
              </div>
            </article>

            <div>
              <p className="section-kicker mb-3">If this one is full</p>
              {recommended.map((item) => (
                <HackCard compact ctaLabel="keep nearby" className="mb-5" item={item} key={item.title} />
              ))}
            </div>
          </aside>
        </section>
      )}

      {error ? (
        <section className="container-weird mt-8">
          <div className="rough-panel max-w-[38rem] rotate-[1deg] bg-cherry p-[22px] text-paper">
            <p className="section-kicker text-paper/70">Data unavailable</p>
            <h2 className="mt-3 text-[2.1rem] font-bold leading-[0.95] tracking-[-0.06em]">{error}</h2>
          </div>
        </section>
      ) : null}
    </PageLayout>
  );
}

function buildSpotlight(item) {
  const tags = Array.isArray(item.tags) && item.tags.length ? item.tags.slice(0, 4) : ["fresh listing"];
  const tracks = Array.isArray(item.tech) && item.tech.length ? item.tech.slice(0, 3) : ["Build quality", "Demo speed", "Practical utility"];

  return {
    title: item.title ?? spotlightHackathon.title,
    subtitle: item.summary ?? "For teams who like practical demos more than dramatic pitch decks.",
    host: item.host ?? "Host not listed",
    location: item.location ?? "Location TBD",
    format: item.format ? item.format.toUpperCase() : "UNKNOWN",
    deadline: item.deadlineLabel ?? "Deadline TBD",
    buildWindow: "Typical sprint format (48-72 hours)",
    prize: item.prize ?? "Prize TBD",
    team: "Solo to 5 people",
    whyItHits:
      item.summary ??
      "This listing is trending because it balances clear scope, practical judging, and strong team viability.",
    description:
      item.description ??
      item.summary ??
      "Detailed brief is currently being synchronized from source listings.",
    tags,
    tracks,
    timeline: [
      { label: "Discover", value: "Now indexed on HackHunt" },
      { label: "Apply", value: item.deadlineLabel ?? "Check source page" },
      { label: "Build", value: "After acceptance / challenge kickoff" }
    ],
    perks: [
      "Structured challenge format and clear deliverables.",
      "Direct source link preserved for official updates.",
      "Indexed with ranking signals for easier shortlist decisions."
    ]
  };
}
