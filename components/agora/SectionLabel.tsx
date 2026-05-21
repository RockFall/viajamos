export function SectionLabel({
  left,
  right,
  tone,
}: {
  left: string;
  right?: string;
  tone?: "dark";
}) {
  const color =
    tone === "dark" ? "text-sand-200/60" : "text-muted-foreground";
  return (
    <div className="flex items-center justify-between px-1">
      <h3
        className={`text-[10px] font-bold uppercase tracking-[0.25em] ${color}`}
      >
        {left}
      </h3>
      {right ? (
        <span
          className={`inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] ${color}`}
        >
          <span className="size-1.5 rounded-full bg-emerald-500" />
          {right}
        </span>
      ) : null}
    </div>
  );
}
