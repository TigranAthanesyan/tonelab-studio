/**
 * Time helpers for ToneLab Studio.
 *
 * All events are venue-local times in Yerevan, Armenia (GMT+4, no DST).
 * Storage: ISO strings with the +04:00 offset, so the underlying instant is
 * unambiguous regardless of where the admin or visitor is located.
 */

export const VENUE_TIMEZONE = "Asia/Yerevan";
export const VENUE_UTC_OFFSET = "+04:00";

/**
 * Convert a value from a `<input type="datetime-local">` (e.g. "2026-05-29T19:00")
 * into a full ISO string anchored to Yerevan time (GMT+4).
 */
export function yerevanLocalInputToISO(localValue: string): string {
  if (!localValue) return localValue;
  // datetime-local may omit seconds; normalize to "YYYY-MM-DDTHH:mm:ss"
  const withSeconds = localValue.length === 16 ? `${localValue}:00` : localValue;
  return new Date(`${withSeconds}${VENUE_UTC_OFFSET}`).toISOString();
}

/**
 * Convert a stored ISO date into the "YYYY-MM-DDTHH:mm" string expected by
 * `<input type="datetime-local">`, rendered as Yerevan local time.
 */
export function isoToYerevanLocalInput(iso: string): string {
  if (!iso) return "";
  const date = new Date(iso);
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: VENUE_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "00";
  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}`;
}

/** Allowed minute options for event times. */
export const EVENT_MINUTE_OPTIONS = ["00", "15", "30", "45"] as const;

/**
 * Split a "YYYY-MM-DDTHH:mm" string into separate date / hour / minute parts.
 * Returns empty strings when input is missing.
 */
export function splitLocalInput(value: string): { date: string; hour: string; minute: string } {
  if (!value) return { date: "", hour: "", minute: "" };
  const [datePart, timePart = ""] = value.split("T");
  const [hour = "", minute = ""] = timePart.split(":");
  return { date: datePart, hour, minute };
}

/**
 * Combine date / hour / minute into a "YYYY-MM-DDTHH:mm" string suitable for
 * `yerevanLocalInputToISO`. Returns "" if any part is missing.
 */
export function joinLocalInput(date: string, hour: string, minute: string): string {
  if (!date || hour === "" || minute === "") return "";
  return `${date}T${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`;
}

