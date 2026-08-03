import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Search, User, ShieldCheck, Mail, Calendar, ExternalLink, Trash2, AlertTriangle, X } from "lucide-react";
import toast from "react-hot-toast";
import userService from "../../services/userService";
import { cn } from "../../utils/cn";

export const AdminUsersPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchVal, setSearchVal] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [userToDelete, setUserToDelete] = useState(null);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchVal);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchVal]);

  const { data: users = [], isLoading, isError } = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => userService.listUsers(),
  });

  const deleteMutation = useMutation({
    mutationFn: (userId) => userService.deleteUser(userId),
    onSuccess: () => {
      toast.success("User deleted successfully");
      queryClient.invalidateQueries(["admin-users"]);
      setUserToDelete(null);
    },
    onError: (error) => {
      toast.error("Failed to delete user");
      setUserToDelete(null);
    },
  });

  const handleDelete = (e, userId) => {
    e.stopPropagation();
    setUserToDelete(userId);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      deleteMutation.mutate(userToDelete);
    }
  };

  const filteredUsers = users.filter((user) => {
    if (!debouncedSearch) return true;
    const searchLower = debouncedSearch.toLowerCase();
    const nameMatch = user.name && user.name.toLowerCase().includes(searchLower);
    const emailMatch = user.email && user.email.toLowerCase().includes(searchLower);
    return nameMatch || emailMatch;
  });

  return (
    <div className="p-3 md:p-4 lg:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-neutral-primary">Users Management</h1>
          <p className="text-sm text-neutral-secondary mt-1">View and manage all registered users.</p>
        </div>
      </div>

      <div className="bg-neutral-white p-4 rounded-[16px] border border-neutral-muted shadow-sm flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-neutral-400" />
          </div>
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2.5 bg-neutral-lightest border border-neutral-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            placeholder="Search users by name or email..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-neutral-white rounded-[24px] border border-neutral-muted shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-muted bg-neutral-lightest/50">
                <th className="px-6 py-4 text-xs font-bold text-neutral-secondary uppercase tracking-wider">User Details</th>
                <th className="px-6 py-4 text-xs font-bold text-neutral-secondary uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-neutral-secondary uppercase tracking-wider">Joined Date</th>
                <th className="px-6 py-4 text-xs font-bold text-neutral-secondary uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-muted">
              {isLoading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-neutral-secondary text-sm">Loading users...</td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-red-500 font-semibold text-sm">Failed to load users. Is the user-service running?</td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-neutral-secondary text-sm">No users found.</td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.userId} className="hover:bg-neutral-50/50 transition-colors cursor-pointer group" onClick={() => navigate(`/admin/users/${user.userId}`)}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 border border-primary/20">
                          <User size={18} />
                        </div>
                        <div>
                          <div className="font-bold text-neutral-primary">{user.name || "Unknown Name"}</div>
                          <div className="flex items-center gap-1.5 text-xs text-neutral-secondary mt-1">
                            <Mail size={12} /> {user.email || "No email"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border",
                        user.status === 'CONFIRMED' || user.status === 'FORCE_CHANGE_PASSWORD' ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
                        "bg-amber-50 text-amber-600 border-amber-200"
                      )}>
                        {user.status || 'UNCONFIRMED'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-sm font-medium text-neutral-primary">
                        <Calendar size={14} className="text-neutral-secondary" />
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-3">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/admin/users/${user.userId}`);
                          }}
                          className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          title="View Profile"
                        >
                          <ExternalLink size={18} />
                        </button>
                        <button 
                          onClick={(e) => handleDelete(e, user.userId)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete User"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0">
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-neutral-900">Delete User?</h3>
                  <p className="text-sm text-neutral-500 mt-1">This action cannot be undone.</p>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setUserToDelete(null)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 transition-colors"
                  disabled={deleteMutation.isLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors flex items-center gap-2"
                  disabled={deleteMutation.isLoading}
                >
                  {deleteMutation.isLoading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;
