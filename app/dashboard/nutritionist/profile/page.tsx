"use client";

import UploadImage from "@/components/UploadImage";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-hot-toast";

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
    <div className="w-full p-6 bg-white shadow-lg rounded">
      {!editMode ? (
        // VIEW MODE
        <div className="flex flex-col gap-5">
          <div className="grid md:grid-cols-2 gap-2 items-center">
            <div>
              <h3 className="font-bold">Personal Info</h3>
              <p className="text-sm text-slate-500">View and update your accounts personal information</p>
            </div>
            <div className="flex justify-center">
              <button
                onClick={() => setEditMode(true)}
                className="mt-4 px-4 py-2 bg-emerald-400 text-white rounded hover:bg-emerald-300 cursor-pointer"
              >
                Edit Profile
              </button>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-2 items-center">
            <div>
              <h4 className="font-bold">Profile Photo</h4>
              <p className="text-sm text-slate-500">Upload your profile image to personalize your account</p>
            </div>
            <div className="flex justify-center">
              <Image
                src={profile.photo || "/default-avatar.png"}
                alt={profile.name}
                width={100}
                height={100}
                className="w-20 h-20 rounded-full object-cover border border-emerald-400"
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-2 items-center">
            <h4>Name</h4>
            <p className="bg-emerald-300/20 px-3 py-2 rounded shadow">{profile.name}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-2 items-center">
            <h4>Specialization</h4>
            <p className="bg-emerald-300/20 px-3 py-2 rounded shadow">{profile.specialization}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-2 items-center">
            <h4>Years experience</h4>
            <p className="bg-emerald-300/20 px-3 py-2 rounded shadow">{profile.experienceYears}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-2 items-center">
            <h4>Bio</h4>
            <p className="bg-emerald-300/20 px-3 py-2 rounded shadow">{profile.bio}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-2 items-center">
            <h4>Price</h4>
            <p className="bg-emerald-300/20 px-3 py-2 rounded shadow">Rp {profile.pricePerSession} / session</p>
          </div>
          <div className="grid md:grid-cols-2 gap-2 items-center">
            <h4>Contact</h4>
            {profile.contact && (
              <p className="bg-emerald-300/20 px-3 py-2 rounded shadow">
                {profile.contact}
              </p>
            )}
          </div>
          <div className="grid md:grid-cols-2 gap-2 items-center">
            <h4>Location</h4>
            {profile.location && (
              <p className="bg-emerald-300/20 px-3 py-2 rounded shadow">
                {profile.location}
              </p>
            )}
          </div>
        </div>
      ) : (
        // EDIT MODE
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            className="w-full border p-2 rounded"
            required
          />
          <input
            {...register("specialization")}
            placeholder="Specialization"
            className="w-full border p-2 rounded"
          />
          <input
            {...register("experienceYears", { valueAsNumber: true })}
            type="number"
            placeholder="Years of experience"
            className="w-full border p-2 rounded"
          />
          <input
            {...register("license")}
            placeholder="License / STR Number"
            className="w-full border p-2 rounded"
          />
          <textarea
            {...register("bio")}
            placeholder="Short bio"
            className="w-full border p-2 rounded"
          />
          <input
            {...register("contact")}
            placeholder="Contact (email/phone)"
            className="w-full border p-2 rounded"
          />
          <input
            {...register("location")}
            placeholder="Location / Clinic"
            className="w-full border p-2 rounded"
          />
          <input
            {...register("pricePerSession", { valueAsNumber: true })}
            type="number"
            placeholder="Price per session"
            className="w-full border p-2 rounded"
          />

          <fieldset className="border p-2 rounded">
            <legend className="text-sm font-semibold">Available Days</legend>
            {[
              "monday",
              "tuesday",
              "wednesday",
              "thursday",
              "friday",
              "saturday",
              "sunday",
            ].map((day) => (
              <label key={day} className="block">
                <input type="checkbox" value={day} {...register("availableDays")} />{" "}
                {day}
              </label>
            ))}
          </fieldset>

          <div className="flex gap-2">
            <input
              {...register("availableHours.start")}
              type="time"
              className="border p-2 rounded w-full"
            />
            <input
              {...register("availableHours.end")}
              type="time"
              className="border p-2 rounded w-full"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 rounded"
            >
              {loading ? "Saving..." : "Save Profile"}
            </button>
            <button
              type="button"
              onClick={() => setEditMode(false)}
              className="w-full bg-gray-400 text-white py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default NutritionistProfilePage