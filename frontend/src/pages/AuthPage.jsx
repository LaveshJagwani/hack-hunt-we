import { Link } from "react-router-dom";
import GoogleButton from "../components/GoogleButton";
import PageLayout from "../components/PageLayout";
import { authReasons } from "../data/siteData";

export default function AuthPage() {
  return (
    <PageLayout>
      <section className="container-weird pt-[34px] sm:pt-[48px]">
        <div className="grid items-start gap-8 xl:grid-cols-[1.02fr_0.98fr]">
          <section className="space-y-6">
            <article className="rough-panel rotate-[-1.2deg] bg-cherry p-[20px] text-paper sm:p-[28px]">
              <p className="section-kicker text-paper/70">Account corner</p>
              <h1 className="mt-4 max-w-[10ch] text-[clamp(2.8rem,8vw,5.5rem)] font-bold leading-[0.88] tracking-[-0.08em]">
                Save the good ones before your brain drops the tab.
              </h1>
              <p className="mt-4 max-w-[38rem] text-[1rem] leading-8 text-paper/82">
                Use Google if you want the quick route. We’re not pretending this needs a dramatic
                onboarding journey.
              </p>
            </article>

            <article className="rough-panel rotate-[1deg] bg-white p-[18px] sm:p-[24px]">
              <p className="section-kicker">Why bother signing in</p>
              <div className="mt-5 space-y-4">
                {authReasons.map((reason, index) => (
                  <div
                    className={`border-4 border-ink p-[14px] font-mono text-[11px] uppercase leading-6 tracking-[0.12em] ${
                      index === 1
                        ? "ml-4 rotate-[1.2deg] bg-butter"
                        : index === 2
                          ? "rotate-[-1deg] bg-sky"
                          : "rotate-[-0.6deg] bg-[#fff8ee]"
                    }`}
                    key={reason}
                  >
                    {reason}
                  </div>
                ))}
              </div>
            </article>
          </section>

          <section className="space-y-6">
            <article className="rough-panel rotate-[-0.8deg] bg-[#fff8ee] p-[18px] sm:p-[24px]">
              <p className="section-kicker">Fast route</p>
              <h2 className="mt-3 text-[2.5rem] font-bold leading-[0.94] tracking-[-0.06em]">
                Welcome back.
              </h2>
              <p className="mt-3 max-w-[30rem] text-[0.98rem] leading-7 text-ink/78">
                Continue with Google to save hackathons, keep your shortlist, and revisit the ones
                that looked promising at 1:12 AM.
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <GoogleButton>Continue with Google</GoogleButton>
                <Link className="rough-button-dark" to="/explore">
                  keep browsing as guest
                </Link>
              </div>
            </article>

            <article className="rough-panel rotate-[1.4deg] bg-mint p-[18px] sm:p-[24px]">
              <p className="section-kicker">No drama</p>
              <p className="max-w-[30rem] text-[1rem] leading-8 text-ink/82">
                This front-end includes the auth entry points and flow. The actual OAuth callback
                wiring would be the next step once we connect a backend.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link className="rough-button" to="/">
                  back home
                </Link>
                <Link className="rough-button-dark" to="/calendar">
                  see the deadline wall
                </Link>
              </div>
            </article>
          </section>
        </div>
      </section>
    </PageLayout>
  );
}
