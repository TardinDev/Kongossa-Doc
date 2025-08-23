import { z } from 'zod'

export const uploadSchema = z.object({
  title: z.string().min(2, 'Le titre est trop court').max(120, 'Le titre est trop long'),
  file: z
    .any()
    .refine((f) => f instanceof File, 'Fichier requis')
    .refine((f: File) => f.size <= 50 * 1024 * 1024, 'Fichier trop volumineux (50 Mo max)'),
})

export type UploadFormValues = z.infer<typeof uploadSchema>

