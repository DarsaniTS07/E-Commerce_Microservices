import React from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button";

export const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6 bg-neutral-lightest">
      <h1 className="text-8xl font-black tracking-tight bg-brand-gradient bg-clip-text text-transparent">404</h1>
      <h2 className="text-2xl font-bold tracking-tight text-neutral-primary mt-4">Page Not Found</h2>
      <p className="text-sm text-neutral-secondary mt-2 max-w-md">
        The page you are looking for does not exist or has been relocated.
      </p>
      <div className="mt-6">
        <Link to="/dashboard">
          <Button variant="primary">Return Home</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
