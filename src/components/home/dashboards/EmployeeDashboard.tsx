import { UserProfile } from "@/schemas";

interface EmployeeDashboardProps {
  userProfile: UserProfile;
}

export default function EmployeeDashboard({ userProfile }: EmployeeDashboardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Панель сотрудника</h2>
      <p className="mb-4">Ваша роль: {userProfile.userRole}</p>
      <div className="space-y-4">
        <div className="p-4 border rounded">
          <h3 className="font-medium">Мои данные</h3>
          <p>Контент доступный сотрудникам</p>
        </div>
      </div>
    </div>
  );
}