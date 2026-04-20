import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

export default function PageLayout({ children }) {
  return (
    <div className="relative overflow-x-clip pb-10">
      <div className="paper-grid" />
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_22%_18%,rgba(255,201,60,0.18),transparent_18%),radial-gradient(circle_at_80%_32%,rgba(255,107,74,0.12),transparent_16%),radial-gradient(circle_at_60%_84%,rgba(122,196,255,0.14),transparent_18%)]" />
      <SiteHeader />
      <main className="relative z-10">{children}</main>
      <SiteFooter />
    </div>
  );
}
