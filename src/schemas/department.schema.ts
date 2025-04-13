import { z } from 'zod';
import { ApiResponse } from '@/lib/api/api';
import { UserRole } from '@/schemas';

export type DepartmentRole = 'Department' | 'Management' | 'Division' | 'Sector';

export type DepartmentHierarchy = {
  Department: DepartmentRole[];
  Management: DepartmentRole[];
  Division: DepartmentRole[];
  Sector: DepartmentRole[];
};

export const DepartmentRoleEnum = {
  Department: 'Department',
  Management: 'Management',
  Division: 'Division',
  Sector: 'Sector',
} as const;

export type DepartmentRoleKey = keyof typeof DepartmentRoleEnum;

export type DepartmentRoleValue = typeof DepartmentRoleEnum[DepartmentRoleKey];

export interface BaseDepartment {
  id: string;
  name: string;
  description: string;
  supervisorId?: string;
  parentDepartmentId?: string | null;
  imageName?: string | null;
  role: DepartmentRole;
}

export interface DepartmentEmployee {
  id: string;
  name: string;
  surname: string;
  patronymic: string;
  email: string;
  departmentId: string;
  userRole: UserRole;
  phone?: string | null;
  telegramUsername?: string | null;
  imageUrl?: string;
}

export type DepartmentEmployeeResponse = ApiResponse<DepartmentEmployee[]> & {
  count?: number;
};

export const DepartmentEmployeeSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  surname: z.string(),
  patronymic: z.string(),
  email: z.string().email(),
  departmentId: z.string().uuid().nullable().optional(),
  userRole: z.enum(['Director', 'Hr', 'Worker']),
  phone: z.string().nullable().optional(),
  telegramUsername: z.string().nullable().optional(),
  imageUrl: z.string().nullable().optional(),
});

export interface DepartmentWithEmployees extends BaseDepartment {
  employees: DepartmentEmployee[];
}

export interface CreateDepartmentDto {
  name: string;
  description: string;
  supervisorId: string;
  role: DepartmentRole;
}

export interface DepartmentResponse {
  id: string;
  name: string;
  description: string;
  supervisorId?: string;
  parentDepartmentId?: string | null;
  imageName?: string | null;
  role: DepartmentRole;
}

export type DepartmentApiResponse = ApiResponse<DepartmentResponse>;

export type DepartmentListResponse = ApiResponse<BaseDepartment[]>;


export const CreateDepartmentRequestDto = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  supervisorId: z.string().uuid('Supervisor ID must be a valid UUID'),
  role: z.enum(['Department', 'Management', 'Division', 'Sector']),
});
export type CreateDepartmentRequestDto = z.infer<typeof CreateDepartmentRequestDto>;