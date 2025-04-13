import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { DateRange } from "react-day-picker";
import { CalendarService } from "@/services";

interface DateRangePayload {
  ranges: Array<{
    startDate: string;
    endDate: string;
  }>;
}

const CONFLICT_DATA = [
  {
    name: "Артем Свечников",
    position: "Старший менеджер проектов",
    start: new Date(2025, 6, 1),
    end: new Date(2025, 6, 14)
  },
  {
    name: "Шепард Бабауэр",
    position: "Ведущий металлург",
    start: new Date(2025, 7, 10),
    end: new Date(2025, 7, 24)
  },
  {
    name: "Алексей Иванов",
    position: "Главный дизайнер",
    start: new Date(2025, 8, 5),
    end: new Date(2025, 8, 19)
  }
];

export function DateRangePicker() {
  const [ranges, setRanges] = useState<DateRange[]>([{}]);
  const [maxDays, setMaxDays] = useState<number>(28);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeRangeIndex, setActiveRangeIndex] = useState(0);
  const [conflicts, setConflicts] = useState<typeof CONFLICT_DATA>([]);

  useEffect(() => {
    const fetchMaxDays = async () => {
      try {
        const days = await CalendarService.getMaxDays();
        setMaxDays(days);
      } catch (err) {
        console.error("Failed to load max days:", err);
        setError("Failed to load day limit");
      }
    };

    fetchMaxDays();
  }, []);

  const checkConflicts = (currentRange: DateRange) => {
    if (!currentRange.from || !currentRange.to) return [];

    return CONFLICT_DATA.filter(conflict => {
      const conflictStart = conflict.start;
      const conflictEnd = conflict.end;
      const selectedStart = currentRange.from;
      const selectedEnd = currentRange.to;

      return (
        (selectedStart <= conflictEnd && selectedEnd >= conflictStart) ||
        (conflictStart <= selectedEnd && conflictEnd >= selectedStart)
      );
    });
  };

  useEffect(() => {
    const newConflicts = ranges.flatMap(range =>
      range.from && range.to ? checkConflicts(range) : []
    );
    const uniqueConflicts = newConflicts.filter(
      (conflict, index, self) =>
        index === self.findIndex(c =>
          c.name === conflict.name &&
          c.start.getTime() === conflict.start.getTime()
        )
    );
    setConflicts(uniqueConflicts);
  }, [ranges]);

  const calculateDaysInRange = (range: DateRange) => {
    if (!range.from || !range.to) return 0;
    return Math.ceil((range.to.getTime() - range.from.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  };

  const totalDays = ranges.reduce((sum, range) => sum + calculateDaysInRange(range), 0);

  const hasAtLeastOneLongRange = ranges.some(range => {
    const days = calculateDaysInRange(range);
    return days >= 14;
  });

  const handleRangeChange = (range: DateRange | undefined) => {
    const newRanges = [...ranges];
    newRanges[activeRangeIndex] = range || {};
    setRanges(newRanges);
    setError(null);
  };

  const addNewRange = () => {
    if (!ranges[activeRangeIndex]?.from || !ranges[activeRangeIndex]?.to) {
      setError("Please complete current range first");
      return;
    }
    setRanges([...ranges, {}]);
    setActiveRangeIndex(ranges.length);
  };

  const removeRange = (index: number) => {
    if (ranges.length <= 1) return;
    const newRanges = ranges.filter((_, i) => i !== index);
    setRanges(newRanges);
    setActiveRangeIndex(Math.min(activeRangeIndex, newRanges.length - 1));
  };

  const validateRanges = () => {
    const incompleteRanges = ranges.some(range => !range.from || !range.to);
    if (incompleteRanges) {
      setError("Please complete all date ranges");
      return false;
    }

    if (!hasAtLeastOneLongRange) {
      setError("At least one range must be 14 days or longer");
      return false;
    }

    if (totalDays > maxDays) {
      setError(`Total days (${totalDays}) exceeds maximum (${maxDays})`);
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateRanges()) return;

    setIsLoading(true);
    setError(null);

    try {
      const payload: DateRangePayload = {
        ranges: ranges.map(range => ({
          startDate: range.from!.toISOString(),
          endDate: range.to!.toISOString(),
        }))
      };

      await CalendarService.submitDateRanges(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 w-fit relative ">
      <div className="flex justify-between items-start mb-2">
        <div className="mb-4">
          <h3 className="text-lg font-medium">Выберите даты отпуска</h3>
          <p className="text-sm text-gray-500 mt-1">
            Накопленные дни отпуска: {maxDays}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Одна из частей отпуска должна быть больше 14 дней
          </p>
        </div>

        {/* Блок с предупреждениями о конфликтах теперь внутри основного блока справа */}
        {conflicts.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 ml-4 w-64">
            <h4 className="font-medium text-red-800 text-sm">⚠️ Ваш отпуск имеет пересечения с сотрудниками:</h4>
            {conflicts.map((conflict, index) => (
              <div key={index} className="text-xs text-red-700">
                <p className="font-medium">{conflict.name}</p>
                <p className="text-gray-600">{conflict.position}</p>
                <p>
                  {conflict.start.toLocaleDateString()} – {conflict.end.toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 mb-4">
        <div className="space-y-2">
          <div className="rounded-md border border-gray-200 bg-white">
            <Calendar
              mode="range"
              selected={ranges[activeRangeIndex]}
              onSelect={handleRangeChange}
              numberOfMonths={3}
              className="p-2"
            />
          </div>

          <div className="space-y-2 mt-4">
            {ranges.map((range, index) => {
              const days = calculateDaysInRange(range);
              const isLongRange = days >= 14;

              return (
                <div
                  key={index}
                  className={`p-2 rounded cursor-pointer ${activeRangeIndex === index ? 'bg-blue-50' : 'bg-gray-50'
                    } ${isLongRange && range.from && range.to ? 'border-l-4 border-green-500' : ''}`}
                  onClick={() => setActiveRangeIndex(index)}
                >
                  <div className="flex justify-between">
                    <span>
                      Диапазон {index + 1}: {range.from?.toLocaleDateString() || 'Not set'} -
                      {range.to?.toLocaleDateString() || 'Not set'}
                      {range.from && range.to && (
                        <span className={`ml-2 ${isLongRange ? 'text-green-600' : 'text-gray-500'}`}>
                          ({days} дней {isLongRange ? ' ✓' : ''})
                        </span>
                      )}
                    </span>
                    {ranges.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeRange(index);
                        }}
                        className="text-red-500 text-sm"
                      >
                        Удалить
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <Button
            variant="outline"
            onClick={addNewRange}
            className="mt-2"
            disabled={!ranges[activeRangeIndex]?.from || !ranges[activeRangeIndex]?.to}
          >
            + Добавить новый промежуток
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
        <div className="flex flex-col">
          <p className="text-sm font-medium">
            Всего дней: {totalDays} / {maxDays}
          </p>
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>

        <Button
          onClick={handleSubmit}
          disabled={isLoading || !hasAtLeastOneLongRange || ranges.some(r => !r.from || !r.to) || totalDays > maxDays}
          className="bg-green-600 hover:bg-green-700"
        >
          {isLoading ? "Submitting..." : "Подтвердить"}
        </Button>
      </div>
    </div>
  );
}