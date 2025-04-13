import React, { useEffect, useState } from 'react';
import { DateRangePicker } from '@/components/home/calendar/DateRangePicker';
import { ElegantCalendar } from '@/components/home/calendar/BigCalendar';
import { GanttChart } from '@/components/home/calendar/GanttChart';
import { UserService } from '@/services/user.service';
import { UserRole } from '@/schemas';
import { LoadingScreen } from '@/components/ui/loading-screen';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { HeatMap } from '@/components/home/calendar/HeatMap';

export default function CalendarView() {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'calendar' | 'gantt' | 'heatmap'>('calendar');

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
    <div className="h-full flex flex-col">
      {userRole === 'Worker' ? (
        <DateRangePicker />
      ) : (
        <>
          <div className="flex justify-end mb-4">
            <ToggleGroup
              type="single"
              value={viewMode}
              onValueChange={(value) => {
                if (value) setViewMode(value as 'calendar' | 'gantt' | 'heatmap');
              }}
              className="bg-gray-100 rounded-lg p-1"
            >
              <ToggleGroupItem value="calendar" className="px-4 py-2">
                Календарь
              </ToggleGroupItem>
              <ToggleGroupItem value="gantt" className="px-4 py-2">
                Диаграмма Ганта
              </ToggleGroupItem>
              <ToggleGroupItem value="heatmap" className="px-4 py-2">
                Тепловая карта
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          <div className="flex-1">
            {viewMode === 'calendar' ? <ElegantCalendar /> : viewMode === 'gantt' ? <GanttChart /> : <HeatMap />}
          </div>
        </>
      )}
    </div>
  );
}