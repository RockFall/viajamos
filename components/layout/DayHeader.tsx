import { formatDayHeader } from "@/lib/dates";
import { MapPin, Sun } from "lucide-react";

interface DayHeaderProps {
  date: string;
  theme: string;
  weather?: string;
  baseName?: string;
  baseAddress?: string;
}

export function DayHeader({
  date,
  theme,
  weather,
  baseName,
  baseAddress,
}: DayHeaderProps) {
  return (
    <header className="gradient-sunset -mx-4 mb-6 rounded-b-3xl px-4 pb-6 pt-4">
      <p className="text-sm font-medium text-sunset-pink">Miami Family Hub</p>
      <h1 className="mt-1 text-2xl font-bold capitalize text-ocean">
        {formatDayHeader(date)}
      </h1>
      <p className="mt-1 text-base text-ocean/80">{theme}</p>
      <div className="mt-3 flex flex-wrap gap-3 text-sm text-muted">
        {weather && (
          <span className="flex items-center gap-1">
            <Sun size={14} className="text-sunset" />
            {weather}
          </span>
        )}
        {baseAddress && (
          <span className="flex items-center gap-1">
            <MapPin size={14} className="text-teal" />
            {baseName ? `${baseName}: ${baseAddress}` : baseAddress}
          </span>
        )}
      </div>
    </header>
  );
}
