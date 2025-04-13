import { api } from '@/lib/api/api';
import { handleServiceError } from '@/lib/api/error-handler';
import { toast } from 'sonner';
import { RegisterFormValues } from '@/schemas/auth.schema';
import { LoginFormValues } from '@/schemas/auth.schema';

export const AuthService = {
  async login(values: LoginFormValues) {
    try {
      const { data } = await api.post<{ accessToken: string }>('/vacation-service/auth/login', values);
      localStorage.setItem('accessToken', data.accessToken);
      return { success: true, data };
    } catch (error: any) {
      console.error('Ошибка при входе:', error);
      return handleServiceError(error);
      // return this.handleError(error);
    }
  },

  async register(values: RegisterFormValues) {
    try {
      const payload = {
        name: values.name,
        surname: values.surname,
        patronymic: values.patronymic || null,
        email: values.email,
        password: values.password,
      };

      const { data } = await api.post<{ accessToken: string }>(
        '/vacation-service/auth/register',
        payload
      );

      localStorage.setItem('accessToken', data.accessToken);
      return { success: true, data };
    } catch (error: any) {
      console.error('Ошибка регистрации:', error);
      return handleServiceError(error);
      // return this.handleError(error);
    }
  },

  checkAuth(): boolean {
    return !!localStorage.getItem('accessToken');
  },

  // Встроенный метод вывода ошибок (не используется)
  handleError(error: any) {
    const message = error.response?.data?.message ||
      error.message ||
      'An error occurred';
    toast.error(message);
    return { success: false, error };
  },

  logout() {
    try {
      localStorage.removeItem('accessToken');
      toast.success('You have been successfully logged out');
      window.location.href = '/login';
    } catch (error) {
      toast.error('Failed to logout properly');
      window.location.href = '/login';
    }
  },
};