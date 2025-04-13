import { Skeleton } from "@/components/ui/skeleton";
import { DepartmentCard } from "@/components/home/format/DepartmentCard";
import { BaseDepartment } from "@/schemas";

interface DepartmentsSectionProps {
  loading: boolean;
  departments: BaseDepartment[];
  currentDepartment?: string | null;
  onDepartmentSelect?: (id: string) => void;
}

export function DepartmentsSection({
  loading,
  departments,
  currentDepartment,
  onDepartmentSelect
}: DepartmentsSectionProps) {
  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-4">Подразделения</h2>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={`department-skeleton-${i}`} className="h-40 rounded-lg" />
          ))}
        </div>
      ) : departments.length === 0 ? (
        <p className="text-center text-gray-500 py-8">Нет созданных отделов</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {departments.map(department => (
            <DepartmentCard
              key={department.id}
              department={department}
              isSelected={currentDepartment === department.id}
              onClick={() => onDepartmentSelect?.(department.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}