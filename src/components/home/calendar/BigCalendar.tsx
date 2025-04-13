import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const daysOfWeek = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const months = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
];

const mockPeopleData: Record<string, number> = {
  "2025-04-02": 9,
  "2025-04-04": 12,
  "2023-11-10": 8,
  "2023-11-15": 3,
  "2023-11-20": 7,
  "2023-11-25": 15,
  "2023-11-30": 10,
};

export function ElegantCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = months[month];

  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const startDayOfWeek = firstDayOfMonth.getDay() || 7;

  const days = [];

  for (let i = 1; i < startDayOfWeek; i++) {
    days.push(null);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i);
    const dateString = date.toISOString().split('T')[0];
    const peopleCount = mockPeopleData[dateString] || 0;
    days.push({ day: i, people: peopleCount, isCurrentMonth: true });
  }

  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  return (
    <div className="h-full w-full p-6 bg-white rounded-xl">
      {/* Заголовок с месяцем и стрелками */}
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={prevMonth}>
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h2 className="text-3xl text-gray-800 font-inter font-[24px] font-medium">
          {monthName} {year}
        </h2>
        <Button variant="ghost" size="icon" onClick={nextMonth}>
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      {/* Дни недели */}
      <div className="grid grid-cols-7 gap-0  pb-2 mb-2">
        {daysOfWeek.map((day) => (
          <div key={day} className="text-center font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>

      {/* Ячейки с днями */}
      <div className="grid grid-cols-7 gap-0">
        {weeks.map((week, weekIndex) => (
          week.map((day, dayIndex) => (
            <div
              key={`${weekIndex}-${dayIndex}`}
              className={`min-h-[120px] p-2 border-r border-black ${dayIndex === 6 ? 'border-r-0' : ''
                } ${!day ? 'bg-gray-50' : 'hover:bg-gray-50 transition-colors'
                }`}
            >
              {day ? (
                <div className="flex flex-col h-full items-center group">
                  {/* Обертка для эффекта hover */}
                  <div className="relative p-2">
                    {/* Градиентная обводка при наведении */}
                    <div className="
                absolute inset-0 
                rounded-lg
                border-2 border-transparent
                group-hover:border-2
                group-hover:border-transparent
                group-hover:bg-gradient-to-r
                group-hover:from-[#35B2E6]
                group-hover:to-[#0AFB2D]
                group-hover:bg-origin-border
                group-hover:p-[2px]
                transition-all duration-200
                w-full h-full
              ">
                      <div className="absolute inset-0 rounded-lg bg-white"></div>
                    </div>

                    {/* Содержимое */}
                    <div className="relative z-10">
                      {/* Число дня */}
                      <div className="h-8 flex items-center justify-center mb-1">
                        <span className="text-lg font-medium">{day.day}</span>
                      </div>

                      {/* Градиентная плашка для количества людей */}
                      <div className="h-6 flex items-center justify-center">
                        {(
                          <div className="
                      text-gray-700 text-xs font-medium
                      group-hover:bg-gradient-to-r 
                      group-hover:from-[#35B2E6] 
                      group-hover:to-[#0AFB2D]
                      group-hover:text-white 
                      group-hover:rounded-full 
                      group-hover:px-2 
                      group-hover:py-1
                      transition-all 
                      duration-200
                    ">
                            {day.people} человек
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          ))
        ))}
      </div>
    </div>
  );
}