import { Link } from "react-router-dom";

const toneClasses = {
  peach: "bg-[#ffd7c8]",
  mint: "bg-[#d7f4c7]",
  sky: "bg-[#d2e8ff]",
  butter: "bg-[#ffe58f]",
  blush: "bg-[#ffc8d7]",
  paper: "bg-[#fff8ee]"
};

const tiltClasses = {
  left: "md:-rotate-[2.1deg]",
  right: "md:rotate-[1.9deg]",
  slightLeft: "md:-rotate-[0.9deg]",
  slightRight: "md:rotate-[0.8deg]",
  flat: ""
};

const stampClasses = {
  cherry: "bg-cherry text-paper",
  sky: "bg-sky text-ink",
  mint: "bg-mint text-ink",
  butter: "bg-butter text-ink",
  ink: "bg-ink text-paper"
};

export default function HackCard({
  item,
  ctaLabel = "peek inside",
  ctaTo,
  compact = false,
  className = ""
}) {
  const resolvedCtaTo = ctaTo ?? (item.slug ? `/details/${item.slug}` : "/details");

  return (
    <article
      className={`rough-panel jitter-hover group relative mb-6 break-inside-avoid p-[18px] transition duration-150 hover:-translate-y-1 ${
        toneClasses[item.tone] || toneClasses.paper
      } ${tiltClasses[item.tilt] || ""} ${className}`}
    >
      <span className="tape left-[22px] top-0 hidden md:block" />

      <div className="flex flex-wrap gap-[7px]">
        {item.tags.map((tag) => (
          <span
            key={tag}
            className="border-2 border-ink bg-white px-[8px] py-[5px] font-mono text-[10px] font-bold uppercase tracking-[0.12em]"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="section-kicker">{item.host}</p>
          <h3
            className={`max-w-[14ch] font-display font-bold leading-[0.92] tracking-[-0.06em] ${
              compact ? "text-[1.9rem]" : "text-[2.4rem]"
            }`}
            >
              <Link to={resolvedCtaTo}>{item.title}</Link>
            </h3>
        </div>

        <span
          className={`shrink-0 border-4 border-ink px-3 py-[7px] font-mono text-[10px] font-bold uppercase tracking-[0.18em] ${
            stampClasses[item.stamp] || stampClasses.ink
          }`}
        >
          {item.deadline}
        </span>
      </div>

      <p className="mt-4 max-w-[40ch] text-[0.98rem] leading-7 text-ink/80">{item.summary}</p>

      <div className="mt-5 flex flex-wrap gap-3 font-mono text-[11px] uppercase tracking-[0.14em] text-ink/70">
        <span>{item.theme}</span>
        <span>{item.format}</span>
        <span>{item.location}</span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {item.tech?.map((tag) => (
          <span
            key={tag}
            className="border-2 border-dashed border-ink px-[9px] py-[6px] font-mono text-[11px] uppercase tracking-[0.14em]"
          >
            {tag}
          </span>
        ))}
      </div>

      {item.note ? (
        <p className="mt-5 inline-block rotate-[-1.4deg] border-2 border-ink bg-white px-[12px] py-[10px] font-mono text-[12px] leading-5 text-ink/80 shadow-brutal-sm">
          {item.note}
        </p>
      ) : null}

      <div className="mt-6 flex items-end justify-between gap-4 border-t-4 border-dashed border-ink pt-5">
        <div>
          <div className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-ink/65">
            Prize
          </div>
          <div className="text-[2rem] font-bold tracking-[-0.06em]">{item.prize}</div>
        </div>

        <Link className="rough-button" to={resolvedCtaTo}>
          {ctaLabel}
        </Link>
      </div>
    </article>
  );
}
