"use client"

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Ban, Loader2, Search, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

interface User {
  _id: string;
  name: string;
  email: string;
  role: "customer" | "nutritionist" | "admin";
  isBlocked?: boolean;
  createdAt: string;
}

const AdminUsersPage = () => {

  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const rest = await fetch("/api/admin/users");
        const data: User[] = await rest.json();
        setUsers(data);
        setFilteredUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [])

  useEffect(() => {
    let result = users;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(query) ||
          u.email.toLowerCase().includes(query)
      );
    }
    if (roleFilter !== "all") {
      result = result.filter((u) => u.role === roleFilter);
    }
    setFilteredUsers(result);
  }, [searchQuery, roleFilter, users])

  const handleChangeRole = async (userId: string, newRole: string) => {
    setUpdating(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) throw new Error("Failed to update role");
      // setUsers((prev) =>
      //   prev.map((u) => (u._id === userId ? { ...u, role: newRole as any } : u))
      // );
      setUsers((prev) =>
      prev.map((u) =>
        u._id === userId
          ? {
              ...u,
              role: newRole as "customer" | "nutritionist" | "admin",
            }
          : u
      )
    );
      toast.success("User role updated successfully");
    } catch (error) {
      console.error("Error updating user role:", error);
      toast.error("Error updating user role");
    } finally {
      setUpdating(null);
    }
  };

  const handleToggleBlock = async (userId: string, block: boolean) => {
    setUpdating(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}/block`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isBlocked: block }),
      });
      if (!res.ok) throw new Error("Failed to toggle block");
      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, isBlocked: block } : u
        )
      );
      toast.success(block ? "User blocked" : "User unblocked");
    } catch (error) {
      console.error("Error updating user status:", error);
      toast.error("Error updating user status");
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-gray-200">
        <Loader2 className="animate-spin mr-2" /> Loading users...
      </div>
    );
  }
  

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-100">Manage Users</h1>

      {/* Filter */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-2 w-full sm:w-1/2">
          <Search className="text-emerald-400 w-5 h-5" />
          <Input
            placeholder="Search by name or email"
            className="bg-gray-800/50 border-gray-700 text-gray-100"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[180px] bg-gray-800/50 border-gray-700 text-gray-100">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700 text-gray-100">
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="customer">Customer</SelectItem>
            <SelectItem value="nutritionist">Nutritionist</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card className="bg-gray-800/40 border border-emerald-800/30 text-gray-100 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-emerald-900/30 text-emerald-300 text-left">
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3 text-center">Blocked</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id} className="border-b border-gray-700/50">
                <td className="p-3">{user.name}</td>
                <td className="p-3 text-gray-400">{user.email}</td>
                <td className="p-3 capitalize">{user.role}</td>
                <td className="p-3 text-center">
                  {user.isBlocked ? (
                    <span className="text-red-400 font-semibold">Yes</span>
                  ) : (
                    <span className="text-emerald-400 font-semibold">No</span>
                  )}
                </td>
                <td className="p-3 text-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={updating === user._id}
                    className="bg-emerald-600/30 hover:bg-emerald-600/40 border-none"
                    onClick={() =>
                      handleChangeRole(
                        user._id,
                        user.role === "customer" ? "nutritionist" : "customer"
                      )
                    }
                  >
                    <ShieldCheck className="w-4 h-4 mr-1" />
                    {user.role === "customer" ? "Make Nutritionist" : "Make Customer"}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={updating === user._id}
                    className="bg-red-600/30 hover:bg-red-600/50 border-none"
                    onClick={() => handleToggleBlock(user._id, !user.isBlocked)}
                  >
                    <Ban className="w-4 h-4 mr-1" />
                    {user.isBlocked ? "Unblock" : "Block"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}

export default AdminUsersPage