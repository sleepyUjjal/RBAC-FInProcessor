import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const partnerMarks = ["Klarna", "Coinbase", "Instacart", "Notion"];

const scaleFeatures = [
  {
    title: "Fast Transfers",
    description: "Create scheduled payouts and move approved funds with complete traceability.",
  },
  {
    title: "Multi-Account Control",
    description: "Run multiple account views with role guardrails and unified oversight.",
  },
  {
    title: "Security Coverage",
    description: "Combine role controls, action logs, and record-level governance in one place.",
  },
];

const launchSteps = [
  {
    step: "1",
    title: "Open your account",
    description: "Set permissions and bring your team into a secure finance workspace.",
  },
  {
    step: "2",
    title: "Move your records",
    description: "Import and organize transactions with clear ownership and clean categories.",
  },
  {
    step: "3",
    title: "Track every action",
    description: "Use logs, summaries, and dashboards to keep operations reliable at scale.",
  },
];

const LandingPage = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 fade-in-up">
        <p className="text-lg">Checking session...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate replace to="/dashboard" />;
  }

  return (
    <div className="min-h-screen px-4 py-6 md:px-8 md:py-10 fade-in-up">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="overflow-hidden rounded-[30px] border border-[var(--border)] bg-[rgba(255,255,255,0.9)] shadow-[var(--shadow-md)]">
          <div className="border-b border-[var(--border)] bg-[rgba(255,255,255,0.92)] px-5 py-4 md:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="h-5 w-5 rounded-md bg-gradient-to-br from-[var(--gold)] to-[var(--gold-deep)]" />
                <p className="text-lg font-semibold text-[var(--text-h)]">FinProcessor</p>
              </div>

              <nav className="hidden items-center gap-6 text-sm text-[var(--text-h)] md:flex">
                <a className="hover:opacity-70" href="#features">
                  Features
                </a>
                <a className="hover:opacity-70" href="#why-us">
                  Why Us
                </a>
                <a className="hover:opacity-70" href="#plans">
                  Plans
                </a>
              </nav>

              <div className="flex items-center gap-2">
                <Link className="btn-secondary px-4 py-2 text-sm" to="/login">
                  Login
                </Link>
                <Link className="btn-primary px-4 py-2 text-sm" to="/register">
                  Sign Up
                </Link>
              </div>
            </div>
          </div>

          <div className="grid items-center gap-10 p-6 md:p-10 lg:grid-cols-[1.08fr_0.92fr] lg:p-12">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--text)]">Finance Operations Suite</p>
              <h1 className="mt-4 max-w-xl leading-[1.05]">
                Get paid sooner, save automatically, and govern every rupee.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed md:text-lg">
                Built for teams who need premium clarity in records, access control, and audit-ready
                workflows without extra noise.
              </p>

              <div className="mt-7 flex max-w-lg flex-wrap items-center gap-2 rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.94)] p-2 shadow-[var(--shadow-sm)] md:flex-nowrap">
                <input className="min-w-[220px] flex-1" placeholder="Your business email" type="email" />
                <Link className="btn-primary px-5 py-2 text-sm" to="/register">
                  Get Started
                </Link>
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-semibold text-[var(--text-h)]">
                {partnerMarks.map((brand) => (
                  <span key={brand}>{brand}</span>
                ))}
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-md">
              <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-[rgba(252,163,17,0.16)]" />
              <div className="relative rounded-3xl border border-[var(--border)] bg-[rgba(255,255,255,0.96)] p-5 shadow-[var(--shadow-md)]">
                <p className="text-xs uppercase tracking-[0.12em] text-[var(--text)]">Invoice</p>
                <p className="mt-2 text-3xl font-semibold text-[var(--text-h)]">₹1,876,580</p>
                <p className="mt-1 text-sm">Apr 2026 settlement window</p>

                <div className="mt-5 space-y-2">
                  <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] p-3 text-sm">
                    Credit Account
                  </div>
                  <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] p-3 text-sm">
                    Bank Account
                  </div>
                </div>

                <button className="btn-secondary mt-5 w-full py-2.5 text-sm" type="button">
                  Pay Now
                </button>
              </div>

              <div className="absolute -right-5 top-12 w-52 rounded-2xl bg-[var(--gold-deep)] p-4 text-white shadow-[var(--shadow-md)]">
                <p className="text-xs uppercase tracking-[0.12em] text-[rgba(255,255,255,0.8)]">Card Vault</p>
                <p className="mt-2 text-xl font-semibold">234 ••••</p>
                <p className="mt-6 text-sm font-medium text-[rgba(255,255,255,0.92)]">FIN VISA</p>
              </div>
            </div>
          </div>
        </section>

        <section className="panel-elevated p-6 md:p-10" id="features">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--text)]">Future Payments</p>
              <h2 className="mt-3 max-w-md">Experience that grows with your scale.</h2>
            </div>
            <p className="max-w-md text-sm md:text-base">
              Design a finance operating layer that works for your team today and remains consistent as
              your volume increases.
            </p>
          </div>

          <div className="mt-7 grid gap-3 md:grid-cols-3">
            {scaleFeatures.map((feature) => (
              <article className="rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.95)] p-5" key={feature.title}>
                <p className="text-base font-semibold text-[var(--text-h)]">{feature.title}</p>
                <p className="mt-2 text-sm leading-relaxed">{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-4" id="why-us">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--text)]">Why Us</p>
            <h2 className="mt-2">Why teams prefer FinProcessor</h2>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <article className="panel-elevated p-6">
              <p className="text-5xl font-semibold text-[var(--gold-deep)]">3k+</p>
              <p className="mt-3 max-w-xs text-base text-[var(--text-h)]">Businesses already managing records in our workspace.</p>
            </article>
            <article className="panel-elevated p-6">
              <p className="text-lg font-semibold text-[var(--text-h)]">Instant withdrawal workflow</p>
              <p className="mt-2 text-sm">Approve, route, and settle funds without switching tools.</p>
              <div className="mt-4 flex items-center gap-3 text-sm">
                <span className="rounded-full bg-[rgba(252,163,17,0.2)] px-3 py-1 font-medium text-[var(--gold-deep)]">Wallet</span>
                <span>→</span>
                <span className="rounded-full bg-[rgba(20,33,61,0.14)] px-3 py-1 font-medium text-[var(--forest)]">Bank</span>
              </div>
            </article>
            <article className="panel-elevated p-6 md:col-span-2">
              <div className="grid gap-6 md:grid-cols-[0.4fr_0.6fr]">
                <div>
                  <p className="text-lg font-semibold text-[var(--text-h)]">No asset volatility</p>
                  <p className="mt-2 text-sm leading-relaxed">
                    Operating on disciplined records means predictable decisions and measurable progress.
                  </p>
                </div>
                <div className="rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.95)] p-4">
                  <p className="text-xs uppercase tracking-[0.12em] text-[var(--text)]">Summary</p>
                  <p className="mt-1 text-2xl font-semibold text-[var(--text-h)]">₹1,876,580</p>
                  <div className="mt-4 h-32 rounded-xl bg-[linear-gradient(180deg,rgba(20,33,61,0.2),rgba(252,163,17,0.12))]" />
                  <div className="mt-2 flex justify-between text-xs text-[var(--text)]">
                    <span>Jan</span>
                    <span>Feb</span>
                    <span>Mar</span>
                    <span>Apr</span>
                    <span>May</span>
                    <span>Jun</span>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </section>

        <section className="overflow-hidden rounded-3xl border border-[rgba(20,33,61,0.28)] bg-[linear-gradient(160deg,#14213d,#000000)] p-6 text-[rgba(255,255,255,0.92)] md:p-10">
          <p className="text-xs uppercase tracking-[0.16em] text-[rgba(255,255,255,0.72)]">Step By Step</p>
          <h2 className="mt-3 max-w-2xl text-[rgba(255,255,255,1)]">Maximize your returns with workflows your team can trust.</h2>

          <div className="mt-7 grid gap-3 md:grid-cols-3">
            {launchSteps.map((item) => (
              <article className="rounded-2xl border border-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.08)] p-5" key={item.step}>
                <p className="text-4xl font-semibold text-[rgba(255,255,255,0.78)]">{item.step}</p>
                <p className="mt-2 text-base font-semibold text-[rgba(255,255,255,1)]">{item.title}</p>
                <p className="mt-2 text-sm text-[rgba(255,255,255,0.88)]">{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="panel-elevated p-6 text-center md:p-10">
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--text)]">Our Mission</p>
          <h2 className="mt-3">We help modern finance teams work with confidence.</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm md:text-base">
            Hundreds of teams rely on structured permissions and clean records to reduce errors and speed decisions.
          </p>

          <div className="mt-7 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.95)] p-5">
              <p className="text-4xl font-semibold text-[var(--gold-deep)]">24%</p>
              <p className="mt-2 text-sm">Revenue increase</p>
            </div>
            <div className="rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.95)] p-5">
              <p className="text-4xl font-semibold text-[var(--gold-deep)]">180K</p>
              <p className="mt-2 text-sm">Transactions tracked</p>
            </div>
            <div className="rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.95)] p-5">
              <p className="text-4xl font-semibold text-[var(--gold-deep)]">10+</p>
              <p className="mt-2 text-sm">Countries supported</p>
            </div>
          </div>
        </section>

        <section className="space-y-4" id="plans">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--text)]">Choose Plan</p>
            <h2 className="mt-2">Built for growing operations.</h2>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <article className="panel-elevated p-6">
              <p className="text-3xl font-semibold text-[var(--text-h)]">Plus</p>
              <p className="mt-6 text-2xl text-[var(--text-h)]">₹299/month</p>
              <p className="mt-2 text-sm">For focused teams that need secure record workflows.</p>
            </article>
            <article className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[linear-gradient(140deg,var(--gold-deep),var(--gold))] p-6 text-white shadow-[var(--shadow-md)]">
              <p className="text-3xl font-semibold">Premium</p>
              <p className="mt-6 text-2xl">₹699/month</p>
              <p className="mt-2 text-sm text-[rgba(255,255,255,0.9)]">
                For scale teams needing advanced control, dashboards, and governance.
              </p>
            </article>
          </div>
        </section>

        <section className="panel-elevated p-6 md:p-8">
          <div className="grid items-center gap-4 md:grid-cols-[1fr_auto]">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--text)]">Try It Today</p>
              <h2 className="mt-2">Ready to level up your finance process?</h2>
              <p className="mt-2 max-w-2xl text-sm md:text-base">
                Create your account, map roles, and start operating with cleaner records and better control.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link className="btn-primary" to="/register">
                Get Started
              </Link>
              <Link className="btn-secondary" to="/login">
                Learn More
              </Link>
            </div>
          </div>
        </section>

        <footer className="rounded-3xl border border-[var(--border)] bg-[rgba(255,255,255,0.86)] p-6 md:p-8">
          <div className="grid gap-6 md:grid-cols-4">
            <div>
              <p className="text-lg font-semibold text-[var(--text-h)]">FinProcessor</p>
              <p className="mt-2 text-sm">Secure records, trusted operations, and premium clarity.</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--text-h)]">Solutions</p>
              <p className="mt-2 text-sm">Small Business</p>
              <p className="mt-1 text-sm">Enterprise</p>
              <p className="mt-1 text-sm">Governance</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--text-h)]">Company</p>
              <p className="mt-2 text-sm">About</p>
              <p className="mt-1 text-sm">Careers</p>
              <p className="mt-1 text-sm">Contact</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--text-h)]">Legal</p>
              <p className="mt-2 text-sm">Privacy</p>
              <p className="mt-1 text-sm">Terms</p>
              <p className="mt-1 text-sm">Policies</p>
            </div>
          </div>
          <div className="mt-6 border-t border-[var(--border)] pt-4 text-center text-sm">
            © {new Date().getFullYear()} FinProcessor. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
