"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  TRIP_CONFIG,
  family,
  initialItineraryEvents,
  initialMemories,
  initialTasks,
  possiblePlans,
  tripDays,
} from "@/lib/data";
import { generateId } from "@/lib/itinerary";
import { supabase } from "@/lib/supabase/client";
import {
  deleteItineraryEvent,
  fetchMutableTripState,
  syncAllMutableState,
  updateMockToday,
  upsertChecklistItemState,
  upsertItineraryEvent,
  upsertMemory,
  upsertPossiblePlanStatus,
  upsertTripTask,
} from "@/lib/supabase/queries";
import type {
  FamilyMemberId,
  ItineraryEvent,
  Memory,
  PossiblePlanStatus,
  TripTask,
} from "@/types";

interface TripContextValue {
  today: string;
  setMockToday: (date: string) => void;
  itineraryEvents: ItineraryEvent[];
  addEvent: (event: Omit<ItineraryEvent, "id">) => void;
  updateEvent: (id: string, updates: Partial<ItineraryEvent>) => void;
  deleteEvent: (id: string) => void;
  tasks: TripTask[];
  toggleTask: (id: string) => void;
  checklistStates: Record<string, boolean>;
  toggleChecklistItem: (id: string) => void;
  possiblePlanStatuses: Record<string, PossiblePlanStatus>;
  setPossiblePlanStatus: (id: string, status: PossiblePlanStatus) => void;
  memories: Memory[];
  updateMemory: (id: string, updates: Partial<Memory>) => void;
  addMemory: (memory: Omit<Memory, "id">) => void;
  exportState: () => string;
  isHydrated: boolean;
  family: typeof family;
  tripDays: typeof tripDays;
  config: typeof TRIP_CONFIG;
}

const TripContext = createContext<TripContextValue | null>(null);

function buildDefaultPlanStatuses(): Record<string, PossiblePlanStatus> {
  return Object.fromEntries(possiblePlans.map((p) => [p.id, p.status]));
}

export function TripProvider({ children }: { children: ReactNode }) {
  const [itineraryEvents, setItineraryEvents] = useState<ItineraryEvent[]>(
    initialItineraryEvents
  );
  const [tasks, setTasks] = useState<TripTask[]>(initialTasks);
  const [checklistStates, setChecklistStates] = useState<
    Record<string, boolean>
  >({});
  const [possiblePlanStatuses, setPossiblePlanStatuses] = useState<
    Record<string, PossiblePlanStatus>
  >(buildDefaultPlanStatuses);
  const [memories, setMemories] = useState<Memory[]>(initialMemories);
  const [mockToday, setMockTodayState] = useState<string>(
    TRIP_CONFIG.mockToday
  );
  const [isHydrated, setIsHydrated] = useState(false);
  const loadedFromSupabase = useRef(false);

  useEffect(() => {
    let cancelled = false;

    async function loadFromSupabase() {
      if (!supabase) {
        setIsHydrated(true);
        return;
      }

      try {
        const remote = await fetchMutableTripState(supabase);
        if (cancelled) return;

        if (remote) {
          loadedFromSupabase.current = true;
          setItineraryEvents(remote.itineraryEvents);
          setTasks(remote.tasks);
          setChecklistStates(remote.checklistStates);
          setPossiblePlanStatuses({
            ...buildDefaultPlanStatuses(),
            ...remote.possiblePlanStatuses,
          });
          setMemories(remote.memories);
          setMockTodayState(remote.mockToday);
        }
      } catch (error) {
        console.warn("Failed to load trip state from Supabase:", error);
      } finally {
        if (!cancelled) setIsHydrated(true);
      }
    }

    loadFromSupabase();
    return () => {
      cancelled = true;
    };
  }, []);

  const setMockToday = useCallback((date: string) => {
    setMockTodayState(date);
    if (supabase) {
      void updateMockToday(supabase, date);
    }
  }, []);

  const addEvent = useCallback((event: Omit<ItineraryEvent, "id">) => {
    const newEvent = { ...event, id: generateId("evt") };
    setItineraryEvents((prev) => [...prev, newEvent]);
    if (supabase) void upsertItineraryEvent(supabase, newEvent);
  }, []);

  const updateEvent = useCallback(
    (id: string, updates: Partial<ItineraryEvent>) => {
      setItineraryEvents((prev) => {
        const next = prev.map((e) => (e.id === id ? { ...e, ...updates } : e));
        const updated = next.find((e) => e.id === id);
        if (updated && supabase) void upsertItineraryEvent(supabase, updated);
        return next;
      });
    },
    []
  );

  const deleteEvent = useCallback((id: string) => {
    setItineraryEvents((prev) => prev.filter((e) => e.id !== id));
    if (supabase) void deleteItineraryEvent(supabase, id);
  }, []);

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) => {
      const next = prev.map((t) =>
        t.id === id
          ? { ...t, status: t.status === "open" ? "done" : "open" }
          : t
      ) as TripTask[];
      const updated = next.find((t) => t.id === id);
      if (updated && supabase) void upsertTripTask(supabase, updated);
      return next;
    });
  }, []);

  const toggleChecklistItem = useCallback((id: string) => {
    setChecklistStates((prev) => {
      const checked = !prev[id];
      const next = { ...prev, [id]: checked };
      if (supabase) void upsertChecklistItemState(supabase, id, checked);
      return next;
    });
  }, []);

  const setPossiblePlanStatus = useCallback(
    (id: string, status: PossiblePlanStatus) => {
      setPossiblePlanStatuses((prev) => ({ ...prev, [id]: status }));
      if (supabase) void upsertPossiblePlanStatus(supabase, id, status);
    },
    []
  );

  const updateMemory = useCallback((id: string, updates: Partial<Memory>) => {
    setMemories((prev) => {
      const next = prev.map((m) => (m.id === id ? { ...m, ...updates } : m));
      const updated = next.find((m) => m.id === id);
      if (updated && supabase) void upsertMemory(supabase, updated);
      return next;
    });
  }, []);

  const addMemory = useCallback((memory: Omit<Memory, "id">) => {
    const newMemory = { ...memory, id: generateId("mem") };
    setMemories((prev) => [...prev, newMemory]);
    if (supabase) void upsertMemory(supabase, newMemory);
  }, []);

  const exportState = useCallback(() => {
    return JSON.stringify(
      {
        itineraryEvents,
        tasks,
        checklistStates,
        possiblePlanStatuses,
        memories,
        mockToday,
        exportedAt: new Date().toISOString(),
      },
      null,
      2
    );
  }, [
    itineraryEvents,
    tasks,
    checklistStates,
    possiblePlanStatuses,
    memories,
    mockToday,
  ]);

  // Seed Supabase on first interaction if DB was empty but app has local defaults
  useEffect(() => {
    if (!isHydrated || !supabase || loadedFromSupabase.current) return;

    void syncAllMutableState(supabase, {
      itineraryEvents,
      tasks,
      checklistStates,
      possiblePlanStatuses,
      memories,
      mockToday,
    });
  }, [isHydrated]); // eslint-disable-line react-hooks/exhaustive-deps

  const value = useMemo<TripContextValue>(
    () => ({
      today: mockToday,
      setMockToday,
      itineraryEvents,
      addEvent,
      updateEvent,
      deleteEvent,
      tasks,
      toggleTask,
      checklistStates,
      toggleChecklistItem,
      possiblePlanStatuses,
      setPossiblePlanStatus,
      memories,
      updateMemory,
      addMemory,
      exportState,
      isHydrated,
      family,
      tripDays,
      config: TRIP_CONFIG,
    }),
    [
      mockToday,
      setMockToday,
      itineraryEvents,
      addEvent,
      updateEvent,
      deleteEvent,
      tasks,
      toggleTask,
      checklistStates,
      toggleChecklistItem,
      possiblePlanStatuses,
      setPossiblePlanStatus,
      memories,
      updateMemory,
      addMemory,
      exportState,
      isHydrated,
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
