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
  deleteAgreement,
  deleteChecklist,
  deleteDayAlternative,
  deleteEssentialPlace,
  deleteFamilyMember,
  deleteItineraryEvent,
  deleteMemory,
  deleteNightEvent,
  deletePossiblePlan,
  deleteTravelDocument,
  deleteTripDay,
  deleteTripTask,
  fetchFullTripData,
  upsertAgreement,
  upsertChecklistItemState,
  upsertDayAlternative,
  upsertEssentialPlace,
  upsertFamilyMember,
  upsertItineraryEvent,
  upsertMemory,
  upsertNightEvent,
  upsertPossiblePlan,
  upsertPossiblePlanStatus,
  upsertTravelDocument,
  upsertTripConfig,
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
  saveChecklist: (checklist: Checklist) => void;
  deleteChecklist: (id: string) => void;
  saveFamilyMember: (member: FamilyMember) => void;
  deleteFamilyMember: (id: string) => void;
  saveTripConfig: (config: TripConfig) => void;
  saveTripDay: (day: TripDay) => void;
  deleteTripDay: (id: string) => void;
  savePossiblePlan: (plan: PossiblePlan) => void;
  deletePossiblePlan: (id: string) => void;
  saveNightEvent: (event: NightEvent) => void;
  deleteNightEvent: (id: string) => void;
  saveDayAlternative: (alt: DayAlternativePlan) => void;
  deleteDayAlternative: (id: string) => void;
  saveEssentialPlace: (place: EssentialPlace) => void;
  deleteEssentialPlace: (id: string) => void;
  saveTravelDocument: (doc: TravelDocument) => void;
  deleteTravelDocument: (id: string) => void;
  saveTask: (task: TripTask) => void;
  deleteTask: (id: string) => void;
  saveAgreement: (agreement: Agreement) => void;
  deleteAgreement: (id: string) => void;
  saveMemory: (memory: Memory) => void;
  deleteMemory: (id: string) => void;
  saveEvent: (event: ItineraryEvent) => void;
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

  const saveChecklist = useCallback((checklist: Checklist) => {
    setTripData((prev) => {
      const exists = prev.checklists.some((c) => c.id === checklist.id);
      const checklists = exists
        ? prev.checklists.map((c) => (c.id === checklist.id ? checklist : c))
        : [...prev.checklists, checklist];
      void upsertChecklist(supabase, checklist);
      return { ...prev, checklists };
    });
  }, []);

  const removeChecklist = useCallback((id: string) => {
    setTripData((prev) => ({
      ...prev,
      checklists: prev.checklists.filter((c) => c.id !== id),
    }));
    void deleteChecklist(supabase, id);
  }, []);

  const saveFamilyMember = useCallback((member: FamilyMember) => {
    setTripData((prev) => {
      const exists = prev.family.some((m) => m.id === member.id);
      const family = exists
        ? prev.family.map((m) => (m.id === member.id ? member : m))
        : [...prev.family, member];
      void upsertFamilyMember(supabase, member);
      return { ...prev, family };
    });
  }, []);

  const removeFamilyMember = useCallback((id: string) => {
    setTripData((prev) => ({
      ...prev,
      family: prev.family.filter((m) => m.id !== id),
    }));
    void deleteFamilyMember(supabase, id);
  }, []);

  const saveTripConfig = useCallback((config: TripConfig) => {
    setTripData((prev) => {
      void upsertTripConfig(supabase, config);
      return { ...prev, config };
    });
  }, []);

  const saveTripDay = useCallback((day: TripDay) => {
    setTripData((prev) => {
      const exists = prev.tripDays.some((d) => d.id === day.id);
      const tripDays = exists
        ? prev.tripDays.map((d) => (d.id === day.id ? day : d))
        : [...prev.tripDays, day];
      void upsertTripDay(supabase, day);
      return { ...prev, tripDays };
    });
  }, []);

  const removeTripDay = useCallback((id: string) => {
    setTripData((prev) => ({
      ...prev,
      tripDays: prev.tripDays.filter((d) => d.id !== id),
    }));
    void deleteTripDay(supabase, id);
  }, []);

  const savePossiblePlan = useCallback((plan: PossiblePlan) => {
    setTripData((prev) => {
      const exists = prev.possiblePlans.some((p) => p.id === plan.id);
      const possiblePlans = exists
        ? prev.possiblePlans.map((p) => (p.id === plan.id ? plan : p))
        : [...prev.possiblePlans, plan];
      void upsertPossiblePlan(supabase, plan);
      return { ...prev, possiblePlans };
    });
  }, []);

  const removePossiblePlan = useCallback((id: string) => {
    setTripData((prev) => ({
      ...prev,
      possiblePlans: prev.possiblePlans.filter((p) => p.id !== id),
    }));
    void deletePossiblePlan(supabase, id);
  }, []);

  const saveNightEvent = useCallback((event: NightEvent) => {
    setTripData((prev) => {
      const exists = prev.nightEvents.some((e) => e.id === event.id);
      const nightEvents = exists
        ? prev.nightEvents.map((e) => (e.id === event.id ? event : e))
        : [...prev.nightEvents, event];
      void upsertNightEvent(supabase, event);
      return { ...prev, nightEvents };
    });
  }, []);

  const removeNightEvent = useCallback((id: string) => {
    setTripData((prev) => ({
      ...prev,
      nightEvents: prev.nightEvents.filter((e) => e.id !== id),
    }));
    void deleteNightEvent(supabase, id);
  }, []);

  const saveDayAlternative = useCallback((alt: DayAlternativePlan) => {
    setTripData((prev) => {
      const exists = prev.dayAlternatives.some((a) => a.id === alt.id);
      const dayAlternatives = exists
        ? prev.dayAlternatives.map((a) => (a.id === alt.id ? alt : a))
        : [...prev.dayAlternatives, alt];
      void upsertDayAlternative(supabase, alt);
      return { ...prev, dayAlternatives };
    });
  }, []);

  const removeDayAlternative = useCallback((id: string) => {
    setTripData((prev) => ({
      ...prev,
      dayAlternatives: prev.dayAlternatives.filter((a) => a.id !== id),
    }));
    void deleteDayAlternative(supabase, id);
  }, []);

  const saveEssentialPlace = useCallback((place: EssentialPlace) => {
    setTripData((prev) => {
      const exists = prev.essentialPlaces.some((p) => p.id === place.id);
      const essentialPlaces = exists
        ? prev.essentialPlaces.map((p) =>
            p.id === place.id ? place : p
          )
        : [...prev.essentialPlaces, place];
      void upsertEssentialPlace(supabase, place);
      return { ...prev, essentialPlaces };
    });
  }, []);

  const removeEssentialPlace = useCallback((id: string) => {
    setTripData((prev) => ({
      ...prev,
      essentialPlaces: prev.essentialPlaces.filter((p) => p.id !== id),
    }));
    void deleteEssentialPlace(supabase, id);
  }, []);

  const saveTravelDocument = useCallback((doc: TravelDocument) => {
    setTripData((prev) => {
      const exists = prev.travelDocuments.some((d) => d.id === doc.id);
      const travelDocuments = exists
        ? prev.travelDocuments.map((d) => (d.id === doc.id ? doc : d))
        : [...prev.travelDocuments, doc];
      void upsertTravelDocument(supabase, doc);
      return { ...prev, travelDocuments };
    });
  }, []);

  const removeTravelDocument = useCallback((id: string) => {
    setTripData((prev) => ({
      ...prev,
      travelDocuments: prev.travelDocuments.filter((d) => d.id !== id),
    }));
    void deleteTravelDocument(supabase, id);
  }, []);

  const saveTask = useCallback((task: TripTask) => {
    setTripData((prev) => {
      const exists = prev.tasks.some((t) => t.id === task.id);
      const tasks = exists
        ? prev.tasks.map((t) => (t.id === task.id ? task : t))
        : [...prev.tasks, task];
      void upsertTripTask(supabase, task);
      return { ...prev, tasks };
    });
  }, []);

  const removeTask = useCallback((id: string) => {
    setTripData((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== id),
    }));
    void deleteTripTask(supabase, id);
  }, []);

  const saveAgreement = useCallback((agreement: Agreement) => {
    setTripData((prev) => {
      const exists = prev.agreements.some((a) => a.id === agreement.id);
      const agreements = exists
        ? prev.agreements.map((a) =>
            a.id === agreement.id ? agreement : a
          )
        : [...prev.agreements, agreement];
      void upsertAgreement(supabase, agreement);
      return { ...prev, agreements };
    });
  }, []);

  const removeAgreement = useCallback((id: string) => {
    setTripData((prev) => ({
      ...prev,
      agreements: prev.agreements.filter((a) => a.id !== id),
    }));
    void deleteAgreement(supabase, id);
  }, []);

  const saveMemory = useCallback((memory: Memory) => {
    setTripData((prev) => {
      const exists = prev.memories.some((m) => m.id === memory.id);
      const memories = exists
        ? prev.memories.map((m) => (m.id === memory.id ? memory : m))
        : [...prev.memories, memory];
      void upsertMemory(supabase, memory);
      return { ...prev, memories };
    });
  }, []);

  const removeMemory = useCallback((id: string) => {
    setTripData((prev) => ({
      ...prev,
      memories: prev.memories.filter((m) => m.id !== id),
    }));
    void deleteMemory(supabase, id);
  }, []);

  const saveEvent = useCallback((event: ItineraryEvent) => {
    setTripData((prev) => {
      const exists = prev.itineraryEvents.some((e) => e.id === event.id);
      const itineraryEvents = exists
        ? prev.itineraryEvents.map((e) => (e.id === event.id ? event : e))
        : [...prev.itineraryEvents, event];
      void upsertItineraryEvent(supabase, event);
      return { ...prev, itineraryEvents };
    });
  }, []);

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
      saveChecklist,
      deleteChecklist: removeChecklist,
      saveFamilyMember,
      deleteFamilyMember: removeFamilyMember,
      saveTripConfig,
      saveTripDay,
      deleteTripDay: removeTripDay,
      savePossiblePlan,
      deletePossiblePlan: removePossiblePlan,
      saveNightEvent,
      deleteNightEvent: removeNightEvent,
      saveDayAlternative,
      deleteDayAlternative: removeDayAlternative,
      saveEssentialPlace,
      deleteEssentialPlace: removeEssentialPlace,
      saveTravelDocument,
      deleteTravelDocument: removeTravelDocument,
      saveTask,
      deleteTask: removeTask,
      saveAgreement,
      deleteAgreement: removeAgreement,
      saveMemory,
      deleteMemory: removeMemory,
      saveEvent,
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
      saveChecklist,
      removeChecklist,
      saveFamilyMember,
      removeFamilyMember,
      saveTripConfig,
      saveTripDay,
      removeTripDay,
      savePossiblePlan,
      removePossiblePlan,
      saveNightEvent,
      removeNightEvent,
      saveDayAlternative,
      removeDayAlternative,
      saveEssentialPlace,
      removeEssentialPlace,
      saveTravelDocument,
      removeTravelDocument,
      saveTask,
      removeTask,
      saveAgreement,
      removeAgreement,
      saveMemory,
      removeMemory,
      saveEvent,
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
