import { cn } from "~/lib/utils";

export interface LifecycleStages {
  rendered: boolean;
  interactive: boolean;
  solved: boolean;
  expired: boolean;
}

interface Stage {
  key: keyof LifecycleStages;
  callback: string;
  label: string;
  optional?: boolean;
}

const STAGES: Stage[] = [
  { key: "rendered", callback: "onWidgetLoad", label: "rendered" },
  { key: "interactive", callback: "onBeforeInteractive", label: "interactive", optional: true },
  { key: "solved", callback: "onSuccess", label: "solved" },
  { key: "expired", callback: "onExpire", label: "expired" }
];

interface LifecycleRailProps {
  stages: LifecycleStages;
  hasError: boolean;
}

/**
 * The widget's real lifecycle, labeled with the library's callback names.
 * Reached stages fill in; the most recent one pulses.
 */
export function LifecycleRail({ stages, hasError }: LifecycleRailProps) {
  const reachedIndex = STAGES.reduce(
    (last, stage, index) => (stages[stage.key] ? index : last),
    -1
  );

  return (
    <div className="flex min-w-md items-start gap-6">
      <ol
        aria-label="Widget lifecycle"
        className="flex flex-1 items-start"
        data-testid="lifecycle-rail"
      >
        {STAGES.map((stage, index) => {
          const reached = stages[stage.key];
          const current = index === reachedIndex && !hasError;
          const skipped = stage.optional && !reached && stages.solved;

          return (
            <li key={stage.key} className={cn("flex items-start", { "flex-1": index > 0 })}>
              {index > 0 && (
                <div
                  aria-hidden
                  className={cn(
                    "mx-1 mt-[7px] h-px flex-1",
                    index <= reachedIndex ? "bg-cf-orange" : "bg-kumo-line"
                  )}
                />
              )}
              <div className="flex flex-col items-center gap-1.5">
                <span
                  aria-hidden
                  className={cn("mt-1 block size-3 rounded-full border-2", {
                    "border-cf-orange bg-cf-orange": reached,
                    "node-live": current,
                    "border-kumo-subtle bg-transparent": !reached,
                    "border-dashed opacity-60": skipped
                  })}
                />
                <span
                  className={cn(
                    "font-mono text-xs",
                    reached ? "text-kumo-strong" : "text-kumo-subtle",
                    skipped && "line-through opacity-60"
                  )}
                >
                  {stage.callback}
                </span>
                <span className="text-kumo-subtle text-xs">
                  {skipped ? "skipped" : stage.label}
                </span>
              </div>
            </li>
          );
        })}
      </ol>

      {hasError && (
        <span className="text-kumo-danger mt-1 flex shrink-0 items-center gap-1.5 font-mono text-xs">
          <span aria-hidden className="bg-kumo-danger size-1.5 rounded-full" />
          onError
        </span>
      )}
    </div>
  );
}
