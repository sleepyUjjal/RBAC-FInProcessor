import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 fade-in-up">
      <div className="glass-panel w-full max-w-xl p-8 text-center md:p-10">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--text)]">Wrong Turn</p>
        <h2 className="mb-3 mt-3 text-3xl">404</h2>
        <p className="mb-7">The page you requested does not exist.</p>
        <Link className="btn-primary" to="/">
          Return Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
