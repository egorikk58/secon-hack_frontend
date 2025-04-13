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
import { useEffect, useState } from 'react';
import { CircleX } from 'lucide-react';
import {
  CreateUserRequestDtoZod,
  CreateUserRequestSchema,
  UserRoleEnum,
  CreateUserRequestDtoResponse,
  DepartmentListResponse,
  BaseDepartment
} from '@/schemas';
import { toast } from 'sonner';
import { DepartmentService } from '@/services';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface CreateEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: CreateUserRequestDtoZod) => Promise<CreateUserRequestDtoResponse>;
  departmentId: string;
}

export function CreateEmployeeModal({ isOpen, onClose, onCreate, departmentId }: CreateEmployeeModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [departments, setDepartments] = useState<BaseDepartment[]>([]);

  const form = useForm<CreateUserRequestDtoZod>({
    resolver: zodResolver(CreateUserRequestSchema),
    defaultValues: {
      surname: '',
      name: '',
      patronymic: '',
      email: '',
      departmentId: departmentId,
      userRole: 'Worker',
      hiringDate: '2025-04-13T10:43:47.431Z',
      positionName: '00000000-0000-0000-0000-000000000000',
    },
  });

  // Загрузка отделов при открытии модального окна
  useEffect(() => {
    if (isOpen) {
      const loadDepartments = async () => {
        try {
          const response: DepartmentListResponse = await DepartmentService.getDepartments();
          if (response.success) {
            setDepartments(response.data);
          } else {
            toast.error('Не удалось загрузить список отделов');
          }
        } catch (error) {
          console.error('Ошибка загрузки отделов:', error);
          toast.error('Не удалось загрузить список отделов');
        }
      };
      loadDepartments();
    }
  }, [isOpen]);

  const onSubmit = async (values: CreateUserRequestDtoZod) => {
    setIsLoading(true);
    try {
      console.log(values);

      const result = await onCreate(values);
      console.log(result);

      if (result.success) {
        toast.success(`Сотрудник "${result.data.surname} ${result.data.name}" успешно создан`);
        form.reset();
        onClose();
      } else {
        toast.error(result.error.message || 'Ошибка при создании сотрудника');
      }
    } catch (error) {
      console.error('Ошибка при создании сотрудника:', error);
      toast.error('Произошла ошибка при создании сотрудника');
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

        <h2 className='text-2xl font-bold mb-4'>Создание сотрудника</h2>
        <p className='mb-6 text-gray-600'>
          Заполните все необходимые поля для создания нового сотрудника.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
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
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                      value={field.value || ''}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Введите email'
                      type='email'
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
              name='departmentId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Отдел</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoading || departments.length === 0}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={
                          departments.length === 0 ? 'Загрузка...' : 'Выберите отдел'
                        } />
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

            <FormField
              control={form.control}
              name="userRole"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Роль</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите роль" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(UserRoleEnum).map(([value]) => (
                        <SelectItem key={value} value={value}>
                          {(() => {
                            switch (value) {
                              case 'Director': return 'Director';
                              case 'Hr': return 'Hr';
                              case 'Worker': return 'Worker';
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
              name="hiringDate"
              render={({ field }) => {
                const [date, setDate] = useState<Date | undefined>(
                  field.value ? new Date(field.value) : undefined
                );

                return (
                  <FormItem className="flex flex-col">
                    <FormLabel>Дата приема на работу</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className="w-full pl-3 text-left font-normal"
                            disabled={isLoading}
                          >
                            {date ? (
                              format(date, "PPP", { locale: ru })
                            ) : (
                              <span>Выберите дату</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={(selectedDate) => {
                            setDate(selectedDate);
                            field.onChange(selectedDate?.toISOString());
                          }}
                          disabled={(date) =>
                            date > new Date() || date < new Date("2000-01-01")
                          }
                          initialFocus
                          locale={ru}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <div className='flex justify-end space-x-3 pt-4'>
              <Button
                type='submit'
                disabled={isLoading}
                variant={'project'}
              >
                {isLoading ? 'Создание...' : 'Создать сотрудника'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}