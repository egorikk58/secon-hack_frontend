import { useEffect, useState } from 'react';
import { DateRangePicker } from '@/components/home/calendar/DateRangePicker';
import { ElegantCalendar } from '@/components/home/calendar/BigCalendar';
import { UserService } from '@/services/user.service';
import { UserRole } from '@/schemas';
import { LoadingScreen } from '@/components/ui/loading-screen';

export default function CalendarView() {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await UserService.getProfile();
        if (response.success) {
          setUserRole(response.data.userRole);
        }
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="h-full">
      {userRole === 'Worker' ? (
        <DateRangePicker />
      ) : (
        <ElegantCalendar />
      )}
    </div>
  );
}