import { BaseDepartment, DepartmentRoleEnum, DepartmentRoleKey, DepartmentWithEmployees, UserRoleEnum } from '@/schemas'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useEffect, useState } from 'react'
import { DepartmentService } from '@/services'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { ArrowUpDown, ChevronDown, MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

interface DepartmentCardProps {
  department: BaseDepartment
  searchQuery?: string
  sortField?: keyof DepartmentWithEmployees['employees'][number]
  sortDirection?: 'asc' | 'desc'
  onSortChange?: (field: keyof DepartmentWithEmployees['employees'][number], direction: 'asc' | 'desc') => void
  isSelected?: boolean
  onClick?: () => void
}

export function DepartmentCard({
  department,
  searchQuery = '',
  sortField,
  sortDirection,
  onSortChange,
  isSelected = false,
  onClick
}: DepartmentCardProps) {
  const [departmentWithEmployees, setDepartmentWithEmployees] = useState<DepartmentWithEmployees | null>(null)
  const [filteredEmployees, setFilteredEmployees] = useState<DepartmentWithEmployees['employees']>([])

  const supervisor = departmentWithEmployees?.employees.find(emp => emp.id === department.supervisorId)

  const handleSort = (field: keyof DepartmentWithEmployees['employees'][number], direction: 'asc' | 'desc') => {
    if (onSortChange) {
      onSortChange(field, direction)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const employeesResponse = await DepartmentService.getDepartmentWithEmployees(department.id)
        if (employeesResponse.success) {
          setDepartmentWithEmployees(employeesResponse.data)
          setFilteredEmployees(employeesResponse.data.employees)
        } else {
          toast.error('Ошибка загрузки сотрудников')
        }
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error)
        toast.error('Произошла ошибка при загрузке данных')
      }
    }

    fetchData()
  }, [department])

  // Фильтрация сотрудников по поисковому запросу
  useEffect(() => {
    if (!departmentWithEmployees) return

    const filtered = departmentWithEmployees.employees.filter(emp =>
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.userRole.toLowerCase().includes(searchQuery.toLowerCase())
    )

    setFilteredEmployees(filtered)
  }, [searchQuery, departmentWithEmployees])

  // Сортировка сотрудников
  useEffect(() => {
    if (!sortField || !departmentWithEmployees) return

    const sorted = [...filteredEmployees].sort((a, b) => {
      const aValue = a[sortField] ?? ''
      const bValue = b[sortField] ?? ''

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

    setFilteredEmployees(sorted)
  }, [sortField, sortDirection, departmentWithEmployees])

  return (
    <div
      className={cn(
        'border rounded-lg p-4 h-full flex flex-col hover:shadow-md transition-shadow bg-white cursor-pointer',
        isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
      )}
      onClick={onClick}
    >
      <div className='flex items-start justify-between mb-3'>
        <div>
          <h3 className='font-semibold text-lg line-clamp-1'>
            {department.name}
          </h3>
          <Badge variant='outline' className='mt-1'>
            {DepartmentRoleEnum[department.role as DepartmentRoleKey]}
          </Badge>
        </div>
        <Badge variant='secondary'>
          {filteredEmployees.length} чел.
        </Badge>
      </div>

      {department.description && (
        <p className='text-gray-600 text-sm mb-4 line-clamp-2'>
          {department.description}
        </p>
      )}

      {/* Список сотрудников с возможностью сортировки */}
      <div className='mb-4 space-y-2'>
        <div className='flex items-center justify-between'>
          <h4 className='text-sm font-medium'>Сотрудники:</h4>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' size='sm' className='text-gray-500' onClick={(e) => e.stopPropagation()}>
                Сортировка <ChevronDown className='ml-1 h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleSort('name', 'asc'); }}>
                По имени (А-Я)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleSort('name', 'desc'); }}>
                По имени (Я-А)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleSort('userRole', 'asc'); }}>
                По должности (А-Я)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleSort('userRole', 'desc'); }}>
                По должности (Я-А)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {filteredEmployees.length > 0 ? (
          filteredEmployees.map(employee => (
            <div key={employee.id} className='flex items-center justify-between p-2 border rounded'>
              <div className='flex items-center space-x-3'>
                <Avatar className='h-8 w-8'>
                  <AvatarImage src={employee.imageUrl} />
                  <AvatarFallback>
                    {employee.name?.charAt(0)}{employee.surname?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className='text-sm font-medium'>{employee.surname} {employee.name}</p>
                  <p className='text-xs text-gray-500'>{employee.email}</p>
                </div>
              </div>
              <Badge variant='outline'>
                {UserRoleEnum[employee.userRole as keyof typeof UserRoleEnum] || employee.userRole}
              </Badge>
            </div>
          ))
        ) : (
          <p className='text-sm text-gray-500 text-center py-2'>Сотрудники не найдены</p>
        )}
      </div>

      <div className='mt-auto pt-3 border-t'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-2'>
            <Avatar className='h-8 w-8'>
              <AvatarImage src={supervisor?.imageUrl} />
              <AvatarFallback>
                {supervisor?.name?.charAt(0) || '?'}
              </AvatarFallback>
            </Avatar>
            <span className='text-sm'>
              {supervisor?.name || 'Руководитель не назначен'}
            </span>
          </div>

          <Button variant='ghost' size='sm' className='text-gray-500' onClick={(e) => e.stopPropagation()}>
            Подробнее
          </Button>
        </div>
      </div>
    </div>
  )
}