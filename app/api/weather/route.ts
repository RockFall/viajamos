import { NextResponse } from "next/server";
import {
  fetchWeatherForDate,
  getWeatherTodayISO,
  parseWeatherDate,
  type WeatherArea,
} from "@/lib/weather";

const AREAS = new Set<string>(["Miami", "Islamorada", "Travel"]);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawArea = searchParams.get("area") ?? "Miami";
  const area = (AREAS.has(rawArea) ? rawArea : "Miami") as WeatherArea;
  const date =
    parseWeatherDate(searchParams.get("date")) ?? getWeatherTodayISO();

  try {
    const payload = await fetchWeatherForDate(area, date);
    if (!payload) {
      return NextResponse.json(
        { error: "No weather data for this date" },
        { status: 404 }
      );
    }

    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch weather" },
      { status: 500 }
    );
  }
}
