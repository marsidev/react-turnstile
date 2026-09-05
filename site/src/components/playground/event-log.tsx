import { Button } from "@cloudflare/kumo/components/button";
import { cn } from "~/lib/utils";

export interface PlaygroundEvent {
  id: number;
  at: number;
  name: string;
  detail?: string;
  kind: "event" | "method" | "error";
}

interface EventLogProps {
  events: PlaygroundEvent[];
  onClear: () => void;
}

function formatTime(at: number) {
  const date = new Date(at);
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");
  const ms = String(date.getMilliseconds()).padStart(3, "0");
  return `${hh}:${mm}:${ss}.${ms}`;
}

/** Live, timestamped record of every callback and imperative call. Newest first. */
export function EventLog({ events, onClear }: EventLogProps) {
  return (
    <section aria-label="Event log" data-testid="event-log" role="log">
      <div className="flex items-center justify-between">
        <h2 className="text-kumo-strong text-lg font-semibold">Event log</h2>
        {events.length > 0 && (
          <Button size="sm" variant="ghost" onClick={onClear}>
            Clear
          </Button>
        )}
      </div>

      {events.length === 0 ? (
        <p className="text-kumo-subtle mt-2 text-sm">
          Every widget callback and method call lands here, newest first.
        </p>
      ) : (
        <ol className="divide-kumo-hairline mt-2 max-h-64 divide-y overflow-y-auto text-sm">
          {events.map(event => (
            <li key={event.id} className="flex items-baseline gap-3 py-1.5">
              <span className="text-kumo-subtle shrink-0 font-mono text-xs">
                {formatTime(event.at)}
              </span>
              <span className="flex shrink-0 items-baseline gap-1.5 font-mono text-xs">
                <span
                  aria-hidden
                  className={cn("size-1.5 self-center rounded-full", {
                    "bg-cf-orange": event.kind === "event",
                    "bg-kumo-info": event.kind === "method",
                    "bg-kumo-danger": event.kind === "error"
                  })}
                />
                <span className="text-kumo-strong">{event.name}</span>
              </span>
              {event.detail && <span className="text-kumo-subtle truncate">{event.detail}</span>}
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
