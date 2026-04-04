import { useState } from "react";
import { Link } from "react-router-dom";

const CONTACT_PROFILE = {
  name: "Ujjaldeep Singh",
  role: "Full-Stack Developer",
  email: "ujjaldeep.work@gmail.com",
  github: "https://github.com/sleepyUjjal",
  linkedin: "https://www.linkedin.com/in/ujjaldeep",
  photoUrl: "https://www.linkedin.com/in/ujjaldeep/profile-picture?size=original",
  description:
    "I build secure and scalable finance-focused web apps with a strong focus on clean UX, role-based access control, and reliable backend workflows.",
};

const Contact = () => {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <div className="min-h-screen px-4 py-8 md:px-8 md:py-12 fade-in-up">
      <section className="glass-panel mx-auto max-w-4xl p-8 md:p-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--text)]">Contact</p>
            <h2 className="mt-2 text-3xl">Get in touch</h2>
          </div>
          <Link className="btn-secondary px-4 py-2 text-sm" to="/">
            Back to Home
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-[220px_1fr]">
          <div className="panel-elevated flex items-center justify-center p-4">
            {!imageFailed ? (
              <img
                alt={CONTACT_PROFILE.name}
                className="h-40 w-40 rounded-2xl object-cover shadow-[var(--shadow-sm)]"
                onError={() => setImageFailed(true)}
                src={CONTACT_PROFILE.photoUrl}
              />
            ) : (
              <div className="flex h-40 w-40 items-center justify-center rounded-2xl bg-[linear-gradient(140deg,var(--gold-deep),var(--gold))] text-4xl font-semibold text-white">
                US
              </div>
            )}
          </div>

          <div className="panel-elevated p-5">
            <p className="text-xl font-semibold text-[var(--text-h)]">{CONTACT_PROFILE.name}</p>
            <p className="mt-1 text-sm">{CONTACT_PROFILE.role}</p>
            <p className="mt-4 text-sm leading-relaxed">{CONTACT_PROFILE.description}</p>

            <div className="mt-5 space-y-2 text-sm">
              <p>
                <span className="font-semibold text-[var(--text-h)]">Email: </span>
                <a className="underline" href={`mailto:${CONTACT_PROFILE.email}`}>
                  {CONTACT_PROFILE.email}
                </a>
              </p>
              <p>
                <span className="font-semibold text-[var(--text-h)]">LinkedIn: </span>
                <a
                  className="underline"
                  href={CONTACT_PROFILE.linkedin}
                  rel="noreferrer"
                  target="_blank"
                >
                  {CONTACT_PROFILE.linkedin}
                </a>
              </p>
              <p>
                <span className="font-semibold text-[var(--text-h)]">GitHub: </span>
                <a className="underline" href={CONTACT_PROFILE.github} rel="noreferrer" target="_blank">
                  {CONTACT_PROFILE.github}
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
