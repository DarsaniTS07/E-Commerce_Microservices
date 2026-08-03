import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Input from "../components/Input";
import Button from "../components/Button";

const forgotPasswordSchema = zod.object({
  email: zod.string().email("Please enter a valid email address"),
});

export const ForgotPassword = () => {
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMsg("");
    try {
      await forgotPassword(data.email);
      navigate(`/reset-password?email=${encodeURIComponent(data.email)}`);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || "Failed to initiate recovery. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-1.5 text-center sm:text-left">
        <h2 className="text-2xl font-bold tracking-tight text-neutral-primary">Recover password</h2>
        <p className="text-sm text-neutral-secondary">
          Enter your registered email address and we will send you a verification code to recover access.
        </p>
      </div>

      {errorMsg && (
        <div className="p-3.5 bg-danger-lightest border border-danger-light rounded-lg text-xs font-semibold text-danger">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="name@example.com"
          error={errors.email?.message}
          {...register("email")}
        />

        <Button type="submit" variant="primary" className="w-full py-2.5" isLoading={loading}>
          Send Verification Code
        </Button>
      </form>

      <div className="text-center text-xs text-neutral-secondary border-t border-neutral-muted pt-4 mt-6">
        Remembered your credentials?{" "}
        <Link to="/login" className="font-bold text-primary hover:underline">
          Return to Sign In
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
