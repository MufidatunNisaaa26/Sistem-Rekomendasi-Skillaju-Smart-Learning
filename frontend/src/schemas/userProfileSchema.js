import { z } from "zod";

export const userProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Nama lengkap wajib diisi" })
    .max(50, { message: "Nama lengkap maksimal 50 karakter" }),
  current_level: z.enum(["Beginner", "Intermediate", "Advanced"], {
    errorMap: () => ({ message: "Pilih level kemampuan yang valid" }),
  }),
  preferred_categories: z
    .array(z.string())
    .min(1, { message: "Pilih minimal 1 kategori topik minat" }),
  liked_course_ids: z.array(z.string()).default([]),
});
