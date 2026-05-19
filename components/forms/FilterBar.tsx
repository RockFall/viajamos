"use client";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterBarProps {
  label: string;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
}

export function FilterBar({ label, options, value, onChange }: FilterBarProps) {
  return (
    <div className="mb-3">
      <p className="mb-1.5 text-xs font-medium text-muted">{label}</p>
      <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => onChange("")}
          className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition ${
            value === ""
              ? "bg-coral text-white"
              : "bg-zinc-100 text-zinc-600"
          }`}
        >
          Todos
        </button>
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition ${
              value === opt.value
                ? "bg-coral text-white"
                : "bg-zinc-100 text-zinc-600"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
