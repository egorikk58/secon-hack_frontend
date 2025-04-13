import { Loader2 } from "lucide-react";

export function LoadingScreen() {
  return (
    <div className="flex flex-col justify-center items-center h-screen gap-4">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold font-arkhip">Загрузка...</h1>
        <p className="text-muted-foreground">Определяем вашу роль в системе</p>
      </div>
    </div>
  );
}