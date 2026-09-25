import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Συμπληρώστε το ονοματεπώνυμό σας.").max(80, "Χρησιμοποιήστε έως 80 χαρακτήρες."),
  email: z.email("Συμπληρώστε μια έγκυρη διεύθυνση email.").max(254),
  phone: z.string().trim().max(30, "Χρησιμοποιήστε έως 30 χαρακτήρες."),
  message: z.string().trim().min(20, "Περιγράψτε συνοπτικά το αίτημά σας.").max(1200, "Χρησιμοποιήστε έως 1.200 χαρακτήρες."),
  consent: z.boolean().refine(Boolean, { message: "Απαιτείται αποδοχή για την αποστολή του μηνύματος." }),
  website: z.string().max(0),
});

export type ContactFields = z.infer<typeof contactSchema>;
