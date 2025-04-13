import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { CircleX } from 'lucide-react';
import { toast } from 'sonner';
import { DepartmentService, UserService } from '@/services';
import { BaseDepartment, DepartmentEmployee, UpdateUserRequestDtoZod, UpdateUserRequestSchema, UserProfile } from '@/schemas';
import { useEffect, useState } from 'react';

interface EditEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (data: UpdateUserRequestDtoZod) => Promise<any>;
  employee: DepartmentEmployee;
  userProfile: UserProfile;
}

export function EditEmployeeModal({ isOpen, onClose, onUpdate, employee, userProfile }: EditEmployeeModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [departments, setDepartments] = useState<BaseDepartment[]>([]);

  const form = useForm<UpdateUserRequestDtoZod>({
    resolver: zodResolver(UpdateUserRequestSchema),
    defaultValues: {
      userId: employee.id,
      name: employee.name || null,
      surname: employee.surname || null,
      patronymic: employee.patronymic || null,
      departmentId: employee.departmentId || null,
      phone: employee.phone || null,
      telegramUsername: employee.telegramUsername || null,
      imageId: employee.imageUrl || null,
    },
  });

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const response = await DepartmentService.getDepartments();
        if (response.success) {
          setDepartments(response.data);
        }
      } catch (error) {
        console.error('Error loading departments:', error);
        toast.error('Не удалось загрузить список отделов');
      }
    };

    if (isOpen) {
      loadDepartments();
    }
  }, [isOpen]);

  const onSubmit = async (data: UpdateUserRequestDtoZod) => {
    setIsLoading(true);
    try {
      const result = await UserService.updateUser(data);
      if (result.success) {
        toast.success('Данные сотрудника успешно обновлены');
        onClose();
      } else {
        toast.error(result.error?.message || 'Ошибка при обновлении данных');
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Произошла ошибка при обновлении данных');
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
          <CircleX className='text-gray-600 hover:text-green-600/90 transition-colors' size={24} />
        </button>

        <h2 className='text-2xl font-bold mb-4'>Редактирование сотрудника</h2>
        <p className='mb-6 text-gray-600'>
          Обновите данные для {employee.surname} {employee.name}
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Имя</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Введите имя'
                      {...field}
                      value={field.value || ''}
                      onChange={field.onChange}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='surname'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Фамилия</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Введите фамилию'
                      {...field}
                      value={field.value || ''}
                      onChange={field.onChange}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='patronymic'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Отчество</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Введите отчество'
                      {...field}
                      value={field.value || ''}
                      onChange={field.onChange}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='phone'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Телефон</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Введите телефон'
                      {...field}
                      value={field.value || ''}
                      onChange={field.onChange}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='telegramUsername'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telegram</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Введите username Telegram'
                      {...field}
                      value={field.value || ''}
                      onChange={field.onChange}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='departmentId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Отдел</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ''}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите отдел" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {departments.map((department) => (
                        <SelectItem key={department.id} value={department.id}>
                          {department.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex justify-end space-x-3 pt-4'>
              <Button
                type='submit'
                disabled={isLoading}
                variant={"project"}
              >
                {isLoading ? 'Сохранение...' : 'Сохранить'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}