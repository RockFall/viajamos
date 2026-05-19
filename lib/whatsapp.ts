export function buildWhatsAppUrl(text: string): string {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

export function generateDayShareText(
  date: string,
  dayTitle: string,
  events: Array<{
    startTime?: string;
    title: string;
    locationName?: string;
    status: string;
  }>,
  pendingTasks: string[]
): string {
  const lines: string[] = [
    `🌴 *Roteiro — ${date.split("-").reverse().join("/")}*`,
    `_${dayTitle}_`,
    "",
  ];

  for (const evt of events) {
    const time = evt.startTime ? `${evt.startTime} — ` : "";
    const loc = evt.locationName ? ` (${evt.locationName})` : "";
    lines.push(`${time}${evt.title}${loc}`);
  }

  if (pendingTasks.length > 0) {
    lines.push("", "*Pendências:*");
    for (const task of pendingTasks) {
      lines.push(`- ${task}`);
    }
  }

  lines.push("", "— Miami Family Hub 🌴");
  return lines.join("\n");
}
