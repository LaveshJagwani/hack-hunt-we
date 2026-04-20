const optionBase =
  "border-4 border-ink px-[11px] py-[9px] text-left font-mono text-[11px] font-bold uppercase tracking-[0.16em] transition duration-150 hover:-translate-y-[2px]";

export default function FilterPanel({
  theme,
  setTheme,
  format,
  setFormat,
  vibe,
  setVibe,
  themeOptions,
  formatOptions,
  vibeOptions
}) {
  const renderOptions = (options, value, onChange) =>
    options.map((option, index) => {
      const normalized = option === "All" ? "All" : option;
      const active = value === normalized;

      return (
        <button
          key={option}
          className={`${optionBase} ${active ? "bg-ink text-paper" : "bg-white"} ${
            index % 2 === 0 ? "rotate-[-0.7deg]" : "rotate-[0.8deg]"
          }`}
          onClick={() => onChange(normalized)}
          type="button"
        >
          {option}
        </button>
      );
    });

  return (
    <aside className="rough-panel relative bg-[#fff9ef] p-[19px] md:p-[23px] xl:sticky xl:top-6">
      <span className="tape right-[18px] top-0 hidden md:block" />
      <p className="section-kicker">Filter mess</p>
      <h2 className="mt-3 max-w-[11ch] text-[2.1rem] font-bold leading-[0.95] tracking-[-0.06em]">
        Find the one worth a weekend.
      </h2>
      <p className="mt-3 text-[0.95rem] leading-7 text-ink/75">
        This board is opinionated. So are you. Good.
      </p>

      <div className="mt-6 space-y-6">
        <section>
          <h3 className="section-kicker">Theme</h3>
          <div className="mt-3 flex flex-wrap gap-3">{renderOptions(themeOptions, theme, setTheme)}</div>
        </section>

        <section>
          <h3 className="section-kicker">Format</h3>
          <div className="mt-3 flex flex-wrap gap-3">{renderOptions(formatOptions, format, setFormat)}</div>
        </section>

        <section>
          <h3 className="section-kicker">Vibe</h3>
          <div className="mt-3 flex flex-wrap gap-3">{renderOptions(vibeOptions, vibe, setVibe)}</div>
        </section>
      </div>

      <p className="mt-6 rotate-[1.3deg] border-2 border-ink bg-butter px-3 py-3 font-mono text-[11px] uppercase tracking-[0.12em]">
        Tiny note: “easy win” does not mean “easy project.” It means the brief is sane.
      </p>
    </aside>
  );
}
