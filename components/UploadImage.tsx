"use client";

import { CldUploadWidget, CloudinaryUploadWidgetResults } from "next-cloudinary";
import Image from "next/image";
import { useState } from "react";

type UploadImageProps = {
  value?: string;
  onChange: (url: string) => void;
};

interface CloudinaryInfoWithSecureUrl {
  secure_url: string;
  format: string;
  bytes: number;
}

function isInfoWithSecureUrl(info: unknown): info is CloudinaryInfoWithSecureUrl {
  return (
    typeof info === "object" &&
    info !== null &&
    "secure_url" in info &&
    "format" in info &&
    "bytes" in info &&
    typeof (info as Record<string, unknown>).secure_url === "string" &&
    typeof (info as Record<string, unknown>).format === "string" &&
    typeof (info as Record<string, unknown>).bytes === "number"
  );
}

const UploadImage = ({ value, onChange }: UploadImageProps) => {
    const [preview, setPreview] = useState<string | undefined>(value);
    const [error, setError] = useState<string | null>(null);
  return (
    <div className="space-y-2 flex gap-5 items-center justify-around">
      {preview && (
        <div className="relative w-32 h-32">
          <Image src={preview} alt="Profile Photo" fill className="object-cover rounded-full" />
        </div>
      )}
      <CldUploadWidget
        uploadPreset="recipe_upload"
        options={{
          sources: ["local", "camera"],
          multiple: false,
          resourceType: "image",
        }}
        // portal={false}
        onSuccess={(result: CloudinaryUploadWidgetResults) => {
          if (result.event === "success" && isInfoWithSecureUrl(result.info)) {
            const { secure_url, format, bytes } = result.info;
            // Validasi format
            const allowedFormats = ["jpg", "jpeg", "png", "webp"];
            if (!allowedFormats.includes(format.toLowerCase())) {
              setError("Format gambar tidak didukung. Gunakan JPG, PNG, atau WEBP.");
              return;
            }

            // Validasi ukuran (2 MB = 2 * 1024 * 1024)
            const maxSize = 2 * 1024 * 1024;
            if (bytes > maxSize) {
              setError("Ukuran gambar maksimal 2 MB.");
              return;
            }

            // Jika lolos validasi
            setError(null);
            setPreview(secure_url);
            onChange(secure_url);
          
          }
        }}
      >

        {({ open }) => (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              open();
            }}
            className="px-4 py-2 bg-emerald-400 cursor-pointer text-white rounded"
          >
            Upload Photo
          </button>
        )}
      </CldUploadWidget>
    </div>
  )
}

export default UploadImage