import { useEffect, useState } from "react";
import HeaderSection from "@/components/home/sections/SectionHeader";
import { CreateDepartmentModal } from "@/components/home/modals/CreateDepartmentModal";
import { CreateEmployeeModal } from "@/components/home/modals/CreateEmployeeModal";
import {
  BaseDepartment,
  DepartmentWithEmployees,
  UserProfile,
  DepartmentApiResponse,
  CreateUserRequestDtoResponse,
  CreateUserRequestDtoZod,
  CreateDepartmentRequestDto
} from "@/schemas";
import { DepartmentService, UserService } from "@/services";
import { toast } from "sonner";
import { EmployeesSection } from "@/components/home/sections/EmployeesSection";
import { DepartmentsSection } from "@/components/home/sections/DepartmentsSection";

interface DirectorDashboardProps {
  userProfile: UserProfile;
}

export default function DirectorDashboard({ userProfile }: DirectorDashboardProps) {
  const [currentDepartment, setCurrentDepartment] = useState(userProfile.departmentId);
  const [showCreateDepartment, setShowCreateDepartment] = useState(false);
  const [showCreateEmployee, setShowCreateEmployee] = useState(false);
  const [departments, setDepartments] = useState<BaseDepartment[]>([]);
  const [departmentWithEmployees, setDepartmentWithEmployees] = useState<DepartmentWithEmployees>();
  const [loading, setLoading] = useState({
    departments: true,
    employees: true
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (currentDepartment === userProfile.departmentId) {
          const departmentsResponse = await DepartmentService.getDepartments();
          if (departmentsResponse.success) {
            setDepartments(departmentsResponse.data);
          } else {
            toast.error("Ошибка загрузки отделов");
          }
        } else {
          const childrenResponse = await DepartmentService.getDepartmentChildren(currentDepartment);
          if (childrenResponse.success) {
            setDepartments(childrenResponse.data);
          } else {
            toast.error("Ошибка загрузки отделов");
          }
        }

        const employeesResponse = await DepartmentService.getDepartmentWithEmployees(currentDepartment);
        if (employeesResponse.success) {
          setDepartmentWithEmployees(employeesResponse.data);
        } else {
          toast.error("Ошибка загрузки сотрудников");
        }
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
        toast.error("Произошла ошибка при загрузке данных");
      } finally {
        setLoading({ departments: false, employees: false });
      }
    };

    fetchData();
  }, [currentDepartment]);

  // const handleDeleteEmployee = async (id: string) => {
  //   try {
  //     if (id === userProfile.id) {
  //       toast.error('Вы не можете удалить свой собственный аккаунт');
  //       return;
  //     }

  //     await UserService.deleteUser(id);
  //     setDepartmentWithEmployees(prev => {
  //       if (!prev) return prev;
  //       return {
  //         ...prev,
  //         employees: prev.employees.filter(employee => employee.id !== id)
  //       };
  //     });
  //     toast.success('Сотрудник успешно удален');
  //   } catch (error) {
  //     toast.error('Не удалось удалить сотрудника');
  //     console.error('Error deleting employee:', error);
  //     throw error;
  //   }
  // };

  const handleAddDepartment = () => setShowCreateDepartment(true);
  const handleAddEmployee = () => setShowCreateEmployee(true);

  const handleCreateDepartment = async (values: CreateDepartmentRequestDto): Promise<DepartmentApiResponse> => {
    try {
      const result = await DepartmentService.createDepartment(values);
      if (result.success) {
        toast.success(`Отдел "${result.data.name}" успешно создан`);
        setDepartments(prev => [...prev, result.data]);
        setShowCreateDepartment(false);
      }
      return result;
    } catch (error) {
      console.error("Ошибка при создании отдела:", error);
      toast.error("Произошла ошибка при создании отдела");
      return {
        success: false,
        error: {
          message: "Произошла ошибка при создании отдела",
          status: 500
        }
      };
    }
  };

  const handleCreateEmployee = async (values: CreateUserRequestDtoZod): Promise<CreateUserRequestDtoResponse> => {
    try {
      const result = await UserService.createUser(values);
      if (result.success) {
        toast.success(`Сотрудник "${result.data.surname} ${result.data.name}" успешно создан`);
        const employeesResponse = await DepartmentService.getDepartmentWithEmployees(userProfile.departmentId);
        if (employeesResponse.success) {
          setDepartmentWithEmployees(employeesResponse.data);
        }
        setShowCreateEmployee(false);
      }
      return result;
    } catch (error) {
      console.error("Ошибка при создании сотрудника:", error);
      toast.error("Произошла ошибка при создании сотрудника");
      return {
        success: false,
        error: {
          message: "Произошла ошибка при создании сотрудника",
          status: 500
        }
      };
    }
  };

  return (
    <div className="self-start flex-1 flex flex-col items-center gap-6">
      <div className="bg-white w-full rounded-2xl p-4 flex justify-between gap-4">
        <HeaderSection
          title="Управление подразделениями"
          description="Создать новое подразделение"
          onAction={handleAddDepartment}
        />
        <HeaderSection
          title="Управление сотрудниками"
          description="Создать нового сотрудника"
          onAction={handleAddEmployee}
        />
      </div>

      <EmployeesSection
        loading={loading.employees}
        employees={departmentWithEmployees?.employees}
        userProfile={userProfile}
      />

      <DepartmentsSection
        loading={loading.departments}
        departments={departments}
        currentDepartment={currentDepartment}
        onDepartmentSelect={(id) => setCurrentDepartment(id)}
      />

      <CreateDepartmentModal
        isOpen={showCreateDepartment}
        onClose={() => setShowCreateDepartment(false)}
        onCreate={handleCreateDepartment}
        userProfile={userProfile}
      />

      <CreateEmployeeModal
        isOpen={showCreateEmployee}
        onClose={() => setShowCreateEmployee(false)}
        onCreate={handleCreateEmployee}
        departmentId={userProfile.departmentId}
      />
    </div>
  );
}