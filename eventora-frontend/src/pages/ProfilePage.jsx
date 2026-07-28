import React, { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { User, ShieldCheck, Mail, Shield, Check, Edit2, X } from "lucide-react";
import { AuthContext } from "../contexts/AuthContext";
import Button from "../components/Button";
import Input from "../components/Input";
import ChangePassword from "./ChangePassword";
import { cn } from "../utils/cn";

const profileSchema = zod.object({
  name: zod.string().min(2, "Name must be at least 2 characters"),
});

export const ProfilePage = () => {
  const { user, updateProfile, isLoading } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
    },
  });

  const onSubmit = async (data) => {
    try {
      await updateProfile(data.name);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile", error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4 p-2 md:p-4">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-neutral-primary">Profile & Security</h1>
        <p className="text-sm text-neutral-secondary mt-1">Manage your personal information and security preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Profile Details Section */}
        <div className="space-y-4 h-full">
          <div className="bg-neutral-white p-4 md:p-6 rounded-[24px] border border-neutral-muted shadow-sm h-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-neutral-primary flex items-center gap-2">
                <User size={20} className="text-primary" /> Personal Details
              </h2>
              {!isEditing ? (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="flex items-center gap-2">
                  <Edit2 size={14} /> Edit Name
                </Button>
              ) : (
                <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)} className="text-neutral-500 hover:text-neutral-700">
                  <X size={16} /> Cancel
                </Button>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 pb-4 border-b border-neutral-muted">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-black border border-primary/20 shrink-0">
                  {user?.name ? user.name.charAt(0).toUpperCase() : <User size={32} />}
                </div>
                <div>
                  <h3 className="text-2xl font-black text-neutral-primary">{user?.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-neutral-secondary mt-1">
                    <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider">
                      {user?.role || "User"}
                    </span>
                  </div>
                </div>
              </div>

              {isEditing ? (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <Input 
                    label="Full Name" 
                    placeholder="Enter your full name" 
                    error={errors.name?.message} 
                    {...register("name")} 
                  />
                  <Input 
                    label="Email Address" 
                    value={user?.email || ""} 
                    disabled={true} 
                    className="opacity-60 bg-neutral-lightest"
                  />
                  <div className="flex justify-end pt-2">
                    <Button type="submit" variant="primary" isLoading={isLoading}>
                      Save Changes
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-4">
                  <div>
                    <p className="text-xs font-bold text-neutral-secondary uppercase tracking-wider mb-1">Full Name</p>
                    <p className="text-base font-semibold text-neutral-primary">{user?.name}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-neutral-secondary uppercase tracking-wider mb-1">Email Address</p>
                    <p className="text-base font-semibold text-neutral-primary flex items-center gap-2">
                      <Mail size={16} className="text-neutral-400" /> {user?.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-neutral-secondary uppercase tracking-wider mb-1">Account Role</p>
                    <p className="text-base font-semibold text-neutral-primary flex items-center gap-2">
                      <ShieldCheck size={16} className={user?.role === "Admin" ? "text-purple-500" : "text-emerald-500"} /> 
                      {user?.role}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="space-y-4 h-full">
          <div className="bg-neutral-white p-4 md:p-6 rounded-[24px] border border-neutral-muted shadow-sm h-full flex flex-col">
             <h2 className="text-lg font-bold text-neutral-primary flex items-center gap-2 mb-4">
                <Shield size={20} className="text-primary" /> Security
              </h2>
            <ChangePassword />
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;
