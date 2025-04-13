import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ErrorDisplayProps {
  error: string | Error;
  onRetry?: () => void;
  onLogout?: () => void;
  className?: string;
}

export function ErrorDisplay({
  error,
  onRetry,
  onLogout,
  className = ''
}: ErrorDisplayProps) {
  const errorMessage = typeof error === 'string' ? error : error.message;

  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      <Alert variant='destructive' className='w-full max-w-md mb-6'>
        <AlertCircle className='h-5 w-5' />
        <AlertTitle>Ошибка</AlertTitle>
        <AlertDescription className='break-words'>
          {errorMessage}
        </AlertDescription>
      </Alert>

      <div className='flex gap-3'>
        {onRetry && (
          <Button
            variant='outline'
            onClick={onRetry}
          >
            Повторить попытку
          </Button>
        )}

        {onLogout && (
          <Button
            variant='destructive'
            onClick={onLogout}
          >
            Выйти
          </Button>
        )}
      </div>
    </div>
  );
}