import { toast } from 'sonner';

export const handleServiceError = (error: any): {
  success: false;
  error: {
    message: string;
    status?: number;
    data?: any
  }
} => {
  const message = error.response?.data?.message ||
    error.message ||
    'An error occurred';

  console.error('Service error:', {
    message: message,
    status: error.response?.status,
    data: error.response?.data,
    error: error
  });

  toast.error(message);

  return {
    success: false,
    error: {
      message,
      status: error.response?.status,
      data: error.response?.data
    }
  };
};