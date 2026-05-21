"use client";

import { useTrip } from "@/context/TripProvider";
import { inputClass, labelClass, selectClass, textareaClass } from "@/lib/settings/form-ui";
import type { FieldDef } from "@/lib/settings/table-registry";

function getNested(obj: Record<string, unknown>, key: string): unknown {
  return obj[key];
}

function setNested(
  obj: Record<string, unknown>,
  key: string,
  value: unknown
): Record<string, unknown> {
  return { ...obj, [key]: value };
}

export function DynamicRecordForm({
  fields,
  draft,
  onChange,
  readOnly,
}: {
  fields: FieldDef[];
  draft: Record<string, unknown>;
  onChange: (draft: Record<string, unknown>) => void;
  readOnly?: boolean;
}) {
  const { tripDays, possiblePlans, family } = useTrip();

  const update = (key: string, value: unknown) => {
    onChange(setNested(draft, key, value));
  };

  return (
    <div className="space-y-3">
      {fields.map((field) => {
        const raw = getNested(draft, field.key);
        const id = `field-${field.key}`;

        if (field.type === "daySelect") {
          return (
            <div key={field.key}>
              <label htmlFor={id} className={labelClass}>
                {field.label}
              </label>
              <select
                id={id}
                disabled={readOnly}
                value={String(raw ?? "")}
                onChange={(e) => {
                  const day = tripDays.find((d) => d.id === e.target.value);
                  onChange(
                    setNested(
                      setNested(draft, "dayId", e.target.value),
                      "date",
                      day?.date ?? draft.date
                    )
                  );
                }}
                className={selectClass}
              >
                <option value="">Selecione…</option>
                {tripDays.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.date.slice(8, 10)}/{d.date.slice(5, 7)} — {d.title}
                  </option>
                ))}
              </select>
            </div>
          );
        }

        if (field.type === "planIdsMulti") {
          const ids = Array.isArray(raw) ? (raw as string[]) : [];
          return (
            <div key={field.key}>
              <span className={labelClass}>{field.label}</span>
              <div className="mt-2 max-h-40 space-y-1 overflow-y-auto rounded-xl border border-border p-2">
                {possiblePlans.map((p) => (
                  <label
                    key={p.id}
                    className="flex cursor-pointer items-center gap-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      disabled={readOnly}
                      checked={ids.includes(p.id)}
                      onChange={(e) => {
                        const next = e.target.checked
                          ? [...ids, p.id]
                          : ids.filter((x) => x !== p.id);
                        update(field.key, next);
                      }}
                      className="accent-terracotta"
                    />
                    <span className="truncate">{p.title}</span>
                  </label>
                ))}
              </div>
            </div>
          );
        }

        if (field.type === "familyMulti") {
          const ids = Array.isArray(raw) ? (raw as string[]) : [];
          return (
            <div key={field.key}>
              <span className={labelClass}>{field.label}</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {family.map((m) => (
                  <label
                    key={m.id}
                    className="flex cursor-pointer items-center gap-1 rounded-full border border-border px-3 py-1 text-sm"
                  >
                    <input
                      type="checkbox"
                      disabled={readOnly}
                      checked={ids.includes(m.id)}
                      onChange={(e) => {
                        const next = e.target.checked
                          ? [...ids, m.id]
                          : ids.filter((x) => x !== m.id);
                        update(field.key, next);
                      }}
                      className="accent-terracotta"
                    />
                    {m.shortName}
                  </label>
                ))}
              </div>
            </div>
          );
        }

        if (field.type === "boolean") {
          return (
            <label
              key={field.key}
              className="flex cursor-pointer items-center gap-2 text-sm"
            >
              <input
                type="checkbox"
                disabled={readOnly}
                checked={Boolean(raw)}
                onChange={(e) => update(field.key, e.target.checked)}
                className="h-5 w-5 accent-terracotta"
              />
              {field.label}
            </label>
          );
        }

        if (field.type === "enum" && field.options) {
          return (
            <div key={field.key}>
              <label htmlFor={id} className={labelClass}>
                {field.label}
              </label>
              <select
                id={id}
                disabled={readOnly}
                value={String(raw ?? "")}
                onChange={(e) =>
                  update(field.key, e.target.value || undefined)
                }
                className={selectClass}
              >
                <option value="">—</option>
                {Object.entries(field.options).map(([val, lab]) => (
                  <option key={val} value={val}>
                    {lab}
                  </option>
                ))}
              </select>
            </div>
          );
        }

        if (field.type === "textarea") {
          return (
            <div key={field.key}>
              <label htmlFor={id} className={labelClass}>
                {field.label}
              </label>
              <textarea
                id={id}
                disabled={readOnly}
                value={String(raw ?? "")}
                onChange={(e) => update(field.key, e.target.value)}
                placeholder={field.placeholder}
                className={textareaClass}
              />
            </div>
          );
        }

        if (field.type === "stringArray") {
          return (
            <div key={field.key}>
              <label htmlFor={id} className={labelClass}>
                {field.label} (vírgulas)
              </label>
              <input
                id={id}
                disabled={readOnly}
                value={Array.isArray(raw) ? (raw as string[]).join(", ") : ""}
                onChange={(e) =>
                  update(
                    field.key,
                    e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean)
                  )
                }
                className={inputClass}
              />
            </div>
          );
        }

        const inputType =
          field.type === "number"
            ? "number"
            : field.type === "date"
              ? "date"
              : field.type === "time"
                ? "time"
                : "text";

        return (
          <div key={field.key}>
            <label htmlFor={id} className={labelClass}>
              {field.label}
            </label>
            <input
              id={id}
              type={inputType}
              disabled={readOnly || field.key === "id"}
              value={
                raw === undefined || raw === null
                  ? ""
                  : field.type === "number"
                    ? Number(raw)
                    : String(raw)
              }
              onChange={(e) => {
                const v =
                  field.type === "number"
                    ? e.target.value === ""
                      ? undefined
                      : Number(e.target.value)
                    : e.target.value;
                update(field.key, v);
              }}
              placeholder={field.placeholder}
              className={inputClass}
            />
          </div>
        );
      })}
    </div>
  );
}
