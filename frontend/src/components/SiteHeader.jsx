import { Link, NavLink } from "react-router-dom";
import { navItems } from "../data/siteData";
import { SearchIcon } from "./Icons";

const rotations = ["rotate-[-1.5deg]", "rotate-[1.2deg]", "rotate-[-0.8deg]", "rotate-[1.8deg]"];

export default function SiteHeader() {
  return (
    <header className="container-weird relative z-10 pt-[19px] sm:pt-[27px]">
      <div className="rough-panel relative bg-white px-[17px] py-[19px] sm:px-[24px] sm:py-[23px]">
        <span className="tape left-[76px] top-0 hidden md:block" />

        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-[33rem]">
            <div className="mini-note rotate-[-2deg]">late-night hackathon radar</div>
            <Link className="mt-4 inline-block" to="/">
              <div className="font-display text-[clamp(2.5rem,7vw,5rem)] font-bold leading-[0.88] tracking-[-0.09em]">
                HackHunt
              </div>
            </Link>
            <p className="mt-3 max-w-[31rem] text-[0.98rem] leading-7 text-ink/75">
              Built for the person who remembers a perfect hackathon three days after the deadline.
            </p>
          </div>

          <div className="flex max-w-[41rem] flex-wrap items-center gap-3 xl:justify-end">
            {navItems.map((item, index) => (
              <NavLink
                className={({ isActive }) =>
                  `border-4 border-ink px-[13px] py-[10px] font-mono text-[11px] font-bold uppercase tracking-[0.16em] transition duration-150 hover:-translate-y-[2px] ${
                    isActive ? "bg-ink text-paper" : "bg-[#fff8ee]"
                  } ${rotations[index % rotations.length]}`
                }
                end={item.to === "/"}
                key={item.to}
                to={item.to}
              >
                {item.label}
              </NavLink>
            ))}

            <Link className="rough-button-dark flex items-center gap-2 rotate-[-1deg]" to="/explore">
              <SearchIcon />
              open board
            </Link>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3 font-mono text-[11px] uppercase tracking-[0.14em] text-ink/60">
          <span>real deadlines</span>
          <span>messy notes</span>
          <span>no motivational startup poetry</span>
        </div>
      </div>
    </header>
  );
}
