import type { Flight } from "@/types";
import { Plane } from "lucide-react";

const statusLabels = {
  confirmed: "Confirmado",
  pending: "A confirmar",
  delayed: "Atrasado",
  boarding: "Embarcando",
};

export function BoardingPassCard({ flight }: { flight: Flight }) {
  return (
    <div className="boarding-pass relative rounded-2xl p-4 text-white shadow-lg">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-white/60">Passageiro</p>
          <p className="text-lg font-bold tracking-wide">{flight.passengerName}</p>
        </div>
        <Plane className="text-white/40" size={28} />
      </div>
      <div className="my-4 border-t border-dashed border-white/20" />
      <div className="flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold">{flight.from}</p>
          <p className="text-xs text-white/60">Origem</p>
        </div>
        <div className="flex flex-col items-center px-4">
          <div className="h-px w-16 bg-white/30" />
          <p className="my-1 text-xs text-teal">{flight.flightNumber}</p>
          <div className="h-px w-16 bg-white/30" />
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold">{flight.to}</p>
          <p className="text-xs text-white/60">Destino</p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
        <div>
          <p className="text-xs text-white/50">Assento</p>
          <p className="font-semibold">{flight.seat ?? "—"}</p>
        </div>
        <div>
          <p className="text-xs text-white/50">Terminal</p>
          <p className="font-semibold">{flight.terminal ?? "—"}</p>
        </div>
        <div>
          <p className="text-xs text-white/50">Portão</p>
          <p className="font-semibold">{flight.gate ?? "—"}</p>
        </div>
      </div>
      <div className="mt-3 flex justify-between text-sm">
        <div>
          <p className="text-xs text-white/50">Embarque</p>
          <p className="font-semibold">{flight.boardingTime ?? "—"}</p>
        </div>
        <div>
          <p className="text-xs text-white/50">Partida</p>
          <p className="font-semibold">{flight.departureTime}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-white/50">Status</p>
          <p className="font-semibold text-teal">{statusLabels[flight.status]}</p>
        </div>
      </div>
    </div>
  );
}
