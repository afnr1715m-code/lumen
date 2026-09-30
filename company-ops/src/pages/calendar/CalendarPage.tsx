import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { addDays, eachDayOfInterval, endOfWeek, startOfWeek } from "date-fns";
import type { CalendarEvent, PersonalTask, Task } from "@/types/domain";
import AppShell from "@/components/layout/AppShell";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import StatusBadge from "@/components/ui/StatusBadge";
import MonthCalendar, { type CalendarMarker } from "@/components/calendar/MonthCalendar";
import CalendarEventModal from "@/components/forms/CalendarEventModal";
import { useOpsStore } from "@/store/opsStore";
import { useAuthStore } from "@/store/authStore";
import { CALENDAR_EVENT_TYPE_LABEL, CALENDAR_EVENT_TYPE_TONE } from "@/lib/labels";
import { formatArabicDate, isoDate, todayISO } from "@/utils/date";

type Mode = "day" | "week" | "month";

export default function CalendarPage() {
  const calendarEvents = useOpsStore((s) => s.calendarEvents);
  const tasks = useOpsStore((s) => s.tasks);
  const personalTasks = useOpsStore((s) => s.personalTasks);
  const currentUser = useAuthStore((s) => s.currentUser);

  const [mode, setMode] = useState<Mode>("month");
  const [selectedDate, setSelectedDate] = useState<string>(todayISO());
  const [modalOpen, setModalOpen] = useState(false);

  const isEmployee = currentUser?.role === "employee";
  const isCustomerService = currentUser?.role === "customer_service";
  const visibleEvents = isEmployee ? calendarEvents.filter((e) => e.ownerId === currentUser?.id) : calendarEvents;
  // Customer service sees their own personal reminders instead of the shared
  // manager-assigned task list — those live on their own "المهام" page.
  const visibleTasks = isCustomerService
    ? []
    : isEmployee
      ? tasks.filter((t) => t.assigneeId === currentUser?.id)
      : tasks;
  const visiblePersonalTasks = isCustomerService ? personalTasks.filter((t) => t.employeeId === currentUser?.id) : [];

  const markers: CalendarMarker[] = useMemo(
    () => [
      ...visibleEvents.map((e) => ({ date: e.date, tone: CALENDAR_EVENT_TYPE_TONE[e.type], label: e.title })),
      ...visibleTasks.map((t) => ({ date: t.dueDate, tone: "info" as const, label: t.title })),
      ...visiblePersonalTasks.map((t) => ({ date: t.date, tone: "warning" as const, label: t.title })),
    ],
    [visibleEvents, visibleTasks, visiblePersonalTasks]
  );

  function eventsFor(date: string) {
    return visibleEvents.filter((e) => e.date === date);
  }
  function tasksFor(date: string) {
    return visibleTasks.filter((t) => t.dueDate === date);
  }
  function personalTasksFor(date: string) {
    return visiblePersonalTasks.filter((t) => t.date === date);
  }

  const weekDays = useMemo(() => {
    const start = startOfWeek(new Date(selectedDate), { weekStartsOn: 0 });
    const end = endOfWeek(new Date(selectedDate), { weekStartsOn: 0 });
    return eachDayOfInterval({ start, end }).map(isoDate);
  }, [selectedDate]);

  return (
    <AppShell title="التقويم">
      <Card>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex rounded-lg border border-line p-1">
            {(["day", "week", "month"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`rounded-md px-4 py-1.5 text-xs font-semibold ${mode === m ? "bg-accent text-white" : "text-muted"}`}
              >
                {m === "day" ? "يوم" : m === "week" ? "أسبوع" : "شهر"}
              </button>
            ))}
          </div>
          <Button onClick={() => setModalOpen(true)}>
            <Plus size={16} /> إضافة موعد
          </Button>
        </div>

        {mode === "month" && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <MonthCalendar markers={markers} onDayClick={setSelectedDate} selectedDate={selectedDate} />
            </div>
            <DayAgenda
              date={selectedDate}
              events={eventsFor(selectedDate)}
              tasks={tasksFor(selectedDate)}
              personalTasks={personalTasksFor(selectedDate)}
            />
          </div>
        )}

        {mode === "week" && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-7">
            {weekDays.map((date) => (
              <div key={date} className="rounded-xl border border-line p-3">
                <button onClick={() => setSelectedDate(date)} className="mb-2 text-xs font-bold text-ink hover:text-accent">
                  {formatArabicDate(date)}
                </button>
                <div className="space-y-1.5">
                  {eventsFor(date).map((e) => (
                    <div key={e.id} className="rounded-lg bg-bg px-2 py-1.5 text-xs text-ink">
                      {e.time} · {e.title}
                    </div>
                  ))}
                  {tasksFor(date).map((t) => (
                    <div key={t.id} className="rounded-lg bg-info-soft px-2 py-1.5 text-xs text-info">
                      {t.title}
                    </div>
                  ))}
                  {personalTasksFor(date).map((t) => (
                    <div key={t.id} className="rounded-lg bg-warning-soft px-2 py-1.5 text-xs text-warning">
                      {t.title}
                    </div>
                  ))}
                  {eventsFor(date).length === 0 && tasksFor(date).length === 0 && personalTasksFor(date).length === 0 && (
                    <p className="text-xs text-muted">لا يوجد</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {mode === "day" && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 flex items-center justify-center gap-4">
              <Button variant="ghost" onClick={() => setSelectedDate(isoDate(addDays(new Date(selectedDate), -1)))}>
                اليوم السابق
              </Button>
              <p className="text-sm font-bold text-ink">{formatArabicDate(selectedDate)}</p>
              <Button variant="ghost" onClick={() => setSelectedDate(isoDate(addDays(new Date(selectedDate), 1)))}>
                اليوم التالي
              </Button>
            </div>
            <DayAgenda
              date={selectedDate}
              events={eventsFor(selectedDate)}
              tasks={tasksFor(selectedDate)}
              personalTasks={personalTasksFor(selectedDate)}
            />
          </div>
        )}
      </Card>

      <CalendarEventModal open={modalOpen} onClose={() => setModalOpen(false)} defaultDate={selectedDate} />
    </AppShell>
  );
}

function DayAgenda({
  date,
  events,
  tasks,
  personalTasks = [],
}: {
  date: string;
  events: CalendarEvent[];
  tasks: Task[];
  personalTasks?: PersonalTask[];
}) {
  return (
    <div>
      <p className="mb-3 text-sm font-bold text-ink">{formatArabicDate(date)}</p>
      {events.length === 0 && tasks.length === 0 && personalTasks.length === 0 ? (
        <p className="text-sm text-muted">لا توجد مواعيد أو مهام في هذا اليوم</p>
      ) : (
        <ul className="space-y-2">
          {events.map((e) => (
            <li key={e.id} className="rounded-lg border border-line p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-ink">{e.title}</span>
                <StatusBadge label={CALENDAR_EVENT_TYPE_LABEL[e.type]} tone={CALENDAR_EVENT_TYPE_TONE[e.type]} />
              </div>
              <p className="mt-1 text-xs text-muted">{e.time}</p>
            </li>
          ))}
          {tasks.map((t) => (
            <li key={t.id} className="rounded-lg border border-line bg-info-soft/40 p-3">
              <span className="text-sm font-semibold text-ink">{t.title}</span>
              <p className="mt-1 text-xs text-muted">مهمة</p>
            </li>
          ))}
          {personalTasks.map((t) => (
            <li key={t.id} className="rounded-lg border border-line bg-warning-soft/40 p-3">
              <span className="text-sm font-semibold text-ink">{t.title}</span>
              <p className="mt-1 text-xs text-muted">مهمة شخصية{t.time ? ` · ${t.time}` : ""}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
