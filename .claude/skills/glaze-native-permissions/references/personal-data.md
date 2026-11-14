# Calendar, Reminders, and Contacts

These APIs are backend-only. Expose only feature-specific DTOs through narrow IPC handlers:

```ts
import { calendar, contacts, reminders, PersonalDataError, systemPreferences } from "@glaze/core/backend";
```

Never copy an entire native contact or unbounded event/reminder set into renderer state. Bound queries, paginate, project only needed contact fields, and fetch photos separately.

## Consent

Reads do not prompt. Check status first, request from explicit user action only, and handle typed `PersonalDataError.code` values:

```ts
const status = await calendar.status();
if (status === "not-determined") {
  await calendar.requestAccess("full");
} else if (status === "denied" || status === "restricted") {
  await systemPreferences.openPrivacySettings("calendar");
}
```

Reminders have separate `status()` and `requestAccess()`; calendar permission does not grant reminder access.

## Calendar and events

Calendar API includes source/calendar CRUD, default calendar, event CRUD, and `calendar.on("changed", ...)`. The changed event is invalidation only; re-fetch.

Event fields include all-day and zoned times, structured locations, notes, URLs, availability/status, alarms, recurrence, organizer, and attendees. Organizer and attendees are read-only.

Event reads/mutations use opaque `EventRef` values: never parse them. Every mutation result is authoritative, so replace the old ref. Recurring mutations require explicit `span: "this-event" | "future-events"`.

`location` aliases `structuredLocation.title`. If both are provided, structured location wins; clearing either clears both aliases.

Bound event reads:

```ts
const { events, truncated } = await calendar.getEvents({
  start: new Date().toISOString(),
  end: new Date(Date.now() + 7 * 86_400_000).toISOString(),
  limit: 100,
});
```

Queries return events whose spans overlap the interval, so a multi-day event may begin before `start`. Preserve true times and clamp/group only in UI. Bounds are RFC 3339 instants; queries are capped at four years and 1,000 events.

Event date-times use local wall time plus an IANA zone, or `null` for floating time:

```ts
await calendar.createEvent({
  title: "Design review",
  start: { kind: "date-time", dateTime: "2026-07-22T10:00:00", timeZone: "Europe/London" },
  end: { kind: "date-time", dateTime: "2026-07-22T10:30:00", timeZone: "Europe/London" },
});
```

Under write-only access, omit `calendarId`; macOS selects the default destination and the returned `reference` is `null`. Full access is required to read, update, or delete events/calendars. Some sources still forbid app-created calendars.

Use `clearFields` to distinguish clearing from no change; never patch and clear the same field:

```ts
const updated = await calendar.updateEvent(
  event.ref,
  { location: "Board room", clearFields: ["alarms"] },
  { span: "this-event" },
);

await calendar.deleteEvent(event.ref, { span: "future-events" });
```

Confirm immediately before destructive or broad recurring operations.

## Reminders

Reminders include source/calendar CRUD, reminder CRUD, bounded completion/due-date filters, and a changed invalidation event:

```ts
if ((await reminders.status()) === "not-determined") {
  await reminders.requestAccess();
}
const page = await reminders.getReminders({ completed: false, limit: 200 });
```

Keep each mutation's returned ref. EventKit exposes only the first incomplete occurrence of a recurring reminder. Completing it advances the series, so `updateReminder` returns the next incomplete occurrence. Use a non-recurring reminder when exact completed-item/date verification is required.

## Contacts

Contacts support `search`, paginated `list`, `get`, `getMe`, CRUD, on-demand `getPhoto`, containers, group CRUD/membership, and bounded vCard import/export. The changed event is invalidation only.

Always pass a field projection:

```ts
const matches = await contacts.search({
  query: "Ada",
  by: ["name", "email", "phone"],
  fields: ["name", "emails", "phones", "imageMetadata"],
  limit: 50,
});
```

Multi-field search has union semantics and deduplicates unified contacts by identifier. List cursors are opaque and invalid after the store changes. Use `imageMetadata` to decide whether to call `getPhoto`; never include image bytes in ordinary results.

Contact notes are unavailable because Apple requires a separate entitlement. vCard export is bounded and does not transfer photos.
