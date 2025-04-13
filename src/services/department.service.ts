import { api, ApiResponse } from '@/lib/api/api';
import { handleServiceError } from '@/lib/api/error-handler';
import { BaseDepartment, DepartmentApiResponse, DepartmentListResponse, DepartmentResponse, DepartmentWithEmployees, DepartmentEmployeeSchema, DepartmentEmployee, DepartmentEmployeeResponse, CreateDepartmentRequestDto } from '@/schemas';

const API_ENDPOINTS = {
  GET_DEPARTMENTS: '/vacation-service/departments',
  GET_DEPARTMENT_WITH_EMPLOYEES: (id: string) => `/vacation-service/departments/${id}`,
  GET_DEPARTMENT_USERS: (id: string) => `/vacation-service/departments/${id}/users`,
  GET_DEPARTMENT_CHILDREN: (id: string) => `/vacation-service/departments/${id}/children`,
  CREATE_DEPARTMENT: '/vacation-service/departments',
} as const;

export const DepartmentService = {
  async getDepartmentWithEmployees(id: string): Promise<ApiResponse<DepartmentWithEmployees>> {
    try {
      const { data } = await api.get<DepartmentWithEmployees>(
        API_ENDPOINTS.GET_DEPARTMENT_WITH_EMPLOYEES(id)
      );

      data.employees.forEach(employee => {
        DepartmentEmployeeSchema.parse(employee);
      });

      return { success: true, data };
    } catch (error) {
      return handleServiceError(error);
    }
  },

  async getDepartmentChildren(id: string): Promise<DepartmentListResponse> {
    try {
      const { data } = await api.get<BaseDepartment[]>(API_ENDPOINTS.GET_DEPARTMENT_CHILDREN(id));
      return { success: true, data };
    } catch (error) {
      console.error(`Ошибка при получении дочерних отделов для ${id}:`, error);
      return handleServiceError(error);
    }
  },

  async getDepartmentEmployees(departmentId: string): Promise<DepartmentEmployeeResponse> {
    try {
      const { data } = await api.get<DepartmentEmployee[]>(
        API_ENDPOINTS.GET_DEPARTMENT_USERS(departmentId)
      );

      data.forEach(user => {
        DepartmentEmployeeSchema.parse(user);
      });
      return {
        success: true,
        data: data,
        count: data.length
      };
    } catch (error) {
      console.error(`Ошибка при получении сотрудников отдела ${departmentId}:`, error);
      return handleServiceError(error);
    }
  },

  async getDepartments(): Promise<DepartmentListResponse> {
    try {
      const { data } = await api.get<BaseDepartment[]>(API_ENDPOINTS.GET_DEPARTMENTS);
      return { success: true, data };
    } catch (error) {
      console.error('Ошибка при получении списка отделов:', error);
      return handleServiceError(error);
    }
  },

  async createDepartment(payload: CreateDepartmentRequestDto): Promise<DepartmentApiResponse> {
    try {
      const validatedPayload = CreateDepartmentRequestDto.parse(payload);

      const { data } = await api.post<DepartmentResponse>(
        API_ENDPOINTS.CREATE_DEPARTMENT,
        validatedPayload
      );

      return { success: true, data };
    } catch (error) {
      return handleServiceError(error);
    }
  },
};