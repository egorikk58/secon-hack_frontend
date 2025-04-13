import { Users, Inbox, FolderPlus, Calendar, FileCog, FolderCog } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Logo } from '@/components/ui/Logo';
import { ESidebarItem, UserRole, UserProfile } from '@/schemas';
import { Dispatch, SetStateAction } from 'react';

interface SidebarProps {
  onItemClick: Dispatch<SetStateAction<ESidebarItem>>;
  activeItem: ESidebarItem;
  userProfile: UserProfile;
}

export const Sidebar = ({
  onItemClick,
  activeItem,
  userProfile
}: SidebarProps) => {
  const getAvailableItems = () => {
    const baseItems = [
      {
        item: ESidebarItem.JOURNAL,
        icon: <Inbox className="h-[42px] w-[32px]" />,
        label: "Журнал заявок",
        roles: ['Director', 'HR', 'Worker'] as UserRole[]
      },
      {
        item: ESidebarItem.DEPARTMENTS,
        icon: <FolderCog className="h-[42px] w-[35px]" />,
        label: "Управление",
        roles: ['Director', 'HR'] as UserRole[]
      },
      {
        item: ESidebarItem.STAFF,
        icon: <Users className="h-[42px] w-[40px]" />,
        label: "Кадровый контроль",
        roles: ['Director', 'HR'] as UserRole[]
      },
      {
        item: ESidebarItem.CALENDAR,
        icon: <Calendar className="h-[42px] w-[46px]" />,
        label: "Календарь",
        roles: ['Director', 'HR', 'Worker'] as UserRole[]
      }
    ];

    return baseItems.filter(item => item.roles.includes(userProfile.userRole));
  };

  return (
    <div className="z-10 group/sidebar fixed h-full w-[130px] hover:w-[363px] bg-white border-r transition-all duration-300 ease-in-out overflow-hidden flex flex-col">
      <div className="h-[72px] border-b border-gray-200 flex items-center justify-center relative">
        <button className="flex items-center w-full cursor-pointer">
          <div className="w-[130px] flex justify-center rounded-lg p-2 transition-colors">
            <Logo />
          </div>
          <span className="absolute left-[90px] ml-[12px] text-3xl font-bold text-gray-800 opacity-0 group-hover/sidebar:opacity-100 transition-all duration-200 whitespace-nowrap">
            Форс
          </span>
        </button>
      </div>

      <nav className="flex-1 flex flex-col pt-4 gap-1">
        {getAvailableItems().map(({ item, icon, label }) => (
          <SidebarItem
            key={item}
            icon={icon}
            label={label}
            active={activeItem === item}
            onClick={() => onItemClick(item)}
          />
        ))}
      </nav>

      <div className="relative mb-[37px]">
        <div className="border-t border-gray-200 mx-4 my-2"></div>
      </div>

      <div className="mb-[61px] mt-[37px] flex relative">
        <div className="w-[130px] flex justify-center rounded-lg transition-colors cursor-pointer">
          <Avatar className="h-[80px] w-[80px] transition-all duration-200 hover:scale-105 cursor-pointer">
            <AvatarImage src={userProfile.imageUrl || undefined} />
            <AvatarFallback>
              {userProfile.name.charAt(0)}{userProfile.surname.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span className="absolute left-[116px] top-1/2 transform -translate-y-1/2 opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-200 whitespace-nowrap text-sm">
            <div className="flex flex-col">
              <span className="font-medium text-2xl">
                {userProfile.surname} {userProfile.name} {userProfile.patronymic}
              </span>
              <span className="text-gray-500 text-lg">
                {userProfile.email}
              </span>
              <span className="text-gray-400 text-sm">
                {userProfile.departmentId}
              </span>
            </div>
          </span>
        </div>
      </div>
    </div>
  );
};

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}

const SidebarItem = ({ icon, label, active, onClick }: SidebarItemProps) => {
  return (
    <div className="relative w-full group/item">
      <div className="w-[130px] flex justify-center">
        <button
          onClick={onClick}
          className={`p-2 rounded-lg transition-all duration-200 relative group-hover/sidebar:bg-gray-100 hover:bg-indigo-50 hover:shadow-sm cursor-pointer ${active ? 'bg-indigo-50 shadow-sm' : ''
            }`}
        >
          <span className="flex items-center justify-center h-12 w-12 transition-all duration-200 group-hover/item:scale-110 cursor-pointer">
            {icon}
          </span>
          <span
            className={`absolute left-[70px] top-1/2 transform text-lg -translate-y-1/2 opacity-0 group-hover/sidebar:opacity-100 transition-all duration-200 whitespace-nowrap ${active || 'group-hover/item:text-indigo-600'
              } font-medium cursor-pointer`}
          >
            {label}
          </span>
        </button>
      </div>
    </div>
  );
};