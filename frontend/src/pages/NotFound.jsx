import { Link } from "react-router-dom";

/* -------------------------------------------------
  NotFound component – 404 page
  ------------------------------------------------- */
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-7xl font-bold">404</h1>

      <p className="mt-4 text-xl">Page not found</p>

      <Link to="/" className="mt-6 rounded bg-blue-600 px-6 py-3 text-white">
        Go Home
      </Link>
    </div>
  );
}
