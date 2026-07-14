import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Input from "../components/Input";
import Button from "../components/Button";

const resetPasswordSchema = zod.object({
  email: zod.string().email("Please enter a valid email address"),
  code: zod.string().min(4, "Verification code must be at least 4 digits"),
  newPassword: zod.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: zod.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords must match",
  path: ["confirmPassword"],
});

export const ResetPassword = () => {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const emailParam = searchParams.get("email") || "";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: emailParam,
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMsg("");
    try {
      await resetPassword(data.email, data.code, data.newPassword);
      navigate("/login");
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || "Failed to reset password. Check the code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-1.5 text-center sm:text-left">
        <h2 className="text-2xl font-bold tracking-tight text-neutral-primary">Reset password</h2>
        <p className="text-sm text-neutral-secondary">
          Enter the verification code and set your new account password.
        </p>
      </div>

      {errorMsg && (
        <div className="p-3.5 bg-danger-lightest border border-danger-light rounded-lg text-xs font-semibold text-danger">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {!emailParam && (
          <Input
            label="Email Address"
            type="email"
            placeholder="name@example.com"
            error={errors.email?.message}
            {...register("email")}
          />
        )}

        <Input
          label="Verification Code"
          type="text"
          placeholder="123456"
          error={errors.code?.message}
          {...register("code")}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="New Password"
            type="password"
            placeholder="••••••••"
            error={errors.newPassword?.message}
            {...register("newPassword")}
          />
          <Input
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />
        </div>

        <Button type="submit" variant="primary" className="w-full py-2.5" isLoading={loading}>
          Reset Password
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

export default ResetPassword;
