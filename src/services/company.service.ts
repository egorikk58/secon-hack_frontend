import { api } from '@/lib/api/api';
import { handleServiceError } from '@/lib/api/error-handler';
import { Company, CompanyFormValues, CreateCompanyResponse } from '@/schemas';

export const CompanyService = {
  async createCompany(values: CompanyFormValues): Promise<CreateCompanyResponse> {
    try {
      const { data } = await api.post<Company>('/vacation-service/companies', values);
      console.log('Компания успешно создана:', data);
      return { success: true, company: data };
    } catch (error: any) {
      console.error('Ошибка при создании компании:', error);
      return handleServiceError(error);
    }
  }
};