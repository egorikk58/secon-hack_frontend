import { Skeleton } from "@/components/ui/skeleton";
import { EmployeeTable } from "@/components/home/format/employee-table";
import { DepartmentEmployee, UserProfile } from "@/schemas";

interface EmployeesSectionProps {
  loading: boolean;
  employees?: DepartmentEmployee[];
  userProfile: UserProfile;
}

export function EmployeesSection({ loading, employees, userProfile }: EmployeesSectionProps) {
  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-4">Сотрудники</h2>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={`employee-skeleton-${i}`} className="h-40 rounded-lg" />
          ))}
        </div>
      ) : !employees?.length ? (
        <p className="text-center text-gray-500 py-8">Нет сотрудников в отделе</p>
      ) : (
        <EmployeeTable
          data={employees}
          userProfile={userProfile}
        />
      )}
    </div>
  );
}