"use client";

import * as React from "react";

import { CountUp } from "@/components/magic/count-up";
import type { ContributionData, ContributionDay, ContributionLevel } from "@/lib/github";

const LEVEL_VAR: Record<ContributionLevel, string> = {
  0: "var(--gh-0)",
  1: "var(--gh-1)",
  2: "var(--gh-2)",
  3: "var(--gh-3)",
  4: "var(--gh-4)"
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatDate(iso: string) {
  const date = new Date(`${iso}T00:00:00`);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

interface Tip {
  text: string;
  left: number;
  top: number;
}

interface GitHubActivityProps {
  data: ContributionData;
}

function buildMonthLabels(weeks: ContributionData["weeks"]) {
  const labels: Array<string | null> = [];
  let previousMonth = -1;
  let lastLabeledIndex = -Infinity;

  for (const [index, week] of weeks.entries()) {
    const first = week.days[0];

    if (!first) {
      labels.push(null);
      continue;
    }

    const month = new Date(`${first.date}T00:00:00`).getMonth();

    if (month === previousMonth) {
      labels.push(null);
      continue;
    }

    previousMonth = month;

    if (index === 0 || index - lastLabeledIndex < 3) {
      labels.push(null);
      continue;
    }

    lastLabeledIndex = index;
    labels.push(MONTHS[month]);
  }

  return labels;
}

export function GitHubActivity({ data }: GitHubActivityProps) {
  const gridRef = React.useRef<HTMLDivElement>(null);
  const [tip, setTip] = React.useState<Tip | null>(null);

  // A month label sits above the first full week of each month. The leading
  // partial week (index 0) is skipped so it doesn't collide with the next
  // month, and a minimum column gap prevents adjacent labels overlapping.
  const monthLabels = React.useMemo(() => {
    return buildMonthLabels(data.weeks);
  }, [data.weeks]);

  const showTip = (event: React.MouseEvent<HTMLDivElement>, day: ContributionDay) => {
    const cell = event.currentTarget;
    const container = gridRef.current;
    if (!container) return;
    setTip({
      text: `${day.count} contribution${day.count === 1 ? "" : "s"} on ${formatDate(day.date)}`,
      left: cell.offsetLeft + cell.offsetWidth / 2,
      top: cell.offsetTop
    });
  };

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        Open Source
      </p>
      <h2 className="mt-2 font-serif text-3xl font-semibold">GitHub Activity</h2>

      <div className="mt-6 rounded-xl border bg-card/75 p-4 sm:p-5">
        <div className="mb-4 flex items-baseline justify-between gap-3">
          <span className="text-sm font-medium">Contributions</span>
          <a
            href={`https://github.com/${data.username}`}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            @{data.username}
          </a>
        </div>

        <div ref={gridRef} className="relative" onMouseLeave={() => setTip(null)}>
          {/* Month labels aligned to the flexible week columns below */}
          <div className="mb-1 flex w-full gap-[2px] sm:gap-[3px]">
            {monthLabels.map((label, index) => (
              <div key={index} className="min-w-0 flex-1 text-[10px] text-muted-foreground">
                {label ? <span className="whitespace-nowrap">{label}</span> : null}
              </div>
            ))}
          </div>

          {/* One flexible column per week; cells are square and fill the available width */}
          <div className="flex w-full gap-[2px] sm:gap-[3px]">
            {data.weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex min-w-0 flex-1 flex-col gap-[2px] sm:gap-[3px]">
                {week.days.map((day) => (
                  <div
                    key={day.date}
                    className="gh-cell aspect-square w-full rounded-[2px] transition-[filter] hover:brightness-125"
                    style={{
                      backgroundColor: LEVEL_VAR[day.level],
                      animationDelay: `${weekIndex * 12}ms`
                    }}
                    onMouseEnter={(event) => showTip(event, day)}
                  />
                ))}
              </div>
            ))}
          </div>

          {tip ? (
            <div
              className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md border bg-popover px-2 py-1 text-xs font-medium text-popover-foreground shadow-md"
              style={{ left: tip.left, top: tip.top - 6 }}
            >
              {tip.text}
            </div>
          ) : null}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            <CountUp to={data.total} className="font-semibold text-foreground" /> contributions in the
            last year
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <span>Less</span>
            {([0, 1, 2, 3, 4] as ContributionLevel[]).map((level) => (
              <span
                key={level}
                className="size-[11px] rounded-[2px]"
                style={{ backgroundColor: LEVEL_VAR[level] }}
              />
            ))}
            <span>More</span>
          </div>
        </div>
      </div>
    </div>
  );
}
