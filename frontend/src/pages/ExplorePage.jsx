import { startTransition, useDeferredValue, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import FilterPanel from "../components/FilterPanel";
import HackCard from "../components/HackCard";
import PageLayout from "../components/PageLayout";
import { formatFilters, themeFilters, vibeFilters } from "../data/siteData";
import {
  fetchHackathonFilters,
  fetchHackathons,
  mapApiHackathonToCard,
  searchHackathons
} from "../services/hackathonsApi";

const PAGE_SIZE = 12;

export default function ExplorePage() {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [theme, setTheme] = useState("All");
  const [format, setFormat] = useState("All");
  const [vibe, setVibe] = useState("All");
  const [page, setPage] = useState(1);
  const [hackathons, setHackathons] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: PAGE_SIZE, total: 0, totalPages: 1 });
  const [filters, setFilters] = useState({
    themes: themeFilters,
    formats: formatFilters,
    vibes: vibeFilters
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const deferredQuery = useDeferredValue(query);

  useEffect(() => {
    setQuery(searchParams.get("q") ?? "");
    setPage(1);
  }, [searchParams]);

  useEffect(() => {
    let active = true;
    fetchHackathonFilters()
      .then((response) => {
        if (!active || !response?.data) return;
        const themes = response.data.themes?.length ? ["All", ...response.data.themes] : themeFilters;
        const formats = response.data.formats?.length ? ["All", ...response.data.formats] : formatFilters;
        const vibes = response.data.vibes?.length ? ["All", ...response.data.vibes] : vibeFilters;
        setFilters({ themes, formats, vibes });
      })
      .catch(() => {
        setFilters({ themes: themeFilters, formats: formatFilters, vibes: vibeFilters });
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    const normalizedQuery = deferredQuery.trim();

    async function loadHackathons() {
      setLoading(true);
      setError("");

      try {
        const params = {
          page,
          limit: PAGE_SIZE,
          theme: theme !== "All" ? theme : undefined,
          format: format !== "All" ? format : undefined,
          vibe: vibe !== "All" ? vibe : undefined
        };

        const response = normalizedQuery
          ? await searchHackathons(normalizedQuery, params)
          : await fetchHackathons(params);

        if (!active) return;

        const mapped = (response?.data ?? []).map((item, index) => mapApiHackathonToCard(item, index));
        setHackathons(mapped);
        setMeta(response?.meta ?? { page, limit: PAGE_SIZE, total: mapped.length, totalPages: 1 });
      } catch {
        if (!active) return;
        setError("Couldn’t load fresh listings. Try again in a moment.");
        setHackathons([]);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadHackathons();

    return () => {
      active = false;
    };
  }, [deferredQuery, format, page, theme, vibe]);

  return (
    <PageLayout>
      <section className="container-weird pt-[34px] sm:pt-[48px]">
        <div className="grid items-start gap-8 xl:grid-cols-[306px_1fr]">
          <FilterPanel
            format={format}
            formatOptions={filters.formats}
            setFormat={(next) => {
              setFormat(next);
              setPage(1);
            }}
            setTheme={(next) => {
              setTheme(next);
              setPage(1);
            }}
            setVibe={(next) => {
              setVibe(next);
              setPage(1);
            }}
            theme={theme}
            themeOptions={filters.themes}
            vibe={vibe}
            vibeOptions={filters.vibes}
          />

          <section>
            <div className="rough-panel relative ml-auto max-w-[900px] rotate-[-1.1deg] bg-white p-[18px] sm:p-[24px]">
              <span className="tape right-[72px] top-0 hidden md:block" />
              <p className="section-kicker">Main search, intentionally not centered</p>
              <h1 className="mt-3 max-w-[11ch] text-[clamp(2.7rem,8vw,5.6rem)] font-bold leading-[0.9] tracking-[-0.08em]">
                Find the one worth losing sleep for.
              </h1>
              <p className="mt-3 max-w-[37rem] text-[1rem] leading-8 text-ink/78">
                Search by theme, panic level, or that fuzzy feeling of “I think our team could
                actually pull this off.”
              </p>

              <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_auto]">
                <input
                  className="min-h-[70px] border-4 border-ink bg-[#fff8ee] px-[17px] text-[1rem] outline-none placeholder:text-ink/40"
                  onChange={(event) =>
                    startTransition(() => {
                      setQuery(event.target.value);
                      setPage(1);
                    })
                  }
                  placeholder='Search "AI", "frontend", "Bengaluru", or "easy win"'
                  type="text"
                  value={query}
                />
                <button
                  className="rough-button-dark min-h-[70px]"
                  onClick={() => {
                    setQuery("");
                    setTheme("All");
                    setFormat("All");
                    setVibe("All");
                    setPage(1);
                  }}
                  type="button"
                >
                  reset chaos
                </button>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                {["easy win", "mentor-heavy", "irl", "DevTools", "AI"].map((chip, index) => (
                  <button
                    className={`border-2 border-ink px-[11px] py-[9px] font-mono text-[11px] font-bold uppercase tracking-[0.14em] transition hover:-translate-y-[2px] ${
                      index % 2 === 0 ? "rotate-[-1deg] bg-butter" : "rotate-[1deg] bg-paper"
                    }`}
                    key={chip}
                    onClick={() =>
                      startTransition(() => {
                        setQuery(chip);
                        setPage(1);
                      })
                    }
                    type="button"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <div className="mini-note rotate-[-1deg] bg-white">
                {meta.total} hunts still look alive
              </div>
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink/58">
                Sorted by “would I send this to a teammate?”
              </p>
              <Link className="rough-button" to="/calendar">
                open deadline wall
              </Link>
            </div>

            {loading ? (
              <div className="rough-panel mt-8 max-w-[38rem] rotate-[-0.4deg] bg-white p-[22px]">
                <p className="section-kicker">Loading</p>
                <h2 className="mt-3 text-[2.3rem] font-bold leading-[0.95] tracking-[-0.06em]">
                  Pulling fresh listings.
                </h2>
                <p className="mt-3 max-w-[30rem] text-[0.98rem] leading-7 text-ink/76">
                  Grabbing the latest data from the aggregator feeds.
                </p>
              </div>
            ) : error ? (
              <div className="rough-panel mt-8 max-w-[38rem] rotate-[1deg] bg-cherry p-[22px] text-paper">
                <p className="section-kicker text-paper/70">Data unavailable</p>
                <h2 className="mt-3 text-[2.3rem] font-bold leading-[0.95] tracking-[-0.06em]">{error}</h2>
              </div>
            ) : hackathons.length ? (
              <>
                <div className="mt-8 columns-1 gap-6 md:columns-2 2xl:columns-3">
                  {hackathons.map((item, index) => (
                    <HackCard
                      ctaLabel={index % 3 === 0 ? "save spot" : "peek inside"}
                      className={
                        index % 4 === 1 ? "md:mt-[54px]" : index % 4 === 3 ? "md:mt-[26px]" : ""
                      }
                      item={item}
                      key={item.slug ?? item.title}
                    />
                  ))}
                </div>

                {meta.totalPages > 1 ? (
                  <div className="mt-8 flex items-center gap-3">
                    <button
                      className="rough-button"
                      disabled={page <= 1}
                      onClick={() => setPage((value) => Math.max(1, value - 1))}
                      type="button"
                    >
                      previous page
                    </button>
                    <span className="mini-note bg-paper">
                      page {meta.page} / {meta.totalPages}
                    </span>
                    <button
                      className="rough-button-dark"
                      disabled={page >= meta.totalPages}
                      onClick={() => setPage((value) => Math.min(meta.totalPages, value + 1))}
                      type="button"
                    >
                      next page
                    </button>
                  </div>
                ) : null}
              </>
            ) : (
              <div className="rough-panel mt-8 max-w-[38rem] rotate-[1deg] bg-cherry p-[22px] text-paper">
                <p className="section-kicker text-paper/70">No match</p>
                <h2 className="mt-3 text-[2.3rem] font-bold leading-[0.95] tracking-[-0.06em]">
                  Nothing fits that exact mood.
                </h2>
                <p className="mt-3 max-w-[30rem] text-[0.98rem] leading-7 text-paper/80">
                  Try clearing a filter or searching for a broader word like “AI”, “remote”, or
                  “frontend”. The board is chaotic, not magical.
                </p>
              </div>
            )}
          </section>
        </div>
      </section>
    </PageLayout>
  );
}
