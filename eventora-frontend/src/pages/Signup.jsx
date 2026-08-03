import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Input from "../components/Input";
import Button from "../components/Button";

const signupSchema = zod.object({
  name: zod.string().min(2, "Name must be at least 2 characters"),
  email: zod.string().email("Please enter a valid email address"),
  password: zod.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: zod.string().min(6, "Password must be at least 6 characters"),
  role: zod.enum(["User", "Admin"]),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords must match",
  path: ["confirmPassword"],
});

const verifySchema = zod.object({
  code: zod.string().min(4, "Verification code must be at least 4 digits"),
});

export const Signup = () => {
  const { signup, confirmSignup } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showVerify, setShowVerify] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const {
    register: registerSignup,
    handleSubmit: handleSubmitSignup,
    formState: { errors: signupErrors },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: { role: "User" }
  });

  const {
    register: registerVerify,
    handleSubmit: handleSubmitVerify,
    formState: { errors: verifyErrors },
  } = useForm({
    resolver: zodResolver(verifySchema),
  });

  const onSignupSubmit = async (data) => {
    setLoading(true);
    setErrorMsg("");
    try {
      await signup(data.email, data.password, data.name, data.role);
      setRegisteredEmail(data.email);
      setShowVerify(true);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || "Sign up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onVerifySubmit = async (data) => {
    setLoading(true);
    setErrorMsg("");
    try {
      await confirmSignup(registeredEmail, data.code);
      navigate("/login");
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || "Invalid OTP code. Please check.");
    } finally {
      setLoading(false);
    }
  };

  if (showVerify) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col space-y-1.5 text-center sm:text-left">
          <h2 className="text-2xl font-bold tracking-tight text-neutral-primary">Verify your email</h2>
          <p className="text-sm text-neutral-secondary">
            We sent a verification code to <span className="font-semibold text-neutral-primary">{registeredEmail}</span>. Enter it below to activate your account.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 bg-danger-lightest border border-danger-light rounded-lg text-xs font-semibold text-danger">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmitVerify(onVerifySubmit)} className="space-y-4">
          <Input
            label="Verification Code (OTP)"
            type="text"
            placeholder="123456"
            error={verifyErrors.code?.message}
            {...registerVerify("code")}
          />

          <Button type="submit" variant="primary" className="w-full py-2.5" isLoading={loading}>
            Confirm Account
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-1.5 text-center sm:text-left">
        <h2 className="text-2xl font-bold tracking-tight text-neutral-primary">Create an account</h2>
        <p className="text-sm text-neutral-secondary">
          Enter your details below to create your Eventora account.
        </p>
      </div>

      {errorMsg && (
        <div className="p-3.5 bg-danger-lightest border border-danger-light rounded-lg text-xs font-semibold text-danger">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmitSignup(onSignupSubmit)} className="space-y-4">
        <Input
          label="Full Name"
          type="text"
          placeholder="John Doe"
          error={signupErrors.name?.message}
          {...registerSignup("name")}
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="name@example.com"
          error={signupErrors.email?.message}
          {...registerSignup("email")}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            error={signupErrors.password?.message}
            {...registerSignup("password")}
          />
          <Input
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            error={signupErrors.confirmPassword?.message}
            {...registerSignup("confirmPassword")}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-neutral-secondary uppercase tracking-wider">Account Role</label>
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center gap-2 px-3.5 py-2.5 bg-neutral-white border border-neutral-border rounded-lg text-sm cursor-pointer select-none">
              <input type="radio" value="User" {...registerSignup("role")} className="text-primary focus:ring-primary" />
              <span>User</span>
            </label>
            <label className="flex items-center gap-2 px-3.5 py-2.5 bg-neutral-white border border-neutral-border rounded-lg text-sm cursor-pointer select-none">
              <input type="radio" value="Admin" {...registerSignup("role")} className="text-primary focus:ring-primary" />
              <span>Admin</span>
            </label>
          </div>
        </div>

        <Button type="submit" variant="primary" className="w-full py-2.5" isLoading={loading}>
          Sign Up
        </Button>
      </form>

      <div className="text-center text-xs text-neutral-secondary border-t border-neutral-muted pt-4 mt-6">
        Already have an account?{" "}
        <Link to="/login" className="font-bold text-primary hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default Signup;
