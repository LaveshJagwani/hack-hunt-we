export default function MarqueeStrip({ items }) {
  const repeated = [...items, ...items];

  return (
    <div className="container-weird relative z-10 mt-[26px] overflow-hidden border-y-4 border-ink bg-mustard py-[13px]">
      <div className="marquee-track flex min-w-max gap-8 px-4 font-mono text-[11px] font-bold uppercase tracking-[0.28em] text-ink">
        {repeated.map((item, index) => (
          <span key={`${item}-${index}`} className="flex items-center gap-8">
            <span>{item}</span>
            <span className="text-ink/45">///</span>
          </span>
        ))}
      </div>
    </div>
  );
}
