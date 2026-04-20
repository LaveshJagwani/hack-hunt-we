import { Link } from "react-router-dom";
import { footerLinks } from "../data/siteData";

export default function SiteFooter() {
  return (
    <footer className="container-weird relative z-10 pt-[68px]">
      <div className="rough-panel rotate-[0.8deg] bg-ink px-[18px] py-[20px] text-paper sm:px-[26px] sm:py-[25px]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[38rem]">
            <div className="mini-note rotate-[-1deg] border-paper bg-mustard text-ink shadow-none">
              made by someone tired of buried links
            </div>
            <h2 className="mt-4 text-[clamp(2rem,5vw,3.8rem)] font-bold leading-[0.9] tracking-[-0.08em]">
              HackHunt keeps the good stuff from slipping through the cracks.
            </h2>
            <p className="mt-3 max-w-[32rem] text-[0.98rem] leading-7 text-paper/74">
              Save the promising ones. Ignore the suspicious ones. Try not to submit at 11:59 PM.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {footerLinks.map((item, index) => (
              <Link
                className={`border-4 border-paper px-[12px] py-[10px] font-mono text-[11px] font-bold uppercase tracking-[0.15em] transition duration-150 hover:-translate-y-[2px] ${
                  index % 2 === 0 ? "rotate-[-1.1deg]" : "rotate-[1.1deg]"
                }`}
                key={item.to}
                to={item.to}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <p className="mb-2 mt-5 font-mono text-[11px] uppercase tracking-[0.18em] text-ink/58">
        © 2026 HackHunt. Built with caffeine, opinions, and a healthy distrust of generic landing
        pages.
      </p>
    </footer>
  );
}
