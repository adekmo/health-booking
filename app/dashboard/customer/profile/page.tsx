"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import UploadImage from "@/components/UploadImage";

type CustomerProfile = {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  photo?: string;
};

const CustomerProfilePage = () => {
    const { register, handleSubmit, reset, control } = useForm<CustomerProfile>();
    const [profile, setProfile] = useState<CustomerProfile | null>(null);
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
        try {
            const res = await fetch("/api/customer/me");
            if (res.ok) {
            const data = await res.json();
            setProfile(data);
            reset(data);
            }
        } catch (err) {
            console.error(err);
        }
        };
        fetchProfile();
    }, [reset]);

    const onSubmit = async (data: CustomerProfile) => {
        setLoading(true);
        try {
        const res = await fetch("/api/customer/me", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        setLoading(false);

        if (res.ok) {
            const updated = await res.json();
            setProfile(updated);
            setEditMode(false);
            toast.success("Profile updated successfully!");
        } else {
            toast.error("Failed to update profile.");
        }
        } catch (err) {
        console.error(err);
        toast.error("An error occurred.");
        setLoading(false);
        }
    };

    if (!profile)
        return <p className="text-center text-gray-400 mt-10">Loading profile...</p>;
  return (
    <div className="w-full p-6 bg-gradient-to-b from-gray-900 via-emerald-900/10 to-gray-900">
      {!editMode ? (
        // VIEW MODE
        <Card className="shadow-md bg-emerald-500/20 border-none">
          <CardHeader className="flex flex-row justify-between items-center">
            <div>
              <CardTitle className="text-xl text-gray-100">My Profile</CardTitle>
              <CardDescription className="text-gray-300">
                View and update your personal information
              </CardDescription>
            </div>
            <Button
              onClick={() => setEditMode(true)}
              className="bg-emerald-500/40 hover:bg-emerald-500/30 text-white"
            >
              Edit Profile
            </Button>
          </CardHeader>

          <CardContent className="space-y-6 text-gray-100">
            <div className="flex flex-col items-center">
              <Image
                src={profile.photo || "/default-avatar.png"}
                alt={profile.name}
                width={100}
                height={100}
                className="w-24 h-24 rounded-full object-cover border border-emerald-400"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold">Name</h4>
                <p className="bg-emerald-300/20 px-3 py-2 rounded">{profile.name}</p>
              </div>
              <div>
                <h4 className="font-semibold">Email</h4>
                <p className="bg-emerald-300/20 px-3 py-2 rounded">{profile.email}</p>
              </div>
              <div>
                <h4 className="font-semibold">Phone</h4>
                <p className="bg-emerald-300/20 px-3 py-2 rounded">{profile.phone || "-"}</p>
              </div>
              <div>
                <h4 className="font-semibold">Address</h4>
                <p className="bg-emerald-300/20 px-3 py-2 rounded">{profile.address || "-"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        // EDIT MODE
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card className="shadow-md bg-emerald-500/20 border-none">
            <CardHeader>
              <h3 className="text-xl font-semibold text-gray-100">Edit Profile</h3>
              <p className="text-sm text-gray-300">Update your personal details</p>
            </CardHeader>

            <CardContent className="space-y-4">
              <Controller
                control={control}
                name="photo"
                render={({ field }) => (
                  <UploadImage value={field.value} onChange={field.onChange} />
                )}
              />

              <input
                {...register("name")}
                placeholder="Full Name"
                className="w-full bg-emerald-500/10 border border-emerald-400/30 text-gray-100 p-2 rounded focus:outline-none focus:ring-2 focus:ring-emerald-400"
                required
              />
              <input
                {...register("phone")}
                placeholder="Phone Number"
                className="w-full bg-emerald-500/10 border border-emerald-400/30 text-gray-100 p-2 rounded focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
              <input
                {...register("address")}
                placeholder="Address"
                className="w-full bg-emerald-500/10 border border-emerald-400/30 text-gray-100 p-2 rounded focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </CardContent>

            <CardFooter className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-500/30 text-gray-100 py-2 rounded hover:bg-emerald-500/40 transition"
              >
                {loading ? "Saving..." : "Save Profile"}
              </button>
              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="w-full bg-gray-500/30 text-gray-100 py-2 rounded hover:bg-gray-500/40 transition"
              >
                Cancel
              </button>
            </CardFooter>
          </Card>
        </form>
      )}
    </div>
  )
}

export default CustomerProfilePage