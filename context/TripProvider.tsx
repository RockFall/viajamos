"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { FALLBACK_TRIP_DATA } from "@/lib/data";
import { getTodayISO } from "@/lib/dates";
import { generateId } from "@/lib/itinerary";
import { supabase } from "@/lib/supabase/client";
import {
  deleteItineraryEvent,
  fetchFullTripData,
  upsertChecklistItemState,
  upsertItineraryEvent,
  upsertMemory,
  upsertPossiblePlanStatus,
  upsertTripTask,
  upsertFlight,
  deleteFlight,
  upsertTravelTimelineItem,
  deleteTravelTimelineItem,
  upsertTripDay,
  upsertChecklist,
  type FullTripData,
} from "@/lib/supabase/queries";
import type {
  Agreement,
  Checklist,
  DayAlternativePlan,
  EssentialPlace,
  FamilyMember,
  FamilyMemberId,
  Flight,
  ItineraryEvent,
  Memory,
  NightEvent,
  PossiblePlan,
  PossiblePlanStatus,
  TravelDocument,
  TravelTimelineItem,
  TripConfig,
  TripDay,
  TripTask,
} from "@/types";

interface TripContextValue extends FullTripData {
  today: string;
  realToday: string;
  isDateSimulated: boolean;
  setMockToday: (date: string) => void;
  resetToday: () => void;
  addEvent: (event: Omit<ItineraryEvent, "id">) => void;
  updateEvent: (id: string, updates: Partial<ItineraryEvent>) => void;
  deleteEvent: (id: string) => void;
  toggleTask: (id: string) => void;
  toggleChecklistItem: (id: string) => void;
  setPossiblePlanStatus: (id: string, status: PossiblePlanStatus) => void;
  updateMemory: (id: string, updates: Partial<Memory>) => void;
  addMemory: (memory: Omit<Memory, "id">) => void;
  updateTripDay: (id: string, updates: Partial<TripDay>) => void;
  saveFlight: (flight: Flight) => void;
  saveFlightsBulk: (flights: Flight[]) => void;
  deleteFlight: (id: string) => void;
  ensureFlightsForDate: (date: string) => void;
  saveTravelTimelineItem: (item: TravelTimelineItem) => void;
  deleteTravelTimelineItem: (id: string) => void;
  updateChecklist: (
    id: string,
    updates: Partial<Pick<Checklist, "title" | "items">>
  ) => void;
  getFamilyMember: (id: FamilyMemberId) => FamilyMember | undefined;
  exportState: () => string;
  isHydrated: boolean;
  dataSource: "supabase" | "fallback";
}

const TripContext = createContext<TripContextValue | null>(null);

function applyTripData(data: FullTripData): FullTripData {
  return { ...data };
}

export function TripProvider({ children }: { children: ReactNode }) {
  const [tripData, setTripData] = useState<FullTripData>(FALLBACK_TRIP_DATA);
  const [dataSource, setDataSource] = useState<"supabase" | "fallback">(
    "fallback"
  );
  const [dateOverride, setDateOverride] = useState<string | null>(null);
  const realToday = getTodayISO();
  const today = dateOverride ?? realToday;
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const remote = await fetchFullTripData(supabase);
        if (cancelled) return;

        if (remote) {
          const merged: FullTripData = {
            ...remote,
            flights:
              remote.flights.length > 0
                ? remote.flights
                : FALLBACK_TRIP_DATA.flights,
            travelTimeline:
              remote.travelTimeline.length > 0
                ? remote.travelTimeline
                : FALLBACK_TRIP_DATA.travelTimeline,
            checklists:
              remote.checklists.length > 0
                ? remote.checklists
                : FALLBACK_TRIP_DATA.checklists,
          };
          setTripData(applyTripData(merged));
          setDataSource("supabase");
        } else {
          console.warn(
            "Supabase sem dados ou erro de leitura — usando fallback local."
          );
          setTripData(FALLBACK_TRIP_DATA);
          setDataSource("fallback");
        }
      } catch (error) {
        console.warn("Failed to load from Supabase:", error);
        if (!cancelled) {
          setTripData(FALLBACK_TRIP_DATA);
          setDataSource("fallback");
        }
      } finally {
        if (!cancelled) setIsHydrated(true);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const setMockToday = useCallback((date: string) => {
    setDateOverride(date);
  }, []);

  const resetToday = useCallback(() => {
    setDateOverride(null);
  }, []);

  const getFamilyMember = useCallback(
    (id: FamilyMemberId) => tripData.family.find((m) => m.id === id),
    [tripData.family]
  );

  const addEvent = useCallback((event: Omit<ItineraryEvent, "id">) => {
    const newEvent = { ...event, id: generateId("evt") };
    setTripData((prev) => ({
      ...prev,
      itineraryEvents: [...prev.itineraryEvents, newEvent],
    }));
    void upsertItineraryEvent(supabase, newEvent);
  }, []);

  const updateEvent = useCallback(
    (id: string, updates: Partial<ItineraryEvent>) => {
      setTripData((prev) => {
        const itineraryEvents = prev.itineraryEvents.map((e) =>
          e.id === id ? { ...e, ...updates } : e
        );
        const updated = itineraryEvents.find((e) => e.id === id);
        if (updated) void upsertItineraryEvent(supabase, updated);
        return { ...prev, itineraryEvents };
      });
    },
    []
  );

  const deleteEvent = useCallback((id: string) => {
    setTripData((prev) => ({
      ...prev,
      itineraryEvents: prev.itineraryEvents.filter((e) => e.id !== id),
    }));
    void deleteItineraryEvent(supabase, id);
  }, []);

  const toggleTask = useCallback((id: string) => {
    setTripData((prev) => {
      const tasks = prev.tasks.map((t) =>
        t.id === id
          ? { ...t, status: t.status === "open" ? "done" : "open" }
          : t
      ) as TripTask[];
      const updated = tasks.find((t) => t.id === id);
      if (updated) void upsertTripTask(supabase, updated);
      return { ...prev, tasks };
    });
  }, []);

  const toggleChecklistItem = useCallback((id: string) => {
    setTripData((prev) => {
      const checked = !prev.checklistStates[id];
      const checklistStates = { ...prev.checklistStates, [id]: checked };
      void upsertChecklistItemState(supabase, id, checked);
      return { ...prev, checklistStates };
    });
  }, []);

  const setPossiblePlanStatus = useCallback(
    (id: string, status: PossiblePlanStatus) => {
      setTripData((prev) => ({
        ...prev,
        possiblePlans: prev.possiblePlans.map((p) =>
          p.id === id ? { ...p, status } : p
        ),
      }));
      void upsertPossiblePlanStatus(supabase, id, status);
    },
    []
  );

  const updateMemory = useCallback((id: string, updates: Partial<Memory>) => {
    setTripData((prev) => {
      const memories = prev.memories.map((m) =>
        m.id === id ? { ...m, ...updates } : m
      );
      const updated = memories.find((m) => m.id === id);
      if (updated) void upsertMemory(supabase, updated);
      return { ...prev, memories };
    });
  }, []);

  const addMemory = useCallback((memory: Omit<Memory, "id">) => {
    const newMemory = { ...memory, id: generateId("mem") };
    setTripData((prev) => ({
      ...prev,
      memories: [...prev.memories, newMemory],
    }));
    void upsertMemory(supabase, newMemory);
  }, []);

  const updateTripDay = useCallback((id: string, updates: Partial<TripDay>) => {
    setTripData((prev) => {
      const tripDays = prev.tripDays.map((d) =>
        d.id === id ? { ...d, ...updates } : d
      );
      const updated = tripDays.find((d) => d.id === id);
      if (updated) void upsertTripDay(supabase, updated);
      return { ...prev, tripDays };
    });
  }, []);

  const saveFlight = useCallback((flight: Flight) => {
    setTripData((prev) => {
      const exists = prev.flights.some((f) => f.id === flight.id);
      const flights = exists
        ? prev.flights.map((f) => (f.id === flight.id ? flight : f))
        : [...prev.flights, flight];
      void upsertFlight(supabase, flight);
      return { ...prev, flights };
    });
  }, []);

  const saveFlightsBulk = useCallback((flightsToSave: Flight[]) => {
    setTripData((prev) => {
      const byId = new Map(prev.flights.map((f) => [f.id, f]));
      for (const f of flightsToSave) byId.set(f.id, f);
      const flights = Array.from(byId.values());
      for (const f of flightsToSave) void upsertFlight(supabase, f);
      return { ...prev, flights };
    });
  }, []);

  const removeFlight = useCallback((id: string) => {
    setTripData((prev) => ({
      ...prev,
      flights: prev.flights.filter((f) => f.id !== id),
    }));
    void deleteFlight(supabase, id);
  }, []);

  const ensureFlightsForDate = useCallback((date: string) => {
    setTripData((prev) => {
      const day = prev.tripDays.find((d) => d.date === date);
      const isReturn = day?.isReturnDay;
      const drafts: Flight[] = prev.family.map((member) => ({
        id: `flt-${member.id}-${isReturn ? "ret" : "out"}`,
        passengerId: member.id,
        passengerName: member.name.toUpperCase(),
        route: isReturn ? "Miami → Belo Horizonte" : "Belo Horizonte → Miami",
        from: isReturn ? "MIA" : "BHZ/CNF",
        to: isReturn ? "BHZ/CNF" : "MIA",
        flightNumber: "A definir",
        departureTime: "A definir",
        date,
        status: "pending" as const,
      }));
      const byId = new Map(prev.flights.map((f) => [f.id, f]));
      for (const f of drafts) {
        byId.set(f.id, f);
        void upsertFlight(supabase, f);
      }
      return { ...prev, flights: Array.from(byId.values()) };
    });
  }, []);

  const saveTravelTimelineItem = useCallback((item: TravelTimelineItem) => {
    setTripData((prev) => {
      const exists = prev.travelTimeline.some((t) => t.id === item.id);
      const travelTimeline = exists
        ? prev.travelTimeline.map((t) => (t.id === item.id ? item : t))
        : [...prev.travelTimeline, item];
      void upsertTravelTimelineItem(supabase, item);
      return { ...prev, travelTimeline };
    });
  }, []);

  const removeTravelTimelineItem = useCallback((id: string) => {
    setTripData((prev) => ({
      ...prev,
      travelTimeline: prev.travelTimeline.filter((t) => t.id !== id),
    }));
    void deleteTravelTimelineItem(supabase, id);
  }, []);

  const updateChecklist = useCallback(
    (id: string, updates: Partial<Pick<Checklist, "title" | "items">>) => {
      setTripData((prev) => {
        const checklists = prev.checklists.map((c) =>
          c.id === id ? { ...c, ...updates } : c
        );
        const updated = checklists.find((c) => c.id === id);
        if (updated) void upsertChecklist(supabase, updated);
        return { ...prev, checklists };
      });
    },
    []
  );

  const exportState = useCallback(() => {
    return JSON.stringify(
      { ...tripData, today, dateOverride, dataSource, exportedAt: new Date().toISOString() },
      null,
      2
    );
  }, [tripData, today, dateOverride, dataSource]);

  const value = useMemo<TripContextValue>(
    () => ({
      ...tripData,
      today,
      realToday,
      isDateSimulated: dateOverride !== null,
      setMockToday,
      resetToday,
      addEvent,
      updateEvent,
      deleteEvent,
      toggleTask,
      toggleChecklistItem,
      setPossiblePlanStatus,
      updateMemory,
      addMemory,
      updateTripDay,
      saveFlight,
      saveFlightsBulk,
      deleteFlight: removeFlight,
      ensureFlightsForDate,
      saveTravelTimelineItem,
      deleteTravelTimelineItem: removeTravelTimelineItem,
      updateChecklist,
      getFamilyMember,
      exportState,
      isHydrated,
      dataSource,
    }),
    [
      tripData,
      today,
      realToday,
      dateOverride,
      setMockToday,
      resetToday,
      addEvent,
      updateEvent,
      deleteEvent,
      toggleTask,
      toggleChecklistItem,
      setPossiblePlanStatus,
      updateMemory,
      addMemory,
      updateTripDay,
      saveFlight,
      saveFlightsBulk,
      removeFlight,
      ensureFlightsForDate,
      saveTravelTimelineItem,
      removeTravelTimelineItem,
      updateChecklist,
      getFamilyMember,
      exportState,
      isHydrated,
      dataSource,
    ]
  );

  return (
    <TripContext.Provider value={value}>{children}</TripContext.Provider>
  );
}

export function useTrip(): TripContextValue {
  const ctx = useContext(TripContext);
  if (!ctx) throw new Error("useTrip must be used within TripProvider");
  return ctx;
}

export type { FamilyMemberId };
