"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { Label } from "./ui/label";
import UploadImage from "./UploadImage";

interface ConsultationFormProps {
  bookingId: string;
  onSuccess?: () => void;
}

const ConsultationForm = ({ bookingId, onSuccess }: ConsultationFormProps) => {
    const [notes, setNotes] = useState("");
    const [recommendation, setRecommendation] = useState("");
    const [fileUrl, setFileUrl] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const res = await fetch("/api/consultation-note", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                bookingId,
                notes,
                recommendation,
                fileUrl,
                }),
            });

            if (!res.ok) throw new Error("Gagal menyimpan catatan");

            setSuccess(true);
            setNotes("");
            setRecommendation("");
            setFileUrl("");
            onSuccess?.();
            } catch (err: any) {
            setError(err.message);
            } finally {
            setLoading(false);
            }
        };
  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-emerald-500/10 border-emerald-700/30 text-gray-100 hover:bg-emerald-500/20 transition p-5 rounded-xl shadow-sm border">
      <h2 className="text-lg font-semibold">🩺 Consultation Notes</h2>

      <div>
        <Label className="text-sm font-medium">Catatan Hasil Konsultasi</Label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Tulis hasil konsultasi di sini..."
          required
          className="mt-1"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Rekomendasi Nutrisi / Pola Makan</label>
        <Textarea
          value={recommendation}
          onChange={(e) => setRecommendation(e.target.value)}
          placeholder="Tulis rekomendasi untuk pasien..."
          required
          className="mt-1"
        />
      </div>

      <div>
        <Label className="text-sm font-medium">Upload File (Opsional)</Label>
        <UploadImage value={fileUrl} onChange={setFileUrl} />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}
      {success && <p className="text-green-600 text-sm">Catatan berhasil disimpan!</p>}

      <Button type="submit" disabled={loading} className="text-gray-100 border-emerald-700 bg-emerald-500/50 hover:bg-emerald-700/60">
        {loading ? (
          <>
            <Loader2 className="animate-spin mr-2 h-4 w-4" /> Menyimpan...
          </>
        ) : (
          "Simpan Catatan"
        )}
      </Button>
    </form>
  )
}

export default ConsultationForm