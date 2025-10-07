"use client";

import UploadImage from "@/components/UploadImage";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type NutritionistProfile = {
  name: string;
  specialization: string;
  experienceYears: number;
  license?: string;
  bio: string;
  contact?: string;
  location?: string;
  pricePerSession: number;
  availableDays: string[];
  availableHours: {
    start: string;
    end: string;
  };
  photo?: string;
};

const NutritionistProfilePage = () => {
  const router = useRouter();

  const { register, handleSubmit, reset, control } = useForm<NutritionistProfile>();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<NutritionistProfile | null>(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await fetch("/api/nutritionist/me");
      if (res.ok) {
        const data = await res.json();
        reset(data);
        setProfile(data);
      }
    };
    fetchProfile();
  }, [reset]);

  const onSubmit = async (data: NutritionistProfile) => {
    setLoading(true);
    const res = await fetch("/api/nutritionist/me", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setLoading(false);

    if (res.ok) {
      toast.success("Profile saved successfully!");
      setEditMode(false);
      const updated = await res.json();
      setProfile(updated);
      // router.push("/dashboard/nutritionist");
    } else {
      toast.error("Failed to save profile.");
    }
  };

  if (!profile) return <p className="text-center mt-10">Loading...</p>;
  return (
    <div className="w-full p-6 bg-gradient-to-b from-gray-900 via-emerald-900/10 to-gray-900 shadow-lg rounded">
      {!editMode ? (
        // VIEW MODE
        <Card className="shadow-md bg-emerald-500/20 border-none">
          <CardHeader className="flex flex-row justify-between items-center">
            <div>
              <CardTitle className="text-xl text-gray-100">Personal Info</CardTitle>
              <CardDescription className="text-gray-300">
                View and update your account’s personal information
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
                <h4 className="font-semibold">Specialization</h4>
                <p className="bg-emerald-300/20 px-3 py-2 rounded">{profile.specialization}</p>
              </div>
              <div>
                <h4 className="font-semibold">Experience</h4>
                <p className="bg-emerald-300/20 px-3 py-2 rounded">{profile.experienceYears} years</p>
              </div>
              <div>
                <h4 className="font-semibold">Price</h4>
                <p className="bg-emerald-300/20 px-3 py-2 rounded">Rp {profile.pricePerSession} / session</p>
              </div>
              <div>
                <h4 className="font-semibold">Contact</h4>
                <p className="bg-emerald-300/20 px-3 py-2 rounded">{profile.contact || "-"}</p>
              </div>
              <div>
                <h4 className="font-semibold">Location</h4>
                <p className="bg-emerald-300/20 px-3 py-2 rounded">{profile.location || "-"}</p>
              </div>
              <div className="md:col-span-2">
                <h4 className="font-semibold">Bio</h4>
                <p className="bg-emerald-300/20 px-3 py-2 rounded">{profile.bio}</p>
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
              <p className="text-sm text-gray-300">Update your profile information below</p>
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
                {...register("specialization")}
                placeholder="Specialization"
                className="w-full bg-emerald-500/10 border border-emerald-400/30 text-gray-100 p-2 rounded focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
              <input
                {...register("experienceYears", { valueAsNumber: true })}
                type="number"
                placeholder="Years of experience"
                className="w-full bg-emerald-500/10 border border-emerald-400/30 text-gray-100 p-2 rounded focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
              <input
                {...register("license")}
                placeholder="License / STR Number"
                className="w-full bg-emerald-500/10 border border-emerald-400/30 text-gray-100 p-2 rounded focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
              <textarea
                {...register("bio")}
                placeholder="Short bio"
                className="w-full bg-emerald-500/10 border border-emerald-400/30 text-gray-100 p-2 rounded focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
              <input
                {...register("contact")}
                placeholder="Contact (email/phone)"
                className="w-full bg-emerald-500/10 border border-emerald-400/30 text-gray-100 p-2 rounded focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
              <input
                {...register("location")}
                placeholder="Location / Clinic"
                className="w-full bg-emerald-500/10 border border-emerald-400/30 text-gray-100 p-2 rounded focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
              <input
                {...register("pricePerSession", { valueAsNumber: true })}
                type="number"
                placeholder="Price per session"
                className="w-full bg-emerald-500/10 border border-emerald-400/30 text-gray-100 p-2 rounded focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />

              <fieldset className="border border-emerald-400/30 p-3 rounded">
                <legend className="text-sm font-semibold text-gray-100">Available Days</legend>
                {[
                  "monday",
                  "tuesday",
                  "wednesday",
                  "thursday",
                  "friday",
                  "saturday",
                  "sunday",
                ].map((day) => (
                  <label key={day} className="block text-gray-300">
                    <input type="checkbox" value={day} {...register("availableDays")} />{" "}
                    {day}
                  </label>
                ))}
              </fieldset>

              <div className="flex gap-2">
                <input
                  {...register("availableHours.start")}
                  type="time"
                  className="w-full bg-emerald-500/10 border border-emerald-400/30 text-gray-100 p-2 rounded focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
                <input
                  {...register("availableHours.end")}
                  type="time"
                  className="w-full bg-emerald-500/10 border border-emerald-400/30 text-gray-100 p-2 rounded focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>
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

export default NutritionistProfilePage