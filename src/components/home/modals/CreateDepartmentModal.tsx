import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import { CircleX } from 'lucide-react';
import {
  DepartmentRoleEnum,
  DepartmentApiResponse,
  CreateDepartmentRequestDto,
  UserProfile
} from '@/schemas';
import { toast } from 'sonner';

interface CreateDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: CreateDepartmentRequestDto) => Promise<DepartmentApiResponse>;
  userProfile: UserProfile;
}

export function CreateDepartmentModal({ isOpen, onClose, onCreate, userProfile }: CreateDepartmentModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CreateDepartmentRequestDto>({
    resolver: zodResolver(CreateDepartmentRequestDto),
    defaultValues: {
      name: '',
      description: '',
      supervisorId: userProfile.id,
      role: 'Department',
    },
  });

  const onSubmit = async (values: CreateDepartmentRequestDto) => {
    setIsLoading(true);
    try {
      const result = await onCreate(values);
      if (result.success) {
        toast.success(`Отдел "${result.data.name}" успешно создан`);
        form.reset();
        onClose();
      } else {
        toast.error(result.error.message || 'Ошибка при создании отдела');
      }
    } catch (error) {
      console.error('Ошибка при создании отдела:', error);
      toast.error('Произошла ошибка при создании отдела');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
      <div className='relative bg-white rounded-lg p-6 w-full max-w-md'>
        <button
          type='button'
          onClick={onClose}
          disabled={isLoading}
          className='cursor-pointer hover:bg-gray-100 rounded-full p-2 transition-colors absolute right-6'
        >
          <CircleX
            size={24}
            className='text-gray-600 hover:text-green-600/90 transition-colors'
          />
        </button>

        <h2 className='text-2xl font-bold mb-4'>Создание отдела</h2>
        <p className='mb-6 text-gray-600'>
          Заполните все необходимые поля для создания нового отдела.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название отдела</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Введите название отдела'
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='role'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Тип подразделения</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Выберите тип' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(DepartmentRoleEnum).map(([value]) => (
                        <SelectItem key={value} value={value}>
                          {(() => {
                            switch (value) {
                              case 'Management': return 'Управление';
                              case 'Department': return 'Департамент';
                              case 'Division': return 'Подразделение';
                              case 'Sector': return 'Сектор';
                              default: return value;
                            }
                          })()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Описание</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Введите описание отдела'
                      className='resize-none'
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex justify-end space-x-3 pt-4'>
              <Button
                type='submit'
                disabled={isLoading}
              >
                {isLoading ? 'Создание...' : 'Создать отдел'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}