import React from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button";

export const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
      <div className="h-16 w-16 bg-danger-lightest rounded-full flex items-center justify-center text-danger font-black text-2xl mb-4 shadow-soft">
        !
      </div>
      <h2 className="text-2xl font-bold tracking-tight text-neutral-primary">Unauthorized Access</h2>
      <p className="text-sm text-neutral-secondary mt-2 max-w-md">
        You do not have the required role permissions to view this console resource. Please contact the administrator.
      </p>
      <div className="mt-6">
        <Link to="/dashboard">
          <Button variant="primary">Return to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
