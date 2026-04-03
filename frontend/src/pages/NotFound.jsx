import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="glass-panel w-full max-w-xl p-8 text-center">
        <h2 className="mb-3 text-3xl">404</h2>
        <p className="mb-6">The page you requested does not exist.</p>
        <Link className="btn-primary" to="/">
          Return Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

