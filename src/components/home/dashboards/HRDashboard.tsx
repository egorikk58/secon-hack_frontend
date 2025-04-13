import { UserProfile } from "@/schemas";

interface HRDashboardProps {
  userProfile: UserProfile;
}

export default function HRDashboard({ userProfile }: HRDashboardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Панель кадрового менеджера</h2>
      <p className="mb-4">Ваша роль: {userProfile.userRole}</p>
      <div className="space-y-4">
        <div className="p-4 border rounded">
          <h3 className="font-medium">Управление персоналом</h3>
          <p>Контент доступный только HR-менеджерам</p>
        </div>
      </div>
    </div>
  );
}