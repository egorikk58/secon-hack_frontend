import { z } from "zod";

export const companyFormSchema = z.object({
  name: z.string().min(1, "Название обязательно").max(50, "Слишком длинное название"),
  description: z.string().max(200, "Описание слишком длинное").optional(),
});

export type CompanyFormValues = z.infer<typeof companyFormSchema>;

export interface Company {
  id: string;
  name: string;
  description: string;
  directorId: string;
}

export type CreateCompanyResponse =
  | { success: true; company: Company }
  | { success: false; error?: { message: string; status?: number; data?: any } };
