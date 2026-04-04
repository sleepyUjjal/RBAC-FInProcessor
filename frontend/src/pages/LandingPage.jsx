import { Link, Navigate } from "react-router-dom";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAuth } from "../context/useAuth";

const partnerMarks = ["Klarna", "Coinbase", "Instacart", "Notion"];

const scaleFeatures = [
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

const heroIncomeTrend = [
  { t: "Mon", value: 28 },
  { t: "Tue", value: 32 },
  { t: "Wed", value: 30 },
  { t: "Thu", value: 37 },
  { t: "Fri", value: 35 },
  { t: "Sat", value: 41 },
  { t: "Sun", value: 39 },
];

const heroExpenseTrend = [
  { t: "W1", value: 14 },
  { t: "W2", value: 18 },
  { t: "W3", value: 16 },
  { t: "W4", value: 21 },
  { t: "W5", value: 17 },
  { t: "W6", value: 23 },
];

const heroInvestmentTrend = [
  { t: "Jan", value: 11 },
  { t: "Feb", value: 13 },
  { t: "Mar", value: 17 },
  { t: "Apr", value: 16 },
  { t: "May", value: 22 },
  { t: "Jun", value: 25 },
];

const heroTooltipFormatter = (value) => [`₹${Number(value || 0).toLocaleString("en-IN")}`, "Value"];

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
                <a className="hover:opacity-70" href="#mission">
                  Our Mission
                </a>
                <Link className="hover:opacity-70" to="/contact">
                  Contact
                </Link>
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

            <div className="relative mx-auto w-full max-w-xl">
              <div className="absolute -right-8 -top-6 h-40 w-40 rounded-full bg-[rgba(252,163,17,0.14)]" />
              <div className="absolute -left-8 bottom-8 h-32 w-32 rounded-full bg-[rgba(20,33,61,0.1)]" />

              <div className="relative grid gap-3 md:grid-cols-2">
                <article className="panel-elevated md:col-span-2 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-xs uppercase tracking-[0.12em] text-[var(--text)]">Income Momentum</p>
                    <p className="text-xs font-semibold text-[var(--text-h)]">+12.4%</p>
                  </div>
                  <div className="h-36">
                    <ResponsiveContainer height="100%" width="100%">
                      <AreaChart data={heroIncomeTrend} margin={{ top: 6, right: 8, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="heroIncomeFill" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="5%" stopColor="#14213D" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#14213D" stopOpacity={0.04} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid stroke="rgba(20,33,61,0.12)" strokeDasharray="3 3" />
                        <XAxis axisLine={false} dataKey="t" tick={false} tickLine={false} />
                        <YAxis axisLine={false} tick={false} tickLine={false} />
                        <Tooltip formatter={heroTooltipFormatter} labelFormatter={(value) => `${value}`} />
                        <Area
                          dataKey="value"
                          fill="url(#heroIncomeFill)"
                          stroke="#14213D"
                          strokeWidth={2.2}
                          type="monotone"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </article>

                <article className="panel-elevated p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-xs uppercase tracking-[0.12em] text-[var(--text)]">Expense Wave</p>
                    <p className="text-xs font-semibold text-[var(--text-h)]">-3.1%</p>
                  </div>
                  <div className="h-28">
                    <ResponsiveContainer height="100%" width="100%">
                      <LineChart data={heroExpenseTrend} margin={{ top: 6, right: 8, left: 0, bottom: 0 }}>
                        <CartesianGrid stroke="rgba(20,33,61,0.1)" strokeDasharray="3 3" />
                        <XAxis axisLine={false} dataKey="t" tick={false} tickLine={false} />
                        <YAxis axisLine={false} tick={false} tickLine={false} />
                        <Tooltip formatter={heroTooltipFormatter} labelFormatter={(value) => `${value}`} />
                        <Line
                          dataKey="value"
                          dot={{ fill: "#000000", r: 2 }}
                          stroke="#000000"
                          strokeWidth={2}
                          type="monotone"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </article>

                <article className="panel-elevated p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-xs uppercase tracking-[0.12em] text-[var(--text)]">Investment Pulse</p>
                    <p className="text-xs font-semibold text-[var(--text-h)]">+8.9%</p>
                  </div>
                  <div className="h-28">
                    <ResponsiveContainer height="100%" width="100%">
                      <BarChart data={heroInvestmentTrend} margin={{ top: 6, right: 8, left: 0, bottom: 0 }}>
                        <CartesianGrid stroke="rgba(20,33,61,0.08)" strokeDasharray="3 3" />
                        <XAxis axisLine={false} dataKey="t" tick={false} tickLine={false} />
                        <YAxis axisLine={false} tick={false} tickLine={false} />
                        <Tooltip formatter={heroTooltipFormatter} labelFormatter={(value) => `${value}`} />
                        <Bar dataKey="value" fill="#FCA311" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </article>
              </div>
            </div>
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

        <section className="panel-elevated p-6 md:p-10" id="features">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--text)]">Features</p>
              <h2 className="mt-3 max-w-md">Experience that grows with your scale.</h2>
            </div>
            <p className="max-w-md text-sm md:text-base">
              Design a finance operating layer that works for your team today and remains consistent as
              your volume increases.
            </p>
          </div>

          <div className="mt-7 grid gap-3 md:grid-cols-2">
            {scaleFeatures.map((feature) => (
              <article className="rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.95)] p-5" key={feature.title}>
                <p className="text-base font-semibold text-[var(--text-h)]">{feature.title}</p>
                <p className="mt-2 text-sm leading-relaxed">{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="panel-elevated p-6 text-center md:p-10" id="mission">
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
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <p className="text-lg font-semibold text-[var(--text-h)]">FinProcessor</p>
              <p className="mt-2 text-sm">Secure records, trusted operations, and premium clarity.</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--text-h)]">Contact</p>
              <Link className="mt-2 block text-sm hover:opacity-70" to="/contact">
                Contact Page
              </Link>
              <a className="mt-1 block text-sm hover:opacity-70" href="mailto:ujjaldeep.work@gmail.com">
                ujjaldeep.work@gmail.com
              </a>
              <a
                className="mt-1 block text-sm hover:opacity-70"
                href="https://www.linkedin.com/in/ujjaldeep"
                rel="noreferrer"
                target="_blank"
              >
                LinkedIn
              </a>
              <a
                className="mt-1 block text-sm hover:opacity-70"
                href="https://github.com/sleepyUjjal"
                rel="noreferrer"
                target="_blank"
              >
                GitHub
              </a>
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
