import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserProfile } from '@/schemas';
import { ESidebarItem } from '@/schemas';

interface DefaultViewProps {
  userProfile: UserProfile;
  onItemClick: (item: ESidebarItem) => void;
}

export function DefaultView({ userProfile, onItemClick }: DefaultViewProps) {
  return (
    <div className="flex justify-center items-center w-full p-4 mt-15">
      <div className="grid grid-cols-2 gap-6 w-full max-w-4xl p-4">
        {/* Верхняя левая плитка - Управление отделами */}
        <div className="bg-white p-6 rounded-lg shadow-md h-48 flex flex-col justify-between hover:shadow-lg transition-shadow">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 font-arkhip">Управление отделами</h3>
            <div className="h-px w-full bg-gray-200 my-3"></div>
            <p className="text-gray-600 text-sm">Просмотр и редактирование отделов компании</p>
          </div>
          <Button 
            variant="outline" 
            className="mt-2 self-start"
            onClick={() => onItemClick(ESidebarItem.DEPARTMENTS)}
          >
            Перейти
          </Button>
        </div>
    
        {/* Верхняя правая плитка - Профиль */}
        <div className="bg-white p-6 rounded-lg shadow-md h-48 flex flex-col justify-between hover:shadow-lg transition-shadow">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 font-arkhip">Профиль</h3>
            <div className="h-px w-full bg-gray-200 my-3"></div>
            <div className="flex items-start gap-4">
              <Avatar className="h-14 w-14">
                <AvatarImage src={userProfile.imageUrl || undefined} />
                <AvatarFallback>
                  {userProfile.name.charAt(0)}{userProfile.surname.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-bold">
                  {userProfile.surname} {userProfile.name}
                </h3>
                <p className="text-xs text-gray-500">
                  {userProfile.email}
                </p>
                <p className="text-sm">
                  {userProfile.userRole}
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  Отдел: {userProfile.departmentId}
                </p>
              </div>
            </div>
          </div>
        </div>
    
        {/* Нижняя левая плитка - Календарь */}
        <div className="bg-white p-6 rounded-lg shadow-md h-48 flex flex-col justify-between hover:shadow-lg transition-shadow">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 font-arkhip">Просмотр календаря</h3>
            <div className="h-px w-full bg-gray-200 my-3"></div>
            <p className="text-gray-600 text-sm">Просмотр событий и мероприятий</p>
          </div>
          <Button 
            variant="outline" 
            className="mt-2 self-start"
            onClick={() => onItemClick(ESidebarItem.CALENDAR)}
          >
            Перейти
          </Button>
        </div>
    
        {/* Нижняя правая плитка - Настройки компании */}
        <div className="bg-white p-6 rounded-lg shadow-md h-48 flex flex-col justify-between hover:shadow-lg transition-shadow">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 font-arkhip">Настройки компании</h3>
            <div className="h-px w-full bg-gray-200 my-3"></div>
            <p className="text-gray-600 text-sm">Управление настройками организации</p>
          </div>
          <Button 
            variant="outline"
            className="mt-2 self-start"
          >
            Перейти
          </Button>
        </div>
      </div>
    </div>
  );
}