import { Link } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import { calendarDays, calendarHighlights } from "../data/siteData";

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const toneClasses = {
  sky: "bg-sky",
  butter: "bg-butter",
  mint: "bg-mint",
  cherry: "bg-cherry text-paper",
  peach: "bg-[#ffd7c8]"
};

export default function CalendarPage() {
  return (
    <PageLayout>
      <section className="container-weird pt-[34px] sm:pt-[48px]">
        <div className="grid items-start gap-8 xl:grid-cols-[1.1fr_0.9fr]">
          <section>
            <div className="rough-panel rotate-[-1deg] bg-white p-[18px] sm:p-[24px]">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="section-kicker">Deadline wall</p>
                  <h1 className="mt-3 text-[clamp(2.8rem,7vw,5.6rem)] font-bold leading-[0.9] tracking-[-0.08em]">
                    April 2026
                  </h1>
                  <p className="mt-2 max-w-[31rem] text-[1rem] leading-8 text-ink/76">
                    Use this when your brain wants one place to scream “oh right, that closes on
                    Thursday.”
                  </p>
                </div>

                <div className="mini-note rotate-[1.4deg] bg-butter">
                  important dates, less fake urgency
                </div>
              </div>

              <div className="mt-7 grid grid-cols-7 gap-3">
                {daysOfWeek.map((day, index) => (
                  <div
                    className={`border-4 border-ink px-2 py-3 text-center font-mono text-[11px] font-bold uppercase tracking-[0.18em] ${
                      index % 2 === 0 ? "bg-[#fff8ee]" : "bg-sand"
                    }`}
                    key={day}
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div className="mt-3 grid grid-cols-7 gap-3">
                {calendarDays.map((entry, index) => {
                  if (entry.ghost) {
                    return (
                      <div
                        className="min-h-[118px] border-4 border-dashed border-ink/20 bg-transparent"
                        key={`ghost-${index}`}
                      />
                    );
                  }

                  const cell = (
                    <div
                      className={`flex min-h-[118px] flex-col justify-between border-4 border-ink p-[10px] transition duration-150 hover:-translate-y-[2px] ${
                        entry.focus
                          ? "bg-cherry text-paper"
                          : entry.tone
                            ? toneClasses[entry.tone]
                            : "bg-[#fff8ee]"
                      } ${index % 2 === 0 ? "rotate-[-0.8deg]" : "rotate-[0.6deg]"}`}
                    >
                      <span className="font-mono text-[11px] font-bold uppercase tracking-[0.16em]">
                        {entry.day}
                      </span>

                      {entry.event ? (
                        <div>
                          <p className="font-display text-[1rem] font-bold leading-5">{entry.event}</p>
                          <p
                            className={`mt-2 font-mono text-[10px] uppercase tracking-[0.14em] ${
                              entry.focus ? "text-paper/72" : "text-ink/60"
                            }`}
                          >
                            tap into this before it sneaks past you
                          </p>
                        </div>
                      ) : (
                        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink/35">
                          still quiet
                        </span>
                      )}
                    </div>
                  );

                  if (entry.focus) {
                    return (
                      <Link key={entry.day} to="/details">
                        {cell}
                      </Link>
                    );
                  }

                  return <div key={entry.day}>{cell}</div>;
                })}
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rough-panel rotate-[2deg] bg-butter p-[18px]">
              <p className="section-kicker">Pinned note</p>
              <h2 className="mt-3 max-w-[10ch] text-[2.4rem] font-bold leading-[0.94] tracking-[-0.06em]">
                Do future-you a favor and shortlist before the last day.
              </h2>
              <p className="mt-4 text-[0.98rem] leading-7 text-ink/78">
                Half the stress comes from remembering the date too late. The other half is team
                coordination. We can at least help with the first part.
              </p>
            </div>

            <div className="rough-panel rotate-[-1deg] bg-white p-[18px]">
              <p className="section-kicker">This month&apos;s loudest dates</p>
              <div className="mt-4 space-y-4">
                {calendarHighlights.map((item, index) => (
                  <article
                    className={`border-4 border-ink p-[14px] ${
                      index === 1
                        ? "rotate-[1deg] bg-sky"
                        : index === 2
                          ? "-rotate-[1deg] bg-mint"
                          : "rotate-[-1deg] bg-[#fff8ee]"
                    }`}
                    key={item.date}
                  >
                    <p className="section-kicker">{item.date}</p>
                    <h3 className="mt-2 text-[1.25rem] font-bold leading-6 tracking-[-0.04em]">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-[0.94rem] leading-7 text-ink/76">{item.copy}</p>
                  </article>
                ))}
              </div>

              <Link className="rough-button-dark mt-5" to="/details">
                open featured dossier
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </PageLayout>
  );
}
