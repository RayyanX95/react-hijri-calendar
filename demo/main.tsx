import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { Calendar } from "../src/Calendar/Calendar";
import type { AvailableDateInfo } from "../src/Calendar/types";

const today = new Date();
const mockAvailableDates: AvailableDateInfo[] = Array.from(
  { length: 31 },
  (_, i) => {
    const date = new Date(today.getFullYear(), today.getMonth(), i + 1);
    return {
      date: date.toISOString().slice(0, 10).replace(/-/g, ""),
      dateStatus: i % 5 === 0 ? "Unavailable" : "Available",
      leaveStatement: i % 5 === 0 ? "On leave" : "",
    };
  }
);

function DemoApp() {
  const [selectedDate, setSelectedDate] = useState<string | Date | null>(null);
  const [lang, setLang] = useState<"en" | "ar">("en");

  const toggleLanguage = () => {
    const currentLang = document.documentElement.lang;
    document.documentElement.lang = currentLang === "en" ? "ar" : "en";
    document.documentElement.dir = currentLang === "en" ? "rtl" : "ltr";

    setLang(currentLang === "en" ? "ar" : "en");
  };
  return (
    <div style={{ maxWidth: 1200, margin: "2rem auto", padding: "0 1rem" }}>
      <button onClick={toggleLanguage}>Toggle Language</button>
      <h2>Calendar Demo</h2>
      <Calendar
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        availableDatesInfo={mockAvailableDates}
        lang={lang}
        primaryColor="#ff6600"
        unavailableColor="#999999"
      />
      <div style={{ marginTop: 16 }}>
        <b>Selected Date:</b> {selectedDate ? String(selectedDate) : "None"}
      </div>
    </div>
  );
}

const root = createRoot(document.getElementById("root")!);
root.render(<DemoApp />);
