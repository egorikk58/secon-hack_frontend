// components/home/calendar/GanttChart.tsx
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const months = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
];

interface Employee {
  id: string;
  name: string;
  vacations: Vacation[];
}

interface Vacation {
  startDate: string;
  endDate: string;
  status: 'approved' | 'pending';
}

interface Department {
  id: string;
  name: string;
  employees: Employee[];
}

export function GanttChart() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 2, 1)); // Март 2025 по умолчанию
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = months[month];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const getCellStyle = (employee: Employee, day: number) => {
    const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    const currentDate = new Date(dateStr);

    const vacation = employee.vacations.find(vac => {
      const start = new Date(vac.startDate);
      const end = new Date(vac.endDate);
      return currentDate >= start && currentDate <= end;
    });

    if (!vacation) return '';

    const startDate = new Date(vacation.startDate);
    const endDate = new Date(vacation.endDate);
    const isStart = currentDate.getTime() === startDate.getTime();
    const isEnd = currentDate.getTime() === endDate.getTime();
    const isMiddle = !isStart && !isEnd && currentDate > startDate && currentDate < endDate;

    let style = '';
    if (vacation.status === 'approved') {
      style = 'bg-gradient-to-r from-[#35B2E6] to-[#0AFB2D]';
      if (isStart) style += ' rounded-l-full';
      if (isEnd) style += ' rounded-r-full';
    } else {
      style = 'bg-gray-300';
      if (isStart) style += ' rounded-l-full';
      if (isEnd) style += ' rounded-r-full';
    }

    return style;
  };

  // Моковые данные отделов и сотрудников
  const departments: Department[] = [
    {
      id: 'dev',
      name: 'Разработка',
      employees: [
        {
          id: '1',
          name: 'Гуренев Е.А.',
          vacations: [
            { startDate: '2025-03-01', endDate: '2025-03-07', status: 'approved' },
            { startDate: '2025-03-21', endDate: '2025-03-27', status: 'approved' },
            { startDate: '2025-06-10', endDate: '2025-06-24', status: 'approved' },
          ],
        },
        {
          id: '2',
          name: 'Китарисов Е.М.',
          vacations: [
            { startDate: '2025-03-05', endDate: '2025-03-19', status: 'pending' },
            { startDate: '2025-07-15', endDate: '2025-07-29', status: 'pending' },
          ],
        },
        {
          id: '3',
          name: 'Петров А.В.',
          vacations: [
            { startDate: '2025-04-01', endDate: '2025-04-15', status: 'approved' },
            { startDate: '2025-08-10', endDate: '2025-08-24', status: 'pending' },
          ],
        },
        {
          id: '4',
          name: 'Сидорова О.И.',
          vacations: [
            { startDate: '2025-05-12', endDate: '2025-05-26', status: 'approved' },
          ],
        },
      ],
    },
    {
      id: 'design',
      name: 'Дизайн',
      employees: [
        {
          id: '5',
          name: 'Усков Д.Г.',
          vacations: [
            { startDate: '2025-03-15', endDate: '2025-03-29', status: 'approved' },
            { startDate: '2025-09-01', endDate: '2025-09-15', status: 'approved' },
          ],
        },
        {
          id: '6',
          name: 'Свеченков А.А.',
          vacations: [
            { startDate: '2025-04-01', endDate: '2025-04-15', status: 'pending' },
            { startDate: '2025-10-10', endDate: '2025-10-24', status: 'pending' },
          ],
        },
        {
          id: '7',
          name: 'Иванова М.К.',
          vacations: [
            { startDate: '2025-05-05', endDate: '2025-05-19', status: 'approved' },
          ],
        },
      ],
    },
    {
      id: 'marketing',
      name: 'Маркетинг',
      employees: [
        {
          id: '8',
          name: 'Смирнов П.Р.',
          vacations: [
            { startDate: '2025-03-10', endDate: '2025-03-24', status: 'approved' },
            { startDate: '2025-07-01', endDate: '2025-07-15', status: 'pending' },
          ],
        },
        {
          id: '9',
          name: 'Козлова Е.В.',
          vacations: [
            { startDate: '2025-04-15', endDate: '2025-04-29', status: 'approved' },
          ],
        },
        {
          id: '10',
          name: 'Николаев Д.С.',
          vacations: [
            { startDate: '2025-06-01', endDate: '2025-06-15', status: 'pending' },
            { startDate: '2025-11-10', endDate: '2025-11-24', status: 'pending' },
          ],
        },
      ],
    },
    {
      id: 'hr',
      name: 'HR',
      employees: [
        {
          id: '12',
          name: 'Васильев И.П.',
          vacations: [
            { startDate: '2025-05-10', endDate: '2025-05-24', status: 'approved' },
            { startDate: '2025-09-15', endDate: '2025-09-29', status: 'pending' },
          ],
        },
      ],
    },
    {
      id: 'sales',
      name: 'Продажи',
      employees: [
        {
          id: '13',
          name: 'Алексеев С.Д.',
          vacations: [
            { startDate: '2025-04-05', endDate: '2025-04-19', status: 'approved' },
            { startDate: '2025-08-01', endDate: '2025-08-15', status: 'approved' },
          ],
        },
        {
          id: '14',
          name: 'Дмитриева Н.Л.',
          vacations: [
            { startDate: '2025-06-15', endDate: '2025-06-29', status: 'pending' },
          ],
        },
        {
          id: '15',
          name: 'Орлов В.С.',
          vacations: [
            { startDate: '2025-07-10', endDate: '2025-07-24', status: 'approved' },
            { startDate: '2025-12-01', endDate: '2025-12-15', status: 'pending' },
          ],
        },
      ],
    },
  ];

  const filteredEmployees = selectedDepartment === 'all'
    ? departments.flatMap(dept => dept.employees)
    : departments.find(dept => dept.id === selectedDepartment)?.employees || [];

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const isOnVacation = (employee: Employee, day: number) => {
    const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

    return employee.vacations.some(vac => {
      const start = new Date(vac.startDate);
      const end = new Date(vac.endDate);
      const current = new Date(dateStr);

      return current >= start && current <= end &&
        (month === start.getMonth() || month === end.getMonth());
    });
  };

  const getVacationRange = (employee: Employee, day: number) => {
    const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    const currentDate = new Date(dateStr);

    const vacation = employee.vacations.find(vac => {
      const start = new Date(vac.startDate);
      const end = new Date(vac.endDate);
      return currentDate >= start && currentDate <= end;
    });

    if (!vacation) return null;

    const startDate = new Date(vacation.startDate);
    const endDate = new Date(vacation.endDate);
    const isStart = currentDate.getTime() === startDate.getTime();
    const isEnd = currentDate.getTime() === endDate.getTime();
    const isMiddle = !isStart && !isEnd;

    return {
      status: vacation.status,
      isStart,
      isEnd,
      isMiddle,
      isSingle: isStart && isEnd // Для отпусков длиной в 1 день
    };
  };

  const getVacationStatus = (employee: Employee, day: number) => {
    const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

    const vacation = employee.vacations.find(vac => {
      const start = new Date(vac.startDate);
      const end = new Date(vac.endDate);
      const current = new Date(dateStr);

      return current >= start && current <= end &&
        (month === start.getMonth() || month === end.getMonth());
    });

    return vacation?.status;
  };

  const hasPendingVacations = (employee: Employee) => {
    return employee.vacations.some(v => v.status === 'pending');
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          <button onClick={prevMonth} className="p-1 rounded hover:bg-gray-100">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h2 className="text-xl font-bold">
            {monthName} {year}
          </h2>
          <button onClick={nextMonth} className="p-1 rounded hover:bg-gray-100">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="mb-4 w-60 ">
        <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Выберите отдел" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все отделы</SelectItem>
            {departments.map(dept => (
              <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2 text-left w-48">Сотрудник</th>
              {days.map((day) => (
                <th key={day} className="border p-2 text-center w-8">
                  {day}
                </th>
              ))}
              <th className="border p-2 text-left w-32">Статус</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee) => {
              // Находим все отпуска, которые попадают в текущий месяц
              const monthVacations = employee.vacations.filter(vac => {
                const start = new Date(vac.startDate);
                const end = new Date(vac.endDate);
                return (
                  (start.getMonth() <= month && end.getMonth() >= month) ||
                  (start.getFullYear() === year && start.getMonth() === month) ||
                  (end.getFullYear() === year && end.getMonth() === month)
                );
              });

              return (
                <tr key={employee.id}>
                  <td className="border p-2">{employee.name}</td>
                  {days.map((day) => {
                    const range = getVacationRange(employee, day);
                    if (!range) {
                      return <td key={`${employee.id}-${day}`} className="border p-0"></td>;
                    }

                    // Для первого дня отпуска создаем элемент, который растянется на всю длину
                    if (range.isStart) {
                      const vacation = employee.vacations.find(vac => {
                        const start = new Date(vac.startDate);
                        const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                        return new Date(dateStr).getTime() === start.getTime();
                      });

                      if (vacation) {
                        const startDay = new Date(vacation.startDate).getDate();
                        const endDay = new Date(vacation.endDate).getDate();
                        const daysCount = range.isSingle ? 1 :
                          (new Date(vacation.endDate).getMonth() === month ? endDay : daysInMonth) - startDay + 1;

                        return (
                          <td
                            key={`${employee.id}-${day}`}
                            className="border p-0"
                            colSpan={daysCount}
                          >
                            <div className={`h-6 ${range.status === 'approved'
                              ? 'bg-gradient-to-r from-[#35B2E6] to-[#0AFB2D]'
                              : 'bg-gray-300'}`}
                            ></div>
                          </td>
                        );
                      }
                    }

                    if (range.isMiddle || range.isEnd) {
                      return null;
                    }

                    return <td key={`${employee.id}-${day}`} className="border p-0"></td>;
                  })}
                  <td className="border p-2">
                    {hasPendingVacations(employee) ? (
                      <span className="text-gray-500">Не утвержден</span>
                    ) : (
                      <span className="bg-gradient-to-r from-[#35B2E6] to-[#0AFB2D] text-transparent bg-clip-text">
                        Утвержден
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* <div className="mt-4 flex space-x-4">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-gradient-to-r from-[#35B2E6] to-[#0AFB2D] mr-2"></div>
          <span>Утвержден</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-gray-300 mr-2"></div>
          <span>Не утвержден</span>
        </div>
      </div> */}
    </div>
  );
}