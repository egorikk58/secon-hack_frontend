import { api } from '@/lib/api/api';
import { handleServiceError } from '@/lib/api/error-handler';
import {
  UserProfile,
  UserProfileResponse,
  UserRole,
  CreateUserRequestDtoZod,
  UpdateUserRequestDtoZod,
  UserRoleEnum,
  UpdateUserRequestSchema,
  CreateUserRequestSchema,
  CreateUserRequestDto,
  CreateUserRequestDtoResponse
} from '@/schemas';
const ROLE_DISPLAY_NAMES: Record<UserRole, string> = {
  Director: 'Директор',
  Hr: 'HR-менеджер',
  Worker: 'Сотрудник'
};

const API_ENDPOINTS = {
  GET_PROFILE: '/vacation-service/users/me',
  CREATE_USER: '/vacation-service/users',
  UPDATE_USER: '/vacation-service/users',
  DELETE_USER: '/vacation-service/users'
} as const;

export const UserService = {
  async getProfile(): Promise<UserProfileResponse> {
    try {
      const { data } = await api.get<UserProfile>(API_ENDPOINTS.GET_PROFILE);
      console.debug('User profile fetched:', data);
      return { success: true, data: data };
    } catch (error) {
      console.error('Profile fetch failed:', error);
      return handleServiceError(error);
    }
  },

  // async createUser(payload: CreateUserRequestDtoZod): Promise<UserProfileResponse> {
  //   try {
  //     const validatedData = CreateUserRequestSchema.parse(payload);
  //     const { data } = await api.post<UserProfile>(API_ENDPOINTS.CREATE_USER, validatedData);
  //     console.debug('User created successfully:', data);
  //     return { success: true, data: data };
  //   } catch (error) {
  //     console.error('User creation failed:', error);
  //     return handleServiceError(error);
  //   }
  // },

  async createUser(payload: CreateUserRequestDtoZod): Promise<CreateUserRequestDtoResponse> {
    try {
      const validatedData = CreateUserRequestSchema.parse(payload);
      const { data } = await api.post<CreateUserRequestDto>(API_ENDPOINTS.CREATE_USER, validatedData);
      console.debug('User created successfully:', data);
      return { success: true, data: data };
    } catch (error) {
      console.error('User creation failed:', error);
      return handleServiceError(error);
    }
  },

  async updateUser(payload: UpdateUserRequestDtoZod): Promise<UserProfileResponse> {
    try {
      const validatedData = UpdateUserRequestSchema.parse(payload);
      const { data } = await api.patch<UserProfile>(validatedData.userId);
      console.debug('User updated successfully:', data);
      return { success: true, data: data };
    } catch (error) {
      console.error('User update failed:', error);
      return handleServiceError(error);
    }
  },

  async deleteUser(employeeId: string): Promise<{ success: boolean; message?: string }> {
    try {
      await api.delete(API_ENDPOINTS.DELETE_USER, {
        params: { employeeId }
      });
      console.debug(`User with ID ${employeeId} deleted successfully`);
      return { success: true, message: 'User deleted successfully' };
    } catch (error) {
      console.error(`User deletion failed for ID ${employeeId}:`, error);
      return handleServiceError(error);
    }
  },

  getRoleDisplayName(role: UserRole): string {
    return ROLE_DISPLAY_NAMES[role];
  },

  getRoles(): UserRole[] {
    return Object.values(UserRoleEnum);
  }
}