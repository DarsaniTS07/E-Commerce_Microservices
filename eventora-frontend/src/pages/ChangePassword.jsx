import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import useAuth from "../hooks/useAuth";
import Input from "../components/Input";
import Button from "../components/Button";

const changePasswordSchema = zod.object({
  oldPassword: zod.string().min(1, "Current password is required"),
  newPassword: zod.string().min(6, "New password must be at least 6 characters"),
  confirmPassword: zod.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords must match",
  path: ["confirmPassword"],
});

export const ChangePassword = () => {
  const { changePassword } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMsg("");
    try {
      await changePassword(data.oldPassword, data.newPassword);
      reset();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || "Failed to change password. Please check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-bold text-neutral-primary">Change Password</h3>
        <p className="text-xs text-neutral-secondary">Ensure your account is using a long, random password to stay secure.</p>
      </div>

      {errorMsg && (
        <div className="p-3.5 bg-danger-lightest border border-danger-light rounded-lg text-xs font-semibold text-danger">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Current Password"
          type="password"
          placeholder="••••••••"
          error={errors.oldPassword?.message}
          {...register("oldPassword")}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="New Password"
            type="password"
            placeholder="••••••••"
            error={errors.newPassword?.message}
            {...register("newPassword")}
          />
          <Input
            label="Confirm New Password"
            type="password"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" variant="primary" isLoading={loading}>
            Update Password
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
