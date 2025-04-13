import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { AuthService, UserService } from '@/services';
import { UserProfile, ESidebarItem } from '@/schemas';
import { Button } from '@/components/ui/button';
import { LoadingScreen } from '@/components/ui/loading-screen';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { Sidebar } from '@/components/home/sidebar/Sidebar';
import { Header } from '@/components/home/header/Header';
import JournalView from '@/components/home/views/JournalView';
import DepartmentsView from '@/components/home/views/DepartmentsView';
import StaffView from '@/components/home/views/StaffView';
import { DefaultView } from '@/components/home/views/DefaultView';
import CalendarView from '@/components/home/views/CalendarView';

export function Home() {
  const [state, setState] = useState<{
    userProfile: UserProfile | null;
    loading: boolean;
    error: string | null;
  }>({
    userProfile: null,
    loading: true,
    error: null,
  });

  const [activeItem, setActiveItem] = useState<ESidebarItem>(ESidebarItem.DEFAULT);

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const result = await UserService.getProfile();

        if (!result.success) {
          throw new Error(result.error.message || 'Failed to fetch user profile');
        }

        setState({
          userProfile: result.data,
          loading: false,
          error: null,
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';

        setState({
          userProfile: null,
          loading: false,
          error: errorMessage,
        });

        toast.error(errorMessage);
      }
    };

    initializeUser();
  }, []);

  const handleLogout = () => {
    AuthService.logout();
  };

  const renderViewContent = (userProfile: UserProfile) => {
    switch (activeItem) {
      case ESidebarItem.DEFAULT:
        return <DefaultView userProfile={userProfile} onItemClick={setActiveItem} />
      case ESidebarItem.JOURNAL:
        return <JournalView />;
      case ESidebarItem.DEPARTMENTS:
        return <DepartmentsView userProfile={userProfile} />;
      case ESidebarItem.STAFF:
        return <StaffView />;
      case ESidebarItem.CALENDAR:
        return <CalendarView />;
      default:
        return <DefaultView
          userProfile={userProfile}
          onItemClick={setActiveItem}
        />;
    }
  };

  const renderContent = () => {
    const { loading, error, userProfile } = state;

    if (loading) {
      return <LoadingScreen />;
    }

    if (error) {
      return (
        <ErrorDisplay
          error={error}
          onRetry={() => window.location.reload()}
          onLogout={handleLogout}
        />
      );
    }

    if (!userProfile) {
      return (
        <div className="p-8">
          <h1 className="text-2xl font-bold mb-4">Доступ запрещен</h1>
          <p className="mb-4">
            Не удалось загрузить ваш профиль. Обратитесь в поддержку.
          </p>
          <Button onClick={handleLogout}>Выйти</Button>
        </div>
      );
    }

    return (
      <>
        <Sidebar
          onItemClick={setActiveItem}
          activeItem={activeItem}
          userProfile={userProfile}
        />
        <div className="flex flex-col min-h-screen overflow-auto">
          <Header
            pageTitle={getPageTitle(activeItem)}
            userProfile={userProfile}
            onLogout={handleLogout}
          />
          <main className="flex-1 p-6 pl-38 overflow-auto">
            {renderViewContent(userProfile)}
          </main>
        </div>
      </>
    );
  };

  return <div className="min-h-screen bg-gray-50">{renderContent()}</div>;
}

const getPageTitle = (item: ESidebarItem): string => {
  switch (item) {
    case ESidebarItem.DEFAULT: return 'Главная панель';
    case ESidebarItem.JOURNAL: return 'Журнал заявок';
    case ESidebarItem.DEPARTMENTS: return 'Управление';
    case ESidebarItem.STAFF: return 'Кадровый контроль';
    case ESidebarItem.CALENDAR: return 'Календарь';
    default: return 'Dashboard';
  }
};