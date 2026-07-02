import Image from "next/image";

import type { Project } from "@/lib/data";
import { cn } from "@/lib/utils";

const accentClasses: Record<Project["accent"], string> = {
  signal: "from-foreground/12 via-muted to-transparent text-foreground",
  ember: "from-foreground/10 via-muted to-transparent text-muted-foreground",
  coral: "from-foreground/8 via-muted to-transparent text-muted-foreground"
};

export interface ProjectVisualProps {
  project: Project;
}

export function ProjectVisual({ project }: ProjectVisualProps) {
  if (project.image) {
    return (
      <div
        className="relative aspect-[16/10] overflow-hidden rounded-md border bg-muted"
        aria-label={`${project.title} interface preview`}
      >
        <Image
          src={project.image.src}
          alt={project.image.alt}
          fill
          sizes="(min-width: 640px) 50vw, 100vw"
          className="object-cover object-top"
          priority={project.title === "SENSAI"}
        />
        <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/5 dark:ring-white/10" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative aspect-[16/10] overflow-hidden rounded-md border bg-gradient-to-br p-4",
        accentClasses[project.accent]
      )}
      aria-label={`${project.title} interface preview`}
    >
      <div className="absolute inset-0 terminal-grid opacity-35" />
      <div className="relative flex h-full flex-col justify-between rounded-md border bg-background/80 p-3 shadow-2xl backdrop-blur">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="size-2 rounded-full bg-coral" />
            <span className="size-2 rounded-full bg-ember" />
            <span className="size-2 rounded-full bg-signal" />
          </div>
          <span className="text-[10px] font-bold uppercase text-muted-foreground">{project.subtitle}</span>
        </div>
        <div className="grid grid-cols-[1.2fr_0.8fr] gap-3">
          <div className="space-y-2">
            <div className="h-3 w-2/3 rounded bg-current/60" />
            <div className="h-2 w-full rounded bg-current/25" />
            <div className="h-2 w-5/6 rounded bg-current/20" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded border bg-current/10 p-2">
              <div className="h-8 rounded bg-current/20" />
            </div>
            <div className="rounded border bg-current/10 p-2">
              <div className="h-8 rounded bg-current/30" />
            </div>
          </div>
        </div>
        <div className="flex items-end justify-between gap-3">
          <div className="space-y-1.5">
            <div className="h-2 w-20 rounded bg-current/30" />
            <div className="h-2 w-28 rounded bg-current/20" />
          </div>
          <div className="flex h-14 w-20 items-end gap-1">
            <span className="h-5 flex-1 rounded-sm bg-current/20" />
            <span className="h-9 flex-1 rounded-sm bg-current/35" />
            <span className="h-12 flex-1 rounded-sm bg-current/55" />
            <span className="h-7 flex-1 rounded-sm bg-current/30" />
          </div>
        </div>
      </div>
    </div>
  );
}
