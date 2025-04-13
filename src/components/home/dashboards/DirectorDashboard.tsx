import { UserProfile } from '@/schemas';

interface DirectorDashboardProps {
  userProfile: UserProfile;
}

export default function DirectorDashboard({ userProfile }: DirectorDashboardProps) {
  return (
    <div>DirectorDashboard</div>
  )
}
