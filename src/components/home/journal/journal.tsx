import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";

interface VacationRequest {
  id: string;
  employeeName: string;
  position: string;
  department: string;
  startDate: string;
  endDate: string;
  status: "pending" | "approved" | "rejected";
}

export function VacationRequestsJournal() {
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [isDepartmentPopoverOpen, setIsDepartmentPopoverOpen] = useState(false);

  const allRequests: VacationRequest[] = [
    {
      id: "1",
      employeeName: "Петрова М.К",
      position: "Frontend разработчик",
      department: "IT",
      startDate: "2023-08-01",
      endDate: "2023-08-14",
      status: "pending"
    },
    {
      id: "2",
      employeeName: "Петрова М.К",
      position: "HR менеджер",
      department: "HR",
      startDate: "2023-08-10",
      endDate: "2023-08-24",
      status: "pending"
    },
    {
      id: "3",
      employeeName: "Петрова М.К",
      position: "Backend разработчик",
      department: "IT",
      startDate: "2023-09-05",
      endDate: "2023-09-19",
      status: "pending"
    },
    {
        id: "4",
        employeeName: "Петрова М.К",
        position: "Backend разработчик",
        department: "IT",
        startDate: "2023-09-05",
        endDate: "2023-09-19",
        status: "pending"
      },
    {
      id: "5",
      employeeName: "Петрова М.К",
      position: "Backend разработчик",
      department: "IT",
      startDate: "2023-09-05",
      endDate: "2023-09-19",
      status: "pending"
    },  
  ];

  const departments = Array.from(new Set(allRequests.map(r => r.department)));
  const filteredRequests = selectedDepartment 
    ? allRequests.filter(r => r.department === selectedDepartment) 
    : allRequests;

  const handleApprove = (id: string) => {
    console.log(`Заявка ${id} утверждена`);
  };

  const handleReject = (id: string) => {
    console.log(`Заявка ${id} отклонена`);
  };

  return (
    <div className="p-6 w-full">
      {/* Заголовок и фильтр */}
      <div className="flex flex-col items-start gap-4 mb-4 w-full">
      <h1 className="text-2xl font-bold text-center bg-white w-[1280px] h-[103px] font-arkhip font-[32px] flex items-center rounded-2xl pl-[20px]">
        Утверждение заявок
      </h1>
        
        <Popover open={isDepartmentPopoverOpen} onOpenChange={setIsDepartmentPopoverOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
            >
              {selectedDepartment || "Выбрать отделы"}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2" align="start">
            <div className="space-y-1">
              <Button
                variant="ghost"
                className={`w-full justify-start ${!selectedDepartment ? "bg-gray-100" : ""}`}
                onClick={() => {
                  setSelectedDepartment(null);
                  setIsDepartmentPopoverOpen(false);
                }}
              >
                Все отделы
              </Button>
              {departments.map(dept => (
                <Button
                  key={dept}
                  variant="ghost"
                  className={`w-full justify-start ${selectedDepartment === dept ? "bg-gray-100" : ""}`}
                  onClick={() => {
                    setSelectedDepartment(dept);
                    setIsDepartmentPopoverOpen(false);
                  }}
                >
                  {dept}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Список заявок */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 w-full justify-items-start">
        {filteredRequests.map(request => (
          <div key={request.id}   className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 w-full max-w-[400px]
           hover:shadow-[0_0_0_1px_#35B2E6,0_0_0_2px_#0AFB2D] transition-colors duration-300">
            <div className="space-y-3">
              <div>
                <h3 className="font-medium text-left">{request.employeeName}</h3>
                <p className="text-sm text-gray-600 text-left">{request.position}</p>
                <p className="text-sm text-gray-500 text-left">{request.department}</p>
              </div>
              
              <div className="space-y-2">
  <div className="flex items-center gap-2 w-full">
    <span className="whitespace-nowrap w-16">Начало:</span>
    <span className="flex-1 bg-white rounded-md border border-gray-200 px-3 py-1.5 text-sm text-center">
      {new Date(request.startDate).toLocaleDateString()}
    </span>
  </div>
  <div className="flex items-center gap-2 w-full">
    <span className="whitespace-nowrap w-16">Конец:</span>
    <span className="flex-1 bg-white rounded-md border border-gray-200 px-3 py-1.5 text-sm text-center">
      {new Date(request.endDate).toLocaleDateString()}
    </span>
  </div>
</div>
              
              <div className="flex gap-2 pt-2 justify-between">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-red-600 border-red-300 hover:bg-red-50"
                  onClick={() => handleReject(request.id)}
                >
                  Отклонить
                </Button>
                <Button 
                  size="sm"
                  className="bg-gradient-to-r from-[#35B2E6] to-[#0AFB2D] hover:opacity-[70%]"
                  onClick={() => handleApprove(request.id)}
                >
                  Утвердить
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredRequests.length === 0 && (
        <div className="text-gray-500 mt-4 text-left w-full">
          Нет заявок на отпуск для отображения
        </div>
      )}
    </div>
  );
}