import { ApiResponse } from '@/lib/api/api';
import { z } from 'zod';

export type UserRole = 'Director' | 'Hr' | 'Worker';

export const UserRoleEnum = {
  Director: 'Director',
  Hr: 'Hr',
  Worker: 'Worker',
} as const;

export interface UserProfile {
  id: string;
  name: string;
  surname: string;
  patronymic: string;
  email: string;
  departmentId: string;
  userRole: UserRole;
  phone?: string | null;
  telegramUsername?: string | null;
  imageUrl?: string | null;
  hiringDate: string;
  positionId: string;
}

export type UserProfileResponse = ApiResponse<UserProfile>;

export interface CreateUserRequestDto {
  name: string;
  surname: string;
  patronymic?: string | null;
  email: string;
  departmentId: string;
  userRole: UserRole;
  hiringDate: string;
  positionId: string;
};

export type CreateUserRequestDtoResponse = ApiResponse<CreateUserRequestDto>;

export const CreateUserRequestSchema = z.object({
  name: z.string().min(1),
  surname: z.string().min(1),
  patronymic: z.string().min(1).nullable().optional(),
  email: z.string().min(1).email(),
  departmentId: z.string().uuid(),
  userRole: z.enum(['Director', 'Hr', 'Worker']),
  hiringDate: z.string().datetime().nullable().optional(),
  positionName: z.string().min(1),
});

export type CreateUserRequestDtoZod = z.infer<typeof CreateUserRequestSchema>;

export interface UpdateUserRequestDto {
  userId: string;
  name?: string | null;
  surname?: string | null;
  patronymic?: string | null;
  departmentId?: string | null;
  phone?: string | null;
  telegramUsername?: string | null;
  imageId?: string | null;
}

export const UpdateUserRequestSchema = z.object({
  userId: z.string().uuid(),
  name: z.string().nullable().optional(),
  surname: z.string().nullable().optional(),
  patronymic: z.string().nullable().optional(),
  departmentId: z.string().uuid().nullable().optional(),
  phone: z.string().nullable().optional(),
  telegramUsername: z.string().nullable().optional(),
  imageId: z.string().uuid().nullable().optional(),
});

export type UpdateUserRequestDtoZod = z.infer<typeof UpdateUserRequestSchema>;
