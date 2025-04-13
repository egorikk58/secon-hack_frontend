import { useEffect, useState } from 'react';
import { AuthService } from '@/services';
import { Home } from '@/pages/Home';
import { Login } from '@/pages/Login';
import { Loader2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { Register } from '@/pages/Register';

// Пути для неавторизованных пользователей
const UNAUTH_PATHS = ['/login', '/register'];

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const isAuth = AuthService.checkAuth();
        setIsAuthenticated(isAuth);

        if (isAuth) {
          // Если авторизован и пытается попасть на страницу входа/регистрации
          if (UNAUTH_PATHS.includes(location.pathname)) {
            navigate('/');
            toast('You are already logged in');
          }
        } else {
          // Если не авторизован и пытается попасть на защищенную страницу
          if (!UNAUTH_PATHS.includes(location.pathname)) {
            navigate('/login');
            toast.info('Please login to continue');
          }
        }
      } catch (error) {
        setIsAuthenticated(false);
        if (!UNAUTH_PATHS.includes(location.pathname)) {
          navigate('/login');
        }
        toast.error('Failed to verify authentication');
      }
    };

    verifyAuth();
  }, [navigate, location.pathname]);

  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[url('/public/background.png')] bg-cover bg-center font-inter">
      {location.pathname === '/login' && !isAuthenticated && <Login />}
      {location.pathname === '/register' && !isAuthenticated && <Register />}

      {location.pathname === '/' && isAuthenticated && <Home />}
    </div>
  );
}

export default App;