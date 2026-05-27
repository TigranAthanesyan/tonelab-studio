"use client";

import { EVENT_MINUTE_OPTIONS, splitLocalInput, joinLocalInput } from "@/lib/time";
import styles from "./EventDateTimePicker.module.css";

interface Props {
  /** Value in "YYYY-MM-DDTHH:mm" format (Yerevan local). */
  value: string;
  onChange: (value: string) => void;
  /** Optional className applied to each underlying control (date input + selects). */
  controlClassName?: string;
  required?: boolean;
  id?: string;
}

const HOUR_OPTIONS = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"));

export default function EventDateTimePicker({
  value,
  onChange,
  controlClassName,
  required,
  id,
}: Props) {
  const { date, hour, minute } = splitLocalInput(value);

  const emit = (next: { date?: string; hour?: string; minute?: string }) => {
    onChange(
      joinLocalInput(
        next.date ?? date,
        next.hour ?? hour ?? "20",
        next.minute ?? minute ?? "00"
      )
    );
  };

  return (
    <div className={styles.row}>
      <input
        type="date"
        id={id}
        value={date}
        onChange={(e) => emit({ date: e.target.value })}
        className={`${styles.date} ${controlClassName ?? ""}`}
        required={required}
      />
      <select
        aria-label="Hour"
        value={hour}
        onChange={(e) => emit({ hour: e.target.value })}
        className={`${styles.select} ${controlClassName ?? ""}`}
        required={required}
      >
        <option value="" disabled>HH</option>
        {HOUR_OPTIONS.map((h) => (
          <option key={h} value={h}>{h}</option>
        ))}
      </select>
      <span className={styles.colon}>:</span>
      <select
        aria-label="Minute"
        value={minute}
        onChange={(e) => emit({ minute: e.target.value })}
        className={`${styles.select} ${controlClassName ?? ""}`}
        required={required}
      >
        <option value="" disabled>MM</option>
        {EVENT_MINUTE_OPTIONS.map((m) => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>
    </div>
  );
}
