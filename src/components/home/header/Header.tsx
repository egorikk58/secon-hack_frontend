import { Button } from '@/components/ui/button';
import { UserProfile } from '@/schemas';

interface HeaderProps {
  pageTitle: string;
  userProfile: UserProfile;
  onLogout: () => void;
}

export const Header = ({onLogout }: HeaderProps) => {
  return (
    <header className="h-[72px] border-b border-gray-200 bg-white px-6 flex flex-col justify-center">
      <div className="flex justify-around w-full">
        {/* <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
            <span className="text-sm font-medium">
              {userProfile.name.charAt(0)}{userProfile.surname.charAt(0)}
            </span>
          </div>
          <div>
            <p className="font-medium">
              {userProfile.name} {userProfile.surname}
            </p>
            <p className="text-sm text-gray-500">{userProfile.userRole}</p>
          </div>
        </div> */}

        {/* <div className="flex-1 max-w-2xl mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Поиск"
              className="pl-12 pr-4 py-6 text-base bg-gray-50 border-gray-300 focus-visible:ring-sky-800 hover:bg-white transition-colors"
            />
          </div>
        </div> */}

<Button
  onClick={onLogout}
  variant="project"
  className="ml-auto bg-gradient-to-r from-[#35B2E6] to-[#0AFB2D] text-white hover:opacity-70 transition-opacity"
>
  Выйти
</Button>
      </div>

      {/* <div className="mt-4">
        <h1 className="text-xl font-semibold text-center">{pageTitle}</h1>
      </div> */}
    </header>
  );
};