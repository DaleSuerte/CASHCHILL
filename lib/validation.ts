import { z } from "zod";

export const waitlistSchema = z.object({
  name: z.string().min(2, "Cuéntanos tu nombre (mínimo 2 letras)."),
  email: z.string().email("Escribe un correo válido, porfa."),
  stage: z.enum(["uni", "trabajo"]),
  frequency: z.enum(["casi-nunca", "semanal", "varias-veces"]),
  whatsapp: z
    .string()
    .trim()
    .max(25, "Tu WhatsApp no debe superar 25 caracteres.")
    .optional()
    .or(z.literal("")),
  source: z.string().default("landing")
});

export type WaitlistInput = z.infer<typeof waitlistSchema>;
