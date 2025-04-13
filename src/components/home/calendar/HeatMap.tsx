import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

const departments = [
  { id: 'all', name: 'Все отделы' },
  { id: 'dev', name: 'Разработка' },
  { id: 'design', name: 'Дизайн' },
  { id: 'marketing', name: 'Маркетинг' },
  { id: 'hr', name: 'HR' },
  { id: 'sales', name: 'Продажи' }
];

const months = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];

const vacationsData = {
  dev: [12, 8, 6, 5, 10, 15, 18, 14, 7, 6, 5, 9],
  design: [4, 3, 5, 6, 8, 10, 12, 9, 5, 4, 3, 6],
  marketing: [7, 5, 6, 7, 9, 11, 13, 10, 6, 5, 4, 8],
  hr: [3, 2, 4, 3, 5, 6, 8, 7, 4, 3, 2, 5],
  sales: [9, 7, 8, 6, 11, 13, 15, 12, 8, 7, 6, 10]
};

export function HeatMap() {
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedYear, setSelectedYear] = useState(2025);
  const [showLowLoad, setShowLowLoad] = useState(true);
  const [showHighLoad, setShowHighLoad] = useState(true);

  const totalVacations = selectedDepartment === 'all'
    ? Object.values(vacationsData).flat().reduce((sum, num) => sum + num, 0)
    : vacationsData[selectedDepartment as keyof typeof vacationsData]?.reduce((sum, num) => sum + num, 0) || 0;

  const getDataForDepartment = () => {
    if (selectedDepartment === 'all') {
      return months.map((_, index) =>
        Object.values(vacationsData).reduce((sum, dept) => sum + dept[index], 0)
      );
    }

    if (selectedDepartment in vacationsData) {
      return vacationsData[selectedDepartment as keyof typeof vacationsData];
    }

    return Array(12).fill(0);
  };

  const departmentData = getDataForDepartment();

  const getColor = (count: number) => {
    const max = Math.max(...departmentData);
    const ratio = count / max;

    const r = Math.floor(13 + (53 - 13) * ratio);
    const g = Math.floor(255 + (180 - 255) * ratio);
    const b = Math.floor(38 + (228 - 38) * ratio);

    return `rgb(${r}, ${g}, ${b})`;
  };

  const getLoadLevel = (count: number) => {
    const max = Math.max(...departmentData);
    if (count === 0) return 'empty';
    if (count < max * 0.5) return 'low';
    return 'high';
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-bold mb-6">Загруженность отпусков по месяцам</h1>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-48">
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите отдел" />
              </SelectTrigger>
              <SelectContent>
                {departments.map(dept => (
                  <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-32">
            <Select value={selectedYear.toString()} onValueChange={(v) => setSelectedYear(parseInt(v))}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите год" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-52">
            <Select
              value={showLowLoad ? (showHighLoad ? "all" : "low") : (showHighLoad ? "high" : "none")}
              onValueChange={(value) => {
                setShowLowLoad(value === "all" || value === "low");
                setShowHighLoad(value === "all" || value === "high");
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Фильтр загруженности" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все уровни</SelectItem>
                <SelectItem value="low">Слабая загруженность</SelectItem>
                <SelectItem value="high">Только загруженность</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4 mb-8">
        {months.map((month, index) => {
          const count = departmentData[index];
          const loadLevel = getLoadLevel(count);

          if (
            (loadLevel === 'low' && !showLowLoad) ||
            (loadLevel === 'high' && !showHighLoad)
          ) return null;

          return (
            <div
              key={month}
              className="p-4 rounded-lg text-center shadow-sm"
              style={{ backgroundColor: getColor(count) }}
            >
              <h3 className="font-medium mb-2">{month}</h3>
              <p className="text-xl font-bold">{count}</p>
              <p className="text-sm mt-1">
                {loadLevel === 'low' && 'Слабая'}
                {loadLevel === 'high' && 'Высокая'}
              </p>
            </div>
          );
        })}
      </div>

      <div className="text-lg">
        Всего отпусков в {selectedYear} году: <span className="font-bold">{totalVacations}</span>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6" style={{ backgroundColor: '#0de126' }}></div>
          <span>Слабая загруженность</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6" style={{ backgroundColor: '#35b4e4' }}></div>
          <span>Высокая загруженность</span>
        </div>
      </div>
    </div>
  );
}