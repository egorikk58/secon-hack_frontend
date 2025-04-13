// Конфигурация колонок
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { DepartmentEmployee } from '@/schemas';
import { toast } from 'sonner';
import { UserService } from '@/services';

interface ColumnOptions {
  onEditClick?: (employee: DepartmentEmployee) => void;
}

export const getEmployeeColumns = (options?: ColumnOptions): ColumnDef<DepartmentEmployee>[] => [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <Button
        variant='ghost'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Имя
        <ArrowUpDown className='ml-2 h-4 w-4' />
      </Button>
    ),
    cell: ({ row }) => {
      const employee = row.original;
      return (
        <div className='flex items-center gap-3'>
          <Avatar className='h-8 w-8'>
            {employee.imageUrl && <AvatarImage src={employee.imageUrl} />}
            <AvatarFallback>
              {employee.name?.charAt(0)}{employee.surname?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className='font-medium'>
            {employee.surname} {employee.name} {employee.patronymic}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <Button
        variant='ghost'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Email
        <ArrowUpDown className='ml-2 h-4 w-4' />
      </Button>
    ),
    cell: ({ row }) => (
      <div className='flex items-center gap-2'>
        <Mail className='h-4 w-4' />
        {row.getValue('email')}
      </div>
    ),
  },
  {
    accessorKey: 'userRole',
    header: ({ column }) => (
      <Button
        variant='ghost'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Роль
        <ArrowUpDown className='ml-2 h-4 w-4' />
      </Button>
    ),
    cell: ({ row }) => {
      const role = row.original.userRole;

      const roleTranslations = {
        Director: 'Директор',
        Hr: 'HR-менеджер',
        Worker: 'Сотрудник'
      };

      return (
        <Badge variant='outline'>
          {roleTranslations[role as keyof typeof roleTranslations] || role}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'phone',
    header: ({ column }) => (
      <Button
        variant='ghost'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Телефон
        <ArrowUpDown className='ml-2 h-4 w-4' />
      </Button>
    ),
    cell: ({ row }) => (
      <div className='flex items-center gap-2'>
        <Phone className='h-4 w-4' />
        {row.getValue('phone') || '—'}
      </div>
    ),
  },
  {
    accessorKey: 'hiringDate',
    header: ({ column }) => (
      <Button
        variant='ghost'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Дата трудоустройства
        <ArrowUpDown className='ml-2 h-4 w-4' />
      </Button>
    ),
    cell: ({ row }) => {
      const dateValue = row.getValue('hiringDate');
      const date = typeof dateValue === 'string' || dateValue instanceof Date
        ? new Date(dateValue)
        : null;

      return (
        <div className='text-sm'>
          {date && !isNaN(date.getTime())
            ? format(date, 'PPP', { locale: ru })
            : '—'}
        </div>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const employee = row.original;

      const handleEditClick = () => {
        if (options?.onEditClick) {
          options.onEditClick(employee);
        }
      };

      const handleDelete = async () => {
        try {
          const result = await UserService.deleteUser(employee.id);
          if (result.success) {
            toast.success('Сотрудник успешно удален');
          } else {
            toast.error(result.message || 'Не удалось удалить сотрудника');
          }
        } catch (error) {
          toast.error('Произошла ошибка при удалении сотрудника');
          console.error('Delete error:', error);
        }
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Открыть меню</span>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(employee.id)}
            >
              Копировать ID
            </DropdownMenuItem>
            {/* <DropdownMenuItem onClick={handleEditClick}>Редактировать</DropdownMenuItem> */}
            <DropdownMenuItem
              className='text-red-600 focus:text-red-600'
              onClick={handleDelete}
            >
              Удалить
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  }
];