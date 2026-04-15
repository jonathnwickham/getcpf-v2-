import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Logo from "@/components/Logo";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6">
      <div className="text-center max-w-[400px]">
        <Link to="/" className="mb-8 inline-block">
          <Logo className="h-8" />
        </Link>
        <h1 className="text-5xl font-extrabold mb-4">404</h1>
        <p className="text-lg font-semibold mb-2">This page doesn't exist</p>
        <p className="text-sm text-gray-500 mb-8">But your Brazilian CPF can.</p>
        <Link
          to="/pricing"
          className="inline-flex items-center justify-center bg-green-800 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-green-900 transition-all"
        >
          Get my CPF →
        </Link>
        <div className="mt-4">
          <Link to="/" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
            ← Back to homepage
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
