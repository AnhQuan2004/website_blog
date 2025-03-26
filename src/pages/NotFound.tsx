import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md px-4">
        <h1 className="text-6xl font-bold mb-4 text-gray-900">404</h1>
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Oops! Page not found
        </h2>
        <p className="text-gray-600 mb-8">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>
        <Link to="/">
          <Button className="px-6">Return to Home</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
